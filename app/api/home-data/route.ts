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
// WordPress (hosting condiviso) a volte impiega 7-8 s anche per richieste
// piccole: con 8 s di limite le richieste con le immagini scadevano e la Home
// riceveva liste vuote. 20 s, e la funzione può durare fino a 60.
export const maxDuration = 60;
const CACHE = () => ({ next: { revalidate: 30 }, signal: AbortSignal.timeout(20000) });
const INTESTAZIONI = { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=30' };

export async function GET() {
  try {
    // Ogni chiamata è indipendente: se una va in timeout, le altre restano.
    const json = (url: string) => fetch(url, CACHE()).then(r => r.json()).catch(() => []);

    // Verso Orizzonte Giuridico (hosting lento, con limite di processi) una
    // sola richiesta: gli ultimi 50 articoli con copertina e categoria servono
    // sia al feed (i primi 6) sia alle storie. Prima erano tre richieste
    // (categorie, ultimi 6, ultimi 50) e con WordPress lento scadevano.
    const [recenti, odl, fascicoli] = await Promise.all([
      json('https://orizzontegiuridico.com/wp-json/wp/v2/posts?per_page=50&_embed=wp:featuredmedia,wp:term&_fields=id,date,slug,link,title,excerpt,categories,_links,_embedded'),
      json('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=4'),
      json('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/media?mime_type=application/pdf&per_page=1&orderby=date&order=desc'),
    ]);

    const ogPosts = Array.isArray(recenti) ? recenti.slice(0, 6).map((p: any) => ({ ...p, _source: 'og' })) : [];
    const odlPosts = Array.isArray(odl) ? odl.map((p: any) => ({ ...p, _source: 'odl' })) : [];
    const articles = [...ogPosts, ...odlPosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const fascicolo = Array.isArray(fascicoli) && fascicoli.length > 0
      ? { url: fascicoli[0].source_url, title: fascicoli[0].title?.rendered || 'Ultimo fascicolo' }
      : null;

    // Storie: le categorie si ricavano dagli articoli stessi (nome vero da
    // WordPress), così qualsiasi categoria in cui si pubblica compare, anche
    // nuova (prima c'era un elenco fisso di 14 e, per esempio, "Diritto
    // canonico" restava fuori). In più una storia per Orizzonti del Diritto.
    const decodifica = (t: string) => String(t || '')
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"').trim();
    const ESCLUSE = /^(senza categoria|uncategorized|in evidenza|primo piano)$/i;
    const perCategoria = new Map<number, { id: number; name: string; posts: any[] }>();
    for (const p of Array.isArray(recenti) ? recenti : []) {
      const termini: any[] = (p?._embedded?.['wp:term'] ?? []).flat().filter((t: any) => t?.taxonomy === 'category');
      for (const t of termini) {
        const name = decodifica(t.name);
        if (!name || ESCLUSE.test(name)) continue;
        if (!perCategoria.has(t.id)) perCategoria.set(t.id, { id: t.id, name, posts: [] });
        perCategoria.get(t.id)!.posts.push({ ...p, _source: 'og' });
      }
    }
    if (odlPosts.length > 0) perCategoria.set(-1, { id: -1, name: 'Orizzonti del Diritto', posts: odlPosts });

    // Quanti articoli ha ogni categoria tra quelli recenti: le più frequenti
    // restano sempre nella barra delle storie (grigie se non c'è niente di nuovo)
    const frequenza: Record<string, number> = {};
    const storyPosts: Record<string, any[]> = {};
    const storyCats: { id: number; name: string }[] = [];
    for (const { id, name, posts } of perCategoria.values()) {
      frequenza[name] = posts.length;
      storyPosts[name] = posts.slice(0, 5);
      storyCats.push({ id, name });
    }

    // Se WordPress non ha risposto in tempo non si mette in cache una Home
    // vuota: la prossima richiesta riprova subito.
    const vuota = ogPosts.length === 0;
    return NextResponse.json(
      { cats: storyCats, articles, fascicolo, storyPosts, frequenza },
      { headers: vuota ? { 'Cache-Control': 'no-store' } : INTESTAZIONI },
    );
  } catch {
    return NextResponse.json({ cats: [], articles: [], fascicolo: null, storyPosts: {} });
  }
}
