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
  const [attiva, setAttiva] = useState<string | null>(null);

  const [istituzioniVisibili, setIstituzioniVisibili] =
    useState<string[]>([]);

  const [rispostaAI, setRispostaAI] = useState('');

  const [loadingAI, setLoadingAI] = useState(false);

  const istituzioniRef =
    useRef<HTMLDivElement | null>(null);

  async function apriIstituzione(
    nome: string,
    lista?: string[]
  ) {
    setAttiva(nome);

    // Apertura categoria
    if (lista) {
      setIstituzioniVisibili(lista);

      setRispostaAI('');

      setTimeout(() => {
        istituzioniRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);

      return;
    }

    // Apertura AI
    setLoadingAI(true);

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

      // Pulizia markdown
      const testoPulito = (data.risposta || '')
  .replace(/###\s*/g, '')
  .replace(/##\s*/g, '')
  .replace(/#\s*/g, '')
  .replace(/\*\*/g, '')
  .replace(/\*/g, '');

      setRispostaAI(testoPulito);

      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      }, 200);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top, #0f1b3d 0%, #050816 45%, #03050f 100%)',
          color: '#fff',
          padding: '80px 24px',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: '0 auto',
          }}
        >
          {/* HERO */}
          <div
            style={{
              marginBottom: 70,
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: '#8fd3ff',
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              Norma AI
            </div>

            <h1
              style={{
                fontSize: 'clamp(42px, 8vw, 88px)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: -3,
                marginBottom: 24,
              }}
            >
              Istituzioni
            </h1>

            <p
              style={{
                maxWidth: 820,
                color: 'rgba(255,255,255,0.68)',
                fontSize: 18,
                lineHeight: 1.8,
              }}
            >
              Esplora l’architettura istituzionale
              internazionale, europea e italiana
              attraverso una piattaforma giuridica
              intelligente alimentata da AI.
            </p>
          </div>

          {/* LIVELLI */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 24,
            }}
          >
            {livelli.map((livello, i) => (
              <div
                key={i}
                onClick={() =>
                  apriIstituzione(
                    livello.titolo,
                    livello.istituzioni
                  )
                }
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 34,
                  border:
                    attiva === livello.titolo
                      ? '1px solid rgba(143,211,255,0.45)'
                      : '1px solid rgba(255,255,255,0.08)',
                  background:
                    attiva === livello.titolo
                      ? 'rgba(143,211,255,0.08)'
                      : 'rgba(255,255,255,0.03)',
                  padding: 32,
                  cursor: 'pointer',
                  transition: '0.35s',
                  backdropFilter: 'blur(18px)',
                }}
              >
                {/* Glow */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.7,
                    background:
                      'radial-gradient(circle at top left, rgba(143,211,255,0.18), transparent 55%)',
                  }}
                />

                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: 3,
                      color: '#8fd3ff',
                      marginBottom: 20,
                      fontWeight: 700,
                    }}
                  >
                    Livello istituzionale
                  </div>

                  <h2
                    style={{
                      fontSize: 32,
                      fontWeight: 900,
                      lineHeight: 1.05,
                      marginBottom: 18,
                    }}
                  >
                    {livello.titolo}
                  </h2>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.8,
                      fontSize: 15,
                    }}
                  >
                    {livello.descrizione}
                  </p>

                  <div
                    style={{
                      marginTop: 28,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      color: '#8fd3ff',
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    Esplora istituzioni
                    <span>→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ISTITUZIONI */}
          {istituzioniVisibili.length > 0 && (
            <div
              ref={istituzioniRef}
              style={{
                marginTop: 70,
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 18,
              }}
            >
              {/* HEADER SEZIONE */}
              <div
                style={{
                  gridColumn: '1 / -1',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: 3,
                    textTransform: 'uppercase',
                    color: '#8fd3ff',
                    marginBottom: 10,
                    fontWeight: 700,
                  }}
                >
                  Seleziona una istituzione
                </div>

                <h2
                  style={{
                    fontSize:
                      'clamp(28px, 4vw, 52px)',
                    fontWeight: 900,
                    lineHeight: 1,
                    marginBottom: 18,
                  }}
                >
                  {attiva}
                </h2>

                <p
                  style={{
                    color: 'rgba(255,255,255,0.62)',
                    lineHeight: 1.8,
                    maxWidth: 700,
                  }}
                >
                  Clicca una istituzione per ottenere
                  una spiegazione AI completa con:
                  ruolo, competenze, composizione,
                  fonti normative e articoli di
                  riferimento.
                </p>
              </div>

              {istituzioniVisibili.map(
                (istituzione, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      apriIstituzione(istituzione)
                    }
                    style={{
                      padding: 24,
                      borderRadius: 24,
                      cursor: 'pointer',
                      border:
                        attiva === istituzione
                          ? '1px solid rgba(143,211,255,0.45)'
                          : '1px solid rgba(255,255,255,0.08)',

                      background:
                        attiva === istituzione
                          ? 'rgba(143,211,255,0.08)'
                          : 'rgba(255,255,255,0.03)',

                      transition: '0.3s',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        color: '#8fd3ff',
                        marginBottom: 12,
                        fontWeight: 700,
                      }}
                    >
                      Istituzione
                    </div>

                    <div
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        lineHeight: 1.2,
                      }}
                    >
                      {istituzione}
                    </div>

                    <div
                      style={{
                        marginTop: 18,
                        color: '#8fd3ff',
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      Analizza con AI →
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* OUTPUT AI */}
          {(loadingAI || rispostaAI) && (
            <div
              style={{
                marginTop: 50,
                borderRadius: 30,
                border:
                  '1px solid rgba(255,255,255,0.08)',
                background:
                  'rgba(255,255,255,0.03)',
                padding: 32,
                backdropFilter: 'blur(18px)',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: '#8fd3ff',
                  marginBottom: 18,
                  fontWeight: 700,
                }}
              >
                Norma AI
              </div>

              {/* TITOLO ISTITUZIONE */}
{attiva && (
  <div
    style={{
      fontSize: 32,
      fontWeight: 900,
      lineHeight: 1.1,
      marginBottom: 26,
    }}
  >
    {attiva}
  </div>
)}

{loadingAI ? (
  <div
    style={{
      color: '#8fd3ff',
      fontSize: 16,
      fontWeight: 700,
    }}
  >
    Caricamento AI...
  </div>
) : (
  <p
    style={{
      color: 'rgba(255,255,255,0.82)',
      lineHeight: 1.9,
      whiteSpace: 'pre-wrap',
      fontSize: 16,
    }}
  >
    {rispostaAI}
  </p>
)}
</div>
)}
</div>
</div>

<Footer />
</>
);
}
