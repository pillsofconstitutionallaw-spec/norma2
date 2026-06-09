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

function decodeHtml(str: string): string {
  return str
    .replace(/&#8217;/g, '\u2019')
    .replace(/&#8216;/g, '\u2018')
    .replace(/&#8220;/g, '\u201C')
    .replace(/&#8221;/g, '\u201D')
    .replace(/&#8211;/g, '\u2013')
    .replace(/&#8212;/g, '\u2014')
    .replace(/&#8230;/g, '\u2026')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, '');
}

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

function NewsCard({ item }: { item: NewsItem }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const colFonte = COLORE_FONTE[item.fonte] ?? '#8fd3ff';

  function share(e: React.MouseEvent) {
    e.preventDefault();
    if (navigator.share) navigator.share({ title: item.titolo, url: item.link }).catch(() => {});
  }

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    setSaved(s => !s);
    navigator.vibrate?.(6);
  }

  return (
    <article style={{ background: '#0a0d18', borderBottom: '0.5px solid rgba(255,255,255,0.07)', paddingBottom: 2 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: colFonte + '22', border: `1.5px solid ${colFonte}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: colFonte, fontFamily: 'Montserrat, sans-serif' }}>{item.fonte[0]}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: '#fff', fontFamily: 'Montserrat, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.fonte}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', fontFamily: 'Montserrat, sans-serif' }}>{item.categoria}</div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'rgba(255,255,255,0.55)', fontSize: 18, lineHeight: 1, letterSpacing: 1 }}>···</button>
      </div>

      {/* Media 4:5 */}
      <a href={item.link} target="_blank" rel="noreferrer noopener" aria-label={item.titolo}
        style={{ display: 'block', position: 'relative', aspectRatio: '4/5', background: '#07162b', overflow: 'hidden', textDecoration: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${colFonte}12 0%, #07162b 60%)` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 14px 20px' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.3, fontFamily: 'Montserrat, sans-serif' }}>{item.titolo}</div>
        </div>
      </a>

      {/* Azioni */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px 6px', gap: 16 }}>
        <button aria-label={liked ? 'Togli like' : 'Metti like'}
          onClick={e => { e.preventDefault(); setLiked(l => !l); navigator.vibrate?.(6); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : 'rgba(255,255,255,0.85)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'fill 0.15s, stroke 0.15s' }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <a href={item.link} target="_blank" rel="noreferrer noopener" aria-label="Leggi e commenta" style={{ display: 'flex', alignItems: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </a>
        <button aria-label="Condividi" onClick={share} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2" fill="rgba(255,255,255,0.85)" stroke="none"/>
          </svg>
        </button>
        <button aria-label={saved ? 'Rimuovi dai salvati' : 'Salva'} onClick={toggleSave}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill={saved ? '#8fd3ff' : 'none'} stroke={saved ? '#8fd3ff' : 'rgba(255,255,255,0.85)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'fill 0.15s, stroke 0.15s' }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>

      {/* Caption */}
      <div style={{ padding: '2px 14px 12px' }}>
        {item.anteprima && (
          <div style={{ fontSize: 13, lineHeight: 1.55, fontFamily: 'Montserrat, sans-serif', color: 'rgba(255,255,255,0.85)', marginBottom: 7 }}>
            <span style={{ fontWeight: 800, color: '#fff', marginRight: 6 }}>{item.fonte}</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{item.anteprima}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href={item.link} target="_blank" rel="noreferrer noopener"
            style={{ fontSize: 11.5, fontWeight: 700, color: colFonte, textDecoration: 'none', fontFamily: 'Montserrat, sans-serif' }}>
            Leggi la notizia →
          </a>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontFamily: 'Montserrat, sans-serif' }}>{dataRelativa(item.data)}</span>
        </div>
      </div>
    </article>
  );
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
        <div style={{ paddingBottom: 140 }}>
          {filtrate.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 48 }}>
              Nessuna notizia disponibile al momento
            </div>
          ) : (
            perGiorno.map((gruppo, gi) => (
              <div key={gi}>
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 3,
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)',
                  margin: gi === 0 ? '0 16px 12px' : '4px 16px 12px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                  {gruppo.label}
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
                </div>
                {gruppo.items.map((item, ii) => (
                  <NewsCard key={ii} item={{ ...item, titolo: decodeHtml(item.titolo), anteprima: decodeHtml(item.anteprima) }} />
                ))}
              </div>
            ))
          )}

          <div style={{ margin: '24px 16px 0', background: 'rgba(143,211,255,0.04)', border: '0.5px solid rgba(143,211,255,0.1)', borderRadius: 14, padding: '14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(143,211,255,0.45)" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <path d="M21 2H3v16h5l3 3 3-3h7V2z" /><path d="M8 8h8M8 12h5" />
            </svg>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(143,211,255,0.65)', marginBottom: 2 }}>Fonti ufficiali</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>Altalex · Gazzetta Ufficiale · Diritto.it · Corte Costituzionale</div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}