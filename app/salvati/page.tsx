'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import * as privato from '@/src/data/cards/diritto-privato';
import * as costituzionale from '@/src/data/cards/diritto-costituzionale';
import * as romano from '@/src/data/cards/diritto-romano';
import * as internazionale from '@/src/data/cards/diritto-internazionale';
import * as internazionalePrivato from '@/src/data/cards/diritto-internazionale-privato';
import * as lavoro from '@/src/data/cards/diritto-del-lavoro';

const materieMap: Record<string, {
  carte: { domanda: string; risposta: string }[];
  meta: { titolo: string; colore: string; bg: string; icona: string };
}> = {
  'diritto-privato': privato,
  'diritto-costituzionale': costituzionale,
  'diritto-romano': romano,
  'diritto-internazionale': internazionale,
  'diritto-internazionale-privato': internazionalePrivato,
  'diritto-del-lavoro': lavoro,
};

const materiePlaceholder = [
  'diritto-penale', 'diritto-amministrativo',
  'diritto-commerciale', 'diritto-processuale-civile', 'diritto-processuale-penale',
  'diritto-ue', 'diritto-tributario',
];

type Fase = 'intro' | 'domanda' | 'risposta' | 'risultati';

export default function MateriaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.materia as string;

  const materiaData = materieMap[slug];
  const isPlaceholder = materiePlaceholder.includes(slug);

  const [fase, setFase] = useState<Fase>('intro');
  const [carte, setCarte] = useState<{ domanda: string; risposta: string }[]>([]);
  const [indice, setIndice] = useState(0);
  const [sapute, setSapute] = useState(0);
  const [nonSapute, setNonSapute] = useState(0);
  const [daRipetere, setDaRipetere] = useState<{ domanda: string; risposta: string }[]>([]);
  const [ultimaRisposta, setUltimaRisposta] = useState<'sapevo' | 'non-sapevo' | null>(null);
  const [mostraRiprendi, setMostraRiprendi] = useState(false);
  const [segnalibroIndice, setSegnalibroIndice] = useState<number | null>(null);

  const storageKey = `segnalibro_${slug}`;

  useEffect(() => {
    if (materiaData) {
      const mescolate = [...materiaData.carte].sort(() => Math.random() - 0.5);
      setCarte(mescolate);
      // Controlla se esiste un segnalibro
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const { indice: idx } = JSON.parse(saved);
          if (idx > 0) {
            setSegnalibroIndice(idx);
            setMostraRiprendi(true);
          }
        }
      } catch {}
    }
  }, [slug]);

  // Salva segnalibro automaticamente ad ogni carta
  useEffect(() => {
    if (fase === 'domanda' && indice > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ indice, timestamp: Date.now() }));
      } catch {}
    }
  }, [indice, fase]);

  if (!materiaData && !isPlaceholder) return null;

  const colore = materiaData?.meta.colore ?? '#38bdf8';
  const icona = materiaData?.meta.icona ?? '📚';
  const titolo = materiaData?.meta.titolo ?? slug.replace(/-/g, ' ');
  const cartaCorrente = carte[indice];
  const progresso = carte.length > 0 ? (indice / carte.length) * 100 : 0;

  function inizia(daSegnalibro = false) {
    if (!daSegnalibro) {
      setCarte([...materiaData.carte].sort(() => Math.random() - 0.5));
      setIndice(0);
    } else {
      setIndice(segnalibroIndice ?? 0);
    }
    setSapute(0);
    setNonSapute(0);
    setDaRipetere([]);
    setUltimaRisposta(null);
    setMostraRiprendi(false);
    setFase('domanda');
  }

  function valuta(sapevo: boolean) {
    setUltimaRisposta(sapevo ? 'sapevo' : 'non-sapevo');
    if (sapevo) setSapute(s => s + 1);
    else { setNonSapute(n => n + 1); setDaRipetere(dr => [...dr, cartaCorrente]); }
  }

  function prossima() {
    setUltimaRisposta(null);
    if (indice + 1 >= carte.length) {
      localStorage.removeItem(storageKey); // Rimuove segnalibro a fine sessione
      setFase('risultati');
    } else {
      setIndice(i => i + 1);
      setFase('domanda');
    }
  }

  function riprova() {
    setCarte([...daRipetere].sort(() => Math.random() - 0.5));
    setIndice(0); setSapute(0); setNonSapute(0); setDaRipetere([]);
    setUltimaRisposta(null);
    setFase('domanda');
  }

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, padding: '24px 16px 40px', maxWidth: 600, margin: '0 auto', width: '100%' }}>

        {/* ── POPUP RIPRENDI ── */}
        {mostraRiprendi && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
            <div style={{ background: '#111526', borderRadius: 24, padding: '28px 24px', maxWidth: 340, width: '100%', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔖</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Hai un segnalibro!</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 24, lineHeight: 1.6 }}>
                Eri arrivato alla carta <strong style={{ color: '#fff' }}>{segnalibroIndice}</strong> di {carte.length}.<br />Vuoi riprendere da lì?
              </div>
              <button onClick={() => inizia(true)} style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: `linear-gradient(135deg, ${colore}, #818cf8)`, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>
                ▶ Riprendi dalla carta {segnalibroIndice}
              </button>
              <button onClick={() => inizia(false)} style={{ width: '100%', padding: '14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                Ricomincia dall'inizio
              </button>
            </div>
          </div>
        )}

        {/* ── INTRO ── */}
        {fase === 'intro' && (
          <div>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif', marginBottom: 24, display: 'block' }}>
              ← Indietro
            </button>
            <div style={{ background: '#111526', borderRadius: 24, border: `1px solid ${colore}33`, padding: '36px 24px', textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{icona}</div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>{titolo}</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                {isPlaceholder ? 'Appunti non ancora caricati' : `${carte.length} flash card`}
              </p>
            </div>
            {!isPlaceholder && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div style={{ background: '#111526', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: colore, marginBottom: 4 }}>{carte.length}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1 }}>Carte totali</div>
                </div>
                <div style={{ background: '#111526', borderRadius: 16, padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#818cf8', marginBottom: 4 }}>~{Math.ceil(carte.length * 0.5)}min</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1 }}>Tempo stimato</div>
                </div>
              </div>
            )}
            {segnalibroIndice && segnalibroIndice > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize: 18 }}>🔖</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Segnalibro alla carta {segnalibroIndice} di {carte.length}</span>
              </div>
            )}
            {isPlaceholder ? (
              <button onClick={() => router.push('/studio/pdf')} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: `linear-gradient(135deg, ${colore}, #818cf8)`, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                📄 Carica dispense PDF
              </button>
            ) : (
              <button onClick={() => inizia(false)} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: `linear-gradient(135deg, ${colore}, #818cf8)`, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                ⚡ Inizia a studiare
              </button>
            )}
          </div>
        )}

        {/* ── DOMANDA ── */}
        {fase === 'domanda' && cartaCorrente && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button onClick={() => setFase('intro')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif' }}>← Esci</button>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{indice + 1} / {carte.length}</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 20 }}>
              <div style={{ height: 3, width: `${progresso}%`, background: colore, borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <div style={{ flex: 1, background: 'rgba(34,197,94,0.08)', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#22c55e', fontWeight: 800, fontSize: 15 }}>{sapute}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>sapevo</span>
              </div>
              <div style={{ flex: 1, background: 'rgba(239,68,68,0.08)', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#ef4444', fontWeight: 800, fontSize: 15 }}>{nonSapute}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>non sapevo</span>
              </div>
            </div>
            <div onClick={() => setFase('risposta')} style={{ background: '#111526', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', padding: '28px 22px', minHeight: 220, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>DOMANDA</span>
              <p style={{ fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.65, margin: '20px 0 0' }}>{cartaCorrente.domanda}</p>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 20, textAlign: 'center', display: 'block' }}>Tocca per vedere la risposta →</span>
            </div>
          </div>
        )}

        {/* ── RISPOSTA ── */}
        {fase === 'risposta' && cartaCorrente && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button onClick={() => setFase('intro')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif' }}>← Esci</button>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{indice + 1} / {carte.length}</span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 20 }}>
              <div style={{ height: 3, width: `${progresso}%`, background: colore, borderRadius: 2 }} />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '14px 18px', marginBottom: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', display: 'block', marginBottom: 6 }}>DOMANDA</span>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.5 }}>{cartaCorrente.domanda}</p>
            </div>
            <div style={{ background: `${colore}12`, borderRadius: 20, border: `1px solid ${colore}30`, padding: '22px 20px', marginBottom: 20 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: colore, display: 'block', marginBottom: 12 }}>RISPOSTA</span>
              <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.75, margin: 0 }}>{cartaCorrente.risposta}</p>
            </div>
            {ultimaRisposta === null ? (
              <>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: 12 }}>Lo sapevi?</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => valuta(false)} style={{ flex: 1, padding: '15px', borderRadius: 16, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>✗ Non sapevo</button>
                  <button onClick={() => valuta(true)} style={{ flex: 1, padding: '15px', borderRadius: 16, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#22c55e', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>✓ Sapevo</button>
                </div>
              </>
            ) : (
              <div>
                <div style={{ borderRadius: 14, padding: '12px 16px', marginBottom: 14, textAlign: 'center', background: ultimaRisposta === 'sapevo' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${ultimaRisposta === 'sapevo' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, color: ultimaRisposta === 'sapevo' ? '#22c55e' : '#ef4444', fontWeight: 700, fontSize: 14 }}>
                  {ultimaRisposta === 'sapevo' ? '✓ Ottimo! Vai avanti' : '✗ Ripassala bene'}
                </div>
                <button onClick={prossima} style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: `linear-gradient(135deg, ${colore}, #818cf8)`, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                  {indice + 1 >= carte.length ? 'Vedi risultati →' : 'Prossima →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── RISULTATI ── */}
        {fase === 'risultati' && (
          <div style={{ textAlign: 'center', paddingTop: 20 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{sapute >= nonSapute ? '🎉' : '💪'}</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Sessione completata!</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>
              {Math.round((sapute / Math.max(sapute + nonSapute, 1)) * 100)}% di risposte corrette
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#111526', borderRadius: 16, padding: '20px', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#22c55e' }}>{sapute}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Sapevo</div>
              </div>
              <div style={{ background: '#111526', borderRadius: 16, padding: '20px', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#ef4444' }}>{nonSapute}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Non sapevo</div>
              </div>
            </div>
            {daRipetere.length > 0 && (
              <button onClick={riprova} style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: `linear-gradient(135deg, ${colore}, #818cf8)`, color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>
                🔄 Ripassa le {daRipetere.length} sbagliate
              </button>
            )}
            <button onClick={() => setFase('intro')} style={{ width: '100%', padding: '15px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>
              Ricomincia dall'inizio
            </button>
            <button onClick={() => router.back()} style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.3)', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
              ← Torna alle materie
            </button>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}