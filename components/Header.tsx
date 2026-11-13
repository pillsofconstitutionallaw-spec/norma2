'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearch } from '@/hooks/useSearch';

// Barra superiore in vetro sfocato (stile iOS). Si "solidifica" con
// un bordo sottile appena la pagina scorre. La ricerca si apre come
// pannello che scende dall'alto con lo sfondo sfocato.
export default function Header() {
  const [hasNew, setHasNew] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollato, setScrollato] = useState(false);
  const { query, setQuery, risultati, cercando, reset: resetSearch } = useSearch(8);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem('norma_notif_lette')) setHasNew(true);
    } catch {}
    const onScroll = () => setScrollato(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = () => setSearchOpen(true);
    window.addEventListener('norma:open-search', handler);
    window.addEventListener('apri-ricerca', handler);
    return () => {
      window.removeEventListener('norma:open-search', handler);
      window.removeEventListener('apri-ricerca', handler);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 120);
    else resetSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpen]);

  function markNotifRead() {
    try { localStorage.setItem('norma_notif_lette', '1'); } catch {}
    setHasNew(false);
  }

  return (
    <>
      <header className="navbar" data-scrollato={scrollato}>
        <div className="navbar-inner">
          <Link href="/salvati" aria-label="Articoli salvati" className="navbar-btn tap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </Link>

          <Link href="/" className="navbar-logo tap" aria-label="Norma, home">
            <span className="logo-testo">Norma<span className="logo-punto" aria-hidden /></span>
          </Link>

          <button aria-label="Notifiche" onClick={markNotifRead} className="navbar-btn tap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {hasNew && <span className="badge-punto" />}
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="ricerca-overlay" onClick={() => setSearchOpen(false)}>
          <div className="ricerca-pannello" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label className="campo-ricerca" style={{ marginTop: 0, flex: 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Cerca articoli" enterKeyHint="search" />
              </label>
              <button onClick={() => setSearchOpen(false)} className="link-azione tap">Annulla</button>
            </div>

            {cercando && <div className="ricerca-stato"><span className="spinner" /> Ricerca in corso…</div>}

            {!cercando && risultati.length > 0 && (
              <div className="ricerca-risultati">
                {risultati.map((post, i) => {
                  const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                  const href = post._src === 'odl' ? post.link : `/articoli/${post.slug}`;
                  return (
                    <a key={i} href={href} className="riga appare" style={{ animationDelay: `${i * 35}ms`, minHeight: 60, padding: '10px 4px' }}
                      target={post._src === 'odl' ? '_blank' : '_self'} rel="noreferrer"
                      onClick={() => setSearchOpen(false)}>
                      {img
                        ? <img src={img} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                        : <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--fill)', flexShrink: 0 }} />}
                      <div className="riga-testo">
                        <div className="riga-titolo" style={{ fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }} />
                        <div className="riga-sub">{post._src === 'odl' ? 'Orizzonti del Diritto' : 'Orizzonte Giuridico'}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {!cercando && query.trim() && risultati.length === 0 && (
              <div className="ricerca-stato">Nessun risultato per “{query}”</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
