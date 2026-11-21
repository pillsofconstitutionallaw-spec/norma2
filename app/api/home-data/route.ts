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

    // Verso Orizzonte Giuridico (hosting lento, con limite di processi) una
    // sola richiesta: gli ultimi 50 articoli con copertina e categoria servono
    // sia al feed (i primi 6) sia alle storie. Prima erano tre richieste
    // (categorie, ultimi 6, ultimi 50) e con WordPress lento scadevano.
    const [recenti, odl, fascicoli] = await Promise.all([
      json('https://orizzontegiuridico.com/wp-json/wp/v2/posts?per_page=50&_embed=wp:featuredmedia,wp:term&_fields=id,date,slug,link,title,excerpt,categories,_links,_embedded'),
      json('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=4'),
      json('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/media?mime_type=application/pdf&per_page=1&orderby=date&order=desc'),
    ]);
    // Le categorie hanno id fissi (STORY_CATS): niente richiesta apposta.
    const cats = STORY_CATS;

    const ogPosts = Array.isArray(recenti) ? recenti.slice(0, 6).map((p: any) => ({ ...p, _source: 'og' })) : [];
    const odlPosts = Array.isArray(odl) ? odl.map((p: any) => ({ ...p, _source: 'odl' })) : [];
    const articles = [...ogPosts, ...odlPosts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const fascicolo = Array.isArray(fascicoli) && fascicoli.length > 0
      ? { url: fascicoli[0].source_url, title: fascicoli[0].title?.rendered || 'Ultimo fascicolo' }
      : null;

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

    // Se WordPress non ha risposto in tempo non si mette in cache una Home
    // vuota: la prossima richiesta riprova subito.
    const vuota = ogPosts.length === 0;
    return NextResponse.json(
      { cats, articles, fascicolo, storyPosts, frequenza },
      { headers: vuota ? { 'Cache-Control': 'no-store' } : INTESTAZIONI },
    );
  } catch {
    return NextResponse.json({ cats: [], articles: [], fascicolo: null, storyPosts: {} });
  }
}
