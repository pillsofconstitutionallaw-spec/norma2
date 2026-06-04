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
  ).slice(0, 3);
  return mescolaArray([
    { testo: cartaCorretta.risposta, corretta: true },
    ...altreRisposte.map(r => ({ testo: r.risposta, corretta: false })),
  ]);
}

const SCALETTA = [
  { n:1,  label:'Matricola',     safe:false },
  { n:2,  label:'Primo esame',   safe:false },
  { n:3,  label:'18/30',         safe:false },
  { n:4,  label:'21/30',         safe:false },
  { n:5,  label:'24/30',         safe:true  },
  { n:6,  label:'25/30',         safe:false },
  { n:7,  label:'26/30',         safe:false },
  { n:8,  label:'27/30',         safe:false },
  { n:9,  label:'28/30',         safe:false },
  { n:10, label:'29/30',         safe:true  },
  { n:11, label:'30/30',         safe:false },
  { n:12, label:'30 e lode',     safe:false },
  { n:13, label:'Tesi discussa', safe:false },
  { n:14, label:'Dottore!',      safe:false },
  { n:15, label:'🎓 Dottorato!', safe:false },
];

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

  // ── milionario state ──
  const [livello, setLivello] = useState(1);
  const [rispostaSelezionata, setRispostaSelezionata] = useState<number|null>(null);
  const [rispostaConfermata, setRispostaConfermata] = useState<number|null>(null);
  const [faseRisposta, setFaseRisposta] = useState<'scelta'|'conferma'|'rivelazione'|'avanzamento'>('scelta');
  const [eliminateIdx, setEliminateIdx] = useState<number[]>([]);
  const [aiutiUsati, setAiutiUsati] = useState({ cinquantaCinquanta:false, professore:false, compagno:false });
  const [audienceVotes, setAudienceVotes] = useState<number[]|null>(null);
  const [professoreRivela, setProfessoreRivela] = useState<number|null>(null);
  const [mostraScaletta, setMostraScaletta] = useState(false);

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
    }, 4000);
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

  // ── milionario functions ──
  function iniziaGioco(materia: Materia, carteMiste?: Carta[]) {
    const tutteCard = carteMiste ?? materia.carte;
    const carteMischiate = mescolaArray(tutteCard).slice(0, Math.max(15, Math.min(GAME_DOMANDE, tutteCard.length)));
    const primaOps = generaOpzioni(tutteCard, carteMischiate[0]);
    setMateriaSelezionata(materia);
    materiaCarteRef.current = tutteCard;
    setCarteGioco(carteMischiate); carteGiocoRef.current = carteMischiate;
    setIndiceGioco(0); indiceGiocoRef.current = 0;
    setOpzioni(primaOps); opzioniRef.current = primaOps;
    setVite(3); viteRef.current = 3;
    setPunteggio(0); punteggioRef.current = 0;
    setStreak(0); streakRef.current = 0;
    setMaxStreak(0); maxStreakRef.current = 0;
    setEsitoRisposta(null); setOpzioneCliccataIdx(null);
    setPuntiGuadagnati(0); setScreenFlash(null); setComboNotifica(null);
    setLivello(1);
    setRispostaSelezionata(null);
    setRispostaConfermata(null);
    setFaseRisposta('scelta');
    setEliminateIdx([]);
    setAiutiUsati({ cinquantaCinquanta:false, professore:false, compagno:false });
    setAudienceVotes(null);
    setProfessoreRivela(null);
    setMostraScaletta(false);
    setFase('gioco');
  }

  function iniziaGiocoTutteMaterie() {
    const tutteCard = MATERIE.flatMap(m => m.carte);
    const fake: Materia = { id:'tutte', titolo:'Tutte le materie', colore:'#818cf8', bg:'#1e1b4b', icona:'🎓', carte:tutteCard };
    iniziaGioco(fake, tutteCard);
  }

  function selezionaRisposta(idx: number) {
    if (eliminateIdx.includes(idx) || faseRisposta !== 'scelta') return;
    setRispostaSelezionata(idx);
    setFaseRisposta('conferma');
  }

  function cambiaMente() {
    setRispostaSelezionata(null);
    setFaseRisposta('scelta');
  }

  function confermaRisposta() {
    if (rispostaSelezionata === null) return;
    setRispostaConfermata(rispostaSelezionata);
    setFaseRisposta('rivelazione');
    setTimeout(() => {
      const corretta = opzioni[rispostaSelezionata].corretta;
      setScreenFlash(corretta ? 'correct' : 'wrong');
      setTimeout(() => setScreenFlash(null), 600);
      if (corretta) {
        const nuovoLivello = livello + 1;
        if (livello >= 15) { setTimeout(() => setFase('game_over'), 2000); return; }
        setFaseRisposta('avanzamento');
        setTimeout(() => {
          const newIndice = indiceGiocoRef.current + 1;
          const src = materiaCarteRef.current;
          const card = carteGiocoRef.current[newIndice % carteGiocoRef.current.length];
          const newOps = generaOpzioni(src, card);
          indiceGiocoRef.current = newIndice;
          setIndiceGioco(newIndice);
          opzioniRef.current = newOps;
          setOpzioni(newOps);
          setLivello(nuovoLivello);
          setRispostaSelezionata(null);
          setRispostaConfermata(null);
          setEliminateIdx([]);
          setAudienceVotes(null);
          setProfessoreRivela(null);
          setFaseRisposta('scelta');
        }, 2200);
      } else {
        setTimeout(() => setFase('game_over'), 2800);
      }
    }, 1600);
  }

  function usaCinquantaCinquanta() {
    if (aiutiUsati.cinquantaCinquanta) return;
    const corrIdx = opzioni.findIndex(o => o.corretta);
    const altri = mescolaArray([0,1,2,3].filter(i => i !== corrIdx && !eliminateIdx.includes(i))).slice(0, 2);
    setEliminateIdx(altri);
    setAiutiUsati(a => ({...a, cinquantaCinquanta:true}));
    if (rispostaSelezionata !== null && altri.includes(rispostaSelezionata)) {
      setRispostaSelezionata(null);
      setFaseRisposta('scelta');
    }
  }

  function usaProfessore() {
    if (aiutiUsati.professore) return;
    setProfessoreRivela(opzioni.findIndex(o => o.corretta));
    setAiutiUsati(a => ({...a, professore:true}));
  }

  function usaCompagno() {
    if (aiutiUsati.compagno) return;
    const corrIdx = opzioni.findIndex(o => o.corretta);
    const disponibili = [0,1,2,3].filter(i => !eliminateIdx.includes(i));
    const votes = [0,0,0,0];
    const pCorr = 55 + Math.floor(Math.random() * 26);
    votes[corrIdx] = pCorr;
    const restanti = disponibili.filter(i => i !== corrIdx);
    let rem = 100 - pCorr;
    restanti.forEach((i, idx) => {
      votes[i] = idx === restanti.length - 1 ? rem : Math.floor(rem * (0.3 + Math.random() * 0.4));
      rem -= votes[i];
    });
    setAudienceVotes(votes);
    setAiutiUsati(a => ({...a, compagno:true}));
  }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current) return;
    touchStartRef.current = null;
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
        @keyframes milBlink {
          0%,100% { background: linear-gradient(135deg,#713f12,#92400e); border-color:#f59e0b; }
          50%      { background: linear-gradient(135deg,#1e3a5f,#1e40af); border-color:#60a5fa; }
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
          {/* TOP BAR */}
          <div style={{ padding:'16px 20px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, zIndex:10 }}>
            <button onClick={() => setFase('scelta')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:13, cursor:'pointer', fontFamily:'Montserrat, sans-serif', padding:0 }}>← Esci</button>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:3, color:'rgba(255,200,50,0.5)', textTransform:'uppercase' }}>Chi vuole essere</div>
              <div style={{ fontSize:16, fontWeight:900, color:'#fbbf24', letterSpacing:1 }}>LAUREATO?</div>
            </div>
            <button onClick={() => setMostraScaletta(s => !s)} style={{ background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.15)', borderRadius:10, padding:'6px 10px', color:'rgba(255,255,255,0.6)', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'Montserrat, sans-serif' }}>📊</button>
          </div>

          {/* LIVELLO */}
          <div style={{ textAlign:'center', flexShrink:0, marginBottom:8, zIndex:10 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(251,191,36,0.08)', border:'0.5px solid rgba(251,191,36,0.3)', borderRadius:20, padding:'6px 20px' }}>
              <span style={{ fontSize:9, color:'rgba(255,255,255,0.35)' }}>Livello {livello}/15</span>
              <span style={{ fontSize:14, fontWeight:900, color:'#fbbf24' }}>{SCALETTA[livello-1].label}</span>
              {SCALETTA[livello-1].safe && <span style={{ fontSize:9, color:'#22c55e' }}>✓ Safe</span>}
            </div>
          </div>

          {/* AIUTI */}
          <div style={{ display:'flex', justifyContent:'center', gap:14, flexShrink:0, marginBottom:10, zIndex:10 }}>
            {[
              { key:'cinquantaCinquanta', icon:'½', label:'50:50', usato:aiutiUsati.cinquantaCinquanta, fn:usaCinquantaCinquanta },
              { key:'professore', icon:'👨‍🏫', label:'Prof', usato:aiutiUsati.professore, fn:usaProfessore },
              { key:'compagno', icon:'👥', label:'Classe', usato:aiutiUsati.compagno, fn:usaCompagno },
            ].map(a => (
              <button key={a.key} onClick={a.fn} disabled={a.usato || faseRisposta === 'rivelazione'}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, background:a.usato?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.07)', border:`1px solid ${a.usato?'rgba(255,255,255,0.05)':'rgba(251,191,36,0.35)'}`, borderRadius:14, padding:'8px 14px', cursor:a.usato?'default':'pointer', opacity:a.usato?0.3:1, transition:'opacity 0.3s', fontFamily:'Montserrat, sans-serif' }}>
                <span style={{ fontSize:20 }}>{a.icon}</span>
                <span style={{ fontSize:8, fontWeight:700, color:'rgba(255,255,255,0.45)', letterSpacing:1 }}>{a.label}</span>
              </button>
            ))}
          </div>

          {/* DOMANDA */}
          <div style={{ padding:'0 16px', flexShrink:0, marginBottom:14, zIndex:10 }}>
            <div key={`q-${indiceGioco}`} style={{ background:'linear-gradient(135deg,#0d1f3c,#061224)', border:'1px solid rgba(56,189,248,0.2)', borderRadius:20, padding:'20px 20px', textAlign:'center', animation:'fadeUp 0.25s ease' }}>
              <div style={{ fontSize:8, letterSpacing:2, color:'rgba(255,255,255,0.22)', marginBottom:10, fontWeight:700 }}>DOMANDA {livello}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff', lineHeight:1.72 }}>{carteGioco[indiceGioco % carteGioco.length].domanda}</div>
            </div>
          </div>

          {/* RISPOSTE 2×2 */}
          <div style={{ padding:'0 16px', flex:1, display:'flex', flexDirection:'column', gap:10, zIndex:10 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {opzioni.map((op, i) => {
                const letters = ['A','B','C','D'];
                const eliminated = eliminateIdx.includes(i);
                const isSelected = rispostaSelezionata === i;
                const isConfirmed = rispostaConfermata === i;
                const revealed = faseRisposta === 'rivelazione' || faseRisposta === 'avanzamento';
                const isProfHint = professoreRivela === i;
                let bg = 'linear-gradient(135deg,#0d1f3c,#061224)';
                let border = '1.5px solid rgba(56,189,248,0.22)';
                let textColor = eliminated?'transparent':'rgba(255,255,255,0.88)';
                let letterColor = eliminated?'transparent':'#fbbf24';
                let anim = '';
                if (eliminated) { bg='rgba(0,0,0,0.1)'; border='1.5px solid rgba(255,255,255,0.03)'; }
                else if (revealed) {
                  if (op.corretta) { bg='linear-gradient(135deg,#14532d,#166534)'; border='1.5px solid #22c55e'; textColor='#fff'; }
                  else if (isConfirmed) { bg='linear-gradient(135deg,#450a0a,#7f1d1d)'; border='1.5px solid #ef4444'; textColor='#fff'; }
                  else { bg='rgba(0,0,0,0.2)'; border='1.5px solid rgba(255,255,255,0.04)'; textColor='rgba(255,255,255,0.2)'; letterColor='rgba(255,255,255,0.12)'; }
                } else if (isConfirmed) { bg='linear-gradient(135deg,#713f12,#92400e)'; border='1.5px solid #f59e0b'; textColor='#fff'; anim='milBlink 0.9s ease infinite'; }
                else if (isSelected) { bg='linear-gradient(135deg,#78350f,#92400e)'; border='1.5px solid #f59e0b'; textColor='#fff'; }
                else if (isProfHint) { border='1.5px solid rgba(34,197,94,0.55)'; letterColor='#22c55e'; }
                return (
                  <button key={i} onClick={() => !eliminated && faseRisposta==='scelta' && selezionaRisposta(i)}
                    style={{ textAlign:'left', padding:'12px 14px', borderRadius:16, border, background:bg, color:textColor, fontFamily:'Montserrat, sans-serif', cursor:eliminated||faseRisposta!=='scelta'?'default':'pointer', display:'flex', gap:10, alignItems:'flex-start', minHeight:68, transition:'background 0.3s,border 0.3s', animation:anim }}>
                    <span style={{ fontSize:11, fontWeight:900, color:letterColor, flexShrink:0, minWidth:16, paddingTop:1, transition:'color 0.3s' }}>{letters[i]}</span>
                    <span style={{ fontSize:11.5, fontWeight:600, lineHeight:1.55 }}>{eliminated?'':op.testo}</span>
                  </button>
                );
              })}
            </div>

            {/* Poll compagno */}
            {audienceVotes && faseRisposta === 'scelta' && (
              <div style={{ background:'rgba(0,0,0,0.35)', borderRadius:14, padding:'12px 16px', border:'0.5px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, color:'rgba(255,255,255,0.3)', marginBottom:10 }}>👥 LA CLASSE VOTA</div>
                {[0,1,2,3].filter(i => !eliminateIdx.includes(i)).map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:'#fbbf24', width:14 }}>{['A','B','C','D'][i]}</span>
                    <div style={{ flex:1, height:10, background:'rgba(255,255,255,0.05)', borderRadius:5, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${audienceVotes[i]}%`, background:'linear-gradient(90deg,#3b82f6,#60a5fa)', borderRadius:5, transition:'width 0.9s ease' }} />
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.55)', minWidth:28, textAlign:'right' }}>{audienceVotes[i]}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Conferma / Cambia */}
            {faseRisposta === 'conferma' && (
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={cambiaMente} style={{ flex:1, padding:'14px', borderRadius:16, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.55)', fontFamily:'Montserrat, sans-serif', fontWeight:700, fontSize:13, cursor:'pointer' }}>← Cambia</button>
                <button onClick={confermaRisposta} style={{ flex:2, padding:'14px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#b45309,#d97706)', color:'#fff', fontFamily:'Montserrat, sans-serif', fontWeight:900, fontSize:14, cursor:'pointer' }}>✓ Risposta finale!</button>
              </div>
            )}
          </div>

          {/* SCALETTA OVERLAY */}
          {mostraScaletta && (
            <div onClick={() => setMostraScaletta(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.65)', zIndex:50, display:'flex', justifyContent:'flex-end' }}>
              <div onClick={e => e.stopPropagation()} style={{ width:'55%', height:'100%', background:'linear-gradient(180deg,#030509,#0d1f3c)', padding:'24px 14px', overflowY:'auto', display:'flex', flexDirection:'column', gap:4 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:'rgba(255,200,50,0.6)', marginBottom:12, textAlign:'center' }}>SCALETTA</div>
                {[...SCALETTA].reverse().map(s => (
                  <div key={s.n} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:10, background:s.n===livello?'rgba(251,191,36,0.18)':s.n<livello?'rgba(34,197,94,0.06)':'transparent', border:s.n===livello?'1px solid rgba(251,191,36,0.45)':s.safe?'0.5px solid rgba(34,197,94,0.18)':'none' }}>
                    <span style={{ fontSize:9, color:'rgba(255,255,255,0.25)', minWidth:16 }}>{s.n}</span>
                    <span style={{ fontSize:11, fontWeight:s.n===livello?900:600, color:s.n===livello?'#fbbf24':s.n<livello?'#22c55e':s.safe?'rgba(34,197,94,0.65)':'rgba(255,255,255,0.55)' }}>{s.label}</span>
                    {s.safe && <span style={{ fontSize:8, color:'#22c55e', marginLeft:'auto' }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

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
          <div style={{ position:'absolute', bottom:'17%', left:`${[16.5,50,83.5][corsiaPersonaggio]}%`, width:120, height:200, transform:'translateX(-50%)', zIndex:15, transition:'left 0.14s cubic-bezier(0.34,1.56,0.64,1)', pointerEvents:'none' }}>
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

        </div>
      )}

          {/* ══ GAME OVER — CHI VUOLE ESSERE LAUREATO ══ */}
          {fase === 'game_over' && materiaSelezionata && (
            <div style={{ textAlign: 'center', paddingTop: 20, animation: 'fadeUp 0.4s ease' }}>
              <div style={{ fontSize: 60, marginBottom: 14 }}>
                {livello > 15 ? '🎓' : livello >= 11 ? '🏆' : livello >= 6 ? '🎯' : '💀'}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 6 }}>
                {livello > 15 ? 'HAI VINTO!' : 'Sei arrivato a'}
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fbbf24', marginBottom: 4, letterSpacing: -1 }}>
                {SCALETTA[Math.min(livello, 15) - 1].label}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 32 }}>
                Livello {Math.min(livello, 15)} di 15
              </div>
              <button
                onClick={() => iniziaGioco(materiaSelezionata!)}
                style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#b45309,#d97706)', color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}
              >
                🎮 Rigioca
              </button>
              <button
                onClick={iniziaGiocoTutteMaterie}
                style={{ width: '100%', padding: '15px', borderRadius: 16, border: '0.5px solid rgba(251,191,36,0.25)', background: 'rgba(251,191,36,0.06)', color: '#fbbf24', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}
              >
                🎓 Gioca con tutte le materie
              </button>
              <button
                onClick={() => setFase('scelta')}
                style={{ width: '100%', padding: '15px', borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.08)', background: '#111526', color: 'rgba(255,255,255,0.45)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
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
