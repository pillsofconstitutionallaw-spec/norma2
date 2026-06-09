'use client';
import { usePathname, useRouter } from 'next/navigation';

export default function BottomNavHome() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  function go(path: string) {
    navigator.vibrate?.(6);
    router.push(path);
  }

  function openSearch() {
    navigator.vibrate?.(6);
    window.dispatchEvent(new CustomEvent('norma:open-search'));
    window.dispatchEvent(new CustomEvent('apri-ricerca'));
  }

  const iconColor = (active: boolean) => active ? '#fff' : 'rgba(255,255,255,0.7)';

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      zIndex: 50,
      background: '#0a0d18',
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 4px',
    }}>
      {/* Home */}
      <button
        aria-label="Home"
        onClick={() => go('/')}
        style={{
          background: isHome ? 'rgba(255,255,255,0.12)' : 'none',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '8px 18px',
          borderRadius: 99,
          transition: 'background 0.2s',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24"
          fill={isHome ? iconColor(true) : 'none'}
          stroke={iconColor(isHome)}
          strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9.5z"/>
        </svg>
      </button>

      {/* Reels / Video pillole */}
      <button
        aria-label="Video e pillole giuridiche"
        onClick={() => go('/esplora')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 10,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={iconColor(false)} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <polygon points="10,8 16,12 10,16" fill={iconColor(false)} stroke="none"/>
        </svg>
      </button>

      {/* Direct / Consulenza con pallino rosso */}
      <button
        aria-label="Consulenza e messaggi"
        onClick={() => go('/consulenza')}
        style={{
          position: 'relative',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 10,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={iconColor(false)} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2" fill="none" stroke={iconColor(false)} strokeWidth="1.9"/>
        </svg>
        <span style={{
          position: 'absolute', top: 5, right: 5,
          width: 8, height: 8, borderRadius: '50%',
          background: '#ef4444',
          border: '1.5px solid #0a0d18',
        }} />
      </button>

      {/* Cerca */}
      <button
        aria-label="Cerca articoli"
        onClick={openSearch}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 10,
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={iconColor(false)} strokeWidth="1.9" strokeLinecap="round">
          <circle cx="11" cy="11" r="7"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>

      {/* Profilo — cerchio navy con "N" */}
      <button
        aria-label="Profilo e impostazioni"
        onClick={() => go('/studio')}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 10,
        }}
      >
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          background: '#041428',
          border: '1.5px solid rgba(143,211,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20, fontWeight: 600,
            color: '#8fd3ff', lineHeight: 1,
          }}>N</span>
        </div>
      </button>
    </div>
  );
}
