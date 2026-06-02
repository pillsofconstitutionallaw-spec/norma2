'use client';
import { useState, useRef } from 'react';

export type SearchResult = {
  id: number;
  title: { rendered: string };
  slug: string;
  link: string;
  _src: 'og' | 'odl';
  _embedded?: { 'wp:featuredmedia'?: Array<{ source_url: string }> };
};

export function useSearch(maxResults = 8) {
  const [query, setQueryState] = useState('');
  const [risultati, setRisultati] = useState<SearchResult[]>([]);
  const [cercando, setCercando] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function esegui(q: string) {
    setCercando(true);
    try {
      const perPage = Math.ceil(maxResults / 2);
      const [r1, r2] = await Promise.all([
        fetch(`https://orizzontegiuridico.com/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=${perPage}&_embed`),
        fetch(`https://orizzontideldiritto.orizzontegiuridico.com/wp-json/wp/v2/posts?search=${encodeURIComponent(q)}&per_page=${perPage}&_embed`),
      ]);
      const d1 = await r1.json();
      const d2 = await r2.json();
      const og: SearchResult[] = Array.isArray(d1) ? d1.map((p: any) => ({ ...p, _src: 'og' as const })) : [];
      const odl: SearchResult[] = Array.isArray(d2) ? d2.map((p: any) => ({ ...p, _src: 'odl' as const })) : [];
      setRisultati([...og, ...odl].slice(0, maxResults));
    } catch {}
    setCercando(false);
  }

  function setQuery(q: string) {
    setQueryState(q);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q.trim()) { setRisultati([]); return; }
    timerRef.current = setTimeout(() => esegui(q), 400);
  }

  function reset() {
    setQueryState('');
    setRisultati([]);
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  return { query, setQuery, risultati, cercando, reset };
}
