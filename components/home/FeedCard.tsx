'use client';
import { useEffect, useState } from 'react';

type Post = {
  id?: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  _embedded?: any;
  _source: 'og' | 'odl';
  link: string;
};

function dataRelativa(isoString: string): string {
  try {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffOre = Math.floor(diffMin / 60);
    const diffGiorni = Math.floor(diffOre / 24);
    if (diffMin < 5) return 'Adesso';
    if (diffMin < 60) return `${diffMin} min fa`;
    if (diffOre < 24) return `${diffOre} ore fa`;
    if (diffGiorni === 1) return 'Ieri';
    if (diffGiorni < 7) return `${diffGiorni} giorni fa`;
    return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  } catch { return ''; }
}

export default function FeedCard({ post }: { post: Post }) {
  const isOdl = post._source === 'odl';
  const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const cat = post._embedded?.['wp:term']?.[0]?.[0]?.name || '';
  const href = isOdl ? post.link : `/articoli/${post.slug}`;
  const handle = isOdl ? 'orizzontideldiritto' : 'orizzonte.giuridico';
  const titleText = post.title.rendered.replace(/<[^>]+>/g, '');

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const excerpt = post.excerpt?.rendered
    ? post.excerpt.rendered
        .replace(/<[^>]+>/g, '')
        .replace(/&hellip;/g, '…')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#8217;/g, '’')
        .replace(/&#8211;/g, '–')
        .replace(/\[…\]/g, '…')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180)
    : '';

  // SSR-safe: read localStorage only on client
  useEffect(() => {
    try {
      const items: { slug: string }[] = JSON.parse(localStorage.getItem('articoli_salvati') || '[]');
      setSaved(items.some(s => s.slug === post.slug));
    } catch {}
  }, [post.slug]);

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    try {
      const items: any[] = JSON.parse(localStorage.getItem('articoli_salvati') || '[]');
      if (saved) {
        localStorage.setItem('articoli_salvati', JSON.stringify(items.filter(s => s.slug !== post.slug)));
      } else {
        items.unshift({ slug: post.slug, title: titleText, img, _src: post._source, link: post.link });
        localStorage.setItem('articoli_salvati', JSON.stringify(items));
      }
      setSaved(s => !s);
      navigator.vibrate?.(6);
    } catch {}
  }

  function share(e: React.MouseEvent) {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({ title: titleText, url: window.location.origin + href }).catch(() => {});
    }
  }

  return (
    <article
      style={{
        background: '#0a0d18',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        paddingBottom: 2,
      }}
    >
      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
      }}>
        {/* Avatar */}
        {isOdl ? (
          /* OD: logo bianco su cerchio navy — contained, non clippato */
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: '#0e1e42',
            border: '1.5px solid rgba(168,200,240,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 5,
          }}>
            <img
              src="/logo-od-white.svg"
              alt="Orizzonti del Diritto"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        ) : (
          /* OG: logo ufficiale circolare con bordo sottile */
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            overflow: 'hidden',
            border: '1.5px solid rgba(143,211,255,0.15)',
          }}>
            <img
              src="/logo-og.png"
              alt="Orizzonte Giuridico"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        )}

        {/* Handle + categoria */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12.5, fontWeight: 800, color: '#fff',
            fontFamily: 'Montserrat, sans-serif',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {handle}
          </div>
          {cat && (
            <div style={{
              fontSize: 10, color: 'rgba(255,255,255,0.38)',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              {cat}
            </div>
          )}
        </div>

        {/* Menu ··· */}
        <button
          aria-label="Opzioni articolo"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px 6px', color: 'rgba(255,255,255,0.55)',
            fontSize: 18, lineHeight: 1, letterSpacing: 1,
          }}
        >
          ···
        </button>
      </div>

      {/* ── Media 4:5 ── */}
      <a
        href={href}
        target={isOdl ? '_blank' : '_self'}
        rel={isOdl ? 'noreferrer noopener' : undefined}
        aria-label={`Leggi: ${titleText}`}
        style={{
          display: 'block', position: 'relative',
          aspectRatio: '4/5',
          background: '#07162b', overflow: 'hidden',
        }}
      >
        {img ? (
          <img
            src={img}
            alt={titleText}
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg,#07162b,#0d2040)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: 'rgba(143,211,255,0.2)' }}>OG</span>
          </div>
        )}

        {/* Gradient overlay per il titolo */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%)',
        }} />

        {/* Solo il titolo */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '16px 14px 20px',
        }}>
          <div
            style={{
              fontSize: 20, fontWeight: 900, color: '#fff',
              lineHeight: 1.15, letterSpacing: -0.3,
              fontFamily: 'Montserrat, sans-serif',
            }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </div>
      </a>

      {/* ── Azioni ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '10px 14px 6px', gap: 16,
      }}>
        {/* Like */}
        <button
          aria-label={liked ? 'Togli like' : 'Metti like'}
          onClick={e => { e.preventDefault(); setLiked(l => !l); navigator.vibrate?.(6); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24"
            fill={liked ? '#ef4444' : 'none'}
            stroke={liked ? '#ef4444' : 'rgba(255,255,255,0.85)'}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'fill 0.15s, stroke 0.15s' }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Commento → apre articolo */}
        <a
          href={href}
          target={isOdl ? '_blank' : '_self'}
          rel={isOdl ? 'noreferrer noopener' : undefined}
          aria-label="Leggi i commenti"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </a>

        {/* Condividi */}
        <button
          aria-label="Condividi articolo"
          onClick={share}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill="rgba(255,255,255,0.85)" stroke="none"/>
          </svg>
        </button>

        {/* Salva — push a destra */}
        <button
          aria-label={saved ? 'Rimuovi dai salvati' : 'Salva articolo'}
          onClick={toggleSave}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24"
            fill={saved ? '#8fd3ff' : 'none'}
            stroke={saved ? '#8fd3ff' : 'rgba(255,255,255,0.85)'}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'fill 0.15s, stroke 0.15s' }}
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      {/* ── Caption ── */}
      <div style={{ padding: '2px 14px 12px' }}>
        {excerpt && (
          <div style={{
            fontSize: 13, lineHeight: 1.55,
            fontFamily: 'Montserrat, sans-serif',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: 7,
          }}>
            <span style={{ fontWeight: 800, color: '#fff', marginRight: 6 }}>{handle}</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{excerpt}</span>
          </div>
        )}

        {/* Leggi + tempo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a
            href={href}
            target={isOdl ? '_blank' : '_self'}
            rel={isOdl ? 'noreferrer noopener' : undefined}
            style={{
              fontSize: 11.5, fontWeight: 700,
              color: '#8fd3ff', textDecoration: 'none',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Leggi l'articolo →
          </a>
          <span style={{
            fontSize: 10, color: 'rgba(255,255,255,0.28)',
            fontFamily: 'Montserrat, sans-serif',
          }}>
            {dataRelativa(post.date)}
          </span>
        </div>
      </div>
    </article>
  );
}
