'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const livelli = [
  {
    titolo: 'Organizzazioni Internazionali',
    descrizione:
      'ONU, NATO, OCSE, Consiglio d’Europa e altre istituzioni sovranazionali.',
    istituzioni: [
      'ONU',
      'NATO',
      'Consiglio d’Europa',
      'OCSE',
      'Corte Europea dei Diritti dell’Uomo',
    ],
  },

  {
    titolo: 'Unione Europea',
    descrizione:
      'Commissione Europea, Parlamento Europeo, Consiglio UE e Corte di Giustizia.',
    istituzioni: [
      'Commissione Europea',
      'Parlamento Europeo',
      'Consiglio dell’Unione Europea',
      'Consiglio Europeo',
      'Corte di Giustizia UE',
      'Banca Centrale Europea',
    ],
  },

  {
    titolo: 'Stato Italiano',
    descrizione:
      'Parlamento, Governo, Presidente della Repubblica e Corte Costituzionale.',
    istituzioni: [
      'Parlamento',
      'Governo',
      'Presidente della Repubblica',
      'Corte Costituzionale',
      'Consiglio Superiore della Magistratura',
      'Corte dei Conti',
    ],
  },

  {
    titolo: 'Regioni e Comuni',
    descrizione:
      'Enti territoriali, autonomie locali e pubblica amministrazione.',
    istituzioni: [
      'Regioni',
      'Province',
      'Comuni',
      'Sindaco',
      'Consiglio Comunale',
      'Giunta Comunale',
    ],
  },
];

export default function IstituzioniPage() {
  const [categoriaAttiva, setCategoriaAttiva] =
    useState<string | null>(null);

  const [istituzioneAttiva, setIstituzioneAttiva] =
    useState<string | null>(null);

  const [istituzioniVisibili, setIstituzioniVisibili] =
    useState<string[]>([]);

  const [rispostaAI, setRispostaAI] = useState('');

  const [loadingAI, setLoadingAI] = useState(false);

  const rispostaRef =
    useRef<HTMLDivElement | null>(null);

  function apriCategoria(
    titolo: string,
    istituzioni: string[]
  ) {
    setCategoriaAttiva(titolo);

    setIstituzioneAttiva(null);

    setRispostaAI('');

    setIstituzioniVisibili(istituzioni);

    setTimeout(() => {
      rispostaRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  async function apriIstituzione(nome: string) {
    setIstituzioneAttiva(nome);

    setLoadingAI(true);

    setRispostaAI('');

    try {
      const res = await fetch('/api/istituzioni-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          istituzione: nome,
          tipo: 'spiegazione',
        }),
      });

      const data = await res.json();

      const testoPulito = (data.spiegazione || '')
        .replace(/###\s*/g, '')
        .replace(/##\s*/g, '')
        .replace(/#\s*/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '');

      setRispostaAI(testoPulito);

      setTimeout(() => {
        rispostaRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background: var(--bg);
        }

        ::-webkit-scrollbar {
          display: none;
        }

        html,
        body {
          overflow-x: hidden;
        }
      `}</style>

      <Header />

      <div
        style={{
          minHeight: '100vh',
          background: 'var(--bg)',
          padding: '20px 16px 140px',
          fontFamily: 'var(--font-ui)',
          color: 'var(--text)',
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 3,
              color: 'var(--text-3)',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Norma AI
          </div>

          <div
            style={{
              fontSize: 26,
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: -0.5,
              marginBottom: 12,
            }}
          >
            Istituzioni
          </div>

          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: 'var(--text-2)',
              maxWidth: 700,
            }}
          >
            Esplora le principali istituzioni
            internazionali, europee e italiane
            attraverso spiegazioni giuridiche
            generate da AI.
          </div>
        </div>

        {/* CATEGORIE */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginBottom: 30,
          }}
        >
          {livelli.map((livello, i) => (
            <button
              key={i}
              onClick={() =>
                apriCategoria(
                  livello.titolo,
                  livello.istituzioni
                )
              }
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 6,
                padding: '18px',
                borderRadius: 18,
                background: categoriaAttiva === livello.titolo
                    ? 'rgba(79,70,229,0.08)'
                    : 'var(--surface)',

                border: categoriaAttiva === livello.titolo
                    ? '1px solid rgba(79,70,229,0.25)'
                    : '1px solid rgba(255,255,255,0.05)',

                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: 'var(--text)',
                }}
              >
                {livello.titolo}
              </div>

              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--text-2)',
                }}
              >
                {livello.descrizione}
              </div>
            </button>
          ))}
        </div>

        {/* ISTITUZIONI */}
        {istituzioniVisibili.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginBottom: 30,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: 'var(--text-3)',
                marginBottom: 8,
                fontWeight: 700,
              }}
            >
              Istituzioni
            </div>

            {istituzioniVisibili.map(
              (istituzione, i) => (
                <button
                  key={i}
                  onClick={() =>
                    apriIstituzione(istituzione)
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      'space-between',

                    padding: '18px',
                    borderRadius: 18,

                    background: istituzioneAttiva ===
                      istituzione
                        ? 'rgba(79,70,229,0.08)'
                        : 'var(--surface)',

                    border: istituzioneAttiva ===
                      istituzione
                        ? '1px solid rgba(79,70,229,0.25)'
                        : '1px solid rgba(255,255,255,0.05)',

                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'var(--text)',
                    }}
                  >
                    {istituzione}
                  </div>

                  <div
                    style={{
                      color: 'var(--text-3)',
                    }}
                  >
                    →
                  </div>
                </button>
              )
            )}
          </div>
        )}

        {/* RISPOSTA AI */}
        {(loadingAI || rispostaAI) && (
          <div
            ref={rispostaRef}
            style={{
              borderRadius: 22,
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 10,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: 12,
                fontWeight: 700,
              }}
            >
              Norma AI
            </div>

            {istituzioneAttiva && (
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: 20,
                }}
              >
                {istituzioneAttiva}
              </div>
            )}

            {loadingAI ? (
              <div
                style={{
                  color: 'var(--accent)',
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                Generazione spiegazione...
              </div>
            ) : (
              <div
                style={{
                  color: 'var(--text)',
                  lineHeight: 1.9,
                  fontSize: 15,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {rispostaAI}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}