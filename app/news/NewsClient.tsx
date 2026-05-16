'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type NewsItem = {
  titolo: string;
  link: string;
  data: string;
  anteprima: string;
  fonte: string;
  categoria: string;
};

const COLORE_FONTE: Record<string, string> = {
  'Altalex': '#f97316',
  'Gazzetta Ufficiale': '#ffd700',
  'Diritto.it': '#fb7185',
  'Corte Costituzionale': '#38bdf8',
};

const COLORE_CATEGORIA: Record<string, string> = {
  'Penale': '#f97316',
  'Civile': '#38bdf8',
  'Costituzionale': '#38bdf8',
  'UE': '#a78bfa',
  'Lavoro': '#22c55e',
  'GU': '#ffd700',
  'Tributario': '#ffd700',
  'Amministrativo': '#fb7185',
  'Normativa': '#f97316',
  'Giurisprudenza': '#fb7185',
};

function dataRelativa(isoString: string): string {
  try {
    const d = new Date(isoString);
    const ora = new Date();
    const diffMs = ora.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffOre = Math.floor(diffMin / 60);
    const diffGiorni = Math.floor(diffOre / 24);

    if (diffMin < 5) return 'Adesso';
    if (diffMin < 60) return `${diffMin} min fa`;
    if (diffOre < 24) return `${diffOre} ore fa`;
    if (diffGiorni === 1) return 'Ieri';
    if (diffGiorni < 7) return `${diffGiorni} giorni fa`;

    return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

function labelGiorno(isoString: string): string {
  try {
    const d = new Date(isoString);
    const oggi = new Date();
    const ieri = new Date();
    ieri.setDate(oggi.getDate() - 1);

    if (d.toDateString() === oggi.toDateString()) return 'Oggi';
    if (d.toDateString() === ieri.toDateString()) return 'Ieri';

    return d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  } catch {
    return '';
  }
}

export default function NewsClient({
  news,
  aggiornato,
}: {
  news: NewsItem[];
  aggiornato: string;
}) {
  const [filtro, setFiltro] = useState<string>('Tutte');

  const categorie = useMemo(() => {
    const set = new Set(news.map((n) => n.categoria));
    return ['Tutte', ...Array.from(set).sort()];
  }, [news]);

  const filtrate = useMemo(() => {
    if (filtro === 'Tutte') return news;
    return news.filter((n) => n.categoria === filtro);
  }, [news, filtro]);

  const perGiorno = useMemo(() => {
    const groups: { label: string; items: NewsItem[] }[] = [];
    let ultimoGiorno = '';

    for (const item of filtrate) {
      const label = labelGiorno(item.data);
      if (label !== ultimoGiorno) {
        groups.push({ label, items: [] });
        ultimoGiorno = label;
      }
      groups[groups.length - 1].items.push(item);
    }

    return groups;
  }, [filtrate]);

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        .news-card-link { text-decoration: none; display: block; }
        .news-card-link:active { opacity: 0.75; }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        {/* HERO */}
        <div style={{ padding: '28px 16px 0' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Orizzonte Giuridico
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: -0.5, marginBottom: 8 }}>
            Ultime<br />News
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 16 }}>
            Le notizie giuridiche più recenti da fonti ufficiali, aggiornate ogni ora.
          </div>

          {/* Barra aggiornamento */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(34,197,94,0.07)',
            border: '0.5px solid rgba(34,197,94,0.2)',
            borderRadius: 10, padding: '8px 12px', marginBottom: 16,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
            <span style={{ fontSize: 10, color: 'rgba(34,197,94,0.85)', fontWeight: 700 }}>
              Aggiornato alle {aggiornato}
            </span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 2 }}>
              · {filtrate.length} notizie
            </span>
          </div>
        </div>

        {/* FILTRI */}
        <div style={{ padding: '0 16px 14px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categorie.map((cat) => {
            const attivo = filtro === cat;
            const col = cat === 'Tutte' ? '#8fd3ff' : (COLORE_CATEGORIA[cat] ?? '#8fd3ff');
            return (
              <button
                key={cat}
                onClick={() => setFiltro(cat)}
                style={{
                  padding: '5px 11px', borderRadius: 8,
                  background: attivo ? `${col}18` : 'rgba(255,255,255,0.04)',
                  border: `0.5px solid ${attivo ? col + '55' : 'rgba(255,255,255,0.08)'}`,
                  color: attivo ? col : 'rgba(255,255,255,0.35)',
                  fontSize: 10, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* NEWS */}
        <div style={{ padding: '0 16px 140px' }}>
          {filtrate.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 48 }}>
              Nessuna notizia disponibile al momento
            </div>
          ) : (
            perGiorno.map((gruppo, gi) => (
              <div key={gi}>
                {/* Label giorno */}
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 3,
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                  margin: gi === 0 ? '0 0 12px' : '20px 0 12px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                  {gruppo.label}
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
                </div>

                {/* Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {gruppo.items.map((item, ii) => {
                    const colFonte = COLORE_FONTE[item.fonte] ?? '#8fd3ff';
                    const colCat = COLORE_CATEGORIA[item.categoria] ?? '#8fd3ff';

                    return (
                      <a
                        key={ii}
                        href={item.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="news-card-link"
                      >
                        <div style={{
                          background: '#111526',
                          borderRadius: 16,
                          border: '0.5px solid rgba(255,255,255,0.06)',
                          padding: '13px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          transition: 'border-color 0.15s',
                        }}>
                          {/* Meta row */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {/* Badge fonte */}
                            <div style={{
                              background: `${colFonte}14`,
                              border: `0.5px solid ${colFonte}30`,
                              borderRadius: 5, padding: '2px 7px',
                              fontSize: 8, fontWeight: 700, color: colFonte,
                              letterSpacing: 0.8, textTransform: 'uppercase' as const,
                            }}>
                              {item.fonte}
                            </div>
                            {/* Badge categoria */}
                            <div style={{
                              background: `${colCat}0e`,
                              border: `0.5px solid ${colCat}28`,
                              borderRadius: 5, padding: '2px 7px',
                              fontSize: 8, fontWeight: 700, color: colCat,
                              letterSpacing: 0.8, textTransform: 'uppercase' as const,
                            }}>
                              {item.categoria}
                            </div>
                            {/* Data */}
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>
                              {dataRelativa(item.data)}
                            </span>
                          </div>

                          {/* Titolo */}
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff', lineHeight: 1.35 }}>
                            {item.titolo}
                          </div>

                          {/* Anteprima + freccia */}
                          {item.anteprima && (
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                              <div style={{
                                fontSize: 11.5, color: 'rgba(255,255,255,0.38)',
                                lineHeight: 1.55, flex: 1,
                              }}>
                                {item.anteprima}{item.anteprima.length >= 158 ? '…' : ''}
                              </div>
                              <svg
                                width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"
                                style={{ flexShrink: 0 }}
                              >
                                <path d="M9 18l6-6-6-6" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* Footer info */}
          <div style={{
            marginTop: 24,
            background: 'rgba(143,211,255,0.04)',
            border: '0.5px solid rgba(143,211,255,0.1)',
            borderRadius: 14, padding: '14px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="rgba(143,211,255,0.45)" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <path d="M21 2H3v16h5l3 3 3-3h7V2z" />
              <path d="M8 8h8M8 12h5" />
            </svg>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(143,211,255,0.65)', marginBottom: 2 }}>
                Fonti ufficiali
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
                Altalex · Gazzetta Ufficiale · Diritto.it · Corte Costituzionale
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}