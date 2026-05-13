'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ChiSiamo() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        .cs-app { font-family: 'Montserrat', sans-serif; background: #0a0d18; width: 100%; min-height: 100vh; }
        .cs-feed { min-height: 100vh; padding: 20px 16px 140px; width: 100%; }
        .slbl { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; }
        .slbl-t { font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.22); font-family: 'Montserrat', sans-serif; }
        .slbl-l { flex: 1; height: 0.5px; background: rgba(255,255,255,0.05); }
        .sezioni-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .valore-card { border-radius: 16px; background: #111526; border: 0.5px solid rgba(255,255,255,0.06); padding: 14px 16px; margin-bottom: 10px; display: flex; gap: 14px; align-items: flex-start; }
        img { display: block; }
        a { text-decoration: none; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }

        @media (min-width: 768px) {
          .cs-feed { padding: 32px 40px 140px; }
          .sezioni-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .cs-feed { padding: 40px 80px 140px; }
        }
        @media (min-width: 1280px) {
          .cs-feed { padding: 40px 120px 140px; }
        }
      `}</style>

      <div className="cs-app">
        <Header />

        <div className="cs-feed">

          {/* TITOLO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'Montserrat, sans-serif' }}>
              Dal 2025
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 12, fontFamily: 'Montserrat, sans-serif', letterSpacing: -0.5 }}>
              Rendiamo il diritto<br />accessibile a tutti.
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, fontFamily: 'Montserrat, sans-serif' }}>
              Un progetto di divulgazione giuridica indipendente, pensato per studenti, curiosi e futuri professionisti del diritto.
            </div>
          </div>

          {/* CITAZIONE */}
          <div style={{ borderRadius: 18, background: '#111526', border: '0.5px solid rgba(143,211,255,0.15)', padding: '20px 18px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(to right, transparent, #8fd3ff, transparent)' }} />
            <div style={{ fontSize: 40, color: '#8fd3ff', opacity: 0.2, fontFamily: 'Montserrat, sans-serif', fontWeight: 900, lineHeight: 1, marginBottom: 6 }}>"</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.8)', lineHeight: 1.75, fontFamily: 'Montserrat, sans-serif', fontStyle: 'italic', marginBottom: 14 }}>
              Il diritto è la più alta forma di civiltà umana: è la norma che trasforma la forza bruta in autorità legittima, e l'arbitrio in giustizia.
            </div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#8fd3ff', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif' }}>
              Piero Calamandrei
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'Montserrat, sans-serif', marginTop: 3, fontWeight: 500 }}>
              Giurista e padre costituente italiano
            </div>
          </div>

          {/* IMMAGINE */}
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 20, position: 'relative', aspectRatio: '16/9', width: '100%' }}>
            <img
              src="https://orizzontegiuridico.com/wp-content/uploads/2025/05/team-law-scaled.jpg"
              alt="Il team di Orizzonte Giuridico"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,13,24,0.8) 0%, transparent 60%)' }} />
          </div>

          {/* LA NOSTRA STORIA */}
          <div className="slbl">
            <span className="slbl-t">La nostra storia</span>
            <div className="slbl-l" />
          </div>

          <div style={{ borderRadius: 18, background: '#111526', border: '0.5px solid rgba(255,255,255,0.06)', padding: '18px', marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 12, fontFamily: 'Montserrat, sans-serif', lineHeight: 1.3 }}>
              Associazione giuridica e rivista scientifica
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>
              Orizzonte Giuridico nasce nel 2025 dall'iniziativa di un gruppo di ragazzi, giovani professionisti e docenti universitari accomunati da una profonda passione per il diritto e da un'idea semplice ma ambiziosa: rendere il sapere giuridico accessibile a tutti, senza rinunciare alla qualità e al rigore scientifico.
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontFamily: 'Montserrat, sans-serif' }}>
              Viviamo in un'epoca in cui le informazioni circolano rapidamente, ma troppo spesso in modo confuso o approssimativo. Abbiamo sentito il bisogno di costruire uno spazio in cui il diritto non fosse riservato solo agli addetti ai lavori, ma diventasse una risorsa condivisa, capace di orientare cittadini, studenti e curiosi in modo chiaro e fondato.
            </div>
          </div>

          {/* I VALORI */}
          <div className="slbl">
            <span className="slbl-t">La nostra missione</span>
            <div className="slbl-l" />
          </div>

          {[
            { icon: '⚖️', titolo: 'Rigore scientifico', desc: 'Ogni contenuto è curato con attenzione alla correttezza giuridica e alla chiarezza espositiva.' },
            { icon: '🔓', titolo: 'Accessibilità', desc: 'Il diritto non è solo per i professionisti. Lo rendiamo comprensibile a tutti, senza semplificare.' },
            { icon: '🛡️', titolo: 'Indipendenza', desc: 'Un progetto libero, sostenuto dalla comunità, senza condizionamenti editoriali esterni.' },
            { icon: '🤝', titolo: 'Community', desc: "Vogliamo costruire uno spazio di confronto, aperto e pluralista, fondato sulla passione e sull'ascolto." },
          ].map((v, i) => (
            <div key={i} className="valore-card">
              <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{v.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 5, fontFamily: 'Montserrat, sans-serif' }}>{v.titolo}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, fontFamily: 'Montserrat, sans-serif' }}>{v.desc}</div>
              </div>
            </div>
          ))}

          {/* ORIZZONTI DEL DIRITTO */}
          <div className="slbl" style={{ marginTop: 8 }}>
            <span className="slbl-t">La nostra rivista</span>
            <div className="slbl-l" />
          </div>

          <div style={{ borderRadius: 18, background: 'rgba(168,200,240,0.07)', border: '0.5px solid rgba(168,200,240,0.2)', padding: '18px', marginBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 10, fontFamily: 'Montserrat, sans-serif' }}>
              Orizzonti del Diritto
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontFamily: 'Montserrat, sans-serif', marginBottom: 14 }}>
              Rivista scientifica trimestrale con sistema di peer review in doppio cieco, in conformità con i parametri ANVUR. Uno spazio editoriale qualificato per il confronto tra studiosi, professionisti e operatori del diritto.
            </div>
            <a href="https://orizzontideldiritto.orizzontegiuridico.com" target="_blank" rel="noreferrer"
              style={{ fontSize: 9, fontWeight: 800, color: '#a8c8f0', letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif' }}>
              Visita la rivista →
            </a>
          </div>

          <div className="sezioni-grid" style={{ marginBottom: 20 }}>
            {[
              { titolo: 'Saggi', desc: 'Contributi scientifici originali di approfondimento dottrinale' },
              { titolo: 'Ricerche', desc: 'Indagini sistematiche e comparative su istituti giuridici' },
              { titolo: 'Giurisprudenza', desc: 'Analisi critica delle pronunce più significative' },
              { titolo: 'Osservatorio', desc: 'Novità legislative nazionali ed europee' },
              { titolo: 'Professioni', desc: 'Il mondo delle professioni legali in evoluzione' },
              { titolo: 'Recensioni', desc: 'Letture critiche delle pubblicazioni scientifiche' },
            ].map((s, i) => (
              <div key={i} style={{ borderRadius: 14, background: '#111526', border: '0.5px solid rgba(255,255,255,0.06)', padding: '13px 12px' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#a8c8f0', marginBottom: 5, fontFamily: 'Montserrat, sans-serif' }}>{s.titolo}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.55, fontFamily: 'Montserrat, sans-serif' }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* COLLABORA */}
          <div className="slbl">
            <span className="slbl-t">Collabora con noi</span>
            <div className="slbl-l" />
          </div>

          <div style={{ borderRadius: 18, background: 'rgba(143,211,255,0.07)', border: '0.5px solid rgba(143,211,255,0.2)', padding: '18px', marginBottom: 10 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontFamily: 'Montserrat, sans-serif', marginBottom: 16 }}>
              Sei ricercatore, avvocato, studioso, studente o appassionato di diritto? Invia il tuo contributo originale. Tutti i testi sono sottoposti a double blind peer review e controllo antiplagio.
            </div>
            <a href="mailto:redazione@orizzontegiuridico.com"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8fd3ff', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              redazione@orizzontegiuridico.com
            </a>
            <a href="mailto:info@orizzontegiuridico.com"
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#8fd3ff', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', marginBottom: 10 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8fd3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              info@orizzontegiuridico.com
            </a>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Via Anagni 86, 00171 Roma — C.F. 96656680829
            </div>
          </div>

          <a href="https://orizzontegiuridico.com/dona-ora/" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0', borderRadius: 16, background: '#8fd3ff', color: '#0a0d18', fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif', width: '100%' }}>
            Sostieni il progetto →
          </a>

        </div>
      </div>

      <Footer />
    </>
  );
}