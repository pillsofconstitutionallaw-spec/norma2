'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === '/';

  function go(path: string) {
    navigator.vibrate?.(6);
    router.push(path);
  }

  function handleHome() {
    navigator.vibrate?.(6);
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/');
    }
  }

  function openSearch() {
    navigator.vibrate?.(6);
    window.dispatchEvent(new CustomEvent('norma:open-search'));
    window.dispatchEvent(new CustomEvent('apri-ricerca'));
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');
  const col = (active: boolean) => active ? '#fff' : 'rgba(255,255,255,0.55)';

  const btnBase: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flex: 1, padding: '10px 0',
  };

  return (
    /* Wrapper per centrare e limitare la larghezza */
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      zIndex: 50,
      padding: '0 20px calc(20px + env(safe-area-inset-bottom, 0px)) 20px',
      pointerEvents: 'none',
    }}>
      {/* Pillola flottante */}
      <div style={{
        background: 'rgba(10,13,24,0.94)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 999,
        border: '0.5px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 28px rgba(0,0,0,0.5)',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'auto',
      }}>

        {/* Home */}
        <button aria-label={isHome ? 'Torna in cima' : 'Home'} onClick={handleHome} style={btnBase}>
          <div style={{
            background: isHome ? 'rgba(255,255,255,0.14)' : 'none',
            borderRadius: 999,
            padding: '6px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24"
              fill={isHome ? '#fff' : 'none'}
              stroke={col(isHome)}
              strokeWidth={isHome ? '0' : '1.8'}
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z"/>
            </svg>
          </div>
        </button>

        {/* Esplora */}
        <button aria-label="Esplora" onClick={() => go('/esplora')} style={btnBase}>
          {isActive('/esplora') ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" stroke="none">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          )}
        </button>

        {/* Avvisi */}
        <button aria-label="Avvisi e notifiche" onClick={() => go('/avvisi')} style={btnBase}>
          <svg width="26" height="26" viewBox="0 0 24 24"
            fill={isActive('/avvisi') ? '#fff' : 'none'}
            stroke={isActive('/avvisi') ? '#fff' : 'rgba(255,255,255,0.55)'}
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none"/>
          </svg>
        </button>

        {/* Cerca */}
        <button aria-label="Cerca articoli" onClick={openSearch} style={btnBase}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        {/* Logo N → studio */}
        <button aria-label="Studio e impostazioni" onClick={() => go('/studio')} style={btnBase}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#041428',
            border: `1.5px solid ${isActive('/studio') ? '#8fd3ff' : 'rgba(143,211,255,0.35)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isActive('/studio') ? '0 0 10px rgba(143,211,255,0.3)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 600,
              color: isActive('/studio') ? '#8fd3ff' : 'rgba(143,211,255,0.7)',
              lineHeight: 1,
            }}>N</span>
          </div>
        </button>

      </div>
    </div>
  );
}
