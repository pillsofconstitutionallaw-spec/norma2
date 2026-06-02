'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSearch } from '@/hooks/useSearch';

export default function Header() {
  const [cercaAperta, setCercaAperta] = useState(false);
  const { query, setQuery, risultati, cercando, reset: resetSearch } = useSearch(8);
  const [notificheAperte, setNotificheAperte] = useState(false);
  const [notifiche, setNotifiche] = useState<any[]>([]);
  const [loadingNotifiche, setLoadingNotifiche] = useState(false);
  const [notificheLette, setNotificheLette] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ascolta evento dal Footer
  useEffect(() => {
    function handler() {
      setCercaAperta(true);
      setNotificheAperte(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    window.addEventListener('apri-ricerca', handler);
    return () => window.removeEventListener('apri-ricerca', handler);
  }, []);

  useEffect(() => {
    if (cercaAperta) setTimeout(() => inputRef.current?.focus(), 100);
    else resetSearch();
  }, [cercaAperta]);

  async function apriNotifiche() {
    if (notificheAperte) { setNotificheAperte(false); return; }
    setNotificheAperte(true);
    setNotificheLette(true);
    setCercaAperta(false);
    if (notifiche.length > 0) return;
    setLoadingNotifiche(true);
    try {
      const [wpRes, igRes] = await Promise.all([
        fetch('https://orizzontegiuridico.com/wp-json/wp/v2/posts?per_page=6&_embed').then(r => r.json()).catch(() => []),
        fetch('/api/instagram').then(r => r.json()).catch(() => ({})),
      ]);
      const wpItems = (Array.isArray(wpRes) ? wpRes : []).map((p: any) => ({ ...p, _type: 'wp' }));
      const igItems = (Array.isArray(igRes?.data) ? igRes.data.slice(0, 5) : []).map((p: any) => ({ ...p, _type: 'ig' }));
      const merged = [...wpItems, ...igItems].sort((a, b) => {
        const da = new Date(a.date ?? a.timestamp).getTime();
        const db = new Date(b.date ?? b.timestamp).getTime();
        return db - da;
      });
      setNotifiche(merged);
    } catch (e) {}
    setLoadingNotifiche(false);
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#041428', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12 }}>

        {/* TOP — solo logo + icone */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: 1, margin: 0 }}>
              NORMA
            </h1>
          </Link>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* LENTE */}
            <button
              onClick={() => { setCercaAperta(!cercaAperta); setNotificheAperte(false); }}
              style={{ width: 36, height: 36, borderRadius: 10, background: cercaAperta ? 'rgba(143,211,255,0.12)' : 'rgba(255,255,255,0.05)', border: `0.5px solid ${cercaAperta ? 'rgba(143,211,255,0.3)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={cercaAperta ? '#8fd3ff' : 'rgba(255,255,255,0.55)'} strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* CAMPANELLA */}
            <button
              onClick={apriNotifiche}
              style={{ width: 36, height: 36, borderRadius: 10, background: notificheAperte ? 'rgba(143,211,255,0.12)' : 'rgba(255,255,255,0.05)', border: `0.5px solid ${notificheAperte ? 'rgba(143,211,255,0.3)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={notificheAperte ? '#8fd3ff' : 'rgba(255,255,255,0.55)'} strokeWidth="2" strokeLinecap="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {!notificheLette && (
                <div style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#8fd3ff', border: '1.5px solid #041428' }} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* BARRA RICERCA */}
      {cercaAperta && (
        <div style={{ padding: '10px 16px 14px', borderTop: '0.5px solid rgba(255,255,255,0.06)', background: '#041428' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#111526', borderRadius: 12, padding: '10px 14px', border: '0.5px solid rgba(143,211,255,0.2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cerca articoli..."
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13, fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 16, padding: 0 }}>✕</button>
            )}
          </div>

          {cercando && <div style={{ padding: '12px 0', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif' }}>Ricerca in corso...</div>}

          {!cercando && risultati.length > 0 && (
            <div style={{ marginTop: 8, maxHeight: 300, overflowY: 'auto' }}>
              {risultati.map((post, i) => {
                const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                const href = post._src === 'odl' ? post.link : `/articoli/${post.slug}`;
                return (
                  <a key={i} href={href} target={post._src === 'odl' ? '_blank' : '_self'} rel="noreferrer"
                    onClick={() => setCercaAperta(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                    {img && <img src={img} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Montserrat, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }} />
                      <div style={{ fontSize: 9, color: post._src === 'odl' ? '#a8c8f0' : '#8fd3ff', fontWeight: 700, marginTop: 2, fontFamily: 'Montserrat, sans-serif' }}>
                        {post._src === 'odl' ? 'Orizzonti del Diritto' : 'Orizzonte Giuridico'}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          {!cercando && query.trim() && risultati.length === 0 && (
            <div style={{ padding: '12px 0', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif' }}>Nessun risultato per "{query}"</div>
          )}
        </div>
      )}

      {/* PANNELLO NOTIFICHE */}
      {notificheAperte && (
        <div style={{ padding: '10px 16px 14px', borderTop: '0.5px solid rgba(255,255,255,0.06)', background: '#041428' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'Montserrat, sans-serif' }}>
            Ultimi aggiornamenti
          </div>
          {loadingNotifiche && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif' }}>Caricamento...</div>}
          {notifiche.map((item, i) => {
            if (item._type === 'ig') {
              const caption = item.caption ? item.caption.split('\n')[0].slice(0, 72) : 'Post Instagram';
              const ora = item.timestamp ? new Date(item.timestamp).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
              return (
                <a key={i} href={item.permalink || 'https://www.instagram.com/orizzonte.giuridico/'} target="_blank" rel="noreferrer"
                  onClick={() => setNotificheAperte(false)}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)', textDecoration: 'none', borderLeft: '2px solid transparent', borderImage: 'linear-gradient(180deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888) 1', paddingLeft: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Montserrat, sans-serif' }}>{caption}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2, fontFamily: 'Montserrat, sans-serif' }}>Instagram · {ora}</div>
                  </div>
                </a>
              );
            }
            const data = item?.date ? new Date(item.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : '';
            return (
              <a key={i} href={`/articoli/${item.slug}`} onClick={() => setNotificheAperte(false)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8fd3ff', flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Montserrat, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: item?.title?.rendered || '' }} />
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, fontFamily: 'Montserrat, sans-serif' }}>{data}</div>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}