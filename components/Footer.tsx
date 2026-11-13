'use client';
import { usePathname, useRouter } from 'next/navigation';

// Tab bar in stile app nativa: agganciata al fondo, icona + etichetta,
// indicatore che scivola sotto la scheda attiva. Le destinazioni sono
// le stesse di prima; "Cerca" apre il pannello di ricerca dell'header.

type Tab = {
  id: string;
  label: string;
  path?: string;
  icon: (attivo: boolean) => React.ReactNode;
};

const TABS: Tab[] = [
  {
    id: 'home', label: 'Home', path: '/',
    icon: a => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z" />
      </svg>
    ),
  },
  {
    id: 'esplora', label: 'Esplora', path: '/esplora',
    icon: a => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={a ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={a ? 0 : 1.8} strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    ),
  },
  {
    id: 'avvisi', label: 'Avvisi', path: '/avvisi',
    icon: a => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" fill={a ? 'currentColor' : 'none'} />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: 'cerca', label: 'Cerca',
    icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    id: 'studio', label: 'Studio', path: '/studio',
    icon: a => (
      <span className="tab-n" data-attivo={a}>N</span>
    ),
  },
];

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const attivo = (t: Tab) =>
    !!t.path && (t.path === '/' ? pathname === '/' : pathname === t.path || pathname.startsWith(t.path + '/'));
  const indice = TABS.findIndex(attivo);

  function tocca(t: Tab) {
    navigator.vibrate?.(6);
    if (t.id === 'cerca') {
      window.dispatchEvent(new CustomEvent('norma:open-search'));
      window.dispatchEvent(new CustomEvent('apri-ricerca'));
      return;
    }
    if (attivo(t)) {
      // Come nelle app: toccare la scheda già aperta riporta in cima
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (t.path) router.push(t.path);
  }

  return (
    <nav className="tabbar" aria-label="Navigazione principale">
      <div className="tabbar-inner">
        {indice >= 0 && (
          <span
            className="tabbar-indicatore"
            style={{ transform: `translateX(${indice * 100}%)`, width: `${100 / TABS.length}%` }}
            aria-hidden
          />
        )}
        {TABS.map(t => {
          const a = attivo(t);
          return (
            <button
              key={t.id}
              className="tabbar-tab tap"
              data-attivo={a}
              aria-current={a ? 'page' : undefined}
              aria-label={t.label}
              onClick={() => tocca(t)}
            >
              {t.icon(a)}
              <span className="tabbar-label">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
