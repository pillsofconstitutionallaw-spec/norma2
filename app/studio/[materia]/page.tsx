'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

type Carta = { domanda: string; risposta: string };
type DomandaTest = { domanda: string; opzioni: string[]; corretta: number };
type Fase =
  | 'upload'
  | 'caricamento'
  | 'flashcard-intro'
  | 'flashcard-studio'
  | 'flashcard-risultati'
  | 'test-generazione'
  | 'test-studio'
  | 'test-risultati';

const BOOKMARK_KEY = 'deck_segnalibro';

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
  const [mostraRiprendi, setMostraRiprendi] = useState(false);
  const [bookmarkIndice, setBookmarkIndice] = useState<number | null>(null);

  // Controlla segnalibro salvato all'avvio della sessione flash card
  function controllaSegnalibro(nomefile: string) {
    try {
      const saved = localStorage.getItem(BOOKMARK_KEY);
      if (!saved) return;
      const bk = JSON.parse(saved);
      if (bk.nomeFile === nomefile && bk.indice > 0) {
        setBookmarkIndice(bk.indice);
        setMostraRiprendi(true);
      }
    } catch {}
  }

  // Salva segnalibro ogni volta che cambia la carta
  useEffect(() => {
    if (fase === 'flashcard-studio' && nomeFile) {
      try {
        localStorage.setItem(BOOKMARK_KEY, JSON.stringify({
          nomeFile,
          indice,
          totale: carte.length,
          timestamp: Date.now(),
        }));
      } catch {}
    }
  }, [indice, fase]);

  // Cancella segnalibro a fine sessione
  function cancellaSegnalibro() {
    try { localStorage.removeItem(BOOKMARK_KEY); } catch {}
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { setErrore('Carica un file PDF'); return; }
    setNomeFile(file.name);
    setErrore('');
    setFase('caricamento');
    try {
      const testo = await estraiTestoPDF(file);
      if (!testo || testo.trim().length < 50) {
        setErrore('Il PDF non contiene testo leggibile. Usa un PDF non scansionato.');
        setFase('upload');
        return;
      }
      setTestoEstratto(testo);
      await generaFlashCard(testo, file.name);
    } catch (err) {
      console.error(err);
      setErrore('Errore nel caricamento. Riprova.');
      setFase('upload');
    }
  }

  async function estraiTestoPDF(file: File): Promise<string> {
    const pdfjsLib = (await import('pdfjs-dist')) as any;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let testo = '';
    const maxPagine = pdf.numPages;
    for (let i = 1; i <= maxPagine; i++) {
      const pagina = await pdf.getPage(i);
      const contenuto = await pagina.getTextContent();
      testo += contenuto.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return testo.trim();
  }

  async function generaFlashCard(testo: string, nomefile?: string) {
    const res = await fetch('/api/studio-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'flashcard', testo: testo.substring(0, 12000) }),
    });
    const data = await res.json();
    if (data.errore || !data.carte) {
      setErrore(data.errore || 'Errore nella generazione. Riprova.');
      setFase('upload');
      return;
    }
    const carteShuffled = data.carte.sort(() => Math.random() - 0.5);
    setCarte(carteShuffled);
    if (nomefile) controllaSegnalibro(nomefile);
    setFase('flashcard-intro');
  }

  async function generaTest() {
    setFase('test-generazione');
    try {
      const res = await fetch('/api/studio-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'test', testo: testoEstratto.substring(0, 12000) }),
      });
      const data = await res.json();
      if (data.errore || !data.domande) {
        setErrore(data.errore || 'Errore generazione test.');
        setFase('flashcard-risultati');
        return;
      }
      setDomande(data.domande);
      setIndiceDomanda(0); setRispostaScelta(null); setConfermata(false); setPunteggio(0);
      setFase('test-studio');
    } catch {
      setErrore('Errore nella generazione del test. Riprova.');
      setFase('flashcard-risultati');
    }
  }

  function iniziaStudio(fromBookmark = false) {
    setIndice(fromBookmark && bookmarkIndice !== null ? bookmarkIndice : 0);
    setGirata(false);
    setSapute(0);
    setNonSapute(0);
    setDaRipetere([]);
    setMostraRiprendi(false);
    setFase('flashcard-studio');
  }

  function rispondi(sapevo: boolean) {
    if (sapevo) setSapute(s => s + 1);
    else { setNonSapute(n => n + 1); setDaRipetere(dr => [...dr, carte[indice]]); }
    if (indice + 1 >= carte.length) {
      cancellaSegnalibro();
      setFase('flashcard-risultati');
    } else {
      setIndice(i => i + 1);
      setGirata(false);
    }
  }

  function riprova() {
    cancellaSegnalibro();
    setCarte([...daRipetere].sort(() => Math.random() - 0.5));
    setIndice(0); setGirata(false); setSapute(0); setNonSapute(0); setDaRipetere([]);
    setFase('flashcard-studio');
  }

  function confermaRisposta() {
    if (rispostaScelta === null) return;
    setConfermata(true);
    if (rispostaScelta === domande[indiceDomanda].corretta) setPunteggio(p => p + 1);
  }

  function prossimaDomanda() {
    if (indiceDomanda + 1 >= domande.length) setFase('test-risultati');
    else { setIndiceDomanda(i => i + 1); setRispostaScelta(null); setConfermata(false); }
  }

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
      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '20px 16px', paddingBottom: fase === 'flashcard-studio' ? 140 : 100 }}>

          {/* ── UPLOAD ── */}
          {fase === 'upload' && (
            <>
              <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif', marginBottom: 24 }}>
                ← Indietro
              </button>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Studio · PDF</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Carica il tuo documento</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
                  L'AI analizza il PDF e genera flash card e test personalizzati basati sul tuo materiale
                </div>
              </div>
              <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFile} />
              <div onClick={() => inputRef.current?.click()} style={{ background: '#111526', border: '1.5px dashed rgba(255,255,255,0.15)', borderRadius: 20, padding: '44px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>📄</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Tocca per caricare il PDF</div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>Appunti · Dispense · Sentenze · Manuali</div>
              </div>
              {errore && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', color: '#ef4444', fontSize: 12, textAlign: 'center' }}>
                  {errore}
                </div>
              )}
            </>
          )}

          {/* ── CARICAMENTO ── */}
          {fase === 'caricamento' && (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ fontSize: 44, marginBottom: 20 }}>⚡</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>L'AI sta analizzando il documento</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>{nomeFile}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>Estrazione testo · Generazione flash card personalizzate</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', animation: `pulse 1.2s ease-in-out ${i * 200}ms infinite` }} />)}
              </div>
            </div>
          )}

          {/* ── FLASHCARD INTRO ── */}
          {fase === 'flashcard-intro' && (
            <>
              <button onClick={() => setFase('upload')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif', marginBottom: 24 }}>← Indietro</button>
              <div style={{ background: '#111526', borderRadius: 24, border: '0.5px solid rgba(56,189,248,0.3)', padding: '28px 20px', marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Flash card pronte!</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>{nomeFile}</div>
                <div style={{ display: 'inline-block', background: 'rgba(56,189,248,0.12)', border: '0.5px solid rgba(56,189,248,0.25)', borderRadius: 8, padding: '4px 14px', fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>
                  {carte.length} carte generate dal tuo documento
                </div>
              </div>

              {/* Popup riprendi da segnalibro */}
              {mostraRiprendi && bookmarkIndice !== null && (
                <div style={{ background: 'rgba(56,189,248,0.08)', border: '0.5px solid rgba(56,189,248,0.3)', borderRadius: 16, padding: '16px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8', marginBottom: 6 }}>🔖 Hai un segnalibro salvato</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
                    Eri alla carta {bookmarkIndice + 1} di {carte.length}. Vuoi riprendere da lì?
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => iniziaStudio(true)} style={{ flex: 1, padding: '10px', borderRadius: 12, border: 'none', background: '#38bdf8', color: '#0a0d18', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                      Riprendi
                    </button>
                    <button onClick={() => iniziaStudio(false)} style={{ flex: 1, padding: '10px', borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                      Ricomincia
                    </button>
                  </div>
                </div>
              )}

              {!mostraRiprendi && (
                <button onClick={() => iniziaStudio(false)} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                  ⚡ Inizia a studiare
                </button>
              )}
            </>
          )}

          {/* ── FLASHCARD STUDIO ── */}
          {fase === 'flashcard-studio' && carte.length > 0 && (
            <>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <button onClick={() => setFase('flashcard-intro')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif' }}>← Esci</button>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{indice + 1} / {carte.length}</div>
                {/* Segnalibro visibile */}
                <div style={{ fontSize: 18, color: '#38bdf8' }} title="Posizione salvata automaticamente">🔖</div>
              </div>

              {/* Barra progresso */}
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 4, marginBottom: 24 }}>
                <div style={{ background: '#38bdf8', height: 4, borderRadius: 4, width: `${(indice / carte.length) * 100}%`, transition: 'width 0.3s' }} />
              </div>

              {/* Carta — scrollabile, NON cresce oltre la finestra */}
              <div
                onClick={() => !girata && setGirata(true)}
                style={{
                  background: girata ? '#0d1f35' : '#111526',
                  borderRadius: 24,
                  border: `0.5px solid ${girata ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  padding: '36px 20px 28px',
                  // Altezza fissa: non cresce, ma il testo scrolla dentro
                  height: 'calc(100vh - 320px)',
                  minHeight: 200,
                  maxHeight: 420,
                  cursor: girata ? 'default' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'background 0.2s, border-color 0.2s',
                  overflowY: 'auto',
                }}
              >
                <div style={{ position: 'sticky', top: 0, width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: girata ? '#38bdf8' : 'rgba(255,255,255,0.25)' }}>
                    {girata ? 'RISPOSTA' : 'DOMANDA'}
                  </span>
                  {!girata && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>tocca per girare</span>}
                </div>
                <div style={{ fontSize: girata ? 13 : 15, fontWeight: girata ? 500 : 700, color: '#fff', lineHeight: 1.75, width: '100%' }}>
                  {girata ? carte[indice].risposta : carte[indice].domanda}
                </div>
              </div>

              {/* Bottoni FISSI in fondo — non si spostano mai */}
              <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px 16px 32px',
                background: 'linear-gradient(to top, #0a0d18 70%, transparent)',
                zIndex: 100,
              }}>
                {girata ? (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => rispondi(false)}
                      style={{ flex: 1, padding: '16px', borderRadius: 16, border: '0.5px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
                    >
                      ✗ Non sapevo
                    </button>
                    <button
                      onClick={() => rispondi(true)}
                      style={{ flex: 1, padding: '16px', borderRadius: 16, border: '0.5px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}
                    >
                      ✓ Sapevo
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', paddingBottom: 4 }}>
                    Tocca la carta per vedere la risposta
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── FLASHCARD RISULTATI ── */}
          {fase === 'flashcard-risultati' && (
            <div style={{ textAlign: 'center', paddingTop: 20 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{sapute >= nonSapute ? '🎉' : '💪'}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Sessione completata!</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>
                Hai risposto correttamente al {Math.round((sapute / Math.max(sapute + nonSapute, 1)) * 100)}% delle carte
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                <div style={{ background: '#111526', borderRadius: 16, padding: '20px 10px', border: '0.5px solid rgba(34,197,94,0.3)' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#22c55e' }}>{sapute}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Sapevo</div>
                </div>
                <div style={{ background: '#111526', borderRadius: 16, padding: '20px 10px', border: '0.5px solid rgba(239,68,68,0.3)' }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#ef4444' }}>{nonSapute}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Non sapevo</div>
                </div>
              </div>
              {daRipetere.length > 0 && (
                <button onClick={riprova} style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>
                  🔄 Ripassare quelle sbagliate ({daRipetere.length})
                </button>
              )}
              <button onClick={generaTest} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #a78bfa, #f97316)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>
                📝 Fai il test
              </button>
              <button onClick={() => router.back()} style={{ width: '100%', padding: '15px', borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.1)', background: '#111526', color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                Torna allo studio
              </button>
            </div>
          )}

          {/* ── TEST GENERAZIONE ── */}
          {fase === 'test-generazione' && (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ fontSize: 44, marginBottom: 20 }}>📝</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Generazione test in corso...</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>L'AI sta preparando le domande basate sul tuo documento</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', animation: `pulse 1.2s ease-in-out ${i * 200}ms infinite` }} />)}
              </div>
            </div>
          )}

          {/* ── TEST STUDIO ── */}
          {fase === 'test-studio' && domande.length > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>TEST</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{indiceDomanda + 1} / {domande.length}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 4, height: 4, marginBottom: 24 }}>
                <div style={{ background: '#a78bfa', height: 4, borderRadius: 4, width: `${(indiceDomanda / domande.length) * 100}%`, transition: 'width 0.3s' }} />
              </div>
              <div style={{ background: '#111526', borderRadius: 20, border: '0.5px solid rgba(167,139,250,0.3)', padding: '20px', marginBottom: 16 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#a78bfa', marginBottom: 10 }}>DOMANDA</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.65 }}>{domande[indiceDomanda].domanda}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {domande[indiceDomanda].opzioni.map((opzione, i) => {
                  const isCorretta = i === domande[indiceDomanda].corretta;
                  const isScelta = i === rispostaScelta;
                  let bg = '#111526', border = '0.5px solid rgba(255,255,255,0.08)', colore = 'rgba(255,255,255,0.8)';
                  if (confermata) {
                    if (isCorretta) { bg = 'rgba(34,197,94,0.1)'; border = '0.5px solid rgba(34,197,94,0.5)'; colore = '#22c55e'; }
                    else if (isScelta) { bg = 'rgba(239,68,68,0.1)'; border = '0.5px solid rgba(239,68,68,0.5)'; colore = '#ef4444'; }
                  } else if (isScelta) { bg = 'rgba(167,139,250,0.1)'; border = '0.5px solid rgba(167,139,250,0.5)'; colore = '#a78bfa'; }
                  return (
                    <div key={i} onClick={() => !confermata && setRispostaScelta(i)} style={{ background: bg, border, borderRadius: 14, padding: '14px 16px', cursor: confermata ? 'default' : 'pointer', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colore, lineHeight: 1.5 }}>{opzione}</div>
                    </div>
                  );
                })}
              </div>
              {!confermata ? (
                <button onClick={confermaRisposta} disabled={rispostaScelta === null} style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: rispostaScelta !== null ? 'linear-gradient(135deg, #a78bfa, #818cf8)' : '#1e2435', color: rispostaScelta !== null ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 800, fontSize: 14, cursor: rispostaScelta !== null ? 'pointer' : 'not-allowed', fontFamily: 'Montserrat, sans-serif' }}>
                  Conferma risposta
                </button>
              ) : (
                <button onClick={prossimaDomanda} style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #a78bfa, #818cf8)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                  {indiceDomanda + 1 >= domande.length ? 'Vedi risultati' : 'Prossima domanda →'}
                </button>
              )}
            </>
          )}

          {/* ── TEST RISULTATI ── */}
          {fase === 'test-risultati' && (
            <div style={{ textAlign: 'center', paddingTop: 20 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>{punteggio >= domande.length * 0.8 ? '🏆' : punteggio >= domande.length * 0.5 ? '👍' : '📚'}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Test completato!</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#a78bfa', marginBottom: 6 }}>{punteggio}/{domande.length}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 28 }}>{Math.round((punteggio / domande.length) * 100)}% di risposte corrette</div>
              <button onClick={generaTest} style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #a78bfa, #f97316)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>🔄 Rifai il test</button>
              <button onClick={() => setFase('flashcard-risultati')} style={{ width: '100%', padding: '15px', borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.1)', background: '#111526', color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>Torna allo studio</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}