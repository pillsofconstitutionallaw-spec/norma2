import { NextRequest, NextResponse } from 'next/server';

async function groqGenerate(prompt: string, apiKey: string, maxTokens = 4096): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: maxTokens,
    }),
  });

  const data = await response.json();
  console.log('Groq response:', JSON.stringify(data).substring(0, 300));
  return data.choices?.[0]?.message?.content || '';
}

// Calcola numero di card in base alla lunghezza del testo
function calcolaNumeroCard(lunghezzaTesto: number): number {
  if (lunghezzaTesto < 2000) return 8;
  if (lunghezzaTesto < 5000) return 12;
  if (lunghezzaTesto < 8000) return 18;
  if (lunghezzaTesto < 12000) return 25;
  if (lunghezzaTesto < 20000) return 35;
  return 50;
}

function calcolaNumeroTest(lunghezzaTesto: number): number {
  if (lunghezzaTesto < 2000) return 5;
  if (lunghezzaTesto < 5000) return 8;
  if (lunghezzaTesto < 8000) return 10;
  if (lunghezzaTesto < 12000) return 15;
  return 20;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, testo } = body;

    const apiKey = process.env.GROQ_API_KEY_PDF;
    if (!apiKey) {
      return NextResponse.json({ errore: 'API KEY GROQ PDF NON TROVATA' }, { status: 500 });
    }

    // Limita il testo a 10.000 caratteri per stare nei limiti TPM
    const testoLimitato = testo.substring(0, 10000);
    const nCard = calcolaNumeroCard(testoLimitato.length);
    const nTest = calcolaNumeroTest(testoLimitato.length);

    if (tipo === 'flashcard') {
      const prompt = `Sei un docente universitario di giurisprudenza italiano.
Documento di studio fornito:
${testoLimitato}

Crea esattamente ${nCard} flash card basate SOLO su questo documento.
Regole: no markdown, no backtick, risposte max 3 righe, copri tutti gli argomenti in modo uniforme.
Rispondi SOLO con JSON valido:
[{"domanda":"...","risposta":"..."}]`;

      const raw = (await groqGenerate(prompt, apiKey, 4096)).replace(/```json|```/g, '').trim();

      try {
        const carte = JSON.parse(raw);
        if (!Array.isArray(carte)) throw new Error('not array');
        return NextResponse.json({ carte });
      } catch {
        return NextResponse.json({ errore: 'Errore nella generazione delle flash card. Riprova.' }, { status: 500 });
      }
    }

    if (tipo === 'test') {
      const prompt = `Sei un docente universitario di giurisprudenza italiano.
Documento di studio fornito:
${testoLimitato}

Crea esattamente ${nTest} domande a risposta multipla basate SOLO su questo documento.
Regole: no markdown, 4 opzioni per domanda, una sola corretta, opzioni plausibili.
Rispondi SOLO con JSON valido:
[{"domanda":"...","opzioni":["A) ...","B) ...","C) ...","D) ..."],"corretta":0}]`;

      const raw = (await groqGenerate(prompt, apiKey, 4096)).replace(/```json|```/g, '').trim();

      try {
        const domande = JSON.parse(raw);
        if (!Array.isArray(domande)) throw new Error('not array');
        return NextResponse.json({ domande });
      } catch {
        return NextResponse.json({ errore: 'Errore nella generazione del test. Riprova.' }, { status: 500 });
      }
    }

    return NextResponse.json({ errore: 'Tipo non valido' }, { status: 400 });

  } catch (error: any) {
    console.error('Errore API studio-pdf:', error);
    return NextResponse.json({ errore: 'Errore interno. Riprova.' }, { status: 500 });
  }
}