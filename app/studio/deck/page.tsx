'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RunnerCharacter3D from '@/components/RunnerCharacter3D';

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
type FaseWave = 'attesa' | 'caduta' | 'esito';
type EsitoWave = 'preso' | 'schivato' | 'colpito';

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
const FALL_DURATION = 2400;

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
  ).slice(0, 2);
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
  const [, setTempoRimanente] = useState(TIMER_SECONDI);
  const [, setEsitoRisposta] = useState<'corretta' | 'sbagliata' | null>(null);
  const [, setOpzioneCliccataIdx] = useState<number | null>(null);
  const [puntiGuadagnati, setPuntiGuadagnati] = useState(0);
  const [screenFlash, setScreenFlash] = useState<'correct' | 'wrong' | null>(null);
  const [comboNotifica, setComboNotifica] = useState<number | null>(null);

  // ── character state ──
  const [genere, setGenere] = useState<Genere>('M');
  const [carattereStato, setCarattereStato] = useState<CarattereStato>('corsa');

  // ── runner state ──
  const [corsiaPersonaggio, setCorsiaPersonaggio] = useState<0|1|2>(1);
  const [isJumping, setIsJumping] = useState(false);
  const [faseWave, setFaseWave] = useState<FaseWave>('attesa');
  const [esitoWave, setEsitoWave] = useState<EsitoWave|null>(null);
  const [tutorialAttivo, setTutorialAttivo] = useState(false);
  const corsiaRef = useRef<0|1|2>(1);
  const jumpingRef = useRef(false);
  const viteRef = useRef(3);
  const punteggioRef = useRef(0);
  const streakRef = useRef(0);
  const maxStreakRef = useRef(0);
  const indiceGiocoRef = useRef(0);
  const opzioniRef = useRef<Opzione[]>([]);
  const carteGiocoRef = useRef<Carta[]>([]);
  const materiaCarteRef = useRef<Carta[]>([]);
  const touchStartRef = useRef<{x:number;y:number}|null>(null);

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

  // ── wave: oggetti cadono → collisione ──
  useEffect(() => {
    if (fase !== 'gioco' || faseWave !== 'caduta') return;
    const id = setTimeout(() => {
      const corsia = corsiaRef.current;
      const jumping = jumpingRef.current;
      const ops = opzioniRef.current;
      const correttaIdx = ops.findIndex(o => o.corretta);
      let esito: EsitoWave;
      if (corsia === correttaIdx) esito = 'preso';
      else if (jumping) esito = 'schivato';
      else esito = 'colpito';

      if (esito === 'preso') {
        const nuovoStreak = streakRef.current + 1;
        streakRef.current = nuovoStreak;
        setStreak(nuovoStreak);
        const nuovoMax = Math.max(maxStreakRef.current, nuovoStreak);
        maxStreakRef.current = nuovoMax;
        setMaxStreak(nuovoMax);
        const punti = 100 * Math.min(nuovoStreak, 3);
        punteggioRef.current += punti;
        setPunteggio(punteggioRef.current);
        setPuntiGuadagnati(punti);
        setTimeout(() => setPuntiGuadagnati(0), 900);
        if (nuovoStreak >= 3) { setComboNotifica(nuovoStreak); setTimeout(() => setComboNotifica(null), 900); }
        setCarattereStato('salto');
        setScreenFlash('correct');
        setTimeout(() => { setScreenFlash(null); setCarattereStato('corsa'); }, 500);
      } else if (esito === 'colpito') {
        viteRef.current -= 1;
        setVite(viteRef.current);
        streakRef.current = 0; setStreak(0);
        setCarattereStato('inciampo');
        setScreenFlash('wrong');
        setTimeout(() => { setScreenFlash(null); setCarattereStato('corsa'); }, 500);
      } else {
        streakRef.current = 0; setStreak(0);
      }
      setEsitoWave(esito);
      setFaseWave('esito');
    }, FALL_DURATION);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, faseWave]);

  // ── wave: esito → prossima domanda ──
  useEffect(() => {
    if (fase !== 'gioco' || faseWave !== 'esito') return;
    const id = setTimeout(() => {
      if (viteRef.current <= 0) { setFase('game_over'); return; }
      const newIndice = indiceGiocoRef.current + 1;
      if (newIndice >= carteGiocoRef.current.length) { setFase('game_over'); return; }
      indiceGiocoRef.current = newIndice;
      setIndiceGioco(newIndice);
      const newOps = generaOpzioni(materiaCarteRef.current, carteGiocoRef.current[newIndice]);
      opzioniRef.current = newOps;
      setOpzioni(newOps);
      setCorsiaPersonaggio(1); corsiaRef.current = 1;
      setEsitoWave(null);
      setFaseWave('caduta');
    }, 2500);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, faseWave]);

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
    const primaOps = generaOpzioni(materia.carte, carteMischiate[0]);
    setMateriaSelezionata(materia);
    materiaCarteRef.current = materia.carte;
    setCarteGioco(carteMischiate); carteGiocoRef.current = carteMischiate;
    setIndiceGioco(0); indiceGiocoRef.current = 0;
    setOpzioni(primaOps); opzioniRef.current = primaOps;
    setVite(3); viteRef.current = 3;
    setPunteggio(0); punteggioRef.current = 0;
    setStreak(0); streakRef.current = 0;
    setMaxStreak(0); maxStreakRef.current = 0;
    setTempoRimanente(9999);
    setEsitoRisposta(null); setOpzioneCliccataIdx(null);
    setPuntiGuadagnati(0); setScreenFlash(null); setComboNotifica(null);
    setCorsiaPersonaggio(1); corsiaRef.current = 1;
    setIsJumping(false); jumpingRef.current = false;
    setFaseWave('attesa');
    setEsitoWave(null);
    setCarattereStato('corsa');
    setTutorialAttivo(true);
    setFase('gioco');
  }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current || faseWave === 'esito' || tutorialAttivo) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dy) > Math.abs(dx) && dy < -40) {
      if (!jumpingRef.current) {
        setIsJumping(true); jumpingRef.current = true;
        setTimeout(() => { setIsJumping(false); jumpingRef.current = false; }, 650);
      }
    } else if (Math.abs(dx) > 30) {
      setCorsiaPersonaggio(prev => {
        const next = (dx > 0 ? Math.min(2, prev + 1) : Math.max(0, prev - 1)) as 0|1|2;
        corsiaRef.current = next;
        return next;
      });
    }
  }

  function avviaTutorial() {
    setTutorialAttivo(false);
    setFaseWave('caduta');
  }

  const colore = materiaSelezionata?.colore ?? '#38bdf8';
  const progresso = carte.length > 0 ? (indice / carte.length) * 100 : 0;
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
        @keyframes approachLane0 {
          0%   { top: 36%; left: calc(50% - 32px); transform: scale(0.1); opacity: 0; }
          6%   { opacity: 1; }
          100% { top: 72%; left: calc(16.5% - 32px); transform: scale(1.4); opacity: 1; }
        }
        @keyframes approachLane1 {
          0%   { top: 36%; left: calc(50% - 32px); transform: scale(0.1); opacity: 0; }
          6%   { opacity: 1; }
          100% { top: 72%; left: calc(50% - 32px); transform: scale(1.4); opacity: 1; }
        }
        @keyframes approachLane2 {
          0%   { top: 36%; left: calc(50% - 32px); transform: scale(0.1); opacity: 0; }
          6%   { opacity: 1; }
          100% { top: 72%; left: calc(83.5% - 32px); transform: scale(1.4); opacity: 1; }
        }
        @keyframes runnerJump {
          0%   { transform: translateY(0) translateX(-50%); }
          30%  { transform: translateY(-65px) translateX(-50%) scale(1.15); }
          55%  { transform: translateY(-72px) translateX(-50%) scale(1.1); }
          80%  { transform: translateY(-22px) translateX(-50%) scale(1.05); }
          100% { transform: translateY(0) translateX(-50%) scale(1); }
        }
        @keyframes charRunCenter {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(-5px); }
        }
        @keyframes charStumbleCenter {
          0%   { transform: translateX(-50%) rotate(0deg) scale(1); }
          20%  { transform: translateX(calc(-50% - 6px)) rotate(-20deg) scale(0.9); }
          50%  { transform: translateX(calc(-50% + 4px)) rotate(15deg) scale(0.95); }
          80%  { transform: translateX(calc(-50% - 3px)) rotate(-8deg) scale(0.98); }
          100% { transform: translateX(-50%) rotate(0deg) scale(1); }
        }
        @keyframes tutorialIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes perspLines1 {
          from { background-position: 0 0; }
          to   { background-position: 0 45px; }
        }
        @keyframes perspLines2 {
          from { background-position: 0 0; }
          to   { background-position: 0 23px; }
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

          {/* ══ GIOCO RUNNER FULL-SCREEN ══ */}
          {/* Il runner usa position:fixed — sta qui nel DOM ma si sovrappone a tutto */}
      {fase === 'gioco' && materiaSelezionata && carteGioco.length > 0 && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#060e1f', fontFamily: 'Montserrat, sans-serif', overflow: 'hidden', touchAction: 'none', userSelect: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* SKY */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#060c1e 0%,#0c1a3a 38%,#0d1e38 55%,#0a1525 100%)', pointerEvents: 'none' }} />

          {/* Stelle */}
          {([[7,3],[17,6],[29,2],[44,7],[58,4],[71,2],[82,8],[93,5],[38,10],[62,9]] as [number,number][]).map(([x,y],i) => (
            <div key={i} style={{ position:'absolute', left:`${x}%`, top:`${y}%`, width:i%3===0?2:1.5, height:i%3===0?2:1.5, borderRadius:'50%', background:'rgba(255,255,255,0.65)', pointerEvents:'none', zIndex:1 }} />
          ))}

          {/* BINARIO PROSPETTICO — SVG */}
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:2, pointerEvents:'none' }} preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Superficie pista */}
            <polygon points="0,100 100,100 62,37 38,37" fill="rgba(10,16,32,0.95)" />
            {/* Bordi esterni */}
            <line x1="0" y1="100" x2="38" y2="37" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5"/>
            <line x1="100" y1="100" x2="62" y2="37" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5"/>
            {/* Divisori corsie (tratteggiati) */}
            <line x1="33.3" y1="100" x2="46" y2="37" stroke="rgba(255,255,255,0.08)" strokeWidth="0.35" strokeDasharray="3,4"/>
            <line x1="66.7" y1="100" x2="54" y2="37" stroke="rgba(255,255,255,0.08)" strokeWidth="0.35" strokeDasharray="3,4"/>
            {/* Rotaie */}
            <line x1="27" y1="100" x2="43.5" y2="37" stroke="rgba(160,190,255,0.22)" strokeWidth="0.9"/>
            <line x1="36" y1="100" x2="46.5" y2="37" stroke="rgba(160,190,255,0.14)" strokeWidth="0.5"/>
            <line x1="64" y1="100" x2="53.5" y2="37" stroke="rgba(160,190,255,0.14)" strokeWidth="0.5"/>
            <line x1="73" y1="100" x2="56.5" y2="37" stroke="rgba(160,190,255,0.22)" strokeWidth="0.9"/>
            {/* Traversine prospettiche */}
            {([43,50,58,67,77,88,96] as number[]).map(y => {
              const t = (y - 37) / 63;
              return <line key={y} x1={38 - t*38} y1={y} x2={62 + t*38} y2={y} stroke="rgba(255,255,255,0.045)" strokeWidth="0.4"/>;
            })}
            {/* Bagliore orizzonte */}
            <line x1="24" y1="37" x2="76" y2="37" stroke="rgba(100,160,255,0.18)" strokeWidth="0.8"/>
          </svg>

          {/* Linee di profondità che scorrono (illusione di velocità) */}
          <div style={{ position:'absolute', left:0, right:0, bottom:0, top:'37%', zIndex:3, overflow:'hidden', pointerEvents:'none' }}>
            <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(transparent 0px,transparent 43px,rgba(255,255,255,0.022) 44px,rgba(255,255,255,0.022) 45px)', animation:'perspLines1 0.55s linear infinite' }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'52%', background:'repeating-linear-gradient(transparent 0px,transparent 21px,rgba(255,255,255,0.03) 22px,rgba(255,255,255,0.03) 23px)', animation:'perspLines2 0.28s linear infinite' }} />
          </div>

          {/* HUD */}
          <div style={{ position:'absolute', top:0, left:0, right:0, padding:'16px 20px 10px', display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:30, background:'linear-gradient(180deg,rgba(6,14,31,0.95) 60%,transparent)' }}>
            <button onClick={() => setFase('scelta')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:13, cursor:'pointer', padding:0, fontFamily:'Montserrat, sans-serif' }}>← Esci</button>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              {streak >= 2 && <span style={{ fontSize:13, fontWeight:900, color:'#f97316' }}>🔥 x{streak}</span>}
              <span style={{ fontSize:15, fontWeight:900, color:'#fbbf24' }}>⭐ {punteggio}</span>
            </div>
            <div style={{ display:'flex', gap:2 }}>
              {[1,2,3].map(i => <span key={i} style={{ fontSize:16, opacity:i<=vite?1:0.15, transition:'opacity 0.3s' }}>❤️</span>)}
            </div>
          </div>

          {/* Barra progresso */}
          <div style={{ position:'absolute', top:52, left:0, right:0, height:2, background:'rgba(255,255,255,0.06)', zIndex:30 }}>
            <div style={{ height:2, background:colore, width:`${(indiceGioco/carteGioco.length)*100}%`, transition:'width 0.5s' }} />
          </div>

          {/* Card domanda */}
          <div key={`q-${indiceGioco}`} style={{ position:'absolute', top:58, left:14, right:14, zIndex:30, background:'rgba(15,20,40,0.92)', borderRadius:16, padding:'12px 16px', backdropFilter:'blur(10px)', border:'0.5px solid rgba(255,255,255,0.08)', animation:'slideInRight 0.2s ease' }}>
            <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'rgba(255,255,255,0.2)', marginBottom:6 }}>DOMANDA {indiceGioco+1}/{carteGioco.length}</div>
            <div style={{ fontSize:13, fontWeight:700, color:'#fff', lineHeight:1.55 }}>{carteGioco[indiceGioco].domanda}</div>
          </div>

          {/* Oggetti in avvicinamento — solo monete, nessun testo */}
          {faseWave === 'caduta' && opzioni.map((_, i) => (
            <div key={`obj-${indiceGioco}-${i}`} style={{ position:'absolute', width:44, display:'flex', alignItems:'center', justifyContent:'center', animation:`approachLane${i} ${FALL_DURATION}ms ease-in forwards`, zIndex:12, pointerEvents:'none' }}>
              <div style={{ fontSize:32 }}>🪙</div>
            </div>
          ))}

          {/* Personaggio 3D */}
          <div style={{ position:'absolute', bottom:'18%', left:`${[16.5,50,83.5][corsiaPersonaggio]}%`, width:110, height:160, transform:'translateX(-50%)', zIndex:15, transition:'left 0.14s cubic-bezier(0.34,1.56,0.64,1)', pointerEvents:'none' }}>
            <RunnerCharacter3D
              stato={isJumping ? 'salto' : carattereStato}
              colore={colore}
              glow={esitoWave === 'preso' ? 'correct' : esitoWave === 'colpito' ? 'wrong' : null}
            />
          </div>

          {/* Etichette risposte fisse in basso — leggibili mentre decidi */}
          {faseWave === 'caduta' && (
            <div style={{ position:'absolute', bottom:0, left:0, right:0, display:'flex', zIndex:20, pointerEvents:'none' }}>
              {opzioni.map((op, i) => (
                <div key={i} style={{ flex:1, borderTop: i === corsiaPersonaggio ? `2px solid ${colore}` : '1px solid rgba(255,255,255,0.08)', background: i === corsiaPersonaggio ? `rgba(255,255,255,0.06)` : 'rgba(6,14,31,0.85)', padding:'10px 8px 14px', transition:'border 0.14s, background 0.14s' }}>
                  <div style={{ fontSize:10, fontWeight:700, color: i === corsiaPersonaggio ? colore : 'rgba(255,255,255,0.3)', letterSpacing:1.5, marginBottom:5, textAlign:'center' }}>
                    {['A','B','C'][i]}
                  </div>
                  <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.85)', lineHeight:1.5, textAlign:'center' }}>
                    {op.testo}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Esito wave */}
          {faseWave === 'esito' && esitoWave && (
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, zIndex:40, background:'rgba(6,14,31,0.88)', animation:'fadeUp 0.2s ease', padding:'0 24px' }}>
              <div style={{ fontSize:56 }}>{esitoWave==='preso'?'✅':esitoWave==='schivato'?'💨':'💥'}</div>
              <div style={{ fontSize:20, fontWeight:900, color:esitoWave==='preso'?'#22c55e':esitoWave==='schivato'?'#fbbf24':'#ef4444' }}>
                {esitoWave==='preso'?'PRESO!':esitoWave==='schivato'?'SCHIVATO!':'COLPITO!'}
              </div>
              <div style={{ width:'100%', maxWidth:320, background:'rgba(34,197,94,0.08)', borderRadius:16, border:'0.5px solid rgba(34,197,94,0.25)', padding:'14px 18px' }}>
                <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:'rgba(34,197,94,0.6)', marginBottom:8 }}>RISPOSTA CORRETTA</div>
                <div style={{ fontSize:13, color:'#fff', lineHeight:1.65, overflowY:'auto', maxHeight:160 }}>
                  {opzioni.find(o=>o.corretta)?.testo}
                </div>
              </div>
            </div>
          )}

          {/* Tutorial */}
          {tutorialAttivo && (
            <div onClick={avviaTutorial} style={{ position:'absolute', inset:0, background:'rgba(6,14,31,0.97)', zIndex:50, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:26, animation:'tutorialIn 0.3s ease' }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:3, color:colore, textTransform:'uppercase' }}>COME GIOCARE</div>
              <div style={{ display:'flex', flexDirection:'column', gap:14, width:'82%', maxWidth:340 }}>
                {[
                  { emoji:'👈👉', testo:'Swipa sinistra / destra per cambiare corsia' },
                  { emoji:'👆', testo:'Swipa su per saltare gli ostacoli 🚧' },
                  { emoji:'🌟', testo:'Corri verso la risposta giusta!' },
                ].map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:16, background:'rgba(255,255,255,0.04)', borderRadius:16, padding:'14px 18px' }}>
                    <span style={{ fontSize:26, flexShrink:0 }}>{s.emoji}</span>
                    <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.8)', lineHeight:1.4 }}>{s.testo}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)' }}>Tocca per iniziare</div>
            </div>
          )}
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
