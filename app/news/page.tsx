import NewsClient from './NewsClient';

export const revalidate = 3600;

type NewsItem = {
  titolo: string;
  link: string;
  data: string;
  anteprima: string;
  fonte: string;
  categoria: string;
};

const FONTI = [
  {
    nome: 'Altalex',
    url: 'https://www.altalex.com/feed/news',
    categoria: 'Normativa',
    colore: '#f97316',
  },
  {
    nome: 'Gazzetta Ufficiale',
    url: 'https://www.gazzettaufficiale.it/dynamicindex/rss/GU_rss.jsp',
    categoria: 'GU',
    colore: '#ffd700',
  },
  {
    nome: 'Diritto.it',
    url: 'https://www.diritto.it/feed/',
    categoria: 'Giurisprudenza',
    colore: '#fb7185',
  },
  {
    nome: 'Corte Costituzionale',
    url: 'https://www.cortecostituzionale.it/rss/rss.xml',
    categoria: 'Costituzionale',
    colore: '#38bdf8',
  },
];

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseData(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

async function fetchFonte(fonte: typeof FONTI[0]): Promise<NewsItem[]> {
  try {
    const res = await fetch(fonte.url, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; OrizzonteFeed/1.0)' },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const items: NewsItem[] = [];

    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];

    for (const item of itemMatches.slice(0, 20)) {
      const titolo = stripHtml(
        item.match(/<title[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ??
        item.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ??
        ''
      );

      const link =
        item.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1]?.trim() ??
        item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1]?.trim() ??
        '';

      const pubDate =
        item.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() ??
        item.match(/<dc:date[^>]*>([\s\S]*?)<\/dc:date>/)?.[1]?.trim() ??
        '';

      const descrizione = stripHtml(
        item.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ??
        item.match(/<description[^>]*>([\s\S]*?)<\/description>/)?.[1] ??
        ''
      ).slice(0, 160);

      if (!titolo || !link) continue;

      items.push({
        titolo,
        link,
        data: parseData(pubDate),
        anteprima: descrizione,
        fonte: fonte.nome,
        categoria: fonte.categoria,
      });
    }

    return items;
  } catch {
    return [];
  }
}

function detectCategoria(titolo: string, categoriaDefault: string): string {
  const t = titolo.toLowerCase();
  if (t.includes('penale') || t.includes('reato') || t.includes('condanna') || t.includes('omicidio') || t.includes('processo pen')) return 'Penale';
  if (t.includes('civile') || t.includes('contratto') || t.includes('risarcimento') || t.includes('proprietà') || t.includes('successione')) return 'Civile';
  if (t.includes('costituzional') || t.includes('corte cost') || t.includes('consulta')) return 'Costituzionale';
  if (t.includes('europa') || t.includes('ue') || t.includes('cgue') || t.includes('direttiva') || t.includes('regolamento ue')) return 'UE';
  if (t.includes('lavoro') || t.includes('licenziamento') || t.includes('inps') || t.includes('ccnl') || t.includes('dipendente')) return 'Lavoro';
  if (t.includes('gazzetta ufficiale') || t.includes('decreto legge') || t.includes('legge n.') || t.includes('d.lgs')) return 'GU';
  if (t.includes('fisco') || t.includes('tribut') || t.includes('iva') || t.includes('irpef') || t.includes('agenzia entrate')) return 'Tributario';
  if (t.includes('amministrativ') || t.includes('tar') || t.includes('comune') || t.includes('appalto')) return 'Amministrativo';
  return categoriaDefault;
}

export default async function NewsPage() {
  const risultati = await Promise.allSettled(FONTI.map(fetchFonte));

  const tutteLeNews: NewsItem[] = risultati
    .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    .map((n) => ({ ...n, categoria: detectCategoria(n.titolo, n.categoria) }))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 50);

  const aggiornato = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  return <NewsClient news={tutteLeNews} aggiornato={aggiornato} />;
}