import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ spiegazione: 'API KEY GEMINI NON TROVATA' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const body = await req.json();
    const { articolo, testo, tipo } = body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig: {
        temperature: 0.15,
        topP: 0.8,
        topK: 20,
      },
    });

    // ─── SINTESI ────────────────────────────────────────────────────────────────
    if (tipo === 'sintesi') {
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
      const result = await model.generateContent(prompt);
      let sintesi = result.response.text().replace(/\*/g, '').replace(/#{1,6}/g, '').trim();
      return NextResponse.json({ spiegazione: sintesi, sintesi });
    }

    // ─── PAROLE CHIAVE ──────────────────────────────────────────────────────────
    if (tipo === 'parole_chiave') {
      const prompt = `
Sei un giurista italiano esperto.
Leggi il seguente testo giuridico ed estrai le 6-10 parole chiave o concetti giuridici principali.
Rispondi SOLO con un JSON valido in questo formato esatto, senza markdown, senza backtick:
{"parole": ["parola1", "parola2", "parola3"]}

Testo:
${testo}
`;
      const result = await model.generateContent(prompt);
      let raw = result.response.text().replace(/```json|```/g, '').trim();
      try {
        const parsed = JSON.parse(raw);
        return NextResponse.json(parsed);
      } catch {
        // fallback: split by newline or comma
        const parole = raw.split(/[\n,]/).map((p: string) => p.trim()).filter(Boolean).slice(0, 10);
        return NextResponse.json({ parole });
      }
    }

    // ─── TEST ───────────────────────────────────────────────────────────────────
    if (tipo === 'test') {
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
      const result = await model.generateContent(prompt);
      let raw = result.response.text().replace(/```json|```/g, '').trim();
      try {
        const parsed = JSON.parse(raw);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({ domande: [] });
      }
    }

    // ─── COSTITUZIONE (default) ──────────────────────────────────────────────────
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

    const result = await model.generateContent(prompt);
    let spiegazione = result.response.text().replace(/\*/g, '').replace(/#{1,6}/g, '').trim();
    return NextResponse.json({ spiegazione });

  } catch (error: any) {
    console.error('ERRORE GEMINI:', error);
    return NextResponse.json({ spiegazione: 'Errore durante la generazione AI.' });
  }
}