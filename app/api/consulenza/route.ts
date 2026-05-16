import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { citta, cap, problema } = await req.json();

  if (!citta || !problema) {
    return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Chiave API non configurata' }, { status: 500 });
  }

  const prompt = `Sei un assistente giuridico italiano esperto. Un utente ti descrive il suo problema legale.

Città: ${citta}
CAP: ${cap || 'non specificato'}
Problema: ${problema}

Rispondi SOLO con un oggetto JSON valido (nessun testo prima o dopo) con questa struttura:
{
  "materia": "nome della branca di diritto (es. Diritto del lavoro, Diritto di famiglia, Diritto penale, Diritto civile, Diritto condominiale, Diritto tributario, Diritto amministrativo, Diritto societario, etc.)",
  "specializzazione": "specializzazione precisa dell'avvocato da cercare (es. avvocato divorzista, avvocato penalista, avvocato giuslavorista, etc.)",
  "analisi": "2-3 frasi che spiegano il problema giuridico in modo chiaro e quale tipo di tutela è possibile ottenere",
  "urgenza": "alta | media | bassa",
  "consigli": ["consiglio 1 su cosa fare subito", "consiglio 2", "consiglio 3"],
  "testo_mail": "Gentile Avvocato,\\n\\nmi chiamo [NOME] e la contatto in merito a un problema di [materia].\\n\\n[descrizione del problema in 3-4 righe professionali basata su quanto scritto dall'utente]\\n\\nSarei grato/a di poter fissare un appuntamento per una consulenza iniziale.\\n\\nRimango in attesa di un Suo cortese riscontro.\\n\\nCordiali saluti,\\n[NOME]\\n[TELEFONO]",
  "query_google": "query ottimizzata per trovare avvocati su Google (es. avvocato penalista Milano centro recensioni)",
  "query_cnf": "specializzazione da cercare sull'albo CNF"
}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1200,
        temperature: 0.3,
        messages: [
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq error:', err);
      return NextResponse.json({ error: 'Errore nella chiamata AI' }, { status: 500 });
    }

    const data = await response.json();
    const testo = data.choices?.[0]?.message?.content ?? '';

    const clean = testo.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Parse error:', err);
    return NextResponse.json({ error: 'Errore nell\'elaborazione della risposta' }, { status: 500 });
  }
}