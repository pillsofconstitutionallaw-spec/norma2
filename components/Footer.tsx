'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const [cercaAperta, setCercaAperta] = useState(false);
  const [query, setQuery] = useState('');
  const [risultati, setRisultati] = useState<any[]>([]);
  const [cercando, setCercando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (cercaAperta) setTimeout(() => inputRef.current?.focus(), 150);
    else { setQuery(''); setRisultati([]); }
  }, [cercaAperta]);

  useEffect(() => {
    if (!query.trim()) { setRisultati([]); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => cercaArticoli(query), 400);
  }, [query]);

  async function cercaArticoli(q: string) {
    setCercando(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch(`https://orizzontegiuridico.com/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=4&_embed`),
        fetch(`https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=4&_embed`),
      ]);
      const d1 = await r1.json();
      const d2 = await r2.json();
      const og = Array.isArray(d1) ? d1.map((p: any) => ({ ...p, _src: 'og' })) : [];
      const odl = Array.isArray(d2) ? d2.map((p: any) => ({ ...p, _src: 'odl' })) : [];
      setRisultati([...og, ...odl].slice(0, 6));
    } catch (e) {}
    setCercando(false);
  }

  // N → sempre scroll to top (ovunque tu sia)
  function handleCenterButton() {
    if (cercaAperta) { setCercaAperta(false); return; }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const btnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 5, flex: 1, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  });

  const lblStyle = (active: boolean): React.CSSProperties => ({
    fontSize: 9, letterSpacing: 2, fontWeight: 900, textTransform: 'uppercase',
    color: active ? '#8fd3ff' : 'rgba(255,255,255,0.25)', fontFamily: 'Montserrat, sans-serif',
  });

  return (
    <>
      {/* OVERLAY RICERCA */}
      {cercaAperta && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.75)' }}
          onClick={() => setCercaAperta(false)}
        >
          <div
            style={{ position: 'absolute', bottom: 96, left: 16, right: 16, background: '#031327', borderRadius: 18, padding: '16px', border: '0.5px solid rgba(143,211,255,0.25)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#111526', borderRadius: 12, padding: '12px 14px', border: '0.5px solid rgba(143,211,255,0.3)', marginBottom: 10 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Cerca articoli..."
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14, fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
              />
              {query ? (
                <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 18, padding: 0, lineHeight: 1 }}>✕</button>
              ) : (
                <button onClick={() => setCercaAperta(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8fd3ff', fontSize: 11, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, padding: 0 }}>Chiudi</button>
              )}
            </div>

            {cercando && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif', padding: '6px 0' }}>Ricerca in corso...</div>}

            {!cercando && risultati.length > 0 && (
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {risultati.map((post, i) => {
                  const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                  const href = post._src === 'odl' ? post.link : `/articoli/${post.slug}`;
                  return (
                    <a key={i} href={href} target={post._src === 'odl' ? '_blank' : '_self'} rel="noreferrer"
                      onClick={() => setCercaAperta(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                      {img
                        ? <img src={img} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        : <div style={{ width: 40, height: 40, borderRadius: 8, background: '#07162b', flexShrink: 0 }} />
                      }
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Montserrat, sans-serif' }}
                          dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }} />
                        <div style={{ fontSize: 10, color: post._src === 'odl' ? '#a8c8f0' : '#8fd3ff', fontWeight: 700, marginTop: 3, fontFamily: 'Montserrat, sans-serif' }}>
                          {post._src === 'odl' ? 'Orizzonti del Diritto' : 'Orizzonte Giuridico'}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {!cercando && query.trim() && risultati.length === 0 && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif', padding: '6px 0' }}>Nessun risultato per "{query}"</div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER BAR */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: '#041428', borderTop: '1px solid rgba(255,255,255,0.05)', height: 88, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px' }}>

        {/* HOME */}
        <button style={btnStyle(isActive('/') && !cercaAperta)} onClick={() => { setCercaAperta(false); router.push('/'); }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke={isActive('/') && !cercaAperta ? '#8fd3ff' : 'rgba(255,255,255,0.28)'} strokeWidth="1.9">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9.5z" />
          </svg>
          <span style={lblStyle(isActive('/') && !cercaAperta)}>Feed</span>
        </button>

        {/* ESPLORA */}
        <button style={btnStyle(isActive('/esplora'))} onClick={() => { setCercaAperta(false); router.push('/esplora'); }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke={isActive('/esplora') ? '#8fd3ff' : 'rgba(255,255,255,0.28)'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span style={lblStyle(isActive('/esplora'))}>Esplora</span>
        </button>

        {/* CENTER N — sempre scroll to top */}
        <div style={{ position: 'relative', marginTop: -40, display: 'flex', flexDirection: 'column', alignItems: 'center', width: 96 }}>
          <div style={{ position: 'absolute', top: 0, width: 90, height: 90, borderRadius: '50%', background: 'rgba(15,111,255,0.2)', filter: 'blur(16px)' }} />
          <button onClick={handleCenterButton} style={{ position: 'relative', width: 74, height: 74, borderRadius: '50%', background: '#071225', border: '1px solid #1c4d7d', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0,123,255,0.25)', cursor: 'pointer', fontFamily: "'Cormorant Garamond', serif" }}>
            <span style={{ color: '#fff', fontSize: 44, lineHeight: 1 }}>N</span>
          </button>
          <span style={{ marginTop: 8, ...lblStyle(false) }}>Norma</span>
        </div>

        {/* SALVATI */}
        <button style={btnStyle(isActive('/salvati'))} onClick={() => { setCercaAperta(false); router.push('/salvati'); }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill={isActive('/salvati') ? '#8fd3ff' : 'none'} stroke={isActive('/salvati') ? '#8fd3ff' : 'rgba(255,255,255,0.28)'} strokeWidth="1.9">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span style={lblStyle(isActive('/salvati'))}>Salvati</span>
        </button>

        {/* AVVISI */}
        <button style={btnStyle(isActive('/avvisi'))} onClick={() => { setCercaAperta(false); router.push('/avvisi'); }}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke={isActive('/avvisi') ? '#8fd3ff' : 'rgba(255,255,255,0.28)'} strokeWidth="1.9">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span style={lblStyle(isActive('/avvisi'))}>Avvisi</span>
        </button>

      </div>
    </>
  );
}