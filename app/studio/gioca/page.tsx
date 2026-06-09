'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { carte as cartePrivato, meta as metaPrivato } from '@/src/data/cards/diritto-privato';
import { carte as carteCostituzionale, meta as metaCostituzionale } from '@/src/data/cards/diritto-costituzionale';
import { carte as carteInternazionale, meta as metaInternazionale } from '@/src/data/cards/diritto-internazionale';
import { carte as carteIntPrivato, meta as metaIntPrivato } from '@/src/data/cards/diritto-internazionale-privato';
import { carte as carteRomano, meta as metaRomano } from '@/src/data/cards/diritto-romano';
import { carte as carteLavoro, meta as metaLavoro } from '@/src/data/cards/diritto-del-lavoro';
import { carte as cartePenale, meta as metaPenale } from '@/src/data/cards/diritto-penale';
import { carte as carteUE, meta as metaUE } from '@/src/data/cards/diritto-ue';

type Carta = { domanda: string; risposta: string };
type Materia = { id: string; titolo: string; colore: string; bg: string; icona: string; carte: Carta[] };
type Opzione = { testo: string; corretta: boolean };
type GameScreen = 'selezione' | 'milionario' | 'trivia' | 'abbina';
type AbbinaPair = { id: string; termine: string; definizione: string };

const MATERIE: Materia[] = [
  { id: 'privato',        titolo: metaPrivato.titolo,         colore: metaPrivato.colore,         bg: metaPrivato.bg,         icona: metaPrivato.icona,         carte: cartePrivato },
  { id: 'costituzionale', titolo: metaCostituzionale.titolo,  colore: metaCostituzionale.colore,  bg: metaCostituzionale.bg,  icona: metaCostituzionale.icona,  carte: carteCostituzionale },
  { id: 'internazionale', titolo: metaInternazionale.titolo,  colore: metaInternazionale.colore,  bg: metaInternazionale.bg,  icona: metaInternazionale.icona,  carte: carteInternazionale },
  { id: 'int-privato',    titolo: metaIntPrivato.titolo,      colore: metaIntPrivato.colore,      bg: metaIntPrivato.bg,      icona: metaIntPrivato.icona,      carte: carteIntPrivato },
  { id: 'romano',         titolo: metaRomano.titolo,          colore: metaRomano.colore,          bg: metaRomano.bg,          icona: metaRomano.icona,          carte: carteRomano },
  { id: 'lavoro',         titolo: metaLavoro.titolo,          colore: metaLavoro.colore,          bg: metaLavoro.bg,          icona: metaLavoro.icona,          carte: carteLavoro },
  { id: 'penale',         titolo: metaPenale.titolo,          colore: metaPenale.colore,          bg: metaPenale.bg,          icona: metaPenale.icona,          carte: cartePenale },
  { id: 'ue',             titolo: metaUE.titolo,              colore: metaUE.colore,              bg: metaUE.bg,              icona: metaUE.icona,              carte: carteUE },
];

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

function mescola<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function opzioniPer(pool: Carta[], carta: Carta): Opzione[] {
  const altri = mescola(pool.filter(c => c.risposta !== carta.risposta)).slice(0, 3);
  return mescola([{ testo: carta.risposta, corretta: true }, ...altri.map(r => ({ testo: r.risposta, corretta: false }))]);
}

// ─────────────────────────────────────────────
// SVG WHEEL (Trivia Track)
// ─────────────────────────────────────────────
function polarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function WheelSVG({ rotation, size = 260 }: { rotation: number; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 4;
  const n = MATERIE.length;
  const deg = 360 / n;
  return (
    <svg width={size} height={size} style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 3.2s cubic-bezier(0.17,0.67,0.12,1)', display: 'block' }}>
      {MATERIE.map((m, i) => {
        const start = polarXY(cx, cy, r, i * deg);
        const end   = polarXY(cx, cy, r, (i + 1) * deg);
        const mid   = polarXY(cx, cy, r * 0.62, i * deg + deg / 2);
        return (
          <g key={m.id}>
            <path d={`M${cx},${cy} L${start.x},${start.y} A${r},${r} 0 0,1 ${end.x},${end.y} Z`} fill={m.colore} opacity={0.85} />
            <text x={mid.x} y={mid.y} textAnchor="middle" dominantBaseline="middle" fontSize={20}>{m.icona}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={18} fill="#0a0d18" />
      <circle cx={cx} cy={cy} r={14} fill="#fbbf24" opacity={0.9} />
    </svg>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
function GiocaContent() {
  const router = useRouter();
  const [screen, setScreen] = useState<GameScreen>('selezione');
  const [materiaTarget, setMateriaTarget] = useState<Materia | null>(null); // null = tutte

  // ── Milionario state ──
  const [livello, setLivello] = useState(1);
  const [mCarteGioco, setMCarteGioco] = useState<Carta[]>([]);
  const [mIndice, setMIndice] = useState(0);
  const [mOpzioni, setMOpzioni] = useState<Opzione[]>([]);
  const [mFase, setMFase] = useState<'scelta' | 'conferma' | 'rivelazione' | 'avanzamento'>('scelta');
  const [mSelezionata, setMSelezionata] = useState<number | null>(null);
  const [mConfermata, setMConfermata] = useState<number | null>(null);
  const [mEliminate, setMEliminate] = useState<number[]>([]);
  const [mAiuti, setMAiuti] = useState({ cinq: false, prof: false, comp: false });
  const [mVotes, setMVotes] = useState<number[] | null>(null);
  const [mProf, setMProf] = useState<number | null>(null);
  const [mScaletta, setMScaletta] = useState(false);
  const [mOver, setMOver] = useState(false);
  const [mVinto, setMVinto] = useState(false);
  const mPoolRef = useRef<Carta[]>([]);
  const mCarteRef = useRef<Carta[]>([]);
  const mIndiceRef = useRef(0);
  const mOpzioniRef = useRef<Opzione[]>([]);
  const [mScreenFlash, setMScreenFlash] = useState<'correct' | 'wrong' | null>(null);

  // ── Trivia state ──
  const [tRotazione, setTRotazione] = useState(0);
  const [tSpinning, setTSpinning] = useState(false);
  const [tMateria, setTMateria] = useState<Materia | null>(null);
  const [tCarta, setTCarta] = useState<Carta | null>(null);
  const [tOpzioni, setTOpzioni] = useState<Opzione[]>([]);
  const [tFase, setTFase] = useState<'spin' | 'question' | 'result' | 'over'>('spin');
  const [tVite, setTVite] = useState(3);
  const [tScore, setTScore] = useState(0);
  const [tRisposta, setTRisposta] = useState<'corretta' | 'sbagliata' | null>(null);
  const [tSelezionata, setTSelezionata] = useState<number | null>(null);
  const [tFlash, setTFlash] = useState<'correct' | 'wrong' | null>(null);
  const [tRound, setTRound] = useState(1);
  const [tQCount, setTQCount] = useState(0);
  const [tRoundFlash, setTRoundFlash] = useState(false);
  const [tVinto, setTVinto] = useState(false);
  const tPoolRef = useRef<Carta[]>([]);
  const tUsedRef = useRef<Set<string>>(new Set());
  const tQCountRef = useRef(0);
  const tRoundRef = useRef(1);

  // ── Abbina state ──
  const [aPairs, setAPairs] = useState<AbbinaPair[]>([]);
  const [aLeftOrder, setALeftOrder] = useState<string[]>([]);
  const [aRightOrder, setARightOrder] = useState<string[]>([]);
  const [aSelectedLeft, setASelectedLeft] = useState<string | null>(null);
  const [aMatched, setAMatched] = useState<string[]>([]);
  const [aWrong, setAWrong] = useState<string | null>(null); // pair id that was wrong
  const [aCorrectFlash, setACorrectFlash] = useState<string | null>(null);
  const [aVite, setAVite] = useState(3);
  const [aScore, setAScore] = useState(0);
  const [aRound, setARound] = useState(1);
  const [aOver, setAOver] = useState(false);
  const [aVinto, setAVinto] = useState(false);
  const [aRoundFlash, setARoundFlash] = useState(false);
  const aPoolRef = useRef<Carta[]>([]);
  const aOffsetRef = useRef(0);

  // ── Milionario functions ──
  function startMilionario(materia: Materia | null) {
    const pool = materia ? materia.carte : MATERIE.flatMap(m => m.carte);
    const carte = mescola(pool).slice(0, 15);
    const ops = opzioniPer(pool, carte[0]);
    mPoolRef.current = pool;
    mCarteRef.current = carte;
    mIndiceRef.current = 0;
    mOpzioniRef.current = ops;
    setMateriaTarget(materia);
    setLivello(1);
    setMCarteGioco(carte);
    setMIndice(0);
    setMOpzioni(ops);
    setMFase('scelta');
    setMSelezionata(null);
    setMConfermata(null);
    setMEliminate([]);
    setMAiuti({ cinq: false, prof: false, comp: false });
    setMVotes(null);
    setMProf(null);
    setMScaletta(false);
    setMOver(false);
    setMVinto(false);
    setScreen('milionario');
  }

  function mSeleziona(idx: number) {
    if (mEliminate.includes(idx) || mFase !== 'scelta') return;
    setMSelezionata(idx);
    setMFase('conferma');
  }

  function mCambia() {
    setMSelezionata(null);
    setMFase('scelta');
  }

  function mConferma() {
    if (mSelezionata === null) return;
    setMConfermata(mSelezionata);
    setMFase('rivelazione');
    setTimeout(() => {
      const corr = mOpzioni[mSelezionata].corretta;
      setMScreenFlash(corr ? 'correct' : 'wrong');
      setTimeout(() => setMScreenFlash(null), 600);
      if (corr) {
        if (livello >= 15) { setMVinto(true); setMOver(true); return; }
        setMFase('avanzamento');
        setTimeout(() => {
          const ni = mIndiceRef.current + 1;
          const card = mCarteRef.current[ni % mCarteRef.current.length];
          const ops = opzioniPer(mPoolRef.current, card);
          mIndiceRef.current = ni;
          mOpzioniRef.current = ops;
          setMIndice(ni);
          setMOpzioni(ops);
          setLivello(l => l + 1);
          setMSelezionata(null); setMConfermata(null); setMEliminate([]); setMVotes(null); setMProf(null);
          setMFase('scelta');
        }, 2000);
      } else {
        setTimeout(() => setMOver(true), 2500);
      }
    }, 1600);
  }

  function mCinquanta() {
    if (mAiuti.cinq) return;
    const ci = mOpzioni.findIndex(o => o.corretta);
    const altri = mescola([0,1,2,3].filter(i => i !== ci && !mEliminate.includes(i))).slice(0, 2);
    setMEliminate(altri);
    setMAiuti(a => ({ ...a, cinq: true }));
    if (mSelezionata !== null && altri.includes(mSelezionata)) { setMSelezionata(null); setMFase('scelta'); }
  }

  function mProfe() {
    if (mAiuti.prof) return;
    setMProf(mOpzioni.findIndex(o => o.corretta));
    setMAiuti(a => ({ ...a, prof: true }));
  }

  function mCompagno() {
    if (mAiuti.comp) return;
    const ci = mOpzioni.findIndex(o => o.corretta);
    const disp = [0,1,2,3].filter(i => !mEliminate.includes(i));
    const votes = [0,0,0,0];
    const pc = 58 + Math.floor(Math.random() * 23);
    votes[ci] = pc;
    const rest = disp.filter(i => i !== ci);
    let rem = 100 - pc;
    rest.forEach((i, idx) => { votes[i] = idx === rest.length-1 ? rem : Math.floor(rem * (0.3 + Math.random() * 0.4)); rem -= votes[i]; });
    setMVotes(votes);
    setMAiuti(a => ({ ...a, comp: true }));
  }

  // ── Trivia functions ──
  function startTrivia(materia: Materia | null) {
    const pool = materia ? materia.carte : MATERIE.flatMap(m => m.carte);
    tPoolRef.current = pool;
    tUsedRef.current = new Set();
    setMateriaTarget(materia);
    setTVite(3); setTScore(0); setTSpinning(false); setTMateria(null); setTCarta(null); setTOpzioni([]); setTRisposta(null); setTSelezionata(null); setTFlash(null);
    setTRound(1); tRoundRef.current = 1;
    setTQCount(0); tQCountRef.current = 0;
    setTRoundFlash(false); setTVinto(false);
    setTFase(materia ? 'question' : 'spin');
    if (materia) {
      const card = mescola(materia.carte)[0];
      setTCarta(card);
      setTOpzioni(opzioniPer(materia.carte, card));
      setTMateria(materia);
    }
    setScreen('trivia');
  }

  function tSpin() {
    if (tSpinning) return;
    setTSpinning(true);
    const idx = Math.floor(Math.random() * MATERIE.length);
    const newRot = tRotazione + 1800 + idx * (360 / MATERIE.length) + Math.floor(Math.random() * (360 / MATERIE.length));
    setTRotazione(newRot);
    setTimeout(() => {
      const materia = MATERIE[idx];
      setTMateria(materia);
      const pool = materia.carte.filter(c => !tUsedRef.current.has(c.domanda));
      const src = pool.length > 0 ? pool : materia.carte;
      const card = mescola(src)[0];
      tUsedRef.current.add(card.domanda);
      setTCarta(card);
      setTOpzioni(opzioniPer(materia.carte, card));
      setTFase('question');
      setTRisposta(null);
      setTSpinning(false);
    }, 3300);
  }

  function tRispondi(idx: number) {
    if (tRisposta !== null || !tCarta) return;
    const corretta = tOpzioni[idx].corretta;
    setTSelezionata(idx);
    setTRisposta(corretta ? 'corretta' : 'sbagliata');
    setTFlash(corretta ? 'correct' : 'wrong');
    setTimeout(() => setTFlash(null), 500);
    if (corretta) {
      setTScore(s => s + 100);
    } else {
      setTVite(v => {
        const nv = v - 1;
        if (nv <= 0) setTimeout(() => setTFase('over'), 1800);
        return nv;
      });
    }
    setTimeout(() => {
      if (tVite > 1 || corretta) {
        const newQ = tQCountRef.current + 1;
        tQCountRef.current = newQ;
        setTQCount(newQ);

        function nextCard(mat: Materia) {
          const pool = mat.carte.filter(c => !tUsedRef.current.has(c.domanda));
          const src = pool.length > 0 ? pool : mat.carte;
          const card = mescola(src)[0];
          tUsedRef.current.add(card.domanda);
          setTCarta(card);
          setTOpzioni(opzioniPer(mat.carte, card));
          setTRisposta(null);
          setTSelezionata(null);
        }

        if (newQ >= 10) {
          if (tRoundRef.current >= 3) {
            setTVinto(true);
            setTFase('over');
          } else {
            setTRoundFlash(true);
            setTimeout(() => {
              const next = tRoundRef.current + 1;
              tRoundRef.current = next;
              tQCountRef.current = 0;
              setTRound(next);
              setTQCount(0);
              setTRoundFlash(false);
              if (materiaTarget) {
                nextCard(materiaTarget);
              } else {
                setTFase('spin');
                setTRisposta(null);
                setTSelezionata(null);
              }
            }, 2200);
          }
        } else {
          if (materiaTarget) {
            nextCard(materiaTarget);
          } else {
            setTFase('spin');
            setTRisposta(null);
            setTSelezionata(null);
          }
        }
      }
    }, corretta ? 1500 : 2000);
  }

  // ── Abbina functions ──
  function caricaRoundAbbina(pool: Carta[], offset: number, round: number) {
    const slice = pool.slice(offset, offset + 6);
    if (slice.length < 2) { setAVinto(true); setAOver(true); return; }
    const pairs: AbbinaPair[] = slice.map(c => ({ id: c.domanda, termine: c.domanda, definizione: c.risposta }));
    const ids = pairs.map(p => p.id);
    setAPairs(pairs);
    setALeftOrder(mescola(ids));
    setARightOrder(mescola(ids));
    setAMatched([]);
    setASelectedLeft(null);
    setAWrong(null);
    setACorrectFlash(null);
    setARound(round);
  }

  function startAbbina(materia: Materia | null) {
    const pool = mescola(materia ? materia.carte : MATERIE.flatMap(m => m.carte));
    aPoolRef.current = pool;
    aOffsetRef.current = 0;
    setMateriaTarget(materia);
    setAVite(3); setAScore(0); setAOver(false); setAVinto(false);
    caricaRoundAbbina(pool, 0, 1);
    setScreen('abbina');
  }

  function aTapLeft(id: string) {
    if (aMatched.includes(id) || aWrong !== null) return;
    setASelectedLeft(prev => prev === id ? null : id);
  }

  function aTapRight(id: string) {
    if (aMatched.includes(id) || aWrong !== null) return;
    if (!aSelectedLeft) return;
    if (aSelectedLeft === id) {
      // MATCH
      setACorrectFlash(id);
      setASelectedLeft(null);
      const newMatched = [...aMatched, id];
      setAMatched(newMatched);
      setAScore(s => s + 100);
      setTimeout(() => setACorrectFlash(null), 600);
      if (newMatched.length === aPairs.length) {
        // Round completato
        setARoundFlash(true);
        setTimeout(() => {
          setARoundFlash(false);
          const newOffset = aOffsetRef.current + 6;
          aOffsetRef.current = newOffset;
          caricaRoundAbbina(aPoolRef.current, newOffset, aRound + 1);
        }, 1200);
      }
    } else {
      // WRONG
      setAWrong(aSelectedLeft);
      const newVite = aVite - 1;
      setAVite(newVite);
      setTimeout(() => {
        setAWrong(null);
        setASelectedLeft(null);
        if (newVite <= 0) { setAOver(true); }
      }, 800);
    }
  }

  const colore = materiaTarget?.colore ?? '#818cf8';

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes flashFade { 0% { opacity:1; } 100% { opacity:0; } }
        @keyframes milBlink {
          0%,100% { background:linear-gradient(135deg,#713f12,#92400e); border-color:#f59e0b; }
          50%      { background:linear-gradient(135deg,#1e3a5f,#1e40af); border-color:#60a5fa; }
        }
        @keyframes pulseStar { 0%,100%{transform:scale(1);} 50%{transform:scale(1.15);} }
      `}</style>

      {/* Screen flash */}
      {(mScreenFlash || tFlash) && (
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:999, background:(mScreenFlash||tFlash)==='correct'?'rgba(34,197,94,0.12)':'rgba(239,68,68,0.12)', animation:'flashFade 0.4s ease forwards' }} />
      )}

      {/* ══ SELEZIONE ══ */}
      {screen === 'selezione' && (
        <div style={{ fontFamily:'Montserrat, sans-serif', background:'#0a0d18', minHeight:'100vh' }}>
          <Header />
          <div style={{ padding:'20px 16px 120px', maxWidth:650, margin:'0 auto' }}>
            <button onClick={() => router.back()} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:13, cursor:'pointer', padding:0, fontFamily:'Montserrat, sans-serif', marginBottom:24 }}>← Indietro</button>

            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:3, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:6 }}>Impara Giocando</div>
              <div style={{ fontSize:24, fontWeight:900, color:'#fff' }}>🎮 Scegli il gioco</div>
            </div>

            {/* Quiz Generale */}
            <div style={{ background:'linear-gradient(135deg,#0d1f3c,#061224)', border:'1px solid rgba(56,189,248,0.2)', borderRadius:20, padding:'20px 18px', marginBottom:20 }}>
              <div style={{ fontSize:9, fontWeight:700, letterSpacing:3, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:6 }}>Quiz Generale</div>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff', marginBottom:4 }}>Tutte le materie</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:18 }}>{MATERIE.reduce((s,m) => s+m.carte.length, 0)} domande dal pool completo</div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => startMilionario(null)} style={{ flex:1, padding:'14px 6px 10px', borderRadius:14, border:'1px solid rgba(251,191,36,0.25)', background:'linear-gradient(135deg,#1c0e00,#2d1a00)', color:'#fff', fontFamily:'Montserrat, sans-serif', fontWeight:800, fontSize:10, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                  <img src="/game-logo-laureato.png" alt="Chi vuole essere Laureato" style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', display:'block' }} />
                  <span style={{ color:'#fbbf24', lineHeight:1.2, textAlign:'center' }}>Chi vuole essere Laureato</span>
                </button>
                <button onClick={() => startTrivia(null)} style={{ flex:1, padding:'14px 6px 10px', borderRadius:14, border:'1px solid rgba(196,181,253,0.25)', background:'linear-gradient(135deg,#0d0520,#1a0a3a)', color:'#fff', fontFamily:'Montserrat, sans-serif', fontWeight:800, fontSize:10, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                  <img src="/game-logo-trivia.png" alt="Trivia Track" style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', display:'block' }} />
                  <span style={{ color:'#c4b5fd', lineHeight:1.2, textAlign:'center' }}>Trivia Track</span>
                </button>
                <button onClick={() => startAbbina(null)} style={{ flex:1, padding:'14px 6px 10px', borderRadius:14, border:'1px solid rgba(52,211,153,0.25)', background:'linear-gradient(135deg,#001a10,#022c22)', color:'#fff', fontFamily:'Montserrat, sans-serif', fontWeight:800, fontSize:10, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                  <img src="/game-logo-abbina.png" alt="Associa le Definizioni" style={{ width:52, height:52, borderRadius:'50%', objectFit:'cover', display:'block' }} />
                  <span style={{ color:'#34d399', lineHeight:1.2, textAlign:'center' }}>Associa le Definizioni</span>
                </button>
              </div>
            </div>

            {/* Materie singole */}
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:2.5, color:'rgba(255,255,255,0.25)', textTransform:'uppercase', marginBottom:12 }}>Scegli materia</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {MATERIE.map(m => (
                <div key={m.id} style={{ background:'#111526', border:`0.5px solid ${m.colore}33`, borderRadius:18, padding:'14px 16px', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:46, height:46, borderRadius:13, background:m.bg, border:`0.5px solid ${m.colore}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{m.icona}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:2 }}>{m.titolo}</div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)' }}>{m.carte.length} carte</div>
                  </div>
                  <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                    <button onClick={() => startMilionario(m)} style={{ padding:'6px', borderRadius:12, border:'1px solid rgba(251,191,36,0.3)', background:'linear-gradient(135deg,#1c0e00,#2d1a00)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <img src="/game-logo-laureato.png" alt="Laureato" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', display:'block' }} />
                    </button>
                    <button onClick={() => startTrivia(m)} style={{ padding:'6px', borderRadius:12, border:'1px solid rgba(196,181,253,0.3)', background:'linear-gradient(135deg,#0d0520,#1a0a3a)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <img src="/game-logo-trivia.png" alt="Trivia" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', display:'block' }} />
                    </button>
                    <button onClick={() => startAbbina(m)} style={{ padding:'6px', borderRadius:12, border:'1px solid rgba(52,211,153,0.3)', background:'linear-gradient(135deg,#001a10,#022c22)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <img src="/game-logo-abbina.png" alt="Abbina" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', display:'block' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      )}

      {/* ══ MILIONARIO ══ */}
      {screen === 'milionario' && !mOver && (
        <div style={{ position:'fixed', inset:0, zIndex:100, background:'radial-gradient(ellipse at 50% 35%,#0d1f3c 0%,#030509 80%)', fontFamily:'Montserrat, sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* TOP */}
          <div style={{ padding:'16px 20px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <button onClick={() => setScreen('selezione')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:13, cursor:'pointer', fontFamily:'Montserrat, sans-serif', padding:0 }}>← Esci</button>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:3, color:'rgba(255,200,50,0.5)', textTransform:'uppercase' }}>Chi vuole essere</div>
              <div style={{ fontSize:15, fontWeight:900, color:'#fbbf24', letterSpacing:1 }}>LAUREATO?</div>
            </div>
            <button onClick={() => setMScaletta(s => !s)} style={{ background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.15)', borderRadius:10, padding:'6px 10px', color:'rgba(255,255,255,0.55)', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'Montserrat, sans-serif' }}>📊</button>
          </div>

          {/* LIVELLO */}
          <div style={{ textAlign:'center', flexShrink:0, marginBottom:8 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(251,191,36,0.08)', border:'0.5px solid rgba(251,191,36,0.3)', borderRadius:20, padding:'6px 20px' }}>
              <span style={{ fontSize:9, color:'rgba(255,255,255,0.35)' }}>Livello {livello}/15</span>
              <span style={{ fontSize:14, fontWeight:900, color:'#fbbf24' }}>{SCALETTA[livello-1].label}</span>
              {SCALETTA[livello-1].safe && <span style={{ fontSize:9, color:'#22c55e' }}>✓ Safe</span>}
            </div>
          </div>

          {/* AIUTI */}
          <div style={{ display:'flex', justifyContent:'center', gap:14, flexShrink:0, marginBottom:10 }}>
            {[
              { k:'cinq',  icon:'½',   label:'50:50', usato:mAiuti.cinq,  fn:mCinquanta },
              { k:'prof',  icon:'👨‍🏫', label:'Prof',  usato:mAiuti.prof,  fn:mProfe },
              { k:'comp',  icon:'👥',   label:'Classe',usato:mAiuti.comp,  fn:mCompagno },
            ].map(a => (
              <button key={a.k} onClick={a.fn} disabled={a.usato || mFase==='rivelazione'}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, background:a.usato?'rgba(255,255,255,0.02)':'rgba(255,255,255,0.07)', border:`1px solid ${a.usato?'rgba(255,255,255,0.05)':'rgba(251,191,36,0.35)'}`, borderRadius:14, padding:'8px 14px', cursor:a.usato?'default':'pointer', opacity:a.usato?0.28:1, transition:'opacity 0.3s', fontFamily:'Montserrat, sans-serif' }}>
                <span style={{ fontSize:20 }}>{a.icon}</span>
                <span style={{ fontSize:8, fontWeight:700, color:'rgba(255,255,255,0.4)', letterSpacing:1 }}>{a.label}</span>
              </button>
            ))}
          </div>

          {/* DOMANDA */}
          <div style={{ padding:'0 16px', flexShrink:0, marginBottom:12 }}>
            <div key={`mil-${mIndice}`} style={{ background:'linear-gradient(135deg,#0d1f3c,#061224)', border:'1px solid rgba(56,189,248,0.18)', borderRadius:20, padding:'20px 20px', textAlign:'center', animation:'fadeUp 0.25s ease' }}>
              <div style={{ fontSize:8, letterSpacing:2, color:'rgba(255,255,255,0.22)', marginBottom:10, fontWeight:700 }}>DOMANDA {livello}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#fff', lineHeight:1.72 }}>{mCarteGioco[mIndice % mCarteGioco.length]?.domanda}</div>
            </div>
          </div>

          {/* RISPOSTE */}
          <div style={{ padding:'0 16px', flex:'1 1 0', display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {mOpzioni.map((op, i) => {
                const L = ['A','B','C','D'];
                const elim = mEliminate.includes(i);
                const isSel = mSelezionata === i;
                const isConf = mConfermata === i;
                const rev = mFase==='rivelazione'||mFase==='avanzamento';
                let bg='linear-gradient(135deg,#0d1f3c,#061224)', border='1.5px solid rgba(56,189,248,0.2)';
                let tc=elim?'transparent':'rgba(255,255,255,0.88)', lc=elim?'transparent':'#fbbf24', anim='';
                if (elim) { bg='rgba(0,0,0,0.08)'; border='1.5px solid rgba(255,255,255,0.03)'; }
                else if (rev) {
                  if (op.corretta) { bg='linear-gradient(135deg,#14532d,#166534)'; border='1.5px solid #22c55e'; tc='#fff'; }
                  else if (isConf) { bg='linear-gradient(135deg,#450a0a,#7f1d1d)'; border='1.5px solid #ef4444'; tc='#fff'; }
                  else { bg='rgba(0,0,0,0.18)'; border='1.5px solid rgba(255,255,255,0.04)'; tc='rgba(255,255,255,0.2)'; lc='rgba(255,255,255,0.1)'; }
                } else if (isConf) { bg='linear-gradient(135deg,#713f12,#92400e)'; border='1.5px solid #f59e0b'; tc='#fff'; anim='milBlink 0.9s ease infinite'; }
                else if (isSel) { bg='linear-gradient(135deg,#78350f,#92400e)'; border='1.5px solid #f59e0b'; tc='#fff'; }
                else if (mProf===i) { border='1.5px solid rgba(34,197,94,0.55)'; lc='#22c55e'; }
                return (
                  <button key={i} onClick={() => !elim && mFase==='scelta' && mSeleziona(i)}
                    style={{ textAlign:'left', padding:'12px 12px', borderRadius:16, border, background:bg, color:tc, fontFamily:'Montserrat, sans-serif', cursor:elim||mFase!=='scelta'?'default':'pointer', display:'flex', gap:8, alignItems:'flex-start', minHeight:60, transition:'background 0.3s,border 0.3s', animation:anim }}>
                    <span style={{ fontSize:11, fontWeight:900, color:lc, flexShrink:0, minWidth:14, paddingTop:1 }}>{L[i]}</span>
                    <span style={{ fontSize:11, fontWeight:600, lineHeight:1.55 }}>{elim?'':op.testo}</span>
                  </button>
                );
              })}
            </div>

            {/* Poll */}
            {mVotes && mFase==='scelta' && (
              <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:14, padding:'12px 14px', border:'0.5px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, color:'rgba(255,255,255,0.3)', marginBottom:8 }}>👥 LA CLASSE VOTA</div>
                {[0,1,2,3].filter(i => !mEliminate.includes(i)).map(i => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:'#fbbf24', width:14 }}>{['A','B','C','D'][i]}</span>
                    <div style={{ flex:1, height:9, background:'rgba(255,255,255,0.05)', borderRadius:5, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${mVotes[i]}%`, background:'linear-gradient(90deg,#3b82f6,#60a5fa)', borderRadius:5, transition:'width 0.9s ease' }} />
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.5)', minWidth:28, textAlign:'right' }}>{mVotes[i]}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Conferma — sempre visibile in fondo */}
          {mFase==='conferma' && (
            <div style={{ padding:'10px 16px 20px', flexShrink:0 }}>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={mCambia} style={{ flex:1, padding:'14px', borderRadius:16, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.55)', fontFamily:'Montserrat, sans-serif', fontWeight:700, fontSize:13, cursor:'pointer' }}>← Cambia</button>
                <button onClick={mConferma} style={{ flex:2, padding:'14px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#b45309,#d97706)', color:'#fff', fontFamily:'Montserrat, sans-serif', fontWeight:900, fontSize:14, cursor:'pointer' }}>✓ Risposta finale!</button>
              </div>
            </div>
          )}

          {/* Scaletta overlay */}
          {mScaletta && (
            <div onClick={() => setMScaletta(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.65)', zIndex:50, display:'flex', justifyContent:'flex-end' }}>
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
        </div>
      )}

      {/* ══ MILIONARIO GAME OVER ══ */}
      {screen === 'milionario' && mOver && (
        <div style={{ fontFamily:'Montserrat, sans-serif', background:'#0a0d18', minHeight:'100vh' }}>
          <Header />
          <div style={{ padding:'40px 16px 120px', maxWidth:500, margin:'0 auto', textAlign:'center', animation:'fadeUp 0.4s ease' }}>
            <div style={{ fontSize:64, marginBottom:14 }}>{mVinto ? '🎓' : livello >= 11 ? '🏆' : livello >= 6 ? '🎯' : '💀'}</div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:6 }}>{mVinto ? 'HAI VINTO!' : 'Sei arrivato a'}</div>
            <div style={{ fontSize:30, fontWeight:900, color:'#fbbf24', marginBottom:4 }}>{SCALETTA[Math.min(livello,15)-1].label}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:36 }}>Livello {Math.min(livello,15)} di 15</div>
            <button onClick={() => startMilionario(materiaTarget)} style={{ width:'100%', padding:'16px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#b45309,#d97706)', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Montserrat, sans-serif', marginBottom:10 }}>🎮 Rigioca</button>
            <button onClick={() => setScreen('selezione')} style={{ width:'100%', padding:'15px', borderRadius:16, border:'0.5px solid rgba(255,255,255,0.08)', background:'#111526', color:'rgba(255,255,255,0.45)', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Montserrat, sans-serif' }}>← Scegli altro gioco</button>
          </div>
          <Footer />
        </div>
      )}

      {/* ══ TRIVIA TRACK ══ */}
      {screen === 'trivia' && tFase !== 'over' && (
        <div style={{ position:'fixed', inset:0, zIndex:100, background:'radial-gradient(ellipse at 50% 30%,#1a0a3a 0%,#030509 80%)', fontFamily:'Montserrat, sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* TOP */}
          <div style={{ padding:'16px 20px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <button onClick={() => setScreen('selezione')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:13, cursor:'pointer', fontFamily:'Montserrat, sans-serif', padding:0 }}>← Esci</button>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:3, color:'rgba(180,130,255,0.6)', textTransform:'uppercase' }}>Trivia Track</div>
              <div style={{ fontSize:11, fontWeight:800, color:'#c4b5fd' }}>Round {tRound}/3 · {tQCount}/10</div>
            </div>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <span style={{ fontSize:14, fontWeight:900, color:'#fbbf24' }}>⭐ {tScore}</span>
              <div style={{ display:'flex', gap:2 }}>{[1,2,3].map(i => <span key={i} style={{ fontSize:14, opacity:i<=tVite?1:0.15 }}>❤️</span>)}</div>
            </div>
          </div>

          {/* Round flash overlay */}
          {tRoundFlash && (
            <div style={{ position:'absolute', inset:0, zIndex:20, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(10,4,30,0.93)' }}>
              <div style={{ textAlign:'center', animation:'fadeUp 0.25s ease' }}>
                <div style={{ fontSize:56, marginBottom:10 }}>⭐</div>
                <div style={{ fontSize:22, fontWeight:900, color:'#c4b5fd', marginBottom:6 }}>Round {tRound} completato!</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>
                  {tRound < 3 ? `Prossimo round in arrivo…` : ''}
                </div>
              </div>
            </div>
          )}

          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:(!materiaTarget && tFase==='spin') ? 'center' : 'flex-start', padding:'0 16px 20px', gap:14, overflowY:'auto' }}>

            {/* Ruota (solo tutte le materie) */}
            {!materiaTarget && (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: tFase==='spin' ? 18 : 8, transition:'gap 0.45s ease' }}>
                {/* Pointer */}
                <div style={{ fontSize: tFase==='spin' ? 28 : 18, color:'#fbbf24', animation:'pulseStar 1.2s ease infinite', transition:'font-size 0.45s ease', lineHeight:1 }}>▼</div>
                {/* Wheel con shrink animato */}
                <div style={{
                  width:  tFase==='spin' ? 300 : 150,
                  height: tFase==='spin' ? 300 : 150,
                  overflow:'hidden',
                  flexShrink:0,
                  position:'relative',
                  transition:'width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  <div style={{
                    position:'absolute', top:0, left:0,
                    transformOrigin:'top left',
                    transform:`scale(${tFase==='spin' ? 1 : 0.5})`,
                    transition:'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
                  }}>
                    <WheelSVG rotation={tRotazione} size={300} />
                  </div>
                </div>
                {tFase === 'spin' && (
                  <button onClick={tSpin} disabled={tSpinning}
                    style={{ padding:'14px 40px', borderRadius:20, border:'none', background:tSpinning?'rgba(255,255,255,0.06)':'linear-gradient(135deg,#6d28d9,#7c3aed)', color:'#fff', fontWeight:900, fontSize:16, cursor:tSpinning?'default':'pointer', fontFamily:'Montserrat, sans-serif', opacity:tSpinning?0.5:1, transition:'opacity 0.3s' }}>
                    {tSpinning ? 'Girando…' : '🎡 Gira!'}
                  </button>
                )}
                {tMateria && tFase==='question' && (
                  <div style={{ fontSize:12, fontWeight:700, color:tMateria.colore }}>
                    {tMateria.icona} {tMateria.titolo}
                  </div>
                )}
              </div>
            )}

            {/* Materia singola: mostra icona */}
            {materiaTarget && tFase==='question' && (
              <div style={{ display:'flex', alignItems:'center', gap:10, background:`${materiaTarget.colore}18`, border:`0.5px solid ${materiaTarget.colore}44`, borderRadius:14, padding:'8px 16px' }}>
                <span style={{ fontSize:20 }}>{materiaTarget.icona}</span>
                <span style={{ fontSize:12, fontWeight:700, color:materiaTarget.colore }}>{materiaTarget.titolo}</span>
              </div>
            )}

            {/* Domanda */}
            {tFase==='question' && tCarta && (
              <>
                <div key={tCarta.domanda} style={{ width:'100%', background:'linear-gradient(135deg,#1a0a3a,#0a0416)', border:'1px solid rgba(196,181,253,0.2)', borderRadius:20, padding:'20px 18px', textAlign:'center', animation:'fadeUp 0.2s ease' }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:'rgba(255,255,255,0.22)', marginBottom:10, fontWeight:700 }}>DOMANDA</div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#fff', lineHeight:1.72 }}>{tCarta.domanda}</div>
                </div>

                <div style={{ width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {tOpzioni.map((op, i) => {
                    const L = ['A','B','C','D'];
                    const answered = tRisposta !== null;
                    let bg='linear-gradient(135deg,#1a0a3a,#0a0416)', border='1.5px solid rgba(196,181,253,0.18)', tc='rgba(255,255,255,0.88)', lc='#c4b5fd';
                    if (answered) {
                      if (op.corretta) { bg='linear-gradient(135deg,#14532d,#166534)'; border='1.5px solid #22c55e'; tc='#fff'; }
                      else if (i === tSelezionata) { bg='linear-gradient(135deg,#450a0a,#7f1d1d)'; border='1.5px solid #ef4444'; tc='#fff'; }
                      else { bg='rgba(0,0,0,0.2)'; border='1.5px solid rgba(255,255,255,0.04)'; tc='rgba(255,255,255,0.25)'; lc='rgba(255,255,255,0.15)'; }
                    }
                    return (
                      <button key={i} onClick={() => !answered && tRispondi(i)}
                        style={{ textAlign:'left', padding:'12px 12px', borderRadius:16, border, background:bg, color:tc, fontFamily:'Montserrat, sans-serif', cursor:answered?'default':'pointer', display:'flex', gap:8, alignItems:'flex-start', minHeight:68, transition:'background 0.3s,border 0.3s' }}>
                        <span style={{ fontSize:11, fontWeight:900, color:lc, flexShrink:0, minWidth:14, paddingTop:1 }}>{L[i]}</span>
                        <span style={{ fontSize:11, fontWeight:600, lineHeight:1.55 }}>{op.testo}</span>
                      </button>
                    );
                  })}
                </div>

                {tRisposta && (
                  <div style={{ fontSize:13, fontWeight:700, color:tRisposta==='corretta'?'#22c55e':'#ef4444', animation:'fadeUp 0.2s ease' }}>
                    {tRisposta==='corretta' ? '✅ Corretto! +100' : '❌ Sbagliato!'}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ══ ABBINA DEFINIZIONE ══ */}
      {screen === 'abbina' && !aOver && (
        <div style={{ position:'fixed', inset:0, zIndex:100, background:'linear-gradient(180deg,#022c22 0%,#030e0a 100%)', fontFamily:'Montserrat, sans-serif', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* TOP */}
          <div style={{ padding:'16px 20px 10px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <button onClick={() => setScreen('selezione')} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.35)', fontSize:13, cursor:'pointer', fontFamily:'Montserrat, sans-serif', padding:0 }}>← Esci</button>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:3, color:'rgba(52,211,153,0.5)', textTransform:'uppercase' }}>Abbina</div>
              <div style={{ fontSize:15, fontWeight:900, color:'#34d399', letterSpacing:1 }}>LA DEFINIZIONE</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontSize:13, fontWeight:900, color:'#fbbf24' }}>⭐ {aScore}</span>
              <div style={{ display:'flex', gap:2 }}>{[1,2,3].map(i => <span key={i} style={{ fontSize:13, opacity:i<=aVite?1:0.15 }}>❤️</span>)}</div>
            </div>
          </div>

          {/* Round info */}
          <div style={{ textAlign:'center', flexShrink:0, marginBottom:10 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(52,211,153,0.08)', border:'0.5px solid rgba(52,211,153,0.25)', borderRadius:20, padding:'5px 18px' }}>
              <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)' }}>Round {aRound}</span>
              <span style={{ fontSize:11, fontWeight:700, color:'#34d399' }}>{aMatched.length}/{aPairs.length} coppie</span>
              {materiaTarget && <span style={{ fontSize:11 }}>{materiaTarget.icona}</span>}
            </div>
          </div>

          {/* Istruzione */}
          {aSelectedLeft === null && aMatched.length === 0 && (
            <div style={{ textAlign:'center', fontSize:10, color:'rgba(255,255,255,0.25)', marginBottom:6, flexShrink:0 }}>
              Tocca un termine → poi la definizione giusta
            </div>
          )}

          {/* Round flash */}
          {aRoundFlash && (
            <div style={{ position:'absolute', inset:0, zIndex:20, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(2,44,34,0.9)', animation:'fadeUp 0.2s ease' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:52, marginBottom:8 }}>✅</div>
                <div style={{ fontSize:18, fontWeight:900, color:'#34d399' }}>Round completato!</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:6 }}>Prossime coppie in arrivo…</div>
              </div>
            </div>
          )}

          {/* Due colonne */}
          <div style={{ flex:1, display:'flex', gap:10, padding:'0 14px 20px', overflowY:'auto' }}>
            {/* Colonna sinistra — Termini */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, color:'rgba(255,255,255,0.2)', textAlign:'center', marginBottom:2 }}>TERMINE</div>
              {aLeftOrder.map(id => {
                const pair = aPairs.find(p => p.id === id)!;
                const matched = aMatched.includes(id);
                const selected = aSelectedLeft === id;
                const wrong = aWrong === id;
                const correct = aCorrectFlash === id;
                let bg = 'rgba(255,255,255,0.04)';
                let border = '1px solid rgba(255,255,255,0.08)';
                let tc = 'rgba(255,255,255,0.75)';
                let opacity = matched ? 0 : 1;
                let transform = wrong ? 'translateX(-6px)' : 'none';
                if (selected) { bg = 'rgba(52,211,153,0.15)'; border = '1px solid #34d399'; tc = '#fff'; }
                if (correct) { bg = 'rgba(34,197,94,0.2)'; border = '1px solid #22c55e'; }
                if (wrong) { bg = 'rgba(239,68,68,0.15)'; border = '1px solid #ef4444'; }
                return (
                  <button key={id} onClick={() => !matched && aTapLeft(id)}
                    style={{ padding:'12px 10px', borderRadius:14, border, background:bg, color:tc, fontFamily:'Montserrat, sans-serif', fontWeight:600, fontSize:11, lineHeight:1.5, cursor:matched?'default':'pointer', textAlign:'left', transition:'all 0.2s', opacity, transform, pointerEvents:matched?'none':'auto' }}>
                    {pair.termine}
                  </button>
                );
              })}
            </div>

            {/* Colonna destra — Definizioni */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:8, fontWeight:700, letterSpacing:2, color:'rgba(255,255,255,0.2)', textAlign:'center', marginBottom:2 }}>DEFINIZIONE</div>
              {aRightOrder.map(id => {
                const pair = aPairs.find(p => p.id === id)!;
                const matched = aMatched.includes(id);
                const correct = aCorrectFlash === id;
                const wrong = aWrong !== null && aSelectedLeft === aWrong && id === aSelectedLeft; // not applicable to right
                let bg = 'rgba(255,255,255,0.04)';
                let border = '1px solid rgba(255,255,255,0.08)';
                let tc = 'rgba(255,255,255,0.75)';
                let opacity = matched ? 0 : 1;
                if (correct) { bg = 'rgba(34,197,94,0.2)'; border = '1px solid #22c55e'; tc = '#fff'; }
                return (
                  <button key={id} onClick={() => !matched && aTapRight(id)}
                    style={{ padding:'12px 10px', borderRadius:14, border, background:bg, color:tc, fontFamily:'Montserrat, sans-serif', fontWeight:500, fontSize:11, lineHeight:1.5, cursor:matched?'default':'pointer', textAlign:'left', transition:'all 0.25s', opacity, pointerEvents:matched?'none':'auto' }}>
                    {pair.definizione}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══ ABBINA GAME OVER ══ */}
      {screen === 'abbina' && aOver && (
        <div style={{ fontFamily:'Montserrat, sans-serif', background:'#0a0d18', minHeight:'100vh' }}>
          <Header />
          <div style={{ padding:'40px 16px 120px', maxWidth:500, margin:'0 auto', textAlign:'center', animation:'fadeUp 0.4s ease' }}>
            <div style={{ fontSize:60, marginBottom:14 }}>{aVinto ? '🎓' : aScore >= 400 ? '🏆' : aScore >= 200 ? '🎯' : '💀'}</div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:8 }}>{aVinto ? 'Hai abbinato tutto!' : 'Partita terminata'}</div>
            <div style={{ fontSize:44, fontWeight:900, color:'#34d399', marginBottom:4, letterSpacing:-2 }}>{aScore}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:36 }}>punti · {aRound - 1} round completati</div>
            <button onClick={() => startAbbina(materiaTarget)} style={{ width:'100%', padding:'16px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#065f46,#059669)', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Montserrat, sans-serif', marginBottom:10 }}>🔗 Rigioca</button>
            <button onClick={() => setScreen('selezione')} style={{ width:'100%', padding:'15px', borderRadius:16, border:'0.5px solid rgba(255,255,255,0.08)', background:'#111526', color:'rgba(255,255,255,0.45)', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Montserrat, sans-serif' }}>← Scegli altro gioco</button>
          </div>
          <Footer />
        </div>
      )}

      {/* ══ TRIVIA GAME OVER ══ */}
      {screen === 'trivia' && tFase === 'over' && (
        <div style={{ fontFamily:'Montserrat, sans-serif', background:'#0a0d18', minHeight:'100vh' }}>
          <Header />
          <div style={{ padding:'40px 16px 120px', maxWidth:500, margin:'0 auto', textAlign:'center', animation:'fadeUp 0.4s ease' }}>
            <div style={{ fontSize:60, marginBottom:14 }}>{tVinto ? '🎓' : tScore >= 500 ? '🏆' : tScore >= 200 ? '🎯' : '💀'}</div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:8 }}>{tVinto ? 'HAI VINTO!' : 'Partita terminata'}</div>
            <div style={{ fontSize:44, fontWeight:900, color:'#fbbf24', marginBottom:4, letterSpacing:-2 }}>{tScore}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginBottom:36 }}>{tVinto ? '3 round completati' : 'punti'}</div>
            <button onClick={() => startTrivia(materiaTarget)} style={{ width:'100%', padding:'16px', borderRadius:16, border:'none', background:'linear-gradient(135deg,#6d28d9,#7c3aed)', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Montserrat, sans-serif', marginBottom:10 }}>🎡 Rigioca</button>
            <button onClick={() => setScreen('selezione')} style={{ width:'100%', padding:'15px', borderRadius:16, border:'0.5px solid rgba(255,255,255,0.08)', background:'#111526', color:'rgba(255,255,255,0.45)', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Montserrat, sans-serif' }}>← Scegli altro gioco</button>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export default function GiocaPage() {
  return (
    <Suspense fallback={
      <div style={{ background:'#0a0d18', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:14, fontFamily:'Montserrat, sans-serif' }}>Caricamento...</div>
      </div>
    }>
      <GiocaContent />
    </Suspense>
  );
}
