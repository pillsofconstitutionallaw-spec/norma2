import { NextResponse } from 'next/server';

// 1 minuto: con 300 (e prima 3600) le storie restavano indietro anche ad
// articolo già pubblicato. In più /api/controlla-articoli invalida questa
// cache appena trova un articolo nuovo (revalidatePath).
export const revalidate = 60;
const CACHE = { next: { revalidate: 60 } };

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
    const [catsRes, ogRes, odlRes, fascicoloRes] = await Promise.all([
      fetch('https://orizzontegiuridico.com/wp-json/wp/v2/categories?per_page=100', CACHE),
      fetch('https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=6', CACHE),
      fetch('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=4', CACHE),
      fetch('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/media?mime_type=application/pdf&per_page=1&orderby=date&order=desc', CACHE),
    ]);

    const [cats, og, odl, fascicoli] = await Promise.all([
      catsRes.json(),
      ogRes.json(),
      odlRes.json(),
      fascicoloRes.json(),
    ]);

    const ogPosts = Array.isArray(og) ? og.map((p: any) => ({ ...p, _source: 'og' })) : [];
    const odlPosts = Array.isArray(odl) ? odl.map((p: any) => ({ ...p, _source: 'odl' })) : [];
    const articles = [...ogPosts, ...odlPosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const fascicolo = Array.isArray(fascicoli) && fascicoli.length > 0
      ? { url: fascicoli[0].source_url, title: fascicoli[0].title?.rendered || 'Ultimo fascicolo' }
      : null;

    const storyResults = await Promise.all(
      STORY_CATS.map(({ id }) =>
        fetch(`https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&categories=${id}&per_page=5`, CACHE)
          .then(r => r.json())
          .catch(() => [])
      )
    );

    const storyPosts: Record<string, any[]> = {};
    STORY_CATS.forEach(({ name }, i) => {
      storyPosts[name] = Array.isArray(storyResults[i]) ? storyResults[i] : [];
    });

    return NextResponse.json({ cats, articles, fascicolo, storyPosts });
  } catch {
    return NextResponse.json({ cats: [], articles: [], fascicolo: null, storyPosts: {} });
  }
}
