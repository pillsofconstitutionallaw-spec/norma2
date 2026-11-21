import { NextRequest, NextResponse } from 'next/server';

// Intermediario con cache verso le API WordPress dei due siti.
//
// Prima ogni telefono interrogava WordPress direttamente, senza cache: con
// molti utenti l'hosting (Keliweb, piano condiviso) raggiungeva il limite di
// risorse e rispondeva 508. Ora le richieste uguali di tutti gli utenti
// diventano una sola verso WordPress per ogni finestra di cache.
//
// Uso: /api/wp?sito=og|odl&percorso=posts&<parametri WordPress>
//   es. /api/wp?sito=og&percorso=posts&per_page=10&page=2&_embed

export const maxDuration = 60;

const SITI: Record<string, string> = {
  og: 'https://orizzontegiuridico.com/wp-json/wp/v2/',
  odl: 'https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/',
};

// Solo letture pubbliche, e per ognuna quanto tenerla in cache (secondi)
const PERCORSI: Record<string, number> = {
  posts: 120,
  categories: 3600,
  media: 600,
};

export async function GET(req: NextRequest) {
  const parametri = new URLSearchParams(req.nextUrl.searchParams);
  const base = SITI[parametri.get('sito') ?? ''];
  const percorso = parametri.get('percorso') ?? '';
  const durata = PERCORSI[percorso];
  if (!base || !durata) {
    return NextResponse.json({ error: 'Richiesta non ammessa' }, { status: 400 });
  }
  parametri.delete('sito');
  parametri.delete('percorso');
  // Ordine stabile dei parametri: stesse richieste → stessa voce di cache
  parametri.sort();

  try {
    const res = await fetch(`${base}${percorso}?${parametri.toString()}`, {
      next: { revalidate: durata },
      signal: AbortSignal.timeout(20000),
    });
    const corpo = await res.text();
    const intestazioni: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      // Le risposte riuscite restano in cache sulla CDN; gli errori no.
      'Cache-Control': res.ok ? `public, s-maxage=${durata}, stale-while-revalidate=${durata * 10}` : 'no-store',
    };
    // Servono alla paginazione (es. "Vedi tutti i 12 commenti")
    for (const h of ['x-wp-total', 'x-wp-totalpages']) {
      const v = res.headers.get(h);
      if (v) intestazioni[h] = v;
    }
    return new NextResponse(corpo, { status: res.status, headers: intestazioni });
  } catch {
    return NextResponse.json({ error: 'WordPress non risponde' }, { status: 504, headers: { 'Cache-Control': 'no-store' } });
  }
}
