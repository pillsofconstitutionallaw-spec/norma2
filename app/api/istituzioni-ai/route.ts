export async function POST(req: Request) {
  try {
    const { istituzione, tipo } = await req.json();

    const apiKey =
      process.env.GROQ_API_KEY_ISTITUZIONI;

    if (!apiKey) {
      return Response.json(
        {
          errore:
            'GROQ_API_KEY_ISTITUZIONI non trovata',
        },
        {
          status: 500,
        }
      );
    }

    let prompt = '';

    if (tipo === 'spiegazione') {
      prompt = `
Sei un esperto di diritto costituzionale, diritto pubblico e istituzioni internazionali.

Spiega in modo chiaro, rigoroso, elegante e giuridicamente corretto la seguente istituzione:

${istituzione}

La risposta deve includere:
- ruolo istituzionale
- funzioni principali
- composizione
- competenze
- fonti normative
- articoli della Costituzione o trattati collegati
- spiegazione semplice ma professionale

NON usare markdown.
NON usare asterischi.
NON usare elenchi puntati.
NON usare tono da chatbot.

Scrivi un testo fluido, discorsivo e professionale.
`;
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.15,
          max_tokens: 2048,
        }),
      }
    );

    const data = await response.json();

    const spiegazione =
      data.choices?.[0]?.message?.content ||
      'Nessuna risposta disponibile';

    return Response.json({
      spiegazione,
    });
  } catch (e) {
    console.error(e);

    return Response.json(
      {
        errore: 'Errore AI',
      },
      {
        status: 500,
      }
    );
  }
}