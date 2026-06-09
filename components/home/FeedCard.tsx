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

export default function FeedCard({ post }: { post: Post }) {
  const isOdl = post._source === 'odl';
  const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const cat = post._embedded?.['wp:term']?.[0]?.[0]?.name || '';
  const href = isOdl ? post.link : `/articoli/${post.slug}`;
  const handle = isOdl ? 'orizzontideldiritto' : 'orizzonte.giuridico';
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

  return (
    <article style={{ background: '#0a0d18', borderBottom: '0.5px solid rgba(255,255,255,0.07)', paddingBottom: 2 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
        {isOdl ? (
          <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: '#0e1e42', border: '1.5px solid rgba(168,200,240,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5 }}>
            <img src="/logo-od-white.svg" alt="Orizzonti del Diritto" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        ) : (
          <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', border: '1.5px solid rgba(143,211,255,0.15)' }}>
            <img src="/logo-og.png" alt="Orizzonte Giuridico" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: '#fff', fontFamily: 'Montserrat, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{handle}</div>
          {cat && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', fontFamily: 'Montserrat, sans-serif' }}>{cat}</div>}
        </div>
        <button aria-label="Opzioni articolo" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'rgba(255,255,255,0.55)', fontSize: 18, lineHeight: 1, letterSpacing: 1 }}>···</button>
      </div>

      {/* ── Media 4:5 ── */}
      <a href={href} target={isOdl ? '_blank' : '_self'} rel={isOdl ? 'noreferrer noopener' : undefined} aria-label={`Leggi: ${titleText}`}
        style={{ display: 'block', position: 'relative', aspectRatio: '4/5', background: '#07162b', overflow: 'hidden' }}>
        {img ? (
          <img src={img} alt={titleText} loading="lazy" decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#07162b,#0d2040)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: 'rgba(143,211,255,0.2)' }}>OG</span>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px 20px' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.3, fontFamily: 'Montserrat, sans-serif' }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </div>
      </a>

      {/* ── Azioni ── */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px 6px', gap: 16 }}>
        <button aria-label={liked ? 'Togli like' : 'Metti like'}
          onClick={e => { e.preventDefault(); setLiked(l => !l); navigator.vibrate?.(6); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24"
            fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : 'rgba(255,255,255,0.85)'}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'fill 0.15s, stroke 0.15s' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <button aria-label="Aggiungi un commento"
          onClick={handleCommentTap}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>

        <button aria-label="Condividi articolo" onClick={share}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill="rgba(255,255,255,0.85)" stroke="none"/>
          </svg>
        </button>

        <button aria-label={saved ? 'Rimuovi dai salvati' : 'Salva articolo'} onClick={toggleSave}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <svg width="26" height="26" viewBox="0 0 24 24"
            fill={saved ? '#8fd3ff' : 'none'} stroke={saved ? '#8fd3ff' : 'rgba(255,255,255,0.85)'}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'fill 0.15s, stroke 0.15s' }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      {/* ── Caption ── */}
      <div style={{ padding: '2px 14px 8px' }}>
        {excerpt && (
          <div style={{ fontSize: 13, lineHeight: 1.55, fontFamily: 'Montserrat, sans-serif', color: 'rgba(255,255,255,0.85)', marginBottom: 7 }}>
            <span style={{ fontWeight: 800, color: '#fff', marginRight: 6 }}>{handle}</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{excerpt}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href={href} target={isOdl ? '_blank' : '_self'} rel={isOdl ? 'noreferrer noopener' : undefined}
            style={{ fontSize: 11.5, fontWeight: 700, color: '#8fd3ff', textDecoration: 'none', fontFamily: 'Montserrat, sans-serif' }}>
            Leggi l'articolo →
          </a>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: 'Montserrat, sans-serif' }}>{dataRelativa(post.date)}</span>
        </div>
      </div>

      {/* ── Commenti ── */}
      {!isOdl && post.id && (
        <div style={{ padding: '0 14px 14px', fontFamily: 'Montserrat, sans-serif' }}>

          {/* Contatore */}
          {commentCount > 0 && (
            <a href={href} style={{ display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', marginBottom: 7 }}>
              Vedi tutti i {commentCount} commenti
            </a>
          )}

          {/* Ultimi commenti */}
          {comments.slice(-2).map(c => (
            <div key={c.id} style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 5, color: 'rgba(255,255,255,0.85)' }}>
              <span style={{ fontWeight: 800, color: '#fff', marginRight: 6 }}>{c.author_name}</span>
              <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.65)' }}>{stripHtml(c.content.rendered)}</span>
            </div>
          ))}

          {/* Feedback invio */}
          {postOk && (
            <div style={{ fontSize: 11, color: '#22c55e', marginBottom: 6 }}>✓ Commento inviato</div>
          )}

          {/* Input area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: '0.5px solid rgba(255,255,255,0.07)', paddingTop: 10, marginTop: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {!showInput ? (
                <button onClick={handleCommentTap}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left', fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif' }}>
                  Aggiungi un commento…
                </button>
              ) : (
                <>
                  {needsName && !authorName && (
                    <input
                      placeholder="Il tuo nome"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      style={{ background: 'none', border: 'none', borderBottom: '0.5px solid rgba(255,255,255,0.15)', outline: 'none', color: '#fff', fontSize: 12, fontFamily: 'Montserrat, sans-serif', paddingBottom: 4, width: '100%' }}
                    />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      ref={inputRef}
                      placeholder="Aggiungi un commento…"
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submitComment()}
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 12, fontFamily: 'Montserrat, sans-serif' }}
                    />
                    {commentInput.trim() && (
                      <button onClick={submitComment} disabled={posting}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800, color: '#8fd3ff', fontFamily: 'Montserrat, sans-serif', opacity: posting ? 0.4 : 1, padding: 0 }}>
                        {posting ? '…' : 'Pubblica'}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </article>
  );
}
