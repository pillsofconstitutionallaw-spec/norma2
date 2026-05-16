'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const codici = [
  {
    href: '/codici/codice-civile',
    titolo: 'Codice Civile',
    sub: 'R.D. 16 marzo 1942, n. 262 · 2969 articoli',
    colore: '#38bdf8',
    bg: 'rgba(56,189,248,0.1)',
    articoli: 2969,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8M8 11h6M8 15h4" />
      </svg>
    ),
    libri: [
      'Libro I — Persone e famiglia',
      'Libro II — Successioni',
      'Libro III — Proprietà',
      'Libro IV — Obbligazioni',
      'Libro V — Lavoro',
      'Libro VI — Tutela dei diritti',
    ],
  },
  {
    href: '/codici/codice-penale',
    titolo: 'Codice Penale',
    sub: 'R.D. 19 ottobre 1930, n. 1398 · 734 articoli',
    colore: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    articoli: 734,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z" />
        <path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z" />
        <path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z" />
        <path d="M3 21H21" />
      </svg>
    ),
    libri: [
      'Parte Generale',
      'Parte Speciale',
    ],
  },
  {
    href: '/codici/procedura-civile',
    titolo: 'Codice di Procedura Civile',
    sub: 'R.D. 28 ottobre 1940, n. 1443',
    colore: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    articoli: 840,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
    libri: [
      'Disposizioni generali',
      'Processo di cognizione',
      'Processo di esecuzione',
      'Procedimenti speciali',
    ],
  },
  {
    href: '/codici/procedura-penale',
    titolo: 'Codice di Procedura Penale',
    sub: 'D.P.R. 22 settembre 1988, n. 447',
    colore: '#fb7185',
    bg: 'rgba(251,113,133,0.1)',
    articoli: 746,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 13l2 2 4-4" />
      </svg>
    ),
    libri: [
      'Soggetti',
      'Atti',
      'Indagini preliminari',
      'Udienza preliminare',
      'Giudizio',
      'Impugnazioni',
    ],
  },
];

export default function CodiciPage() {
  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        .codice-link:active { opacity: 0.7; }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        <div style={{ padding: '20px 16px 140px' }}>

          {/* HERO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: 3,
              color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Diritto italiano
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 8 }}>
              I Codici
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
              Testo vigente aggiornato · spiegazione AI articolo per articolo · giurisprudenza collegata
            </div>
          </div>

          {/* FUNZIONALITÀ */}
          <div style={{
            background: '#111526',
            borderRadius: 16, padding: '14px 16px',
            border: '0.5px solid rgba(255,255,255,0.05)',
            marginBottom: 20,
            display: 'flex', gap: 16, flexWrap: 'wrap' as const,
          }}>
            {[
              { icona: '💡', label: 'Spiega AI', desc: 'Ogni articolo spiegato in chiaro' },
              { icona: '⚖️', label: 'Giurisprudenza', desc: 'Sentenze collegate' },
              { icona: '🎧', label: 'Ascolta', desc: 'Lettura vocale' },
              { icona: '🔖', label: 'Salva', desc: 'Articoli preferiti' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{f.icona}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{f.label}</div>
                  <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.35)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* LISTA CODICI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {codici.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="codice-link"
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#111526',
                  borderRadius: 20,
                  border: `0.5px solid rgba(255,255,255,0.05)`,
                  overflow: 'hidden',
                  padding: '18px 16px',
                  display: 'flex',
                  flexDirection: 'column' as const,
                  gap: 14,
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 54, height: 54, borderRadius: 14, flexShrink: 0,
                      background: c.bg,
                      border: `0.5px solid ${c.colore}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {c.icona}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                        {c.titolo}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                        {c.sub}
                      </div>
                    </div>

                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"
                      style={{ flexShrink: 0 }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>

                  {/* Tag libri */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                    {c.libri.map((l, i) => (
                      <div key={i} style={{
                        background: `${c.colore}0c`,
                        border: `0.5px solid ${c.colore}25`,
                        borderRadius: 6, padding: '3px 8px',
                        fontSize: 9.5, fontWeight: 600,
                        color: `${c.colore}cc`,
                      }}>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* NOTA */}
          <div style={{
            marginTop: 20,
            background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid rgba(255,255,255,0.05)',
            borderRadius: 14, padding: '14px 16px',
            fontSize: 11, color: 'rgba(255,255,255,0.28)', lineHeight: 1.7,
          }}>
            I testi sono estratti da Normattiva.it (fonte ufficiale del Governo italiano) e aggiornati alla vigenza corrente. Le spiegazioni AI sono generate da Groq e hanno scopo didattico.
          </div>

        </div>

        <Footer />
      </div>
    </>
  );
}