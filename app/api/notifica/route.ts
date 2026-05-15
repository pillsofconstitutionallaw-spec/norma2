import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const titolo = body.post_title || body.title || 'Nuovo contenuto';
    const tipo = body.post_type || 'post';

    let messaggio = '';

    if (tipo === 'fascicolo' || titolo.toLowerCase().includes('fascicolo')) {
      messaggio = `📄 Nuovo fascicolo disponibile: ${titolo}`;
    } else if (tipo === 'post' || tipo === 'article') {
      messaggio = `📰 Nuovo articolo: ${titolo}`;
    } else if (tipo === 'social' || titolo.toLowerCase().includes('instagram')) {
      messaggio = `📱 Nuovo post social: ${titolo}`;
    } else {
      messaggio = `🔔 Novità su Orizzonte Giuridico: ${titolo}`;
    }

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: 'cb2f63d9-6736-47a6-97e7-913f41abd463',
        included_segments: ['All'],
        headings: { it: 'Orizzonte Giuridico' },
        contents: { it: messaggio },
        url: body.post_url || 'https://norma2.vercel.app',
      }),
    });

    const data = await response.json();
    return Response.json({ ok: true, data });

  } catch (err) {
    console.error('Errore notifica:', err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
