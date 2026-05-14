'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const materie = [
  {
    slug: 'costituzionale',
    titolo: 'Diritto Costituzionale',
    sub: '30 domande · 1 min/domanda',
    colore: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h10l4 4v14H3V3h4z"/>
        <path d="M17 3v4h4"/>
        <path d="M7 12h10M7 16h6"/>
      </svg>
    ),
  },
  {
    slug: 'civile',
    titolo: 'Diritto Civile',
    sub: '30 domande · 1 min/domanda',
    colore: '#38bdf8',
    bg: 'rgba(56,189,248,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z"/>
        <path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z"/>
        <path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z"/>
        <path d="M3 21H21"/>
      </svg>
    ),
  },
  {
    slug: 'penale',
    titolo: 'Diritto Penale',
    sub: '30 domande · 1 min/domanda',
    colore: '#f87171',
    bg: 'rgba(239,68,68,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L19 6V11C19 16 15.5 20 12 21C8.5 20 5 16 5 11V6L12 3Z"/>
      </svg>
    ),
  },
  {
    slug: 'amministrativo',
    titolo: 'Diritto Amministrativo',
    sub: '30 domande · 1 min/domanda',
    colore: '#4ade80',
    bg: 'rgba(34,197,94,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10"/>
      </svg>
    ),
  },
  {
    slug: 'lavoro',
    titolo: 'Diritto del Lavoro',
    sub: '30 domande · 1 min/domanda',
    colore: '#c084fc',
    bg: 'rgba(168,85,247,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    slug: 'commerciale',
    titolo: 'Diritto Commerciale',
    sub: '30 domande · 1 min/domanda',
    colore: '#fbbf24',
    bg: 'rgba(251,191,36,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3,17 8,12 13,14 21,6"/>
        <polyline points="17,6 21,6 21,10"/>
      </svg>
    ),
  },
  {
    slug: 'europeo',
    titolo: 'Diritto dell\'Unione Europea',
    sub: '30 domande · 1 min/domanda',
    colore: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z"/>
      </svg>
    ),
  },
  {
    slug: 'processuale-civile',
    titolo: 'Diritto Processuale Civile',
    sub: '30 domande · 1 min/domanda',
    colore: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <path d="M14 2v6h6"/>
        <path d="M9 13l2 2 4-4"/>
      </svg>
    ),
  },
  {
    slug: 'processuale-penale',
    titolo: 'Diritto Processuale Penale',
    sub: '30 domande · 1 min/domanda',
    colore: '#fb923c',
    bg: 'rgba(251,146,60,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    slug: 'internazionale',
    titolo: 'Diritto Internazionale',
    sub: '30 domande · 1 min/domanda',
    colore: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z"/>
        <circle cx="12" cy="12" r="2" fill="#a78bfa" opacity="0.5"/>
      </svg>
    ),
  },
  {
    slug: 'romano',
    titolo: 'Istituzioni di Diritto Romano',
    sub: '30 domande · 1 min/domanda',
    colore: '#e879f9',
    bg: 'rgba(232,121,249,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e879f9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10"/>
        <line x1="12" y1="3" x2="12" y2="7"/>
      </svg>
    ),
  },
  {
    slug: 'filosofia',
    titolo: 'Filosofia del Diritto',
    sub: '30 domande · 1 min/domanda',
    colore: '#94a3b8',
    bg: 'rgba(148,163,184,0.1)',
    icona: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
  },
];

export default function TestPage() {
  const router = useRouter();

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        <div style={{ padding: '20px 16px 140px' }}>

          {/* TITOLO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>
              Allenati
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5 }}>
              Test di Diritto
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6, lineHeight: 1.5 }}>
              30 domande generate dall'AI · 1 minuto per risposta
            </div>
          </div>

          {/* LISTA MATERIE */}
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12 }}>
            Scegli una materia
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {materie.map((m, i) => (
              <button
                key={i}
                onClick={() => router.push(`/test/${m.slug}`)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16, background: '#111526', border: '0.5px solid rgba(255,255,255,0.05)', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                <div style={{ width: 46, height: 46, borderRadius: 13, background: m.bg, border: `0.5px solid ${m.colore}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {m.icona}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{m.titolo}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{m.sub}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}