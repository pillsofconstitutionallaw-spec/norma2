import { NextRequest, NextResponse } from 'next/server';

async function groqGenerate(prompt: string, apiKey: string, maxTokens = 8192): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: maxTokens,
    }),
  });

  const data = await response.json();
  console.log('Groq response:', JSON.stringify(data).substring(0, 500));
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

    if (tipo === 'flashcard') {
      const prompt = `Sei un docente universitario di giurisprudenza italiano.

Hai ricevuto un documento di studio (appunti, dispensa o manuale).

Il tuo compito è creare ESATTAMENTE 50 flash card di studio basate ESCLUSIVAMENTE sul contenuto del documento, coprendo in modo uniforme tutti gli argomenti presenti dall'inizio alla fine.

Regole tassative:
- Copri TUTTI i concetti presenti: definizioni, distinzioni, requisiti, effetti, esempi, eccezioni, principi
- NON inventare nulla che non sia nel testo
- NON aggiungere nozioni esterne al documento
- Le domande devono essere chiare, precise e giuridicamente corrette
- Le risposte devono essere complete e fedeli al documento (massimo 4 righe)
- NON usare markdown, asterischi, elenchi puntati o formattazione
- Varia la tipologia: definizioni, differenze, requisiti, effetti, esempi, eccezioni
- Distribuisci le domande uniformemente su tutto il documento, non solo sulla parte iniziale

Rispondi SOLO con un array JSON valido, senza testo aggiuntivo, senza backtick, senza markdown.
Formato esatto:
[{"domanda":"...","risposta":"..."},{"domanda":"...","risposta":"..."}]

Documento:
${testo.substring(0, 60000)}`;

      const raw = (await groqGenerate(prompt, apiKey, 8192)).replace(/```json|```/g, '').trim();

      try {
        const carte = JSON.parse(raw);
        if (!Array.isArray(carte)) throw new Error('not array');
        return NextResponse.json({ carte });
      } catch {
        return NextResponse.json({ errore: 'Errore nella generazione delle flash card. Riprova.' }, { status: 500 });
      }
    }

    if (tipo === 'test') {
      const prompt = `Sei un docente universitario di giurisprudenza italiano che prepara esami.

Hai ricevuto un documento di studio (appunti, dispensa o manuale).

Il tuo compito è creare ESATTAMENTE 20 domande a risposta multipla basate ESCLUSIVAMENTE sul contenuto del documento, coprendo uniformemente tutti gli argomenti dall'inizio alla fine.

Regole tassative:
- Copri TUTTI i concetti importanti presenti nel documento
- NON inventare nulla che non sia nel testo
- Ogni domanda deve avere 4 opzioni di risposta
- Una sola risposta deve essere corretta
- Le opzioni sbagliate devono essere plausibili ma chiaramente errate
- NON usare markdown, asterischi o formattazione
- Le domande devono testare la comprensione, non la memoria meccanica
- Distribuisci le domande uniformemente su tutto il documento

Rispondi SOLO con un array JSON valido, senza testo aggiuntivo, senza backtick, senza markdown.
Il campo "corretta" è l'indice (0-3) della risposta corretta nell'array opzioni.
Formato esatto:
[{"domanda":"...","opzioni":["A) ...","B) ...","C) ...","D) ..."],"corretta":0}]

Documento:
${testo.substring(0, 60000)}`;

      const raw = (await groqGenerate(prompt, apiKey, 8192)).replace(/```json|```/g, '').trim();

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
