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

function decodeEntities(html: string): string {
  if (typeof document !== 'undefined') {
    const ta = document.createElement('textarea');
    ta.innerHTML = html;
    return ta.value;
  }
  return html
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}


export default function FeedCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  const isOdl = post._source === 'odl';
  const _media = post._embedded?.['wp:featuredmedia']?.[0];
  const img =
    _media?.media_details?.sizes?.medium_large?.source_url ||
    _media?.media_details?.sizes?.large?.source_url ||
    _media?.source_url;
  const cat = post._embedded?.['wp:term']?.[0]?.[0]?.name || '';
  const href = isOdl ? post.link : `/articoli/${post.slug}`;
  const titleText = post.title.rendered.replace(/<[^>]+>/g, '');

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const excerpt = post.excerpt?.rendered
    ? stripHtml(post.excerpt.rendered).replace(/\[…\]/g, '…').slice(0, 180)
    : '';

  // Carica salvati
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

  const Azione = ({ label, onClick, children, attivo }: { label: string; onClick: (e: React.MouseEvent) => void; children: React.ReactNode; attivo?: boolean }) => (
    <button aria-label={label} onClick={onClick} className="feed-azione tap" data-attivo={attivo}>{children}</button>
  );

  return (
    <article className="feed-card card appare">
      {/* ── Immagine ── */}
      <a href={href} target={isOdl ? '_blank' : '_self'} rel={isOdl ? 'noreferrer noopener' : undefined}
        aria-label={`Leggi: ${titleText}`} className="feed-media">
        {img ? (
          <img src={img} alt={titleText} loading={priority ? 'eager' : 'lazy'} decoding="async"
            fetchPriority={priority ? 'high' : 'auto'} />
        ) : (
          <div className="feed-media-vuota"><span>Norma<i /></span></div>
        )}
        {cat && <span className="chip-vetro">{cat}</span>}
      </a>

      <div className="feed-corpo">
        {/* ── Fonte ── */}
        <div className="feed-fonte">
          <span className="feed-avatar" data-odl={isOdl}>
            <img src={isOdl ? '/logo-od-white.svg' : '/logo-og.png'} alt="" />
          </span>
          <span className="feed-handle">{isOdl ? 'Orizzonti del Diritto' : 'Orizzonte Giuridico'}</span>
          <span className="feed-data">· {dataRelativa(post.date)}</span>
        </div>

        {/* ── Titolo ed estratto ── */}
        <a href={href} target={isOdl ? '_blank' : '_self'} rel={isOdl ? 'noreferrer noopener' : undefined} className="feed-testo">
          <h3 className="feed-titolo" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          {excerpt && <p className="feed-estratto">{excerpt}</p>}
        </a>

        {/* ── Azioni ── */}
        <div className="feed-azioni">
          <Azione label={liked ? 'Togli like' : 'Metti like'} attivo={liked}
            onClick={e => { e.preventDefault(); setLiked(l => !l); navigator.vibrate?.(6); }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Azione>
          <Azione label="Condividi articolo" onClick={share}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </Azione>
          <span style={{ flex: 1 }} />
          <Azione label={saved ? 'Rimuovi dai salvati' : 'Salva articolo'} onClick={toggleSave} attivo={saved}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </Azione>
        </div>

      </div>
    </article>
  );
}

/* Articolo in formato compatto: miniatura a sinistra, titolo a destra.
   Usato nella Home sotto l'articolo in evidenza. */
export function ArticoloCompatto({ post }: { post: Post }) {
  const isOdl = post._source === 'odl';
  const m = post._embedded?.['wp:featuredmedia']?.[0];
  const img = m?.media_details?.sizes?.thumbnail?.source_url || m?.media_details?.sizes?.medium?.source_url || m?.source_url;
  const cat = post._embedded?.['wp:term']?.[0]?.[0]?.name || '';
  const href = isOdl ? post.link : `/articoli/${post.slug}`;
  return (
    <a href={href} target={isOdl ? '_blank' : '_self'} rel={isOdl ? 'noreferrer noopener' : undefined} className="riga articolo-compatto">
      <div className="riga-testo">
        {cat && <div className="compatto-cat">{cat}</div>}
        <div className="compatto-titolo" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <div className="riga-sub">{isOdl ? 'Orizzonti del Diritto' : 'Orizzonte Giuridico'} · {dataRelativa(post.date)}</div>
      </div>
      {img
        ? <img src={img} alt="" loading="lazy" className="compatto-img" />
        : <div className="compatto-img feed-media-vuota" />}
    </a>
  );
}
