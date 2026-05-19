'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const materie = [
  // ── DISPONIBILI ──
  { slug: 'diritto-privato', titolo: 'Diritto Privato', icona: '📘', colore: '#38bdf8', bg: 'rgba(56,189,248,0.1)', carte: 80 },
  { slug: 'diritto-costituzionale', titolo: 'Diritto Costituzionale', icona: '🏛️', colore: '#fb7185', bg: 'rgba(251,113,133,0.1)', carte: 59 },
  { slug: 'diritto-internazionale', titolo: 'Diritto Internazionale', icona: '🌐', colore: '#38bdf8', bg: 'rgba(56,189,248,0.1)', carte: 30 },
  { slug: 'diritto-internazionale-privato', titolo: 'Dir. Internazionale Privato', icona: '⚖️', colore: '#a78bfa', bg: 'rgba(167,139,250,0.1)', carte: 28 },
  { slug: 'diritto-romano', titolo: 'Diritto Romano', icona: '🏺', colore: '#e879f9', bg: 'rgba(232,121,249,0.1)', carte: 12 },
  { slug: 'diritto-del-lavoro', titolo: 'Diritto del Lavoro', icona: '👷', colore: '#22c55e', bg: 'rgba(34,197,94,0.1)', carte: 42 },

  // ── PLACEHOLDER ──
  { slug: 'diritto-penale', titolo: 'Diritto Penale', icona: '⚖️', colore: '#f97316', bg: 'rgba(249,115,22,0.1)', carte: null },
  { slug: 'diritto-amministrativo', titolo: 'Diritto Amministrativo', icona: '🏢', colore: '#facc15', bg: 'rgba(250,204,21,0.1)', carte: null },
  { slug: 'diritto-commerciale', titolo: 'Diritto Commerciale', icona: '💼', colore: '#38bdf8', bg: 'rgba(56,189,248,0.1)', carte: null },
  { slug: 'diritto-ue', titolo: 'Diritto UE', icona: '🇪🇺', colore: '#818cf8', bg: 'rgba(129,140,248,0.1)', carte: null },
  { slug: 'diritto-tributario', titolo: 'Diritto Tributario', icona: '💰', colore: '#fb7185', bg: 'rgba(251,113,133,0.1)', carte: null },
  { slug: 'diritto-processuale-civile', titolo: 'Procedura Civile', icona: '📋', colore: '#a78bfa', bg: 'rgba(167,139,250,0.1)', carte: null },
];

export default function StudioPage() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, padding: '24px 16px 40px', maxWidth: 600, margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Studio</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Flash Card</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Scegli una materia e inizia a studiare</p>
        </div>

        {/* Carica PDF con AI */}
        <div
          onClick={() => router.push('/studio/pdf')}
          style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(129,140,248,0.12))', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 20, padding: '20px', marginBottom: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <div style={{ fontSize: 36 }}>⚡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Genera con AI</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>Carica un PDF e l'AI crea flash card personalizzate</div>
          </div>
          <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>→</div>
        </div>

        {/* Materie disponibili */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>
          Materie disponibili
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {materie.filter(m => m.carte !== null).map(m => (
            <div
              key={m.slug}
              onClick={() => router.push(`/studio/${m.slug}`)}
              style={{ background: '#111526', borderRadius: 16, border: `1px solid ${m.colore}22`, padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.2s' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: m.bg, border: `1px solid ${m.colore}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {m.icona}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 3 }}>{m.titolo}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{m.carte} flash card</div>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>→</div>
            </div>
          ))}
        </div>

        {/* Materie in arrivo */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 14 }}>
          In arrivo
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {materie.filter(m => m.carte === null).map(m => (
            <div
              key={m.slug}
              style={{ background: '#0d1120', borderRadius: 14, border: '1px solid rgba(255,255,255,0.05)', padding: '14px', opacity: 0.5 }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{m.icona}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{m.titolo}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 3 }}>Presto disponibile</div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
