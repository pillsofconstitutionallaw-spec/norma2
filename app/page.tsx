'use client';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function StoryTimer({ onTick, onEnd }: { onTick: (p: number) => void; onEnd: () => void }) {
  useEffect(() => {
    const duration = 6000;
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min((elapsed / duration) * 100, 100);
      onTick(pct);
      if (elapsed >= duration) {
        clearInterval(timer);
        onEnd();
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);
  return null;
}

function InstagramEmbed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [profilePic, setProfilePic] = useState('https://i.imgur.com/2DhmtJ4.png');
  useEffect(() => {
    fetch('/api/instagram')
      .then(r => r.json())
      .then(data => {
        if (data.data) setPosts(data.data.slice(0, 9));
        if (data.profile?.profile_picture_url) setProfilePic(data.profile.profile_picture_url);
      })
      .catch(() => {});
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
          </svg>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, background: '#050816' }}>
        {(posts.length > 0 ? posts : Array.from({length: 9}).map(() => ({}))).map((post: any, i: number) => (
          <a key={i} href={post.permalink || 'https://www.instagram.com/orizzonte.giuridico/'} target="_blank" rel="noreferrer"
            style={{ display: 'block', position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#07162b', textDecoration: 'none' }}>
            {post.media_url && (
              <img src={post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url} alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
            {post.media_type === 'VIDEO' && (
              <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '2px 5px', fontSize: 9, color: '#fff' }}>▶</div>
            )}
            {post.media_type === 'CAROUSEL_ALBUM' && (
              <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '2px 5px', fontSize: 9, color: '#fff' }}>⊞</div>
            )}
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

const staticCategories = [
  { id: 0, name: 'Penale' },
  { id: 0, name: 'Civile' },
  { id: 0, name: 'Costituzionale' },
  { id: 0, name: 'Ambiente' },
  { id: 0, name: 'Unione Europea' },
  { id: 0, name: 'Amministrativo' },
  { id: 0, name: 'Internazionale' },
  { id: 0, name: 'Animali' },
  { id: 0, name: 'Legalità' },
  { id: 0, name: 'Economia' },
  { id: 0, name: 'Politica' },
  { id: 0, name: 'Dir. Comparato' },
  { id: 0, name: "L'Intervista" },
  { id: 0, name: 'Ripetiamo il Diritto' },
];

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

const icons: Record<string, React.ReactNode> = {
  Penale: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L19 6V11C19 16 15.5 20 12 21C8.5 20 5 16 5 11V6L12 3Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Civile: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Costituzionale: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 3H17L21 7V21H3V3H7Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M17 3V7H21" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M7 12H17M7 16H13" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Ambiente: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 5 15 5 9C5 5.69 8.13 3 12 3C15.87 3 19 5.69 19 9C19 15 12 21 12 21Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 9V21" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  'Unione Europea': <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Amministrativo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Internazionale: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="12" r="2" fill="#8fd3ff" opacity="0.5"/></svg>,
  Animali: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="6" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="17" cy="6" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="4" cy="12" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="20" cy="12" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><path d="M12 10C9 10 6 13 7 17C8 20 10 21 12 21C14 21 16 20 17 17C18 13 15 10 12 10Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Legalità: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinejoin="round"/><path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinejoin="round"/><path d="M3 21H21" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Economia: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17,6 21,6 21,10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Politica: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Dir. Comparato': <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19V5H12V19M12 5H20V19" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 19H22" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  "L'Intervista": <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="11" rx="3" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M5 10C5 14.4 8.13 18 12 18C15.87 18 19 14.4 19 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 18V22M9 22H15" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  'Ripetiamo il Diritto': <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 10V6L12 2L2 6V10C2 15.5 6.5 20.7 12 22C17.5 20.7 22 15.5 22 10Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 8V13L15 15" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
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

export default function NormaHome() {
  const [mounted, setMounted] = useState(false); // FIX: evita hydration mismatch
  const [cur, setCur] = useState(0);
  const touchStartX = useRef<number>(0);
  const wheelTimeout = useRef<any>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(staticCategories);
  const [homeArticles, setHomeArticles] = useState<any[]>([]);
  const [fascicolo, setFascicolo] = useState<{url: string, title: string} | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyCatIndex, setStoryCatIndex] = useState(0);
  const [storyCatName, setStoryCatName] = useState('');
  const [storyPosts, setStoryPosts] = useState<any[]>([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyCache = useRef<Record<string, any[]>>({});
  const STORY_LS_KEY = 'norma_story_cache_v2';
  const STORY_LS_TTL = 60 * 60 * 1000; // 1 ora
  const SEEN_KEY = 'norma_story_seen_v1';
  const [newCategories, setNewCategories] = useState<Set<string>>(new Set());
  const seenRef = useRef<Record<string, string>>({});

  function salvaStoryCacheLS() {
    try {
      localStorage.setItem(STORY_LS_KEY, JSON.stringify({ ts: Date.now(), data: storyCache.current }));
    } catch {}
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

  // FIX: imposta mounted a true solo sul client
  useEffect(() => {
    setMounted(true);
    // Carica seen map
    try {
      const rawSeen = localStorage.getItem(SEEN_KEY);
      if (rawSeen) seenRef.current = JSON.parse(rawSeen);
    } catch {}
    // Carica cache da localStorage al mount — storie istantanee al secondo avvio
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

  async function loadCatPosts(name: string, catId?: number): Promise<any[]> {
    if (storyCache.current[name]) return storyCache.current[name];
    try {
      let id = catId;
      if (!id) {
        const res = await fetch(`https://orizzontegiuridico.com/wp-json/wp/v2/categories?search=${encodeURIComponent(name)}&per_page=1`);
        const cats = await res.json();
        if (!Array.isArray(cats) || cats.length === 0) return [];
        id = cats[0].id;
      }
      const postsRes = await fetch(`https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&categories=${id}&per_page=5`);
      const data = await postsRes.json();
      const posts = Array.isArray(data) ? data : [];
      storyCache.current[name] = posts;
      salvaStoryCacheLS();
      return posts;
    } catch { return []; }
  }

  useEffect(() => {
    fetch('/api/home-data')
      .then(r => r.json())
      .then(({ cats, articles, fascicolo: f, storyPosts }) => {
        // Popola subito la cache con i post già fetchati server-side
        if (storyPosts && typeof storyPosts === 'object') {
          Object.entries(storyPosts).forEach(([name, posts]) => {
            if (Array.isArray(posts) && posts.length > 0) {
              storyCache.current[name] = posts as any[];
            }
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
          // Preloading in background per categorie non ancora in cache
          merged.slice(0, 6).forEach(cat => {
            if (!storyCache.current[cat.name]) {
              loadCatPosts(cat.name, cat.id || undefined);
            }
          });
        }
        if (Array.isArray(articles)) setHomeArticles(articles);
        if (f) setFascicolo(f);
      })
      .catch(() => {
        staticCategories.slice(0, 6).forEach(cat => loadCatPosts(cat.name));
      });
  }, []);

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
      const posts = await loadCatPosts(cat.name, cat.id || undefined);
      setStoryPosts(posts);
      setStoryLoading(false);
    }
    if (catIdx + 1 < categories.length) {
      const next = categories[catIdx + 1];
      loadCatPosts(next.name, next.id || undefined);
    }
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
          const posts = await loadCatPosts(name);
          setStoryPosts(posts);
          setStoryLoading(false);
        }
        if (nextCatIdx + 1 < categories.length) {
          loadCatPosts(categories[nextCatIdx + 1].name);
        }
      } else {
        setStoryOpen(false);
      }
    }
  }

  function prevStory() {
    if (storyIndex > 0) {
      setStoryIndex(i => i - 1);
      setStoryProgress(0);
    }
  }

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }
        .app { font-family: 'Montserrat', sans-serif; background: #0a0d18; width: 100%; min-height: 100vh; }
        .feed { min-height: 100vh; overflow-y: auto; padding: 20px 16px 140px; scroll-behavior: smooth; }
        .feed::-webkit-scrollbar { display: none; }
        .slbl { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; }
        .slbl-t { font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.22); }
        .slbl-l { flex: 1; height: 0.5px; background: rgba(255,255,255,0.05); }
        .cats { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 14px; margin-bottom: 6px; scrollbar-width: none; min-height: 90px; align-items: flex-start; }
        .cats::-webkit-scrollbar { display: none; }
        .cat { display: flex; flex-direction: column; align-items: center; gap: 5px; flex-shrink: 0; min-width: 82px; }
        .cat-ring { width: 56px; height: 56px; border-radius: 50%; padding: 2.5px; background: linear-gradient(135deg,#0a3060,#8fd3ff); flex-shrink: 0; }
        .cat-inn { width: 100%; height: 100%; border-radius: 50%; background: #07162b; border: 2px solid #0a0d18; display: flex; align-items: center; justify-content: center; }
        .cat-lbl { font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.4); }
        .hero-wrap { position: relative; border-radius: 20px; overflow: hidden; margin-bottom: 16px; aspect-ratio: 4/5; background: linear-gradient(135deg,#07162b 0%,#0d2040 100%); }
        .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease; }
        .hero-ov1 { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,15,40,0.95) 0%, rgba(0,15,40,0.7) 45%, rgba(0,15,40,0.05) 100%); }
        .hero-ov2 { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,15,40,0.75) 0%, transparent 50%); }
        .hero-body { position: absolute; bottom: 0; left: 0; padding: 28px 22px 40px; max-width: 88%; display: flex; flex-direction: column; gap: 10px; }
        .hero-tag { font-size: 8px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.65); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; padding: 5px 14px; display: inline-block; align-self: flex-start; }
        .hero-title { font-size: 34px; font-weight: 900; color: #fff; line-height: 1.05; letter-spacing: -0.8px; margin: 0; }
        .hero-sub { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.65; margin: 0; }
        .hero-dots { position: absolute; bottom: 10px; right: 14px; display: flex; gap: 5px; }
        .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.25); }
        .hero-dot.on { width: 14px; border-radius: 10px; background: #fff; }
        .art { border-radius: 18px; overflow: hidden; margin-bottom: 10px; border: 0.5px solid rgba(255,255,255,0.06); background: #111526; transition: 0.2s ease; }
        .art:hover { transform: translateY(-1px); }
        .art-body { padding: 12px 14px 14px; }
        .art-title { font-size: 13px; font-weight: 800; color: #fff; line-height: 1.2; margin: 7px 0 8px; }
        .badge-og, .badge-odl { font-size: 8px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 20px; padding: 3px 8px; }
        .badge-og { color: #8fd3ff; border: 0.5px solid rgba(143,211,255,0.3); }
        .badge-odl { color: #a8c8f0; border: 0.5px solid rgba(168,200,240,0.3); }
        .badge-cat { font-size: 8px; font-weight: 600; color: rgba(255,255,255,0.22); letter-spacing: 1px; text-transform: uppercase; }
        .art-meta { display: flex; justify-content: space-between; }
        .art-date { font-size: 10px; color: rgba(255,255,255,0.3); }
        .art-read { font-size: 8px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #8fd3ff; }
        img { display: block; }
        a { text-decoration: none; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
      `}</style>
      <div className="app">
        <Header />
        <div className="feed">
          {/* CATEGORIE */}
          <div className="slbl" style={{ marginTop: 4 }}>
            <span className="slbl-t">Categorie</span>
            <div className="slbl-l"></div>
          </div>
          <div className="cats">
            {categories.map((cat, idx) => (
              <button key={idx} className="cat" onClick={() => openStory(idx)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, width: 82, flexShrink: 0 }}>
                <div className="cat-ring" style={newCategories.has(cat.name)
                  ? { boxShadow: '0 0 12px rgba(143,211,255,0.35)' }
                  : { background: 'rgba(255,255,255,0.1)' }}>
                  <div className="cat-inn">
                    {icons[cat.name] || <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#8fd3ff" strokeWidth="1.8"/></svg>}
                  </div>
                </div>
                <span className="cat-lbl" style={{ marginTop: 8, lineHeight: 1.1, textAlign: 'center', display: 'block', maxWidth: 78, fontSize: cat.name.length > 12 ? 8 : 9 }}>
                  {shortNames[cat.name] || cat.name}
                </span>
              </button>
            ))}
          </div>

          {/* CAROUSEL */}
          <div className="slbl">
            <span className="slbl-t">Cos'è Norma</span>
            <div className="slbl-l"></div>
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
            {/* FIX: mounted evita il flash — sul server non renderizza mai il ramo con l'immagine */}
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
                <span style={{ display: 'inline-block', fontSize: 8, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#8fd3ff', border: '1px solid rgba(143,211,255,0.3)', borderRadius: 20, padding: '5px 14px', alignSelf: 'flex-start' }}>{slides[cur].tag}</span>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: -0.8 }} dangerouslySetInnerHTML={{ __html: slides[cur].title }} />
                <div style={{ width: 40, height: 2, borderRadius: 1, background: 'rgba(143,211,255,0.4)' }} />
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, maxWidth: '95%' }}>{slides[cur].sub}</div>
              </div>
            )}
            <div className="hero-dots">
              {slides.map((_, i) => <div key={i} className={`hero-dot ${i === cur ? 'on' : ''}`} />)}
            </div>
          </div>

          {/* ARTICOLI */}
          <div className="slbl">
            <span className="slbl-t">Ultimi articoli</span>
            <div className="slbl-l"></div>
          </div>
          {homeArticles.length > 0 ? homeArticles.map((post, i) => {
            const isOdl = post._source === 'odl';
            const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const catName = post?._embedded?.['wp:term']?.[0]?.[0]?.name || '';
            const date = post?.date ? new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : '';
            return (
              <a key={i} href={isOdl ? post.link : `/articoli/${post.slug}`} target={isOdl ? '_blank' : '_self'} rel={isOdl ? 'noreferrer' : undefined} className="art" style={{ display: 'block' }}>
                {img
                  ? <img src={img} alt="" style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                  : <div style={{ height: 130, background: '#07162b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📄</div>
                }
                <div className="art-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isOdl ? <span className="badge-odl">Orizzonti del Diritto</span> : <span className="badge-og">Orizzonte Giuridico</span>}
                    {catName && <span className="badge-cat">{catName}</span>}
                  </div>
                  <div className="art-title" dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }} />
                  <div className="art-meta">
                    <span className="art-date">{date}</span>
                    <span className="art-read">Leggi →</span>
                  </div>
                </div>
              </a>
            );
          }) : [0,1,2].map(i => (
            <div key={i} className="art">
              <div className="shimmer" style={{ height: 130 }} />
              <div style={{ padding: '12px 14px 14px' }}>
                <div className="shimmer" style={{ height: 10, borderRadius: 6, width: '40%', marginBottom: 10 }} />
                <div className="shimmer" style={{ height: 15, borderRadius: 6, marginBottom: 6 }} />
                <div className="shimmer" style={{ height: 15, borderRadius: 6, width: '70%', marginBottom: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="shimmer" style={{ height: 10, borderRadius: 6, width: '20%' }} />
                  <div className="shimmer" style={{ height: 10, borderRadius: 6, width: '12%' }} />
                </div>
              </div>
            </div>
          ))}
          <a href="/articoli" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 16, background: 'rgba(143,211,255,0.08)', border: '0.5px solid rgba(143,211,255,0.2)', color: '#8fd3ff', fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>
            VEDI TUTTI GLI ARTICOLI →
          </a>
          {fascicolo && (
            <a href={fascicolo.url} target="_blank" rel="noreferrer" download
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 0', borderRadius: 16, background: 'rgba(168,200,240,0.08)', border: '0.5px solid rgba(168,200,240,0.25)', color: '#a8c8f0', fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8c8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              SCARICA L'ULTIMO FASCICOLO
            </a>
          )}

          {/* INSTAGRAM */}
          <div className="slbl" style={{ marginTop: 8 }}>
            <span className="slbl-t">Instagram</span>
            <div className="slbl-l"></div>
          </div>
          <InstagramEmbed />

          {/* SOCIAL */}
          <div className="slbl" style={{ marginTop: 4 }}>
            <span className="slbl-t">Seguici</span>
            <div className="slbl-l"></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
            <a href="https://www.instagram.com/orizzonte.giuridico/" target="_blank" rel="noreferrer"
              style={{ borderRadius: 16, background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width={28} height={28} style={{ width: 28, height: 28 }} />
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>INSTAGRAM</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9 }}>@orizzonte.giuridico</span>
            </a>
            <a href="https://www.tiktok.com/@orizzonte.giuridi" target="_blank" rel="noreferrer"
              style={{ borderRadius: 16, background: '#111526', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" width={28} height={28} style={{ width: 28, height: 28 }} />
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>TIKTOK</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>@orizzonte.giuridi</span>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61589319283875" target="_blank" rel="noreferrer"
              style={{ borderRadius: 16, background: '#1877F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width={28} height={28} style={{ width: 28, height: 28 }} />
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>FACEBOOK</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9 }}>Orizzonte Giuridico</span>
            </a>
            <a href="https://www.linkedin.com/company/orizzonte-giuridico" target="_blank" rel="noreferrer"
              style={{ borderRadius: 16, background: '#0A66C2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width={28} height={28} style={{ width: 28, height: 28 }} />
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>LINKEDIN</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9 }}>Orizzonte Giuridico</span>
            </a>
          </div>
        </div>
      </div>

      {/* STORY MODAL */}
      {storyOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column' }}
          onClick={e => {
            const x = (e as any).clientX;
            const w = window.innerWidth;
            if (x > w / 2) nextStory();
            else prevStory();
          }}
        >
          <div style={{ display: 'flex', gap: 4, padding: '12px 12px 0', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
            {(storyLoading ? [0] : storyPosts).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 99, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: '#fff',
                  width: i < storyIndex ? '100%' : i === storyIndex ? `${storyProgress}%` : '0%',
                  transition: i === storyIndex ? 'width 0.1s linear' : 'none',
                }} />
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
            <button
              onClick={e => { e.stopPropagation(); setStoryOpen(false); }}
              style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>
          </div>
          {storyLoading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              Caricamento...
            </div>
          ) : storyPosts.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              Nessun articolo trovato
            </div>
          ) : (() => {
            const post = storyPosts[storyIndex];
            const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
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
                    <a href={post?.slug ? `/articoli/${post.slug}` : link} target="_blank" rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0a0d18', fontWeight: 800, fontSize: 12, letterSpacing: 1, padding: '13px 24px', borderRadius: 999, textDecoration: 'none' }}>
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
      <Footer />
    </>
  );
}