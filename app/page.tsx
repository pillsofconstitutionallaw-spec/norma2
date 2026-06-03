'use client';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function StoryTimer({ onTick, onEnd }: { onTick: (p: number) => void; onEnd: () => void }) {
  useEffect(() => {
    const duration = 6000;
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min((elapsed / duration) * 100, 100);
      onTick(pct);
      if (elapsed >= duration) {
        clearInterval(timer);
        onEnd();
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);
  return null;
}

function InstagramEmbed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [profilePic, setProfilePic] = useState('https://i.imgur.com/2DhmtJ4.png');
  useEffect(() => {
    fetch('/api/instagram')
      .then(r => r.json())
      .then(data => {
        if (data.data) setPosts(data.data.slice(0, 9));
        if (data.profile?.profile_picture_url) setProfilePic(data.profile.profile_picture_url);
      })
      .catch(() => {});
  }, []);
  return (
    <div style={{ background: '#111526', borderRadius: 18, overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.06)', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 2, borderRadius: '50%', background: 'linear-gradient(135deg,#ff9966,#ff5e62,#d6249f,#285AEB)' }}>
            <img src={profilePic} alt="" width={38} height={38} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #111526', display: 'block' }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 12 }}>Orizzonte Giuridico</div>
            <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 10 }}>@orizzonte.giuridico</div>
          </div>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/>
            <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/>
            <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
          </svg>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, background: '#050816' }}>
        {(posts.length > 0 ? posts : Array.from({length: 9}).map(() => ({}))).map((post: any, i: number) => (
          <a key={i} href={post.permalink || 'https://www.instagram.com/orizzonte.giuridico/'} target="_blank" rel="noreferrer"
            style={{ display: 'block', position: 'relative', aspectRatio: '1/1', overflow: 'hidden', background: '#07162b', textDecoration: 'none' }}>
            {post.media_url && (
              <img src={post.media_type === 'VIDEO' ? (post.thumbnail_url || post.media_url) : post.media_url} alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            )}
            {post.media_type === 'VIDEO' && (
              <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '2px 5px', fontSize: 9, color: '#fff' }}>▶</div>
            )}
            {post.media_type === 'CAROUSEL_ALBUM' && (
              <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', borderRadius: 4, padding: '2px 5px', fontSize: 9, color: '#fff' }}>⊞</div>
            )}
          </a>
        ))}
      </div>
      <a href="https://www.instagram.com/orizzonte.giuridico/" target="_blank" rel="noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', color: '#8fd3ff', fontSize: 10, fontWeight: 700, letterSpacing: 1, textDecoration: 'none', borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
        SEGUI @ORIZZONTE.GIURIDICO →
      </a>
    </div>
  );
}

const staticCategories = [
  { id: 48, name: 'Penale' },
  { id: 682, name: 'Civile' },
  { id: 39, name: 'Costituzionale' },
  { id: 220, name: 'Ambiente' },
  { id: 249, name: 'Unione Europea' },
  { id: 86, name: 'Amministrativo' },
  { id: 140, name: 'Internazionale' },
  { id: 834, name: 'Animali' },
  { id: 320, name: 'Legalità' },
  { id: 55, name: 'Economia' },
  { id: 543, name: 'Politica' },
  { id: 72, name: 'Dir. Comparato' },
  { id: 333, name: "L'Intervista" },
  { id: 707, name: 'Ripetiamo il Diritto' },
];

const slides = [
  {
    tag: 'Benvenuto',
    title: 'Norma,<br>il diritto a portata di <em style="color:#8fd3ff;">swipe</em>.',
    sub: 'Il diritto semplice, a spiegarlo ci pensiamo noi.',
    img: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800&q=80',
  },
  {
    tag: 'Chi siamo',
    title: "Un'associazione.<br>Una rivista.",
    sub: "Orizzonte Giuridico è un'associazione culturale di giovani giuristi e studenti. Pubblichiamo articoli, saggi e pillole giuridiche per rendere il diritto accessibile a tutti.",
    img: '',
  },
  {
    tag: 'Costituzione',
    title: "La Costituzione.<br>Articolo per articolo.",
    sub: 'Esplora tutti i 139 articoli della Costituzione italiana con spiegazioni chiare, lettura vocale e riferimenti giurisprudenziali aggiornati.',
    img: '',
  },
  {
    tag: 'Orizzonti del Diritto',
    title: "La nostra<br>rivista giuridica.",
    sub: 'Orizzonti del Diritto è la rivista ufficiale di Orizzonte Giuridico. Saggi, approfondimenti e ricerca giuridica curati dai nostri autori.',
    img: '',
  },
];

const icons: Record<string, React.ReactNode> = {
  Penale: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3L19 6V11C19 16 15.5 20 12 21C8.5 20 5 16 5 11V6L12 3Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Civile: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M5 20C5 16.5 8 14 12 14C16 14 19 16.5 19 20" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Costituzionale: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 3H17L21 7V21H3V3H7Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M17 3V7H21" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M7 12H17M7 16H13" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Ambiente: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 5 15 5 9C5 5.69 8.13 3 12 3C15.87 3 19 5.69 19 9C19 15 12 21 12 21Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 9V21" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  'Unione Europea': <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  Amministrativo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Internazionale: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M3 12H21M12 3C9.5 6 8 9 8 12C8 15 9.5 18 12 21C14.5 18 16 15 16 12C16 9 14.5 6 12 3Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="12" r="2" fill="#8fd3ff" opacity="0.5"/></svg>,
  Animali: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="7" cy="6" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="17" cy="6" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="4" cy="12" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><circle cx="20" cy="12" r="2" stroke="#8fd3ff" strokeWidth="1.6"/><path d="M12 10C9 10 6 13 7 17C8 20 10 21 12 21C14 21 16 20 17 17C18 13 15 10 12 10Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Legalità: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinejoin="round"/><path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z" stroke="#8fd3ff" strokeWidth="1.5" strokeLinejoin="round"/><path d="M3 21H21" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Economia: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 13,14 21,6" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17,6 21,6 21,10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Politica: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 21H21M6 21V10M18 21V10M12 21V10M2 10L12 3L22 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Dir. Comparato': <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19V5H12V19M12 5H20V19" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 19H22" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  "L'Intervista": <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="9" y="2" width="6" height="11" rx="3" stroke="#8fd3ff" strokeWidth="1.8"/><path d="M5 10C5 14.4 8.13 18 12 18C15.87 18 19 14.4 19 10" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/><path d="M12 18V22M9 22H15" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  'Ripetiamo il Diritto': <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 10V6L12 2L2 6V10C2 15.5 6.5 20.7 12 22C17.5 20.7 22 15.5 22 10Z" stroke="#8fd3ff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 8V13L15 15" stroke="#8fd3ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

const shortNames: Record<string, string> = {
  Costituzionale: 'Cost.',
  'Unione Europea': 'UE',
  Amministrativo: 'Amm.',
  Internazionale: 'Int.',
  'Dir. Comparato': 'Comp.',
  "L'Intervista": 'Interv.',
  'Ripetiamo il Diritto': 'Ripetiamo',
};

const FESTE_CIVILI = [
  {
    mese: 1, giorno: 1,
    nome: 'Costituzione in vigore',
    emoji: '📜', colore: '#38bdf8',
    bordoTop: 'linear-gradient(90deg,#009246,#fff 50%,#ce2b37)',
    breve: '1° gennaio 1948: entra in vigore la Costituzione della Repubblica.',
    descrizione: 'Approvata dall\'Assemblea Costituente il 22 dicembre 1947 e promulgata il 27 dicembre, la Costituzione italiana entrò in vigore il 1° gennaio 1948. È composta da 139 articoli e 18 disposizioni transitorie. I primi 12 articoli — i Principi Fondamentali — non sono modificabili nella loro essenza.',
  },
  {
    mese: 1, giorno: 27,
    nome: 'Giorno della Memoria',
    emoji: '🕯️', colore: '#a78bfa',
    bordoTop: 'linear-gradient(90deg,#a78bfa,#818cf8)',
    breve: 'Si ricordano le vittime della Shoah e delle leggi razziali.',
    descrizione: 'Istituito con la legge n. 211/2000, il 27 gennaio commemora le vittime dell\'Olocausto. Il 27 gennaio 1945 le truppe sovietiche liberarono Auschwitz. In Italia, le leggi razziali fasciste del 1938 (R.D.L. n. 1381 e 1390) privarono migliaia di cittadini dei diritti fondamentali, incluso quello di lavorare e studiare.',
  },
  {
    mese: 2, giorno: 10,
    nome: 'Giorno del Ricordo',
    emoji: '🕯️', colore: '#f59e0b',
    bordoTop: 'linear-gradient(90deg,#f59e0b,#ef4444)',
    breve: 'Si ricordano le vittime delle foibe e l\'esodo giuliano-dalmata.',
    descrizione: 'Istituito con la legge n. 92/2004, commemora i massacri delle foibe perpetrati dai partigiani jugoslavi tra il 1943 e il 1945, e l\'esodo forzato di oltre 250.000 italiani dall\'Istria, Fiume e Dalmazia. Per decenni fu un tema rimosso dalla memoria pubblica.',
  },
  {
    mese: 2, giorno: 11,
    nome: 'Patti Lateranensi',
    emoji: '✝️', colore: '#f59e0b',
    bordoTop: 'linear-gradient(90deg,#f59e0b,#fbbf24)',
    breve: '11 febbraio 1929: accordo tra lo Stato italiano e la Santa Sede.',
    descrizione: 'L\'11 febbraio 1929 Mussolini e il Cardinale Gasparri firmarono i Patti Lateranensi, che riconobbero la sovranità della Città del Vaticano e pose fine alla "questione romana" aperta nel 1870. L\'art. 7 della Costituzione (1948) li richiama espressamente, pur in un sistema di separazione tra Stato e Chiesa.',
  },
  {
    mese: 3, giorno: 8,
    nome: 'Giornata Internazionale della Donna',
    emoji: '♀️', colore: '#f472b6',
    bordoTop: 'linear-gradient(90deg,#f472b6,#a78bfa)',
    breve: 'Si celebrano i diritti delle donne e la parità di genere.',
    descrizione: 'L\'8 marzo ricorda le lotte per i diritti delle donne. In Italia le donne ottennero il diritto di voto nel 1945 (D.Lgs.Lgt. n. 23). L\'art. 3 Cost. sancisce l\'uguaglianza senza distinzione di sesso; l\'art. 37 tutela il lavoro femminile. La legge n. 125/1991 e il Codice delle Pari Opportunità (D.Lgs. 198/2006) completano il quadro normativo.',
  },
  {
    mese: 3, giorno: 16,
    nome: 'Strage di Via Fani — Sequestro Moro',
    emoji: '🕊️', colore: '#94a3b8',
    bordoTop: 'linear-gradient(90deg,#64748b,#94a3b8)',
    breve: '16 marzo 1978: le BR rapiscono Aldo Moro e uccidono 5 agenti.',
    descrizione: 'Il 16 marzo 1978, in via Fani a Roma, un commando delle Brigate Rosse tese un\'imboscata al convoglio di Aldo Moro, presidente della DC, uccidendo i cinque uomini della scorta (Ricci, Zizzi, Leonardi, Rivera, Iozzino). Moro fu tenuto prigioniero 55 giorni e ucciso il 9 maggio 1978. Il caso segnò un\'intera stagione della Repubblica.',
  },
  {
    mese: 3, giorno: 17,
    nome: 'Anniversario dell\'Unità d\'Italia',
    emoji: '🇮🇹', colore: '#22c55e',
    bordoTop: 'linear-gradient(90deg,#009246,#fff 50%,#ce2b37)',
    breve: '17 marzo 1861: nasce il Regno d\'Italia.',
    descrizione: 'Il 17 marzo 1861 il Parlamento subalpino proclamò Vittorio Emanuele II Re d\'Italia, completando il Risorgimento. Non è festività: la legge n. 222/2012 l\'ha istituita come giornata celebrativa. Roma divenne capitale solo nel 1871, dopo la breccia di Porta Pia.',
  },
  {
    mese: 3, giorno: 21,
    nome: 'Giornata della Memoria delle vittime di mafia',
    emoji: '🌸', colore: '#fb7185',
    bordoTop: 'linear-gradient(90deg,#fb7185,#f97316)',
    breve: 'Si ricordano le vittime innocenti di Cosa Nostra, Camorra, \'Ndrangheta.',
    descrizione: 'Istituita dall\'associazione Libera di Don Luigi Ciotti nel 1996, il 21 marzo — primo giorno di primavera — si leggono pubblicamente i nomi delle oltre 1.000 vittime innocenti delle mafie. La giornata è riconosciuta dallo Stato con la legge n. 20/2017.',
  },
  {
    mese: 4, giorno: 25,
    nome: 'Festa della Liberazione',
    emoji: '🕊️', colore: '#38bdf8',
    bordoTop: 'linear-gradient(90deg,#38bdf8,#818cf8)',
    breve: '25 aprile 1945: fine dell\'occupazione nazifascista.',
    descrizione: 'Il 25 aprile 1945 i partigiani insorsero nelle principali città del Nord, ponendo fine alla Resistenza. Il CLN proclamò la liberazione. È festa nazionale dal 1949 (legge n. 260). La Resistenza ispira i valori fondanti della Repubblica ed è richiamata nel preambolo ideale della Costituzione.',
  },
  {
    mese: 5, giorno: 1,
    nome: 'Festa dei Lavoratori',
    emoji: '⚙️', colore: '#ef4444',
    bordoTop: 'linear-gradient(90deg,#ef4444,#f97316)',
    breve: 'Si celebra il lavoro come fondamento della Repubblica.',
    descrizione: 'L\'art. 1 Cost. recita: «L\'Italia è una Repubblica democratica, fondata sul lavoro». La Festa ricorda le lotte per i diritti dei lavoratori (Haymarket, Chicago 1886). È festa nazionale dal 1945. Il Titolo III della Costituzione (artt. 35–47) tutela il lavoro in tutte le sue forme.',
  },
  {
    mese: 5, giorno: 9,
    nome: 'Giornata dell\'Europa · Giornata della Legalità',
    emoji: '🇪🇺', colore: '#818cf8',
    bordoTop: 'linear-gradient(90deg,#818cf8,#38bdf8)',
    breve: '9 maggio 1950: Dichiarazione Schuman. 9 maggio 1978: trovato il corpo di Aldo Moro.',
    descrizione: 'Il 9 maggio è doppiamente significativo. Nel 1950 il ministro francese Robert Schuman propose la CECA, primo passo verso l\'UE. Nel 1978 fu ritrovato in Via Caetani a Roma il corpo di Aldo Moro, presidente della DC, assassinato dalle Brigate Rosse dopo 55 giorni di prigionia. È anche la Giornata Nazionale della Legalità.',
  },
  {
    mese: 5, giorno: 23,
    nome: 'Strage di Capaci — Giovanni Falcone',
    emoji: '⚖️', colore: '#fbbf24',
    bordoTop: 'linear-gradient(90deg,#fbbf24,#f97316)',
    breve: '23 maggio 1992: la mafia uccise Giovanni Falcone.',
    descrizione: 'Alle 17:58 del 23 maggio 1992, un\'autobomba sulla A29 vicino Capaci uccise il giudice Giovanni Falcone, la moglie Francesca Morvillo e gli agenti Schifani, Dicillo e Montinaro. Falcone aveva costruito il pool antimafia e il maxiprocesso del 1986-87 che portò alla condanna di 360 boss di Cosa Nostra.',
  },
  {
    mese: 5, giorno: 28,
    nome: 'Strage di Piazza della Loggia — Brescia',
    emoji: '💣', colore: '#f97316',
    bordoTop: 'linear-gradient(90deg,#f97316,#fbbf24)',
    breve: '28 maggio 1974: bomba durante un comizio antifascista a Brescia.',
    descrizione: 'Il 28 maggio 1974, durante un comizio della CISL contro il terrorismo neofascista, una bomba esplose in Piazza della Loggia a Brescia: 8 morti e 102 feriti. Dopo oltre trent\'anni di processi, la Corte di Cassazione ha definitivamente condannato nel 2017 gli esecutori, militanti di Ordine Nuovo.',
  },
  {
    mese: 6, giorno: 2,
    nome: 'Festa della Repubblica',
    emoji: '🏛️', colore: '#38bdf8',
    bordoTop: 'linear-gradient(90deg,#009246,#fff 50%,#ce2b37)',
    breve: '2 giugno 1946: gli italiani scelgono la Repubblica.',
    descrizione: 'Il 2 giugno 1946, con il referendum istituzionale, i cittadini italiani — per la prima volta anche le donne — votarono per la forma dello Stato. La Repubblica prevalse sulla Monarchia con il 54,3% dei voti. La Costituzione repubblicana entrò in vigore il 1° gennaio 1948.',
  },
  {
    mese: 6, giorno: 27,
    nome: 'Strage di Ustica',
    emoji: '✈️', colore: '#94a3b8',
    bordoTop: 'linear-gradient(90deg,#94a3b8,#64748b)',
    breve: '27 giugno 1980: il DC-9 Itavia precipitò nel Mar Tirreno.',
    descrizione: 'Il 27 giugno 1980, il volo Itavia Bologna-Palermo precipitò tra Ustica e Ponza: morirono 81 persone. Le cause restano ufficialmente non accertate; le ipotesi includono un missile. Le sentenze civili hanno condannato i Ministeri della Difesa e dei Trasporti per omissioni. È simbolo del diritto alla verità.',
  },
  {
    mese: 7, giorno: 19,
    nome: 'Strage di Via D\'Amelio — Paolo Borsellino',
    emoji: '⚖️', colore: '#fbbf24',
    bordoTop: 'linear-gradient(90deg,#fbbf24,#ef4444)',
    breve: '19 luglio 1992: la mafia uccise Paolo Borsellino.',
    descrizione: 'Solo 57 giorni dopo Capaci, il 19 luglio 1992 un\'autobomba in Via D\'Amelio a Palermo uccise il giudice Paolo Borsellino e gli agenti Catalano, Loi, Li Muli, Cosina e Traina. Borsellino, stretto collaboratore di Falcone, aveva già comunicato il proprio presentimento di morte agli inquirenti.',
  },
  {
    mese: 8, giorno: 2,
    nome: 'Strage della Stazione di Bologna',
    emoji: '💣', colore: '#f97316',
    bordoTop: 'linear-gradient(90deg,#f97316,#ef4444)',
    breve: '2 agosto 1980: l\'attentato più grave del dopoguerra italiano.',
    descrizione: 'Il 2 agosto 1980, alle 10:25, una bomba esplose nella sala d\'aspetto della Stazione Centrale di Bologna: 85 morti e oltre 200 feriti. Dopo decenni di processi, la Cassazione ha definitivamente condannato i neofascisti dei NAR e ha accertato il depistaggio dei servizi segreti deviati.',
  },
  {
    mese: 9, giorno: 8,
    nome: 'Armistizio di Cassibile',
    emoji: '🤝', colore: '#a78bfa',
    bordoTop: 'linear-gradient(90deg,#a78bfa,#38bdf8)',
    breve: '8 settembre 1943: l\'Italia annuncia la resa agli Alleati.',
    descrizione: 'L\'8 settembre 1943 il generale Badoglio annunciò l\'armistizio firmato a Cassibile con gli Alleati. Aprì una fase tragica: la Wehrmacht occupò il Centro-Nord, migliaia di soldati italiani furono catturati, nacque la Repubblica Sociale Italiana. È data complessa, tra resa e inizio della Resistenza.',
  },
  {
    mese: 9, giorno: 20,
    nome: 'Presa di Roma',
    emoji: '🏛️', colore: '#f59e0b',
    bordoTop: 'linear-gradient(90deg,#f59e0b,#22c55e)',
    breve: '20 settembre 1870: breccia di Porta Pia, Roma capitale.',
    descrizione: 'Il 20 settembre 1870 le truppe del Regno d\'Italia aprirono la breccia di Porta Pia, ponendo fine al potere temporale della Chiesa e completando l\'unificazione. Roma divenne capitale nel 1871. La Legge delle Guarentigie del 1871 regolò i rapporti Stato-Chiesa fino ai Patti Lateranensi del 1929.',
  },
  {
    mese: 10, giorno: 16,
    nome: 'Rastrellamento del Ghetto di Roma',
    emoji: '🕯️', colore: '#a78bfa',
    bordoTop: 'linear-gradient(90deg,#a78bfa,#818cf8)',
    breve: '16 ottobre 1943: le SS rastrellano oltre 1.000 ebrei romani.',
    descrizione: 'All\'alba del 16 ottobre 1943, le SS tedesche rastrellarono il Ghetto di Roma e altri quartieri: 1.259 persone furono deportate ad Auschwitz. Solo 16 sopravvissero. L\'episodio avvenne sotto gli occhi del Vaticano e rimase a lungo rimosso dalla memoria collettiva. Il 16 ottobre è ricordato dalla Comunità Ebraica di Roma.',
  },
  {
    mese: 11, giorno: 4,
    nome: 'Festa dell\'Unità Nazionale',
    emoji: '🎖️', colore: '#22c55e',
    bordoTop: 'linear-gradient(90deg,#009246,#fff 50%,#ce2b37)',
    breve: '4 novembre 1918: fine della Prima Guerra Mondiale per l\'Italia.',
    descrizione: 'Il 4 novembre 1918 entrò in vigore l\'armistizio che chiuse le ostilità sul fronte italiano: l\'Italia ottenne Trento, Trieste e Istria. È festa nazionale (legge n. 260/1949) e celebra anche le Forze Armate, richiamate dall\'art. 52 Cost. che sancisce la difesa della Patria come sacro dovere.',
  },
  {
    mese: 11, giorno: 20,
    nome: 'Giornata Mondiale dei Diritti dell\'Infanzia',
    emoji: '🌱', colore: '#22c55e',
    bordoTop: 'linear-gradient(90deg,#22c55e,#38bdf8)',
    breve: '20 novembre 1989: l\'ONU adotta la Convenzione sui Diritti dell\'Infanzia.',
    descrizione: 'Il 20 novembre 1989 l\'Assemblea Generale dell\'ONU approvò la CRC (Convention on the Rights of the Child), il trattato internazionale sui diritti dei minori più ratificato al mondo (196 stati). L\'Italia l\'ha ratificata con la legge n. 176/1991. Riconosce il diritto all\'istruzione, alla salute, alla protezione da ogni forma di abuso.',
  },
  {
    mese: 12, giorno: 10,
    nome: 'Giornata dei Diritti Umani',
    emoji: '🌍', colore: '#38bdf8',
    bordoTop: 'linear-gradient(90deg,#38bdf8,#a78bfa)',
    breve: '10 dicembre 1948: l\'ONU adotta la Dichiarazione Universale dei Diritti Umani.',
    descrizione: 'Il 10 dicembre 1948 l\'Assemblea Generale dell\'ONU approvò la UDHR (A/RES/217), 30 articoli che riconoscono i diritti fondamentali di ogni essere umano. L\'Italia recepisce i principi nella Costituzione (artt. 2, 3, 13-28) e tramite la CEDU, ratificata con la legge n. 848/1955.',
  },
  {
    mese: 12, giorno: 12,
    nome: 'Strage di Piazza Fontana',
    emoji: '💣', colore: '#f97316',
    bordoTop: 'linear-gradient(90deg,#f97316,#ef4444)',
    breve: '12 dicembre 1969: la bomba alla Banca Nazionale dell\'Agricoltura di Milano.',
    descrizione: 'Il 12 dicembre 1969, una bomba esplose nella sede milanese della Banca Nazionale dell\'Agricoltura in Piazza Fontana: 17 morti e 88 feriti. È l\'atto inaugurale della "strategia della tensione". Dopo decenni di depistaggi e processi, i responsabili non sono mai stati definitivamente condannati. Il ferroviere anarchico Giuseppe Pinelli morì cadendo dalla finestra della Questura di Milano.',
  },
  {
    mese: 12, giorno: 27,
    nome: 'Promulgazione della Costituzione',
    emoji: '📜', colore: '#38bdf8',
    bordoTop: 'linear-gradient(90deg,#009246,#fff 50%,#ce2b37)',
    breve: '27 dicembre 1947: il Presidente De Nicola firma la Costituzione.',
    descrizione: 'Il 27 dicembre 1947 il Capo provvisorio dello Stato Enrico De Nicola promulgò la Costituzione della Repubblica Italiana, approvata dall\'Assemblea Costituente il 22 dicembre. Fu pubblicata nella Gazzetta Ufficiale n. 298 (edizione straordinaria) ed entrò in vigore il 1° gennaio 1948.',
  },
];

export default function NormaHome() {
  const [mounted, setMounted] = useState(false); // FIX: evita hydration mismatch
  const [festaCivile, setFestaCivile] = useState<typeof FESTE_CIVILI[0] | null>(null);
  const [festaEspansa, setFestaEspansa] = useState(false);
  const [cur, setCur] = useState(0);
  const touchStartX = useRef<number>(0);
  const wheelTimeout = useRef<any>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(staticCategories);
  const [homeArticles, setHomeArticles] = useState<any[]>([]);
  const [fascicolo, setFascicolo] = useState<{url: string, title: string} | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyCatIndex, setStoryCatIndex] = useState(0);
  const [storyCatName, setStoryCatName] = useState('');
  const [storyPosts, setStoryPosts] = useState<any[]>([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyLoading, setStoryLoading] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyCache = useRef<Record<string, any[]>>({});
  const STORY_LS_KEY = 'norma_story_cache_v2';
  const STORY_LS_TTL = 60 * 60 * 1000; // 1 ora
  const SEEN_KEY = 'norma_story_seen_v1';
  const [newCategories, setNewCategories] = useState<Set<string>>(new Set());
  const seenRef = useRef<Record<string, string>>({});

  function salvaStoryCacheLS() {
    try {
      localStorage.setItem(STORY_LS_KEY, JSON.stringify({ ts: Date.now(), data: storyCache.current }));
    } catch {}
  }

  function computeNewCategories() {
    const news = new Set<string>();
    Object.entries(storyCache.current).forEach(([name, posts]) => {
      if (!Array.isArray(posts) || posts.length === 0) return;
      const latestDate = posts[0]?.date as string;
      const seenDate = seenRef.current[name];
      if (!seenDate || latestDate > seenDate) news.add(name);
    });
    setNewCategories(news);
  }

  function markSeen(name: string) {
    const posts = storyCache.current[name];
    if (posts?.[0]?.date) {
      seenRef.current[name] = posts[0].date as string;
      try { localStorage.setItem(SEEN_KEY, JSON.stringify(seenRef.current)); } catch {}
      setNewCategories(prev => { const next = new Set(prev); next.delete(name); return next; });
    }
  }

  // FIX: imposta mounted a true solo sul client
  useEffect(() => {
    setMounted(true);
    const now = new Date();
    const m = now.getMonth() + 1;
    const g = now.getDate();
    const festa = FESTE_CIVILI.find(f => f.mese === m && f.giorno === g);
    if (festa) {
      const chiaveChiusa = `norma_festa_chiusa_${now.getFullYear()}-${m}-${g}`;
      if (!sessionStorage.getItem(chiaveChiusa)) setFestaCivile(festa);
    }
    // Carica seen map
    try {
      const rawSeen = localStorage.getItem(SEEN_KEY);
      if (rawSeen) seenRef.current = JSON.parse(rawSeen);
    } catch {}
    // Carica cache da localStorage al mount — storie istantanee al secondo avvio
    try {
      const raw = localStorage.getItem(STORY_LS_KEY);
      if (raw) {
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts < STORY_LS_TTL && data && typeof data === 'object') {
          storyCache.current = data;
          computeNewCategories();
        }
      }
    } catch {}
  }, []);

  async function loadCatPosts(name: string, catId: number): Promise<any[]> {
    if (storyCache.current[name]) return storyCache.current[name];
    try {
      const postsRes = await fetch(`https://orizzontegiuridico.com/wp-json/wp/v2/posts?_embed&categories=${catId}&per_page=5`);
      const data = await postsRes.json();
      const posts = Array.isArray(data) ? data : [];
      storyCache.current[name] = posts;
      salvaStoryCacheLS();
      return posts;
    } catch { return []; }
  }

  useEffect(() => {
    fetch('/api/home-data')
      .then(r => r.json())
      .then(({ cats, articles, fascicolo: f, storyPosts }) => {
        // Popola subito la cache con i post già fetchati server-side
        if (storyPosts && typeof storyPosts === 'object') {
          Object.entries(storyPosts).forEach(([name, posts]) => {
            if (Array.isArray(posts) && posts.length > 0) {
              storyCache.current[name] = posts as any[];
            }
          });
          salvaStoryCacheLS();
          computeNewCategories();
        }
        if (Array.isArray(cats)) {
          const merged = staticCategories.map(sc => {
            const found = cats.find((d: any) => d.name === sc.name);
            return found ? { ...sc, id: found.id } : sc;
          });
          setCategories(merged);
          // Preloading in background per categorie non ancora in cache
          merged.slice(0, 6).forEach(cat => {
            if (!storyCache.current[cat.name]) {
              loadCatPosts(cat.name, cat.id);
            }
          });
        }
        if (Array.isArray(articles)) setHomeArticles(articles);
        if (f) setFascicolo(f);
      })
      .catch(() => {
        staticCategories.slice(0, 6).forEach(cat => loadCatPosts(cat.name, cat.id));
      });
  }, []);

  async function openStory(catIdx: number) {
    const cat = categories[catIdx];
    markSeen(cat.name);
    navigator.vibrate?.(8);
    setStoryCatIndex(catIdx);
    setStoryCatName(cat.name);
    setStoryIndex(0);
    setStoryProgress(0);
    setStoryOpen(true);
    if (storyCache.current[cat.name]) {
      setStoryPosts(storyCache.current[cat.name]);
      setStoryLoading(false);
    } else {
      setStoryLoading(true);
      const posts = await loadCatPosts(cat.name, cat.id);
      setStoryPosts(posts);
      setStoryLoading(false);
    }
    if (catIdx + 1 < categories.length) {
      const next = categories[catIdx + 1];
      loadCatPosts(next.name, next.id);
    }
  }

  async function nextStory() {
    if (storyIndex < storyPosts.length - 1) {
      setStoryIndex(i => i + 1);
      setStoryProgress(0);
    } else {
      const nextCatIdx = storyCatIndex + 1;
      if (nextCatIdx < categories.length) {
        const name = categories[nextCatIdx].name;
        setStoryCatIndex(nextCatIdx);
        setStoryCatName(name);
        setStoryIndex(0);
        setStoryProgress(0);
        if (storyCache.current[name]) {
          setStoryPosts(storyCache.current[name]);
          setStoryLoading(false);
        } else {
          setStoryLoading(true);
          const posts = await loadCatPosts(name, categories[nextCatIdx].id);
          setStoryPosts(posts);
          setStoryLoading(false);
        }
        if (nextCatIdx + 1 < categories.length) {
          loadCatPosts(categories[nextCatIdx + 1].name, categories[nextCatIdx + 1].id);
        }
      } else {
        setStoryOpen(false);
      }
    }
  }

  function prevStory() {
    if (storyIndex > 0) {
      setStoryIndex(i => i - 1);
      setStoryProgress(0);
    }
  }

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }
        .app { font-family: 'Montserrat', sans-serif; background: #0a0d18; width: 100%; min-height: 100vh; }
        .feed { min-height: 100vh; overflow-y: auto; padding: 20px 16px 140px; scroll-behavior: smooth; }
        .feed::-webkit-scrollbar { display: none; }
        .slbl { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; }
        .slbl-t { font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.22); }
        .slbl-l { flex: 1; height: 0.5px; background: rgba(255,255,255,0.05); }
        .cats { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 14px; margin-bottom: 6px; scrollbar-width: none; min-height: 90px; align-items: flex-start; }
        .cats::-webkit-scrollbar { display: none; }
        .cat { display: flex; flex-direction: column; align-items: center; gap: 5px; flex-shrink: 0; min-width: 82px; }
        .cat-ring { width: 56px; height: 56px; border-radius: 50%; padding: 2.5px; background: linear-gradient(135deg,#0a3060,#8fd3ff); flex-shrink: 0; }
        .cat-inn { width: 100%; height: 100%; border-radius: 50%; background: #07162b; border: 2px solid #0a0d18; display: flex; align-items: center; justify-content: center; }
        .cat-lbl { font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.4); }
        .hero-wrap { position: relative; border-radius: 20px; overflow: hidden; margin-bottom: 16px; aspect-ratio: 4/5; background: linear-gradient(135deg,#07162b 0%,#0d2040 100%); }
        .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease; }
        .hero-ov1 { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,15,40,0.95) 0%, rgba(0,15,40,0.7) 45%, rgba(0,15,40,0.05) 100%); }
        .hero-ov2 { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,15,40,0.75) 0%, transparent 50%); }
        .hero-body { position: absolute; bottom: 0; left: 0; padding: 28px 22px 40px; max-width: 88%; display: flex; flex-direction: column; gap: 10px; }
        .hero-tag { font-size: 8px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.65); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; padding: 5px 14px; display: inline-block; align-self: flex-start; }
        .hero-title { font-size: 34px; font-weight: 900; color: #fff; line-height: 1.05; letter-spacing: -0.8px; margin: 0; }
        .hero-sub { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.65; margin: 0; }
        .hero-dots { position: absolute; bottom: 10px; right: 14px; display: flex; gap: 5px; }
        .hero-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.25); }
        .hero-dot.on { width: 14px; border-radius: 10px; background: #fff; }
        .art { border-radius: 18px; overflow: hidden; margin-bottom: 10px; border: 0.5px solid rgba(255,255,255,0.06); background: #111526; transition: 0.2s ease; }
        .art:hover { transform: translateY(-1px); }
        .art-body { padding: 12px 14px 14px; }
        .art-title { font-size: 13px; font-weight: 800; color: #fff; line-height: 1.2; margin: 7px 0 8px; }
        .badge-og, .badge-odl { font-size: 8px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 20px; padding: 3px 8px; }
        .badge-og { color: #8fd3ff; border: 0.5px solid rgba(143,211,255,0.3); }
        .badge-odl { color: #a8c8f0; border: 0.5px solid rgba(168,200,240,0.3); }
        .badge-cat { font-size: 8px; font-weight: 600; color: rgba(255,255,255,0.22); letter-spacing: 1px; text-transform: uppercase; }
        .art-meta { display: flex; justify-content: space-between; }
        .art-date { font-size: 10px; color: rgba(255,255,255,0.3); }
        .art-read { font-size: 8px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #8fd3ff; }
        img { display: block; }
        a { text-decoration: none; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
      `}</style>
      <div className="app">
        <Header />
        <div className="feed">
          {/* BANNER FESTA CIVILE */}
          {festaCivile && (
            <div style={{ borderRadius: 18, overflow: 'hidden', marginBottom: 16, position: 'relative', background: '#0d1526', border: `0.5px solid ${festaCivile.colore}44` }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: festaCivile.bordoTop }} />
              {/* Header — sempre visibile */}
              <div
                onClick={() => setFestaEspansa(e => !e)}
                style={{ padding: '14px 16px 14px', display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}
              >
                <div style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{festaCivile.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' as const, color: festaCivile.colore, marginBottom: 4, opacity: 0.8 }}>
                    Oggi · Festa Civile
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', lineHeight: 1.25, marginBottom: 3 }}>
                    {festaCivile.nome}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                    {festaCivile.breve}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, alignSelf: 'flex-start', paddingTop: 2 }}>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      const now = new Date();
                      sessionStorage.setItem(`norma_festa_chiusa_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`, '1');
                      setFestaCivile(null);
                    }}
                    style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 26, height: 26, color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >✕</button>
                  <div style={{ textAlign: 'center', fontSize: 13, color: `${festaCivile.colore}99`, transition: 'transform 0.2s', transform: festaEspansa ? 'rotate(180deg)' : 'none' }}>▾</div>
                </div>
              </div>
              {/* Contenuto espanso */}
              {festaEspansa && (
                <div style={{ padding: '0 16px 16px', borderTop: `0.5px solid ${festaCivile.colore}22` }}>
                  <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, margin: '12px 0 0' }}>
                    {festaCivile.descrizione}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* CATEGORIE */}
          <div className="slbl" style={{ marginTop: 4 }}>
            <span className="slbl-t">Categorie</span>
            <div className="slbl-l"></div>
          </div>
          <div className="cats">
            {categories.map((cat, idx) => (
              <button key={idx} className="cat" onClick={() => openStory(idx)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, width: 82, flexShrink: 0 }}>
                <div className="cat-ring" style={newCategories.has(cat.name)
                  ? { boxShadow: '0 0 12px rgba(143,211,255,0.35)' }
                  : { background: 'rgba(255,255,255,0.1)' }}>
                  <div className="cat-inn">
                    {icons[cat.name] || <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="2" stroke="#8fd3ff" strokeWidth="1.8"/></svg>}
                  </div>
                </div>
                <span className="cat-lbl" style={{ marginTop: 8, lineHeight: 1.1, textAlign: 'center', display: 'block', maxWidth: 78, fontSize: cat.name.length > 12 ? 8 : 9 }}>
                  {shortNames[cat.name] || cat.name}
                </span>
              </button>
            ))}
          </div>

          {/* CAROUSEL */}
          <div className="slbl">
            <span className="slbl-t">Cos'è Norma</span>
            <div className="slbl-l"></div>
          </div>
          <div
            className="hero-wrap"
            onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
              const diff = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 30) {
                if (diff > 0) setCur(p => (p + 1) % slides.length);
                else setCur(p => (p - 1 + slides.length) % slides.length);
              }
            }}
            onWheel={e => {
              if (Math.abs(e.deltaX) < 10) return;
              if (wheelTimeout.current) return;
              wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 600);
              if (e.deltaX > 0) setCur(p => (p + 1) % slides.length);
              else setCur(p => (p - 1 + slides.length) % slides.length);
            }}
          >
            {/* FIX: mounted evita il flash — sul server non renderizza mai il ramo con l'immagine */}
            {mounted && slides[cur].img ? (
              <>
                <img className="hero-img" src={slides[cur].img} alt="" />
                <div className="hero-ov1" />
                <div className="hero-ov2" />
                <div className="hero-body">
                  <span className="hero-tag">{slides[cur].tag}</span>
                  <div className="hero-title" dangerouslySetInnerHTML={{ __html: slides[cur].title }} />
                  <div className="hero-sub">{slides[cur].sub}</div>
                </div>
              </>
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#07162b 0%,#0d2040 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 28px', gap: 20 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right,#8fd3ff44,#8fd3ff,#8fd3ff44)' }} />
                <span style={{ display: 'inline-block', fontSize: 8, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const, color: '#8fd3ff', border: '1px solid rgba(143,211,255,0.3)', borderRadius: 20, padding: '5px 14px', alignSelf: 'flex-start' }}>{slides[cur].tag}</span>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1.08, letterSpacing: -0.8 }} dangerouslySetInnerHTML={{ __html: slides[cur].title }} />
                <div style={{ width: 40, height: 2, borderRadius: 1, background: 'rgba(143,211,255,0.4)' }} />
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, maxWidth: '95%' }}>{slides[cur].sub}</div>
              </div>
            )}
            <div className="hero-dots">
              {slides.map((_, i) => <div key={i} className={`hero-dot ${i === cur ? 'on' : ''}`} />)}
            </div>
          </div>

          {/* ARTICOLI */}
          <div className="slbl">
            <span className="slbl-t">Ultimi articoli</span>
            <div className="slbl-l"></div>
          </div>
          {homeArticles.length > 0 ? homeArticles.map((post, i) => {
            const isOdl = post._source === 'odl';
            const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const catName = post?._embedded?.['wp:term']?.[0]?.[0]?.name || '';
            const date = post?.date ? new Date(post.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : '';
            return (
              <a key={i} href={isOdl ? post.link : `/articoli/${post.slug}`} target={isOdl ? '_blank' : '_self'} rel={isOdl ? 'noreferrer' : undefined} className="art" style={{ display: 'block' }}>
                {img
                  ? <img src={img} alt="" style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                  : <div style={{ height: 130, background: '#07162b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>📄</div>
                }
                <div className="art-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isOdl ? <span className="badge-odl">Orizzonti del Diritto</span> : <span className="badge-og">Orizzonte Giuridico</span>}
                    {catName && <span className="badge-cat">{catName}</span>}
                  </div>
                  <div className="art-title" dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }} />
                  <div className="art-meta">
                    <span className="art-date">{date}</span>
                    <span className="art-read">Leggi →</span>
                  </div>
                </div>
              </a>
            );
          }) : [0,1,2].map(i => (
            <div key={i} className="art">
              <div className="shimmer" style={{ height: 130 }} />
              <div style={{ padding: '12px 14px 14px' }}>
                <div className="shimmer" style={{ height: 10, borderRadius: 6, width: '40%', marginBottom: 10 }} />
                <div className="shimmer" style={{ height: 15, borderRadius: 6, marginBottom: 6 }} />
                <div className="shimmer" style={{ height: 15, borderRadius: 6, width: '70%', marginBottom: 12 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="shimmer" style={{ height: 10, borderRadius: 6, width: '20%' }} />
                  <div className="shimmer" style={{ height: 10, borderRadius: 6, width: '12%' }} />
                </div>
              </div>
            </div>
          ))}
          <a href="/articoli" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', borderRadius: 16, background: 'rgba(143,211,255,0.08)', border: '0.5px solid rgba(143,211,255,0.2)', color: '#8fd3ff', fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>
            VEDI TUTTI GLI ARTICOLI →
          </a>
          {fascicolo && (
            <a href={fascicolo.url} target="_blank" rel="noreferrer" download
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 0', borderRadius: 16, background: 'rgba(168,200,240,0.08)', border: '0.5px solid rgba(168,200,240,0.25)', color: '#a8c8f0', fontSize: 10, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8c8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              SCARICA L'ULTIMO FASCICOLO
            </a>
          )}

          {/* INSTAGRAM */}
          <div className="slbl" style={{ marginTop: 8 }}>
            <span className="slbl-t">Instagram</span>
            <div className="slbl-l"></div>
          </div>
          <InstagramEmbed />

          {/* SOCIAL */}
          <div className="slbl" style={{ marginTop: 4 }}>
            <span className="slbl-t">Seguici</span>
            <div className="slbl-l"></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
            <a href="https://www.instagram.com/orizzonte.giuridico/" target="_blank" rel="noreferrer"
              style={{ borderRadius: 16, background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2"/>
                <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2"/>
                <circle cx="17.5" cy="6.5" r="1.5" fill="white"/>
              </svg>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>INSTAGRAM</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9 }}>@orizzonte.giuridico</span>
            </a>
            <a href="https://www.tiktok.com/@orizzonte.giuridi" target="_blank" rel="noreferrer"
              style={{ borderRadius: 16, background: '#111526', border: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
              </svg>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>TIKTOK</span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>@orizzonte.giuridi</span>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61589319283875" target="_blank" rel="noreferrer"
              style={{ borderRadius: 16, background: '#1877F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>FACEBOOK</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9 }}>Orizzonte Giuridico</span>
            </a>
            <a href="https://www.linkedin.com/company/orizzonte-giuridico" target="_blank" rel="noreferrer"
              style={{ borderRadius: 16, background: '#0A66C2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 12px', gap: 8 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 800 }}>LINKEDIN</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9 }}>Orizzonte Giuridico</span>
            </a>
          </div>
        </div>
      </div>

      {/* STORY MODAL */}
      {storyOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column' }}
          onClick={e => {
            const x = (e as any).clientX;
            const w = window.innerWidth;
            if (x > w / 2) nextStory();
            else prevStory();
          }}
        >
          <div style={{ display: 'flex', gap: 4, padding: '12px 12px 0', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
            {(storyLoading ? [0] : storyPosts).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 99, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: '#fff',
                  width: i < storyIndex ? '100%' : i === storyIndex ? `${storyProgress}%` : '0%',
                  transition: i === storyIndex ? 'width 0.1s linear' : 'none',
                }} />
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', top: 22, left: 0, right: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#0a3060,#8fd3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {icons[storyCatName]
                    ? <span style={{ display: 'flex', transform: 'scale(0.72)' }}>{icons[storyCatName]}</span>
                    : <span style={{ fontSize: 16 }}>🏛️</span>}
                </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{storyCatName}</div>
                {!storyLoading && storyPosts[storyIndex] && (
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
                    {new Date(storyPosts[storyIndex].date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); setStoryOpen(false); }}
              style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 32, height: 32, color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>
          </div>
          {storyLoading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              Caricamento...
            </div>
          ) : storyPosts.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              Nessun articolo trovato
            </div>
          ) : (() => {
            const post = storyPosts[storyIndex];
            const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
            const excerpt = post?.excerpt?.rendered?.replace(/<[^>]+>/g, '').slice(0, 120) + '...';
            const link = post?.link;
            return (
              <>
                {img && <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, background: img ? 'linear-gradient(to top,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.4) 50%,rgba(0,0,0,0.5) 100%)' : '#07162b' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 20px 48px' }} onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.5)', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 10px', marginBottom: 12 }}>
                    ORIZZONTE GIURIDICO · {storyCatName.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: post?.title?.rendered || '' }} />
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 24 }}>{excerpt}</div>
                  {link && (
                    <a href={post?.slug ? `/articoli/${post.slug}` : link} target="_blank" rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0a0d18', fontWeight: 800, fontSize: 12, letterSpacing: 1, padding: '13px 24px', borderRadius: 999, textDecoration: 'none' }}>
                      LEGGI L'ARTICOLO →
                    </a>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
      {storyOpen && !storyLoading && storyPosts.length > 0 && (
        <StoryTimer key={`${storyCatIndex}-${storyIndex}`} onTick={p => setStoryProgress(p)} onEnd={nextStory} />
      )}
      <Footer />
    </>
  );
}