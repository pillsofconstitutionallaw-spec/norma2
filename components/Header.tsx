'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const voci = [
  { label: 'Home', href: '/' },
  { label: 'Chi siamo', href: '/chi-siamo' },
  { label: 'Costituzione', href: '/costituzione' },
  { label: 'Fonti', href: '/fonti' },
  { label: 'Sentenze', href: '/sentenze' },
  { label: 'Istituzioni', href: '/istituzioni' },
];

export default function Header() {
  const pathname = usePathname();

  const [cercaAperta, setCercaAperta] = useState(false);
  const [query, setQuery] = useState('');
  const [risultati, setRisultati] = useState<any[]>([]);
  const [cercando, setCercando] = useState(false);

  const [notificheAperte, setNotificheAperte] = useState(false);
  const [notifiche, setNotifiche] = useState<any[]>([]);
  const [loadingNotifiche, setLoadingNotifiche] = useState(false);
  const [notificheLette, setNotificheLette] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);

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
        fetch(`https://orizzontegiuridico.com/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=5&_embed`),
        fetch(`https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=5&_embed`),
      ]);
      const d1 = await r1.json();
      const d2 = await r2.json();
      const og = Array.isArray(d1) ? d1.map((p: any) => ({ ...p, _src: 'og' })) : [];
      const odl = Array.isArray(d2) ? d2.map((p: any) => ({ ...p, _src: 'odl' })) : [];
      setRisultati([...og, ...odl].slice(0, 8));
    } catch (e) {}
    setCercando(false);
  }

  async function apriNotifiche() {
    if (notificheAperte) { setNotificheAperte(false); return; }
    setNotificheAperte(true);
    setNotificheLette(true);
    setCercaAperta(false);
    if (notifiche.length > 0) return;
    setLoadingNotifiche(true);
    try {
      const res = await fetch('https://orizzontegiuridico.com/wp-json/wp/v2/posts?per_page=6&_embed');
      const data = await res.json();
      setNotifiche(Array.isArray(data) ? data : []);
    } catch (e) {}
    setLoadingNotifiche(false);
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#041428', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 0 }}>

        {/* STATUS BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>9:41</span>
          <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, letterSpacing: 2 }}>●●●</span>
        </div>

        {/* TOP */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 56, fontWeight: 700, color: '#fff', lineHeight: 0.9, letterSpacing: 1, margin: 0 }}>
              NORMA
            </h1>
          </Link>

          <div style={{ display: 'flex', gap: 18, paddingTop: 8 }}>
            <button onClick={() => { setCercaAperta(!cercaAperta); setNotificheAperte(false); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={cercaAperta ? '#8fd3ff' : 'rgba(255,255,255,0.5)'} strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button onClick={apriNotifiche} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={notificheAperte ? '#8fd3ff' : 'rgba(255,255,255,0.5)'} strokeWidth="2">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {!notificheLette && (
                <div style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, borderRadius: '50%', background: '#8fd3ff' }} />
              )}
            </button>
          </div>
        </div>

        {/* MENU */}
        <div style={{ display: 'flex', gap: 26, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {voci.map((v) => {
            const attivo = pathname === v.href || (v.href !== '/' && pathname.startsWith(v.href));
            return (
              <Link key={v.href} href={v.href} style={{
                paddingBottom: 12,
                borderBottom: attivo ? '3px solid #8fd3ff' : '3px solid transparent',
                color: attivo ? '#8fd3ff' : 'rgba(255,255,255,0.36)',
                fontSize: 11, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase',
                whiteSpace: 'nowrap', textDecoration: 'none', transition: 'color 0.2s',
              }}>
                {v.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* BARRA RICERCA */}
      {cercaAperta && (
        <div style={{ padding: '10px 12px 12px', borderTop: '0.5px solid rgba(255,255,255,0.06)', background: '#041428' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#111526', borderRadius: 12, padding: '10px 14px', border: '0.5px solid rgba(143,211,255,0.2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Cerca articoli..." style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13, fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }} />
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
        <div style={{ padding: '10px 12px 12px', borderTop: '0.5px solid rgba(255,255,255,0.06)', background: '#041428' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10, fontFamily: 'Montserrat, sans-serif' }}>
            Ultimi aggiornamenti
          </div>
          {loadingNotifiche && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif' }}>Caricamento...</div>}
          {notifiche.map((post, i) => {
            const data = post?.date ? new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : '';
            return (
              <a key={i} href={`/articoli/${post.slug}`} onClick={() => setNotificheAperte(false)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8fd3ff', flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Montserrat, sans-serif' }}
                    dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }} />
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
