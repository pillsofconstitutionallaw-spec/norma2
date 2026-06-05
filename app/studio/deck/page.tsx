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
import { carte as carteUE, meta as metaUE } from '@/src/data/cards/diritto-ue';

type Carta = { domanda: string; risposta: string };
type Materia = { id: string; titolo: string; colore: string; bg: string; icona: string; carte: Carta[] };
type Fase = 'studio' | 'risultati';

const MATERIE: Materia[] = [
  { id: 'diritto-privato',              titolo: metaPrivato.titolo,        colore: metaPrivato.colore,        bg: metaPrivato.bg,        icona: metaPrivato.icona,        carte: cartePrivato },
  { id: 'diritto-costituzionale',       titolo: metaCostituzionale.titolo, colore: metaCostituzionale.colore, bg: metaCostituzionale.bg, icona: metaCostituzionale.icona, carte: carteCostituzionale },
  { id: 'diritto-internazionale',       titolo: metaInternazionale.titolo, colore: metaInternazionale.colore, bg: metaInternazionale.bg, icona: metaInternazionale.icona, carte: carteInternazionale },
  { id: 'diritto-internazionale-privato', titolo: metaIntPrivato.titolo,   colore: metaIntPrivato.colore,     bg: metaIntPrivato.bg,     icona: metaIntPrivato.icona,     carte: carteIntPrivato },
  { id: 'diritto-romano',               titolo: metaRomano.titolo,         colore: metaRomano.colore,         bg: metaRomano.bg,         icona: metaRomano.icona,         carte: carteRomano },
  { id: 'diritto-del-lavoro',           titolo: metaLavoro.titolo,         colore: metaLavoro.colore,         bg: metaLavoro.bg,         icona: metaLavoro.icona,         carte: carteLavoro },
  { id: 'diritto-ue',                   titolo: metaUE.titolo,             colore: metaUE.colore,             bg: metaUE.bg,             icona: metaUE.icona,             carte: carteUE },
];

const STORAGE_KEY = 'norma_flashcard_segnalibro';

function salvaSessione(materiaId: string, indice: number, sapute: number, nonSapute: number, daRipetere: Carta[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ materiaId, indice, sapute, nonSapute, daRipetere })); } catch {}
}
function caricaSessione() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function cancellaSessione() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
function mescola<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function DeckContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fase, setFase] = useState<Fase>('studio');
  const [materia, setMateria] = useState<Materia | null>(null);
  const [carte, setCarte] = useState<Carta[]>([]);
  const [indice, setIndice] = useState(0);
  const [girata, setGirata] = useState(false);
  const [sapute, setSapute] = useState(0);
  const [nonSapute, setNonSapute] = useState(0);
  const [daRipetere, setDaRipetere] = useState<Carta[]>([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [sessioneSalvata, setSessioneSalvata] = useState<any>(null);

  useEffect(() => {
    const slug = searchParams.get('materia');
    if (!slug) { router.replace('/studio'); return; }
    const m = MATERIE.find(x => x.id === slug);
    if (!m) { router.replace('/studio'); return; }

    const s = caricaSessione();
    if (s?.materiaId === slug && s?.indice > 0) {
      setSessioneSalvata(s);
      setMateria(m);
      setCarte([...m.carte]);
    } else {
      avvia(m, 0, 0, 0, []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function avvia(m: Materia, fromIndice = 0, fromSapute = 0, fromNonSapute = 0, fromDaRipetere: Carta[] = []) {
    setMateria(m);
    setCarte(fromIndice === 0 ? mescola(m.carte) : [...m.carte]);
    setIndice(fromIndice); setSapute(fromSapute); setNonSapute(fromNonSapute);
    setDaRipetere(fromDaRipetere); setGirata(false);
    setSessioneSalvata(null);
    setFase('studio');
  }

  function riprendiSessione() {
    if (!sessioneSalvata || !materia) return;
    const s = sessioneSalvata;
    setCarte([...materia.carte]);
    setIndice(s.indice); setSapute(s.sapute); setNonSapute(s.nonSapute);
    setDaRipetere(s.daRipetere); setGirata(false);
    setSessioneSalvata(null);
  }

  function rispondi(sapevo: boolean) {
    const ns = sapevo ? sapute + 1 : sapute;
    const nn = sapevo ? nonSapute : nonSapute + 1;
    const dr = sapevo ? daRipetere : [...daRipetere, carte[indice]];
    if (sapevo) setSapute(ns); else { setNonSapute(nn); setDaRipetere(dr); }
    if (indice + 1 >= carte.length) {
      cancellaSessione(); setFase('risultati');
    } else {
      const ni = indice + 1;
      setIndice(ni); setGirata(false);
      if (materia) salvaSessione(materia.id, ni, ns, nn, dr);
    }
  }

  function salvaManualmente() {
    if (materia) {
      salvaSessione(materia.id, indice, sapute, nonSapute, daRipetere);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2200);
    }
  }

  function riprova() {
    if (!materia) return;
    setCarte(mescola(daRipetere));
    setIndice(0); setSapute(0); setNonSapute(0); setDaRipetere([]); setGirata(false);
    setFase('studio');
  }

  const colore = materia?.colore ?? '#38bdf8';
  const progresso = carte.length > 0 ? (indice / carte.length) * 100 : 0;

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        {toastVisible && (
          <div style={{ position:'fixed', bottom:100, left:'50%', transform:'translateX(-50%)', background:'#1e293b', border:'0.5px solid rgba(56,189,248,0.5)', borderRadius:14, padding:'11px 20px', fontSize:12, fontWeight:800, color:'#38bdf8', zIndex:9999, whiteSpace:'nowrap', animation:'toastIn 0.25s ease' }}>
            🔖 Segnalibro salvato!
          </div>
        )}

        <div style={{ padding: '20px 16px 120px', maxWidth: 650, margin: '0 auto' }}>

          {/* Banner riprendi sessione */}
          {sessioneSalvata && materia && (
            <div style={{ background:'#111526', border:`0.5px solid ${colore}55`, borderRadius:16, padding:'14px 16px', marginBottom:20, animation:'fadeUp 0.3s ease' }}>
              <div style={{ fontSize:11, fontWeight:800, color:'#fff', marginBottom:4 }}>🔖 Sessione salvata</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', marginBottom:12 }}>
                {materia.icona} {materia.titolo} · carta {sessioneSalvata.indice + 1} di {materia.carte.length}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={riprendiSessione} style={{ flex:1, padding:'10px', borderRadius:12, border:'none', background:`linear-gradient(135deg,${colore},#818cf8)`, color:'#fff', fontWeight:800, fontSize:12, cursor:'pointer', fontFamily:'Montserrat, sans-serif' }}>
                  ▶ Riprendi
                </button>
                <button onClick={() => { cancellaSessione(); avvia(materia!); }} style={{ padding:'10px 14px', borderRadius:12, border:'0.5px solid rgba(255,255,255,0.1)', background:'transparent', color:'rgba(255,255,255,0.4)', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Montserrat, sans-serif' }}>
                  Ricomincia
                </button>
              </div>
            </div>
          )}

          {/* ══ STUDIO ══ */}
          {fase === 'studio' && materia && carte.length > 0 && !sessioneSalvata && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <button onClick={() => router.back()} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', fontSize:13, cursor:'pointer', padding:0, fontFamily:'Montserrat, sans-serif' }}>← Indietro</button>
                <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.5)' }}>{indice + 1} / {carte.length}</span>
                <button onClick={salvaManualmente} style={{ background:'none', border:'none', cursor:'pointer', padding:4, fontSize:22, lineHeight:1, opacity:toastVisible?1:0.45, transition:'opacity 0.2s' }}>🔖</button>
              </div>
              <div style={{ background:'rgba(255,255,255,0.07)', borderRadius:4, height:4, marginBottom:20 }}>
                <div style={{ background:colore, height:4, borderRadius:4, width:`${progresso}%`, transition:'width 0.3s' }} />
              </div>
              <div
                onClick={() => setGirata(g => !g)}
                style={{ background:girata?'#0d1f35':'#111526', border:girata?`1px solid ${colore}55`:'1px solid rgba(255,255,255,0.08)', borderRadius:24, padding:'32px 22px', height:260, maxHeight:260, overflowY:'auto', cursor:'pointer', marginBottom:20, transition:'background 0.3s,border 0.3s', display:'flex', flexDirection:'column', justifyContent:'flex-start' }}
              >
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:girata?colore:'rgba(255,255,255,0.25)', marginBottom:16, flexShrink:0 }}>
                  {girata ? 'RISPOSTA' : 'DOMANDA'}
                </div>
                <div style={{ fontSize:girata?14:16, fontWeight:girata?400:700, color:'#fff', lineHeight:1.85 }}>
                  {girata ? carte[indice].risposta : carte[indice].domanda}
                </div>
                {!girata && <div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:20, flexShrink:0 }}>Tocca per vedere la risposta</div>}
              </div>
              {girata && (
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={() => rispondi(false)} style={{ flex:1, height:56, borderRadius:16, border:'none', background:'#ef4444', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Montserrat, sans-serif' }}>✗ Non sapevo</button>
                  <button onClick={() => rispondi(true)} style={{ flex:1, height:56, borderRadius:16, border:'none', background:'#22c55e', color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', fontFamily:'Montserrat, sans-serif' }}>✓ Sapevo</button>
                </div>
              )}
            </div>
          )}

          {/* ══ RISULTATI ══ */}
          {fase === 'risultati' && materia && (
            <div style={{ textAlign:'center', paddingTop:20, animation:'fadeUp 0.4s ease' }}>
              <div style={{ fontSize:52, marginBottom:16 }}>{sapute >= nonSapute ? '🎉' : '💪'}</div>
              <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:6 }}>Sessione completata!</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:28 }}>
                Hai risposto correttamente al {Math.round((sapute / Math.max(sapute + nonSapute, 1)) * 100)}% delle carte
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:28 }}>
                <div style={{ background:'#111526', borderRadius:16, padding:'20px 10px', border:'0.5px solid rgba(34,197,94,0.3)' }}>
                  <div style={{ fontSize:36, fontWeight:900, color:'#22c55e' }}>{sapute}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:4 }}>Sapevo</div>
                </div>
                <div style={{ background:'#111526', borderRadius:16, padding:'20px 10px', border:'0.5px solid rgba(239,68,68,0.3)' }}>
                  <div style={{ fontSize:36, fontWeight:900, color:'#ef4444' }}>{nonSapute}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:4 }}>Non sapevo</div>
                </div>
              </div>
              {daRipetere.length > 0 && (
                <button onClick={riprova} style={{ width:'100%', padding:'15px', borderRadius:16, border:'none', background:`linear-gradient(135deg,${colore},#818cf8)`, color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer', fontFamily:'Montserrat, sans-serif', marginBottom:10 }}>
                  🔄 Ripassa quelle sbagliate ({daRipetere.length})
                </button>
              )}
              <button onClick={() => avvia(materia!)} style={{ width:'100%', padding:'15px', borderRadius:16, border:'none', background:`linear-gradient(135deg,${colore},#818cf8)`, color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer', fontFamily:'Montserrat, sans-serif', marginBottom:10 }}>
                🔁 Ricomincia
              </button>
              <button onClick={() => router.push('/studio/gioca')} style={{ width:'100%', padding:'15px', borderRadius:16, border:'0.5px solid rgba(52,211,153,0.3)', background:'rgba(52,211,153,0.06)', color:'#34d399', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Montserrat, sans-serif', marginBottom:10 }}>
                🎮 Impara Giocando
              </button>
              <button onClick={() => router.back()} style={{ width:'100%', padding:'15px', borderRadius:16, border:'0.5px solid rgba(255,255,255,0.08)', background:'#111526', color:'rgba(255,255,255,0.4)', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Montserrat, sans-serif' }}>
                ← Torna alle materie
              </button>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}

export default function DeckPage() {
  return (
    <Suspense fallback={
      <div style={{ background:'#0a0d18', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:14, fontFamily:'Montserrat, sans-serif' }}>Caricamento...</div>
      </div>
    }>
      <DeckContent />
    </Suspense>
  );
}
