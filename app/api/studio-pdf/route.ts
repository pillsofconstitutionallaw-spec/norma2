import { NextRequest, NextResponse } from 'next/server';

async function groqGenerate(prompt: string, apiKey: string, maxTokens = 2048): Promise<string> {
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
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, testo } = body;

    const apiKey = process.env.GROQ_API_KEY_PDF;

    if (!apiKey) {
      return NextResponse.json({ errore: 'API KEY GROQ PDF NON TROVATA' }, { status: 500 });
    }

    // ── FLASH CARD ──────────────────────────────────────────────────────────
    if (tipo === 'flashcard') {
      const prompt = `
Sei un docente universitario di giurisprudenza italiano.

Hai ricevuto il seguente testo estratto da un documento di studio (appunti, dispensa o manuale).

Il tuo compito è creare esattamente 10 flash card di studio basate ESCLUSIVAMENTE sul contenuto del documento.

Regole tassative:
- Le domande devono riguardare SOLO concetti, definizioni, principi e norme presenti nel documento
- NON inventare nulla che non sia nel testo
- NON aggiungere nozioni esterne al documento
- Le domande devono essere chiare, precise e giuridicamente corrette
- Le risposte devono essere complete, accurate e fedeli al documento (massimo 4 righe)
- NON usare markdown, asterischi, elenchi puntati o formattazione
- Varia la tipologia: definizioni, differenze, requisiti, effetti, esempi

Rispondi SOLO con un array JSON valido, senza testo aggiuntivo, senza backtick, senza markdown.
Formato esatto (rispetta virgolette e struttura):
[{"domanda":"...","risposta":"..."},{"domanda":"...","risposta":"..."}]

Documento:
${testo}
`;

      const raw = (await groqGenerate(prompt, apiKey, 2048))
        .replace(/```json|```/g, '')
        .trim();

      try {
        const carte = JSON.parse(raw);
        return NextResponse.json({ carte });
      } catch {
        return NextResponse.json({ errore: 'Errore nella generazione delle flash card. Riprova.' }, { status: 500 });
      }
    }

    // ── TEST ─────────────────────────────────────────────────────────────────
    if (tipo === 'test') {
      const prompt = `
Sei un docente universitario di giurisprudenza italiano che prepara esami.

Hai ricevuto il seguente testo estratto da un documento di studio (appunti, dispensa o manuale).

Il tuo compito è creare esattamente 5 domande a risposta multipla basate ESCLUSIVAMENTE sul contenuto del documento.

Regole tassative:
- Le domande devono riguardare SOLO concetti presenti nel documento
- NON inventare nulla che non sia nel testo
- NON aggiungere nozioni esterne al documento
- Ogni domanda deve avere 4 opzioni di risposta (A, B, C, D)
- Una sola risposta deve essere corretta
- Le opzioni sbagliate devono essere plausibili ma chiaramente errate
- NON usare markdown, asterischi o formattazione
- Le domande devono testare la comprensione, non la memoria meccanica

Rispondi SOLO con un array JSON valido, senza testo aggiuntivo, senza backtick, senza markdown.
Il campo "corretta" è l'indice (0-3) della risposta corretta nell'array opzioni.
Formato esatto:
[{"domanda":"...","opzioni":["A) ...","B) ...","C) ...","D) ..."],"corretta":0}]

Documento:
${testo}
`;

      const raw = (await groqGenerate(prompt, apiKey, 2048))
        .replace(/```json|```/g, '')
        .trim();

      try {
        const domande = JSON.parse(raw);
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
