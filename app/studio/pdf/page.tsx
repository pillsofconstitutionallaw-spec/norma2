'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Carta = {
  domanda: string;
  risposta: string;
};

type DomandaTest = {
  domanda: string;
  opzioni: string[];
  corretta: number;
};

type Fase =
  | 'upload'
  | 'caricamento'
  | 'flashcard-intro'
  | 'flashcard-studio'
  | 'flashcard-risultati'
  | 'test-generazione'
  | 'test-studio'
  | 'test-risultati';

export default function PdfStudioPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [fase, setFase] = useState<Fase>('upload');
  const [nomeFile, setNomeFile] = useState('');
  const [testoEstratto, setTestoEstratto] = useState('');
  const [errore, setErrore] = useState('');

  const [carte, setCarte] = useState<Carta[]>([]);
  const [indice, setIndice] = useState(0);
  const [girata, setGirata] = useState(false);
  const [sapute, setSapute] = useState(0);
  const [nonSapute, setNonSapute] = useState(0);
  const [daRipetere, setDaRipetere] = useState<Carta[]>([]);

  const [domande, setDomande] = useState<DomandaTest[]>([]);
  const [indiceDomanda, setIndiceDomanda] = useState(0);
  const [rispostaScelta, setRispostaScelta] = useState<number | null>(null);
  const [confermata, setConfermata] = useState(false);
  const [punteggio, setPunteggio] = useState(0);
  const [salvato, setSalvato] = useState(false);

  // AUTOSAVE
  useEffect(() => {
    const sessione = {
      fase, nomeFile, testoEstratto,
      carte, indice,
      sapute, nonSapute, daRipetere,
    };
    localStorage.setItem('studio_pdf_sessione', JSON.stringify(sessione));
  }, [fase, nomeFile, testoEstratto, carte, indice, sapute, nonSapute, daRipetere]);

  // RIPRISTINO SESSIONE
  useEffect(() => {
    try {
      const salvata = localStorage.getItem('studio_pdf_sessione');
      if (!salvata) return;
      const data = JSON.parse(salvata);
      if (data?.carte?.length > 0) {
        setFase(data.fase || 'upload');
        setNomeFile(data.nomeFile || '');
        setTestoEstratto(data.testoEstratto || '');
        setCarte(data.carte || []);
        const indiceValido =
          typeof data.indice === 'number' &&
          data.indice >= 0 &&
          data.indice < (data.carte || []).length
            ? data.indice
            : 0;
        setIndice(indiceValido);
        setGirata(false);
        setSapute(data.sapute || 0);
        setNonSapute(data.nonSapute || 0);
        setDaRipetere(data.daRipetere || []);
      }
    } catch {
      // ignora
    }
  }, []);

  // CARICA PDFJS DA CDN
  function caricaPdfjsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Errore caricamento pdfjs'));
      document.head.appendChild(script);
    });
  }

  // ESTRAZIONE PDF
  async function estraiTestoPDF(file: File): Promise<string> {
    await caricaPdfjsScript();

    const pdfjsLib = (window as any).pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let testo = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const pagina = await pdf.getPage(i);
      const contenuto = await pagina.getTextContent();
      testo += contenuto.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ') + '\n';
    }

    return testo.trim();
  }

  // GESTIONE FILE
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrore('Carica un file PDF valido');
      return;
    }

    e.target.value = '';
    setNomeFile(file.name);
    setErrore('');
    setSalvato(false);
    setTestoEstratto('');
    setCarte([]);
    setFase('caricamento');

    try {
      const testo = await estraiTestoPDF(file);

      if (!testo || testo.trim().length < 50) {
        setErrore('PDF senza testo leggibile (potrebbe essere una scansione immagine)');
        setFase('upload');
        return;
      }

      setTestoEstratto(testo);
      await generaFlashCard(testo);
    } catch (err: any) {
      console.error('[PDF] Errore:', err);
      setErrore('Errore caricamento PDF. Assicurati che il file non sia corrotto o protetto.');
      setFase('upload');
    }
  }

  // GENERA FLASHCARD
  async function generaFlashCard(testo: string) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const res = await fetch('/api/studio-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'flashcard', testo: testo.substring(0, 12000) }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      if (data.errore || !data.carte || !Array.isArray(data.carte)) {
        setErrore(data.errore || 'Errore generazione flashcard');
        setFase('upload');
        return;
      }

      setCarte(data.carte.sort(() => Math.random() - 0.5));
      setIndice(0);
      setGirata(false);
      setSapute(0);
      setNonSapute(0);
      setDaRipetere([]);
      setFase('flashcard-intro');
    } catch (err: any) {
      console.error('[Flashcard] Errore:', err);
      setErrore(err?.name === 'AbortError' ? 'Timeout AI. Riprova.' : 'Errore connessione al server.');
      setFase('upload');
    }
  }

  // GENERA TEST
  async function generaTest() {
    setFase('test-generazione');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const res = await fetch('/api/studio-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'test', testo: testoEstratto.substring(0, 12000) }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (data.errore || !data.domande || !Array.isArray(data.domande)) {
        setErrore(data.errore || 'Errore generazione test');
        setFase('flashcard-risultati');
        return;
      }

      setDomande(data.domande);
      setIndiceDomanda(0);
      setRispostaScelta(null);
      setConfermata(false);
      setPunteggio(0);
      setFase('test-studio');
    } catch (err: any) {
      console.error('[Test] Errore:', err);
      setErrore(err?.name === 'AbortError' ? 'Timeout AI. Riprova.' : 'Errore generazione test.');
      setFase('flashcard-risultati');
    }
  }

  // SALVA DECK
  function salvaDeck() {
    try {
      const decks = JSON.parse(localStorage.getItem('salvati_flashcard') || '[]');
      decks.push({
        id: Date.now(),
        titolo: nomeFile.replace('.pdf', ''),
        carte,
        data: new Date().toLocaleDateString('it-IT'),
      });
      localStorage.setItem('salvati_flashcard', JSON.stringify(decks));
      setSalvato(true);
    } catch {
      // ignora
    }
  }

  // LOGICA FLASHCARD
  function rispondi(sapevo: boolean) {
    if (sapevo) {
      setSapute((s) => s + 1);
    } else {
      setNonSapute((n) => n + 1);
      setDaRipetere((dr) => [...dr, carte[indice]]);
    }
    if (indice + 1 >= carte.length) {
      setFase('flashcard-risultati');
    } else {
      setIndice((i) => i + 1);
      setGirata(false);
    }
  }

  function riprova() {
    if (daRipetere.length === 0) {
      setIndice(0);
      setGirata(false);
      setSapute(0);
      setNonSapute(0);
      setFase('flashcard-intro');
      return;
    }
    setCarte([...daRipetere].sort(() => Math.random() - 0.5));
    setIndice(0);
    setGirata(false);
    setSapute(0);
    setNonSapute(0);
    setDaRipetere([]);
    setFase('flashcard-studio');
  }

  // LOGICA TEST
  function confermaRisposta() {
    if (rispostaScelta === null) return;
    setConfermata(true);
    if (rispostaScelta === domande[indiceDomanda].corretta) {
      setPunteggio((p) => p + 1);
    }
  }

  function prossimaDomanda() {
    if (indiceDomanda + 1 >= domande.length) {
      setFase('test-risultati');
    } else {
      setIndiceDomanda((i) => i + 1);
      setRispostaScelta(null);
      setConfermata(false);
    }
  }

  const progresso = carte.length > 0 ? ((indice + 1) / carte.length) * 100 : 0;

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.75); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />

        <main style={{ flex: 1, padding: '20px 16px 100px', maxWidth: 650, width: '100%', margin: '0 auto' }}>

          {/* UPLOAD */}
          {fase === 'upload' && (
            <>
              <button
                onClick={() => router.back()}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', marginBottom: 24, fontFamily: 'Montserrat, sans-serif' }}
              >
                ← Indietro
              </button>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>
                  Studio · PDF
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>
                  Carica il tuo PDF
                </div>
              </div>

              <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFile} />

              <div
                onClick={() => inputRef.current?.click()}
                style={{ background: '#111526', border: '1.5px dashed rgba(255,255,255,0.15)', borderRadius: 20, padding: '44px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}
              >
                <div style={{ fontSize: 44, marginBottom: 14 }}>📄</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Tocca per caricare</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Solo PDF con testo selezionabile</div>
              </div>

              {errore && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', color: '#ef4444', fontSize: 12, textAlign: 'center' }}>
                  {errore}
                </div>
              )}
            </>
          )}

          {/* CARICAMENTO */}
          {fase === 'caricamento' && (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ fontSize: 44, marginBottom: 20 }}>⚡</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Analisi documento...</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', animation: `pulse 1.2s ease-in-out ${i * 200}ms infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* FLASHCARD INTRO */}
          {fase === 'flashcard-intro' && (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🃏</div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{carte.length} flashcard pronte</h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>{nomeFile}</p>
              <button
                onClick={() => { setIndice(0); setGirata(false); setSapute(0); setNonSapute(0); setDaRipetere([]); setFase('flashcard-studio'); }}
                style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', marginBottom: 12 }}
              >
                ⚡ Inizia studio
              </button>
              <button
                onClick={salvaDeck}
                disabled={salvato}
                style={{ width: '100%', padding: '15px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: salvato ? 'rgba(255,255,255,0.3)' : '#fff', fontWeight: 700, fontSize: 14, cursor: salvato ? 'default' : 'pointer' }}
              >
                {salvato ? '✅ Salvato' : '💾 Salva deck'}
              </button>
            </div>
          )}

          {/* FLASHCARD STUDIO */}
          {fase === 'flashcard-studio' && carte[indice] && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <button onClick={() => setFase('flashcard-intro')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0 }}>← Esci</button>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{indice + 1} / {carte.length}</span>
              </div>

              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999, marginBottom: 20 }}>
                <div style={{ width: `${progresso}%`, height: 4, background: '#38bdf8', borderRadius: 999, transition: '0.3s' }} />
              </div>

              <div
                onClick={() => setGirata((g) => !g)}
                style={{ background: girata ? '#172033' : '#111526', borderRadius: 24, padding: '28px 24px', minHeight: 260, cursor: 'pointer', border: girata ? '1px solid #38bdf844' : '1px solid rgba(255,255,255,0.08)', marginBottom: 20, transition: 'background 0.3s, border-color 0.3s' }}
              >
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, color: girata ? '#38bdf8' : 'rgba(255,255,255,0.25)', marginBottom: 18 }}>
                  {girata ? 'RISPOSTA' : 'DOMANDA'}
                </div>
                <p style={{ color: '#fff', fontSize: girata ? 15 : 18, lineHeight: 1.8, fontWeight: girata ? 400 : 700, margin: 0 }}>
                  {girata ? carte[indice].risposta : carte[indice].domanda}
                </p>
                {!girata && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600, marginTop: 20 }}>Tocca per girare</div>}
              </div>

              {girata && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button onClick={() => rispondi(false)} style={{ padding: '16px', borderRadius: 16, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>❌ Non sapevo</button>
                  <button onClick={() => rispondi(true)} style={{ padding: '16px', borderRadius: 16, border: 'none', background: '#22c55e', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>✅ Sapevo</button>
                </div>
              )}
            </div>
          )}

          {/* FLASHCARD RISULTATI */}
          {fase === 'flashcard-risultati' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 18 }}>🏁</div>
              <h1 style={{ color: '#fff', marginBottom: 12 }}>Sessione completata</h1>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div style={{ background: '#111526', borderRadius: 16, padding: '18px' }}>
                  <div style={{ color: '#22c55e', fontSize: 28, fontWeight: 900 }}>{sapute}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>SAPUTE</div>
                </div>
                <div style={{ background: '#111526', borderRadius: 16, padding: '18px' }}>
                  <div style={{ color: '#ef4444', fontSize: 28, fontWeight: 900 }}>{nonSapute}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>ERRORI</div>
                </div>
              </div>
              {daRipetere.length > 0 && (
                <button onClick={riprova} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#111526', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>
                  🔄 Ripassa errori ({daRipetere.length})
                </button>
              )}
              <button onClick={generaTest} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #a855f7, #818cf8)', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>
                📝 Fai il test
              </button>
              <button onClick={() => { localStorage.removeItem('studio_pdf_sessione'); setFase('upload'); }} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#38bdf8', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                ← Nuovo PDF
              </button>
            </div>
          )}

          {/* TEST GENERAZIONE */}
          {fase === 'test-generazione' && (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ fontSize: 44, marginBottom: 20 }}>🧠</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Generazione test...</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7', animation: `pulse 1.2s ease-in-out ${i * 200}ms infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* TEST STUDIO */}
          {fase === 'test-studio' && domande[indiceDomanda] && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Domanda {indiceDomanda + 1} / {domande.length}</span>
                <span style={{ fontSize: 12, color: '#a855f7', fontWeight: 700 }}>{punteggio} punti</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999, marginBottom: 24 }}>
                <div style={{ width: `${((indiceDomanda + 1) / domande.length) * 100}%`, height: 4, background: '#a855f7', borderRadius: 999, transition: '0.3s' }} />
              </div>
              <div style={{ background: '#111526', borderRadius: 20, padding: '24px', marginBottom: 20 }}>
                <p style={{ color: '#fff', fontSize: 16, fontWeight: 700, lineHeight: 1.7, margin: 0 }}>{domande[indiceDomanda].domanda}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {domande[indiceDomanda].opzioni.map((opzione, i) => {
                  let bg = '#111526';
                  let border = '1px solid rgba(255,255,255,0.08)';
                  let color = '#fff';
                  if (confermata) {
                    if (i === domande[indiceDomanda].corretta) { bg = 'rgba(34,197,94,0.15)'; border = '1px solid #22c55e'; color = '#22c55e'; }
                    else if (i === rispostaScelta) { bg = 'rgba(239,68,68,0.15)'; border = '1px solid #ef4444'; color = '#ef4444'; }
                  } else if (i === rispostaScelta) {
                    bg = 'rgba(168,85,247,0.15)'; border = '1px solid #a855f7';
                  }
                  return (
                    <button key={i} onClick={() => !confermata && setRispostaScelta(i)}
                      style={{ padding: '14px 18px', borderRadius: 14, border, background: bg, color, fontWeight: 600, fontSize: 14, cursor: confermata ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Montserrat, sans-serif' }}>
                      {opzione}
                    </button>
                  );
                })}
              </div>
              {!confermata ? (
                <button onClick={confermaRisposta} disabled={rispostaScelta === null}
                  style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: rispostaScelta !== null ? '#a855f7' : 'rgba(168,85,247,0.2)', color: '#fff', fontWeight: 800, cursor: rispostaScelta !== null ? 'pointer' : 'default', transition: 'background 0.2s' }}>
                  Conferma
                </button>
              ) : (
                <button onClick={prossimaDomanda}
                  style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#a855f7', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                  {indiceDomanda + 1 >= domande.length ? 'Vedi risultati' : 'Prossima →'}
                </button>
              )}
            </div>
          )}

          {/* TEST RISULTATI */}
          {fase === 'test-risultati' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 18 }}>🎯</div>
              <h1 style={{ color: '#fff', marginBottom: 8 }}>Test completato!</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontSize: 14 }}>
                Hai risposto correttamente a {punteggio} domande su {domande.length}
              </p>
              <div style={{ background: '#111526', borderRadius: 20, padding: '28px', marginBottom: 24 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: punteggio / domande.length >= 0.6 ? '#22c55e' : '#ef4444' }}>
                  {Math.round((punteggio / domande.length) * 100)}%
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {punteggio / domande.length >= 0.6 ? 'Ottimo risultato!' : 'Continua a studiare'}
                </div>
              </div>
              <button onClick={generaTest} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #a855f7, #818cf8)', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>
                🔄 Rifai il test
              </button>
              <button onClick={() => setFase('flashcard-intro')} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#38bdf8', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>
                ← Torna alle flashcard
              </button>
              <button onClick={() => { localStorage.removeItem('studio_pdf_sessione'); setFase('upload'); }} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#111526', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                Carica nuovo PDF
              </button>
            </div>
          )}

        </main>

        <Footer />
      </div>
    </>
  );
}