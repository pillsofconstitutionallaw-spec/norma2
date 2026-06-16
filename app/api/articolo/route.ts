import { NextResponse } from 'next/server';

// Cache edge: WordPress viene colpito al massimo una volta ogni 5 minuti,
// poi Vercel serve la risposta dalla cache (caricamento articolo molto più rapido).
export const revalidate = 300;

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get('slug');
  if (!slug) {
    return NextResponse.json({ error: 'slug mancante' }, { status: 400 });
  }
  try {
    const res = await fetch(
      `https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&slug=${encodeURIComponent(slug)}&per_page=1`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error('Errore caricamento articolo');
    const data = await res.json();
    const post = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return NextResponse.json(
      { post },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch {
    return NextResponse.json({ post: null }, { status: 502 });
  }
}
