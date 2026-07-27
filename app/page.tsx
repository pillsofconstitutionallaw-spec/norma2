'use client';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeedCard from '@/components/home/FeedCard';

/* ─── StoryTimer (invariato) ─── */
function StoryTimer({ onTick, onEnd }: { onTick: (p: number) => void; onEnd: () => void }) {
  useEffect(() => {
    const duration = 6000;
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min((elapsed / duration) * 100, 100);
      onTick(pct);
      if (elapsed >= duration) { clearInterval(timer); onEnd(); }
    }, interval);
    return () => clearInterval(timer);
  }, []);
  return null;
}

/* ─── InstagramEmbed (invariato) ─── */
function InstagramEmbed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [profilePic] = useState('/logo-og.png');
  useEffect(() => {
    function carica() {
      fetch('/api/instagram')
        .then(r => r.json())
        .then(data => {
          if (data.data?.length) setPosts(data.data.slice(0, 9));
          // Griglia vuota = token scaduto o mancante: senza questo log
          // il feed sparisce senza lasciare traccia da nessuna parte.
          else console.error('[instagram] feed vuoto:', data.error ?? data);
        })
        .catch(e => console.error('[instagram] fetch fallita:', e));
    }
    carica();

    // In una PWA la pagina non si smonta mai: senza questo, chi tiene l'app
    // aperta o la riapre dal background continua a vedere la griglia di
    // quando l'ha aperta la prima volta.
    function alRitorno() {
      if (document.visibilityState === 'visible') carica();
    }
    document.addEventListener('visibilitychange', alRitorno);
    return () => document.removeEventListener('visibilitychange', alRitorno);
  }, []);
  return (
    <div style={{ background: '#111526', borderRadius: 18, overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.06)', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 2, borderRadius: '50%', background: 'linear-gradient(135deg,#ff9966,#ff5e62,#d6249f,#285AEB)' }}>
            <img src={profilePic} alt="" width={38} height={38} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #111526', display: 'block' }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 12 }}>Orizzonte Giuridico</div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10 }}>@orizzonte.giuridico</div>
          </div>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, background: '#050816' }}>
        {(posts.length > 0 ? posts : Array.from({ length: 9 }).map(() => ({}))).map((post: any, i: number) => (
          <a key={i} href={post.permalink || 'https://www.instagram.com/orizzonte.giuridico/'} target="_blank" rel="noreferrer"
            style={{ display: 'block', position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#07162b', textDecoration: 'none' }}>
            {post.media_url && (
              <img src={post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url} alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
            {post.media_type === 'VIDEO' && <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '2px 5px', fontSize: 9, color: '#fff' }}>▶</div>}
            {post.media_type === 'CAROUSEL_ALBUM' && <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '2px 5px', fontSize: 9, color: '#fff' }}>⊞</div>}
          </a>
        ))}
      </div>
      <a href="https://www.instagram.com/orizzonte.giuridico/" target="_blank" rel="noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', color: '#8fd3ff', fontSize: 10, fontWeight: 700, letterSpacing: 1, textDecoration: 'none', borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
        SEGUI @ORIZZONTE.GIURIDICO →
      </a>
    </div>
  );
}

/* ─── Dati statici ─── */
const staticCategories = [
  { id: 48,  name: 'Penale' },
  { id: 682, name: 'Civile' },
  { id: 39,  name: 'Costituzionale' },
  { id: 220, name: 'Ambiente' },
  { id: 249, name: 'Unione Europea' },
  { id: 86,  name: 'Amministrativo' },
  { id: 140, name: 'Internazionale' },
  { id: 834, name: 'Animali' },
  { id: 320, name: 'Legalità' },
  { id: 55,  name: 'Economia' },
  { id: 543, name: 'Politica' },
  { id: 72,  name: 'Dir. Comparato' },
  { id: 333, name: "L'Intervista" },
  { id: 707, name: 'Ripetiamo il Diritto' },
];

const icons: Record<string, React.ReactNode> = {
  Penale: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M12 3L19 6V11C19 16 15.5 20 12 21C8.5 20 5 16 5 11V6L12 3Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Civile: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Costituzionale: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M7 3H17L21 7V21H3V3H7Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M17 3V7H21" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M7 12H17M7 16H13" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Ambiente: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 5 15 5 9C5 5.69 8.13 3 12 3C15.87 3 19 5.69 19 9C19 15 12 21 12 21Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 9V21" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  'Unione Europea': <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Amministrativo: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Internazionale: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="12" r="2" fill="#8fd3ff" opacity="0.5"/></svg>,
  Animali: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="6" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="17" cy="6" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="4" cy="12" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="20" cy="12" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><path d="M12 10C9 10 6 13 7 17C8 20 10 21 12 21C14 21 16 20 17 17C18 13 15 10 12 10Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Legalità: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinejoin="round"/><path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinejoin="round"/><path d="M3 21H21" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Economia: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17,6 21,6 21,10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Politica: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Dir. Comparato': <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M4 19V5H12V19M12 5H20V19" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 19H22" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  "L'Intervista": <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="11" rx="3" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M5 10C5 14.4 8.13 18 12 18C15.87 18 19 14.4 19 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 18V22M9 22H15" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  'Ripetiamo il Diritto': <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M22 10V6L12 2L2 6V10C2 15.5 6.5 20.7 12 22C17.5 20.7 22 15.5 22 10Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 8V13L15 15" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

const shortNames: Record<string, string> = {
  Costituzionale: 'Cost.',
  'Unione Europea': 'UE',
  Amministrativo: 'Amm.',
  Internazionale: 'Int.',
  'Dir. Comparato': 'Comp.',
  "L'Intervista": 'Interv.',
  'Ripetiamo il Diritto': 'Ripetiamo',
};

const slides = [
  {
    tag: 'Benvenuto',
    title: 'Norma,<br>il diritto a portata di <em style="color:#8fd3ff;">swipe</em>.',
    sub: 'Il diritto semplice, a spiegarlo ci pensiamo noi.',
    img: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800&q=80',
  },
  {
    tag: 'Chi siamo',
    title: "Un'associazione.<br>Una rivista.",
    sub: "Orizzonte Giuridico è un'associazione culturale di giovani giuristi e studenti. Pubblichiamo articoli, saggi e pillole giuridiche per rendere il diritto accessibile a tutti.",
    img: '',
  },
  {
    tag: 'Costituzione',
    title: "La Costituzione.<br>Articolo per articolo.",
    sub: 'Esplora tutti i 139 articoli della Costituzione italiana con spiegazioni chiare, lettura vocale e riferimenti giurisprudenziali aggiornati.',
    img: '',
  },
  {
    tag: 'Orizzonti del Diritto',
    title: "La nostra<br>rivista giuridica.",
    sub: 'Orizzonti del Diritto è la rivista ufficiale di Orizzonte Giuridico. Saggi, approfondimenti e ricerca giuridica curati dai nostri autori.',
    img: '',
  },
];

const FESTE_CIVILI = [
  { mese: 1, giorno: 1, nome: 'Costituzione in vigore', emoji: '📜', colore: '#38bdf8', bordoTop: 'linear-gradient(90deg,#009246,#fff 50%,#ce2b37)', breve: '1° gennaio 1948: entra in vigore la Costituzione della Repubblica.', descrizione: "Approvata dall'Assemblea Costituente il 22 dicembre 1947 e promulgata il 27 dicembre, la Costituzione italiana entrò in vigore il 1° gennaio 1948. È composta da 139 articoli e 18 disposizioni transitorie. I primi 12 articoli — i Principi Fondamentali — non sono modificabili nella loro essenza." },
  { mese: 1, giorno: 27, nome: 'Giorno della Memoria', emoji: '🕯️', colore: '#a78bfa', bordoTop: 'linear-gradient(90deg,#a78bfa,#818cf8)', breve: 'Si ricordano le vittime della Shoah e delle leggi razziali.', descrizione: "Istituito con la legge n. 211/2000, il 27 gennaio commemora le vittime dell'Olocausto. Il 27 gennaio 1945 le truppe sovietiche liberarono Auschwitz. In Italia, le leggi razziali fasciste del 1938 privarono migliaia di cittadini dei diritti fondamentali." },
  { mese: 2, giorno: 10, nome: 'Giorno del Ricordo', emoji: '🕯️', colore: '#f59e0b', bordoTop: 'linear-gradient(90deg,#f59e0b,#ef4444)', breve: 'Si ricordano le vittime delle foibe e l\'esodo giuliano-dalmata.', descrizione: "Istituito con la legge n. 92/2004, commemora i massacri delle foibe e l'esodo forzato di oltre 250.000 italiani dall'Istria, Fiume e Dalmazia." },
  { mese: 4, giorno: 25, nome: 'Festa della Liberazione', emoji: '🕊️', colore: '#38bdf8', bordoTop: 'linear-gradient(90deg,#38bdf8,#818cf8)', breve: '25 aprile 1945: fine dell\'occupazione nazifascista.', descrizione: "Il 25 aprile 1945 i partigiani insorsero nelle principali città del Nord. È festa nazionale dal 1949 (legge n. 260). La Resistenza ispira i valori fondanti della Repubblica." },
  { mese: 5, giorno: 1, nome: 'Festa dei Lavoratori', emoji: '⚙️', colore: '#ef4444', bordoTop: 'linear-gradient(90deg,#ef4444,#f97316)', breve: 'Si celebra il lavoro come fondamento della Repubblica.', descrizione: "L'art. 1 Cost. recita: «L'Italia è una Repubblica democratica, fondata sul lavoro». È festa nazionale dal 1945." },
  { mese: 5, giorno: 23, nome: 'Strage di Capaci — Giovanni Falcone', emoji: '⚖️', colore: '#fbbf24', bordoTop: 'linear-gradient(90deg,#fbbf24,#f97316)', breve: '23 maggio 1992: la mafia uccise Giovanni Falcone.', descrizione: "Alle 17:58 del 23 maggio 1992, un'autobomba sulla A29 vicino Capaci uccise il giudice Giovanni Falcone, la moglie Francesca Morvillo e tre agenti della scorta." },
  { mese: 6, giorno: 2, nome: 'Festa della Repubblica', emoji: '🏛️', colore: '#38bdf8', bordoTop: 'linear-gradient(90deg,#009246,#fff 50%,#ce2b37)', breve: '2 giugno 1946: gli italiani scelgono la Repubblica.', descrizione: "Il 2 giugno 1946, con il referendum istituzionale, i cittadini italiani votarono per la forma dello Stato. La Repubblica prevalse sulla Monarchia con il 54,3% dei voti." },
  { mese: 7, giorno: 19, nome: 'Strage di Via D\'Amelio — Paolo Borsellino', emoji: '⚖️', colore: '#fbbf24', bordoTop: 'linear-gradient(90deg,#fbbf24,#ef4444)', breve: '19 luglio 1992: la mafia uccise Paolo Borsellino.', descrizione: "Solo 57 giorni dopo Capaci, il 19 luglio 1992 un'autobomba in Via D'Amelio uccise il giudice Paolo Borsellino e cinque agenti della scorta." },
  { mese: 12, giorno: 10, nome: 'Giornata dei Diritti Umani', emoji: '🌍', colore: '#38bdf8', bordoTop: 'linear-gradient(90deg,#38bdf8,#a78bfa)', breve: '10 dicembre 1948: l\'ONU adotta la Dichiarazione Universale dei Diritti Umani.', descrizione: "Il 10 dicembre 1948 l'Assemblea Generale dell'ONU approvò la UDHR, 30 articoli che riconoscono i diritti fondamentali di ogni essere umano." },
];

/* ─── Componente principale ─── */
export default function NormaHome() {
  const [mounted, setMounted] = useState(false);
  const [festaCivile, setFestaCivile] = useState<typeof FESTE_CIVILI[0] | null>(null);
  const [festaEspansa, setFestaEspansa] = useState(false);
  const [cur, setCur] = useState(0);
  const touchStartX = useRef<number>(0);
  const wheelTimeout = useRef<any>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(staticCategories);
  const [fascicolo, setFascicolo] = useState<{ url: string; title: string } | null>(null);

  /* ── Feed state ── */
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [feedPage, setFeedPage] = useState(1);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedHasMore, setFeedHasMore] = useState(true);
  const feedEndRef = useRef<HTMLDivElement>(null);

  /* ── Story state (invariato) ── */
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyCatIndex, setStoryCatIndex] = useState(0);
  const [storyCatName, setStoryCatName] = useState('');
  const [storyPosts, setStoryPosts] = useState<any[]>([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyCache = useRef<Record<string, any[]>>({});
  const STORY_LS_KEY = 'norma_story_cache_v2';
  const STORY_LS_TTL = 60 * 60 * 1000;
  const SEEN_KEY = 'norma_story_seen_v1';
  const [newCategories, setNewCategories] = useState<Set<string>>(new Set());
  const seenRef = useRef<Record<string, string>>({});

  /* ── Infinite scroll ── */
  useEffect(() => {
    if (!feedEndRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !feedLoading && feedHasMore) loadMoreFeed();
      },
      { threshold: 0.1 }
    );
    observer.observe(feedEndRef.current);
    return () => observer.disconnect();
  }, [feedLoading, feedHasMore, feedPosts.length]);

  async function loadMoreFeed() {
    if (feedLoading) return;
    setFeedLoading(true);
    try {
      const nextPage = feedPage + 1;
      const [ogRes, odlRes] = await Promise.all([
        fetch(`https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=5&page=${nextPage}`).then(r => r.json()).catch(() => []),
        fetch(`https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=3&page=${nextPage}`).then(r => r.json()).catch(() => []),
      ]);
      const og = Array.isArray(ogRes) ? ogRes.map((p: any) => ({ ...p, _source: 'og' })) : [];
      const odl = Array.isArray(odlRes) ? odlRes.map((p: any) => ({ ...p, _source: 'odl' })) : [];
      const merged = [...og, ...odl].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (merged.length < 3) setFeedHasMore(false);
      setFeedPosts(prev => [...prev, ...merged]);
      setFeedPage(nextPage);
    } catch {
      setFeedHasMore(false);
    } finally {
      setFeedLoading(false);
    }
  }

  /* ── Story helpers (invariati) ── */
  function salvaStoryCacheLS() {
    try { localStorage.setItem(STORY_LS_KEY, JSON.stringify({ ts: Date.now(), data: storyCache.current })); } catch {}
  }

  function computeNewCategories() {
    const news = new Set<string>();
    Object.entries(storyCache.current).forEach(([name, posts]) => {
      if (!Array.isArray(posts) || posts.length === 0) return;
      const latestDate = posts[0]?.date as string;
      const seenDate = seenRef.current[name];
      if (!seenDate || latestDate > seenDate) news.add(name);
    });
    setNewCategories(news);
  }

  function markSeen(name: string) {
    const posts = storyCache.current[name];
    if (posts?.[0]?.date) {
      seenRef.current[name] = posts[0].date as string;
      try { localStorage.setItem(SEEN_KEY, JSON.stringify(seenRef.current)); } catch {}
      setNewCategories(prev => { const next = new Set(prev); next.delete(name); return next; });
    }
  }

  async function loadCatPosts(name: string, catId: number): Promise<any[]> {
    if (storyCache.current[name]) return storyCache.current[name];
    try {
      const postsRes = await fetch(`https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&categories=${catId}&per_page=5`);
      const data = await postsRes.json();
      const posts = Array.isArray(data) ? data : [];
      storyCache.current[name] = posts;
      salvaStoryCacheLS();
      return posts;
    } catch { return []; }
  }

  /* ── Ordinamento storie per recency (stile IG: categoria con l'articolo più recente prima) ── */
  function categoryLatestDates(): Record<string, string> {
    const map: Record<string, string> = {};
    feedPosts.forEach((p: any) => {
      const terms = p?._embedded?.['wp:term']?.[0] || [];
      terms.forEach((t: any) => {
        if (t?.name && p?.date && (!map[t.name] || p.date > map[t.name])) map[t.name] = p.date;
      });
    });
    Object.entries(storyCache.current).forEach(([name, posts]) => {
      const d = (posts as any[])?.[0]?.date;
      if (d && (!map[name] || d > map[name])) map[name] = d;
    });
    return map;
  }

  function ordinaPerRecency(cats: { id: number; name: string }[]) {
    const dates = categoryLatestDates();
    return [...cats].sort((a, b) => {
      const da = dates[a.name];
      const db = dates[b.name];
      if (da && db) return db.localeCompare(da);
      if (da) return -1;
      if (db) return 1;
      return 0; // categorie senza data: mantengono l'ordine statico
    });
  }

  // Riordina la rail storie quando arrivano nuovi articoli (mai mentre una storia è aperta)
  useEffect(() => {
    if (storyOpen) return;
    setCategories(prev => ordinaPerRecency(prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedPosts, storyOpen]);

  /* ── Mount ── */
  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const m = now.getMonth() + 1;
    const g = now.getDate();
    const festa = FESTE_CIVILI.find(f => f.mese === m && f.giorno === g);
    if (festa) {
      const key = `norma_festa_chiusa_${now.getFullYear()}-${m}-${g}`;
      if (!sessionStorage.getItem(key)) setFestaCivile(festa);
    }
    try {
      const rawSeen = localStorage.getItem(SEEN_KEY);
      if (rawSeen) seenRef.current = JSON.parse(rawSeen);
    } catch {}
    try {
      const raw = localStorage.getItem(STORY_LS_KEY);
      if (raw) {
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts < STORY_LS_TTL && data && typeof data === 'object') {
          storyCache.current = data;
          computeNewCategories();
        }
      }
    } catch {}
  }, []);

  /* ── Fallback: feed direttamente da WordPress se l'API è lenta o vuota ── */
  async function caricaFeedDiretto() {
    try {
      const [ogRes, odlRes] = await Promise.all([
        fetch('https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=6').then(r => r.json()).catch(() => []),
        fetch('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=4').then(r => r.json()).catch(() => []),
      ]);
      const og = Array.isArray(ogRes) ? ogRes.map((p: any) => ({ ...p, _source: 'og' })) : [];
      const odl = Array.isArray(odlRes) ? odlRes.map((p: any) => ({ ...p, _source: 'odl' })) : [];
      const merged = [...og, ...odl].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (merged.length > 0) setFeedPosts(prev => (prev.length === 0 ? merged : prev));
    } catch {}
  }

  /* ── Home data (stories + feed iniziale) ── */
  useEffect(() => {
    fetch('/api/home-data')
      .then(r => r.json())
      .then(({ cats, articles, fascicolo: f, storyPosts: sp }) => {
        if (sp && typeof sp === 'object') {
          Object.entries(sp).forEach(([name, posts]) => {
            if (Array.isArray(posts) && posts.length > 0) storyCache.current[name] = posts as any[];
          });
          salvaStoryCacheLS();
          computeNewCategories();
        }
        if (Array.isArray(cats)) {
          const merged = staticCategories.map(sc => {
            const found = cats.find((d: any) => d.name === sc.name);
            return found ? { ...sc, id: found.id } : sc;
          });
          setCategories(merged);
          merged.slice(0, 6).forEach(cat => {
            if (!storyCache.current[cat.name]) loadCatPosts(cat.name, cat.id);
          });
        }
        if (Array.isArray(articles) && articles.length > 0) setFeedPosts(articles);
        else caricaFeedDiretto();
        if (f) setFascicolo(f);
      })
      .catch(() => {
        caricaFeedDiretto();
        staticCategories.slice(0, 6).forEach(cat => loadCatPosts(cat.name, cat.id));
      });
  }, []);

  /* ── Story controls (invariati) ── */
  async function openStory(catIdx: number) {
    const cat = categories[catIdx];
    markSeen(cat.name);
    navigator.vibrate?.(8);
    setStoryCatIndex(catIdx);
    setStoryCatName(cat.name);
    setStoryIndex(0);
    setStoryProgress(0);
    setStoryOpen(true);
    if (storyCache.current[cat.name]) {
      setStoryPosts(storyCache.current[cat.name]);
      setStoryLoading(false);
    } else {
      setStoryLoading(true);
      const posts = await loadCatPosts(cat.name, cat.id);
      setStoryPosts(posts);
      setStoryLoading(false);
    }
    if (catIdx + 1 < categories.length) loadCatPosts(categories[catIdx + 1].name, categories[catIdx + 1].id);
  }

  async function nextStory() {
    if (storyIndex < storyPosts.length - 1) {
      setStoryIndex(i => i + 1);
      setStoryProgress(0);
    } else {
      const nextCatIdx = storyCatIndex + 1;
      if (nextCatIdx < categories.length) {
        const name = categories[nextCatIdx].name;
        setStoryCatIndex(nextCatIdx);
        setStoryCatName(name);
        setStoryIndex(0);
        setStoryProgress(0);
        if (storyCache.current[name]) {
          setStoryPosts(storyCache.current[name]);
          setStoryLoading(false);
        } else {
          setStoryLoading(true);
          const posts = await loadCatPosts(name, categories[nextCatIdx].id);
          setStoryPosts(posts);
          setStoryLoading(false);
        }
        if (nextCatIdx + 1 < categories.length) loadCatPosts(categories[nextCatIdx + 1].name, categories[nextCatIdx + 1].id);
      } else {
        setStoryOpen(false);
      }
    }
  }

  function prevStory() {
    if (storyIndex > 0) { setStoryIndex(i => i - 1); setStoryProgress(0); }
  }

  /* ─── RENDER ─── */
  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        .cats { display: flex; gap: 18px; overflow-x: auto; padding: 14px 16px 16px; scrollbar-width: none; align-items: flex-start; border-bottom: 0.5px solid rgba(255,255,255,0.06); }
        .cats::-webkit-scrollbar { display: none; }
        .cat-ring { width: 76px; height: 76px; border-radius: 50%; padding: 2.5px; background: linear-gradient(135deg,#0a3060,#8fd3ff); flex-shrink: 0; }
        .cat-ring.seen { background: rgba(255,255,255,0.12); }
        .cat-inn { width: 100%; height: 100%; border-radius: 50%; background: #07162b; border: 2px solid #0a0d18; display: flex; align-items: center; justify-content: center; }
        .slbl { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; padding: 0 16px; }
        .slbl-t { font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.22); font-family: 'Montserrat', sans-serif; }
        .slbl-l { flex: 1; height: 0.5px; background: rgba(255,255,255,0.05); }
        .hero-wrap { position: relative; border-radius: 20px; overflow: hidden; aspect-ratio: 4/5; background: linear-gradient(135deg,#07162b 0%,#0d2040 100%); margin: 0 16px; }
        .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .hero-ov1 { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,15,40,0.95) 0%, rgba(0,15,40,0.7) 45%, rgba(0,15,40,0.05) 100%); }
        .hero-ov2 { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,15,40,0.75) 0%, transparent 50%); }
        .hero-body { position: absolute; bottom: 0; left: 0; padding: 28px 22px 40px; max-width: 88%; display: flex; flex-direction: column; gap: 10px; }
        .hero-tag { font-size: 8px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.65); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; padding: 5px 14px; display: inline-block; align-self: flex-start; font-family: 'Montserrat', sans-serif; }
        .hero-title { font-size: 34px; font-weight: 900; color: #fff; line-height: 1.05; letter-spacing: -0.8px; margin: 0; font-family: 'Montserrat', sans-serif; }
        .hero-sub { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.65; margin: 0; font-family: 'Montserrat', sans-serif; }
        .hero-dots { position: absolute; bottom: 10px; right: 14px; display: flex; gap: 5px; }
        .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.25); }
        .hero-dot.on { width: 14px; border-radius: 10px; background: #fff; }
        a { text-decoration: none; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0a0d18', fontFamily: "'Montserrat', sans-serif" }}>
        <Header />

        <main style={{ paddingBottom: 100 }}>

          {/* ── Banner festa civile ── */}
          {festaCivile && (
            <div style={{ margin: '12px 16px 0', borderRadius: 18, overflow: 'hidden', position: 'relative', background: '#0d1526', border: `0.5px solid ${festaCivile.colore}44` }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: festaCivile.bordoTop }} />
              <div onClick={() => setFestaEspansa(e => !e)} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
                <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{festaCivile.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: festaCivile.colore, marginBottom: 4, opacity: 0.8 }}>Oggi · Festa Civile</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 3 }}>{festaCivile.nome}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{festaCivile.breve}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, alignSelf: 'flex-start', paddingTop: 2 }}>
                  <button onClick={e => { e.stopPropagation(); const now = new Date(); sessionStorage.setItem(`norma_festa_chiusa_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`, '1'); setFestaCivile(null); }} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 26, height: 26, color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  <div style={{ textAlign: 'center', fontSize: 13, color: `${festaCivile.colore}99`, transition: 'transform 0.2s', transform: festaEspansa ? 'rotate(180deg)' : 'none' }}>▾</div>
                </div>
              </div>
              {festaEspansa && (
                <div style={{ padding: '0 16px 16px', borderTop: `0.5px solid ${festaCivile.colore}22` }}>
                  <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '12px 0 0' }}>{festaCivile.descrizione}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Stories rail (invariato) ── */}
          <div className="cats">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => openStory(idx)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flexShrink: 0, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, width: 82 }}
              >
                <div
                  className={`cat-ring${newCategories.has(cat.name) ? '' : ' seen'}`}
                  style={newCategories.has(cat.name) ? { boxShadow: '0 0 14px rgba(143,211,255,0.4)' } : undefined}
                >
                  <div className="cat-inn">
                    {icons[cat.name] || <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#8fd3ff" strokeWidth="1.8"/></svg>}
                  </div>
                </div>
                <span style={{ fontSize: cat.name.length > 12 ? 9 : 10, fontWeight: 700, color: newCategories.has(cat.name) ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.38)', lineHeight: 1.2, textAlign: 'center', display: 'block', maxWidth: 80 }}>
                  {shortNames[cat.name] || cat.name}
                </span>
              </button>
            ))}
          </div>

          {/* ── Carosello "Cos'è Norma" ── */}
          <div style={{ paddingTop: 20 }}>
            <div className="slbl">
              <span className="slbl-t">Cos'è Norma</span>
              <div className="slbl-l" />
            </div>
            <div
              className="hero-wrap"
              onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
              onTouchEnd={e => {
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 30) {
                  if (diff > 0) setCur(p => (p + 1) % slides.length);
                  else setCur(p => (p - 1 + slides.length) % slides.length);
                }
              }}
              onWheel={e => {
                if (Math.abs(e.deltaX) < 10) return;
                if (wheelTimeout.current) return;
                wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 600);
                if (e.deltaX > 0) setCur(p => (p + 1) % slides.length);
                else setCur(p => (p - 1 + slides.length) % slides.length);
              }}
            >
              {mounted && slides[cur].img ? (
                <>
                  <img className="hero-img" src={slides[cur].img} alt="" />
                  <div className="hero-ov1" />
                  <div className="hero-ov2" />
                  <div className="hero-body">
                    <span className="hero-tag">{slides[cur].tag}</span>
                    <div className="hero-title" dangerouslySetInnerHTML={{ __html: slides[cur].title }} />
                    <div className="hero-sub">{slides[cur].sub}</div>
                  </div>
                </>
              ) : (
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#07162b 0%,#0d2040 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 28px', gap: 20 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right,#8fd3ff44,#8fd3ff,#8fd3ff44)' }} />
                  <span style={{ display: 'inline-block', fontSize: 8, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#8fd3ff', border: '1px solid rgba(143,211,255,0.3)', borderRadius: 20, padding: '5px 14px', alignSelf: 'flex-start', fontFamily: 'Montserrat, sans-serif' }}>{slides[cur].tag}</span>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: -0.8, fontFamily: 'Montserrat, sans-serif' }} dangerouslySetInnerHTML={{ __html: slides[cur].title }} />
                  <div style={{ width: 40, height: 2, borderRadius: 1, background: 'rgba(143,211,255,0.4)' }} />
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, maxWidth: '95%', fontFamily: 'Montserrat, sans-serif' }}>{slides[cur].sub}</div>
                </div>
              )}
              <div className="hero-dots">
                {slides.map((_, i) => <div key={i} className={`hero-dot${i === cur ? ' on' : ''}`} />)}
              </div>
            </div>
          </div>

          {/* ── Feed IG ── */}
          <div style={{ marginTop: 20, borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
            <div className="slbl" style={{ paddingTop: 20 }}>
              <span className="slbl-t">Ultimi articoli</span>
              <div className="slbl-l" />
            </div>

            {feedPosts.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} style={{ marginBottom: 2, borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#111526' }} className="shimmer" />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 10, borderRadius: 6, width: '55%', marginBottom: 5 }} className="shimmer" />
                        <div style={{ height: 8, borderRadius: 6, width: '35%' }} className="shimmer" />
                      </div>
                    </div>
                    <div style={{ aspectRatio: '4/5' }} className="shimmer" />
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ height: 12, borderRadius: 6, width: '80%', marginBottom: 8 }} className="shimmer" />
                      <div style={{ height: 10, borderRadius: 6, width: '50%' }} className="shimmer" />
                    </div>
                  </div>
                ))
              : feedPosts.map((post, i) => (
                  <FeedCard key={post.id ?? `${post.slug}-${i}`} post={post} priority={i === 0} />
                ))
            }

            {/* Spinner infinite scroll */}
            {feedLoading && (
              <div style={{ padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(143,211,255,0.2)', borderTop: '2px solid #8fd3ff', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {/* Sentinel per IntersectionObserver */}
            <div ref={feedEndRef} style={{ height: 1 }} />

            {/* Vedi tutti */}
            <div style={{ padding: '8px 16px 4px' }}>
              <a href="/articoli" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 16, background: 'rgba(143,211,255,0.08)', border: '0.5px solid rgba(143,211,255,0.2)', color: '#8fd3ff', fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>
                VEDI TUTTI GLI ARTICOLI →
              </a>
            </div>

            {/* Fascicolo */}
            {fascicolo && (
              <div style={{ padding: '4px 16px 8px' }}>
                <a href={fascicolo.url} target="_blank" rel="noreferrer" download style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 0', borderRadius: 16, background: 'rgba(168,200,240,0.08)', border: '0.5px solid rgba(168,200,240,0.25)', color: '#a8c8f0', fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8c8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  SCARICA L'ULTIMO FASCICOLO
                </a>
              </div>
            )}
          </div>

          {/* ── Instagram ── */}
          <div style={{ marginTop: 8 }}>
            <div className="slbl">
              <span className="slbl-t">Instagram</span>
              <div className="slbl-l" />
            </div>
            <div style={{ padding: '0 16px' }}>
              <InstagramEmbed />
            </div>
          </div>

          {/* ── Social ── */}
          <div style={{ marginTop: 4 }}>
            <div className="slbl">
              <span className="slbl-t">Seguici</span>
              <div className="slbl-l" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px 8px' }}>
              <a href="https://www.instagram.com/orizzonte.giuridico/" target="_blank" rel="noreferrer" style={{ borderRadius: 16, background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'Montserrat, sans-serif' }}>INSTAGRAM</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, fontFamily: 'Montserrat, sans-serif' }}>@orizzonte.giuridico</span>
              </a>
              <a href="https://www.tiktok.com/@orizzonte.giuridi" target="_blank" rel="noreferrer" style={{ borderRadius: 16, background: '#111526', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'Montserrat, sans-serif' }}>TIKTOK</span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontFamily: 'Montserrat, sans-serif' }}>@orizzonte.giuridi</span>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61589319283875" target="_blank" rel="noreferrer" style={{ borderRadius: 16, background: '#1877F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'Montserrat, sans-serif' }}>FACEBOOK</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, fontFamily: 'Montserrat, sans-serif' }}>Orizzonte Giuridico</span>
              </a>
              <a href="https://www.linkedin.com/company/orizzonte-giuridico" target="_blank" rel="noreferrer" style={{ borderRadius: 16, background: '#0A66C2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, fontFamily: 'Montserrat, sans-serif' }}>LINKEDIN</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, fontFamily: 'Montserrat, sans-serif' }}>Orizzonte Giuridico</span>
              </a>
            </div>
          </div>

        </main>

        <Footer />

        {/* ── Story modal (invariato) ── */}
        {storyOpen && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column' }}
            onClick={e => {
              const x = (e as any).clientX;
              const w = window.innerWidth;
              if (x > w / 2) nextStory(); else prevStory();
            }}
          >
            <div style={{ display: 'flex', gap: 4, padding: '12px 12px 0', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
              {(storyLoading ? [0] : storyPosts).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 99, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: '#fff', width: i < storyIndex ? '100%' : i === storyIndex ? `${storyProgress}%` : '0%', transition: i === storyIndex ? 'width 0.1s linear' : 'none' }} />
                </div>
              ))}
            </div>
            <div style={{ position: 'absolute', top: 22, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0a3060,#8fd3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icons[storyCatName]
                    ? <span style={{ display: 'flex', transform: 'scale(0.72)' }}>{icons[storyCatName]}</span>
                    : <span style={{ fontSize: 16 }}>🏛️</span>}
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{storyCatName}</div>
                  {!storyLoading && storyPosts[storyIndex] && (
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
                      {new Date(storyPosts[storyIndex].date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); setStoryOpen(false); }} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>
            {storyLoading ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Caricamento...</div>
            ) : storyPosts.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Nessun articolo trovato</div>
            ) : (() => {
              const post = storyPosts[storyIndex];
              const _m = post?._embedded?.['wp:featuredmedia']?.[0];
              const img = _m?.media_details?.sizes?.medium_large?.source_url || _m?.media_details?.sizes?.large?.source_url || _m?.source_url;
              const excerpt = post?.excerpt?.rendered?.replace(/<[^>]+>/g, '').slice(0, 120) + '...';
              const link = post?.link;
              return (
                <>
                  {img && <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <div style={{ position: 'absolute', inset: 0, background: img ? 'linear-gradient(to top,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.4) 50%,rgba(0,0,0,0.5) 100%)' : '#07162b' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 48px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 10px', marginBottom: 12 }}>
                      ORIZZONTE GIURIDICO · {storyCatName.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }} />
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 24 }}>{excerpt}</div>
                    {link && (
                      <a href={post?.slug ? `/articoli/${post.slug}` : link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0a0d18', fontWeight: 800, fontSize: 12, letterSpacing: 1, padding: '13px 24px', borderRadius: 999, textDecoration: 'none' }}>
                        LEGGI L'ARTICOLO →
                      </a>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}
        {storyOpen && !storyLoading && storyPosts.length > 0 && (
          <StoryTimer key={`${storyCatIndex}-${storyIndex}`} onTick={p => setStoryProgress(p)} onEnd={nextStory} />
        )}
      </div>
    </>
  );
}
