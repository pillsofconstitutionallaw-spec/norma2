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

  const [domande, setDomande] = useState<
    DomandaTest[]
  >([]);

  const [indiceDomanda, setIndiceDomanda] =
    useState(0);

  const [rispostaScelta, setRispostaScelta] =
    useState<number | null>(null);

  const [confermata, setConfermata] =
    useState(false);

  const [punteggio, setPunteggio] =
    useState(0);

  const [salvato, setSalvato] =
    useState(false);

  // AUTOSAVE
  useEffect(() => {
    const sessione = {
      fase,
      nomeFile,
      testoEstratto,
      carte,
      indice,
      girata,
      sapute,
      nonSapute,
      daRipetere,
    };

    localStorage.setItem(
      'studio_pdf_sessione',
      JSON.stringify(sessione)
    );
  }, [
    fase,
    nomeFile,
    testoEstratto,
    carte,
    indice,
    girata,
    sapute,
    nonSapute,
    daRipetere,
  ]);

  // RIPRISTINO SESSIONE
  useEffect(() => {
    try {
      const salvata =
        localStorage.getItem(
          'studio_pdf_sessione'
        );

      if (!salvata) return;

      const data = JSON.parse(salvata);

      if (data?.carte?.length > 0) {
        setFase(data.fase || 'upload');
        setNomeFile(data.nomeFile || '');
        setTestoEstratto(
          data.testoEstratto || ''
        );

        setCarte(data.carte || []);
        setIndice(data.indice || 0);

        setGirata(data.girata || false);

        setSapute(data.sapute || 0);
        setNonSapute(data.nonSapute || 0);

        setDaRipetere(
          data.daRipetere || []
        );
      }
    } catch {}
  }, []);

  async function handleFile(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrore('Carica un PDF');
      return;
    }

    setNomeFile(file.name);

    setErrore('');

    setSalvato(false);

    setFase('caricamento');

    try {
      const testo =
        await estraiTestoPDF(file);

      if (
        !testo ||
        testo.trim().length < 50
      ) {
        setErrore(
          'PDF senza testo leggibile'
        );

        setFase('upload');

        return;
      }

      setTestoEstratto(testo);

      await generaFlashCard(testo);
    } catch (err) {
      console.error(err);

      setErrore(
        'Errore caricamento PDF'
      );

      setFase('upload');
    }
  }

  async function estraiTestoPDF(
    file: File
  ): Promise<string> {
    const pdfjsLib = (await import(
      'pdfjs-dist' as any
    )) as any;

    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

    const arrayBuffer =
      await file.arrayBuffer();

    const pdf =
      await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

    let testo = '';

    for (
      let i = 1;
      i <= pdf.numPages;
      i++
    ) {
      const pagina =
        await pdf.getPage(i);

      const contenuto =
        await pagina.getTextContent();

      testo +=
        contenuto.items
          .map((item: any) => item.str)
          .join(' ') + '\n';
    }

    return testo.trim();
  }

  async function generaFlashCard(
    testo: string
  ) {
    try {
      const controller =
        new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 30000);

      const res = await fetch(
        '/api/studio-pdf',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            tipo: 'flashcard',
            testo:
              testo.substring(
                0,
                12000
              ),
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(
          'Errore server'
        );
      }

      const data = await res.json();

      if (
        data.errore ||
        !data.carte ||
        !Array.isArray(data.carte)
      ) {
        setErrore(
          data.errore ||
            'Errore generazione'
        );

        setFase('upload');

        return;
      }

      setCarte(
        data.carte.sort(
          () => Math.random() - 0.5
        )
      );

      setFase('flashcard-intro');
    } catch (err) {
      console.error(err);

      setErrore(
        'Errore AI o timeout'
      );

      setFase('upload');
    }
  }

  async function generaTest() {
    setFase('test-generazione');

    try {
      const res = await fetch(
        '/api/studio-pdf',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            tipo: 'test',
            testo:
              testoEstratto.substring(
                0,
                12000
              ),
          }),
        }
      );

      const data = await res.json();

      if (
        data.errore ||
        !data.domande
      ) {
        setErrore(
          data.errore ||
            'Errore test'
        );

        setFase(
          'flashcard-risultati'
        );

        return;
      }

      setDomande(data.domande);

      setIndiceDomanda(0);

      setRispostaScelta(null);

      setConfermata(false);

      setPunteggio(0);

      setFase('test-studio');
    } catch {
      setErrore(
        'Errore generazione test'
      );

      setFase(
        'flashcard-risultati'
      );
    }
  }

  function salvaDeck() {
    try {
      const decks = JSON.parse(
        localStorage.getItem(
          'salvati_flashcard'
        ) || '[]'
      );

      decks.push({
        id: Date.now(),
        titolo:
          nomeFile.replace(
            '.pdf',
            ''
          ),
        carte,
        data: new Date().toLocaleDateString(
          'it-IT'
        ),
      });

      localStorage.setItem(
        'salvati_flashcard',
        JSON.stringify(decks)
      );

      setSalvato(true);
    } catch {}
  }

  function rispondi(
    sapevo: boolean
  ) {
    if (sapevo) {
      setSapute((s) => s + 1);
    } else {
      setNonSapute((n) => n + 1);

      setDaRipetere((dr) => [
        ...dr,
        carte[indice],
      ]);
    }

    if (
      indice + 1 >=
      carte.length
    ) {
      setFase(
        'flashcard-risultati'
      );
    } else {
      setIndice((i) => i + 1);

      setGirata(false);
    }
  }

  function riprova() {
    setCarte(
      [...daRipetere].sort(
        () => Math.random() - 0.5
      )
    );

    setIndice(0);

    setGirata(false);

    setSapute(0);

    setNonSapute(0);

    setDaRipetere([]);

    setFase('flashcard-studio');
  }

  function confermaRisposta() {
    if (
      rispostaScelta === null
    )
      return;

    setConfermata(true);

    if (
      rispostaScelta ===
      domande[indiceDomanda]
        .corretta
    ) {
      setPunteggio(
        (p) => p + 1
      );
    }
  }

  function prossimaDomanda() {
    if (
      indiceDomanda + 1 >=
      domande.length
    ) {
      setFase(
        'test-risultati'
      );
    } else {
      setIndiceDomanda(
        (i) => i + 1
      );

      setRispostaScelta(null);

      setConfermata(false);
    }
  }

  const progresso =
    carte.length > 0
      ? ((indice + 1) /
          carte.length) *
        100
      : 0;

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: #0a0d18;
        }

        ::-webkit-scrollbar {
          display: none;
        }

        @keyframes pulse {
          0%,
          80%,
          100% {
            opacity: 0.2;
            transform: scale(0.75);
          }

          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div
        style={{
          fontFamily:
            'Montserrat, sans-serif',
          background: '#0a0d18',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />

        <main
          style={{
            flex: 1,
            padding:
              '20px 16px 100px',
            maxWidth: 650,
            width: '100%',
            margin: '0 auto',
          }}
        >
          {fase === 'upload' && (
            <>
              <button
                onClick={() =>
                  router.back()
                }
                style={{
                  background: 'none',
                  border: 'none',
                  color:
                    'rgba(255,255,255,0.4)',
                  fontSize: 13,
                  cursor: 'pointer',
                  marginBottom: 24,
                }}
              >
                ← Indietro
              </button>

              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: 3,
                    color:
                      'rgba(255,255,255,0.3)',
                    textTransform:
                      'uppercase',
                    marginBottom: 8,
                  }}
                >
                  Studio · PDF
                </div>

                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: 8,
                  }}
                >
                  Carica il tuo PDF
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                style={{
                  display: 'none',
                }}
                onChange={handleFile}
              />

              <div
                onClick={() =>
                  inputRef.current?.click()
                }
                style={{
                  background: '#111526',
                  border:
                    '1.5px dashed rgba(255,255,255,0.15)',
                  borderRadius: 20,
                  padding:
                    '44px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 44,
                    marginBottom: 14,
                  }}
                >
                  📄
                </div>

                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: '#fff',
                    marginBottom: 6,
                  }}
                >
                  Tocca per caricare
                </div>
              </div>

              {errore && (
                <div
                  style={{
                    background:
                      'rgba(239,68,68,0.1)',
                    border:
                      '0.5px solid rgba(239,68,68,0.3)',
                    borderRadius: 12,
                    padding:
                      '12px 16px',
                    color: '#ef4444',
                    fontSize: 12,
                    textAlign:
                      'center',
                  }}
                >
                  {errore}
                </div>
              )}
            </>
          )}

          {fase === 'caricamento' && (
            <div
              style={{
                textAlign: 'center',
                paddingTop: 80,
              }}
            >
              <div
                style={{
                  fontSize: 44,
                  marginBottom: 20,
                }}
              >
                ⚡
              </div>

              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 10,
                }}
              >
                Analisi documento...
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  marginTop: 20,
                }}
              >
                {[0, 1, 2].map(
                  (i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius:
                          '50%',
                        background:
                          '#38bdf8',
                        animation: `pulse 1.2s ease-in-out ${i * 200}ms infinite`,
                      }}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}