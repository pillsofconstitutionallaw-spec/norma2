import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const { istituzione, tipo } = await req.json();

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
    });

    let prompt = '';

    // SPIEGAZIONE
    if (tipo === 'spiegazione') {
      prompt = `
Spiega in modo chiaro, elegante e giuridicamente corretto la seguente istituzione:

${istituzione}

La risposta deve includere:

- ruolo istituzionale
- funzioni principali
- composizione
- competenze
- fonti del diritto
- articoli della Costituzione o trattati collegati
- spiegazione semplice ma professionale

Tono:
premium, moderno, stile enciclopedia giuridica AI.
`;
    }

    // RIASSUNTO
    if (tipo === 'riassunto') {
      prompt = `
Fai un riassunto schematico e chiaro della seguente istituzione:

${istituzione}

Massimo 250 parole.
`;
    }

    // QUIZ
    if (tipo === 'quiz') {
      prompt = `
Crea 3 quiz a risposta multipla sulla seguente istituzione:

${istituzione}

Formato:

Domanda:
A)
B)
C)

Risposta corretta:
`;
    }

    // ARTICOLI
    if (tipo === 'articoli') {
      prompt = `
Mostra gli articoli della Costituzione, trattati UE o norme principali collegati a:

${istituzione}

Spiega anche brevemente cosa disciplinano.
`;
    }

    const result = await model.generateContent(prompt);

    const risposta =
      result.response.text() || 'Nessuna risposta disponibile';

    return Response.json({
      risposta,
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