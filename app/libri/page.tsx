'use client';
// force rebuild
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Libro {
  titolo: string;
  autore: string;
  editore: string;
  perche: string;
  cerca: string;
  tipo: 'manuale' | 'codice';
}

interface Materia {
  nome: string;
  colore: string;
  bg: string;
  libri: Libro[];
}

const materie: Materia[] = [
  {
    nome: 'Diritto Costituzionale',
    colore: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
    libri: [
      { titolo: 'Diritto Costituzionale', autore: 'Roberto Bin, Giovanni Pitruzzella', editore: 'Giappichelli', perche: 'Il manuale più adottato nelle università italiane. Chiaro, aggiornato e con un ottimo equilibrio tra teoria e giurisprudenza costituzionale. Ideale per la preparazione dell\'esame e del concorso.', cerca: 'Diritto Costituzionale Bin Pitruzzella Giappichelli', tipo: 'manuale' },
      { titolo: 'Diritto Costituzionale', autore: 'Temistocle Martines', editore: 'Giuffrè', perche: 'Classico della dottrina costituzionalistica italiana, aggiornato da Silvestri. Trattazione rigorosa e completa, apprezzato per la profondità scientifica e la precisione terminologica.', cerca: 'Diritto Costituzionale Martines Silvestri Giuffrè', tipo: 'manuale' },
      { titolo: 'Manuale di Diritto Costituzionale Italiano ed Europeo', autore: 'Carmela Barbera, Carlo Fusaro', editore: 'Il Mulino', perche: 'Approccio moderno e comparatistico che integra il diritto costituzionale italiano con quello europeo. Ottimo per chi vuole una visione più ampia e aggiornata del sistema costituzionale.', cerca: 'Manuale Diritto Costituzionale Italiano Europeo Barbera Fusaro Il Mulino', tipo: 'manuale' },
    ],
  },
  {
    nome: 'Diritto Privato / Civile',
    colore: '#38bdf8',
    bg: 'rgba(56,189,248,0.1)',
    libri: [
      { titolo: 'Manuale di Diritto Privato', autore: 'Paolo Torrente, Piero Schlesinger', editore: 'Giuffrè', perche: 'Il manuale di riferimento assoluto per il diritto privato italiano. Trattazione sistematica e completa, da decenni testo fondamentale in tutte le facoltà di giurisprudenza italiane.', cerca: 'Manuale Diritto Privato Torrente Schlesinger Giuffrè', tipo: 'manuale' },
      { titolo: 'Il Diritto Privato nella Società Moderna', autore: 'Vincenzo Roppo', editore: 'Il Mulino', perche: 'Manuale moderno e brillante che affronta il diritto privato con taglio critico e attuale. Particolarmente apprezzato per la chiarezza espositiva e la capacità di connettere gli istituti alla realtà economica e sociale.', cerca: 'Diritto Privato Società Moderna Roppo Il Mulino', tipo: 'manuale' },
      { titolo: 'Manuale di Diritto Privato', autore: 'Francesco Gazzoni', editore: 'Edizioni Scientifiche Italiane', perche: 'Trattazione enciclopedica e rigorosa, molto apprezzato per la profondità dell\'analisi e i numerosi riferimenti giurisprudenziali. Testo di riferimento per chi si prepara a concorsi notarili e avvocatura.', cerca: 'Manuale Diritto Privato Gazzoni Edizioni Scientifiche Italiane', tipo: 'manuale' },
    ],
  },
  {
    nome: 'Diritto Penale',
    colore: '#f87171',
    bg: 'rgba(239,68,68,0.1)',
    libri: [
      { titolo: 'Diritto Penale — Parte Generale', autore: 'Giovanni Fiandaca, Enzo Musco', editore: 'Zanichelli', perche: 'Il manuale più utilizzato nelle università italiane per il diritto penale. Eccellente per chiarezza espositiva, completezza e continuo aggiornamento giurisprudenziale. Indispensabile per l\'esame e i concorsi.', cerca: 'Diritto Penale Parte Generale Fiandaca Musco Zanichelli', tipo: 'manuale' },
      { titolo: 'Corso di Diritto Penale — Parte Generale', autore: 'Francesco Palazzo', editore: 'CEDAM', perche: 'Manuale moderno e rigoroso, particolarmente apprezzato per la trattazione dei principi costituzionali del diritto penale e per l\'approccio critico agli istituti fondamentali.', cerca: 'Corso Diritto Penale Parte Generale Palazzo CEDAM', tipo: 'manuale' },
      { titolo: 'Diritto Penale — Parte Generale', autore: 'Giorgio Marinucci, Emilio Dolcini, Gian Luigi Gatta', editore: 'Giuffrè', perche: 'Trattazione dottrinale di altissimo livello scientifico, punto di riferimento per i cultori del diritto penale. Ideale per approfondimenti e per la preparazione di tesi e concorsi.', cerca: 'Diritto Penale Parte Generale Marinucci Dolcini Gatta Giuffrè', tipo: 'manuale' },
    ],
  },
  {
    nome: 'Diritto Amministrativo',
    colore: '#4ade80',
    bg: 'rgba(34,197,94,0.1)',
    libri: [
      { titolo: 'Istituzioni di Diritto Amministrativo', autore: 'Sabino Cassese', editore: 'Giuffrè', perche: 'Il manuale del più autorevole giurista italiano del diritto pubblico. Trattazione essenziale ma profonda, ideale per acquisire le basi solide dell\'ordinamento amministrativo italiano.', cerca: 'Istituzioni Diritto Amministrativo Cassese Giuffrè', tipo: 'manuale' },
      { titolo: 'Lezioni di Diritto Amministrativo', autore: 'Vincenzo Cerulli Irelli', editore: 'Giappichelli', perche: 'Manuale moderno e aggiornato, molto apprezzato dagli studenti per la chiarezza e la capacità di affrontare i temi più complessi in modo accessibile senza sacrificare il rigore scientifico.', cerca: 'Lezioni Diritto Amministrativo Cerulli Irelli Giappichelli', tipo: 'manuale' },
    ],
  },
  {
    nome: 'Diritto Commerciale',
    colore: '#fbbf24',
    bg: 'rgba(251,191,36,0.1)',
    libri: [
      { titolo: 'Manuale di Diritto Commerciale', autore: 'Gian Franco Campobasso', editore: 'UTET', perche: 'Il manuale di riferimento assoluto per il diritto commerciale italiano. Trattazione completa e sistematica delle società, dei titoli di credito e del fallimento. Adottato dalla quasi totalità degli atenei italiani.', cerca: 'Manuale Diritto Commerciale Campobasso UTET', tipo: 'manuale' },
      { titolo: 'Diritto Commerciale', autore: 'Francesco Galgano', editore: 'Zanichelli', perche: 'Opera monumentale del più grande commercialista italiano del Novecento. Trattazione scientifica di altissimo livello, indispensabile per gli approfondimenti e per chi si prepara all\'esame di avvocatura.', cerca: 'Diritto Commerciale Galgano Zanichelli', tipo: 'manuale' },
    ],
  },
  {
    nome: "Diritto dell'Unione Europea",
    colore: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
    libri: [
      { titolo: "Diritto dell'Unione Europea", autore: 'Gianluca Strozzi, Roberto Mastroianni', editore: 'Giappichelli', perche: 'Manuale completo e aggiornato sul diritto europeo, con particolare attenzione alle fonti, alle istituzioni e alla giurisprudenza della Corte di Giustizia. Tra i più adottati nelle università italiane.', cerca: 'Diritto Unione Europea Strozzi Mastroianni Giappichelli', tipo: 'manuale' },
      { titolo: "Diritto dell'Unione Europea", autore: 'Roberto Adam, Antonio Tizzano', editore: 'Giappichelli', perche: 'Trattazione autorevole e sistematica del diritto europeo, con un approccio istituzionale solido. Particolarmente apprezzato per la chiarezza nella spiegazione del sistema delle fonti e delle procedure legislative.', cerca: 'Diritto Unione Europea Adam Tizzano Giappichelli', tipo: 'manuale' },
    ],
  },
  {
    nome: 'Diritto del Lavoro',
    colore: '#c084fc',
    bg: 'rgba(168,85,247,0.1)',
    libri: [
      { titolo: 'Diritto del Lavoro', autore: 'Franco Carinci, Raffaele De Luca Tamajo, Paolo Tosi, Tiziano Treu', editore: 'UTET', perche: 'Il manuale più completo e autorevole del diritto del lavoro italiano. Opera in due volumi che copre sistematicamente tutto il diritto sindacale e il rapporto di lavoro. Fondamentale per i concorsi pubblici.', cerca: 'Diritto Lavoro Carinci De Luca Tamajo Tosi Treu UTET', tipo: 'manuale' },
      { titolo: 'Diritto del Lavoro', autore: 'Edoardo Ghera, Daniela Garofalo', editore: 'Cacucci', perche: 'Manuale chiaro e aggiornato, particolarmente apprezzato dagli studenti per la sintesi efficace degli istituti fondamentali. Ottimo per la preparazione dell\'esame universitario.', cerca: 'Diritto Lavoro Ghera Garofalo Cacucci', tipo: 'manuale' },
    ],
  },
  {
    nome: 'Codici Commentati',
    colore: '#8fd3ff',
    bg: 'rgba(143,211,255,0.1)',
    libri: [
      { titolo: 'Codice Civile e Leggi Collegate — Commentato', autore: 'a cura di Giorgio De Nova', editore: 'Zanichelli', perche: 'Il codice civile commentato più autorevole e utilizzato nella pratica professionale. Ogni articolo è corredato di commento dottrinale e massime giurisprudenziali aggiornate. Indispensabile per avvocati e notai.', cerca: 'Codice Civile Commentato De Nova Zanichelli', tipo: 'codice' },
      { titolo: 'Codice Penale Commentato', autore: 'a cura di Emilio Dolcini, Gian Luigi Gatta', editore: 'IPSOA Wolters Kluwer', perche: 'Il commentario più completo al codice penale italiano. Ogni disposizione è analizzata con riferimenti dottrinali e giurisprudenziali esaustivi. Strumento fondamentale per la pratica forense penalistica.', cerca: 'Codice Penale Commentato Dolcini Gatta IPSOA', tipo: 'codice' },
      { titolo: 'Codice di Procedura Civile Commentato', autore: 'a cura di Claudio Consolo', editore: 'IPSOA Wolters Kluwer', perche: 'Il commentario di riferimento per il processo civile italiano. Trattazione sistematica articolo per articolo con ampi riferimenti alla giurisprudenza della Corte di Cassazione e alle riforme processuali più recenti.', cerca: 'Codice Procedura Civile Commentato Consolo IPSOA', tipo: 'codice' },
      { titolo: 'Codice di Procedura Penale Commentato', autore: 'a cura di Gilberto Lozzi', editore: 'Giuffrè', perche: 'Commentario autorevole al codice di rito penale, con riferimenti alle pronunce della Corte di Cassazione e della Corte Europea dei Diritti dell\'Uomo. Strumento essenziale per i professionisti del diritto penale.', cerca: 'Codice Procedura Penale Commentato Lozzi Giuffrè', tipo: 'codice' },
    ],
  },
];

export default function LibriPage() {
  const [aperto, setAperto] = useState<string | null>(null);

  function toggleLibro(key: string) {
    setAperto(prev => prev === key ? null : key);
  }

  function trovaprezzi(cerca: string) {
    window.open(`https://www.amazon.it/s?k=${encodeURIComponent(cerca)}&i=stripbooks`, '_blank');
  }

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
      `}</style>
      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '20px 16px 140px' }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Per gli studenti</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5 }}>Libri consigliati</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6, lineHeight: 1.5 }}>I migliori manuali per ogni materia, selezionati tra i più usati dagli studenti di giurisprudenza.</div>
          </div>
          {materie.map((m, mi) => (
            <div key={mi} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.colore, flexShrink: 0 }} />
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2.5, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>{m.nome}</div>
                <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.06)' }} />
              </div>
              {m.libri.map((l, li) => {
                const key = `${mi}-${li}`;
                const isOpen = aperto === key;
                return (
                  <div key={li} style={{ marginBottom: 6 }}>
                    <button onClick={() => toggleLibro(key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: isOpen ? '14px 14px 0 0' : 14, background: '#111526', border: `0.5px solid ${isOpen ? m.colore + '44' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: m.bg, border: `0.5px solid ${m.colore}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={m.colore} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          {l.tipo === 'codice' ? <><path d="M4 19V5H12V19M12 5H20V19"/><path d="M2 19H22"/></> : <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>}
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 3, lineHeight: 1.3 }}>{l.titolo}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>{l.autore}</div>
                        <div style={{ fontSize: 10, color: m.colore, fontWeight: 700, marginTop: 2, opacity: 0.7 }}>{l.editore}</div>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </button>
                    {isOpen && (
                      <div style={{ background: '#0c1420', borderRadius: '0 0 14px 14px', border: `0.5px solid ${m.colore}44`, borderTop: 'none', padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 16 }}>{l.perche}</div>
                        <button onClick={() => trovaprezzi(l.cerca)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '13px', borderRadius: 12, background: m.colore, color: '#041428', fontWeight: 800, fontSize: 12, border: 'none', cursor: 'pointer', letterSpacing: 0.5 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#041428" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                          </svg>
                          Trova l’offerta migliore →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}