'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Carta = { domanda: string; risposta: string };
type DomandaTest = { domanda: string; opzioni: string[]; corretta: number };
type DeckSalvato = { id: string; titolo: string; pagine: string; carte: Carta[]; data: string };

type Fase =
  | 'upload'
  | 'selezione-pagine'
  | 'selezione-foto'
  | 'caricamento'
  | 'flashcard-intro'
  | 'flashcard-studio'
  | 'flashcard-risultati'
  | 'test-generazione'
  | 'test-studio'
  | 'test-risultati'
  | 'salvati';

const MAX_PAGINE = 8;

export default function PdfStudioPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const fotoRef = useRef<HTMLInputElement>(null);
  const [fotoBase64, setFotoBase64] = useState<string[]>([]);
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);

  const [fase, setFase] = useState<Fase>('upload');
  const [nomeFile, setNomeFile] = useState('');
  const [fileCorrente, setFileCorrente] = useState<File | null>(null);
  const [testoEstratto, setTestoEstratto] = useState('');
  const [errore, setErrore] = useState('');

  const [totalePagine, setTotalePagine] = useState(0);
  const [paginaDa, setPaginaDa] = useState(1);
  const [paginaA, setPaginaA] = useState(1);

  const [carte, setCarte] = useState<Carta[]>([]);
  const [indice, setIndice] = useState(0);
  const [girata, setGirata] = useState(false);
  const [sapute, setSapute] = useState(0);
  const [nonSapute, setNonSapute] = useState(0);
  const [daRipetere, setDaRipetere] = useState<Carta[]>([]);
  const [deckSalvato, setDeckSalvato] = useState(false);

  const [domande, setDomande] = useState<DomandaTest[]>([]);
  const [indiceDomanda, setIndiceDomanda] = useState(0);
  const [rispostaScelta, setRispostaScelta] = useState<number | null>(null);
  const [confermata, setConfermata] = useState(false);
  const [punteggio, setPunteggio] = useState(0);

  function caricaPdfjsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).pdfjsLib) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Errore caricamento pdfjs'));
      document.head.appendChild(script);
    });
  }

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 8);
    if (files.length === 0) return;
    e.target.value = '';
    setErrore('');
    const previews: string[] = [];
    const base64s: string[] = [];
    await Promise.all(files.map(file => new Promise<void>(resolve => {
      const reader = new FileReader();
      reader.onload = ev => {
        const result = ev.target?.result as string;
        previews.push(result);
        base64s.push(result.split(',')[1]);
        resolve();
      };
      reader.readAsDataURL(file);
    })));
    setFotoPreviews(previews);
    setFotoBase64(base64s);
    setNomeFile(`${files.length} foto`);
    setFase('selezione-foto');
  }

  async function avviaGenerazioneFoto() {
    if (fotoBase64.length === 0) return;
    setErrore('');
    setFase('caricamento');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);
      const res = await fetch('/api/studio-foto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'flashcard', immagini: fotoBase64 }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.errore || !data.carte || !Array.isArray(data.carte)) {
        setErrore(data.errore || 'Errore generazione flashcard');
        setFase('selezione-foto');
        return;
      }
      if (data.testo) setTestoEstratto(data.testo);
      setCarte(data.carte.sort(() => Math.random() - 0.5));
      setIndice(0); setGirata(false); setSapute(0); setNonSapute(0); setDaRipetere([]);
      setFase('flashcard-intro');
    } catch (err: any) {
      setErrore(err?.name === 'AbortError' ? 'Timeout AI. Riprova.' : 'Errore connessione al server.');
      setFase('selezione-foto');
    }
  }

  // STEP 1: legge solo il numero di pagine, poi si FERMA
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') { setErrore('Carica un file PDF valido'); return; }
    e.target.value = '';
    setErrore('');
    setNomeFile(file.name);
    setFileCorrente(file);
    setDeckSalvato(false);
    try {
      await caricaPdfjsScript();
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const n = pdf.numPages;
      setTotalePagine(n);
      setPaginaDa(1);
      setPaginaA(Math.min(MAX_PAGINE, n));
      setFase('selezione-pagine'); // ← SI FERMA QUI, aspetta che tu scelga
    } catch {
      setErrore('Errore nella lettura del PDF. Riprova.');
    }
  }

  // STEP 2: parte solo quando premi il bottone "Genera"
  async function avviaGenerazione() {
    if (!fileCorrente) return;
    setErrore('');
    setFase('caricamento');
    try {
      await caricaPdfjsScript();
      const pdfjsLib = (window as any).pdfjsLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      const arrayBuffer = await fileCorrente.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let testo = '';
      for (let i = paginaDa; i <= paginaA; i++) {
        const pagina = await pdf.getPage(i);
        const contenuto = await pagina.getTextContent();
        testo += contenuto.items.map((item: any) => ('str' in item ? item.str : '')).join(' ') + '\n';
      }
      testo = testo.trim();
      if (!testo || testo.length < 50) {
        setErrore('Nessun testo leggibile nelle pagine selezionate.');
        setFase('selezione-pagine');
        return;
      }
      setTestoEstratto(testo);
      await generaFlashCard(testo);
    } catch (err) {
      console.error(err);
      setErrore('Errore nel caricamento. Riprova.');
      setFase('selezione-pagine');
    }
  }

  async function generaFlashCard(testo: string) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const res = await fetch('/api/studio-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'flashcard', testo: testo.substring(0, 24000) }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      if (data.errore || !data.carte || !Array.isArray(data.carte)) {
        setErrore(data.errore || 'Errore generazione flashcard');
        setFase('selezione-pagine');
        return;
      }
      setCarte(data.carte.sort(() => Math.random() - 0.5));
      setIndice(0); setGirata(false); setSapute(0); setNonSapute(0); setDaRipetere([]);
      setFase('flashcard-intro');
    } catch (err: any) {
      setErrore(err?.name === 'AbortError' ? 'Timeout AI. Riprova.' : 'Errore connessione al server.');
      setFase('selezione-pagine');
    }
  }

  async function generaTest() {
    setFase('test-generazione');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const res = await fetch('/api/studio-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: 'test', testo: testoEstratto.substring(0, 24000) }),
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
      setIndiceDomanda(0); setRispostaScelta(null); setConfermata(false); setPunteggio(0);
      setFase('test-studio');
    } catch (err: any) {
      setErrore(err?.name === 'AbortError' ? 'Timeout AI. Riprova.' : 'Errore generazione test.');
      setFase('flashcard-risultati');
    }
  }

  function salvaDeck() {
    try {
      const decks: DeckSalvato[] = JSON.parse(localStorage.getItem('salvati_flashcard') || '[]');
      decks.unshift({
        id: Date.now().toString(),
        titolo: nomeFile.replace('.pdf', ''),
        pagine: `pag. ${paginaDa}–${paginaA}`,
        carte,
        data: new Date().toLocaleDateString('it-IT'),
      });
      localStorage.setItem('salvati_flashcard', JSON.stringify(decks));
      setDeckSalvato(true);
    } catch {
      alert('Errore nel salvataggio. Riprova.');
    }
  }

  function rispondi(sapevo: boolean) {
    if (sapevo) setSapute(s => s + 1);
    else { setNonSapute(n => n + 1); setDaRipetere(dr => [...dr, carte[indice]]); }
    if (indice + 1 >= carte.length) setFase('flashcard-risultati');
    else { setIndice(i => i + 1); setGirata(false); }
  }

  function riprova() {
    if (daRipetere.length === 0) { setIndice(0); setGirata(false); setSapute(0); setNonSapute(0); setFase('flashcard-intro'); return; }
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

  const numPagine = Math.max(0, paginaA - paginaDa + 1);
  const rangeValido = numPagine >= 1 && numPagine <= MAX_PAGINE;
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
        input[type=range] {
          -webkit-appearance: none; width: 100%; height: 4px;
          border-radius: 4px; background: rgba(255,255,255,0.1); outline: none;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 24px; height: 24px;
          border-radius: 50%; background: #38bdf8; cursor: pointer;
          border: 3px solid #0a0d18;
        }
        input[type=number] {
          background: #1a2235; border: 0.5px solid rgba(56,189,248,0.3);
          border-radius: 10px; color: #fff; font-size: 20px; font-weight: 700;
          font-family: Montserrat, sans-serif; text-align: center;
          padding: 10px 8px; width: 72px; outline: none;
          -moz-appearance: textfield;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '20px 16px 100px', maxWidth: 650, width: '100%', margin: '0 auto' }}>

          {/* ── UPLOAD ── */}
          {fase === 'upload' && (
            <>
              <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', marginBottom: 24, fontFamily: 'Montserrat, sans-serif' }}>
                ← Indietro
              </button>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Studio · PDF</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>Carica il tuo PDF</div>
                </div>
                <button onClick={() => setFase('salvati')} style={{ background: 'rgba(56,189,248,0.1)', border: '0.5px solid rgba(56,189,248,0.25)', borderRadius: 12, padding: '8px 14px', color: '#38bdf8', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', marginTop: 4 }}>
                  🔖 Salvati
                </button>
              </div>
              <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFile} />
              <input ref={fotoRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFoto} />
              <div onClick={() => inputRef.current?.click()} style={{ background: '#111526', border: '1.5px dashed rgba(255,255,255,0.15)', borderRadius: 20, padding: '44px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: 12 }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>📄</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Tocca per caricare il PDF</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 6 }}>Solo PDF con testo selezionabile</div>
                <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>⚠️ Max {MAX_PAGINE} pagine alla volta</div>
              </div>
              <div onClick={() => fotoRef.current?.click()} style={{ background: '#111526', border: '1.5px dashed rgba(56,189,248,0.25)', borderRadius: 20, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📷</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Scatta o carica foto</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Appunti, libri, lavagna — Groq legge l'immagine</div>
                <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 600 }}>Max 8 foto alla volta</div>
              </div>
              {errore && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', color: '#ef4444', fontSize: 12, textAlign: 'center' }}>
                  {errore}
                </div>
              )}
            </>
          )}

          {/* ── SELEZIONE PAGINE ── */}
          {fase === 'selezione-pagine' && (
            <>
              <button onClick={() => { setFase('upload'); setFileCorrente(null); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', marginBottom: 24, fontFamily: 'Montserrat, sans-serif' }}>
                ← Indietro
              </button>

              <div style={{ background: '#111526', borderRadius: 16, border: '0.5px solid rgba(255,255,255,0.07)', padding: '14px 16px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 26 }}>📄</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nomeFile}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{totalePagine} pagine totali</div>
                </div>
              </div>

              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 6 }}>Quali pagine vuoi studiare?</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 28 }}>
                Scegli da 1 a {MAX_PAGINE} pagine. Puoi tornare dopo per il blocco successivo.
              </div>

              {/* Input numerici */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 32 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 10 }}>Da pagina</div>
                  <input
                    type="number" min={1} max={totalePagine} value={paginaDa}
                    onChange={e => {
                      let v = parseInt(e.target.value) || 1;
                      v = Math.max(1, Math.min(v, totalePagine));
                      setPaginaDa(v);
                      if (paginaA < v) setPaginaA(v);
                      if (paginaA - v + 1 > MAX_PAGINE) setPaginaA(v + MAX_PAGINE - 1);
                    }}
                  />
                </div>
                <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.2)', paddingTop: 24 }}>→</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 10 }}>A pagina</div>
                  <input
                    type="number" min={paginaDa} max={Math.min(totalePagine, paginaDa + MAX_PAGINE - 1)} value={paginaA}
                    onChange={e => {
                      let v = parseInt(e.target.value) || paginaDa;
                      v = Math.max(paginaDa, Math.min(v, totalePagine, paginaDa + MAX_PAGINE - 1));
                      setPaginaA(v);
                    }}
                  />
                </div>
              </div>

              {/* Slider pagina iniziale */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                  <span>Pagina iniziale</span><span>{paginaDa}</span>
                </div>
                <input type="range" min={1} max={totalePagine} value={paginaDa}
                  onChange={e => {
                    const v = Number(e.target.value);
                    setPaginaDa(v);
                    if (paginaA < v) setPaginaA(v);
                    if (paginaA - v + 1 > MAX_PAGINE) setPaginaA(v + MAX_PAGINE - 1);
                  }}
                />
              </div>

              {/* Slider pagina finale */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>
                  <span>Pagina finale</span><span>{paginaA}</span>
                </div>
                <input type="range" min={paginaDa} max={Math.min(totalePagine, paginaDa + MAX_PAGINE - 1)} value={paginaA}
                  onChange={e => setPaginaA(Number(e.target.value))}
                />
              </div>

              {/* Riepilogo */}
              <div style={{ background: rangeValido ? 'rgba(56,189,248,0.07)' : 'rgba(239,68,68,0.07)', border: `0.5px solid ${rangeValido ? 'rgba(56,189,248,0.25)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 14, padding: '14px 16px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>Selezione</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: rangeValido ? '#38bdf8' : '#ef4444' }}>{numPagine} {numPagine === 1 ? 'pagina' : 'pagine'}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>pag. {paginaDa} → {paginaA}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22 }}>{rangeValido ? '✅' : '⚠️'}</div>
                  <div style={{ fontSize: 10, color: rangeValido ? 'rgba(255,255,255,0.3)' : '#ef4444', marginTop: 4 }}>
                    {rangeValido ? `max ${MAX_PAGINE} pagine` : `supera il limite di ${MAX_PAGINE}`}
                  </div>
                </div>
              </div>

              {errore && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', color: '#ef4444', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
                  {errore}
                </div>
              )}

              <button onClick={avviaGenerazione} disabled={!rangeValido} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: rangeValido ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : '#1e2435', color: rangeValido ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 800, fontSize: 15, cursor: rangeValido ? 'pointer' : 'not-allowed', fontFamily: 'Montserrat, sans-serif' }}>
                ⚡ Genera flash card · {numPagine} {numPagine === 1 ? 'pagina' : 'pagine'}
              </button>
            </>
          )}

          {/* ── SELEZIONE FOTO ── */}
          {fase === 'selezione-foto' && (
            <>
              <button onClick={() => { setFase('upload'); setFotoBase64([]); setFotoPreviews([]); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', marginBottom: 24, fontFamily: 'Montserrat, sans-serif' }}>
                ← Indietro
              </button>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{fotoPreviews.length} foto selezionate</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>Groq leggerà il testo da ogni immagine</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                {fotoPreviews.map((src, i) => (
                  <div key={i} style={{ aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', border: '0.5px solid rgba(56,189,248,0.2)' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
                {fotoPreviews.length < 8 && (
                  <div onClick={() => fotoRef.current?.click()} style={{ aspectRatio: '1/1', borderRadius: 12, border: '1.5px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 24, color: 'rgba(255,255,255,0.25)' }}>+</div>
                )}
              </div>
              {errore && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '12px 16px', color: '#ef4444', fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
                  {errore}
                </div>
              )}
              <button onClick={avviaGenerazioneFoto} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                ⚡ Genera flash card · {fotoPreviews.length} {fotoPreviews.length === 1 ? 'foto' : 'foto'}
              </button>
            </>
          )}

          {/* ── CARICAMENTO ── */}
          {fase === 'caricamento' && (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ fontSize: 44, marginBottom: 20 }}>⚡</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Analisi documento...</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{nomeFile}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Pagine {paginaDa} – {paginaA}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', animation: `pulse 1.2s ease-in-out ${i * 200}ms infinite` }} />)}
              </div>
            </div>
          )}

          {/* ── FLASHCARD INTRO ── */}
          {fase === 'flashcard-intro' && (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🃏</div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 6 }}>{carte.length} flashcard pronte</h1>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{nomeFile}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 32 }}>Pagine {paginaDa}–{paginaA}</p>
              <button onClick={() => { setIndice(0); setGirata(false); setSapute(0); setNonSapute(0); setDaRipetere([]); setFase('flashcard-studio'); }} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', marginBottom: 12, fontFamily: 'Montserrat, sans-serif' }}>
                ⚡ Inizia studio
              </button>
              <button onClick={salvaDeck} disabled={deckSalvato} style={{ width: '100%', padding: '15px', borderRadius: 16, border: `0.5px solid ${deckSalvato ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.12)'}`, background: deckSalvato ? 'rgba(34,197,94,0.08)' : 'transparent', color: deckSalvato ? '#22c55e' : 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, cursor: deckSalvato ? 'default' : 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                {deckSalvato ? '✅ Deck salvato' : '💾 Salva deck'}
              </button>
            </div>
          )}

          {/* ── FLASHCARD STUDIO ── */}
          {fase === 'flashcard-studio' && carte[indice] && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <button onClick={() => setFase('flashcard-intro')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, fontFamily: 'Montserrat, sans-serif' }}>← Esci</button>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{indice + 1} / {carte.length}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 999, marginBottom: 20 }}>
                <div style={{ width: `${progresso}%`, height: 4, background: '#38bdf8', borderRadius: 999, transition: '0.3s' }} />
              </div>
              <div onClick={() => setGirata(g => !g)} style={{ background: girata ? '#172033' : '#111526', borderRadius: 24, padding: '28px 24px', minHeight: 260, cursor: 'pointer', border: girata ? '1px solid rgba(56,189,248,0.3)' : '1px solid rgba(255,255,255,0.08)', marginBottom: 20, transition: 'background 0.3s' }}>
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
                  <button onClick={() => rispondi(false)} style={{ padding: '16px', borderRadius: 16, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>❌ Non sapevo</button>
                  <button onClick={() => rispondi(true)} style={{ padding: '16px', borderRadius: 16, border: 'none', background: '#22c55e', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>✅ Sapevo</button>
                </div>
              )}
            </div>
          )}

          {/* ── FLASHCARD RISULTATI ── */}
          {fase === 'flashcard-risultati' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 18 }}>🏁</div>
              <h1 style={{ color: '#fff', marginBottom: 12, fontWeight: 900 }}>Sessione completata</h1>
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
                <button onClick={riprova} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#111526', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 12, fontFamily: 'Montserrat, sans-serif' }}>
                  🔄 Ripassa errori ({daRipetere.length})
                </button>
              )}
              <button onClick={generaTest} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #a855f7, #818cf8)', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 12, fontFamily: 'Montserrat, sans-serif' }}>
                📝 Fai il test
              </button>
              <button onClick={salvaDeck} disabled={deckSalvato} style={{ width: '100%', padding: '15px', borderRadius: 16, border: `0.5px solid ${deckSalvato ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.12)'}`, background: deckSalvato ? 'rgba(34,197,94,0.08)' : 'transparent', color: deckSalvato ? '#22c55e' : 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 13, cursor: deckSalvato ? 'default' : 'pointer', fontFamily: 'Montserrat, sans-serif', marginBottom: 12 }}>
                {deckSalvato ? '✅ Deck salvato' : '💾 Salva deck'}
              </button>
              <button onClick={() => { setDeckSalvato(false); setFase('selezione-pagine'); }} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#38bdf8', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 12, fontFamily: 'Montserrat, sans-serif' }}>
                📄 Carica altre pagine
              </button>
              <button onClick={() => setFase('upload')} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#111526', color: 'rgba(255,255,255,0.5)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                Nuovo PDF
              </button>
            </div>
          )}

          {/* ── TEST GENERAZIONE ── */}
          {fase === 'test-generazione' && (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <div style={{ fontSize: 44, marginBottom: 20 }}>🧠</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Generazione test...</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7', animation: `pulse 1.2s ease-in-out ${i * 200}ms infinite` }} />)}
              </div>
            </div>
          )}

          {/* ── TEST STUDIO ── */}
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
                  let bg = '#111526', border = '1px solid rgba(255,255,255,0.08)', color = '#fff';
                  if (confermata) {
                    if (i === domande[indiceDomanda].corretta) { bg = 'rgba(34,197,94,0.15)'; border = '1px solid #22c55e'; color = '#22c55e'; }
                    else if (i === rispostaScelta) { bg = 'rgba(239,68,68,0.15)'; border = '1px solid #ef4444'; color = '#ef4444'; }
                  } else if (i === rispostaScelta) { bg = 'rgba(168,85,247,0.15)'; border = '1px solid #a855f7'; }
                  return (
                    <button key={i} onClick={() => !confermata && setRispostaScelta(i)}
                      style={{ padding: '14px 18px', borderRadius: 14, border, background: bg, color, fontWeight: 600, fontSize: 14, cursor: confermata ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'Montserrat, sans-serif' }}>
                      {opzione}
                    </button>
                  );
                })}
              </div>
              {!confermata ? (
                <button onClick={confermaRisposta} disabled={rispostaScelta === null} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: rispostaScelta !== null ? '#a855f7' : 'rgba(168,85,247,0.2)', color: '#fff', fontWeight: 800, cursor: rispostaScelta !== null ? 'pointer' : 'default', fontFamily: 'Montserrat, sans-serif' }}>
                  Conferma
                </button>
              ) : (
                <button onClick={prossimaDomanda} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#a855f7', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                  {indiceDomanda + 1 >= domande.length ? 'Vedi risultati' : 'Prossima →'}
                </button>
              )}
            </div>
          )}

          {/* ── TEST RISULTATI ── */}
          {fase === 'test-risultati' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 18 }}>🎯</div>
              <h1 style={{ color: '#fff', marginBottom: 8 }}>Test completato!</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24, fontSize: 14 }}>
                {punteggio} risposte corrette su {domande.length}
              </p>
              <div style={{ background: '#111526', borderRadius: 20, padding: '28px', marginBottom: 24 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: punteggio / domande.length >= 0.6 ? '#22c55e' : '#ef4444' }}>
                  {Math.round((punteggio / domande.length) * 100)}%
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {punteggio / domande.length >= 0.6 ? 'Ottimo risultato!' : 'Continua a studiare'}
                </div>
              </div>
              <button onClick={generaTest} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #a855f7, #818cf8)', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 12, fontFamily: 'Montserrat, sans-serif' }}>
                🔄 Rifai il test
              </button>
              <button onClick={() => setFase('flashcard-intro')} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#38bdf8', color: '#fff', fontWeight: 800, cursor: 'pointer', marginBottom: 12, fontFamily: 'Montserrat, sans-serif' }}>
                ← Torna alle flashcard
              </button>
              <button onClick={() => setFase('upload')} style={{ width: '100%', padding: '16px', borderRadius: 16, border: 'none', background: '#111526', color: 'rgba(255,255,255,0.5)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                Carica nuovo PDF
              </button>
            </div>
          )}

          {/* ── SALVATI ── */}
          {fase === 'salvati' && (() => {
            let decks: DeckSalvato[] = [];
            try { decks = JSON.parse(localStorage.getItem('salvati_flashcard') || '[]'); } catch {}
            return (
              <>
                <button onClick={() => setFase('upload')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', marginBottom: 24, fontFamily: 'Montserrat, sans-serif' }}>
                  ← Indietro
                </button>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Deck salvati</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>
                  {decks.length === 0 ? 'Nessun deck salvato ancora' : `${decks.length} deck · tocca per ripassare`}
                </div>
                {decks.length === 0 && (
                  <div style={{ textAlign: 'center', paddingTop: 40 }}>
                    <div style={{ fontSize: 44, marginBottom: 12 }}>📭</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
                      Genera delle flash card e salvale<br />per trovarle qui
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {decks.map(deck => (
                    <div key={deck.id} onClick={() => {
                      setCarte([...deck.carte].sort(() => Math.random() - 0.5));
                      setNomeFile(deck.titolo);
                      setIndice(0); setGirata(false); setSapute(0); setNonSapute(0); setDaRipetere([]);
                      setFase('flashcard-studio');
                    }} style={{ background: '#111526', borderRadius: 18, border: '0.5px solid rgba(56,189,248,0.15)', padding: '16px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                          📄 {deck.titolo}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{deck.pagine} · {deck.data}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#38bdf8' }}>{deck.carte.length}</div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>carte</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

        </main>
        <Footer />
      </div>
    </>
  );
}