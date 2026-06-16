'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ArticoloPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);
  const [salvato, setSalvato] = useState(false);

  const [sintesi, setSintesi] = useState('');
  const [loadingSintesi, setLoadingSintesi] = useState(false);
  const [paroleChiave, setParoleChiave] = useState<string[]>([]);
  const [loadingParole, setLoadingParole] = useState(false);
  const [testDomande, setTestDomande] = useState<any[]>([]);
  const [loadingTest, setLoadingTest] = useState(false);
  const [testRisposte, setTestRisposte] = useState<Record<number, number>>({});
  const [vocaleAttiva, setVocaleAttiva] = useState(false);
  const [sezione, setSezione] = useState<'none' | 'sintesi' | 'parole' | 'test'>('none');

  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/articolo?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (data?.post) {
          setPost(data.post);
        } else {
          // Fallback: chiamata diretta a WordPress se l'endpoint cache non risponde
          const direct = await fetch(
            `https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&slug=${encodeURIComponent(slug)}&per_page=1`
          ).then(r => r.json()).catch(() => []);
          setPost(Array.isArray(direct) && direct.length > 0 ? direct[0] : null);
        }
      } catch (e) {
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  useEffect(() => {
    function handleScroll() {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      setReadProgress(Math.min(100, Math.round((scrolled / total) * 100)));
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {

  if (!post) return;

  const salvati = JSON.parse(
    localStorage.getItem('articoli_salvati') || '[]'
  );

  const esiste = salvati.some(
    (a: any) => a.slug === post.slug
  );

  setSalvato(esiste);

}, [post]);

function toggleSalva() {

  if (!post) return;

  const salvati = JSON.parse(
    localStorage.getItem('articoli_salvati') || '[]'
  );

  const esiste = salvati.some(
    (a: any) => a.slug === post.slug
  );

  if (esiste) {

    const nuovi = salvati.filter(
      (a: any) => a.slug !== post.slug
    );

    localStorage.setItem(
      'articoli_salvati',
      JSON.stringify(nuovi)
    );

    setSalvato(false);

  } else {

    const articolo = {
      slug: post.slug,
      titolo: post.title?.rendered || '',
      immagine: imgUrl || '',
      categoria,
      autore,
      data: dataPost,
    };

    localStorage.setItem(
      'articoli_salvati',
      JSON.stringify([articolo, ...salvati])
    );

    setSalvato(true);

  }
}

  function toggleVocale() {
    if (vocaleAttiva) {
      speechSynthesis.cancel();
      setVocaleAttiva(false);
    } else {
      const testo = post?.content?.rendered?.replace(/<[^>]+>/g, '') || '';
      const utterance = new SpeechSynthesisUtterance(testo);
      utterance.lang = 'it-IT';
      utterance.rate = 0.92;
      utterance.onend = () => setVocaleAttiva(false);
      speechSynthesis.speak(utterance);
      setVocaleAttiva(true);
    }
  }

  async function generaSintesi() {
    if (sintesi) { setSezione('sintesi'); return; }
    setSezione('sintesi');
    setLoadingSintesi(true);
    try {
      const testo = post?.content?.rendered?.replace(/<[^>]+>/g, '').slice(0, 3000) || '';
      const res = await fetch('/api/spiega', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testo, tipo: 'sintesi' }),
      });
      const data = await res.json();
      setSintesi(data.spiegazione || data.sintesi || '');
    } catch (e) {}
    setLoadingSintesi(false);
  }

  async function generaParole() {
    if (paroleChiave.length > 0) { setSezione('parole'); return; }
    setSezione('parole');
    setLoadingParole(true);
    try {
      const testo = post?.content?.rendered?.replace(/<[^>]+>/g, '').slice(0, 3000) || '';
      const res = await fetch('/api/spiega', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testo, tipo: 'parole_chiave' }),
      });
      const data = await res.json();
      setParoleChiave(data.parole || data.keywords || []);
    } catch (e) {}
    setLoadingParole(false);
  }

  async function generaTest() {
    if (testDomande.length > 0) { setSezione('test'); return; }
    setSezione('test');
    setLoadingTest(true);
    try {
      const testo = post?.content?.rendered?.replace(/<[^>]+>/g, '').slice(0, 3000) || '';
      const res = await fetch('/api/spiega', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testo, tipo: 'test' }),
      });
      const data = await res.json();
      setTestDomande(data.domande || []);
    } catch (e) {}
    setLoadingTest(false);
  }

  const imgUrl = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const categoria = post?._embedded?.['wp:term']?.[0]?.[0]?.name || '';
  const autore = post?._embedded?.['author']?.[0]?.name || '';
  const dataPost = post?.date ? new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const contenuto = post?.content?.rendered || '';
  const tempoLettura = Math.ceil((contenuto.replace(/<[^>]+>/g, '').split(' ').length) / 200);

  const LoadingDots = () => (
    <div style={{ display: 'flex', gap: 6, padding: '8px 0' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#8fd3ff', animation: `bounce 1s infinite ${i * 0.15}s` }} />
      ))}
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)} }`}</style>
    </div>
  );

  const articleStyles = `
.article-content h1,.article-content h2,.article-content h3,.article-content h4{line-height:1.25;margin-top:36px;margin-bottom:18px;color:#fff;font-weight:800;}
.article-content h1{font-size:clamp(28px,5vw,42px);}
.article-content h2{font-size:clamp(24px,4vw,34px);}
.article-content h3{font-size:clamp(20px,3vw,28px);}
.article-content h1:first-child,.article-content h2:first-child,.article-content h3:first-child{margin-top:0;}
.article-content p{margin-top:0;margin-bottom:22px;text-align:justify;}
.article-content br{display:none;}
.article-content p:empty{display:none;}
.article-content img{max-width:100%;height:auto;border-radius:18px;margin:28px 0;}
.article-content figure{margin:28px 0;}
.article-content iframe{width:100%;max-width:100%;border:0;border-radius:18px;}
.article-content table{width:100%;overflow-x:auto;display:block;}
.article-content pre{overflow-x:auto;}
.article-content strong{color:#fff;}
.article-content em{opacity:0.9;}
.article-content ul,.article-content ol{padding-left:22px;margin-bottom:22px;}
.article-content blockquote{border-left:3px solid #8fd3ff;padding-left:18px;margin:28px 0;color:rgba(255,255,255,0.72);}
@media(max-width:768px){.article-content{font-size:15px!important;line-height:1.9!important;}.article-content h1{font-size:30px;}.article-content h2{font-size:24px;}.article-content h3{font-size:20px;}}
`;

  // Stile comune per tutti e 4 i bottoni AI
  const aiBtnStyle = (active: boolean, hasTopBorder?: boolean): React.CSSProperties => ({
    background: active ? '#0f2040' : '#0a1220',
    border: 'none',
    borderTop: hasTopBorder ? '0.5px solid rgba(255,255,255,0.04)' : 'none',
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 10,
    height: 110,
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'left',
  });

  const aiIconStyle: React.CSSProperties = {
    width: 36, height: 36, borderRadius: 12,
    background: 'rgba(143,211,255,0.08)',
    border: '0.5px solid rgba(143,211,255,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050816', color: '#fff', fontFamily: "'Montserrat', sans-serif", overflowX: 'hidden', WebkitOverflowScrolling: 'touch' }}>

      {/* Reading progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.06)', zIndex: 999 }}>
        <div style={{ height: '100%', width: `${readProgress}%`, background: 'linear-gradient(to right, #8fd3ff, #4fa8e8)', borderRadius: '0 2px 2px 0', transition: 'width 0.1s linear' }} />
      </div>

      <Header />

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <LoadingDots />
        </div>
      ) : !post ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.4)' }}>Articolo non trovato</div>
      ) : (
        <div style={{ width: '100%', maxWidth: 780, margin: '0 auto', padding: '20px 16px 120px', overflowX: 'hidden' }}>

          {/* Back + categoria */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button
  onClick={toggleSalva}
  style={{
    height: 34,
    padding: '0 14px',
    borderRadius: 10,
    background: salvato
      ? 'rgba(143,211,255,0.14)'
      : 'rgba(255,255,255,0.06)',
    border: salvato
      ? '0.5px solid rgba(143,211,255,0.25)'
      : '0.5px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    color: salvato ? '#8fd3ff' : '#fff',
    fontSize: 11,
    fontWeight: 700
  }}
>
  {salvato ? '✓ Salvato' : '☆ Salva'}
</button>

            <button onClick={() => router.back()} style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 14 }}>←</button>
            {categoria && <span style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#8fd3ff', fontWeight: 800 }}>{categoria}</span>}
          </div>

          {/* Titolo */}
          <h1 style={{ fontSize: 'clamp(24px, 7vw, 36px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: -0.8, marginBottom: 16, color: '#fff', wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 20, paddingBottom: 20, borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#0a3060,#8fd3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
              {autore.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{autore}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{dataPost} · {tempoLettura} min</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 99, border: '0.5px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
              {readProgress}% letto
            </div>
          </div>

          {/* Immagine */}
          {imgUrl && (
            <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 24, border: '0.5px solid rgba(255,255,255,0.06)' }}>
              <img src={imgUrl} alt="" style={{ width: '100%', aspectRatio: '16/9', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {/* Contenuto */}
          <style>{articleStyles}</style>
          <div ref={articleRef} className="article-content"
            style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.95, marginBottom: 32, wordBreak: 'break-word', overflowWrap: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: contenuto }} />

          {/* BARRA AI */}
          <div style={{ background: '#0d1829', borderRadius: 22, overflow: 'hidden', border: '0.5px solid rgba(143,211,255,0.12)', marginBottom: 24 }}>

            {/* Header AI */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#0a3060,#8fd3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900 }}>✦</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Norma AI</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Strumenti di lettura</div>
              </div>
            </div>

            {/* Griglia 4 bottoni */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.05)' }}>

              {/* Lettura vocale */}
              <button onClick={toggleVocale} style={{ ...aiBtnStyle(vocaleAttiva), background: vocaleAttiva ? '#0f2040' : '#0a1220' }}>
                <div style={{ ...aiIconStyle, background: vocaleAttiva ? 'rgba(143,211,255,0.2)' : 'rgba(143,211,255,0.08)', border: `0.5px solid rgba(143,211,255,${vocaleAttiva ? '0.4' : '0.15'})` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 010 7.07"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{vocaleAttiva ? 'Stop' : 'Lettura vocale'}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{vocaleAttiva ? 'In riproduzione...' : "Ascolta l'articolo"}</div>
                </div>
              </button>

              {/* Sintesi */}
              <button onClick={generaSintesi} style={aiBtnStyle(sezione === 'sintesi')}>
                <div style={aiIconStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="10" x2="14" y2="10"/><line x1="4" y1="14" x2="18" y2="14"/><line x1="4" y1="18" x2="11" y2="18"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Sintesi</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>Riassunto AI</div>
                </div>
              </button>

              {/* Parole chiave */}
              <button onClick={generaParole} style={aiBtnStyle(sezione === 'parole', true)}>
                <div style={aiIconStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="2">
                    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Parole chiave</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>Concetti principali</div>
                </div>
              </button>

              {/* Test */}
              <button onClick={generaTest} style={aiBtnStyle(sezione === 'test', true)}>
                <div style={aiIconStyle}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 2 }}>Test</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>Metti alla prova</div>
                </div>
              </button>
            </div>

            {/* Output AI */}
            {sezione !== 'none' && (
              <div style={{ padding: '16px 18px', borderTop: '0.5px solid rgba(255,255,255,0.05)', background: '#080f1e' }}>

                {sezione === 'sintesi' && (
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#8fd3ff', fontWeight: 800, marginBottom: 10 }}>Sintesi</div>
                    {loadingSintesi ? <LoadingDots /> : <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>{sintesi}</div>}
                  </div>
                )}

                {sezione === 'parole' && (
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#8fd3ff', fontWeight: 800, marginBottom: 12 }}>Parole chiave</div>
                    {loadingParole ? <LoadingDots /> : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {paroleChiave.map((p, i) => (
                          <div key={i} style={{ padding: '6px 14px', borderRadius: 99, background: 'rgba(143,211,255,0.08)', border: '0.5px solid rgba(143,211,255,0.2)', color: '#8fd3ff', fontSize: 11, fontWeight: 700 }}>{p}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {sezione === 'test' && (
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#8fd3ff', fontWeight: 800, marginBottom: 14 }}>Test di comprensione</div>
                    {loadingTest ? <LoadingDots /> : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {testDomande.map((d: any, i: number) => (
                          <div key={i}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10, lineHeight: 1.5 }}>{i + 1}. {d.domanda}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {d.opzioni?.map((op: string, j: number) => {
                                const risposta = testRisposte[i];
                                const selezionata = risposta === j;
                                const corretta = d.risposta_corretta === j;
                                const risposto = risposta !== undefined;
                                let bg = 'rgba(255,255,255,0.04)';
                                let border = '0.5px solid rgba(255,255,255,0.08)';
                                let color = 'rgba(255,255,255,0.7)';
                                if (risposto && corretta) { bg = 'rgba(29,166,104,0.15)'; border = '0.5px solid rgba(29,166,104,0.3)'; color = '#4ade80'; }
                                else if (risposto && selezionata && !corretta) { bg = 'rgba(239,68,68,0.15)'; border = '0.5px solid rgba(239,68,68,0.3)'; color = '#f87171'; }
                                return (
                                  <button key={j} onClick={() => !risposto && setTestRisposte(prev => ({ ...prev, [i]: j }))}
                                    style={{ background: bg, border, borderRadius: 12, padding: '10px 14px', color, fontSize: 12, fontWeight: 600, textAlign: 'left', cursor: risposto ? 'default' : 'pointer' }}>
                                    {op}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}