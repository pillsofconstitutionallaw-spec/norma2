import { NextResponse } from 'next/server';

export const revalidate = 3600; // cache 1 ora

const STORY_CATS = [
  { name: 'Penale', id: 48 },
  { name: 'Civile', id: 682 },
  { name: 'Costituzionale', id: 39 },
  { name: 'Ambiente', id: 220 },
  { name: 'Legalità', id: 320 },
  { name: 'Internazionale', id: 140 },
];

export async function GET() {
  try {
    const [catsRes, ogRes, odlRes, fascicoloRes] = await Promise.all([
      fetch('https://orizzontegiuridico.com/wp-json/wp/v2/categories?per_page=100', { next: { revalidate: 300 } }),
      fetch('https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=6', { next: { revalidate: 300 } }),
      fetch('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=4', { next: { revalidate: 300 } }),
      fetch('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/media?mime_type=application/pdf&per_page=1&orderby=date&order=desc', { next: { revalidate: 300 } }),
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
        fetch(`https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&categories=${id}&per_page=5`, { next: { revalidate: 300 } })
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
