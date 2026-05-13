'use client';

import { useMemo, useRef, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { articoli } from './articoli';

const sezioni = [
  { label: 'Principi fondamentali', range: [1, 12] },
  { label: 'Rapporti civili', range: [13, 28] },
  { label: 'Rapporti etico-sociali', range: [29, 34] },
  { label: 'Rapporti economici', range: [35, 47] },
  { label: 'Rapporti politici', range: [48, 54] },
  { label: 'Ordinamento della Repubblica', range: [55, 139] },
  { label: 'Disposizioni transitorie', range: [140, 999] },
];

export default function CostituzionePage() {
  const [search, setSearch] = useState('');
  const [spiegazioni, setSpiegazioni] = useState<Record<string, string>>({});
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});
  const [mappe, setMappe] = useState<Record<string, any>>({});
  const [loadingMappe, setLoadingMappe] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const sezioneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtrati = useMemo(() => {
    return articoli.filter((a: any) => {
      const q = search.toLowerCase();
      return (
        a.n.toString().includes(q) ||
        a.titolo.toLowerCase().includes(q) ||
        a.testo.toLowerCase().includes(q) ||
        a.sezione.toLowerCase().includes(q)
      );
    });
  }, [search]);

  async function spiegaArticolo(articolo: any) {
    try {
      setLoadingAI((prev) => ({ ...prev, [articolo.n]: true }));
      const res = await fetch('/api/spiega', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articolo: articolo.n, testo: articolo.testo }),
      });
      const data = await res.json();
      setSpiegazioni((prev) => ({ ...prev, [articolo.n]: data.spiegazione }));
      setExpanded((prev) => ({ ...prev, [articolo.n]: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI((prev) => ({ ...prev, [articolo.n]: false }));
    }
  }

  async function generaMappa(articolo: any) {
    try {
      setLoadingMappe((prev) => ({ ...prev, [articolo.n]: true }));
      const res = await fetch('/api/mappa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articolo: articolo.n, testo: articolo.testo }),
      });
      const data = await res.json();
      setMappe((prev) => ({ ...prev, [articolo.n]: data }));
      setExpanded((prev) => ({ ...prev, [articolo.n]: true }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMappe((prev) => ({ ...prev, [articolo.n]: false }));
    }
  }

  function ascoltaArticolo(testo: string) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(testo);
    utterance.lang = 'it-IT';
    utterance.rate = 0.92;
    speechSynthesis.speak(utterance);
  }

  function scrollToSezione(range: number[]) {
    const firstArticolo = articoli.find((a: any) => a.n >= range[0] && a.n <= range[1]);
    if (!firstArticolo) return;
    const el = sezioneRefs.current[firstArticolo.n];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Group articles by sezione
  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filtrati.forEach((a: any) => {
      if (!groups[a.sezione]) groups[a.sezione] = [];
      groups[a.sezione].push(a);
    });
    return groups;
  }, [filtrati]);

  return (
    <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', paddingBottom: 120, fontFamily: "'Montserrat', sans-serif" }}>
      <Header />

      {/* HERO */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', height: 360, border: '0.5px solid rgba(255,255,255,0.06)' }}>
          <img
            src="https://images.unsplash.com/photo-1731594700232-7f891e3e4e30?q=80&w=2670&auto=format&fit=crop"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            alt="Costituzione Italiana"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #07111f 0%, rgba(7,17,31,0.5) 50%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '28px 24px' }}>
            <div style={{ display: 'inline-block', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 99, padding: '4px 14px', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: 14 }}>
              Repubblica Italiana · 1948
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.1, letterSpacing: -1, color: '#fff', marginBottom: 10 }}>
              La Costituzione<br />spiegata facile
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              139 articoli · spiegazioni AI · mappe · audio
            </div>
          </div>
        </div>
      </div>

      {/* SOMMARIO */}
      {!search && (
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 24, height: 1, background: 'rgba(143,211,255,0.4)' }} />
              <span style={{ color: '#8fd3ff', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: 800 }}>Sommario</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
            </div>
            <div style={{ background: '#0d1829', borderRadius: 20, overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.06)' }}>
              {sezioni.map((s, i) => (
                <button
                  key={i}
                  onClick={() => scrollToSezione(s.range)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: i < sezioni.length - 1 ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left' as const,
                  }}
                >
                  <div>
                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{s.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>
                      Art. {s.range[0]}{s.range[1] < 999 ? `–${s.range[1]}` : '+'}
                    </div>
                  </div>
                  <div style={{ color: '#8fd3ff', fontSize: 14 }}>→</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEARCH */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Cerca articolo, principio, diritto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              padding: '0 44px 0 18px',
              color: '#fff',
              fontSize: 13,
              outline: 'none',
              fontFamily: "'Montserrat', sans-serif",
              boxSizing: 'border-box' as const,
            }}
          />
          <svg style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* ARTICOLI */}
      <div style={{ padding: '20px 16px 0' }}>
        {Object.entries(grouped).map(([sezione, arts]) => (
          <div key={sezione}>
            {/* Sezione header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, marginTop: 8 }}>
              <div style={{ width: 24, height: 1, background: 'rgba(143,211,255,0.4)' }} />
              <span style={{ color: '#8fd3ff', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: 800 }}>{sezione}</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
            </div>

            {arts.map((articolo: any) => (
              <div
                key={articolo.n}
                ref={(el) => { sezioneRefs.current[articolo.n] = el; }}
                style={{ marginBottom: 14 }}
              >
                <div style={{ background: '#0d1829', borderRadius: 24, overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.06)' }}>

                  {/* Card header */}
                  <div style={{ padding: '18px 18px 0', position: 'relative' }}>
                    <div style={{ position: 'absolute', right: 12, top: -10, fontSize: 80, fontWeight: 900, color: 'rgba(143,211,255,0.06)', lineHeight: 1, userSelect: 'none' as const, fontFamily: 'Georgia, serif' }}>
                      {articolo.n}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                      <div>
                        <div style={{ color: '#8fd3ff', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: 800, marginBottom: 4 }}>{articolo.titolo}</div>
                        <div style={{ color: '#fff', fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>Art. {articolo.n}</div>
                      </div>
                      <button
                        onClick={() => ascoltaArticolo(articolo.testo)}
                        style={{ width: 40, height: 40, borderRadius: '50%', background: '#123055', border: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      </button>
                    </div>

                    {/* Testo completo */}
                    <div style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, lineHeight: 1.85, marginTop: 12, paddingBottom: 16, borderBottom: '0.5px solid rgba(255,255,255,0.05)', whiteSpace: 'pre-line' as const }}>
                      {articolo.testo}
                    </div>
                  </div>

                  {/* Bottoni */}
                  <div style={{ display: 'flex', gap: 8, padding: '12px 18px', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
                    <button
                      onClick={() => spiegaArticolo(articolo)}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: '#123055', border: 'none', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 0.5, cursor: 'pointer' }}
                    >
                      {loadingAI[articolo.n] ? '...' : '✦ Spiegami'}
                    </button>
                    <button
                      onClick={() => generaMappa(articolo)}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: 'transparent', border: '0.5px solid rgba(143,211,255,0.2)', color: '#8fd3ff', fontSize: 10, fontWeight: 800, letterSpacing: 0.5, cursor: 'pointer' }}
                    >
                      {loadingMappe[articolo.n] ? '...' : '◎ Mappa'}
                    </button>
                    <button
                      onClick={() => ascoltaArticolo(articolo.testo)}
                      style={{ width: 40, borderRadius: 12, background: 'transparent', border: '0.5px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}
                    >
                      ▶
                    </button>
                  </div>

                  {/* Spiegazione AI */}
                  {(loadingAI[articolo.n] || spiegazioni[articolo.n]) && (
                    <div style={{ padding: '14px 18px', background: '#0a1220', borderBottom: mappe[articolo.n] ? '0.5px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ color: '#8fd3ff', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: 800, marginBottom: 8 }}>Norma AI</div>
                      {loadingAI[articolo.n] ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8fd3ff', animation: 'bounce 1s infinite' }} />
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8fd3ff', animation: 'bounce 1s infinite 0.1s' }} />
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8fd3ff', animation: 'bounce 1s infinite 0.2s' }} />
                        </div>
                      ) : (
                        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 1.8 }}>{spiegazioni[articolo.n]}</div>
                      )}
                    </div>
                  )}

                  {/* Mappa concettuale */}
                  {(loadingMappe[articolo.n] || mappe[articolo.n]) && (
                    <div style={{ padding: '14px 18px', background: '#080f1e' }}>
                      <div style={{ color: '#8fd3ff', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: 800, marginBottom: 10 }}>Mappa concettuale</div>
                      {loadingMappe[articolo.n] ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8fd3ff' }} />
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8fd3ff' }} />
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8fd3ff' }} />
                        </div>
                      ) : (
                        <div>
                          <div style={{ background: '#0d1829', borderRadius: 14, padding: '12px 14px', marginBottom: 10 }}>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 11, marginBottom: 4 }}>Principio</div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, lineHeight: 1.6 }}>{mappe[articolo.n]?.principio}</div>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
                            {mappe[articolo.n]?.concetti?.map((c: string, i: number) => (
                              <div key={i} style={{ padding: '6px 12px', borderRadius: 99, background: '#0b1423', border: '0.5px solid rgba(143,211,255,0.2)', color: '#8fd3ff', fontSize: 10, fontWeight: 700 }}>
                                {c}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}