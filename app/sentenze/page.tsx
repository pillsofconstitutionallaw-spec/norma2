'use client';

import { useState } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const sentenze = [
  {
    numero: 'Sent. 1/1956',
    titolo: 'Primato della Costituzione',
    caso:
      'La Corte affronta il problema delle leggi anteriori alla Costituzione incompatibili con i principi costituzionali.',
    motivazione:
      'La Costituzione è fonte gerarchicamente superiore e anche le leggi precedenti devono conformarsi ad essa.',
  },

  {
    numero: 'Sent. 154/1985',
    titolo: 'Autonomia parlamentare',
    caso:
      'Si discuteva sulla possibilità per la Corte costituzionale di sindacare i regolamenti parlamentari.',
    motivazione:
      'La Corte afferma che i regolamenti parlamentari non sono generalmente sindacabili.',
  },

  {
    numero: 'Sent. 7/1996',
    titolo: 'Sfiducia individuale',
    caso:
      'La vicenda riguarda la mozione di sfiducia individuale verso un singolo ministro.',
    motivazione:
      'La Corte riconosce la compatibilità costituzionale della sfiducia individuale.',
  },

  {
    numero: 'Sent. 360/1996',
    titolo: 'Decreti-legge reiterati',
    caso:
      'Il Governo reiterava decreti-legge non convertiti mantenendo in vita norme provvisorie.',
    motivazione:
      'La reiterazione sistematica viola l’art. 77 Cost. perché altera il rapporto tra Governo e Parlamento.',
  },

  {
    numero: 'Sent. 200/2006',
    titolo: 'Potere di grazia',
    caso:
      'Conflitto tra Presidente della Repubblica e Ministro della Giustizia.',
    motivazione:
      'La grazia appartiene ai poteri del Presidente della Repubblica.',
  },

  {
    numero: 'Sent. 199/2012',
    titolo: 'Effetti del referendum',
    caso:
      'Ripristino di una disciplina sostanzialmente abrogata tramite referendum.',
    motivazione:
      'La Corte tutela l’effettività del referendum abrogativo.',
  },

  {
    numero: 'Sent. 1/2014',
    titolo: 'Porcellum',
    caso:
      'La Corte esamina premio di maggioranza e liste bloccate.',
    motivazione:
      'Violazione della rappresentatività e dell’eguaglianza del voto.',
  },

  {
    numero: 'Sent. 275/2016',
    titolo: 'Diritti sociali e bilancio',
    caso:
      'Prestazioni per persone con disabilità limitate da vincoli finanziari.',
    motivazione:
      'I diritti incomprimibili non possono essere sacrificati per esigenze di bilancio.',
  },

  {
    numero: 'Sent. 35/2017',
    titolo: 'Italicum',
    caso:
      'Controllo della legge elettorale Italicum.',
    motivazione:
      'La Corte elimina il premio di maggioranza sproporzionato.',
  },

  {
    numero: 'Ord. 17/2019',
    titolo: 'Maxiemendamento e fiducia',
    caso:
      'Compressione del dibattito parlamentare durante la legge di bilancio.',
    motivazione:
      'La Corte riconosce ampia autonomia interna delle Camere.',
  },

  {
    numero: 'Sent. 192/2024',
    titolo: 'Autonomia differenziata',
    caso:
      'Questioni sulla legge relativa all’autonomia differenziata.',
    motivazione:
      'La Corte dichiara illegittime varie disposizioni della legge.',
  },

  {
    numero: 'Ord. 10/2025',
    titolo: 'Referendum autonomia',
    caso:
      'Verifica di ammissibilità del referendum sulla legge 86/2024.',
    motivazione:
      'Il referendum viene dichiarato inammissibile.',
  },
];

export default function SentenzePage() {
  const [attiva, setAttiva] = useState<number | null>(null);

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top, #0f1b3d 0%, #050816 45%, #03050f 100%)',
          color: '#fff',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {/* HERO */}
        <section
          style={{
            padding: '90px 24px 50px',
          }}
        >
          <div
            style={{
              maxWidth: 1400,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 50,
              alignItems: 'center',
            }}
          >
            {/* TESTO */}
            <div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: 5,
                  textTransform: 'uppercase',
                  color: '#8fd3ff',
                  fontWeight: 700,
                  marginBottom: 24,
                }}
              >
                Corte Costituzionale
              </div>

              <h1
                style={{
                  fontSize: 'clamp(58px, 10vw, 120px)',
                  lineHeight: 0.9,
                  fontWeight: 900,
                  letterSpacing: -5,
                  marginBottom: 28,
                }}
              >
                SENTENZE
              </h1>

              <p
                style={{
                  maxWidth: 620,
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.9,
                  fontSize: 18,
                }}
              >
                Le decisioni che hanno scritto la
                storia della Repubblica, definito i
                limiti del potere e protetto i
                diritti fondamentali.
              </p>
            </div>

            {/* HERO IMAGE */}
            <div
              style={{
                position: 'relative',
                height: 520,
                borderRadius: 40,
                overflow: 'hidden',
                border:
                  '1px solid rgba(255,255,255,0.08)',
                background:
                  'linear-gradient(180deg, rgba(143,211,255,0.16), rgba(255,255,255,0.02))',
              }}
            >
              <img
                src="/consulta.jpg"
                alt="Corte Costituzionale"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.78,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(3,5,15,0.92), rgba(3,5,15,0.15))',
                }}
              />
            </div>
          </div>
        </section>

        {/* SENTENZE */}
        <section
          style={{
            padding: '20px 24px 220px',
          }}
        >
          <div
            style={{
              maxWidth: 1400,
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                marginBottom: 34,
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 1,
                  background:
                    'rgba(143,211,255,0.4)',
                }}
              />

              <div
                style={{
                  color: '#8fd3ff',
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Le decisioni più importanti
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 26,
              }}
            >
              {sentenze.map((sentenza, i) => {
                const aperta = attiva === i;

                return (
                  <div
                    key={i}
                    onClick={() =>
                      setAttiva(
                        aperta ? null : i
                      )
                    }
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 34,
                      padding: 32,
                      cursor: 'pointer',
                      transition: '0.35s',
                      minHeight: 340,

                      border:
                        aperta
                          ? '1px solid rgba(143,211,255,0.4)'
                          : '1px solid rgba(255,255,255,0.08)',

                      background:
                        aperta
                          ? 'rgba(143,211,255,0.08)'
                          : 'rgba(255,255,255,0.03)',

                      backdropFilter: 'blur(18px)',
                    }}
                  >
                    {/* GLOW */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'radial-gradient(circle at top left, rgba(143,211,255,0.16), transparent 55%)',
                        opacity: 0.8,
                      }}
                    />

                    <div
                      style={{
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      {/* HEADER CARD */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent:
                            'space-between',
                          gap: 20,
                          marginBottom: 30,
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 56,
                              lineHeight: 0.9,
                              fontWeight: 900,
                              color: '#8fd3ff',
                              letterSpacing: -3,
                              wordBreak:
                                'break-word',
                            }}
                          >
                            {sentenza.numero}
                          </div>
                        </div>

                        <div
                          style={{
                            width: 46,
                            height: 46,
                            flexShrink: 0,
                            borderRadius: 999,
                            border:
                              '1px solid rgba(143,211,255,0.3)',

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent:
                              'center',

                            color: '#8fd3ff',
                            fontSize: 24,
                          }}
                        >
                          →
                        </div>
                      </div>

                      {/* TITOLO */}
                      <h2
                        style={{
                          fontSize: 34,
                          lineHeight: 1,
                          fontWeight: 800,
                          marginBottom: 24,
                        }}
                      >
                        {sentenza.titolo}
                      </h2>

                      {/* MOTIVAZIONE */}
                      <p
                        style={{
                          color:
                            'rgba(255,255,255,0.68)',
                          lineHeight: 1.9,
                          fontSize: 15,
                        }}
                      >
                        {sentenza.motivazione}
                      </p>

                      {/* ESPANSIONE */}
                      {aperta && (
                        <div
                          style={{
                            marginTop: 34,
                            paddingTop: 28,
                            borderTop:
                              '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <div
                            style={{
                              color: '#8fd3ff',
                              fontSize: 12,
                              letterSpacing: 3,
                              textTransform:
                                'uppercase',
                              fontWeight: 700,
                              marginBottom: 14,
                            }}
                          >
                            Caso concreto
                          </div>

                          <p
                            style={{
                              color:
                                'rgba(255,255,255,0.82)',
                              lineHeight: 1.9,
                              fontSize: 15,
                              marginBottom: 28,
                            }}
                          >
                            {sentenza.caso}
                          </p>

                          <div
                            style={{
                              color: '#8fd3ff',
                              fontSize: 12,
                              letterSpacing: 3,
                              textTransform:
                                'uppercase',
                              fontWeight: 700,
                              marginBottom: 14,
                            }}
                          >
                            Motivazione
                          </div>

                          <p
                            style={{
                              color:
                                'rgba(255,255,255,0.82)',
                              lineHeight: 1.9,
                              fontSize: 15,
                            }}
                          >
                            {sentenza.motivazione}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}