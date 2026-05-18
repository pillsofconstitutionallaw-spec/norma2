'use client';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const codici = [
  {
    href: '/codici/codice-ambiente',
    titolo: "Codice dell'Ambiente",
    sub: 'D.Lgs. 3 aprile 2006, n. 152 · 318 articoli',
    colore: '#16a34a',
    bg: 'rgba(22,163,74,0.1)',
    articoli: 318,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10z" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
    libri: ['Parte I — Disposizioni comuni', 'Parte II — VIA-VAS-AIA', 'Parte III — Acque e suolo', 'Parte IV — Rifiuti', 'Parte V — Aria', 'Parte VI — Danno ambientale'],
  },
  {
    href: '/codici/codice-antimafia',
    titolo: 'Codice Antimafia',
    sub: 'D.Lgs. 6 settembre 2011, n. 159 · 152 articoli',
    colore: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    articoli: 152,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" />
      </svg>
    ),
    libri: ['Misure di prevenzione', 'Documentazione antimafia'],
  },
  {
    href: '/codici/codice-appalti',
    titolo: 'Codice Appalti',
    sub: 'D.Lgs. 31 marzo 2023, n. 36 · 229 articoli',
    colore: '#eab308',
    bg: 'rgba(234,179,8,0.1)',
    articoli: 229,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7h18M6 3h12v18H6z" />
      </svg>
    ),
    libri: ['Principi', 'Contratti pubblici', 'Esecuzione'],
  },
  {
    href: '/codici/beni-culturali',
    titolo: 'Codice dei Beni Culturali',
    sub: 'D.Lgs. 22 gennaio 2004, n. 42 · 184 articoli',
    colore: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    articoli: 184,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
      </svg>
    ),
    libri: ['Tutela', 'Valorizzazione', 'Paesaggio'],
  },
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
    libri: ['Libro I — Persone e famiglia', 'Libro II — Successioni', 'Libro III — Proprietà', 'Libro IV — Obbligazioni', 'Libro V — Lavoro', 'Libro VI — Tutela dei diritti'],
  },
  {
    href: '/codici/codice-consumo',
    titolo: 'Codice del Consumo',
    sub: 'D.Lgs. 6 settembre 2005, n. 206 · 146 articoli',
    colore: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
    articoli: 146,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6h15l-1.5 9h-12z" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
    ),
    libri: ['Consumatori', 'Contratti', 'Garanzie'],
  },
  {
    href: '/codici/codice-contratti-pubblici',
    titolo: 'Codice dei Contratti Pubblici',
    sub: 'D.Lgs. 31 marzo 2023, n. 36 · 229 articoli',
    colore: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    articoli: 229,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    libri: ['Libro I — Contratti pubblici in generale', 'Libro II — Lavori, servizi e forniture', 'Libro III — Settori speciali', 'Libro IV — Partenariato pubblico privato'],
  },
  {
    href: '/codici/giustizia-contabile',
    titolo: 'Codice della Giustizia Contabile',
    sub: 'D.Lgs. 26 agosto 2016, n. 174 · 220 articoli',
    colore: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    articoli: 220,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3V21M12 3L5 7M12 3L19 7M5 7L2 14c0 2 1.5 3 3 3s3-1 3-3L5 7zM19 7l3 7c0 2-1.5 3-3 3s-3-1-3-3l3-7zM3 21h18" />
      </svg>
    ),
    libri: ['Giudizi di responsabilità', 'Giudizi di conto', 'Impugnazioni'],
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
    libri: ['Parte Generale', 'Parte Speciale'],
  },
  {
    href: '/codici/codice-privacy',
    titolo: 'Codice Privacy',
    sub: 'D.Lgs. 30 giugno 2003, n. 196 · 186 articoli',
    colore: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
    articoli: 186,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" />
      </svg>
    ),
    libri: ['Trattamento dati', 'Diritti', 'Sicurezza'],
  },
  {
    href: '/codici/processo-amministrativo',
    titolo: 'Codice del Processo Amministrativo',
    sub: 'D.Lgs. 2 luglio 2010, n. 104 · 134 articoli',
    colore: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    articoli: 134,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M3 12h18M3 18h18" />
        <path d="M7 3v18" />
      </svg>
    ),
    libri: ['Libro I — Disposizioni generali', 'Libro II — Processo di primo grado', 'Libro III — Impugnazioni', 'Libro IV — Ottemperanza'],
  },
  {
    href: '/codici/processo-tributario',
    titolo: 'Codice del Processo Tributario',
    sub: 'D.Lgs. 31 dicembre 1992, n. 546 · 80 articoli',
    colore: '#ffd700',
    bg: 'rgba(255,215,0,0.1)',
    articoli: 80,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    libri: ['Titolo I — Disposizioni generali', 'Titolo II — Il processo', 'Titolo III — Impugnazioni'],
  },
  {
    href: '/codici/procedura-civile',
    titolo: 'Codice di Procedura Civile',
    sub: 'R.D. 28 ottobre 1940, n. 1443 · 840 articoli',
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
    libri: ['Disposizioni generali', 'Processo di cognizione', 'Processo di esecuzione', 'Procedimenti speciali'],
  },
  {
    href: '/codici/procedura-penale',
    titolo: 'Codice di Procedura Penale',
    sub: 'D.P.R. 22 settembre 1988, n. 447 · 746 articoli',
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
    libri: ['Soggetti', 'Atti', 'Indagini preliminari', 'Udienza preliminare', 'Giudizio', 'Impugnazioni'],
  },
  {
    href: '/codici/codice-strada',
    titolo: 'Codice della Strada',
    sub: 'D.Lgs. 30 aprile 1992, n. 285 · 240 articoli',
    colore: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    articoli: 240,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M8 6h8" />
        <path d="M8 18h8" />
      </svg>
    ),
    libri: ['Circolazione', 'Segnaletica', 'Sanzioni'],
  },
  {
    href: '/codici/codice-terzo-settore',
    titolo: 'Codice del Terzo Settore',
    sub: 'D.Lgs. 3 luglio 2017, n. 117 · 104 articoli',
    colore: '#84cc16',
    bg: 'rgba(132,204,22,0.1)',
    articoli: 104,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-6-4.35-9-8a5.5 5.5 0 018-7 5.5 5.5 0 018 7c-3 3.65-9 8-9 8z" />
      </svg>
    ),
    libri: ['ETS', 'Volontariato', 'Impresa sociale'],
  },
  {
    href: '/codici/codice-turismo',
    titolo: 'Codice del Turismo',
    sub: 'D.Lgs. 23 maggio 2011, n. 79 · 69 articoli',
    colore: '#14b8a6',
    bg: 'rgba(20,184,166,0.1)',
    articoli: 69,
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20h18" />
        <path d="M6 20V10l6-4 6 4v10" />
      </svg>
    ),
    libri: ['Imprese turistiche', 'Contratti', 'Tutela turista'],
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
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>
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
          <div style={{ background: '#111526', borderRadius: 16, padding: '14px 16px', border: '0.5px solid rgba(255,255,255,0.05)', marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap' as const }}>
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
              <Link key={c.href} href={c.href} className="codice-link" style={{ textDecoration: 'none' }}>
                <div style={{ background: '#111526', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.05)', overflow: 'hidden', padding: '18px 16px', display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 54, height: 54, borderRadius: 14, flexShrink: 0, background: c.bg, border: `0.5px solid ${c.colore}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.icona}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{c.titolo}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{c.sub}</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                  {/* Tag libri */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                    {c.libri.map((l, i) => (
                      <div key={i} style={{ background: `${c.colore}0c`, border: `0.5px solid ${c.colore}25`, borderRadius: 6, padding: '3px 8px', fontSize: 9.5, fontWeight: 600, color: `${c.colore}cc` }}>
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* NOTA */}
          <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.05)', borderRadius: 14, padding: '14px 16px', fontSize: 11, color: 'rgba(255,255,255,0.28)', lineHeight: 1.7 }}>
            I testi sono estratti da Normattiva.it (fonte ufficiale del Governo italiano) e aggiornati alla vigenza corrente. Le spiegazioni AI sono generate da Groq e hanno scopo didattico.
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}