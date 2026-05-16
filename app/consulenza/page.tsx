'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Risultato = {
  materia: string;
  specializzazione: string;
  analisi: string;
  urgenza: 'alta' | 'media' | 'bassa';
  consigli: string[];
  testo_mail: string;
  query_google: string;
  query_cnf: string;
};

const URGENZA_COLORE = {
  alta: '#fb7185',
  media: '#ffd700',
  bassa: '#22c55e',
};

const URGENZA_LABEL = {
  alta: 'Urgenza alta',
  media: 'Urgenza media',
  bassa: 'Non urgente',
};

export default function ConsulenzaPage() {
  const [citta, setCitta] = useState('');
  const [cap, setCap] = useState('');
  const [problema, setProblema] = useState('');
  const [loading, setLoading] = useState(false);
  const [risultato, setRisultato] = useState<Risultato | null>(null);
  const [errore, setErrore] = useState('');
  const [copiato, setCopiato] = useState(false);

  async function handleSubmit() {
    if (!citta.trim() || problema.trim().length < 20) {
      setErrore('Inserisci la città e descrivi il problema (almeno 20 caratteri).');
      return;
    }
    setErrore('');
    setLoading(true);
    setRisultato(null);

    try {
      const res = await fetch('/api/consulenza', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citta, cap, problema }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrore(data.error ?? 'Errore imprevisto. Riprova.');
        return;
      }

      setRisultato(data);
    } catch {
      setErrore('Errore di connessione. Controlla la tua rete e riprova.');
    } finally {
      setLoading(false);
    }
  }

  function copiaMail() {
    if (!risultato) return;
    navigator.clipboard.writeText(risultato.testo_mail).then(() => {
      setCopiato(true);
      setTimeout(() => setCopiato(false), 2500);
    });
  }

  function apriGoogle() {
    if (!risultato) return;
    const query = encodeURIComponent(`${risultato.query_google} ${citta}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }

  function apriCNF() {
    if (!risultato) return;
    const query = encodeURIComponent(citta);
    window.open(`https://www.consiglionazionaleforense.it/albo/avvocati?comune=${query}`, '_blank');
  }

  function reset() {
    setRisultato(null);
    setProblema('');
    setCitta('');
    setCap('');
    setErrore('');
  }

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        textarea, input {
          outline: none;
          font-family: Montserrat, sans-serif;
        }
        textarea::placeholder, input::placeholder {
          color: rgba(255,255,255,0.2);
          font-family: Montserrat, sans-serif;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        <div style={{ padding: '28px 16px 140px' }}>

          {/* HERO */}
          <div style={{
            background: 'linear-gradient(135deg, #0d1829, #111a2e)',
            borderRadius: 24, padding: '24px 20px',
            border: '0.5px solid rgba(143,211,255,0.15)',
            marginBottom: 24, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 160, height: 160, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(143,211,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              display: 'inline-block',
              border: '1px solid rgba(143,211,255,0.25)',
              borderRadius: 99, padding: '4px 14px',
              fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' as const,
              color: '#8fd3ff', fontWeight: 700, marginBottom: 14,
            }}>
              Powered by AI
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 8 }}>
              Consulenza<br />Legale
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
              Descrivi il tuo problema. L'AI identifica la materia, ti genera il testo della mail
              da mandare all'avvocato e trova i professionisti giusti nella tua città.
            </div>
          </div>

          {!risultato ? (
            /* ── FORM ─────────────────────────────────────────────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Città + CAP */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, marginBottom: 8 }}>
                    Città
                  </div>
                  <input
                    type="text"
                    value={citta}
                    onChange={(e) => setCitta(e.target.value)}
                    placeholder="Es. Milano"
                    style={{
                      width: '100%', height: 48,
                      background: '#111526',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                      borderRadius: 14, padding: '0 14px',
                      color: '#fff', fontSize: 14, fontWeight: 600,
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, marginBottom: 8 }}>
                    CAP
                  </div>
                  <input
                    type="text"
                    value={cap}
                    onChange={(e) => setCap(e.target.value)}
                    placeholder="00100"
                    maxLength={5}
                    style={{
                      width: 80, height: 48,
                      background: '#111526',
                      border: '0.5px solid rgba(255,255,255,0.08)',
                      borderRadius: 14, padding: '0 12px',
                      color: '#fff', fontSize: 13, fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              {/* Problema */}
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, marginBottom: 8 }}>
                  Descrivi il tuo problema
                </div>
                <textarea
                  value={problema}
                  onChange={(e) => setProblema(e.target.value)}
                  placeholder="Spiega la tua situazione nel modo più dettagliato possibile. Più informazioni dai, più precisa sarà l'analisi..."
                  rows={7}
                  style={{
                    width: '100%',
                    background: '#111526',
                    border: '0.5px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: '14px',
                    color: '#fff', fontSize: 13, lineHeight: 1.7,
                    resize: 'none',
                  }}
                />
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 6, textAlign: 'right' }}>
                  {problema.length} caratteri {problema.length < 20 && problema.length > 0 && '(minimo 20)'}
                </div>
              </div>

              {/* Errore */}
              {errore && (
                <div style={{
                  background: 'rgba(251,113,133,0.08)',
                  border: '0.5px solid rgba(251,113,133,0.25)',
                  borderRadius: 12, padding: '12px 14px',
                  fontSize: 12.5, color: '#fb7185', lineHeight: 1.6,
                }}>
                  {errore}
                </div>
              )}

              {/* Avviso privacy */}
              <div style={{
                background: 'rgba(255,215,0,0.05)',
                border: '0.5px solid rgba(255,215,0,0.15)',
                borderRadius: 12, padding: '12px 14px',
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#ffd700" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  Questo strumento non sostituisce una consulenza legale professionale.
                  Non inserire dati sensibili come nomi, indirizzi o dettagli identificativi.
                </div>
              </div>

              {/* Bottone */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%', height: 52,
                  borderRadius: 16,
                  background: loading ? 'rgba(143,211,255,0.08)' : 'rgba(143,211,255,0.12)',
                  border: `0.5px solid rgba(143,211,255,${loading ? '0.15' : '0.3'})`,
                  color: loading ? 'rgba(143,211,255,0.4)' : '#8fd3ff',
                  fontSize: 13, fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  animation: loading ? 'pulse 1.5s ease-in-out infinite' : 'none',
                }}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(143,211,255,0.4)" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Analisi in corso...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#8fd3ff" strokeWidth="2" strokeLinecap="round">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Analizza il problema
                  </>
                )}
              </button>
            </div>

          ) : (
            /* ── RISULTATO ─────────────────────────────────────────────────── */
            <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Materia + urgenza */}
              <div style={{
                background: '#111526',
                borderRadius: 20, padding: '18px 16px',
                border: '0.5px solid rgba(143,211,255,0.2)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(143,211,255,0.6)', fontWeight: 700, marginBottom: 6 }}>
                      Materia individuata
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
                      {risultato.materia}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                      Cerca un {risultato.specializzazione}
                    </div>
                  </div>
                  <div style={{
                    background: `${URGENZA_COLORE[risultato.urgenza]}14`,
                    border: `0.5px solid ${URGENZA_COLORE[risultato.urgenza]}40`,
                    borderRadius: 10, padding: '6px 10px',
                    fontSize: 9, fontWeight: 800,
                    color: URGENZA_COLORE[risultato.urgenza],
                    textTransform: 'uppercase' as const,
                    letterSpacing: 1, flexShrink: 0, textAlign: 'center' as const,
                  }}>
                    {URGENZA_LABEL[risultato.urgenza]}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(143,211,255,0.05)',
                  borderRadius: 12, padding: '12px',
                  fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75,
                }}>
                  {risultato.analisi}
                </div>
              </div>

              {/* Consigli */}
              <div style={{
                background: '#111526', borderRadius: 18,
                border: '0.5px solid rgba(255,255,255,0.06)', padding: '16px',
              }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.28)', fontWeight: 700, marginBottom: 12 }}>
                  Cosa fare subito
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {risultato.consigli.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(143,211,255,0.1)',
                        border: '0.5px solid rgba(143,211,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 900, color: '#8fd3ff',
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                        {c}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testo mail */}
              <div style={{
                background: '#111526', borderRadius: 18,
                border: '0.5px solid rgba(255,255,255,0.06)', padding: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.28)', fontWeight: 700 }}>
                    Testo da inviare all'avvocato
                  </div>
                  <button
                    onClick={copiaMail}
                    style={{
                      background: copiato ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                      border: `0.5px solid ${copiato ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 8, padding: '5px 10px',
                      color: copiato ? '#22c55e' : 'rgba(255,255,255,0.45)',
                      fontSize: 10, fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'Montserrat, sans-serif',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      {copiato
                        ? <path d="M20 6L9 17l-5-5" />
                        : <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>
                      }
                    </svg>
                    {copiato ? 'Copiato!' : 'Copia'}
                  </button>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '0.5px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: '14px',
                  fontSize: 12.5, color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.85, whiteSpace: 'pre-wrap' as const,
                  fontFamily: 'monospace',
                }}>
                  {risultato.testo_mail}
                </div>
              </div>

              {/* Trova avvocati */}
              <div style={{
                background: '#111526', borderRadius: 18,
                border: '0.5px solid rgba(255,255,255,0.06)', padding: '16px',
              }}>
                <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.28)', fontWeight: 700, marginBottom: 12 }}>
                  Trova avvocati a {citta}
                </div>

                <button
                  onClick={apriGoogle}
                  style={{
                    width: '100%', height: 48, borderRadius: 14,
                    background: 'rgba(249,115,22,0.08)',
                    border: '0.5px solid rgba(249,115,22,0.25)',
                    color: '#f97316', fontSize: 13, fontWeight: 800,
                    cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#f97316" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  Cerca su Google
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(249,115,22,0.5)" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </button>

                <button
                  onClick={apriCNF}
                  style={{
                    width: '100%', height: 48, borderRadius: 14,
                    background: 'rgba(143,211,255,0.07)',
                    border: '0.5px solid rgba(143,211,255,0.2)',
                    color: '#8fd3ff', fontSize: 13, fontWeight: 800,
                    cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#8fd3ff" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" />
                  </svg>
                  Albo CNF ufficiale
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(143,211,255,0.4)" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </button>

                <div style={{ marginTop: 10, fontSize: 10.5, color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
                  Query ottimizzata per il tuo caso:{' '}
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                    "{risultato.query_google} {citta}"
                  </span>
                </div>
              </div>

              {/* Nuova analisi */}
              <button
                onClick={reset}
                style={{
                  width: '100%', height: 46, borderRadius: 14,
                  background: 'rgba(255,255,255,0.04)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.35)',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                ← Nuova analisi
              </button>

              {/* Disclaimer */}
              <div style={{
                background: 'rgba(255,215,0,0.04)',
                border: '0.5px solid rgba(255,215,0,0.12)',
                borderRadius: 12, padding: '12px 14px',
                fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.65,
              }}>
                Questo strumento fornisce indicazioni orientative e non costituisce consulenza legale.
                Rivolgiti sempre a un avvocato iscritto all'albo per assistenza professionale.
              </div>

            </div>
          )}

        </div>

        <Footer />
      </div>
    </>
  );
}