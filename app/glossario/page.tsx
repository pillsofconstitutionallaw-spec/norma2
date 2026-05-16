'use client';

import { useMemo, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { glossario } from './glossario';

const lettereDisponibili = [...new Set(glossario.map((t) => t.termine[0].toUpperCase()))].sort();

export default function GlossarioPage() {
  const [search, setSearch] = useState('');
  const [letteraAttiva, setLetteraAttiva] = useState<string | null>(null);
  const [aperti, setAperti] = useState<Record<string, boolean>>({});

  const filtrati = useMemo(() => {
    return glossario.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        t.termine.toLowerCase().includes(q) ||
        t.definizione.toLowerCase().includes(q) ||
        t.categoria.toLowerCase().includes(q);
      const matchLettera = !letteraAttiva || t.termine[0].toUpperCase() === letteraAttiva;
      return matchSearch && matchLettera;
    });
  }, [search, letteraAttiva]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof glossario> = {};
    filtrati.forEach((t) => {
      const l = t.termine[0].toUpperCase();
      if (!groups[l]) groups[l] = [];
      groups[l].push(t);
    });
    return groups;
  }, [filtrati]);

  function toggleTermine(termine: string) {
    setAperti((prev) => ({ ...prev, [termine]: !prev[termine] }));
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050816',
        color: '#fff',
        paddingBottom: 120,
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <Header />

      {/* HERO */}
      <div style={{ padding: '20px 16px 0' }}>
        <div
          style={{
            background: '#0d1829',
            borderRadius: 28,
            padding: '28px 24px',
            border: '0.5px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 99,
              padding: '4px 14px',
              fontSize: 9,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Diritto italiano
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: -1,
              color: '#fff',
              marginBottom: 10,
            }}
          >
            Glossario
            <br />
            giuridico
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            {glossario.length} termini · definizioni chiare · ricerca immediata
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Cerca un termine giuridico..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setLetteraAttiva(null);
            }}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.04)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              padding: '0 44px 0 18px',
              color: '#fff',
              fontSize: 13,
              outline: 'none',
              fontFamily: "'Montserrat', sans-serif",
              boxSizing: 'border-box',
            }}
          />
          <svg
            style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.3)" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* FILTRO LETTERE */}
      {!search && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: '12px 16px 0',
            flexWrap: 'wrap',
          }}
        >
          {lettereDisponibili.map((l) => (
            <button
              key={l}
              onClick={() => setLetteraAttiva(letteraAttiva === l ? null : l)}
              style={{
                padding: '6px 11px',
                borderRadius: 9,
                background: letteraAttiva === l ? 'rgba(143,211,255,0.1)' : 'rgba(255,255,255,0.04)',
                border: `0.5px solid ${letteraAttiva === l ? 'rgba(143,211,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
                color: letteraAttiva === l ? '#8fd3ff' : 'rgba(255,255,255,0.4)',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {/* TERMINI */}
      <div style={{ padding: '20px 16px 0' }}>
        {Object.entries(grouped).map(([lettera, termini]) => (
          <div key={lettera}>
            {/* LABEL LETTERA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
                marginTop: 8,
              }}
            >
              <div style={{ width: 24, height: 1, background: 'rgba(143,211,255,0.4)' }} />
              <span
                style={{
                  color: '#8fd3ff',
                  fontSize: 9,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  fontWeight: 800,
                }}
              >
                {lettera}
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
            </div>

            {termini.map((t) => (
              <div
                key={t.termine}
                style={{
                  marginBottom: 10,
                  background: '#0d1829',
                  borderRadius: 18,
                  border: '0.5px solid rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}
              >
                {/* HEADER TERMINE */}
                <div
                  onClick={() => toggleTermine(t.termine)}
                  style={{
                    padding: '16px 18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: '#fff',
                        marginBottom: 3,
                      }}
                    >
                      {t.termine}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        color: '#8fd3ff',
                      }}
                    >
                      {t.categoria}
                    </div>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.3)',
                      fontSize: 14,
                      flexShrink: 0,
                      transform: aperti[t.termine] ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  >
                    ▾
                  </div>
                </div>

                {/* DEFINIZIONE */}
                {aperti[t.termine] && (
                  <div
                    style={{
                      padding: '0 18px 16px',
                      borderTop: '0.5px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.65)',
                        fontSize: 12.5,
                        lineHeight: 1.9,
                        marginTop: 12,
                      }}
                    >
                      {t.definizione}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {filtrati.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.3)',
              fontSize: 13,
              marginTop: 40,
            }}
          >
            Nessun termine trovato
          </div>
        )}
      </div>

      <Footer />

      <style>{`
        input[type="text"]::placeholder {
          color: rgba(255,255,255,0.25);
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </div>
  );
}