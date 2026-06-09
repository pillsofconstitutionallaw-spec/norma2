'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useSearch } from '@/hooks/useSearch';

export default function Header() {
  const [hasNew, setHasNew] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { query, setQuery, risultati, cercando, reset: resetSearch } = useSearch(8);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem('norma_notif_lette')) setHasNew(true);
    } catch {}
  }, []);

  useEffect(() => {
    const handler = () => {
      setSearchOpen(true);
      setTimeout(() => inputRef.current?.focus(), 150);
    };
    window.addEventListener('norma:open-search', handler);
    window.addEventListener('apri-ricerca', handler);
    return () => {
      window.removeEventListener('norma:open-search', handler);
      window.removeEventListener('apri-ricerca', handler);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 100);
    else resetSearch();
  }, [searchOpen]);

  function markNotifRead() {
    try { localStorage.setItem('norma_notif_lette', '1'); } catch {}
    setHasNew(false);
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: '#0a0d18',
      borderBottom: '0.5px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        height: 52,
        maxWidth: 480,
        margin: '0 auto',
      }}>
        {/* Sinistra: segnalibro → salvati */}
        <Link
          href="/salvati"
          aria-label="Articoli salvati"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </Link>

        {/* Centro: wordmark Norma serif + chevron */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 30,
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1,
            letterSpacing: 1,
          }}>
            Norma
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </Link>

        {/* Destra: campanella con badge */}
        <button
          aria-label="Notifiche"
          onClick={markNotifRead}
          style={{
            position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {hasNew && (
            <span style={{
              position: 'absolute', top: 7, right: 7,
              width: 8, height: 8, borderRadius: '50%',
              background: '#ef4444',
              border: '1.5px solid #0a0d18',
            }} />
          )}
        </button>
      </div>

      {/* Pannello ricerca — fixed, visibile a qualsiasi posizione di scroll */}
      {searchOpen && (
        <div style={{
          position: 'fixed',
          top: 52,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          zIndex: 99,
          padding: '8px 14px 12px',
          background: '#0a0d18',
          borderBottom: '0.5px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#111526', borderRadius: 12,
            padding: '10px 14px',
            border: '0.5px solid rgba(143,211,255,0.25)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Cerca articoli..."
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#fff', fontSize: 13,
                fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
              }}
            />
            <button
              onClick={() => setSearchOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8fd3ff', fontSize: 11, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, padding: 0 }}
            >
              Chiudi
            </button>
          </div>

          {cercando && (
            <div style={{ padding: '10px 0', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif' }}>
              Ricerca in corso…
            </div>
          )}

          {!cercando && risultati.length > 0 && (
            <div style={{ marginTop: 8, maxHeight: 280, overflowY: 'auto' }}>
              {risultati.map((post, i) => {
                const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                const href = post._src === 'odl' ? post.link : `/articoli/${post.slug}`;
                return (
                  <a
                    key={i} href={href}
                    target={post._src === 'odl' ? '_blank' : '_self'} rel="noreferrer"
                    onClick={() => setSearchOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}
                  >
                    {img
                      ? <img src={img} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={{ width: 40, height: 40, borderRadius: 8, background: '#07162b', flexShrink: 0 }} />
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Montserrat, sans-serif' }}
                        dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }}
                      />
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
            <div style={{ padding: '10px 0', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif' }}>
              Nessun risultato per "{query}"
            </div>
          )}
        </div>
      )}
    </header>
  );
}
