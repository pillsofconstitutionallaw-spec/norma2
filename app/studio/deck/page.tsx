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
type Fase = 'scelta' | 'studio' | 'gioco' | 'risultati' | 'game_over';
type Opzione = { testo: string; corretta: boolean };
type Genere = 'M' | 'F';
type CarattereStato = 'corsa' | 'salto' | 'inciampo';

const MATERIE: Materia[] = [
  { id: 'diritto-privato', titolo: metaPrivato.titolo, colore: metaPrivato.colore, bg: metaPrivato.bg, icona: metaPrivato.icona, carte: cartePrivato },
  { id: 'diritto-costituzionale', titolo: metaCostituzionale.titolo, colore: metaCostituzionale.colore, bg: metaCostituzionale.bg, icona: metaCostituzionale.icona, carte: carteCostituzionale },
  { id: 'diritto-internazionale', titolo: metaInternazionale.titolo, colore: metaInternazionale.colore, bg: metaInternazionale.bg, icona: metaInternazionale.icona, carte: carteInternazionale },
  { id: 'diritto-internazionale-privato', titolo: metaIntPrivato.titolo, colore: metaIntPrivato.colore, bg: metaIntPrivato.bg, icona: metaIntPrivato.icona, carte: carteIntPrivato },
  { id: 'diritto-romano', titolo: metaRomano.titolo, colore: metaRomano.colore, bg: metaRomano.bg, icona: metaRomano.icona, carte: carteRomano },
  { id: 'diritto-del-lavoro', titolo: metaLavoro.titolo, colore: metaLavoro.colore, bg: metaLavoro.bg, icona: metaLavoro.icona, carte: carteLavoro },
];

const STORAGE_KEY = 'norma_flashcard_segnalibro';
const GAME_DOMANDE = 20;
const TIMER_SECONDI = 15;

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

function mescolaArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generaOpzioni(tutteLeCarteDiMateria: Carta[], cartaCorretta: Carta): Opzione[] {
  const altreRisposte = mescolaArray(
    tutteLeCarteDiMateria.filter(c => c.risposta !== cartaCorretta.risposta)
  ).slice(0, 3);
  return mescolaArray([
    { testo: cartaCorretta.risposta, corretta: true },
    ...altreRisposte.map(r => ({ testo: r.risposta, corretta: false })),
  ]);
}

function DeckContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── studio state ──
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

  // ── game state ──
  const [carteGioco, setCarteGioco] = useState<Carta[]>([]);
  const [indiceGioco, setIndiceGioco] = useState(0);
  const [opzioni, setOpzioni] = useState<Opzione[]>([]);
  const [vite, setVite] = useState(3);
  const [punteggio, setPunteggio] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [tempoRimanente, setTempoRimanente] = useState(TIMER_SECONDI);
  const [esitoRisposta, setEsitoRisposta] = useState<'corretta' | 'sbagliata' | null>(null);
  const [opzioneCliccataIdx, setOpzioneCliccataIdx] = useState<number | null>(null);
  const [puntiGuadagnati, setPuntiGuadagnati] = useState(0);
  const [screenFlash, setScreenFlash] = useState<'correct' | 'wrong' | null>(null);
  const [comboNotifica, setComboNotifica] = useState<number | null>(null);

  // ── character state ──
  const [genere, setGenere] = useState<Genere>('M');
  const [carattereStato, setCarattereStato] = useState<CarattereStato>('corsa');

  useEffect(() => {
    const s = caricaSessione();
    const slugDaUrl = searchParams.get('materia');
    if (slugDaUrl) {
      const materia = MATERIE.find(m => m.id === slugDaUrl);
      if (materia) {
        if (s?.materiaId === slugDaUrl && s?.indice > 0) {
          setSessioneSalvata(s);
        }
        // resta in 'scelta' così l'utente può scegliere 📚 o 🎮
      }
    } else if (s?.materiaId && s?.indice > 0) {
      setSessioneSalvata(s);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── timer gioco ──
  useEffect(() => {
    if (fase !== 'gioco' || esitoRisposta !== null) return;
    if (tempoRimanente <= 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      rispondiGioco(false, null);
      return;
    }
    const id = setTimeout(() => setTempoRimanente(t => t - 1), 1000);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, tempoRimanente, esitoRisposta]);

  // ── studio functions ──
  function iniziaMateria(materia: Materia, fromIndice = 0, fromSapute = 0, fromNonSapute = 0, fromDaRipetere: Carta[] = []) {
    setMateriaSelezionata(materia);
    setCarte(fromIndice === 0 ? mescolaArray(materia.carte) : [...materia.carte]);
    setIndice(fromIndice); setSapute(fromSapute); setNonSapute(fromNonSapute);
    setDaRipetere(fromDaRipetere); setGirata(false);
    setFase('studio');
  }

  function riprendiSessione() {
    const s = sessioneSalvata;
    const materia = MATERIE.find(m => m.id === s.materiaId);
    if (!materia) return;
    setMateriaSelezionata(materia);
    setCarte([...materia.carte]);
    setIndice(s.indice); setSapute(s.sapute); setNonSapute(s.nonSapute);
    setDaRipetere(s.daRipetere); setGirata(false);
    setSessioneSalvata(null);
    setFase('studio');
  }

  function rispondi(sapevo: boolean) {
    const nuoveSapute = sapevo ? sapute + 1 : sapute;
    const nuoveNonSapute = sapevo ? nonSapute : nonSapute + 1;
    const nuoveDaRipetere = sapevo ? daRipetere : [...daRipetere, carte[indice]];
    if (sapevo) setSapute(nuoveSapute); else { setNonSapute(nuoveNonSapute); setDaRipetere(nuoveDaRipetere); }
    const fine = indice + 1 >= carte.length;
    if (fine) { cancellaSessione(); setFase('risultati'); }
    else {
      const nuovoIndice = indice + 1;
      setIndice(nuovoIndice); setGirata(false);
      if (materiaSelezionata) salvaSessione(materiaSelezionata.id, nuovoIndice, nuoveSapute, nuoveNonSapute, nuoveDaRipetere);
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
    setCarte(mescolaArray(daRipetere));
    setIndice(0); setSapute(0); setNonSapute(0); setDaRipetere([]); setGirata(false);
    setFase('studio');
  }

  // ── game functions ──
  function iniziaGioco(materia: Materia) {
    const carteMischiate = mescolaArray(materia.carte).slice(0, Math.min(GAME_DOMANDE, materia.carte.length));
    setMateriaSelezionata(materia);
    setCarteGioco(carteMischiate);
    setIndiceGioco(0);
    setOpzioni(generaOpzioni(materia.carte, carteMischiate[0]));
    setVite(3); setPunteggio(0); setStreak(0); setMaxStreak(0);
    setTempoRimanente(TIMER_SECONDI);
    setEsitoRisposta(null); setOpzioneCliccataIdx(null);
    setPuntiGuadagnati(0); setScreenFlash(null); setComboNotifica(null);
    setCarattereStato('corsa');
    setFase('gioco');
  }

  function rispondiGioco(corretta: boolean, idxOpzione: number | null) {
    if (esitoRisposta !== null) return;

    setOpzioneCliccataIdx(idxOpzione);
    setEsitoRisposta(corretta ? 'corretta' : 'sbagliata');
    setScreenFlash(corretta ? 'correct' : 'wrong');
    setCarattereStato(corretta ? 'salto' : 'inciampo');
    setTimeout(() => { setScreenFlash(null); setCarattereStato('corsa'); }, 500);

    const nuoveVite = corretta ? vite : vite - 1;
    const nuovoStreak = corretta ? streak + 1 : 0;
    const nuovoMaxStreak = Math.max(maxStreak, nuovoStreak);
    let nuovoPunteggio = punteggio;

    if (corretta) {
      const moltiplicatore = Math.min(streak + 1, 3);
      const punti = (100 + tempoRimanente * 5) * moltiplicatore;
      nuovoPunteggio = punteggio + punti;
      setPuntiGuadagnati(punti);
      setTimeout(() => setPuntiGuadagnati(0), 900);
      if (nuovoStreak >= 3) {
        setComboNotifica(nuovoStreak);
        setTimeout(() => setComboNotifica(null), 900);
      }
    }

    setVite(nuoveVite); setStreak(nuovoStreak);
    setMaxStreak(nuovoMaxStreak); setPunteggio(nuovoPunteggio);

    const nuovoIndice = indiceGioco + 1;
    const isGameOver = nuoveVite <= 0;
    const isLastCard = nuovoIndice >= carteGioco.length;

    setTimeout(() => {
      if (isGameOver || isLastCard) {
        setFase('game_over');
      } else {
        setIndiceGioco(nuovoIndice);
        setOpzioni(generaOpzioni(materiaSelezionata!.carte, carteGioco[nuovoIndice]));
        setEsitoRisposta(null); setOpzioneCliccataIdx(null);
        setTempoRimanente(TIMER_SECONDI);
      }
    }, 900);
  }

  const colore = materiaSelezionata?.colore ?? '#38bdf8';
  const progresso = carte.length > 0 ? (indice / carte.length) * 100 : 0;
  const timerPerc = (tempoRimanente / TIMER_SECONDI) * 100;
  const timerColore = tempoRimanente > 8 ? '#22c55e' : tempoRimanente > 4 ? '#f97316' : '#ef4444';
  const caratterePosizionePerc = carteGioco.length > 0 ? Math.min((indiceGioco / carteGioco.length) * 82, 82) : 0;
  const emojiPersonaggio = genere === 'F' ? '🏃‍♀️' : '🏃‍♂️';

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
        @keyframes flashFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          60%  { opacity: 1; transform: translateX(-50%) translateY(-40px) scale(1.15); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-80px) scale(0.9); }
        }
        @keyframes comboIn {
          0%   { opacity: 0; transform: translateX(-50%) translateY(-50%) scale(0.4); }
          55%  { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1.25); }
          80%  { transform: translateX(-50%) translateY(-50%) scale(0.95); }
          100% { opacity: 1; transform: translateX(-50%) translateY(-50%) scale(1); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes charRun {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes charJump {
          0%   { transform: translateY(0) scale(1); }
          35%  { transform: translateY(-22px) scale(1.15); }
          65%  { transform: translateY(-18px) scale(1.1); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes charStumble {
          0%   { transform: translateX(0) rotate(0deg) scale(1); }
          20%  { transform: translateX(-6px) rotate(-20deg) scale(0.9); }
          50%  { transform: translateX(4px) rotate(15deg) scale(0.95); }
          80%  { transform: translateX(-3px) rotate(-8deg) scale(0.98); }
          100% { transform: translateX(0) rotate(0deg) scale(1); }
        }
        @keyframes napGroundScroll {
          from { background-position: 0 0; }
          to   { background-position: -18px 0; }
        }
        @keyframes napItemScroll {
          from { left: 112%; }
          to   { left: -14%; }
        }
      `}</style>

      {/* Screen flash */}
      {screenFlash && (
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999,
          background: screenFlash === 'correct' ? 'rgba(34,197,94,0.13)' : 'rgba(239,68,68,0.13)',
          animation: 'flashFade 0.4s ease forwards',
        }} />
      )}

      {/* Points popup */}
      {puntiGuadagnati > 0 && (
        <div style={{
          position: 'fixed', top: '38%', left: '50%',
          fontSize: 30, fontWeight: 900, color: '#22c55e',
          zIndex: 1000, pointerEvents: 'none',
          animation: 'floatUp 0.9s ease forwards',
          textShadow: '0 0 24px rgba(34,197,94,0.6)',
          letterSpacing: -1,
        }}>
          +{puntiGuadagnati}
        </div>
      )}

      {/* Combo */}
      {comboNotifica !== null && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%',
          fontSize: 36, fontWeight: 900, color: '#f97316',
          zIndex: 1000, pointerEvents: 'none',
          animation: 'comboIn 0.9s ease forwards',
          textShadow: '0 0 30px rgba(249,115,22,0.7)',
          whiteSpace: 'nowrap',
        }}>
          🔥 COMBO x{comboNotifica}
        </div>
      )}

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        {toastVisible && (
          <div style={{
            position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
            background: '#1e293b', border: '0.5px solid rgba(56,189,248,0.5)',
            borderRadius: 14, padding: '11px 20px', fontSize: 12, fontWeight: 800,
            color: '#38bdf8', zIndex: 9999, whiteSpace: 'nowrap',
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
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Studio · Flash Card</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Scegli la materia</div>
              </div>

              {/* Selezione personaggio */}
              <div style={{ background: '#111526', borderRadius: 16, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', flex: 1 }}>Chi gioca?</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setGenere('M')}
                    style={{
                      width: 48, height: 48, borderRadius: 14, border: `2px solid ${genere === 'M' ? '#818cf8' : 'transparent'}`,
                      background: genere === 'M' ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.04)',
                      fontSize: 24, cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    🏃‍♂️
                  </button>
                  <button
                    onClick={() => setGenere('F')}
                    style={{
                      width: 48, height: 48, borderRadius: 14, border: `2px solid ${genere === 'F' ? '#f472b6' : 'transparent'}`,
                      background: genere === 'F' ? 'rgba(244,114,182,0.15)' : 'rgba(255,255,255,0.04)',
                      fontSize: 24, cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    🏃‍♀️
                  </button>
                </div>
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

              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: 12 }}>
                📚 Studia &nbsp;·&nbsp; 🎮 Gioca
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {MATERIE.map(m => (
                  <div key={m.id} style={{ background: '#111526', border: `0.5px solid ${m.colore}33`, borderRadius: 20, padding: '15px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 50, height: 50, borderRadius: 13, background: m.bg, border: `0.5px solid ${m.colore}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                      {m.icona}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{m.titolo}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{m.carte.length} carte</div>
                    </div>
                    <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                      <button
                        onClick={() => iniziaMateria(m)}
                        style={{ padding: '9px 13px', borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.65)', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
                      >
                        📚
                      </button>
                      <button
                        onClick={() => iniziaGioco(m)}
                        style={{ padding: '9px 13px', borderRadius: 12, border: `0.5px solid ${m.colore}55`, background: `${m.colore}18`, color: m.colore, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
                      >
                        🎮
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ══ STUDIO ══ */}
          {fase === 'studio' && materiaSelezionata && carte.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <button onClick={() => setFase('scelta')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif' }}>← Esci</button>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{indice + 1} / {carte.length}</span>
                <button onClick={salvaManualmente} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, fontSize: 22, lineHeight: 1, opacity: toastVisible ? 1 : 0.45, transition: 'opacity 0.2s' }}>🔖</button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, height: 4, marginBottom: 20 }}>
                <div style={{ background: colore, height: 4, borderRadius: 4, width: `${progresso}%`, transition: 'width 0.3s' }} />
              </div>
              <div
                onClick={() => setGirata(g => !g)}
                style={{ background: girata ? '#0d1f35' : '#111526', border: girata ? `1px solid ${colore}55` : '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '32px 22px', height: 260, maxHeight: 260, overflowY: 'auto', cursor: 'pointer', marginBottom: 20, transition: 'background 0.3s, border 0.3s', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: girata ? colore : 'rgba(255,255,255,0.25)', marginBottom: 16, flexShrink: 0 }}>
                  {girata ? 'RISPOSTA' : 'DOMANDA'}
                </div>
                <div style={{ fontSize: girata ? 14 : 16, fontWeight: girata ? 400 : 700, color: '#fff', lineHeight: 1.85 }}>
                  {girata ? carte[indice].risposta : carte[indice].domanda}
                </div>
                {!girata && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 20, flexShrink: 0 }}>Tocca per vedere la risposta</div>}
              </div>
              {girata && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => rispondi(false)} style={{ flex: 1, height: 56, borderRadius: 16, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>✗ Non sapevo</button>
                  <button onClick={() => rispondi(true)} style={{ flex: 1, height: 56, borderRadius: 16, border: 'none', background: '#22c55e', color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>✓ Sapevo</button>
                </div>
              )}
            </div>
          )}

          {/* ══ GIOCO ══ */}
          {fase === 'gioco' && materiaSelezionata && carteGioco.length > 0 && (
            <div>
              {/* Top bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <button onClick={() => setFase('scelta')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif' }}>← Esci</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {streak >= 2 && <span style={{ fontSize: 13, fontWeight: 900, color: '#f97316' }}>🔥 x{streak}</span>}
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#fbbf24', letterSpacing: -0.5 }}>⭐ {punteggio}</span>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1, 2, 3].map(i => <span key={i} style={{ fontSize: 18, opacity: i <= vite ? 1 : 0.15, transition: 'opacity 0.3s' }}>❤️</span>)}
                </div>
              </div>

              {/* Timer bar */}
              <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 4, height: 5, marginBottom: 14 }}>
                <div style={{ height: 5, borderRadius: 4, width: `${timerPerc}%`, background: timerColore, transition: 'width 1s linear, background 0.5s' }} />
              </div>

              {/* ── NAPOLI RUNNER TRACK ── */}
              <div style={{ borderRadius: 20, marginBottom: 14, position: 'relative', overflow: 'hidden', height: 92, border: '1px solid rgba(255,160,50,0.15)' }}>

                {/* Sky — notte napoletana */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #07102a 0%, #0e2055 52%, #b05a1888 78%, #2a1004 100%)' }} />

                {/* Stelle */}
                {([[8,6],[20,4],[35,9],[50,3],[62,7],[80,5],[92,8]] as [number,number][]).map(([x,y],i) => (
                  <div key={i} style={{ position:'absolute', left:`${x}%`, top:y, width: i%2===0 ? 2 : 1.5, height: i%2===0 ? 2 : 1.5, borderRadius:'50%', background:'rgba(255,255,255,0.75)' }} />
                ))}

                {/* Luna */}
                <div style={{ position:'absolute', top:5, left:10, fontSize:14, opacity:0.9 }}>🌙</div>

                {/* Vesuvio — lontano, fisso */}
                <div style={{ position:'absolute', bottom:19, right:52, fontSize:26, opacity:0.7 }}>🌋</div>

                {/* Edifici che scorrono — layer lento */}
                {(['🏛️','🏠','⛪','🏚️','🏛️'] as const).map((e, i) => (
                  <div key={i} style={{
                    position:'absolute', bottom:18,
                    fontSize:13, opacity:0.5,
                    animation:`napItemScroll ${10 + i * 1.5}s linear infinite`,
                    animationDelay:`${-i * 2.5}s`,
                  }}>{e}</div>
                ))}

                {/* Motorini — 3 cicli a durate prime, mai sincronizzati */}
                <div style={{ position:'absolute', bottom:20, fontSize:15, opacity:0.9,  animation:'napItemScroll 3.8s linear infinite', animationDelay:'-1.2s' }}>🛵</div>
                <div style={{ position:'absolute', bottom:20, fontSize:12, opacity:0.6,  animation:'napItemScroll 5.3s linear infinite', animationDelay:'-4.1s' }}>🛵</div>
                <div style={{ position:'absolute', bottom:20, fontSize:13, opacity:0.75, animation:'napItemScroll 7.1s linear infinite', animationDelay:'-2.6s' }}>🛵</div>

                {/* Sampietrini — pavé che scorre */}
                <div style={{
                  position:'absolute', bottom:0, left:0, right:0, height:20,
                  background:'#110e08',
                  backgroundImage:'radial-gradient(ellipse 9px 5px at 50% 55%, #1e1a0e 80%, transparent 100%)',
                  backgroundSize:'18px 10px',
                  animation:'napGroundScroll 0.32s linear infinite',
                }} />

                {/* Linea di progresso */}
                <div style={{ position:'absolute', bottom:19, left:0, right:0, height:1, background:'rgba(255,255,255,0.06)' }} />
                <div style={{
                  position:'absolute', bottom:18, left:0,
                  height:2, borderRadius:2,
                  width:`${(indiceGioco / carteGioco.length) * 100}%`,
                  background:`linear-gradient(90deg, ${colore}, ${colore}77)`,
                  boxShadow:`0 0 7px ${colore}99`,
                  transition:'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }} />

                {/* Bandiera di arrivo */}
                <div style={{ position:'absolute', right:6, bottom:16, fontSize:18, zIndex:3 }}>🏁</div>

                {/* Personaggio */}
                <div style={{
                  position:'absolute',
                  bottom:18,
                  left:`${caratterePosizionePerc}%`,
                  fontSize:27,
                  zIndex:4,
                  transition:'left 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  animation:
                    carattereStato === 'salto'    ? 'charJump 0.55s ease' :
                    carattereStato === 'inciampo' ? 'charStumble 0.45s ease' :
                    'charRun 0.45s ease infinite',
                  transformOrigin:'bottom center',
                  filter:
                    esitoRisposta === 'corretta'  ? `drop-shadow(0 0 9px ${colore})` :
                    esitoRisposta === 'sbagliata' ? 'drop-shadow(0 0 9px rgba(239,68,68,0.9))' : 'none',
                }}>
                  {emojiPersonaggio}
                </div>
              </div>

              {/* Question number */}
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 10 }}>
                Domanda {indiceGioco + 1} / {carteGioco.length}
              </div>

              {/* Question */}
              <div
                key={`q-${indiceGioco}`}
                style={{ background: '#111526', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '20px 20px', marginBottom: 14, animation: 'slideInRight 0.25s ease' }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 10 }}>DOMANDA</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.75 }}>
                  {carteGioco[indiceGioco].domanda}
                </div>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {opzioni.map((op, i) => {
                  const lettere = ['A', 'B', 'C', 'D'];
                  let bg = '#111526';
                  let borderColor = 'rgba(255,255,255,0.08)';
                  let textColor = 'rgba(255,255,255,0.85)';
                  if (esitoRisposta !== null) {
                    if (op.corretta) { bg = 'rgba(34,197,94,0.15)'; borderColor = '#22c55e'; textColor = '#fff'; }
                    else if (i === opzioneCliccataIdx) { bg = 'rgba(239,68,68,0.15)'; borderColor = '#ef4444'; textColor = '#fff'; }
                    else { textColor = 'rgba(255,255,255,0.28)'; }
                  }
                  return (
                    <button
                      key={`${indiceGioco}-${i}`}
                      onClick={() => esitoRisposta === null && rispondiGioco(op.corretta, i)}
                      disabled={esitoRisposta !== null}
                      style={{
                        width: '100%', textAlign: 'left', padding: '13px 16px',
                        borderRadius: 14, border: `1px solid ${borderColor}`,
                        background: bg, color: textColor, fontFamily: 'Montserrat, sans-serif',
                        cursor: esitoRisposta === null ? 'pointer' : 'default',
                        display: 'flex', gap: 12, alignItems: 'flex-start',
                        transition: 'background 0.22s, border-color 0.22s, color 0.22s',
                        animation: `slideInRight ${0.15 + i * 0.07}s ease`,
                      }}
                    >
                      <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 1, color: esitoRisposta === null ? 'rgba(255,255,255,0.28)' : op.corretta ? '#22c55e' : i === opzioneCliccataIdx ? '#ef4444' : 'rgba(255,255,255,0.15)', flexShrink: 0, paddingTop: 2, transition: 'color 0.22s' }}>
                        {lettere[i]}
                      </span>
                      <span style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.65 }}>{op.testo}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ GAME OVER ══ */}
          {fase === 'game_over' && materiaSelezionata && (
            <div style={{ textAlign: 'center', paddingTop: 16, animation: 'fadeUp 0.4s ease' }}>
              <div style={{ fontSize: 58, marginBottom: 14 }}>
                {vite <= 0 ? '💀' : punteggio >= 2000 ? '🏆' : punteggio >= 800 ? '🎯' : '🎮'}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 10 }}>
                {vite <= 0 ? 'Game Over!' : 'Completato!'}
              </div>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#fbbf24', marginBottom: 2, letterSpacing: -2 }}>
                {punteggio}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 28 }}>punti</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 28 }}>
                <div style={{ background: '#111526', borderRadius: 16, padding: '16px 8px', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#f97316' }}>{maxStreak}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.3)', marginTop: 5, textTransform: 'uppercase' }}>Streak</div>
                </div>
                <div style={{ background: '#111526', borderRadius: 16, padding: '16px 8px', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#38bdf8' }}>{indiceGioco + 1}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.3)', marginTop: 5, textTransform: 'uppercase' }}>Domande</div>
                </div>
                <div style={{ background: '#111526', borderRadius: 16, padding: '16px 8px', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#22c55e' }}>{vite}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: 'rgba(255,255,255,0.3)', marginTop: 5, textTransform: 'uppercase' }}>Vite</div>
                </div>
              </div>
              <button
                onClick={() => iniziaGioco(materiaSelezionata!)}
                style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: `linear-gradient(135deg, ${colore}, #818cf8)`, color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}
              >
                🎮 Rigioca
              </button>
              <button
                onClick={() => setFase('scelta')}
                style={{ width: '100%', padding: '15px', borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.1)', background: '#111526', color: 'rgba(255,255,255,0.55)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
              >
                Cambia materia
              </button>
            </div>
          )}

          {/* ══ RISULTATI STUDIO ══ */}
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
