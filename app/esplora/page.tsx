'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Voce = {
  href: string;
  titolo: string;
  sub: string;
  colore: string;
  bg: string;
  icona: React.ReactNode;
};

type Gruppo = {
  id: string;
  titolo: string;
  accento: string;
  voci: Voce[];
};

const gruppi: Gruppo[] = [
  {
    id: 'studio',
    titolo: 'Studia e allenati',
    accento: '#ffd700',
    voci: [
      {
        href: '/studio',
        titolo: 'Studia',
        sub: 'Flash card per materia · Carica PDF · Test AI',
        colore: '#ffd700',
        bg: 'rgba(255,215,0,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        ),
      },
      {
        href: '/test',
        titolo: 'Test di Diritto',
        sub: '12 materie · 30 domande AI · 1 min/domanda',
        colore: '#8fd3ff',
        bg: 'rgba(143,211,255,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        ),
      },
      {
        href: '/consulenza',
        titolo: 'Consulenza Legale AI',
        sub: 'Descrivi il problema · trova l\'avvocato giusto · testo mail pronto',
        colore: '#8fd3ff',
        bg: 'rgba(143,211,255,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'norme',
    titolo: 'Norme e fonti',
    accento: '#f97316',
    voci: [
      {
        href: '/costituzione',
        titolo: 'Costituzione',
        sub: '139 articoli con spiegazioni chiare',
        colore: '#f97316',
        bg: 'rgba(249,115,22,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 3h10l4 4v14H3V3h4z" />
            <path d="M17 3v4h4" />
            <path d="M7 12h10M7 16h6" />
          </svg>
        ),
      },
      {
        href: '/codici',
        titolo: 'Codici',
        sub: 'Codice civile, penale, procedura civile e penale + AI',
        colore: '#8fd3ff',
        bg: 'rgba(143,211,255,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M8 7h8" />
            <path d="M8 11h8" />
            <path d="M8 15h5" />
          </svg>
        ),
      },
      {
        href: '/fonti',
        titolo: 'Fonti del Diritto',
        sub: 'Gerarchia delle fonti e sentenze reali',
        colore: '#ffd700',
        bg: 'rgba(255,215,0,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z" />
            <path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z" />
            <path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z" />
            <path d="M3 21H21" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'istituzioni',
    titolo: 'Istituzioni e giurisprudenza',
    accento: '#38bdf8',
    voci: [
      {
        href: '/istituzioni',
        titolo: 'Istituzioni',
        sub: 'Italia, UE e internazionale + AI',
        colore: '#38bdf8',
        bg: 'rgba(56,189,248,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" />
          </svg>
        ),
      },
      {
        href: '/corte-costituzionale',
        titolo: 'Corte Costituzionale',
        sub: 'Competenze · sentenze · conflitti · referendum',
        colore: '#f97316',
        bg: 'rgba(249,115,22,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z" />
            <path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z" />
            <path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z" />
            <path d="M3 21H21" />
          </svg>
        ),
      },
      {
        href: '/sentenze',
        titolo: 'Sentenze',
        sub: 'Corte Cost., Cassazione, CGUE',
        colore: '#22c55e',
        bg: 'rgba(34,197,94,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M9 13l2 2 4-4" />
          </svg>
        ),
      },
      {
        href: '/referendum',
        titolo: 'Referendum',
        sub: 'Referendum costituzionali e abrogativi · spiegazioni AI',
        colore: '#22c55e',
        bg: 'rgba(34,197,94,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'internazionale',
    titolo: 'Diritto internazionale ed europeo',
    accento: '#FFD700',
    voci: [
      {
        href: '/diritto-internazionale',
        titolo: 'Diritto Internazionale',
        sub: 'Fonti · dichiarazioni · trattati · sentenze',
        colore: '#22c55e',
        bg: 'rgba(34,197,94,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
        ),
      },
      {
        href: '/unione-europea',
        titolo: 'Unione Europea',
        sub: 'Istituzioni · trattati · bilancio · CGUE · CEDU',
        colore: '#FFD700',
        bg: 'rgba(255,215,0,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        ),
      },
      {
        href: '/onu',
        titolo: 'ONU',
        sub: 'Carta ONU · CdS · CIG · peacekeeping · agenzie',
        colore: '#38bdf8',
        bg: 'rgba(56,189,248,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'cultura',
    titolo: 'Cultura e approfondimenti',
    accento: '#a78bfa',
    voci: [
      {
        href: '/glossario',
        titolo: 'Glossario giuridico',
        sub: '1000 termini · definizioni chiare · ricerca per lettera',
        colore: '#a78bfa',
        bg: 'rgba(167,139,250,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M8 7h8M8 11h6" />
          </svg>
        ),
      },
      {
        href: '/articoli',
        titolo: 'Articoli',
        sub: 'Approfondimenti giuridici e analisi',
        colore: '#fb7185',
        bg: 'rgba(251,113,133,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        ),
      },
      {
        href: '/news',
        titolo: 'Ultime News',
        sub: 'Notizie giuridiche · aggiornate ogni ora · 4 fonti',
        colore: '#22c55e',
        bg: 'rgba(34,197,94,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8M15 18h-5M10 6h8v4h-8V6z" />
          </svg>
        ),
      },
      {
        href: '/cultura',
        titolo: 'Cultura Giuridica',
        sub: 'Film · libri · podcast per ogni giurista',
        colore: '#e879f9',
        bg: 'rgba(232,121,249,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e879f9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <circle cx="12" cy="10" r="2" />
            <path d="M9 13h6" />
          </svg>
        ),
      },
      {
        href: '/libri',
        titolo: 'Libri consigliati',
        sub: 'Manuali e codici commentati · Trova il prezzo minore',
        colore: '#fb7185',
        bg: 'rgba(251,113,133,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'storia',
    titolo: 'Storia e progetto',
    accento: '#a8c8f0',
    voci: [
      {
        href: '/costituzione-napoletana',
        titolo: 'Costituzione Napoletana',
        sub: 'Repubblica del 1799 · Pagano · l\'Eforato',
        colore: '#ffd700',
        bg: 'rgba(255,215,0,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        ),
      },
      {
        href: '/chi-siamo',
        titolo: 'Chi siamo',
        sub: 'Orizzonte Giuridico e Orizzonti del Diritto',
        colore: '#a8c8f0',
        bg: 'rgba(168,200,240,0.1)',
        icona: (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a8c8f0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20" />
          </svg>
        ),
      },
    ],
  },
];

export default function EsploraPage() {
  // Tutti i gruppi aperti di default: la pagina resta scansionabile,
  // ma ogni categoria si può chiudere per ridurre il rumore.
  const [aperti, setAperti] = useState<Record<string, boolean>>(
    () => Object.fromEntries(gruppi.map((g) => [g.id, true]))
  );

  const toggle = (id: string) =>
    setAperti((s) => ({ ...s, [id]: !s[id] }));

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
        html,
        body {
          overflow-x: hidden;
        }
        .voce-link:active {
          opacity: 0.7;
        }
        .gruppo-head {
          cursor: pointer;
          user-select: none;
        }
        .gruppo-head:active {
          opacity: 0.7;
        }
        .gruppo-corpo {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.28s ease;
        }
        .gruppo-corpo.aperto {
          grid-template-rows: 1fr;
        }
        .gruppo-corpo > .gruppo-inner {
          overflow: hidden;
        }
      `}</style>

      <div
        style={{
          fontFamily: 'Montserrat, sans-serif',
          background: '#0a0d18',
          minHeight: '100vh',
        }}
      >
        <Header />

        <div style={{ padding: '20px 16px 140px' }}>
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 3,
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Naviga
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.15,
                letterSpacing: -0.5,
              }}
            >
              Esplora
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {gruppi.map((g) => {
              const open = aperti[g.id];
              return (
                <div key={g.id}>
                  <div
                    className="gruppo-head"
                    onClick={() => toggle(g.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle(g.id);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '6px 4px 10px',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 99,
                        background: g.accento,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.55)',
                        flex: 1,
                      }}
                    >
                      {g.titolo}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.25)',
                      }}
                    >
                      {g.voci.length}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        flexShrink: 0,
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease',
                      }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>

                  <div className={`gruppo-corpo${open ? ' aperto' : ''}`}>
                    <div className="gruppo-inner">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 2 }}>
                        {g.voci.map((s) => (
                          <Link
                            key={s.href}
                            href={s.href}
                            className="voce-link"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 14,
                              padding: '16px',
                              borderRadius: 16,
                              background: '#111526',
                              border: '0.5px solid rgba(255,255,255,0.05)',
                              textDecoration: 'none',
                              width: '100%',
                            }}
                          >
                            <div
                              style={{
                                width: 52,
                                height: 52,
                                borderRadius: 14,
                                background: s.bg,
                                border: `0.5px solid ${s.colore}33`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {s.icona}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: 15,
                                  fontWeight: 800,
                                  color: '#fff',
                                  marginBottom: 4,
                                }}
                              >
                                {s.titolo}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: 'rgba(255,255,255,0.4)',
                                  lineHeight: 1.4,
                                }}
                              >
                                {s.sub}
                              </div>
                            </div>

                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth="2"
                              strokeLinecap="round"
                              style={{ flexShrink: 0 }}
                            >
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, marginBottom: 12 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 3,
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              La nostra rivista
            </div>
          </div>

          <a
            href="https://orizzontideldiritto.orizzontegiuridico.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #07162b, #0d2040)',
              border: '0.5px solid rgba(143,211,255,0.15)',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'rgba(143,211,255,0.1)',
                border: '0.5px solid rgba(143,211,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19V5H12V19M12 5H20V19" />
                <path d="M2 19H22" />
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                Orizzonti del Diritto
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                La rivista scientifica ufficiale
              </div>
            </div>

            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>

          <div style={{ marginTop: 8 }}>
            <a
              href="https://orizzontegiuridico.com"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px',
                borderRadius: 16,
                background: '#111526',
                border: '0.5px solid rgba(255,255,255,0.05)',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z" />
                </svg>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                  orizzontegiuridico.com
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                  Visita il sito ufficiale
                </div>
              </div>

              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ flexShrink: 0 }}
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
