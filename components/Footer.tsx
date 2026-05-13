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

  function handleCenterButton() {
    if (cercaAperta) { setCercaAperta(false); return; }
    if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
    else router.push('/');
  }

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">

      {/* BARRA RICERCA sopra footer */}
      {cercaAperta && (
        <div style={{ background: '#031327', borderTop: '0.5px solid rgba(255,255,255,0.08)', padding: '12px 16px' }}>
          {/* INPUT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#111526', borderRadius: 12, padding: '10px 14px', border: '0.5px solid rgba(143,211,255,0.25)', marginBottom: 8 }}>
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
            {query ? (
              <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: 16, padding: 0, lineHeight: 1 }}>✕</button>
            ) : (
              <button onClick={() => setCercaAperta(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Montserrat, sans-serif', fontWeight: 700, padding: 0 }}>Chiudi</button>
            )}
          </div>

          {/* RISULTATI */}
          {cercando && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif', padding: '4px 0' }}>Ricerca in corso...</div>
          )}
          {!cercando && risultati.length > 0 && (
            <div style={{ maxHeight: 240, overflowY: 'auto' }}>
              {risultati.map((post, i) => {
                const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                const href = post._src === 'odl' ? post.link : `/articoli/${post.slug}`;
                return (
                  <a key={i} href={href} target={post._src === 'odl' ? '_blank' : '_self'} rel="noreferrer"
                    onClick={() => setCercaAperta(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
                    {img && <img src={img} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
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
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif', padding: '4px 0' }}>Nessun risultato per "{query}"</div>
          )}
        </div>
      )}

      {/* FOOTER BAR */}
      <div
  className="absolute inset-0 border-t border-white/[0.05]"
  style={{
    position: 'relative',
    background: '#041428',
    opacity: 1,
    backdropFilter: 'none',
  }}
/>
      <div className="relative h-[88px] flex items-center justify-around px-2">

        {/* HOME */}
        <button onClick={() => { setCercaAperta(false); router.push('/'); }} className="flex flex-col items-center justify-center gap-[5px] flex-1">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke={isActive('/') && !cercaAperta ? '#8fd3ff' : 'rgba(255,255,255,0.28)'} strokeWidth="1.9">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9.5z" />
          </svg>
          <span className={`text-[9px] tracking-[2px] font-black uppercase ${isActive('/') && !cercaAperta ? 'text-[#8fd3ff]' : 'text-white/25'}`}>Feed</span>
        </button>

        {/* CERCA */}
        <button onClick={() => setCercaAperta(!cercaAperta)} className="flex flex-col items-center justify-center gap-[5px] flex-1">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke={cercaAperta ? '#8fd3ff' : 'rgba(255,255,255,0.28)'} strokeWidth="1.9">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className={`text-[9px] tracking-[2px] font-black uppercase ${cercaAperta ? 'text-[#8fd3ff]' : 'text-white/25'}`}>Cerca</span>
        </button>

        {/* CENTER */}
        <div className="relative -mt-10 flex flex-col items-center justify-center w-[96px]">
          <div className="absolute top-0 w-[90px] h-[90px] rounded-full bg-[#0f6fff]/20 blur-2xl" />
          <button onClick={handleCenterButton}
            className="relative w-[74px] h-[74px] rounded-full bg-[#071225] border border-[#1c4d7d] flex items-center justify-center shadow-[0_0_30px_rgba(0,123,255,0.25)]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <span className="text-white text-[44px] leading-none">N</span>
          </button>
          <span className="mt-2 text-[9px] tracking-[2px] font-black uppercase text-white/25">Norma</span>
        </div>

        {/* SALVATI */}
        <button onClick={() => { setCercaAperta(false); router.push('/salvati'); }} className="flex flex-col items-center justify-center gap-[5px] flex-1">
          <svg width="25" height="25" viewBox="0 0 24 24" fill={isActive('/salvati') ? '#8fd3ff' : 'none'} stroke={isActive('/salvati') ? '#8fd3ff' : 'rgba(255,255,255,0.28)'} strokeWidth="1.9">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span className={`text-[9px] tracking-[2px] font-black uppercase ${isActive('/salvati') ? 'text-[#8fd3ff]' : 'text-white/25'}`}>Salvati</span>
        </button>

        {/* AVVISI */}
        <button onClick={() => { setCercaAperta(false); router.push('/avvisi'); }} className="flex flex-col items-center justify-center gap-[5px] flex-1">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke={isActive('/avvisi') ? '#8fd3ff' : 'rgba(255,255,255,0.28)'} strokeWidth="1.9">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={`text-[9px] tracking-[2px] font-black uppercase ${isActive('/avvisi') ? 'text-[#8fd3ff]' : 'text-white/25'}`}>Avvisi</span>
        </button>

      </div>
    </div>
  );
}
