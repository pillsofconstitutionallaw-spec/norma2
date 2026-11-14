import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { leggiEdgeConfig, scriviEdgeConfig } from '@/lib/edge-config';

// Controlla se sui due siti WordPress è uscito un articolo nuovo e, se sì,
// manda la notifica push. Prima le notifiche degli articoli dipendevano
// solo da un webhook di WordPress verso /api/notifica, senza garanzia che
// partisse: questo controllo non dipende da WordPress.
//
// Lo stato salvato è il link dell'ultimo articolo notificato (per sito),
// lo stesso che scrive /api/notifica: così, se il webhook ha già mandato
// la notifica, qui non viene ripetuta.

const ONESIGNAL_APP_ID = 'cb2f63d9-6736-47a6-97e7-913f41abd463';

const SITI = [
  {
    chiave: 'ultimo-articolo-og',
    api: 'https://orizzontegiuridico.com/wp-json/wp/v2/posts?per_page=1&_embed=wp:featuredmedia&_fields=id,link,slug,title,_links,_embedded',
    titolo: 'Orizzonte Giuridico',
    urlApp: (p: Articolo) => `https://norma2.vercel.app/articoli/${p.slug}`,
  },
  {
    chiave: 'ultimo-articolo-odl',
    api: 'https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?per_page=1&_embed=wp:featuredmedia&_fields=id,link,slug,title,_links,_embedded',
    titolo: 'Orizzonti del Diritto',
    urlApp: (p: Articolo) => p.link,
  },
];

type Articolo = {
  id: number; link: string; slug: string; title: { rendered: string };
  _embedded?: { 'wp:featuredmedia'?: { source_url?: string; media_details?: { sizes?: Record<string, { source_url: string }> } }[] };
};

function verificaAuth(req: NextRequest): boolean {
  return req.headers.get('Authorization') === `Bearer ${process.env.CRON_SECRET}`;
}

function testoPulito(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#8217;|&rsquo;/g, '’')
    .trim();
}

async function controllaSito(sito: (typeof SITI)[number]) {
  const res = await fetch(sito.api, { cache: 'no-store' });
  if (!res.ok) return { sito: sito.titolo, esito: `WordPress ha risposto ${res.status}` };
  const [ultimo] = (await res.json()) as Articolo[];
  if (!ultimo) return { sito: sito.titolo, esito: 'nessun articolo' };

  const salvato = await leggiEdgeConfig(sito.chiave);
  if (salvato === ultimo.link) return { sito: sito.titolo, esito: 'nessuna novità' };

  // Primo avvio: l'articolo più recente esiste già, non è una novità.
  if (!salvato) {
    await scriviEdgeConfig([{ key: sito.chiave, value: ultimo.link }]);
    return { sito: sito.titolo, esito: 'stato inizializzato, nessuna notifica' };
  }

  // Prima si salva, poi si notifica: se la scrittura fallisce niente
  // notifica, altrimenti lo stesso articolo partirebbe a ogni controllo.
  await scriviEdgeConfig([{ key: sito.chiave, value: ultimo.link }]);

  const titolo = testoPulito(ultimo.title.rendered);
  // Immagine grande nella notifica: si vede su Android/desktop; su iPhone
  // le notifiche delle web app non mostrano immagini (limite di Apple).
  const media = ultimo._embedded?.['wp:featuredmedia']?.[0];
  const immagine = media?.media_details?.sizes?.medium_large?.source_url || media?.media_details?.sizes?.large?.source_url || media?.source_url;
  const r = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}` },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      included_segments: ['All'],
      headings: { it: sito.titolo, en: sito.titolo },
      contents: { it: `📰 ${titolo}`, en: `📰 ${titolo}` },
      url: sito.urlApp(ultimo),
      chrome_web_icon: 'https://norma2.vercel.app/icon-192.png?v=3',
      ...(immagine ? { chrome_web_image: immagine } : {}),
    }),
  });
  return { sito: sito.titolo, esito: 'notifica inviata', articolo: titolo, onesignal: await r.json() };
}

async function esegui() {
  // I siti si controllano separatamente: se uno è giù, l'altro va avanti.
  const esiti = await Promise.all(
    SITI.map(s => controllaSito(s).catch((e: Error) => ({ sito: s.titolo, esito: `errore: ${e.message}` }))),
  );
  // Articolo nuovo: si svuota subito la cache dei dati della Home, così
  // storie e feed lo mostrano alla prossima apertura dell'app.
  if (esiti.some(e => e.esito === 'notifica inviata')) revalidatePath('/api/home-data');
  return NextResponse.json({ esiti });
}

export async function GET(req: NextRequest) {
  if (!verificaAuth(req)) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  return esegui();
}

export async function POST(req: NextRequest) {
  if (!verificaAuth(req)) return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
  return esegui();
}
