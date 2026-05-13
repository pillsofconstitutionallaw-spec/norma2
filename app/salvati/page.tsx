'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Salvati() {
  const [salvati, setSalvati] = useState<any[]>([]);

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('norma_salvati') || '[]');
      setSalvati(data);
    } catch (e) {}
  }, []);

  function rimuovi(slug: string) {
    const nuovi = salvati.filter(p => p.slug !== slug);
    setSalvati(nuovi);
    localStorage.setItem('norma_salvati', JSON.stringify(nuovi));
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        .sv-app { font-family: 'Montserrat', sans-serif; background: #0a0d18; width: 100%; min-height: 100vh; }
        .sv-feed { padding: 20px 16px 140px; }
        @media (min-width: 768px) { .sv-feed { padding: 32px 40px 140px; } }
        @media (min-width: 1024px) { .sv-feed { padding: 40px 80px 140px; } }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
      `}</style>

      <div className="sv-app">
        <Header />
        <div className="sv-feed">

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>La tua libreria</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5 }}>Articoli salvati</div>
          </div>

          {salvati.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔖</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Nessun articolo salvato</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                Tocca il segnalibro su un articolo per salvarlo qui.
              </div>
            </div>
          ) : (
            salvati.map((post, i) => {
              const isOdl = post._src === 'odl';
              const href = isOdl ? post.link : `/articoli/${post.slug}`;
              return (
                <div key={i} style={{ borderRadius: 18, background: '#111526', border: '0.5px solid rgba(255,255,255,0.06)', marginBottom: 10, overflow: 'hidden' }}>
                  {post.img && (
                    <img src={post.img} alt="" style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                  )}
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, color: isOdl ? '#a8c8f0' : '#8fd3ff', border: `0.5px solid ${isOdl ? 'rgba(168,200,240,0.3)' : 'rgba(143,211,255,0.3)'}`, borderRadius: 20, padding: '3px 8px', textTransform: 'uppercase' }}>
                        {isOdl ? 'Orizzonti del Diritto' : 'Orizzonte Giuridico'}
                      </span>
                      <button onClick={() => rimuovi(post.slug)}
                        style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: '5px 8px', cursor: 'pointer', fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat, sans-serif' }}>
                        Rimuovi
                      </button>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 8 }}
                      dangerouslySetInnerHTML={{ __html: post.title || '' }} />
                    <a href={href} target={isOdl ? '_blank' : '_self'} rel="noreferrer"
                      style={{ fontSize: 9, fontWeight: 800, color: '#8fd3ff', letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'none' }}>
                      Leggi l'articolo →
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}