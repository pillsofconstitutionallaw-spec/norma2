'use client';
import { useEffect, useRef, useState } from 'react';

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

type WpComment = {
  id: number;
  author_name: string;
  content: { rendered: string };
  date: string;
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

  // ── Commenti ──
  const [comments, setComments] = useState<WpComment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [needsName, setNeedsName] = useState(false);
  const [posting, setPosting] = useState(false);
  const [postOk, setPostOk] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Carica nome autore salvato
  useEffect(() => {
    try {
      const stored = localStorage.getItem('norma_author_name');
      if (stored) setAuthorName(stored);
    } catch {}
  }, []);

  // Carica commenti WP (solo OG con ID)
  useEffect(() => {
    if (!post.id || isOdl) return;
    fetch(
      `https://orizzontegiuridico.com/wp-json/wp/v2/comments?post=${post.id}&per_page=3&orderby=date&order=asc`
    )
      .then(async r => {
        const total = r.headers.get('X-WP-Total');
        if (total) setCommentCount(parseInt(total, 10));
        const data = await r.json();
        if (Array.isArray(data)) setComments(data);
      })
      .catch(() => {});
  }, [post.id]);

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

  function handleCommentTap() {
    if (!authorName) {
      setNeedsName(true);
    }
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  async function submitComment() {
    const name = authorName || nameInput.trim();
    if (!commentInput.trim() || !name || !post.id) return;
    setPosting(true);
    try {
      const res = await fetch('https://orizzontegiuridico.com/wp-json/wp/v2/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: post.id,
          author_name: name,
          author_email: `${name.toLowerCase().replace(/\s+/g, '.')}@norma.app`,
          content: commentInput,
        }),
      });
      if (res.ok) {
        const newComment: WpComment = await res.json();
        setComments(prev => [...prev, newComment]);
        setCommentCount(c => c + 1);
        setCommentInput('');
        setShowInput(false);
        setNeedsName(false);
        setPostOk(true);
        setTimeout(() => setPostOk(false), 2000);
        if (!authorName) {
          setAuthorName(name);
          try { localStorage.setItem('norma_author_name', name); } catch {}
        }
      }
    } catch {}
    finally { setPosting(false); }
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
          <Azione label="Aggiungi un commento" onClick={handleCommentTap}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {commentCount > 0 && <span className="feed-conta">{commentCount}</span>}
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

        {/* ── Commenti ── */}
        {!isOdl && post.id && (comments.length > 0 || showInput || postOk) && (
          <div className="feed-commenti">
            {comments.slice(-2).map(c => (
              <p key={c.id} className="feed-commento">
                <b>{c.author_name}</b> {stripHtml(c.content.rendered)}
              </p>
            ))}
            {commentCount > 2 && <a href={href} className="feed-tutti">Vedi tutti i {commentCount} commenti</a>}
            {postOk && <div className="feed-ok">✓ Commento inviato</div>}
            {showInput && (
              <div className="feed-input">
                {needsName && !authorName && (
                  <input placeholder="Il tuo nome" value={nameInput} onChange={e => setNameInput(e.target.value)} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input ref={inputRef} placeholder="Aggiungi un commento…" value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submitComment()} />
                  {commentInput.trim() && (
                    <button onClick={submitComment} disabled={posting} className="link-azione tap" style={{ fontSize: 15, fontWeight: 600 }}>
                      {posting ? '…' : 'Pubblica'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
