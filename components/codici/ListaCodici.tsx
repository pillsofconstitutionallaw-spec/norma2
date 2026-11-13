'use client';
import Link from 'next/link';
import { useState } from 'react';
import { IconaCodice } from './IconaCodice';

type Codice = {
  slug: string;
  titolo: string;
  breve?: string;          // nome corto per le card principali
  atto: string;
  colore: string;
  icona: React.ReactNode;  // contenuto dell'<svg> 24x24, tratto = currentColor
};

const PRINCIPALI: Codice[] = [
  {
    slug: 'codice-civile', titolo: 'Codice Civile', breve: 'Civile', atto: 'R.D. 262/1942', colore: '#38bdf8',
    icona: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M8 7h8M8 11h6" /></>,
  },
  {
    slug: 'codice-penale', titolo: 'Codice Penale', breve: 'Penale', atto: 'R.D. 1398/1930', colore: '#f97316',
    icona: <><path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z" /><path d="M5 7L2 14c0 2 1.5 3 3 3s3-1 3-3L5 7z" /><path d="M19 7l-3 7c0 2 1.5 3 3 3s3-1 3-3l-3-7z" /><path d="M3 21H21" /></>,
  },
  {
    slug: 'procedura-civile', titolo: 'Codice di Procedura Civile', breve: 'Procedura Civile', atto: 'R.D. 1443/1940', colore: '#a78bfa',
    icona: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8M16 17H8" /></>,
  },
  {
    slug: 'procedura-penale', titolo: 'Codice di Procedura Penale', breve: 'Procedura Penale', atto: 'D.P.R. 447/1988', colore: '#fb7185',
    icona: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M9 14l2 2 4-4" /></>,
  },
];

const ALTRI: Codice[] = [
  { slug: 'codice-ambiente', titolo: "Codice dell'Ambiente", atto: 'D.Lgs. 152/2006', colore: '#16a34a',
    icona: <><path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10z" /><path d="M12 8v4M12 16h.01" /></> },
  { slug: 'codice-antimafia', titolo: 'Codice Antimafia', atto: 'D.Lgs. 159/2011', colore: '#22c55e',
    icona: <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" /> },
  { slug: 'beni-culturali', titolo: 'Codice dei Beni Culturali', atto: 'D.Lgs. 42/2004', colore: '#fb923c',
    icona: <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /> },
  { slug: 'codice-consumo', titolo: 'Codice del Consumo', atto: 'D.Lgs. 206/2005', colore: '#06b6d4',
    icona: <><path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></> },
  { slug: 'codice-contratti-pubblici', titolo: 'Codice dei Contratti Pubblici', atto: 'D.Lgs. 36/2023 · Codice Appalti', colore: '#eab308',
    icona: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
  { slug: 'giustizia-contabile', titolo: 'Codice della Giustizia Contabile', atto: 'D.Lgs. 174/2016', colore: '#c084fc',
    icona: <path d="M12 3V21M12 3L5 7M12 3L19 7M5 7L2 14c0 2 1.5 3 3 3s3-1 3-3L5 7zM19 7l3 7c0 2-1.5 3-3 3s-3-1-3-3l3-7zM3 21h18" /> },
  { slug: 'codice-privacy', titolo: 'Codice Privacy', atto: 'D.Lgs. 196/2003', colore: '#8b5cf6',
    icona: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></> },
  { slug: 'processo-amministrativo', titolo: 'Codice del Processo Amministrativo', atto: 'D.Lgs. 104/2010', colore: '#f59e0b',
    icona: <><path d="M3 21h18M6 21V10M18 21V10M12 21V10M2 10l10-7 10 7" /></> },
  { slug: 'processo-tributario', titolo: 'Codice del Processo Tributario', atto: 'D.Lgs. 546/1992', colore: '#facc15',
    icona: <><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></> },
  { slug: 'codice-strada', titolo: 'Codice della Strada', atto: 'D.Lgs. 285/1992', colore: '#ef4444',
    icona: <><path d="M12 2v20" /><path d="M8 6h8M8 18h8" /></> },
  { slug: 'codice-terzo-settore', titolo: 'Codice del Terzo Settore', atto: 'D.Lgs. 117/2017', colore: '#84cc16',
    icona: <path d="M12 21s-6-4.35-9-8a5.5 5.5 0 018-7 5.5 5.5 0 018 7c-3 3.65-9 8-9 8z" /> },
  { slug: 'codice-turismo', titolo: 'Codice del Turismo', atto: 'D.Lgs. 79/2011', colore: '#14b8a6',
    icona: <><path d="M3 20h18" /><path d="M6 20V10l6-4 6 4v10" /></> },
];

const normalizza = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function ListaCodici({ conteggi }: { conteggi: Record<string, number> }) {
  const [q, setQ] = useState('');
  const filtro = (c: Codice) => !q || normalizza(`${c.titolo} ${c.atto}`).includes(normalizza(q));
  const principali = PRINCIPALI.filter(filtro);
  const altri = ALTRI.filter(filtro);
  const articoli = (slug: string) => conteggi[slug]?.toLocaleString('it-IT') ?? '';

  return (
    <>
      <label className="campo-ricerca appare" style={{ animationDelay: '60ms' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cerca un codice" enterKeyHint="search" />
        {q && (
          <button onClick={() => setQ('')} aria-label="Cancella" className="tap"
            style={{ background: 'none', border: 'none', color: 'var(--text-3)', padding: 4, cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity=".35" /><path d="M9 9l6 6M15 9l-6 6" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        )}
      </label>

      {principali.length > 0 && (
        <>
          <div className="sezione-label appare" style={{ animationDelay: '80ms' }}>Principali</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 12 }}>
            {principali.map((c, i) => (
              <Link key={c.slug} href={`/codici/${c.slug}`} className="tap appare card-codice"
                style={{
                  animationDelay: `${100 + i * 60}ms`,
                  background: `linear-gradient(150deg, ${c.colore} 0%, color-mix(in srgb, ${c.colore} 62%, #0b1f3a) 100%)`,
                  boxShadow: `0 10px 24px -10px color-mix(in srgb, ${c.colore} 70%, transparent)`,
                }}>
                <div className="card-codice-icona tessera" style={{ ['--d' as string]: `${150 + i * 90}ms` }}><IconaCodice slug={c.slug} colore="#fff" anima ritardo={150 + i * 90} /></div>
                <div>
                  <div className="card-codice-titolo">{c.breve}</div>
                  <div className="card-codice-sub">
                    {articoli(c.slug) && `${articoli(c.slug)} articoli`}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {altri.length > 0 && (
        <>
          <div className="sezione-label appare" style={{ animationDelay: '280ms' }}>Altri codici</div>
          <div className="lista appare" style={{ animationDelay: '300ms' }}>
            {altri.map((c, i) => (
              <Link key={c.slug} href={`/codici/${c.slug}`} className="riga">
                <div className="riga-icona tessera" style={{ background: `linear-gradient(150deg, ${c.colore}, color-mix(in srgb, ${c.colore} 75%, #0b1f3a))`, ['--d' as string]: `${380 + i * 45}ms` }}><IconaCodice slug={c.slug} size={21} colore="#fff" anima ritardo={380 + i * 45} /></div>
                <div className="riga-testo">
                  <div className="riga-titolo">{c.titolo}</div>
                  <div className="riga-sub">{c.atto}{articoli(c.slug) && ` · ${articoli(c.slug)} articoli`}</div>
                </div>
                <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
              </Link>
            ))}
          </div>
        </>
      )}

      {!principali.length && !altri.length && (
        <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 14, padding: '48px 0' }}>
          Nessun codice trovato per “{q}”
        </div>
      )}
    </>
  );
}
