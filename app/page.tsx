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
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
        <div className="storia-anello" style={{ width: 42, height: 42, padding: 2 }}>
          <img src={profilePic} alt="" width={38} height={38} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--surface)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Orizzonte Giuridico</div>
          <div style={{ color: 'var(--text-3)', fontSize: 13 }}>@orizzonte.giuridico</div>
        </div>
        <a href="https://www.instagram.com/orizzonte.giuridico/" target="_blank" rel="noreferrer" className="tap"
          style={{ background: 'var(--accent)', color: '#fff', fontSize: 14, fontWeight: 600, padding: '7px 14px', borderRadius: 99, textDecoration: 'none' }}>
          Segui
        </a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 2 }}>
        {(posts.length > 0 ? posts : Array.from({ length: 9 }).map(() => ({}))).map((post: any, i: number) => (
          <a key={i} href={post.permalink || 'https://www.instagram.com/orizzonte.giuridico/'} target="_blank" rel="noreferrer"
            className={post.media_url ? undefined : 'scheletro'}
            style={{ display: 'block', position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
            {post.media_url && (
              <img src={post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url} alt="" loading="lazy"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            {post.media_type === 'VIDEO' && <span className="chip-vetro" style={{ top: 6, left: 'auto', right: 6, padding: '3px 7px', fontSize: 10 }}>▶</span>}
          </a>
        ))}
      </div>
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
  Penale: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M12 3L19 6V11C19 16 15.5 20 12 21C8.5 20 5 16 5 11V6L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Civile: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Costituzionale: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M7 3H17L21 7V21H3V3H7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M17 3V7H21" stroke="currentColor" strokeWidth="1.8"/><path d="M7 12H17M7 16H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Ambiente: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 5 15 5 9C5 5.69 8.13 3 12 3C15.87 3 19 5.69 19 9C19 15 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 9V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  'Unione Europea': <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Amministrativo: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Internazionale: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.5"/></svg>,
  Animali: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="1.6"/><circle cx="17" cy="6" r="2" stroke="currentColor" strokeWidth="1.6"/><circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.6"/><circle cx="20" cy="12" r="2" stroke="currentColor" strokeWidth="1.6"/><path d="M12 10C9 10 6 13 7 17C8 20 10 21 12 21C14 21 16 20 17 17C18 13 15 10 12 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Legalità: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M3 21H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Economia: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17,6 21,6 21,10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Politica: <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Dir. Comparato': <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M4 19V5H12V19M12 5H20V19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 19H22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  "L'Intervista": <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M5 10C5 14.4 8.13 18 12 18C15.87 18 19 14.4 19 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 18V22M9 22H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  'Ripetiamo il Diritto': <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><path d="M22 10V6L12 2L2 6V10C2 15.5 6.5 20.7 12 22C17.5 20.7 22 15.5 22 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 8V13L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
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
    title: 'Norma,<br>il diritto a portata di <em>swipe</em>.',
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

const SFONDI_SLIDE = [
  'linear-gradient(135deg,#4f46e5,#312e81)',
  'linear-gradient(135deg,#7c3aed,#c026d3 60%,#f97316)',
  'linear-gradient(135deg,#0ea5e9,#4f46e5)',
  'linear-gradient(135deg,#f43f5e,#fb923c)',
];

const SCORCIATOIE: { nome: string; href: string; sfondo: string; ombra: string; icona: React.ReactNode }[] = [
  { nome: 'Codici', href: '/codici', sfondo: 'linear-gradient(150deg,#6366f1,#4338ca)', ombra: 'rgba(79,70,229,.6)',
    icona: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></> },
  { nome: 'Costituzione', href: '/costituzione', sfondo: 'linear-gradient(150deg,#22c55e,#15803d)', ombra: 'rgba(22,163,74,.55)',
    icona: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></> },
  { nome: 'Sentenze', href: '/sentenze', sfondo: 'linear-gradient(150deg,#fb923c,#ea580c)', ombra: 'rgba(234,88,12,.55)',
    icona: <><path d="M12 3v18M5 7l7-4 7 4M5 7l-3 7c0 2 1.5 3 3 3s3-1 3-3L5 7zM19 7l-3 7c0 2 1.5 3 3 3s3-1 3-3l-3-7zM8 21h8" /></> },
  { nome: 'Glossario', href: '/glossario', sfondo: 'linear-gradient(150deg,#38bdf8,#0284c7)', ombra: 'rgba(2,132,199,.55)',
    icona: <><path d="M4 7V4h16v3M9 20h6M12 4v16" /></> },
  { nome: 'Studio', href: '/studio', sfondo: 'linear-gradient(150deg,#a855f7,#7e22ce)', ombra: 'rgba(126,34,206,.55)',
    icona: <><path d="M2 9l10-5 10 5-10 5L2 9z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></> },
  { nome: 'Consulenza', href: '/consulenza', sfondo: 'linear-gradient(150deg,#f43f5e,#be123c)', ombra: 'rgba(225,29,72,.55)',
    icona: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /> },
  { nome: 'Istituzioni', href: '/istituzioni', sfondo: 'linear-gradient(150deg,#64748b,#334155)', ombra: 'rgba(51,65,85,.5)',
    icona: <path d="M3 21h18M6 21V10M18 21V10M12 21V10M2 10l10-7 10 7" /> },
  { nome: 'Salvati', href: '/salvati', sfondo: 'linear-gradient(150deg,#facc15,#ca8a04)', ombra: 'rgba(202,138,4,.55)',
    icona: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /> },
];

function saluto() {
  const h = new Date().getHours();
  if (h < 5) return 'Buonanotte';
  if (h < 13) return 'Buongiorno';
  if (h < 18) return 'Buon pomeriggio';
  return 'Buonasera';
}

function oggiEsteso() {
  return new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
}

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
  const caroselloRef = useRef<HTMLDivElement>(null);
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
      <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
        <Header />
        <main className="pagina">
          {/* ── Saluto ── */}
          <div className="saluto-data appare">{mounted ? oggiEsteso() : ' '}</div>
          <h1 className="titolo-grande appare" style={{ animationDelay: '40ms' }}>{mounted ? saluto() : 'Ciao'}</h1>

          {/* ── Festa civile ── */}
          {festaCivile && (
            <div className="card festa appare" style={{ animationDelay: '80ms', borderTop: `3px solid ${festaCivile.colore}` }}
              onClick={() => setFestaEspansa(e => !e)}>
              <div className="festa-emoji">{festaCivile.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="festa-etichetta" style={{ color: festaCivile.colore }}>Oggi · Festa civile</div>
                <div className="festa-nome">{festaCivile.nome}</div>
                <div className="festa-breve">{festaEspansa ? festaCivile.descrizione : festaCivile.breve}</div>
              </div>
              <button className="btn-chiudi tap" aria-label="Chiudi"
                onClick={e => { e.stopPropagation(); const now = new Date(); sessionStorage.setItem(`norma_festa_chiusa_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`, '1'); setFestaCivile(null); }}>
                <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
          )}

          {/* ── Storie ── */}
          <div className="storie appare" style={{ animationDelay: '120ms' }}>
            {categories.map((cat, idx) => {
              const nuova = newCategories.has(cat.name);
              return (
                <button key={idx} onClick={() => openStory(idx)} className="storia tap">
                  <div className="storia-anello" data-vista={!nuova}>
                    <div className="storia-interno">
                      <span style={{ display: 'flex', transform: 'scale(0.85)' }}>
                        {icons[cat.name] || <svg width="27" height="27" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" /></svg>}
                      </span>
                    </div>
                  </div>
                  <span className="storia-nome" style={{ fontWeight: nuova ? 600 : 500, color: nuova ? 'var(--text)' : undefined }}>
                    {shortNames[cat.name] || cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Scopri Norma: carosello a scatto ── */}
          <div className="sezione-label appare" style={{ animationDelay: '160ms' }}>Scopri Norma</div>
          <div className="carosello appare" style={{ animationDelay: '180ms' }} ref={caroselloRef}
            onScroll={e => {
              const el = e.currentTarget;
              const i = Math.round(el.scrollLeft / (el.scrollWidth / slides.length));
              if (i !== cur) setCur(Math.max(0, Math.min(slides.length - 1, i)));
            }}>
            {slides.map((sl, i) => (
              <div key={i} className="slide" style={{ background: SFONDI_SLIDE[i % SFONDI_SLIDE.length] }}>
                {sl.img && <img src={sl.img} alt="" loading={i === 0 ? 'eager' : 'lazy'} />}
                <span className="slide-tag">{sl.tag}</span>
                <div className="slide-titolo" dangerouslySetInnerHTML={{ __html: sl.title }} />
                <div className="slide-sub">{sl.sub}</div>
              </div>
            ))}
          </div>
          <div className="puntini">{slides.map((_, i) => <span key={i} data-on={i === cur} />)}</div>

          {/* ── Scorciatoie ── */}
          <div className="sezione-label appare" style={{ animationDelay: '220ms' }}>Strumenti</div>
          <div className="scorciatoie">
            {SCORCIATOIE.map((sc, i) => (
              <a key={sc.href} href={sc.href} className="scorciatoia tap appare" style={{ animationDelay: `${240 + i * 35}ms` }}>
                <span className="scorciatoia-icona" style={{ background: sc.sfondo, ['--ombra' as string]: sc.ombra }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{sc.icona}</svg>
                </span>
                <span className="scorciatoia-nome">{sc.nome}</span>
              </a>
            ))}
          </div>

          {/* ── Ultimi articoli ── */}
          <div className="sezione-label">
            <span>Ultimi articoli</span>
            <a href="/articoli" className="link-azione" style={{ fontSize: 15, textDecoration: 'none' }}>Vedi tutti</a>
          </div>
          {feedPosts.length === 0
            ? Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="card" style={{ marginBottom: 16 }}>
                  <div className="scheletro" style={{ aspectRatio: '16/10' }} />
                  <div style={{ padding: 16 }}>
                    <div className="scheletro" style={{ height: 12, width: '40%', borderRadius: 6, marginBottom: 12 }} />
                    <div className="scheletro" style={{ height: 18, width: '90%', borderRadius: 6, marginBottom: 8 }} />
                    <div className="scheletro" style={{ height: 18, width: '65%', borderRadius: 6 }} />
                  </div>
                </div>
              ))
            : feedPosts.map((post, i) => (
                <FeedCard key={post.id ?? `${post.slug}-${i}`} post={post} priority={i === 0} />
              ))}
          {feedLoading && <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}><span className="spinner" /></div>}
          <div ref={feedEndRef} style={{ height: 1 }} />

          <div style={{ display: 'grid', gap: 10, marginTop: 4 }}>
            <a href="/articoli" className="btn btn-primario tap">Tutti gli articoli</a>
            {fascicolo && (
              <a href={fascicolo.url} target="_blank" rel="noreferrer" download className="btn btn-secondario tap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Scarica l&apos;ultimo fascicolo
              </a>
            )}
          </div>

          {/* ── Instagram ── */}
          <div className="sezione-label">Instagram</div>
          <InstagramEmbed />

          {/* ── Social ── */}
          <div className="sezione-label">Seguici</div>
          <div className="social">
            <a href="https://www.instagram.com/orizzonte.giuridico/" target="_blank" rel="noreferrer" aria-label="Instagram" className="tap" style={{ background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2" /><circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.5" fill="white" /></svg>
            </a>
            <a href="https://www.tiktok.com/@orizzonte.giuridi" target="_blank" rel="noreferrer" aria-label="TikTok" className="tap" style={{ background: '#111' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" /></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61589319283875" target="_blank" rel="noreferrer" aria-label="Facebook" className="tap" style={{ background: '#1877F2' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
            </a>
            <a href="https://www.linkedin.com/company/orizzonte-giuridico" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="tap" style={{ background: '#0A66C2' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
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
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icons[storyCatName]
                    ? <span style={{ display: 'flex', transform: 'scale(0.72)', color: '#fff' }}>{icons[storyCatName]}</span>
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
