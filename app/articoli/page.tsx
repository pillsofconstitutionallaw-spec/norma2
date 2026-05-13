'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

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

const shortNames: Record<string, string> = {
  Costituzionale: 'Cost.',
  'Unione Europea': 'UE',
  Amministrativo: 'Amm.',
  Internazionale: 'Int.',
  'Dir. Comparato': 'Comp.',
  "L'Intervista": 'Interv.',
  'Ripetiamo il Diritto': 'Ripetiamo',
};

const catIcons: Record<string, React.ReactNode> = {
  Penale: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L19 6V11C19 16 15.5 20 12 21C8.5 20 5 16 5 11V6L12 3Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Civile: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Costituzionale: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 3H17L21 7V21H3V3H7Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M17 3V7H21" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M7 12H17M7 16H13" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Ambiente: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 5 15 5 9C5 5.69 8.13 3 12 3C15.87 3 19 5.69 19 9C19 15 12 21 12 21Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  'Unione Europea': <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Amministrativo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Internazionale: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8fd3ff" strokeWidth="1.8"/><circle cx="12" cy="12" r="2" fill="#8fd3ff" opacity="0.5"/></svg>,
  Animali: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="6" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="17" cy="6" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="4" cy="12" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="20" cy="12" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><path d="M12 10C9 10 6 13 7 17C8 20 10 21 12 21C14 21 16 20 17 17C18 13 15 10 12 10Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Legalità: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinejoin="round"/><path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinejoin="round"/><path d="M3 21H21" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Economia: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17,6 21,6 21,10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Politica: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Dir. Comparato': <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19V5H12V19M12 5H20V19" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 19H22" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  "L'Intervista": <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="11" rx="3" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M5 10C5 14.4 8.13 18 12 18C15.87 18 19 14.4 19 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 18V22M9 22H15" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  'Ripetiamo il Diritto': <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 10V6L12 2L2 6V10C2 15.5 6.5 20.7 12 22C17.5 20.7 22 15.5 22 10Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
};


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

export default function ArticoliPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCat, setActiveCat] = useState<string>('');
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyCatName, setStoryCatName] = useState('');
  const [storyPosts, setStoryPosts] = useState<any[]>([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const [categories, setCategories] = useState(staticCategories);

  // Fetch categories with real IDs
  useEffect(() => {
    fetch('https://orizzontegiuridico.com/wp-json/wp/v2/categories?per_page=100')
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const merged = staticCategories.map(sc => {
          const found = data.find((d: any) => d.name === sc.name);
          return found ? { ...sc, id: found.id } : sc;
        });
        setCategories(merged);
        // Se c'è una categoria attiva, ricarica con gli ID corretti
        if (activeCat) {
          setLoading(true);
          setPosts([]);
          fetchPosts(1, activeCat, merged);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch posts
  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1, activeCat);
  }, [activeCat]);

  async function fetchPosts(p: number, cat: string, cats = categories) {
    try {
      // Trova ID categoria da OG
      let catId = 0;
      if (cat) {
        const found = cats.find(c => c.name === cat);
        if (found?.id) {
          catId = found.id;
        } else {
          const catRes = await fetch(
            `https://orizzontegiuridico.com/wp-json/wp/v2/categories?search=${encodeURIComponent(cat)}&per_page=1`
          ).then(r => r.json());
          if (Array.isArray(catRes) && catRes.length > 0) catId = catRes[0].id;
        }
      }

      const catParam = catId ? `&categories=${catId}` : '';

      const urls = cat
        ? [`https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=10&page=${p}${catParam}`]
        : [
            `https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=6&page=${p}`,
            `https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&per_page=6&page=${p}`,
          ];

      const results = await Promise.all(urls.map(url => fetch(url).then(r => r.json()).catch(() => [])));

      const ogPosts = Array.isArray(results[0]) ? results[0].map((post: any) => ({ ...post, _source: 'og' })) : [];
      const odlPosts = results[1] && Array.isArray(results[1]) ? results[1].map((post: any) => ({ ...post, _source: 'odl' })) : [];

      const merged = [...ogPosts, ...odlPosts].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      if (p === 1) setPosts(merged);
      else setPosts(prev => [...prev, ...merged]);

      if (merged.length < 6) setHasMore(false);
    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  async function loadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPosts(nextPage, activeCat);
  }

  async function openStory(name: string) {
    setStoryCatName(name);
    setStoryIndex(0);
    setStoryProgress(0);
    setStoryPosts([]);
    setStoryOpen(true);
    setStoryLoading(true);
    try {
      const res = await fetch(
        `https://orizzontegiuridico.com/wp-json/wp/v2/categories?search=${encodeURIComponent(name)}`
      );
      const cats = await res.json();
      if (!Array.isArray(cats) || cats.length === 0) { setStoryLoading(false); return; }
      const catId = cats[0].id;
      const postsRes = await fetch(
        `https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&categories=${catId}&per_page=5`
      );
      const data = await postsRes.json();
      setStoryPosts(Array.isArray(data) ? data : []);
    } catch (e) {}
    setStoryLoading(false);
  }

  async function filterByCategory(catName: string) {
    setActiveCat(catName === activeCat ? '' : catName);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: "'Montserrat', sans-serif", paddingBottom: 100 }}>
      <Header />

      {/* Header pagina */}
      <div style={{ padding: '20px 16px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>Articoli</div>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
      </div>

      {/* Stories categorie */}
      <div style={{ padding: '0 16px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', scrollbarWidth: 'none' as any }}>
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => openStory(cat.name)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%', padding: 2.5,
                background: activeCat === cat.name
                  ? 'linear-gradient(135deg,#8fd3ff,#4fa8e8)'
                  : 'linear-gradient(135deg,#0a3060,#8fd3ff)',
              }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#07162b', border: '2px solid #050816', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {catIcons[cat.name] || <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#8fd3ff" strokeWidth="1.8"/></svg>}
                </div>
              </div>
              <span style={{ fontSize: cat.name.length > 10 ? 8 : 9, fontWeight: 700, color: activeCat === cat.name ? '#8fd3ff' : 'rgba(255,255,255,0.4)' }}>
                {shortNames[cat.name] || cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed articoli */}
      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '4/5', borderRadius: 20, background: '#0d1829', border: '0.5px solid rgba(255,255,255,0.06)' }} />
          ))
        ) : posts.map((post, i) => {
          const isOdl = post._source === 'odl';
          const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
          const cat = post?._embedded?.['wp:term']?.[0]?.[0]?.name || '';
          const autore = post?._embedded?.['author']?.[0]?.name || '';
          const data = post?.date ? new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : '';
          const tempoLettura = Math.ceil((post?.content?.rendered?.replace(/<[^>]+>/g, '').split(' ').length || 0) / 200);
          const href = isOdl ? post.link : `/articoli/${post.slug}`;

          return (
            <Link
              key={i}
              href={href}
              target={isOdl ? '_blank' : '_self'}
              style={{ display: 'block', position: 'relative', aspectRatio: '4/5', overflow: 'hidden', background: '#07162b', textDecoration: 'none', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.06)' }}
            >
              {img && (
                <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: img ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.1) 100%)' : 'linear-gradient(135deg,#0d1f3c,#07162b)' }} />

              {/* Badge OG/OdD + categoria */}
              <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ padding: '4px 10px', borderRadius: 99, background: isOdl ? 'rgba(168,200,240,0.12)' : 'rgba(143,211,255,0.12)', border: `0.5px solid ${isOdl ? 'rgba(168,200,240,0.3)' : 'rgba(143,211,255,0.3)'}`, fontSize: 8, fontWeight: 800, color: isOdl ? '#a8c8f0' : '#8fd3ff', letterSpacing: 1 }}>
                  {isOdl ? 'OdD' : 'OG'}
                </div>
                {cat && (
                  <div style={{ padding: '4px 10px', borderRadius: 99, background: 'rgba(0,0,0,0.3)', border: '0.5px solid rgba(255,255,255,0.1)', fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                    {cat}
                  </div>
                )}
              </div>

              {/* Contenuto in basso */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px 24px' }}>
                <div
                  style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.3, marginBottom: 10 }}
                  dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                    {autore && `${autore} · `}{data}{tempoLettura > 0 && ` · ${tempoLettura} min`}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 800, color: isOdl ? '#a8c8f0' : '#8fd3ff', letterSpacing: 1 }}>LEGGI →</div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Carica altri */}
        {hasMore && !loading && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{ width: '100%', padding: 14, borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 800, letterSpacing: 1, cursor: 'pointer' }}
          >
            {loadingMore ? '...' : 'CARICA ALTRI'}
          </button>
        )}
      </div>

      <Footer />

      {/* STORY MODAL */}
      {storyOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column' }}
          onClick={(e) => {
            const x = (e as any).clientX;
            const w = window.innerWidth;
            if (x > w / 2) {
              if (storyPosts.length > 0 && storyIndex < storyPosts.length - 1) {
                setStoryIndex((i) => i + 1); setStoryProgress(0);
              } else { setStoryOpen(false); }
            } else {
              if (storyIndex > 0) { setStoryIndex((i) => i - 1); setStoryProgress(0); }
            }
          }}
        >
          {/* Progress bars */}
          <div style={{ display: 'flex', gap: 0, padding: '12px 12px 0', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
            {(storyLoading ? [0] : storyPosts).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 99, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#fff', width: i < storyIndex ? '100%' : i === storyIndex ? `${storyProgress}%` : '0%', transition: i === storyIndex ? 'width 0.1s linear' : 'none' }} />
              </div>
            ))}
          </div>

          {/* Header */}
          <div style={{ position: 'absolute', top: 22, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0a3060,#8fd3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏛️</div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{storyCatName}</div>
                {!storyLoading && storyPosts[storyIndex] && (
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
                    {new Date(storyPosts[storyIndex].date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setStoryOpen(false); }} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* Content */}
          {storyLoading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Caricamento...</div>
          ) : storyPosts.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Nessun articolo trovato</div>
          ) : (() => {
            const post = storyPosts[storyIndex];
            const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const excerpt = post?.excerpt?.rendered?.replace(/<[^>]+>/g, '').slice(0, 120) + '...';
            const slug = post?.slug;
            return (
              <>
                {img && <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: img ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.5) 100%)' : '#07162b' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 48px' }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 10px', marginBottom: 12 }}>
                    ORIZZONTE GIURIDICO · {storyCatName.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }} />
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 24 }}>{excerpt}</div>
                  {slug && (
                    <a href={`/articoli/${slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0a0d18', fontWeight: 800, fontSize: 12, letterSpacing: 1, padding: '13px 24px', borderRadius: 999, textDecoration: 'none' }}>
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
        <StoryTimer
          key={storyIndex}
          onTick={(p: number) => setStoryProgress(p)}
          onEnd={() => {
            if (storyIndex < storyPosts.length - 1) { setStoryIndex((i) => i + 1); setStoryProgress(0); }
            else { setStoryOpen(false); }
          }}
        />
      )}

    </div>
  );
}