import { NextRequest, NextResponse } from 'next/server';
import { leggiEdgeConfig, scriviEdgeConfig } from '@/lib/edge-config';
import { CHIAVE_TOKEN, CHIAVE_TOKEN_REFRESH, IG_USER_ID, tokenInstagram } from '@/lib/instagram';

const ONESIGNAL_APP_ID = 'cb2f63d9-6736-47a6-97e7-913f41abd463';
const REFRESH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 giorni

function verificaAuth(req: NextRequest): boolean {
  const auth = req.headers.get('Authorization');
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

async function refreshTokenSeNecessario(): Promise<string> {
  const tokenAttuale = await tokenInstagram();

  try {
    const lastRefreshRaw = await leggiEdgeConfig(CHIAVE_TOKEN_REFRESH);
    // null → mai rinfrescato → fai subito il refresh
    const lastRefresh = lastRefreshRaw ? new Date(lastRefreshRaw).getTime() : 0;
    const scaduto = Date.now() - lastRefresh >= REFRESH_INTERVAL_MS;

    if (!scaduto) return tokenAttuale;

    const res = await fetch(
      `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${tokenAttuale}`,
      { next: { revalidate: 0 } }
    );
    const data = await res.json();

    if (!data?.access_token) {
      console.error('Refresh token fallito: access_token assente nella risposta', data);
      return tokenAttuale; // continua con il token attuale, NON aggiorna timestamp
    }

    await scriviEdgeConfig([
      { key: CHIAVE_TOKEN, value: data.access_token },
      { key: CHIAVE_TOKEN_REFRESH, value: new Date().toISOString() },
    ]);

    return data.access_token;
  } catch (err) {
    console.error('Errore durante il refresh del token Instagram:', err);
    return tokenAttuale; // il refresh non blocca il flusso principale
  }
}

async function esegui(): Promise<NextResponse> {
  const token = await refreshTokenSeNecessario();
  if (!token) {
    return NextResponse.json({ error: 'Token Instagram mancante' }, { status: 500 });
  }

  const res = await fetch(
    `https://graph.instagram.com/v25.0/${IG_USER_ID}/media?fields=id,caption,permalink,timestamp&limit=1&access_token=${token}`,
    { next: { revalidate: 0 } }
  );
  const data = await res.json();

  if (data?.error) {
    console.error('Graph API ha rifiutato il token:', data.error);
    return NextResponse.json({ error: data.error.message ?? 'Errore Graph API' }, { status: 502 });
  }

  if (!data?.data?.length) {
    return NextResponse.json({ message: 'Nessun post trovato' });
  }

  const ultimoPost = data.data[0];
  const ultimoId = ultimoPost.id;

  const salvato = await leggiEdgeConfig('ultimo-instagram-id');

  if (salvato === ultimoId) {
    return NextResponse.json({ message: 'Nessuna novità', id: ultimoId });
  }

  // Primo avvio, stato vuoto: il post più recente è già pubblicato da giorni,
  // non è una novità. Si memorizza in silenzio; la notifica parte dal primo
  // post pubblicato davvero dopo questo momento.
  if (!salvato) {
    await scriviEdgeConfig([{ key: 'ultimo-instagram-id', value: ultimoId }]);
    return NextResponse.json({ message: 'Stato inizializzato, nessuna notifica', id: ultimoId });
  }

  // Prima si salva, poi si notifica: se la scrittura fallisce niente notifica,
  // altrimenti lo stesso post verrebbe rinotificato ad ogni run del cron.
  await scriviEdgeConfig([{ key: 'ultimo-instagram-id', value: ultimoId }]);

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
