import { NextResponse } from 'next/server';

// WordPress (hosting condiviso) può impiegare molti secondi: l'articolo resta
// in cache 1 ora e poi viene servito ancora fino a un giorno mentre si
// aggiorna in background, così quasi nessun lettore aspetta WordPress.
// /api/controlla-articoli "scalda" questa cache appena esce un articolo.
export const maxDuration = 60;

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug mancante' }, { status: 400 });
  }
  try {
    const res = await fetch(
      `https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&slug=${encodeURIComponent(slug)}&per_page=1`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(20000) }
    );
    if (!res.ok) throw new Error('Errore caricamento articolo');
    const data = await res.json();
    const post = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return NextResponse.json(
      { post },
      // Un "non trovato" non si mette in cache: potrebbe essere un articolo
      // appena pubblicato o WordPress che ha risposto male.
      { headers: { 'Cache-Control': post ? 'public, s-maxage=3600, stale-while-revalidate=86400' : 'no-store' } }
    );
  } catch {
    return NextResponse.json({ post: null }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
