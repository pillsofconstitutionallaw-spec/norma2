'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export type ArticoloCodice = {
  numero: number | string;
  rubrica: string;
  libro?: string;
  testo: string;
  abrogato?: boolean;
};

type Props = {
  titolo: string;
  sottotitolo: string;
  colore: string;
  articoli: ArticoloCodice[];
};

type AICache = Record<string, { spiega?: string; giurisprudenza?: string }>;

export default function CodiceViewer({ titolo, sottotitolo, colore, articoli }: Props) {
  const [search, setSearch] = useState('');
  const [libroAttivo, setLibroAttivo] = useState<string | null>(null);
  const [aperto, setAperto] = useState<number | null>(null);
  const [aiCache, setAiCache] = useState<AICache>({});
  const [loadingAI, setLoadingAI] = useState<{ id: string; tipo: string } | null>(null);
  const [salvati, setSalvati] = useState<Set<string>>(new Set());
  const [mostraAbrogati, setMostraAbrogati] = useState(false);
  const [vocale, setVocale] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const STORAGE_KEY = `salvati_${titolo.replace(/\s/g, '_')}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSalvati(new Set(JSON.parse(saved)));
    } catch {}
  }, [STORAGE_KEY]);

  const libri = useMemo(
    () => [
      ...new Set(
        articoli
          .map(a => a.libro)
          .filter((l): l is string => typeof l === 'string' && l.length > 0)
      ),
    ],
    [articoli]
  );

  const filtrati = useMemo(() => {
    let lista = articoli;
    if (!mostraAbrogati) lista = lista.filter(a => !a.abrogato);
    if (libroAttivo) lista = lista.filter(a => a.libro === libroAttivo);
    if (search.trim()) {
      const q = search.toLowerCase();
      lista = lista.filter(
        a =>
          String(a.numero).toLowerCase().includes(q) ||
          (a.rubrica?.toLowerCase() ?? '').includes(q) ||
          (a.testo?.toLowerCase() ?? '').includes(q)
      );
    }
    return lista;
  }, [articoli, libroAttivo, search, mostraAbrogati]);

  const articoloId = (a: ArticoloCodice) => String(a.numero);

  function cleanNumero(n: number | string): string {
    return String(n).replace(/^Art\.\s*/i, '').replace(/\.\s*$/, '').trim();
  }

  async function chiediAI(articolo: ArticoloCodice, tipo: 'spiega' | 'giurisprudenza') {
    const id = articoloId(articolo);
    if (aiCache[id]?.[tipo]) return;
    setLoadingAI({ id, tipo });
    try {
      const res = await fetch('/api/spiega', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articolo: `Art. ${cleanNumero(articolo.numero)}${articolo.rubrica ? ' — ' + articolo.rubrica : ''}`,
          testo: articolo.testo,
          tipo: tipo === 'spiega' ? 'codice' : 'giurisprudenza',
        }),
      });
      const data = await res.json();
      setAiCache(prev => ({
        ...prev,
        [id]: { ...prev[id], [tipo]: data.spiegazione ?? 'Nessuna risposta.' },
      }));
    } catch {
      setAiCache(prev => ({
        ...prev,
        [id]: { ...prev[id], [tipo]: 'Errore nel caricamento.' },
      }));
    } finally {
      setLoadingAI(null);
    }
  }

  function toggleSalva(articolo: ArticoloCodice) {
    const id = articoloId(articolo);
    setSalvati(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  function toggleVocale(articolo: ArticoloCodice) {
    const id = articoloId(articolo);
    if (vocale === id) {
      window.speechSynthesis?.cancel();
      setVocale(null);
      return;
    }
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Articolo ${cleanNumero(articolo.numero)}. ${articolo.rubrica ? articolo.rubrica + '. ' : ''}${articolo.testo}`
    );
    utterance.lang = 'it-IT';
    utterance.rate = 0.9;
    utterance.onend = () => setVocale(null);
    synthRef.current = utterance;
    window.speechSynthesis?.speak(utterance);
    setVocale(id);
  }

  const totaleValidi = articoli.filter(a => !a.abrogato).length;
  const totaleAbrogati = articoli.filter(a => a.abrogato).length;

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        input::placeholder { color: rgba(255,255,255,0.2); font-family: Montserrat, sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .art-card:active { opacity: 0.85; }
        .btn-ai:active { opacity: 0.7; }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        <div style={{ padding: '20px 16px 140px' }}>

          {/* HERO */}
          <div style={{
            background: 'linear-gradient(135deg,#0d1829,#111a2e)',
            borderRadius: 24, padding: '24px 20px',
            border: `0.5px solid ${colore}30`,
            marginBottom: 20, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -50, right: -50, width: 180, height: 180,
              borderRadius: '50%',
              background: `radial-gradient(circle,${colore}08 0%,transparent 70%)`,
              pointerEvents: 'none',
            }} />
            <div style={{
              display: 'inline-block',
              border: `1px solid ${colore}40`, borderRadius: 99,
              padding: '4px 14px', fontSize: 9, letterSpacing: 3,
              textTransform: 'uppercase' as const, color: colore, fontWeight: 700, marginBottom: 14,
            }}>
              {sottotitolo}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 14 }}>
              {titolo}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              {[
                { n: totaleValidi, l: 'articoli vigenti' },
                { n: totaleAbrogati, l: 'abrogati' },
                { n: libri.length, l: libri.length === 1 ? 'sezione' : 'libri' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: `${colore}0c`, border: `0.5px solid ${colore}28`,
                  borderRadius: 10, padding: '6px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: colore }}>{s.n}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEARCH */}
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Cerca per numero, rubrica o parola chiave..."
              value={search}
              onChange={e => { setSearch(e.target.value); setLibroAttivo(null); }}
              style={{
                width: '100%', height: 48,
                background: '#111526',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '0 44px 0 16px',
                color: '#fff', fontSize: 13,
                fontFamily: 'Montserrat, sans-serif',
              }}
            />
            <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* FILTRI LIBRO */}
          {!search && libri.length > 1 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 10 }}>
              <button onClick={() => setLibroAttivo(null)} style={{
                padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
                background: !libroAttivo ? `${colore}18` : 'rgba(255,255,255,0.04)',
                border: `0.5px solid ${!libroAttivo ? colore + '55' : 'rgba(255,255,255,0.08)'}`,
                color: !libroAttivo ? colore : 'rgba(255,255,255,0.35)',
                fontSize: 10, fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
              }}>Tutti</button>
              {libri.map((l: string) => {
                const att = libroAttivo === l;
                const label = l.includes('—') ? l.split('—')[0].trim() : l.substring(0, 20);
                return (
                  <button key={l} onClick={() => setLibroAttivo(att ? null : l)} style={{
                    padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
                    background: att ? `${colore}18` : 'rgba(255,255,255,0.04)',
                    border: `0.5px solid ${att ? colore + '55' : 'rgba(255,255,255,0.08)'}`,
                    color: att ? colore : 'rgba(255,255,255,0.35)',
                    fontSize: 10, fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
                  }}>{label}</button>
                );
              })}
            </div>
          )}

          {/* CONTATORE + TOGGLE */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
              {filtrati.length} articoli{search ? ` per "${search}"` : ''}
            </div>
            <button onClick={() => setMostraAbrogati(v => !v)} style={{
              padding: '4px 10px', borderRadius: 8, cursor: 'pointer',
              background: mostraAbrogati ? 'rgba(251,113,133,0.1)' : 'rgba(255,255,255,0.04)',
              border: `0.5px solid ${mostraAbrogati ? 'rgba(251,113,133,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: mostraAbrogati ? '#fb7185' : 'rgba(255,255,255,0.3)',
              fontSize: 9, fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
            }}>
              {mostraAbrogati ? '✕ Nascondi abrogati' : '+ Abrogati'}
            </button>
          </div>

          {/* LISTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filtrati.length === 0 && (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, marginTop: 48 }}>
                Nessun articolo trovato
              </div>
            )}

            {filtrati.map((a, idx) => {
              const id = articoloId(a);
              const isAperto = aperto === idx;
              const isSalvato = salvati.has(id);
              const isVocale = vocale === id;
              const cache = aiCache[id] ?? {};
              const loadingSpiega = loadingAI?.id === id && loadingAI.tipo === 'spiega';
              const loadingGiuris = loadingAI?.id === id && loadingAI.tipo === 'giurisprudenza';

              return (
                <div key={idx} style={{
                  background: '#111526',
                  borderRadius: 16,
                  border: `0.5px solid ${isAperto ? colore + '44' : isSalvato ? colore + '22' : 'rgba(255,255,255,0.05)'}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                  opacity: a.abrogato ? 0.55 : 1,
                }}>

                  {/* HEADER */}
                  <div
                    className="art-card"
                    onClick={() => setAperto(isAperto ? null : idx)}
                    style={{ padding: '13px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: isAperto ? `${colore}18` : 'rgba(255,255,255,0.04)',
                      border: `0.5px solid ${isAperto ? colore + '44' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', flexDirection: 'column' as const,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{ fontSize: 7, fontWeight: 700, color: isAperto ? colore : 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>ART.</div>
                      <div style={{ fontSize: cleanNumero(a.numero).length > 4 ? 9 : 12, fontWeight: 900, color: isAperto ? colore : 'rgba(255,255,255,0.55)', lineHeight: 1 }}>
                        {cleanNumero(a.numero)}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {a.abrogato && (
                        <div style={{
                          display: 'inline-block', marginBottom: 3,
                          background: 'rgba(251,113,133,0.1)', border: '0.5px solid rgba(251,113,133,0.2)',
                          borderRadius: 4, padding: '1px 6px',
                          fontSize: 8, fontWeight: 700, color: '#fb7185', letterSpacing: 1,
                        }}>ABROGATO</div>
                      )}
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 2 }}>
                        {a.rubrica || `Art. ${cleanNumero(a.numero)}`}
                      </div>
                      {a.libro && (
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                          {a.libro.includes('—') ? a.libro.split('—')[0].trim() : a.libro}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {isSalvato && <div style={{ width: 6, height: 6, borderRadius: '50%', background: colore }} />}
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        border: '0.5px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transform: isAperto ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s',
                      }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* CONTENUTO */}
                  {isAperto && (
                    <div style={{ padding: '0 14px 16px', animation: 'fadeIn 0.2s ease' }}>
                      <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)', paddingTop: 14 }}>

                        {a.libro && (
                          <div style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: 2,
                            textTransform: 'uppercase' as const,
                            color: `${colore}80`, marginBottom: 10,
                          }}>
                            {a.libro}
                          </div>
                        )}

                        <div style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '0.5px solid rgba(255,255,255,0.06)',
                          borderRadius: 12, padding: '14px',
                          fontSize: 13, color: 'rgba(255,255,255,0.78)',
                          lineHeight: 1.9, marginBottom: 14,
                          fontFamily: 'Montserrat, sans-serif',
                          whiteSpace: 'pre-wrap' as const,
                        }}>
                          {a.testo}
                        </div>

                        {/* Riga 1: Spiega + Giurisprudenza */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                          <button
                            className="btn-ai"
                            onClick={() => { if (!cache.spiega && !a.abrogato) chiediAI(a, 'spiega'); }}
                            style={{
                              height: 44, borderRadius: 12,
                              background: cache.spiega ? `${colore}0a` : `${colore}12`,
                              border: `0.5px solid ${cache.spiega ? colore + '20' : colore + '40'}`,
                              color: cache.spiega ? `${colore}60` : colore,
                              fontSize: 11, fontWeight: 800,
                              cursor: cache.spiega || a.abrogato ? 'default' : 'pointer',
                              fontFamily: 'Montserrat, sans-serif',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                              animation: loadingSpiega ? 'pulse 1.5s ease infinite' : 'none',
                            }}
                          >
                            {loadingSpiega ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                              </svg>
                            ) : cache.spiega ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            )}
                            {loadingSpiega ? 'Carico...' : cache.spiega ? 'Spiegato' : 'Spiega AI'}
                          </button>

                          <button
                            className="btn-ai"
                            onClick={() => { if (!cache.giurisprudenza && !a.abrogato) chiediAI(a, 'giurisprudenza'); }}
                            style={{
                              height: 44, borderRadius: 12,
                              background: cache.giurisprudenza ? 'rgba(34,197,94,0.05)' : 'rgba(34,197,94,0.1)',
                              border: `0.5px solid ${cache.giurisprudenza ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.35)'}`,
                              color: cache.giurisprudenza ? 'rgba(34,197,94,0.5)' : '#22c55e',
                              fontSize: 11, fontWeight: 800,
                              cursor: cache.giurisprudenza || a.abrogato ? 'default' : 'pointer',
                              fontFamily: 'Montserrat, sans-serif',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                              animation: loadingGiuris ? 'pulse 1.5s ease infinite' : 'none',
                            }}
                          >
                            {loadingGiuris ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                              </svg>
                            ) : cache.giurisprudenza ? (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <path d="M14 2v6h6" />
                                <path d="M9 13l2 2 4-4" />
                              </svg>
                            )}
                            {loadingGiuris ? 'Carico...' : cache.giurisprudenza ? 'Caricata' : 'Giurisprudenza'}
                          </button>
                        </div>

                        {/* Riga 2: Ascolta + Salva */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                          <button onClick={() => toggleVocale(a)} style={{
                            height: 40, borderRadius: 12,
                            background: isVocale ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)',
                            border: `0.5px solid ${isVocale ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                            color: isVocale ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                            fontSize: 11, fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              {isVocale
                                ? <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>
                                : <polygon points="5 3 19 12 5 21 5 3" />
                              }
                            </svg>
                            {isVocale ? 'Stop' : 'Ascolta'}
                          </button>

                          <button onClick={() => toggleSalva(a)} style={{
                            height: 40, borderRadius: 12,
                            background: isSalvato ? `${colore}15` : 'rgba(255,255,255,0.04)',
                            border: `0.5px solid ${isSalvato ? colore + '40' : 'rgba(255,255,255,0.08)'}`,
                            color: isSalvato ? colore : 'rgba(255,255,255,0.4)',
                            fontSize: 11, fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          }}>
                            <svg width="13" height="13" viewBox="0 0 24 24"
                              fill={isSalvato ? 'currentColor' : 'none'}
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                            </svg>
                            {isSalvato ? 'Salvato' : 'Salva'}
                          </button>
                        </div>

                        {/* Box Spiegazione AI */}
                        {cache.spiega && (
                          <div style={{
                            background: `${colore}08`,
                            border: `0.5px solid ${colore}22`,
                            borderRadius: 12, padding: '14px',
                            marginBottom: cache.giurisprudenza ? 10 : 0,
                            animation: 'fadeIn 0.3s ease',
                          }}>
                            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: colore, marginBottom: 8 }}>
                              Spiegazione AI
                            </div>
                            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.85 }}>
                              {cache.spiega}
                            </div>
                          </div>
                        )}

                        {/* Box Giurisprudenza */}
                        {cache.giurisprudenza && (
                          <div style={{
                            background: 'rgba(34,197,94,0.06)',
                            border: '0.5px solid rgba(34,197,94,0.18)',
                            borderRadius: 12, padding: '14px',
                            animation: 'fadeIn 0.3s ease',
                          }}>
                            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: '#22c55e', marginBottom: 8 }}>
                              Giurisprudenza
                            </div>
                            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, whiteSpace: 'pre-wrap' as const }}>
                              {cache.giurisprudenza}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}