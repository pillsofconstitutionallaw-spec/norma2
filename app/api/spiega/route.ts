import { NextRequest, NextResponse } from 'next/server';

async function groqGenerate(prompt: string, apiKey: string, maxTokens = 1024): Promise<string> {
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
      max_tokens: maxTokens,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { articolo, testo, tipo } = body;

    // SINTESI
    if (tipo === 'sintesi') {

      const apiKey = process.env.GROQ_API_KEY_ARTICOLI;

      if (!apiKey) {
        return NextResponse.json({
          spiegazione: 'API KEY GROQ ARTICOLI NON TROVATA'
        });
      }

      const prompt = `
Sei un giurista italiano esperto.

Leggi il seguente testo giuridico e scrivi una sintesi chiara, precisa e discorsiva.

La sintesi deve essere:
- massimo 4-5 frasi
- in italiano corretto e formale
- senza markdown
- senza asterischi
- senza elenchi puntati
- senza introduzioni inutili
- fedele al contenuto del testo

Testo:
${testo}
`;

      const sintesi = (
        await groqGenerate(prompt, apiKey)
      )
        .replace(/\*/g, '')
        .replace(/#{1,6}/g, '')
        .trim();

      return NextResponse.json({
        spiegazione: sintesi,
        sintesi
      });
    }

    // PAROLE CHIAVE
    if (tipo === 'parole_chiave') {

      const apiKey = process.env.GROQ_API_KEY_ARTICOLI;

      if (!apiKey) {
        return NextResponse.json({ parole: [] });
      }

      const prompt = `
Sei un giurista italiano esperto.

Leggi il seguente testo giuridico ed estrai le 6-10 parole chiave o concetti giuridici principali.

Rispondi SOLO con un JSON valido in questo formato esatto, senza markdown e senza backtick:

{"parole": ["parola1", "parola2", "parola3"]}

Testo:
${testo}
`;

      const raw = (
        await groqGenerate(prompt, apiKey)
      )
        .replace(/```json|```/g, '')
        .trim();

      try {
        return NextResponse.json(JSON.parse(raw));
      } catch {

        const parole = raw
          .split(/[\n,]/)
          .map((p: string) => p.trim())
          .filter(Boolean)
          .slice(0, 10);

        return NextResponse.json({ parole });
      }
    }

    // TEST
    if (tipo === 'test') {

      const apiKey = process.env.GROQ_API_KEY_ARTICOLI;

      if (!apiKey) {
        return NextResponse.json({ domande: [] });
      }

      const prompt = `
Sei un giurista italiano esperto.

Leggi il seguente testo giuridico e crea 3 domande a risposta multipla per testare la comprensione.

Rispondi SOLO con un JSON valido in questo formato esatto, senza markdown e senza backtick:

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

      const raw = (
        await groqGenerate(prompt, apiKey)
      )
        .replace(/```json|```/g, '')
        .trim();

      try {
        return NextResponse.json(JSON.parse(raw));
      } catch {
        return NextResponse.json({ domande: [] });
      }
    }

    // ISTITUZIONI
    if (tipo === 'istituzione') {

      const apiKey = process.env.GROQ_API_KEY_ISTITUZIONI;

      if (!apiKey) {
        return NextResponse.json({
          spiegazione: 'API KEY GROQ ISTITUZIONI NON TROVATA'
        });
      }

      const prompt = `
Sei un costituzionalista italiano e docente universitario di diritto costituzionale.

Devi spiegare articoli della Costituzione italiana in modo rigoroso, corretto, affidabile e giuridicamente preciso.

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

Spiega:
- significato dell'articolo
- funzione nell'ordinamento
- rilevanza costituzionale
- applicazione pratica
- eventuali orientamenti della Corte costituzionale

Scrivi un testo unico, fluido, naturale, discorsivo e professionale.

Articolo: ${articolo}

Testo:
${testo}
`;

      const spiegazione = (
        await groqGenerate(prompt, apiKey)
      )
        .replace(/\*/g, '')
        .replace(/#{1,6}/g, '')
        .trim();

      return NextResponse.json({ spiegazione });
    }

    // CODICI
    if (tipo === 'codice') {

      const apiKey = process.env.GROQ_API_KEY_CODICI;

      if (!apiKey) {
        return NextResponse.json({
          spiegazione: 'API KEY GROQ CODICI NON TROVATA'
        });
      }

      const prompt = `
Sei un giurista italiano esperto di diritto civile, penale, amministrativo e processuale.

Devi spiegare articoli dei codici italiani in modo:
- rigoroso
- corretto
- affidabile
- giuridicamente preciso
- comprensibile agli studenti universitari e ai candidati ai concorsi pubblici

Le informazioni devono essere coerenti con:
- codici italiani vigenti
- Normattiva
- principi consolidati del diritto italiano
- orientamenti giurisprudenziali consolidati

NON inventare.
NON usare fantasia.
NON formulare ipotesi.
NON usare tono da chatbot.
NON usare markdown.
NON usare asterischi.
NON usare elenchi puntati.
NON scrivere introduzioni inutili.

Spiega:
- significato della norma
- funzione
- applicazione pratica
- elementi fondamentali
- eventuali collegamenti importanti

Scrivi un testo unico, fluido, naturale, discorsivo e professionale.

Articolo: ${articolo}

Testo:
${testo}
`;

      const spiegazione = (
        await groqGenerate(prompt, apiKey, 1000)
      )
        .replace(/\*/g, '')
        .replace(/#{1,6}/g, '')
        .trim();

      return NextResponse.json({ spiegazione });
    }

    // GIURISPRUDENZA CODICI
    if (tipo === 'giurisprudenza') {

      const apiKey = process.env.GROQ_API_KEY_CODICI;

      if (!apiKey) {
        return NextResponse.json({
          spiegazione: 'API KEY GROQ CODICI NON TROVATA'
        });
      }

      const prompt = `
Sei un giurista italiano esperto in giurisprudenza di legittimità e di merito.

Per l'articolo indicato, illustra i principali orientamenti giurisprudenziali in modo:
- rigoroso e giuridicamente preciso
- fondato su orientamenti consolidati di Corte di Cassazione, Consiglio di Stato, Corte costituzionale o altri giudici competenti
- comprensibile agli studenti universitari e ai candidati ai concorsi pubblici

NON inventare sentenze o riferimenti.
NON usare markdown.
NON usare asterischi.
NON usare elenchi puntati.
NON scrivere introduzioni inutili.
NON usare tono da chatbot.

Indica:
- l'interpretazione dominante della norma in giurisprudenza
- eventuali contrasti interpretativi e come sono stati risolti
- le massime o principi giurisprudenziali più rilevanti, con riferimento generico all'organo giudicante (es. "la Corte di Cassazione ha affermato che...")

Scrivi un testo unico, fluido, discorsivo e professionale.

Articolo: ${articolo}

Testo:
${testo}
`;

      const spiegazione = (
        await groqGenerate(prompt, apiKey, 1000)
      )
        .replace(/\*/g, '')
        .replace(/#{1,6}/g, '')
        .trim();

      return NextResponse.json({ spiegazione });
    }

    // COSTITUZIONE
    const apiKey = process.env.GROQ_API_KEY_COSTITUZIONE;

    if (!apiKey) {
      return NextResponse.json({
        spiegazione: 'API KEY GROQ COSTITUZIONE NON TROVATA'
      });
    }

    const prompt = `
Sei un costituzionalista italiano e docente universitario di diritto costituzionale.

Devi spiegare articoli della Costituzione italiana in modo rigoroso, corretto, affidabile e giuridicamente preciso.

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

Spiega:
- significato dell'articolo
- funzione nell'ordinamento
- rilevanza costituzionale
- applicazione pratica
- eventuali orientamenti della Corte costituzionale

Se storicamente documentato e certo, indica brevemente chi furono i principali estensori o promotori dell'articolo in sede di Assemblea Costituente (1946-1948).

Se non è storicamente accertato, non menzionarlo.

Scrivi un testo unico, fluido, naturale, discorsivo e professionale.

Articolo: ${articolo}

Testo:
${testo}
`;

    const spiegazione = (
      await groqGenerate(prompt, apiKey, 800)
    )
      .replace(/\*/g, '')
      .replace(/#{1,6}/g, '')
      .trim();

    return NextResponse.json({ spiegazione });

  } catch (error: any) {

    console.error('Errore API spiega:', error);

    return NextResponse.json(
      {
        spiegazione: 'Errore nella generazione. Riprova.'
      },
      {
        status: 500
      }
    );
  }
}