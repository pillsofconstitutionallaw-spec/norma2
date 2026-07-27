import { NextRequest, NextResponse } from 'next/server';
import { leggiEdgeConfig, scriviEdgeConfig } from '@/lib/edge-config';

const ONESIGNAL_APP_ID = 'cb2f63d9-6736-47a6-97e7-913f41abd463';
const URL_DEPOSITO = 'https://www.cortecostituzionale.it/ultimo-deposito';

// Il sito della Corte è dietro un bot manager (Radware/ShieldSquare): con uno
// user-agent da bot la richiesta viene dirottata su validate.perfdrive.com e
// l'HTML che torna non contiene il deposito. Servono header da browser vero.
const HEADERS_BROWSER = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

function verificaAuth(req: NextRequest): boolean {
  const auth = req.headers.get('Authorization');
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}

async function esegui(): Promise<NextResponse> {
  // Scraping pagina "Ultimo deposito" della Corte Costituzionale
  const res = await fetch(URL_DEPOSITO, { headers: HEADERS_BROWSER, next: { revalidate: 0 } });
  const html = await res.text();

  // Cerca il titolo, es. "Deposito 24/07/2026 (dalla 148 alla 153)"
  const match = html.match(/Deposito\s+[\d/]+\s*\([^)]+\)/i);

  if (!match) {
    // Distinguere il blocco anti-bot da un cambio di layout: sono due problemi
    // diversi e prima finivano entrambi in un silenzioso "nessun deposito".
    const bloccato = /validate\.perfdrive\.com|ShieldSquare/i.test(html);
    const motivo = bloccato
      ? 'richiesta bloccata dal bot manager della Corte'
      : `deposito non trovato nell'HTML (${res.status}, ${html.length} byte)`;
    console.error('controlla-sentenze:', motivo);
    return NextResponse.json({ error: motivo }, { status: 502 });
  }

  const depositoAttuale = match[0].trim();

  const ultimoSalvato = await leggiEdgeConfig('ultimo-deposito');

  if (depositoAttuale === ultimoSalvato) {
    return NextResponse.json({ message: 'Nessuna novità', deposito: depositoAttuale });
  }

  // Primo avvio, stato vuoto: il deposito che troviamo adesso esiste già da
  // giorni, non è una novità. Si memorizza in silenzio; la notifica parte dal
  // primo deposito pubblicato davvero dopo questo momento.
  if (!ultimoSalvato) {
    await scriviEdgeConfig([{ key: 'ultimo-deposito', value: depositoAttuale }]);
    return NextResponse.json({ message: 'Stato inizializzato, nessuna notifica', deposito: depositoAttuale });
  }

  // Prima si salva, poi si notifica: se la scrittura fallisce niente notifica,
  // altrimenti lo stesso deposito verrebbe rinotificato ad ogni run del cron.
  await scriviEdgeConfig([{ key: 'ultimo-deposito', value: depositoAttuale }]);

  // Manda notifica push via OneSignal
  const notifRes = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
    },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
      headings: { it: 'Corte Costituzionale', en: 'Corte Costituzionale' },
      contents: { it: `📜 ${depositoAttuale}`, en: `📜 ${depositoAttuale}` },
      url: 'https://www.cortecostituzionale.it/actionCommuniqueStampa.do',
    }),
  });

  const notifData = await notifRes.json();
  return NextResponse.json({ message: 'Notifica inviata', deposito: depositoAttuale, onesignal: notifData });
}

// GET — usato dai cron Vercel (vercel.json)
export async function GET(req: NextRequest) {
  if (!verificaAuth(req)) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  try {
    return await esegui();
  } catch (error: any) {
    console.error('Errore controlla-sentenze:', error);
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
    console.error('Errore controlla-sentenze:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}