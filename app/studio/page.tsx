'use client';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const materie = [
  // ── DISPONIBILI ──
  { slug: 'diritto-privato', titolo: 'Diritto Privato', icona: '📘', colore: '#0284c7', bg: 'rgba(56,189,248,0.1)', carte: 80 },
  { slug: 'diritto-costituzionale', titolo: 'Diritto Costituzionale', icona: '🏛️', colore: '#e11d48', bg: 'rgba(251,113,133,0.1)', carte: 59 },
  { slug: 'diritto-internazionale', titolo: 'Diritto Internazionale', icona: '🌐', colore: '#0284c7', bg: 'rgba(56,189,248,0.1)', carte: 292 },
  { slug: 'diritto-internazionale-privato', titolo: 'Dir. Internazionale Privato', icona: '⚖️', colore: '#7c3aed', bg: 'rgba(167,139,250,0.1)', carte: 28 },
  { slug: 'diritto-romano', titolo: 'Diritto Romano', icona: '🏺', colore: '#c026d3', bg: 'rgba(232,121,249,0.1)', carte: 56 },
  { slug: 'diritto-del-lavoro', titolo: 'Diritto del Lavoro', icona: '👷', colore: '#16a34a', bg: 'rgba(34,197,94,0.1)', carte: 42 },
  { slug: 'diritto-penale', titolo: 'Diritto Penale', icona: '⚖️', colore: '#dc2626', bg: 'rgba(248,113,113,0.1)', carte: 50 },
  { slug: 'diritto-amministrativo', titolo: 'Diritto Amministrativo', icona: '🏢', colore: '#facc15', bg: 'rgba(250,204,21,0.1)', carte: 50 },
  { slug: 'diritto-commerciale', titolo: 'Diritto Commerciale', icona: '💼', colore: '#0284c7', bg: 'rgba(56,189,248,0.1)', carte: 48 },
  { slug: 'diritto-ue', titolo: 'Diritto UE', icona: '🇪🇺', colore: '#4f46e5', bg: 'rgba(129,140,248,0.1)', carte: 50 },
  { slug: 'diritto-tributario', titolo: 'Diritto Tributario', icona: '💰', colore: '#e11d48', bg: 'rgba(251,113,133,0.1)', carte: 30 },
  { slug: 'diritto-processuale-civile', titolo: 'Procedura Civile', icona: '📋', colore: '#7c3aed', bg: 'rgba(167,139,250,0.1)', carte: 48 },
];

export default function StudioPage() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: 'var(--font-ui)', background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1, padding: '24px 16px 40px', maxWidth: 600, margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 8 }}>Studio</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text)', margin: '0 0 8px' }}>Flash Card</h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>Scegli una materia e inizia a studiare</p>
        </div>

        {/* Impara Giocando */}
        <div
          onClick={() => router.push('/studio/gioca')}
          style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(129,140,248,0.12))', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 20, padding: '20px', marginBottom: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <div style={{ fontSize: 36 }}>🎮</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Impara Giocando</div>
            <div style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.5 }}>Chi vuole essere laureato · Trivia Track · Abbina</div>
          </div>
          <div style={{ marginLeft: 'auto', color: 'var(--text-3)', fontSize: 18 }}>→</div>
        </div>

        {/* Carica PDF con AI */}
        <div
          onClick={() => router.push('/studio/pdf')}
          style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(129,140,248,0.12))', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 20, padding: '20px', marginBottom: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <div style={{ fontSize: 36 }}>⚡</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>Genera con AI</div>
            <div style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.5 }}>Carica un PDF e l'AI crea flash card personalizzate</div>
          </div>
          <div style={{ marginLeft: 'auto', color: 'var(--text-3)', fontSize: 18 }}>→</div>
        </div>

        {/* Materie disponibili */}
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 14 }}>
          Materie disponibili
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {materie.filter(m => m.carte !== null).map(m => (
            <div
              key={m.slug}
              onClick={() => router.push(`/studio/deck?materia=${m.slug}`)}
              style={{ background: 'var(--surface)', borderRadius: 16, border: `1px solid ${m.colore}22`, padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.2s' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: m.bg, border: `1px solid ${m.colore}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {m.icona}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 3 }}>{m.titolo}</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{m.carte} flash card</div>
              </div>
              <div style={{ color: 'var(--text-3)', fontSize: 16 }}>→</div>
            </div>
          ))}
        </div>

        {/* Materie in arrivo */}
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 14 }}>
          In arrivo
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {materie.filter(m => m.carte === null).map(m => (
            <div
              key={m.slug}
              style={{ background: '#0d1120', borderRadius: 14, border: '1px solid var(--line)', padding: '14px', opacity: 0.5 }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{m.icona}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>{m.titolo}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>Presto disponibile</div>
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  );
}