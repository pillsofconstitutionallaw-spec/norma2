'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TEMPO = 60;
const TOTALE = 30;

const nomiMaterie: Record<string, string> = {
  'costituzionale': 'Diritto Costituzionale',
  'civile': 'Diritto Civile',
  'penale': 'Diritto Penale',
  'amministrativo': 'Diritto Amministrativo',
  'lavoro': 'Diritto del Lavoro',
  'commerciale': 'Diritto Commerciale',
  'europeo': "Diritto dell'Unione Europea",
  'processuale-civile': 'Diritto Processuale Civile',
  'processuale-penale': 'Diritto Processuale Penale',
  'internazionale': 'Diritto Internazionale',
  'romano': 'Istituzioni di Diritto Romano',
  'filosofia': 'Filosofia del Diritto',
};

interface Domanda {
  testo: string;
  opzioni: string[];
  corretta: number;
  spiegazione: string;
}

export default function TestMateriaPage() {
  const params = useParams();
  const router = useRouter();
  const materia = params?.materia as string;
  const nomeMateria = nomiMaterie[materia] || materia;
  const [domande, setDomande] = useState<Domanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(false);
  const [indice, setIndice] = useState(0);
  const [risposte, setRisposte] = useState<Record<number, number>>({});
  const [timer, setTimer] = useState(TEMPO);
  const [scaduto, setScaduto] = useState(false);
  const [fine, setFine] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    async function genera() {
      setLoading(true);
      setErrore(false);
      try {
        const res = await fetch('/api/spiega', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo: 'test_materia', materia: nomeMateria, numero: TOTALE }),
        });
        const data = await res.json();
        if (data.domande && data.domande.length > 0) setDomande(data.domande);
        else setErrore(true);
      } catch { setErrore(true); }
      setLoading(false);
    }
    if (materia) genera();
  }, [materia]);

  useEffect(() => {
    if (loading || fine || domande.length === 0) return;
    setTimer(TEMPO);
    setScaduto(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(t => { if (t <= 1) { clearInterval(timerRef.current); setScaduto(true); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [indice, loading, fine, domande.length]);

  function rispondi(idx: number) {
    if (risposte[indice] !== undefined || scaduto) return;
    clearInterval(timerRef.current);
    setRisposte(prev => ({ ...prev, [indice]: idx }));
  }
  function avanti() { if (indice < domande.length - 1) setIndice(i => i + 1); else setFine(true); }
  function indietro() { if (indice > 0) setIndice(i => i - 1); }

  const risposta = risposte[indice];
  const haRisposto = risposta !== undefined;
  const domanda = domande[indice];
  const timerColore = timer <= 10 ? '#f87171' : timer <= 20 ? '#fbbf24' : '#8fd3ff';
  const punteggio = Object.entries(risposte).filter(([i, r]) => domande[parseInt(i)]?.corretta === r).length;
  const percentuale = domande.length > 0 ? Math.round((punteggio / domande.length) * 100) : 0;

  const Dots = () => (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#8fd3ff', animation: `b 1s infinite ${i*0.15}s` }} />)}
      <style>{`@keyframes b{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
      <Header />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: 20, padding: '0 32px', textAlign: 'center' }}>
        <Dots />
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>L'AI sta generando {TOTALE} domande su {nomeMateria}. Attendi qualche secondo.</div>
      </div>
      <Footer />
    </div>
  );

  if (errore) return (
    <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
      <Header />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: 16, padding: '0 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>Non è stato possibile generare le domande. Riprova.</div>
        <button onClick={() => window.location.reload()} style={{ padding: '12px 28px', borderRadius: 99, background: '#8fd3ff', color: '#041428', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer' }}>Riprova</button>
      </div>
      <Footer />
    </div>
  );

  if (fine) return (
    <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
      <Header />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 140px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 56, fontWeight: 900, color: percentuale >= 60 ? '#4ade80' : '#f87171', marginBottom: 8 }}>{percentuale}%</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{punteggio} su {domande.length} risposte corrette</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{nomeMateria}</div>
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>Riepilogo domande</div>
        {domande.map((d, i) => {
          const ris = risposte[i];
          const giusta = ris === d.corretta;
          const saltata = ris === undefined;
          return (
            <div key={i} style={{ background: '#111526', borderRadius: 14, border: `0.5px solid ${giusta ? 'rgba(74,222,128,0.2)' : saltata ? 'rgba(255,255,255,0.05)' : 'rgba(248,113,113,0.2)'}`, padding: '14px 16px', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: giusta ? 'rgba(74,222,128,0.15)' : saltata ? 'rgba(255,255,255,0.06)' : 'rgba(248,113,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>{giusta ? '✓' : saltata ? '–' : '✗'}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>{d.testo}</div>
              </div>
              {!giusta && (<>{ris !== undefined && <div style={{ fontSize: 11, color: '#f87171', marginBottom: 4, paddingLeft: 28 }}>Risposta data: {d.opzioni[ris]}</div>}<div style={{ fontSize: 11, color: '#4ade80', marginBottom: 8, paddingLeft: 28 }}>Risposta corretta: {d.opzioni[d.corretta]}</div></>)}
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, paddingLeft: 28, paddingTop: 6, borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>{d.spiegazione}</div>
            </div>
          );
        })}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={() => router.push('/test')} style={{ flex: 1, padding: '14px', borderRadius: 14, background: '#111526', border: '0.5px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Cambia materia</button>
          <button onClick={() => window.location.reload()} style={{ flex: 1, padding: '14px', borderRadius: 14, background: '#8fd3ff', color: '#041428', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer' }}>Rifai il test</button>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
      <Header />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 140px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={() => router.push('/test')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '6px 12px', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>← Esci</button>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase' }}>{nomeMateria}</div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${timerColore}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: timerColore, transition: 'color 0.3s, border-color 0.3s' }}>{timer}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 99, height: 3, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#8fd3ff', borderRadius: 99, width: `${((indice + 1) / domande.length) * 100}%`, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Domanda {indice + 1} di {domande.length}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 1 }}>Generata da AI</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.5, marginBottom: 20 }}>{domanda?.testo}</div>
        {domanda?.opzioni.map((op, i) => {
          const selezionata = risposta === i;
          const corretta = domanda.corretta === i;
          let bg = '#111526', border = '0.5px solid rgba(255,255,255,0.06)', colore = 'rgba(255,255,255,0.7)', letterBg = 'rgba(255,255,255,0.06)', letterColor = 'rgba(255,255,255,0.4)';
          if (haRisposto || scaduto) {
            if (corretta) { bg = 'rgba(74,222,128,0.08)'; border = '0.5px solid rgba(74,222,128,0.3)'; colore = '#4ade80'; letterBg = 'rgba(74,222,128,0.15)'; letterColor = '#4ade80'; }
            else if (selezionata) { bg = 'rgba(248,113,113,0.08)'; border = '0.5px solid rgba(248,113,113,0.3)'; colore = '#f87171'; letterBg = 'rgba(248,113,113,0.15)'; letterColor = '#f87171'; }
          } else if (selezionata) { bg = 'rgba(143,211,255,0.08)'; border = '0.5px solid rgba(143,211,255,0.3)'; colore = '#8fd3ff'; letterBg = 'rgba(143,211,255,0.15)'; letterColor = '#8fd3ff'; }
          return (
            <button key={i} onClick={() => rispondi(i)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 14px', borderRadius: 12, background: bg, border, cursor: (haRisposto || scaduto) ? 'default' : 'pointer', marginBottom: 8, textAlign: 'left' }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: letterBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: letterColor, flexShrink: 0 }}>{['A','B','C','D'][i]}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: colore, lineHeight: 1.4 }}>{op}</span>
            </button>
          );
        })}
        {(haRisposto || scaduto) && domanda?.spiegazione && (
          <div style={{ background: '#080f1e', borderRadius: 12, padding: '14px 16px', marginTop: 4, marginBottom: 16, borderLeft: `3px solid ${risposte[indice] === domanda.corretta ? '#4ade80' : '#f87171'}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: risposte[indice] === domanda.corretta ? '#4ade80' : '#f87171', textTransform: 'uppercase', marginBottom: 8 }}>{scaduto ? 'Tempo scaduto' : risposte[indice] === domanda.corretta ? 'Risposta corretta' : 'Risposta errata'}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>{domanda.spiegazione}</div>
          </div>
        )}
        {(haRisposto || scaduto) && (
          <div style={{ display: 'flex', gap: 10 }}>
            {indice > 0 && <button onClick={indietro} style={{ flex: 1, padding: '13px', borderRadius: 12, background: '#111526', border: '0.5px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>← Indietro</button>}
            <button onClick={avanti} style={{ flex: 2, padding: '13px', borderRadius: 12, background: '#8fd3ff', color: '#041428', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer' }}>{indice < domande.length - 1 ? 'Avanti →' : 'Vedi risultati →'}</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
