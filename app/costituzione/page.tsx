'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  { label: 'Disposizioni transitorie e finali', range: ['I', 'XVII'] },
];

export default function CostituzionePage() {
  const [search, setSearch] = useState('');
  const [spiegazioni, setSpiegazioni] = useState<Record<string, string>>({});
  const [loadingAI, setLoadingAI] = useState<Record<string, boolean>>({});
  const [salvati, setSalvati] = useState<Record<string, boolean>>({});

  const sezioneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('costituzione_salvati') || '[]');
      const map: Record<string, boolean> = {};
      data.forEach((a: any) => { map[a.n] = true; });
      setSalvati(map);
    } catch (e) {}
  }, []);

  function salvaArticolo(articolo: any) {
    try {
      const data = JSON.parse(localStorage.getItem('costituzione_salvati') || '[]');
      const esistente = data.find((a: any) => a.n === articolo.n);
      let nuovi;
      if (esistente) {
        nuovi = data.filter((a: any) => a.n !== articolo.n);
        setSalvati((prev) => ({ ...prev, [articolo.n]: false }));
      } else {
        nuovi = [...data, { n: articolo.n, titolo: articolo.titolo, testo: articolo.testo, sezione: articolo.sezione }];
        setSalvati((prev) => ({ ...prev, [articolo.n]: true }));
      }
      localStorage.setItem('costituzione_salvati', JSON.stringify(nuovi));
    } catch (e) {}
  }

  const filtrati = useMemo(() => {
    return articoli.filter((a: any) => {
      const q = search.toLowerCase();
      return (
        a.n.toString().toLowerCase().includes(q) ||
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI((prev) => ({ ...prev, [articolo.n]: false }));
    }
  }

  function ascoltaArticolo(testo: string) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(testo);
    utterance.lang = 'it-IT';
    utterance.rate = 0.92;
    speechSynthesis.speak(utterance);
  }

  function isDisposizione(articolo: any) {
    return articolo.sezione === 'Disposizioni transitorie e finali';
  }

  function getTitoloArticolo(articolo: any) {
    return isDisposizione(articolo) ? `Disp. ${articolo.n}` : `Art. ${articolo.n}`;
  }

  function scrollToSezione(sezione: any) {
    let firstArticolo: any;
    if (typeof sezione.range[0] === 'number') {
      firstArticolo = articoli.find(
        (a: any) => parseInt(a.n) >= sezione.range[0] && parseInt(a.n) <= sezione.range[1]
      );
    } else {
      firstArticolo = articoli.find(
        (a: any) => a.sezione === 'Disposizioni transitorie e finali'
      );
    }
    if (!firstArticolo) return;
    const el = sezioneRefs.current[firstArticolo.n];
    if (!el) return;
    const HEADER_OFFSET = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  const grouped = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filtrati.forEach((a: any) => {
      if (!groups[a.sezione]) groups[a.sezione] = [];
      groups[a.sezione].push(a);
    });
    return groups;
  }, [filtrati]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingBottom: 120, fontFamily: 'var(--font-ui)'}}>
      <Header />

      {/* HERO */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ borderRadius: 28, padding: '32px 24px', background: 'var(--surface)', border: '0.5px solid var(--line)' }}>
          <div style={{ display: 'inline-block', border: '1px solid var(--line)', borderRadius: 99, padding: '4px 14px', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-2)', fontWeight: 700, marginBottom: 14 }}>
            Repubblica Italiana · 1948
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.1, letterSpacing: -1, color: 'var(--text)', marginBottom: 10 }}>
            La Costituzione<br />spiegata facile
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
            139 articoli · spiegazioni AI · audio
          </div>
        </div>
      </div>

      {/* SOMMARIO */}
      {!search && (
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 24, height: 1, background: 'rgba(79,70,229,0.4)' }} />
            <span style={{ color: 'var(--accent)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 800 }}>Sommario</span>
            <div style={{ flex: 1, height: 1, background: 'var(--fill)' }} />
          </div>
          <div style={{ background: 'var(--surface)', borderRadius: 20, overflow: 'hidden', border: '0.5px solid var(--line)' }}>
            {sezioni.map((s, i) => (
              <button
                key={i}
                onClick={() => scrollToSezione(s)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'transparent', border: 'none', borderBottom: i < sezioni.length - 1 ? '0.5px solid var(--line)' : 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-ui)'}}
              >
                <div>
                  <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ color: 'var(--text-3)', fontSize: 10 }}>
                    {typeof s.range[0] === 'number' ? `Art. ${s.range[0]}–${s.range[1]}` : 'Disp. I – XVII'}
                  </div>
                </div>
                <div style={{ color: 'var(--accent)', fontSize: 14 }}>→</div>
              </button>
            ))}
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
            style={{ width: '100%', height: 52, borderRadius: 16, background: 'var(--fill)', border: '0.5px solid var(--line)', padding: '0 44px 0 18px', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'var(--font-ui)', boxSizing: 'border-box' }}
          />
          <svg style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* ARTICOLI */}
      <div style={{ padding: '20px 16px 0' }}>
        {Object.entries(grouped).map(([sezione, arts]) => (
          <div key={sezione}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, marginTop: 8 }}>
              <div style={{ width: 24, height: 1, background: 'rgba(79,70,229,0.4)' }} />
              <span style={{ color: 'var(--accent)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 800 }}>{sezione}</span>
              <div style={{ flex: 1, height: 1, background: 'var(--fill)' }} />
            </div>

            {arts.map((articolo: any) => (
              <div key={articolo.n} ref={(el) => { sezioneRefs.current[articolo.n] = el; }} style={{ marginBottom: 14 }}>
                <div style={{ background: 'var(--surface)', borderRadius: 24, overflow: 'hidden', border: '0.5px solid var(--line)' }}>

                  {/* CARD BODY */}
                  <div style={{ padding: '20px 20px 0', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: -4, top: -14, fontSize: 110, fontWeight: 900, color: 'rgba(79,70,229,0.07)', lineHeight: 1, userSelect: 'none', letterSpacing: -4, fontFamily: 'var(--font-ui)'}}>
                      {articolo.n}
                    </div>
                    <div style={{ color: 'var(--accent)', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: 800, marginBottom: 5, position: 'relative', zIndex: 1 }}>
                      {articolo.titolo}
                    </div>
                    <div style={{ fontSize: 23, fontWeight: 900, letterSpacing: -0.5, color: 'var(--text)', position: 'relative', zIndex: 1 }}>
                      {getTitoloArticolo(articolo)}
                    </div>
                    <div style={{ color: 'var(--text-2)', fontSize: 12.5, lineHeight: 1.9, marginTop: 13, whiteSpace: 'pre-line', position: 'relative', zIndex: 1 }}>
                      {articolo.testo}
                    </div>

                    {/* PLAYER AUDIO */}
                    <div onClick={() => ascoltaArticolo(articolo.testo)} style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0 18px', padding: '11px 14px', background: 'rgba(79,70,229,0.05)', border: '0.5px solid rgba(79,70,229,0.1)', borderRadius: 12, cursor: 'pointer', position: 'relative', zIndex: 1 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#123055', border: '0.5px solid rgba(79,70,229,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--accent)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 800, marginBottom: 2 }}>Ascolta</div>
                        <div style={{ color: 'var(--text-3)', fontSize: 10 }}>Lettura in italiano · velocità naturale</div>
                      </div>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(79,70,229,0.4)" strokeWidth="2">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
                        <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                      </svg>
                    </div>
                  </div>

                  {/* Divisore */}
                  <div style={{ height: 0.5, background: 'var(--fill)', margin: '0 20px' }} />

                  {/* BOTTONI */}
                  <div style={{ display: 'flex', gap: 8, padding: '11px 20px' }}>
                    <button
                      onClick={() => spiegaArticolo(articolo)}
                      disabled={loadingAI[articolo.n]}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 12, background: '#123055', border: 'none', color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 0.5, cursor: loadingAI[articolo.n] ? 'default' : 'pointer', opacity: loadingAI[articolo.n] ? 0.6 : 1, fontFamily: 'var(--font-ui)'}}
                    >
                      {loadingAI[articolo.n] ? '...' : '✦ Spiegami'}
                    </button>

                    <button
                      onClick={() => salvaArticolo(articolo)}
                      style={{ width: 42, height: 42, borderRadius: 12, background: salvati[articolo.n] ? 'rgba(79,70,229,0.15)' : 'var(--fill)', border: `0.5px solid ${salvati[articolo.n] ? 'rgba(79,70,229,0.3)' : 'var(--line)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={salvati[articolo.n] ? '#4f46e5' : 'none'} stroke={salvati[articolo.n] ? '#4f46e5' : 'rgba(255,255,255,0.4)'} strokeWidth="2">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                  </div>

                  {/* SPIEGAZIONE AI */}
                  {(loadingAI[articolo.n] || spiegazioni[articolo.n]) && (
                    <div style={{ padding: '14px 20px', background: 'var(--bg)', borderTop: '0.5px solid var(--line)' }}>
                      <div style={{ color: 'var(--accent)', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', fontWeight: 800, marginBottom: 8 }}>Norma AI</div>
                      {loadingAI[articolo.n] ? (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {[0, 1, 2].map((i) => (
                            <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', animation: `pulse 1.2s ease-in-out ${i * 200}ms infinite` }} />
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: 'var(--text-2)', fontSize: 12, lineHeight: 1.85 }}>
                          {spiegazioni[articolo.n]}
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

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.75); }
          40% { opacity: 1; transform: scale(1); }
        }
        input[type="text"]::placeholder {
          color: var(--text-3);
          font-family: var(--font-ui);
        }
      `}</style>
    </div>
  );
}