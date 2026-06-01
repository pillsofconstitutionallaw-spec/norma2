import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@vercel/edge-config';

const IG_USER_ID = '17841472725782214';
const ONESIGNAL_APP_ID = 'cb2f63d9-6736-47a6-97e7-913f41abd463';

function verificaAuth(req: NextRequest): boolean {
  const auth = req.headers.get('Authorization');
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

async function esegui(): Promise<NextResponse> {
  const token = process.env.INSTAGRAM_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Token Instagram mancante' }, { status: 500 });
  }

  const res = await fetch(
    `https://graph.instagram.com/v25.0/${IG_USER_ID}/media?fields=id,caption,permalink,timestamp&limit=1&access_token=${token}`,
    { next: { revalidate: 0 } }
  );
  const data = await res.json();

  if (!data?.data?.length) {
    return NextResponse.json({ message: 'Nessun post trovato' });
  }

  const ultimoPost = data.data[0];
  const ultimoId = ultimoPost.id;

  const edgeConfig = createClient(process.env.EDGE_CONFIG!);
  const salvato = await edgeConfig.get('ultimo-instagram-id') as string | null;

  if (salvato === ultimoId) {
    return NextResponse.json({ message: 'Nessuna novità', id: ultimoId });
  }

  // Aggiorna Edge Config con il nuovo ID
  await fetch(`https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ operation: 'upsert', key: 'ultimo-instagram-id', value: ultimoId }],
    }),
  });

  const caption = ultimoPost.caption
    ? ultimoPost.caption.split('\n')[0].slice(0, 80)
    : 'Nuovo post su Instagram';

  const notifRes = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
      headings: { it: 'Orizzonte Giuridico', en: 'Orizzonte Giuridico' },
      contents: { it: `📱 ${caption}`, en: `📱 ${caption}` },
      url: ultimoPost.permalink || 'https://www.instagram.com/orizzonte.giuridico/',
    }),
  });

  const notifData = await notifRes.json();
  return NextResponse.json({ message: 'Notifica inviata', id: ultimoId, onesignal: notifData });
}

// GET — usato dai cron Vercel (vercel.json)
export async function GET(req: NextRequest) {
  if (!verificaAuth(req)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  try {
    return await esegui();
  } catch (error: any) {
    console.error('Errore controlla-instagram:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — compatibilità con chiamate manuali / cron esterni
export async function POST(req: NextRequest) {
  if (!verificaAuth(req)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  try {
    return await esegui();
  } catch (error: any) {
    console.error('Errore controlla-instagram:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
