import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const testo = body?.testo || '';

    if (!testo) {
      return NextResponse.json({
        principio: '',
        concetti: [],
      });
    }

    const prompt = `
Crea una semplice mappa concettuale giuridica del testo seguente.

Restituisci SOLO JSON valido.

Formato obbligatorio:

{
  "principio": "breve principio centrale",
  "concetti": [
    "concetto 1",
    "concetto 2",
    "concetto 3"
  ]
}

NON usare markdown.
NON usare \`\`\`.
NON usare testo fuori dal JSON.

TESTO:
${testo}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      }
    );

    const data = await response.json();

    const raw =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const cleaned = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    console.log(cleaned);

    const parsed = JSON.parse(cleaned);

    return NextResponse.json({
      principio: parsed?.principio || '',
      concetti: parsed?.concetti || [],
    });

  } catch (e) {
    console.error(e);

    return NextResponse.json({
      principio: 'Errore generazione mappa',
      concetti: [],
    });
  }
}