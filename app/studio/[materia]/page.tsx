'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

import * as privato from '@/src/data/cards/diritto-privato';
import * as costituzionale from '@/src/data/cards/diritto-costituzionale';
import * as romano from '@/src/data/cards/diritto-romano';
import * as internazionale from '@/src/data/cards/diritto-internazionale';
import * as internazionalePrivato from '@/src/data/cards/diritto-internazionale-privato';

type Carta = {
  domanda: string;
  risposta: string;
};

const materieMap: Record<
  string,
  {
    carte: Carta[];
    meta: { titolo: string; colore: string; bg: string; icona: string };
  }
> = {
  'diritto-privato': privato,
  'diritto-costituzionale': costituzionale,
  'diritto-romano': romano,
  'diritto-internazionale': internazionale,
  'diritto-internazionale-privato': internazionalePrivato,
};

const materiePlaceholder = [
  'diritto-penale',
  'diritto-amministrativo',
  'diritto-del-lavoro',
  'diritto-commerciale',
  'diritto-processuale-civile',
  'diritto-processuale-penale',
  'diritto-ue',
  'diritto-tributario',
];

type Fase = 'intro' | 'domanda' | 'risposta' | 'risultati';

// ─── stili globali per il flip 3D ────────────────────────────────────────────
const flipStyles = `
  .flip-container {
    perspective: 1200px;
    width: 100%;
    min-height: 280px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  .flip-inner {
    position: relative;
    width: 100%;
    min-height: 280px;
    transition: transform 0.55s cubic-bezier(0.45, 0, 0.55, 1);
    transform-style: preserve-3d;
  }
  .flip-inner.flipped {
    transform: rotateY(180deg);
  }
  .flip-front,
  .flip-back {
    position: absolute;
    top: 0; left: 0; right: 0;
    min-height: 280px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 24px;
    padding: 28px 24px;
    box-sizing: border-box;
  }
  .flip-front {
    background: #111526;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .flip-back {
    transform: rotateY(180deg);
    background: #172033;
  }
  .flip-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: rgba(255,255,255,0.25);
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-top: 20px;
  }
`;

export default function MateriaPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params?.materia as string;
  const materiaData = materieMap[slug];
  const isPlaceholder = materiePlaceholder.includes(slug);

  const [fase, setFase] = useState<Fase>('intro');
  const [carte, setCarte] = useState<Carta[]>([]);
  const [indice, setIndice] = useState(0);
  const [sapute, setSapute] = useState(0);
  const [nonSapute, setNonSapute] = useState(0);
  const [daRipetere, setDaRipetere] = useState<Carta[]>([]);
  const [ultimaRisposta, setUltimaRisposta] = useState<'sapevo' | 'non-sapevo' | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [search, setSearch] = useState('');
  const [flip, setFlip] = useState(false);
  const [tempoInizio, setTempoInizio] = useState(0);
  const [tempoMedio, setTempoMedio] = useState(0);
  const [hasSegnalibro, setHasSegnalibro] = useState(false);

  // ── SEGNALIBRO ──────────────────────────────────────────────────────────────
  function salvaSegnalibro() {
    localStorage.setItem(
      `segnalibro_${slug}`,
      JSON.stringify({ indice, carte })
    );
    setHasSegnalibro(true);
  }

  function riprendi() {
    const salvato = localStorage.getItem(`segnalibro_${slug}`);
    if (!salvato) return;
    try {
      const data = JSON.parse(salvato);
      const carteRipristinate: Carta[] =
        Array.isArray(data.carte) && data.carte.length > 0
          ? data.carte
          : carte;
      const indiceValido =
        typeof data.indice === 'number' &&
        data.indice >= 0 &&
        data.indice < carteRipristinate.length
          ? data.indice
          : 0;
      setCarte(carteRipristinate);
      setIndice(indiceValido);
      setSapute(0);
      setNonSapute(0);
      setDaRipetere([]);
      setUltimaRisposta(null);
      setFlip(false);
      setSearch('');
      setTempoInizio(Date.now());
      setFase('domanda');
    } catch {
      // ignora errori di parsing
    }
  }

  // ── INIT ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!materiaData) return;

    setHasSegnalibro(!!localStorage.getItem(`segnalibro_${slug}`));

    const salvata = localStorage.getItem(`materia_${slug}`);
    if (salvata) {
      try {
        const data = JSON.parse(salvata);
        const carteRipristinate: Carta[] =
          Array.isArray(data.carte) && data.carte.length > 0
            ? data.carte
            : materiaData.carte;
        const indiceValido =
          typeof data.indice === 'number' &&
          data.indice >= 0 &&
          data.indice < carteRipristinate.length
            ? data.indice
            : 0;
        setFase(data.fase ?? 'intro');
        setIndice(indiceValido);
        setSapute(data.sapute ?? 0);
        setNonSapute(data.nonSapute ?? 0);
        setDaRipetere(Array.isArray(data.daRipetere) ? data.daRipetere : []);
        setUltimaRisposta(data.ultimaRisposta ?? null);
        setXp(data.xp ?? 0);
        setStreak(data.streak ?? 0);
        setBestStreak(data.bestStreak ?? 0);
        setTempoMedio(data.tempoMedio ?? 0);
        setCarte(carteRipristinate);
      } catch {
        setCarte([...materiaData.carte].sort(() => Math.random() - 0.5));
      }
    } else {
      setCarte([...materiaData.carte].sort(() => Math.random() - 0.5));
    }

    setTempoInizio(Date.now());
  }, [slug]);

  // ── AUTOSAVE ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (carte.length === 0) return;
    localStorage.setItem(
      `materia_${slug}`,
      JSON.stringify({
        fase, indice, sapute, nonSapute, daRipetere,
        ultimaRisposta, xp, streak, bestStreak, tempoMedio, carte,
      })
    );
  }, [fase, indice, sapute, nonSapute, daRipetere, ultimaRisposta, xp, streak, bestStreak, tempoMedio, carte, slug]);

  // ── SEARCH ──────────────────────────────────────────────────────────────────
  const carteFiltrate = useMemo(() => {
    if (!search.trim()) return carte;
    return carte.filter((c) =>
      c.domanda.toLowerCase().includes(search.toLowerCase())
    );
  }, [carte, search]);

  useEffect(() => { setIndice(0); }, [search]);

  if (!materiaData && !isPlaceholder) return null;

  const colore = materiaData?.meta.colore ?? '#38bdf8';
  const icona = materiaData?.meta.icona ?? '📚';
  const titolo = materiaData?.meta.titolo ?? slug.replace(/-/g, ' ');
  const cartaCorrente: Carta | undefined = carteFiltrate[indice] ?? carteFiltrate[0];
  const progresso = carteFiltrate.length > 0 ? ((indice + 1) / carteFiltrate.length) * 100 : 0;

  // ── AZIONI ──────────────────────────────────────────────────────────────────
  function inizia() {
    if (!materiaData) return;
    const shuffled = [...materiaData.carte].sort(() => Math.random() - 0.5);
    setCarte(shuffled);
    setIndice(0); setSapute(0); setNonSapute(0); setDaRipetere([]);
    setUltimaRisposta(null); setFlip(false); setSearch('');
    setTempoInizio(Date.now());
    setFase('domanda');
  }

  function valuta(sapevo: boolean) {
    if (!cartaCorrente) return;
    setUltimaRisposta(sapevo ? 'sapevo' : 'non-sapevo');
    const tempo = Date.now() - tempoInizio;
    setTempoMedio((prev) => prev === 0 ? tempo : Math.round((prev + tempo) / 2));
    if (sapevo) {
      setSapute((s) => s + 1);
      setXp((x) => x + 5);
      setStreak((prev) => {
        const nuovo = prev + 1;
        if (nuovo > bestStreak) setBestStreak(nuovo);
        return nuovo;
      });
    } else {
      setNonSapute((n) => n + 1);
      setStreak(0);
      setDaRipetere((dr) => {
        const nuovi = [...dr, cartaCorrente];
        localStorage.setItem(`errori_${slug}`, JSON.stringify(nuovi));
        return nuovi;
      });
    }
    setFase('risposta');
  }

  function prossima() {
    if (carteFiltrate.length === 0) { setFase('risultati'); return; }
    setFlip(false);
    setUltimaRisposta(null);
    setTempoInizio(Date.now());
    if (indice + 1 >= carteFiltrate.length) {
      setFase('risultati');
    } else {
      setIndice((i) => i + 1);
      setFase('domanda');
    }
  }

  function riprova() {
    if (daRipetere.length === 0) { setFase('intro'); return; }
    const shuffled = [...daRipetere].sort(() => Math.random() - 0.5);
    setCarte(shuffled);
    setIndice(0); setSapute(0); setNonSapute(0); setDaRipetere([]);
    setUltimaRisposta(null); setFlip(false); setSearch('');
    setTempoInizio(Date.now());
    setFase('domanda');
  }

  function ripassaErroriPersistenti() {
    const salvati = localStorage.getItem(`errori_${slug}`);
    if (!salvati) return;
    let errori: Carta[];
    try { errori = JSON.parse(salvati); } catch { return; }
    if (!Array.isArray(errori) || errori.length === 0) return;
    setCarte(errori);
    setIndice(0); setSapute(0); setNonSapute(0); setDaRipetere([]);
    setUltimaRisposta(null); setFlip(false); setSearch('');
    setTempoInizio(Date.now());
    setFase('domanda');
  }

  // ── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{flipStyles}</style>

      <Header />

      <main style={{ flex: 1, padding: '24px 16px 40px', maxWidth: 600, margin: '0 auto', width: '100%' }}>

        {/* ── INTRO ── */}
        {fase === 'intro' && (
          <div>
            <button
              onClick={() => router.back()}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif', marginBottom: 24, display: 'block' }}
            >
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
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div style={{ background: '#111526', borderRadius: 16, padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: colore }}>{xp}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>XP</div>
                  </div>
                  <div style={{ background: '#111526', borderRadius: 16, padding: '16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#a855f7' }}>🔥 {bestStreak}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>BEST STREAK</div>
                  </div>
                </div>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cerca flashcard..."
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: '#111526', color: '#fff', marginBottom: 16, outline: 'none', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box' }}
                />

                <button
                  onClick={inizia}
                  style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: `linear-gradient(135deg, ${colore}, #818cf8)`, color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', marginBottom: 10 }}
                >
                  ⚡ Inizia
                </button>

                {hasSegnalibro && (
                  <button
                    onClick={riprendi}
                    style={{ width: '100%', padding: '15px', borderRadius: 16, border: `1px solid ${colore}44`, background: `${colore}11`, color: colore, fontWeight: 800, fontSize: 14, cursor: 'pointer', marginBottom: 10 }}
                  >
                    🔖 Riprendi dal segnalibro
                  </button>
                )}

                <button
                  onClick={ripassaErroriPersistenti}
                  style={{ width: '100%', padding: '15px', borderRadius: 16, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
                >
                  🔄 Ripassa errori
                </button>
              </>
            )}
          </div>
        )}

        {/* ── DOMANDA con flip 3D ── */}
        {fase === 'domanda' && cartaCorrente && (
          <div>
            {/* Topbar: esci | contatore | segnalibro */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button
                onClick={() => setFase('intro')}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0 }}
              >
                ← Esci
              </button>

              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>
                {indice + 1} / {carteFiltrate.length}
              </span>

              <button
                onClick={salvaSegnalibro}
                title="Salva segnalibro qui"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 20,
                  lineHeight: 1,
                  padding: 0,
                  opacity: hasSegnalibro ? 1 : 0.35,
                  transition: 'opacity 0.2s, transform 0.15s',
                }}
              >
                🔖
              </button>
            </div>

            {/* Barra progresso */}
            <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999, marginBottom: 20 }}>
              <div style={{ width: `${progresso}%`, height: 4, background: colore, borderRadius: 999, transition: '0.3s' }} />
            </div>

            {/* Card flip 3D */}
            <div className="flip-container" onClick={() => setFlip((f) => !f)}>
              <div className={`flip-inner${flip ? ' flipped' : ''}`}>

                {/* FRONTE */}
                <div className="flip-front">
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', marginBottom: 18 }}>
                    DOMANDA
                  </div>
                  <p style={{ color: '#fff', fontSize: 18, lineHeight: 1.8, fontWeight: 700, margin: 0 }}>
                    {cartaCorrente.domanda}
                  </p>
                  <div className="flip-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3" />
                      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
                      <path d="M12 8v8" /><path d="M9 11l3-3 3 3" />
                    </svg>
                    Tocca per girare
                  </div>
                </div>

                {/* RETRO */}
                <div className="flip-back" style={{ border: `1px solid ${colore}44` }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: colore, marginBottom: 18 }}>
                    RISPOSTA
                  </div>
                  <p style={{ color: '#fff', fontSize: 15, lineHeight: 1.9, margin: 0 }}>
                    {cartaCorrente.risposta}
                  </p>
                </div>

              </div>
            </div>

            {/* Bottoni valutazione — visibili solo dopo flip */}
            {flip && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); valuta(false); }}
                  style={{ padding: '16px', borderRadius: 16, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: 14 }}
                >
                  ❌ Non sapevo
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); valuta(true); }}
                  style={{ padding: '16px', borderRadius: 16, border: 'none', background: '#22c55e', color: '#fff', fontWeight: 800, cursor: 'pointer', fontSize: 14 }}
                >
                  ✅ Sapevo
                </button>
              </div>
            )}
          </div>
        )}

        {/* Nessuna carta trovata */}
        {fase === 'domanda' && !cartaCorrente && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Nessuna flashcard trovata per questa ricerca.</p>
            <button onClick={() => setFase('intro')} style={{ padding: '14px 28px', borderRadius: 16, border: 'none', background: colore, color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
              ← Torna all'inizio
            </button>
          </div>
        )}

        {/* ── RISPOSTA ── */}
        {fase === 'risposta' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>
              {ultimaRisposta === 'sapevo' ? '✅' : '❌'}
            </div>
            <h2 style={{ color: '#fff', marginBottom: 12 }}>
              {ultimaRisposta === 'sapevo' ? 'Ottimo!' : 'Da ripassare'}
            </h2>
            <button
              onClick={prossima}
              style={{ padding: '16px 28px', borderRadius: 16, border: 'none', background: colore, color: '#fff', fontWeight: 800, cursor: 'pointer' }}
            >
              Prossima →
            </button>
          </div>
        )}

        {/* ── RISULTATI ── */}
        {fase === 'risultati' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 18 }}>🏁</div>
            <h1 style={{ color: '#fff', marginBottom: 12 }}>Sessione completata</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Hai completato lo studio della materia.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: '#111526', borderRadius: 16, padding: '18px' }}>
                <div style={{ color: '#22c55e', fontSize: 28, fontWeight: 900 }}>{sapute}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>SAPUTE</div>
              </div>
              <div style={{ background: '#111526', borderRadius: 16, padding: '18px' }}>
                <div style={{ color: '#ef4444', fontSize: 28, fontWeight: 900 }}>{nonSapute}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>ERRORI</div>
              </div>
            </div>

            <div style={{ marginBottom: 24, color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.8 }}>
              <div>XP ottenuti: {xp}</div>
              <div>Best streak: {bestStreak}</div>
              <div>Tempo medio: {Math.round(tempoMedio / 1000)}s</div>
            </div>

            <button
              onClick={riprova}
              style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#111526', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}
            >
              🔄 Ripassa errori
            </button>
            <button
              onClick={() => setFase('intro')}
              style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: colore, color: '#fff', fontWeight: 800, cursor: 'pointer' }}
            >
              ← Torna all'inizio
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}