'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mappa slug codice → dati del codice
const CODICI_INFO: Record<string, { nome: string; colore: string; href: string }> = {
  'salvati_Codice_Civile':         { nome: 'Codice Civile',                colore: '#38bdf8', href: '/codici/codice-civile' },
  'salvati_Codice_Penale':         { nome: 'Codice Penale',                colore: '#f97316', href: '/codici/codice-penale' },
  'salvati_Codice_di_Procedura_Civile':  { nome: 'Procedura Civile',       colore: '#a78bfa', href: '/codici/procedura-civile' },
  'salvati_Codice_di_Procedura_Penale':  { nome: 'Procedura Penale',       colore: '#fb7185', href: '/codici/procedura-penale' },
};

type ArticoloBlog = {
  slug: string;
  title: string;
  img?: string;
  _src?: string;
  link?: string;
};

type ArticoloCodice = {
  storageKey: string;
  numero: string;
  codiceNome: string;
  colore: string;
  href: string;
};

export default function Salvati() {
  const [blog, setBlog] = useState<ArticoloBlog[]>([]);
  const [codici, setCodici] = useState<ArticoloCodice[]>([]);
  const [tab, setTab] = useState<'tutti' | 'codici' | 'articoli'>('tutti');

  useEffect(() => {
    // Articoli blog
    try {
      const data = JSON.parse(localStorage.getItem('articoli_salvati') || '[]');
      setBlog(data);
    } catch {}

    // Articoli codici
    const articoliCodici: ArticoloCodice[] = [];
    Object.entries(CODICI_INFO).forEach(([key, info]) => {
      try {
        const saved = JSON.parse(localStorage.getItem(key) || '[]') as string[];
        saved.forEach(numero => {
          articoliCodici.push({
            storageKey: key,
            numero,
            codiceNome: info.nome,
            colore: info.colore,
            href: info.href,
          });
        });
      } catch {}
    });
    setCodici(articoliCodici);
  }, []);

  function rimuoviBlog(slug: string) {
    const nuovi = blog.filter(p => p.slug !== slug);
    setBlog(nuovi);
    localStorage.setItem('articoli_salvati', JSON.stringify(nuovi));
  }

  function rimuoviCodice(storageKey: string, numero: string) {
    setCodici(prev => prev.filter(a => !(a.storageKey === storageKey && a.numero === numero)));
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]') as string[];
      const nuovi = saved.filter(n => n !== numero);
      localStorage.setItem(storageKey, JSON.stringify(nuovi));
    } catch {}
  }

  const totaleTutto = blog.length + codici.length;

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        <div style={{ padding: '20px 16px 140px' }}>

          {/* HERO */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>
              La tua libreria
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 8 }}>
              Salvati
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
              {totaleTutto} {totaleTutto === 1 ? 'elemento salvato' : 'elementi salvati'}
            </div>
          </div>

          {/* TAB */}
          {totaleTutto > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {[
                { id: 'tutti', label: `Tutti (${totaleTutto})` },
                { id: 'codici', label: `Codici (${codici.length})` },
                { id: 'articoli', label: `Articoli (${blog.length})` },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as typeof tab)}
                  style={{
                    padding: '6px 12px', borderRadius: 10, cursor: 'pointer',
                    background: tab === t.id ? 'rgba(143,211,255,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `0.5px solid ${tab === t.id ? 'rgba(143,211,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    color: tab === t.id ? '#8fd3ff' : 'rgba(255,255,255,0.35)',
                    fontSize: 10, fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* VUOTO */}
          {totaleTutto === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🔖</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                Nessun elemento salvato
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                Tocca il segnalibro su un articolo o su una norma per salvarlo qui.
              </div>
            </div>
          )}

          {/* ARTICOLI CODICI */}
          {(tab === 'tutti' || tab === 'codici') && codici.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              {tab === 'tutti' && (
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 12 }}>
                  Articoli dei codici
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {codici.map((a, i) => (
                  <div key={i} style={{
                    background: '#111526',
                    borderRadius: 16,
                    border: `0.5px solid ${a.colore}22`,
                    padding: '14px 14px',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    {/* Numero */}
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: `${a.colore}12`,
                      border: `0.5px solid ${a.colore}33`,
                      display: 'flex', flexDirection: 'column' as const,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ fontSize: 7, fontWeight: 700, color: a.colore, letterSpacing: 0.5 }}>ART.</div>
                      <div style={{ fontSize: String(a.numero).length > 4 ? 9 : 12, fontWeight: 900, color: a.colore, lineHeight: 1 }}>
                        {a.numero}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 3 }}>
                        Art. {a.numero}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        background: `${a.colore}12`,
                        border: `0.5px solid ${a.colore}28`,
                        borderRadius: 5, padding: '2px 7px',
                        fontSize: 9, fontWeight: 700, color: a.colore,
                      }}>
                        {a.codiceNome}
                      </div>
                    </div>

                    {/* Azioni */}
                    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6, alignItems: 'flex-end' }}>
                      <Link
                        href={a.href}
                        style={{
                          fontSize: 9, fontWeight: 800, color: a.colore,
                          textDecoration: 'none', letterSpacing: 1,
                          textTransform: 'uppercase',
                        }}
                      >
                        Vai →
                      </Link>
                      <button
                        onClick={() => rimuoviCodice(a.storageKey, a.numero)}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '0.5px solid rgba(255,255,255,0.08)',
                          borderRadius: 7, padding: '3px 8px',
                          cursor: 'pointer', fontSize: 9,
                          color: 'rgba(255,255,255,0.35)',
                          fontFamily: 'Montserrat, sans-serif',
                        }}
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ARTICOLI BLOG */}
          {(tab === 'tutti' || tab === 'articoli') && blog.length > 0 && (
            <div>
              {tab === 'tutti' && (
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 12 }}>
                  Articoli
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {blog.map((post, i) => {
                  const isOdl = post._src === 'odl';
                  const href = isOdl ? (post.link ?? '#') : `/articoli/${post.slug}`;
                  return (
                    <div key={i} style={{
                      borderRadius: 18, background: '#111526',
                      border: '0.5px solid rgba(255,255,255,0.06)',
                      overflow: 'hidden',
                    }}>
                      {post.img && (
                        <img src={post.img} alt="" style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                      )}
                      <div style={{ padding: '12px 14px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{
                            fontSize: 8, fontWeight: 700, letterSpacing: 1.5,
                            color: isOdl ? '#a8c8f0' : '#8fd3ff',
                            border: `0.5px solid ${isOdl ? 'rgba(168,200,240,0.3)' : 'rgba(143,211,255,0.3)'}`,
                            borderRadius: 20, padding: '3px 8px', textTransform: 'uppercase',
                          }}>
                            {isOdl ? 'Orizzonti del Diritto' : 'Orizzonte Giuridico'}
                          </span>
                          <button
                            onClick={() => rimuoviBlog(post.slug)}
                            style={{
                              background: 'rgba(255,255,255,0.06)', border: 'none',
                              borderRadius: 8, padding: '5px 8px', cursor: 'pointer',
                              fontSize: 9, color: 'rgba(255,255,255,0.4)',
                              fontFamily: 'Montserrat, sans-serif',
                            }}
                          >
                            Rimuovi
                          </button>
                        </div>
                        <div
                          style={{ fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 10 }}
                          dangerouslySetInnerHTML={{ __html: post.title || '' }}
                        />
                        <a
                          href={href}
                          target={isOdl ? '_blank' : '_self'}
                          rel="noreferrer"
                          style={{
                            fontSize: 9, fontWeight: 800, color: '#8fd3ff',
                            letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'none',
                          }}
                        >
                          Leggi l'articolo →
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        <Footer />
      </div>
    </>
  );
}