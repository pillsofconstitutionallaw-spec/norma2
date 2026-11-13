'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IconaCodice } from './IconaCodice';

export type ArticoloCodice = {
  numero: number | string;
  rubrica: string;
  libro?: string;
  testo: string;
  abrogato?: boolean;
};

type Props = {
  slug?: string;
  titolo: string;
  sottotitolo: string;
  colore: string;
  articoli: ArticoloCodice[];
};

type AICache = Record<string, { spiega?: string; giurisprudenza?: string }>;

export default function CodiceViewer({ slug, titolo, sottotitolo, colore, articoli }: Props) {
  const [search, setSearch] = useState('');
  const [libroAttivo, setLibroAttivo] = useState<string | null>(null);
  const [aperto, setAperto] = useState<ArticoloCodice | null>(null);
  const [visibili, setVisibili] = useState(60);
  const [trascina, setTrascina] = useState(0);
  const inizioTocco = useRef<number | null>(null);
  const fineLista = useRef<HTMLDivElement>(null);
  const [aiCache, setAiCache] = useState<AICache>({});
  const [loadingAI, setLoadingAI] = useState<{ id: string; tipo: string } | null>(null);
  const [salvati, setSalvati] = useState<Set<string>>(new Set());
  const [mostraAbrogati, setMostraAbrogati] = useState(false);
  const [vocale, setVocale] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const STORAGE_KEY = `salvati_${titolo.replace(/\s/g, '_')}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSalvati(new Set(JSON.parse(saved)));
    } catch {}
  }, [STORAGE_KEY]);

  const libri = useMemo(
    () => [
      ...new Set(
        articoli
          .map(a => a.libro)
          .filter((l): l is string => typeof l === 'string' && l.length > 0)
      ),
    ],
    [articoli]
  );

  const filtrati = useMemo(() => {
    let lista = articoli;
    if (!mostraAbrogati) lista = lista.filter(a => !a.abrogato);
    if (libroAttivo) lista = lista.filter(a => a.libro === libroAttivo);
    if (search.trim()) {
      const q = search.toLowerCase();
      lista = lista.filter(
        a =>
          String(a.numero).toLowerCase().includes(q) ||
          (a.rubrica?.toLowerCase() ?? '').includes(q) ||
          (a.testo?.toLowerCase() ?? '').includes(q)
      );
    }
    return lista;
  }, [articoli, libroAttivo, search, mostraAbrogati]);

  const articoloId = (a: ArticoloCodice) => String(a.numero);

  function cleanNumero(n: number | string): string {
    return String(n).replace(/^Art\.\s*/i, '').replace(/\.\s*$/, '').trim();
  }

  async function chiediAI(articolo: ArticoloCodice, tipo: 'spiega' | 'giurisprudenza') {
    const id = articoloId(articolo);
    if (aiCache[id]?.[tipo]) return;
    setLoadingAI({ id, tipo });
    try {
      const res = await fetch('/api/spiega', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articolo: `Art. ${cleanNumero(articolo.numero)}${articolo.rubrica ? ' — ' + articolo.rubrica : ''}`,
          testo: articolo.testo,
          tipo: tipo === 'spiega' ? 'codice' : 'giurisprudenza',
        }),
      });
      const data = await res.json();
      setAiCache(prev => ({
        ...prev,
        [id]: { ...prev[id], [tipo]: data.spiegazione ?? 'Nessuna risposta.' },
      }));
    } catch {
      setAiCache(prev => ({
        ...prev,
        [id]: { ...prev[id], [tipo]: 'Errore nel caricamento.' },
      }));
    } finally {
      setLoadingAI(null);
    }
  }

  function toggleSalva(articolo: ArticoloCodice) {
    const id = articoloId(articolo);
    setSalvati(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  function toggleVocale(articolo: ArticoloCodice) {
    const id = articoloId(articolo);
    if (vocale === id) {
      window.speechSynthesis?.cancel();
      setVocale(null);
      return;
    }
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Articolo ${cleanNumero(articolo.numero)}. ${articolo.rubrica ? articolo.rubrica + '. ' : ''}${articolo.testo}`
    );
    utterance.lang = 'it-IT';
    utterance.rate = 0.9;
    utterance.onend = () => setVocale(null);
    synthRef.current = utterance;
    window.speechSynthesis?.speak(utterance);
    setVocale(id);
  }

  const totaleValidi = articoli.filter(a => !a.abrogato).length;
  const totaleAbrogati = articoli.filter(a => a.abrogato).length;

  // Elenco a blocchi di 60: il Codice Civile ha oltre 3000 articoli e
  // disegnarli tutti insieme rende lento lo scorrimento sul telefono.
  useEffect(() => { setVisibili(60); }, [search, libroAttivo, mostraAbrogati]);
  useEffect(() => {
    const el = fineLista.current;
    if (!el) return;
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) setVisibili(v => v + 60); }, { rootMargin: '600px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [filtrati.length]);

  // Pannello aperto: blocca lo scorrimento della pagina sotto
  useEffect(() => {
    document.body.style.overflow = aperto ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [aperto]);

  function chiudi() {
    window.speechSynthesis?.cancel();
    setVocale(null);
    setTrascina(0);
    setAperto(null);
  }

  function condividi(a: ArticoloCodice) {
    const testo = `Art. ${cleanNumero(a.numero)} ${titolo}${a.rubrica ? ' — ' + a.rubrica : ''}\n\n${a.testo}`;
    if (navigator.share) navigator.share({ title: `Art. ${cleanNumero(a.numero)} ${titolo}`, text: testo }).catch(() => {});
    else navigator.clipboard?.writeText(testo);
  }

  const etichettaLibro = (l: string) => (l.includes('—') ? l.split('—')[0].trim() : l.slice(0, 22));
  const a = aperto;
  const idA = a ? articoloId(a) : '';
  const cache = aiCache[idA] ?? {};
  const loadingSpiega = loadingAI?.id === idA && loadingAI.tipo === 'spiega';
  const loadingGiuris = loadingAI?.id === idA && loadingAI.tipo === 'giurisprudenza';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', ['--colore' as string]: colore }}>
      <Header />
      <main className="pagina">
        {/* ── Copertina del codice ── */}
        <div className="codice-hero appare">
          {slug && (
            <div className="codice-hero-icona tessera" style={{ ['--d' as string]: '120ms' }}>
              <IconaCodice slug={slug} size={30} colore="#fff" anima ritardo={120} />
            </div>
          )}
          <div className="codice-hero-atto">{sottotitolo}</div>
          <h1 className="codice-hero-titolo">{titolo}</h1>
          <div className="codice-hero-stat">
            <div><b>{totaleValidi.toLocaleString('it-IT')}</b><span>vigenti</span></div>
            <div><b>{totaleAbrogati.toLocaleString('it-IT')}</b><span>abrogati</span></div>
            {libri.length > 1 && <div><b>{libri.length}</b><span>{libri[0]?.startsWith('Parte') ? 'parti' : libri[0]?.startsWith('Titolo') ? 'titoli' : 'libri'}</span></div>}
          </div>
        </div>

        {/* ── Ricerca e filtri, fissi in alto mentre si scorre ── */}
        <div className="codice-barra">
          <label className="campo-ricerca" style={{ marginTop: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input type="search" placeholder="Numero, rubrica o parola" value={search} enterKeyHint="search"
              onChange={e => { setSearch(e.target.value); setLibroAttivo(null); }} />
          </label>
          {!search && libri.length > 1 && (
            <div className="pillole">
              <button className="pillola tap" data-on={!libroAttivo} onClick={() => setLibroAttivo(null)}>Tutti</button>
              {libri.map(l => (
                <button key={l} className="pillola tap" data-on={libroAttivo === l} onClick={() => setLibroAttivo(libroAttivo === l ? null : l)}>
                  {etichettaLibro(l)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="codice-info">
          <span>{filtrati.length.toLocaleString('it-IT')} articoli{search ? ` per “${search}”` : ''}</span>
          <div className="segmentato">
            <button data-on={!mostraAbrogati} onClick={() => setMostraAbrogati(false)}>Vigenti</button>
            <button data-on={mostraAbrogati} onClick={() => setMostraAbrogati(true)}>Tutti</button>
          </div>
        </div>
        {libroAttivo && <div className="codice-libro-attivo">{libroAttivo}</div>}

        {/* ── Elenco articoli ── */}
        {filtrati.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 15, padding: '48px 0' }}>Nessun articolo trovato</div>
        ) : (
          <div className="lista">
            {filtrati.slice(0, visibili).map((art, idx) => {
              const id = articoloId(art);
              return (
                <button key={`${id}-${idx}`} className="riga riga-articolo" data-abrogato={!!art.abrogato} onClick={() => setAperto(art)}>
                  <span className="art-numero">{cleanNumero(art.numero)}</span>
                  <span className="riga-testo">
                    <span className="riga-titolo" style={{ display: 'block' }}>{art.rubrica || `Articolo ${cleanNumero(art.numero)}`}</span>
                    <span className="riga-sub" style={{ display: 'block' }}>
                      {art.abrogato ? 'Abrogato' : art.testo.slice(0, 90)}
                    </span>
                  </span>
                  {salvati.has(id) && <span className="punto-salvato" />}
                  <svg className="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              );
            })}
          </div>
        )}
        <div ref={fineLista} style={{ height: 1 }} />
      </main>
      <Footer />

      {/* ── Pannello articolo (bottom sheet) ── */}
      {a && (
        <div className="sheet-sfondo" onClick={chiudi}>
          <div className="sheet" onClick={e => e.stopPropagation()}
            style={{ transform: trascina ? `translateY(${trascina}px)` : undefined, transition: trascina ? 'none' : undefined }}
            onTouchStart={e => { if ((e.currentTarget.scrollTop ?? 0) <= 0) inizioTocco.current = e.touches[0].clientY; }}
            onTouchMove={e => { if (inizioTocco.current != null) setTrascina(Math.max(0, e.touches[0].clientY - inizioTocco.current)); }}
            onTouchEnd={() => { if (trascina > 120) chiudi(); else setTrascina(0); inizioTocco.current = null; }}>
            <div className="sheet-maniglia" />
            <div className="sheet-testata">
              <span className="art-numero grande">{cleanNumero(a.numero)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sheet-sopratitolo">{titolo} · Art. {cleanNumero(a.numero)}</div>
                <h2 className="sheet-titolo">{a.rubrica || `Articolo ${cleanNumero(a.numero)}`}</h2>
              </div>
              <button className="btn-chiudi tap" aria-label="Chiudi" onClick={chiudi}>
                <svg width="12" height="12" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            {a.libro && <div className="sheet-libro">{a.libro}</div>}
            {a.abrogato && <div className="badge-abrogato">Articolo abrogato</div>}

            <div className="sheet-testo">{a.testo}</div>

            <div className="sheet-azioni">
              <button className="azione-grande tap" data-tipo="ai" disabled={!!cache.spiega || a.abrogato || loadingSpiega}
                onClick={() => chiediAI(a, 'spiega')}>
                {loadingSpiega ? <span className="spinner" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.8L20 10l-6.1 1.2L12 17l-1.9-5.8L4 10l6.1-1.2z" /><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z" /></svg>}
                <span>{loadingSpiega ? 'Sto spiegando…' : cache.spiega ? 'Spiegato' : 'Spiega con AI'}</span>
              </button>
              <button className="azione-grande tap" data-tipo="giur" disabled={!!cache.giurisprudenza || a.abrogato || loadingGiuris}
                onClick={() => chiediAI(a, 'giurisprudenza')}>
                {loadingGiuris ? <span className="spinner" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 7l7-4 7 4M5 7l-3 7c0 2 1.5 3 3 3s3-1 3-3L5 7zM19 7l-3 7c0 2 1.5 3 3 3s3-1 3-3l-3-7z" /></svg>}
                <span>{loadingGiuris ? 'Cerco…' : cache.giurisprudenza ? 'Caricata' : 'Giurisprudenza'}</span>
              </button>
            </div>
            <div className="sheet-azioni-piccole">
              <button className="tap" data-on={vocale === idA} onClick={() => toggleVocale(a)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">{vocale === idA ? <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></> : <path d="M7 4.5v15l12-7.5z" />}</svg>
                {vocale === idA ? 'Stop' : 'Ascolta'}
              </button>
              <button className="tap" data-on={salvati.has(idA)} onClick={() => toggleSalva(a)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={salvati.has(idA) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
                {salvati.has(idA) ? 'Salvato' : 'Salva'}
              </button>
              <button className="tap" onClick={() => condividi(a)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                Condividi
              </button>
            </div>

            {cache.spiega && (
              <div className="box-ai appare">
                <div className="box-ai-etichetta">✦ Spiegazione AI</div>
                <div className="box-ai-testo">{cache.spiega}</div>
              </div>
            )}
            {cache.giurisprudenza && (
              <div className="box-ai appare" data-tipo="giur">
                <div className="box-ai-etichetta">Giurisprudenza</div>
                <div className="box-ai-testo">{cache.giurisprudenza}</div>
              </div>
            )}
            <div style={{ height: 'calc(var(--safe-bottom) + 12px)' }} />
          </div>
        </div>
      )}
    </div>
  );
}
