import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithRetry(model: any, prompt: string, maxRetries = 3): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      if (i > 0) await delay(2000 * i);
      return await model.generateContent(prompt);
    } catch (error: any) {
      if (error?.status === 429 && i < maxRetries - 1) continue;
      throw error;
    }
  }
}

async function groqGenerate(prompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.15,
      max_tokens: 2048,
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { articolo, testo, tipo } = body;

    if (tipo === 'sintesi') {
      const apiKey = process.env.GROQ_API_KEY_ARTICOLI;
      if (!apiKey) return NextResponse.json({ spiegazione: 'API KEY GROQ ARTICOLI NON TROVATA' });
      const prompt = `
Sei un giurista italiano esperto.
Leggi il seguente testo giuridico e scrivi una sintesi chiara, precisa e discorsiva.
La sintesi deve essere:
- massimo 4-5 frasi
- in italiano corretto e formale
- senza markdown, asterischi, elenchi puntati
- senza introduzioni inutili
- fedele al contenuto del testo
Testo:
${testo}
`;
      const sintesi = (await groqGenerate(prompt, apiKey)).replace(/\*/g, '').replace(/#{1,6}/g, '').trim();
      return NextResponse.json({ spiegazione: sintesi, sintesi });
    }

    if (tipo === 'parole_chiave') {
      const apiKey = process.env.GROQ_API_KEY_ARTICOLI;
      if (!apiKey) return NextResponse.json({ parole: [] });
      const prompt = `
Sei un giurista italiano esperto.
Leggi il seguente testo giuridico ed estrai le 6-10 parole chiave o concetti giuridici principali.
Rispondi SOLO con un JSON valido in questo formato esatto, senza markdown, senza backtick:
{"parole": ["parola1", "parola2", "parola3"]}
Testo:
${testo}
`;
      const raw = (await groqGenerate(prompt, apiKey)).replace(/```json|```/g, '').trim();
      try {
        return NextResponse.json(JSON.parse(raw));
      } catch {
        const parole = raw.split(/[\n,]/).map((p: string) => p.trim()).filter(Boolean).slice(0, 10);
        return NextResponse.json({ parole });
      }
    }

    if (tipo === 'test') {
      const apiKey = process.env.GROQ_API_KEY_ARTICOLI;
      if (!apiKey) return NextResponse.json({ domande: [] });
      const prompt = `
Sei un giurista italiano esperto.
Leggi il seguente testo giuridico e crea 3 domande a risposta multipla per testare la comprensione.
Rispondi SOLO con un JSON valido in questo formato esatto, senza markdown, senza backtick:
{
  "domande": [
    {
      "domanda": "testo della domanda",
      "opzioni": ["opzione A", "opzione B", "opzione C", "opzione D"],
      "risposta_corretta": 0
    }
  ]
}
Il campo "risposta_corretta" è l'indice (0-3) dell'opzione corretta.
Testo:
${testo}
`;
      const raw = (await groqGenerate(prompt, apiKey)).replace(/```json|```/g, '').trim();
      try {
        return NextResponse.json(JSON.parse(raw));
      } catch {
        return NextResponse.json({ domande: [] });
      }
    }

    if (tipo === 'istituzione') {
      const apiKey = process.env.GROQ_API_KEY_ISTITUZIONI;
      if (!apiKey) return NextResponse.json({ spiegazione: 'API KEY GROQ ISTITUZIONI NON TROVATA' });
      const prompt = `
Sei un costituzionalista italiano
e docente universitario di diritto costituzionale.
Devi spiegare articoli della Costituzione italiana
in modo rigoroso,
corretto,
affidabile
e giuridicamente preciso.
Le informazioni devono essere coerenti con:
- testo ufficiale della Costituzione italiana
- Corte costituzionale italiana
- Parlamento italiano
- Presidenza della Repubblica
- Normattiva
- principi consolidati del diritto costituzionale italiano
NON inventare.
NON usare fantasia.
NON formulare ipotesi.
NON usare tono da chatbot.
NON usare markdown.
NON usare asterischi.
NON usare elenchi puntati.
NON scrivere introduzioni inutili.
NON dire cose non presenti nel diritto costituzionale italiano.
Spiega:
- il significato dell'articolo
- la funzione nell'ordinamento
- la rilevanza costituzionale
- l'applicazione pratica
- eventuali orientamenti della Corte costituzionale
Scrivi un testo unico,
fluido,
naturale,
discorsivo
e professionale.
Articolo:
${articolo}
Testo:
${testo}
`;
      const spiegazione = (await groqGenerate(prompt, apiKey)).replace(/\*/g, '').replace(/#{1,6}/g, '').trim();
      return NextResponse.json({ spiegazione });
    }

    // COSTITUZIONE (Gemini — default)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) return NextResponse.json({ spiegazione: 'API KEY GEMINI NON TROVATA' });
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig: { temperature: 0.15, topP: 0.8, topK: 20 },
    });
    const prompt = `
Sei un costituzionalista italiano
e docente universitario di diritto costituzionale.
Devi spiegare articoli della Costituzione italiana
in modo rigoroso,
corretto,
affidabile
e giuridicamente preciso.
Le informazioni devono essere coerenti con:
- testo ufficiale della Costituzione italiana
- Corte costituzionale italiana
- Parlamento italiano
- Presidenza della Repubblica
- Normattiva
- principi consolidati del diritto costituzionale italiano
NON inventare.
NON usare fantasia.
NON formulare ipotesi.
NON usare tono da chatbot.
NON usare markdown.
NON usare asterischi.
NON usare elenchi puntati.
NON scrivere introduzioni inutili.
NON dire cose non presenti nel diritto costituzionale italiano.
Spiega:
- il significato dell'articolo
- la funzione nell'ordinamento
- la rilevanza costituzionale
- l'applicazione pratica
- eventuali orientamenti della Corte costituzionale
Scrivi un testo unico,
fluido,
naturale,
discorsivo
e professionale.
Articolo:
${articolo}
Testo:
${testo}
`;
    const result = await generateWithRetry(model, prompt);
    const spiegazione = result.response.text().replace(/\*/g, '').replace(/#{1,6}/g, '').trim();
    return NextResponse.json({ spiegazione });

  } catch (error: any) {
    console.error('ERRORE AI:', error);
    return NextResponse.json({ spiegazione: 'Errore durante la generazione AI.' });
  }
}