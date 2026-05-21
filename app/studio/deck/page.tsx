'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { carte as cartePrivato, meta as metaPrivato } from '@/src/data/cards/diritto-privato';
import { carte as carteCostituzionale, meta as metaCostituzionale } from '@/src/data/cards/diritto-costituzionale';
import { carte as carteInternazionale, meta as metaInternazionale } from '@/src/data/cards/diritto-internazionale';
import { carte as carteIntPrivato, meta as metaIntPrivato } from '@/src/data/cards/diritto-internazionale-privato';
import { carte as carteRomano, meta as metaRomano } from '@/src/data/cards/diritto-romano';
import { carte as carteLavoro, meta as metaLavoro } from '@/src/data/cards/diritto-del-lavoro';

type Carta = { domanda: string; risposta: string };
type Materia = { id: string; titolo: string; colore: string; bg: string; icona: string; carte: Carta[] };
type Fase = 'scelta' | 'studio' | 'risultati';

const MATERIE: Materia[] = [
  { id: 'diritto-privato', titolo: metaPrivato.titolo, colore: metaPrivato.colore, bg: metaPrivato.bg, icona: metaPrivato.icona, carte: cartePrivato },
  { id: 'diritto-costituzionale', titolo: metaCostituzionale.titolo, colore: metaCostituzionale.colore, bg: metaCostituzionale.bg, icona: metaCostituzionale.icona, carte: carteCostituzionale },
  { id: 'diritto-internazionale', titolo: metaInternazionale.titolo, colore: metaInternazionale.colore, bg: metaInternazionale.bg, icona: metaInternazionale.icona, carte: carteInternazionale },
  { id: 'diritto-internazionale-privato', titolo: metaIntPrivato.titolo, colore: metaIntPrivato.colore, bg: metaIntPrivato.bg, icona: metaIntPrivato.icona, carte: carteIntPrivato },
  { id: 'diritto-romano', titolo: metaRomano.titolo, colore: metaRomano.colore, bg: metaRomano.bg, icona: metaRomano.icona, carte: carteRomano },
  { id: 'diritto-del-lavoro', titolo: metaLavoro.titolo, colore: metaLavoro.colore, bg: metaLavoro.bg, icona: metaLavoro.icona, carte: carteLavoro },
];

const STORAGE_KEY = 'norma_flashcard_segnalibro';

function salvaSessione(materiaId: string, indice: number, sapute: number, nonSapute: number, daRipetere: Carta[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ materiaId, indice, sapute, nonSapute, daRipetere }));
  } catch {}
}
function caricaSessione() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function cancellaSessione() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

function DeckContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fase, setFase] = useState<Fase>('scelta');
  const [materiaSelezionata, setMateriaSelezionata] = useState<Materia | null>(null);
  const [carte, setCarte] = useState<Carta[]>([]);
  const [indice, setIndice] = useState(0);
  const [girata, setGirata] = useState(false);
  const [sapute, setSapute] = useState(0);
  const [nonSapute, setNonSapute] = useState(0);
  const [daRipetere, setDaRipetere] = useState<Carta[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [sessioneSalvata, setSessioneSalvata] = useState<any>(null);

  useEffect(() => {
    const s = caricaSessione();
    const slugDaUrl = searchParams.get('materia');

    if (slugDaUrl) {
      const materia = MATERIE.find(m => m.id === slugDaUrl);
      if (materia) {
        // Se c'è una sessione salvata per questa materia, mostra il banner riprendi
        if (s?.materiaId === slugDaUrl && s?.indice > 0) {
          setSessioneSalvata(s);
          setFase('scelta');
        } else {
          // Altrimenti parte da zero
          const carteMischiate = [...materia.carte].sort(() => Math.random() - 0.5);
          setMateriaSelezionata(materia);
          setCarte(carteMischiate);
          setIndice(0); setSapute(0); setNonSapute(0); setDaRipetere([]); setGirata(false);
          setFase('studio');
        }
      }
    } else if (s?.materiaId && s?.indice > 0) {
      // Nessun slug nell'URL, ma c'è una sessione salvata: mostra il banner
      setSessioneSalvata(s);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function iniziaMateria(materia: Materia, fromIndice = 0, fromSapute = 0, fromNonSapute = 0, fromDaRipetere: Carta[] = []) {
    const carteMischiate = fromIndice === 0
      ? [...materia.carte].sort(() => Math.random() - 0.5)
      : [...materia.carte];
    setMateriaSelezionata(materia);
    setCarte(carteMischiate);
    setIndice(fromIndice); setSapute(fromSapute); setNonSapute(fromNonSapute);
    setDaRipetere(fromDaRipetere); setGirata(false);
    setFase('studio');
  }

  function riprendiSessione() {
    const s = sessioneSalvata;
    const materia = MATERIE.find(m => m.id === s.materiaId);
    if (!materia) return;
    // Ripristina le carte nello stesso ordine salvato usando l'indice
    const carteMischiate = [...materia.carte];
    setMateriaSelezionata(materia);
    setCarte(carteMischiate);
    setIndice(s.indice);
    setSapute(s.sapute);
    setNonSapute(s.nonSapute);
    setDaRipetere(s.daRipetere);
    setGirata(false);
    setSessioneSalvata(null);
    setFase('studio');
  }

  function rispondi(sapevo: boolean) {
    const nuoveSapute = sapevo ? sapute + 1 : sapute;
    const nuoveNonSapute = sapevo ? nonSapute : nonSapute + 1;
    const nuoveDaRipetere = sapevo ? daRipetere : [...daRipetere, carte[indice]];
    if (sapevo) setSapute(nuoveSapute);
    else { setNonSapute(nuoveNonSapute); setDaRipetere(nuoveDaRipetere); }

    const fine = indice + 1 >= carte.length;
    if (fine) {
      cancellaSessione();
      setFase('risultati');
    } else {
      const nuovoIndice = indice + 1;
      setIndice(nuovoIndice);
      setGirata(false);
      if (materiaSelezionata) {
        salvaSessione(materiaSelezionata.id, nuovoIndice, nuoveSapute, nuoveNonSapute, nuoveDaRipetere);
      }
    }
  }

  function salvaManualmente() {
    if (materiaSelezionata) {
      salvaSessione(materiaSelezionata.id, indice, sapute, nonSapute, daRipetere);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2200);
    }
  }

  function riprova() {
    if (!materiaSelezionata) return;
    setCarte([...daRipetere].sort(() => Math.random() - 0.5));
    setIndice(0); setSapute(0); setNonSapute(0); setDaRipetere([]); setGirata(false);
    setFase('studio');
  }

  const colore = materiaSelezionata?.colore ?? '#38bdf8';
  const progresso = carte.length > 0 ? (indice / carte.length) * 100 : 0;

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        {toastVisible && (
          <div style={{
            position: 'fixed', bottom: 100, left: '50%',
            transform: 'translateX(-50%)',
            background: '#1e293b', border: '0.5px solid rgba(56,189,248,0.5)',
            borderRadius: 14, padding: '11px 20px',
            fontSize: 12, fontWeight: 800, color: '#38bdf8',
            zIndex: 9999, whiteSpace: 'nowrap',
            animation: 'toastIn 0.25s ease',
          }}>
            🔖 Segnalibro salvato!
          </div>
        )}

        <div style={{ padding: '20px 16px 120px', maxWidth: 650, margin: '0 auto' }}>

          {/* ══ SCELTA MATERIA ══ */}
          {fase === 'scelta' && (
            <>
              <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif', marginBottom: 24 }}>
                ← Indietro
              </button>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Studio · Flash Card</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Scegli la materia</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>Tocca una materia per iniziare</div>
              </div>

              {/* Banner riprendi sessione */}
              {sessioneSalvata && (() => {
                const m = MATERIE.find(x => x.id === sessioneSalvata.materiaId);
                if (!m) return null;
                return (
                  <div style={{ background: '#111526', border: `0.5px solid ${m.colore}55`, borderRadius: 16, padding: '14px 16px', marginBottom: 20, animation: 'fadeUp 0.3s ease' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 4 }}>🔖 Sessione salvata</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
                      {m.icona} {m.titolo} · carta {sessioneSalvata.indice + 1} di {m.carte.length}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={riprendiSessione} style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg, ${m.colore}, #818cf8)`, color: '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                        ▶ Riprendi
                      </button>
                      <button onClick={() => { cancellaSessione(); setSessioneSalvata(null); }} style={{ padding: '10px 14px', borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                        Ignora
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MATERIE.map(m => (
                  <div key={m.id} onClick={() => iniziaMateria(m)} style={{ background: '#111526', border: `0.5px solid ${m.colore}33`, borderRadius: 20, padding: '18px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: m.bg, border: `0.5px solid ${m.colore}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                      {m.icona}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{m.titolo}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{m.carte.length} carte</div>
                    </div>
                    <div style={{ fontSize: 16, color: `${m.colore}88` }}>→</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══ STUDIO ══ */}
          {fase === 'studio' && materiaSelezionata && carte.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <button onClick={() => setFase('scelta')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif' }}>
                  ← Esci
                </button>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
                  {indice + 1} / {carte.length}
                </span>
                <button onClick={salvaManualmente} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 22, lineHeight: 1, opacity: toastVisible ? 1 : 0.45, transition: 'opacity 0.2s' }}>
                  🔖
                </button>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, height: 4, marginBottom: 20 }}>
                <div style={{ background: colore, height: 4, borderRadius: 4, width: `${progresso}%`, transition: 'width 0.3s' }} />
              </div>

              {/* Card — altezza fissa, scroll interno se testo lungo */}
              <div
                onClick={() => setGirata(g => !g)}
                style={{
                  background: girata ? '#0d1f35' : '#111526',
                  border: girata ? `1px solid ${colore}55` : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 24,
                  padding: '32px 22px',
                  height: 260,
                  maxHeight: 260,
                  overflowY: 'auto',
                  cursor: 'pointer',
                  marginBottom: 20,
                  transition: 'background 0.3s, border 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: girata ? colore : 'rgba(255,255,255,0.25)', marginBottom: 16, flexShrink: 0 }}>
                  {girata ? 'RISPOSTA' : 'DOMANDA'}
                </div>
                <div style={{ fontSize: girata ? 14 : 16, fontWeight: girata ? 400 : 700, color: '#fff', lineHeight: 1.85 }}>
                  {girata ? carte[indice].risposta : carte[indice].domanda}
                </div>
                {!girata && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 20, flexShrink: 0 }}>
                    Tocca per vedere la risposta
                  </div>
                )}
              </div>

              {/* Bottoni — sempre visibili sotto la card, altezza fissa */}
              {girata && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => rispondi(false)}
                    style={{ flex: 1, height: 56, borderRadius: 16, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    ✗ Non sapevo
                  </button>
                  <button
                    onClick={() => rispondi(true)}
                    style={{ flex: 1, height: 56, borderRadius: 16, border: 'none', background: '#22c55e', color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    ✓ Sapevo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ══ RISULTATI ══ */}
          {fase === 'risultati' && materiaSelezionata && (
            <div style={{ textAlign: 'center', paddingTop: 20, animation: 'fadeUp 0.4s ease' }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{sapute >= nonSapute ? '🎉' : '💪'}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Sessione completata!</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>
                Hai risposto correttamente al {Math.round((sapute / Math.max(sapute + nonSapute, 1)) * 100)}% delle carte
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
                <div style={{ background: '#111526', borderRadius: 16, padding: '20px 10px', border: '0.5px solid rgba(34,197,94,0.3)' }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#22c55e' }}>{sapute}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Sapevo</div>
                </div>
                <div style={{ background: '#111526', borderRadius: 16, padding: '20px 10px', border: '0.5px solid rgba(239,68,68,0.3)' }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#ef4444' }}>{nonSapute}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Non sapevo</div>
                </div>
              </div>
              {daRipetere.length > 0 && (
                <button onClick={riprova} style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: `linear-gradient(135deg, ${colore}, #818cf8)`, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>
                  🔄 Ripassa quelle sbagliate ({daRipetere.length})
                </button>
              )}
              <button onClick={() => iniziaMateria(materiaSelezionata)} style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: `linear-gradient(135deg, ${colore}, #818cf8)`, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>
                🔁 Ricomincia
              </button>
              <button onClick={() => setFase('scelta')} style={{ width: '100%', padding: '15px', borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.1)', background: '#111526', color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                Cambia materia
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default function DeckPage() {
  return (
    <>
      <Suspense fallback={
        <div style={{ background: '#0a0d18', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontFamily: 'Montserrat, sans-serif' }}>Caricamento...</div>
        </div>
      }>
        <DeckContent />
      </Suspense>
      <Footer />
    </>
  );
}