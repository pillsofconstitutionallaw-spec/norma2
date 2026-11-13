import { NextRequest, NextResponse } from 'next/server';

const VISION_MODEL = 'llama-3.2-11b-vision-preview';
const TEXT_MODEL = 'llama-3.3-70b-versatile';

async function groqVision(base64: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: VISION_MODEL,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Estrai tutto il testo presente in questa immagine mantenendo la struttura. Se ci sono titoli, elenchi o paragrafi preservali. Rispondi solo con il testo estratto, senza commenti.',
          },
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${base64}` },
          },
        ],
      }],
      max_tokens: 2000,
      temperature: 0.1,
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function groqGenerate(prompt: string, apiKey: string, maxTokens = 4096): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: TEXT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: maxTokens,
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

function calcolaNumeroCard(len: number): number {
  if (len < 2000) return 8;
  if (len < 5000) return 12;
  if (len < 8000) return 18;
  if (len < 12000) return 25;
  return 35;
}

function calcolaNumeroTest(len: number): number {
  if (len < 2000) return 5;
  if (len < 5000) return 8;
  if (len < 8000) return 10;
  return 15;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, immagini } = body; // immagini: string[] (base64)

    const apiKey = process.env.GROQ_API_KEY_PDF;
    if (!apiKey) {
      return NextResponse.json({ errore: 'API KEY GROQ NON TROVATA' }, { status: 500 });
    }

    if (!Array.isArray(immagini) || immagini.length === 0) {
      return NextResponse.json({ errore: 'Nessuna immagine ricevuta' }, { status: 400 });
    }

    // Estrae testo da ogni immagine in sequenza (vision model)
    const testi: string[] = [];
    for (const b64 of immagini.slice(0, 8)) {
      const testo = await groqVision(b64, apiKey);
      if (testo.trim()) testi.push(testo.trim());
    }

    if (testi.length === 0) {
      return NextResponse.json({ errore: 'Nessun testo leggibile nelle foto. Riprova con immagini più nitide.' }, { status: 400 });
    }

    const testoCompleto = testi.join('\n\n').substring(0, 10000);
    const nCard = calcolaNumeroCard(testoCompleto.length);
    const nTest = calcolaNumeroTest(testoCompleto.length);

    if (tipo === 'flashcard') {
      const prompt = `Sei un docente universitario di giurisprudenza italiano.
Documento di studio fornito:
${testoCompleto}

Crea esattamente ${nCard} flash card basate SOLO su questo documento.
Regole: no markdown, no backtick, risposte max 3 righe, copri tutti gli argomenti in modo uniforme.
Rispondi SOLO con JSON valido:
[{"domanda":"...","risposta":"..."}]`;

      const raw = (await groqGenerate(prompt, apiKey, 4096)).replace(/```json|```/g, '').trim();
      try {
        const carte = JSON.parse(raw);
        if (!Array.isArray(carte)) throw new Error();
        return NextResponse.json({ carte, testo: testoCompleto });
      } catch {
        return NextResponse.json({ errore: 'Errore generazione flashcard. Riprova.' }, { status: 500 });
      }
    }

    if (tipo === 'test') {
      const prompt = `Sei un docente universitario di giurisprudenza italiano.
Documento di studio fornito:
${testoCompleto}

Crea esattamente ${nTest} domande a risposta multipla basate SOLO su questo documento.
Regole: no markdown, 4 opzioni per domanda, una sola corretta, opzioni plausibili.
Rispondi SOLO con JSON valido:
[{"domanda":"...","opzioni":["A) ...","B) ...","C) ...","D) ..."],"corretta":0}]`;

      const raw = (await groqGenerate(prompt, apiKey, 4096)).replace(/```json|```/g, '').trim();
      try {
        const domande = JSON.parse(raw);
        if (!Array.isArray(domande)) throw new Error();
        return NextResponse.json({ domande });
      } catch {
        return NextResponse.json({ errore: 'Errore generazione test. Riprova.' }, { status: 500 });
      }
    }

    return NextResponse.json({ errore: 'Tipo non valido' }, { status: 400 });

  } catch (error: any) {
    console.error('Errore studio-foto:', error);
    return NextResponse.json({ errore: 'Errore interno. Riprova.' }, { status: 500 });
  }
}
