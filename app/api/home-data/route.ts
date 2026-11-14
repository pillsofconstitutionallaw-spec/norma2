import { NextResponse } from 'next/server';

// 1 minuto: con 300 (e prima 3600) le storie restavano indietro anche ad
// articolo già pubblicato. In più /api/controlla-articoli invalida questa
// cache appena trova un articolo nuovo (revalidatePath).
//
// La route è dinamica: prerenderla al build significava 18 chiamate a
// WordPress dentro il limite di 60 secondi della build, che con WordPress
// lento falliva. Le chiamate restano in cache 60 s (data cache) e la
// risposta 60 s sulla CDN; ogni chiamata ha un tempo massimo di 8 s.
export const dynamic = 'force-dynamic';
const CACHE = () => ({ next: { revalidate: 30 }, signal: AbortSignal.timeout(8000) });
const INTESTAZIONI = { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30' };

// Tutte le categorie della barra delle storie in Home (prima solo 6: le
// altre restavano nella cache del telefono fino a un'ora).
const STORY_CATS = [
  { name: 'Penale', id: 48 },
  { name: 'Civile', id: 682 },
  { name: 'Costituzionale', id: 39 },
  { name: 'Ambiente', id: 220 },
  { name: 'Unione Europea', id: 249 },
  { name: 'Amministrativo', id: 86 },
  { name: 'Internazionale', id: 140 },
  { name: 'Animali', id: 834 },
  { name: 'Legalità', id: 320 },
  { name: 'Economia', id: 55 },
  { name: 'Politica', id: 543 },
  { name: 'Dir. Comparato', id: 72 },
  { name: "L'Intervista", id: 333 },
  { name: 'Ripetiamo il Diritto', id: 707 },
];

export async function GET() {
  try {
    // Ogni chiamata è indipendente: se una va in timeout, le altre restano.
    const json = (url: string) => fetch(url, CACHE()).then(r => r.json()).catch(() => []);
    const [cats, og, odl, fascicoli] = await Promise.all([
      json('https://orizzontegiuridico.com/wp-json/wp/v2/categories?per_page=100'),
      json('https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=6'),
      json('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=4'),
      json('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/media?mime_type=application/pdf&per_page=1&orderby=date&order=desc'),
    ]);

    const ogPosts = Array.isArray(og) ? og.map((p: any) => ({ ...p, _source: 'og' })) : [];
    const odlPosts = Array.isArray(odl) ? odl.map((p: any) => ({ ...p, _source: 'odl' })) : [];
    const articles = [...ogPosts, ...odlPosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const fascicolo = Array.isArray(fascicoli) && fascicoli.length > 0
      ? { url: fascicoli[0].source_url, title: fascicoli[0].title?.rendered || 'Ultimo fascicolo' }
      : null;

    // Storie: una sola richiesta (gli ultimi 50 articoli, con la sola
    // immagine di copertina) smistata per categoria, invece di una richiesta
    // per categoria. L'hosting di WordPress ha un limite di processi
    // contemporanei e con 14 richieste parallele rispondeva 508.
    const recenti = await json(
      'https://orizzontegiuridico.com/wp-json/wp/v2/posts?per_page=50&_embed=wp:featuredmedia&_fields=id,date,slug,link,title,excerpt,categories,_links,_embedded'
    );
    // Quanti articoli ha ogni categoria tra gli ultimi 50: le più frequenti
    // restano sempre nella barra delle storie (grigie se non c'è niente di nuovo)
    const frequenza: Record<string, number> = {};
    const storyPosts: Record<string, any[]> = {};
    for (const { name, id } of STORY_CATS) {
      frequenza[name] = Array.isArray(recenti) ? recenti.filter((p: any) => Array.isArray(p.categories) && p.categories.includes(id)).length : 0;
      storyPosts[name] = Array.isArray(recenti)
        ? recenti.filter((p: any) => Array.isArray(p.categories) && p.categories.includes(id)).slice(0, 5)
        : [];
    }

    return NextResponse.json({ cats, articles, fascicolo, storyPosts, frequenza }, { headers: INTESTAZIONI });
  } catch {
    return NextResponse.json({ cats: [], articles: [], fascicolo: null, storyPosts: {} });
  }
}
