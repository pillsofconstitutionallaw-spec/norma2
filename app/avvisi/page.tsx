'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Avvisi() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carica() {
      try {
        const [r1, r2] = await Promise.all([
          fetch('https://orizzontegiuridico.com/wp-json/wp/v2/posts?per_page=15&_embed'),
          fetch('https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?per_page=10&_embed'),
        ]);
        const d1 = await r1.json();
        const d2 = await r2.json();
        const og = Array.isArray(d1) ? d1.map((p: any) => ({ ...p, _src: 'og' })) : [];
        const odl = Array.isArray(d2) ? d2.map((p: any) => ({ ...p, _src: 'odl' })) : [];
        const merged = [...og, ...odl].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(merged);
      } catch (e) {}
      setLoading(false);
    }
    carica();
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--bg); }
        .av-app { font-family: var(--font-ui); background: var(--bg); width: 100%; min-height: 100vh; }
        .av-feed { padding: 20px 16px 140px; }
        @media (min-width: 768px) { .av-feed { padding: 28px 24px 140px; } }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
      `}</style>

      <div className="av-app">
        <Header />
        <div className="av-feed">

          {/* TITOLO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-ui)'}}>
              Aggiornamenti
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', lineHeight: 1.15, letterSpacing: -0.8, fontFamily: 'var(--font-display)'}}>
              Avvisi
            </div>
          </div>

          {/* LISTA */}
          {loading ? (
            [0,1,2,3,4,5].map(i => (
              <div key={i} style={{ borderRadius: 14, background: 'var(--surface)', marginBottom: 8, height: 70, border: '0.5px solid var(--line)' }} />
            ))
          ) : posts.map((post, i) => {
            const isOdl = post._src === 'odl';
            const data = post?.date ? new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
            const cat = post?._embedded?.['wp:term']?.[0]?.[0]?.name || '';
            const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const href = isOdl ? post.link : `/articoli/${post.slug}`;

            return (
              <a key={i} href={href} target={isOdl ? '_blank' : '_self'} rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 6, borderRadius: 14, background: 'var(--surface)', border: '0.5px solid var(--line)', textDecoration: 'none', transition: 'opacity .15s' }}>

                {/* Immagine o dot */}
                {img
                  ? <img src={img} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--surface-2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isOdl ? '#4f46e5' : '#4f46e5'} strokeWidth="1.8" strokeLinecap="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                      </svg>
                    </div>
                }

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: isOdl ? 'var(--accent)' : 'var(--accent)', letterSpacing: 0.4, textTransform: 'uppercase', fontFamily: 'var(--font-ui)', border: `0.5px solid ${isOdl ? 'rgba(168,200,240,0.3)' : 'rgba(79,70,229,0.3)'}`, borderRadius: 20, padding: '2px 7px' }}>
                      {isOdl ? 'OdD' : cat || 'OG'}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-ui)'}}>{data}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)', lineHeight: 1.3 }}
                    dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }} />
                </div>

                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path d="M9 18l6-6-6-6"/>
                </svg>

              </a>
            );
          })}

        </div>
      </div>
      <Footer />
    </>
  );
}