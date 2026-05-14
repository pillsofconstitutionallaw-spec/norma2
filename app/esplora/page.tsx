'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const sezioni = [
  {
    href: '/costituzione',
    titolo: 'Costituzione',
    sub: '139 articoli con spiegazioni chiare',
    colore: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h10l4 4v14H3V3h4z"/>
        <path d="M17 3v4h4"/>
        <path d="M7 12h10M7 16h6"/>
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
        <path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z"/>
        <path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z"/>
        <path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z"/>
        <path d="M3 21H21"/>
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
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <path d="M14 2v6h6"/>
        <path d="M9 13l2 2 4-4"/>
      </svg>
    ),
  },
  {
    href: '/istituzioni',
    titolo: 'Istituzioni',
    sub: 'Italia, UE e internazionale + AI',
    colore: '#38bdf8',
    bg: 'rgba(56,189,248,0.1)',
    icona: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10"/>
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
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
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
        <circle cx="12" cy="8" r="4"/>
        <path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20"/>
      </svg>
    ),
  },
];

export default function EsploraPage() {
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
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'Montserrat, sans-serif' }}>
              Naviga
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5, fontFamily: 'Montserrat, sans-serif' }}>
              Esplora
            </div>
          </div>

          {/* CARD SEZIONI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sezioni.map((s, i) => (
              <button
                key={i}
                onClick={() => router.push(s.href)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', borderRadius: 16, background: '#111526', border: '0.5px solid rgba(255,255,255,0.05)', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: s.bg, border: `0.5px solid ${s.colore}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.icona}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4, fontFamily: 'Montserrat, sans-serif' }}>
                    {s.titolo}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.4 }}>
                    {s.sub}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            ))}
          </div>

          {/* SEZIONE RIVISTA */}
          <div style={{ marginTop: 24, marginBottom: 12 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'Montserrat, sans-serif' }}>
              La nostra rivista
            </div>
          </div>

          <a href="https://orizzontideldiritto.orizzontegiuridico.com" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #07162b, #0d2040)', border: '0.5px solid rgba(143,211,255,0.15)', textDecoration: 'none' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(143,211,255,0.1)', border: '0.5px solid rgba(143,211,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19V5H12V19M12 5H20V19"/><path d="M2 19H22"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4, fontFamily: 'Montserrat, sans-serif' }}>Orizzonti del Diritto</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.4 }}>La rivista scientifica ufficiale</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </a>

          <div style={{ marginTop: 8 }}>
            <a href="https://orizzontegiuridico.com" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', borderRadius: 16, background: '#111526', border: '0.5px solid rgba(255,255,255,0.05)', textDecoration: 'none' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4, fontFamily: 'Montserrat, sans-serif' }}>orizzontegiuridico.com</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.4 }}>Visita il sito ufficiale</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </a>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}