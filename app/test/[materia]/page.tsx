'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { domande } from '@/lib/domande';

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

  const [domandeTest, setDomandeTest] = useState<Domanda[]>([]);
  const [loading, setLoading] = useState(true);
  const [errore, setErrore] = useState(false);
  const [indice, setIndice] = useState(0);
  const [risposte, setRisposte] = useState<Record<number, number>>({});
  const [timer, setTimer] = useState(TEMPO);
  const [scaduto, setScaduto] = useState(false);
  const [fine, setFine] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    setLoading(true);
    setErrore(false);

    try {

      const elenco = domande[materia as keyof typeof domande] as Domanda[];

      if (elenco && elenco.length > 0) {

        const mischiate = [...elenco]
          .sort(() => Math.random() - 0.5)
          .slice(0, TOTALE);

        setDomandeTest(mischiate);

      } else {

        setErrore(true);

      }

    } catch {

      setErrore(true);

    }

    setLoading(false);

  }, [materia]);

  useEffect(() => {

    if (loading || fine || domandeTest.length === 0) return;

    setTimer(TEMPO);
    setScaduto(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {

      setTimer((t) => {

        if (t <= 1) {

          if (timerRef.current) {
            clearInterval(timerRef.current);
          }

          setScaduto(true);

          return 0;
        }

        return t - 1;

      });

    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };

  }, [indice, loading, fine, domandeTest.length]);

  function rispondi(idx: number) {

    if (risposte[indice] !== undefined || scaduto) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setRisposte(prev => ({
      ...prev,
      [indice]: idx
    }));
  }

  function avanti() {

    if (indice < domandeTest.length - 1) {

      setIndice(prev => prev + 1);

    } else {

      setFine(true);

    }
  }

  function indietro() {

    if (indice > 0) {

      setIndice(prev => prev - 1);

    }
  }

  const domanda = domandeTest[indice];

  const risposta = risposte[indice];

  const haRisposto = risposta !== undefined;

  const punteggio = Object.entries(risposte).filter(
    ([i, r]) => domandeTest[parseInt(i)]?.corretta === r
  ).length;

  const percentuale =
    domandeTest.length > 0
      ? Math.round((punteggio / domandeTest.length) * 100)
      : 0;

  const timerColore =
    timer <= 10
      ? '#f87171'
      : timer <= 20
      ? '#fbbf24'
      : '#8fd3ff';

  if (loading) {

    return (
      <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
        <Header />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh',
          padding: '0 32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            Caricamento domande su {nomeMateria}...
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (errore) {

    return (
      <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
        <Header />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '70vh',
          padding: '0 32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 14, color: '#f87171' }}>
            Nessuna domanda trovata per questa materia.
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (fine) {

    return (
      <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>
        <Header />

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px 140px' }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>

            <div style={{
              fontSize: 56,
              fontWeight: 900,
              color: percentuale >= 60 ? '#4ade80' : '#f87171',
              marginBottom: 10
            }}>
              {percentuale}%
            </div>

            <div style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#fff',
              marginBottom: 8
            }}>
              {punteggio} su {domandeTest.length} corrette
            </div>

            <div style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.45)'
            }}>
              {nomeMateria}
            </div>

          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              background: '#8fd3ff',
              color: '#041428',
              fontWeight: 800,
              fontSize: 13,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Rifai il test
          </button>

        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: 'Montserrat, sans-serif' }}>

      <Header />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '16px 16px 140px' }}>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16
        }}>

          <button
            onClick={() => router.push('/test')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '6px 12px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ← Esci
          </button>

          <div style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: 2,
            textTransform: 'uppercase'
          }}>
            {nomeMateria}
          </div>

          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: `2px solid ${timerColore}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 800,
            color: timerColore
          }}>
            {timer}
          </div>

        </div>

        <div style={{
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 99,
          height: 3,
          marginBottom: 20,
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: '#8fd3ff',
            width: `${((indice + 1) / domandeTest.length) * 100}%`
          }} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 16
        }}>

          <span style={{
            fontSize: 10,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase'
          }}>
            Domanda {indice + 1} di {domandeTest.length}
          </span>

          <span style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.25)'
          }}>
            Quiz Orizzonte Giuridico
          </span>

        </div>

        <div style={{
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1.5,
          marginBottom: 24
        }}>
          {domanda?.testo}
        </div>

        {domanda?.opzioni.map((op, i) => {

          const selezionata = risposta === i;
          const corretta = domanda.corretta === i;

          let bg = '#111526';
          let border = '0.5px solid rgba(255,255,255,0.06)';
          let colore = 'rgba(255,255,255,0.7)';

          if (haRisposto || scaduto) {

            if (corretta) {

              bg = 'rgba(74,222,128,0.08)';
              border = '0.5px solid rgba(74,222,128,0.3)';
              colore = '#4ade80';

            } else if (selezionata) {

              bg = 'rgba(248,113,113,0.08)';
              border = '0.5px solid rgba(248,113,113,0.3)';
              colore = '#f87171';

            }
          }

          return (

            <button
              key={i}
              onClick={() => rispondi(i)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                background: bg,
                border,
                marginBottom: 10,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >

              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: colore,
                lineHeight: 1.5
              }}>
                {op}
              </div>

            </button>

          );

        })}

        {(haRisposto || scaduto) && domanda?.spiegazione && (

          <div style={{
            background: '#0b1322',
            borderRadius: 14,
            padding: '16px',
            marginTop: 10,
            marginBottom: 18,
            borderLeft: `3px solid ${
              risposta === domanda.corretta
                ? '#4ade80'
                : '#f87171'
            }`
          }}>

            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.8
            }}>
              {domanda.spiegazione}
            </div>

          </div>

        )}

        {(haRisposto || scaduto) && (

          <div style={{ display: 'flex', gap: 10 }}>

            {indice > 0 && (

              <button
                onClick={indietro}
                style={{
                  flex: 1,
                  padding: '13px',
                  borderRadius: 12,
                  background: '#111526',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                ← Indietro
              </button>

            )}

            <button
              onClick={avanti}
              style={{
                flex: 2,
                padding: '13px',
                borderRadius: 12,
                background: '#8fd3ff',
                color: '#041428',
                fontWeight: 800,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {indice < domandeTest.length - 1
                ? 'Avanti →'
                : 'Vedi risultati →'}
            </button>

          </div>

        )}

      </div>

      <Footer />

    </div>
  );
}