'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Sezione = {
  id: string;
  titolo: string;
  sub: string;
  colore: string;
  bg: string;
  icon: string;
  blocchi: Blocco[];
};

type Blocco =
  | { tipo: 'testo'; contenuto: string }
  | { tipo: 'highlight'; testo: string; colore: string }
  | { tipo: 'box'; label: string; contenuto: string; colore?: string }
  | { tipo: 'lista'; items: { titolo?: string; testo: string }[] }
  | { tipo: 'articolo'; numero: string; testo: string; nota?: string }
  | { tipo: 'confronto'; left: { label: string; items: string[] }; right: { label: string; items: string[] }; coloreLeft: string; coloreRight: string };

const sezioni: Sezione[] = [
  // ── 1. CONTESTO ─────────────────────────────────────────────────────────
  {
    id: 'contesto',
    titolo: 'Il contesto storico',
    sub: 'Napoli, la Rivoluzione francese e l\'élite illuminista',
    colore: '#ffd700',
    bg: 'rgba(255,215,0,0.08)',
    icon: '🏛',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Napoli, fine Settecento. Mentre in Francia scoppiava la Rivoluzione, in città una sparuta élite di intellettuali, filosofi, avvocati e scienziati sognava un cambiamento radicale. Nei palazzi della borghesia colta, lontani dalla corte borbonica di Ferdinando IV, si leggeva Locke, Rousseau, Montesquieu. Si discuteva di diritti naturali, di libertà, di uguaglianza.',
      },
      {
        tipo: 'box',
        label: 'Napoli e il diritto alla felicità',
        colore: '#ffd700',
        contenuto:
          'Non fu solo la Francia a ispirare queste idee. Il giurista napoletano Gaetano Filangeri (1753–1788) fu tra i primi pensatori europei a parlare di "diritto alla felicità". Intrattenne una fitta corrispondenza con Benjamin Franklin, e molte delle sue idee — diffusesi negli Stati Uniti — si ritiene abbiano influito sulla stesura della Costituzione americana. Napoli, insomma, non era soltanto destinataria di idee rivoluzionarie: ne era anche una fonte.',
      },
      {
        tipo: 'testo',
        contenuto:
          'Nel 1798 il re Ferdinando IV, allarmato dalla caduta di Roma in mano francese, fuggì a Palermo lasciando la città nelle mani del vicario regio Francesco Pignatelli. I patrioti napoletani videro il momento. Tra gennaio e giugno 1799 Napoli visse la sua piccola grande rivoluzione.',
      },
      {
        tipo: 'lista',
        items: [
          { titolo: '20 gennaio 1799', testo: 'I patrioti conquistano Castel Sant\'Elmo, la rocca medievale sul Vomero che domina tutta la città.' },
          { titolo: '23 gennaio 1799', testo: 'Le truppe francesi entrano a Napoli. La Repubblica Napoletana è proclamata "una e indivisibile, sotto la protezione della grande nazione francese".' },
          { titolo: '2 febbraio 1799', testo: 'Esce il primo numero del Monitore Napoletano, diretto da Eleonora Fonseca Pimentel. Per la prima volta un giornale tenta di informare anche i ceti più umili, con un bollettino scritto in dialetto.' },
          { titolo: '7 febbraio 1799', testo: 'Vengono istituite le sale d\'istruzione, luoghi pubblici dove i cittadini possono riunirsi e partecipare a dibattiti. Un esperimento di democrazia diretta prima del suo tempo.' },
          { titolo: '1 aprile 1799', testo: 'Mario Pagano presenta al Governo Provvisorio il Progetto di Costituzione. Non entrerà mai in vigore: la Repubblica cadrà a giugno.' },
        ],
      },
    ],
  },

  // ── 2. PAGANO ───────────────────────────────────────────────────────────
  {
    id: 'pagano',
    titolo: 'Mario Francesco Pagano',
    sub: 'Il "Platone di Napoli" e la mente della Costituzione',
    colore: '#38bdf8',
    bg: 'rgba(56,189,248,0.08)',
    icon: '✍',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Mario Francesco Pagano (Brienza, Potenza 1748 – Napoli 1799) era un professore di diritto all\'Università di Napoli, avvocato stimato, filosofo illuminista e massone. Non era un politico di professione: scese in campo perché credeva genuinamente nelle idee che insegnava. Lo chiamavano "il Platone di Napoli".',
      },
      {
        tipo: 'box',
        label: 'Un uomo già perseguitato',
        colore: '#38bdf8',
        contenuto:
          'Pagano non era nuovo alle persecuzioni. Nel 1796 era già finito in carcere, accusato di attentare alla monarchia borbonica. Fu rilasciato per carenza di prove. Quando arrivò la Repubblica, non esitò: accettò la presidenza del Comitato di Legislazione e si mise a scrivere la Costituzione.',
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Il giurista', testo: 'Autore di numerosi testi di filosofia del diritto. Nei suoi "Saggi politici" aveva già elaborato le basi teoriche della sua visione costituzionale.' },
          { titolo: 'L\'abolizionista', testo: 'Promotore delle leggi contro la schiavitù di tipo feudale e contro la tortura nelle carceri. Per lui i diritti non erano astrazioni: andavano applicati subito.' },
          { titolo: 'L\'educatore', testo: 'Convinto che una repubblica senza istruzione fosse fragile, la sua Costituzione dedicava un intero titolo all\'educazione pubblica — non solo all\'istruzione tecnica, ma alla formazione del cittadino consapevole.' },
          { titolo: 'Il martire', testo: 'Giustiziato in Piazza Mercato il 29 ottobre 1799. Aveva 51 anni. Preghiere per graziarlo arrivarono da tutta Europa — persino dallo zar di Russia. Non servirono a niente.' },
        ],
      },
      {
        tipo: 'highlight',
        colore: '#38bdf8',
        testo: '"Mario Pagano fu impiccato il 29 ottobre 1799. Portava in tasca la bozza della sua Costituzione. Morì per un\'idea: che governare è un dovere penoso, una responsabilità pesante che si accetta per il bene degli altri."',
      },
    ],
  },

  // ── 3. STRUTTURA ────────────────────────────────────────────────────────
  {
    id: 'struttura',
    titolo: 'La struttura della Costituzione',
    sub: 'Dichiarazione dei diritti · 372 articoli · le istituzioni',
    colore: '#ffd700',
    bg: 'rgba(255,215,0,0.08)',
    icon: '📜',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Il testo che Pagano consegnò al Governo Provvisorio era un documento di straordinaria ampiezza e modernità. Si componeva di due parti principali: la Dichiarazione dei diritti e doveri, e la Costituzione vera e propria.',
      },
      {
        tipo: 'box',
        label: 'La Dichiarazione — 38 articoli',
        colore: '#ffd700',
        contenuto:
          'È la parte "filosofica" del testo. Lo Stato esiste per garantire i diritti naturali: uguaglianza, libertà, sicurezza, proprietà. Se non li garantisce, il cittadino non deve obbedienza. L\'uguaglianza — nella Costituzione francese era uno dei quattro diritti dell\'uomo — qui è posta al primo posto assoluto: è la base di tutti gli altri diritti. Una scelta precisa, non casuale.',
      },
      {
        tipo: 'box',
        label: 'La Costituzione vera e propria — 372 articoli',
        colore: '#a78bfa',
        contenuto:
          'Organizzava lo Stato in tre poteri distinti: legislativo (il Corpo Legislativo), esecutivo (l\'Arcontato, ispirato al Direttorio francese ma con correzioni originali) e giudiziario. A questi si aggiungeva l\'Eforato, un quarto organo del tutto originale — il vero contributo più innovativo di Pagano.',
      },
      {
        tipo: 'confronto',
        coloreLeft: '#ffd700',
        coloreRight: '#38bdf8',
        left: {
          label: 'Cosa prendeva dalla Francia',
          items: [
            'Struttura bicamerale del legislativo',
            'Separazione dei tre poteri',
            'Dichiarazione dei diritti e doveri',
            'Sistema direttoriale dell\'esecutivo',
            'Ispirazione alle Costituzioni del 1793 e 1795',
          ],
        },
        right: {
          label: 'Cosa inventava di originale',
          items: [
            'L\'Eforato: organo di controllo costituzionale',
            'Uguaglianza come primo diritto assoluto',
            'Dovere di solidarietà verso i bisognosi',
            'Titolo sull\'educazione pubblica (non solo istruzione)',
            'Doveri deontologici per i funzionari pubblici',
          ],
        },
      },
      {
        tipo: 'highlight',
        colore: '#ffd700',
        testo: 'Vennero stampate non più di 25 copie. Il testo fu censurato e proibito per vent\'anni. Riemerse solo nel 1820, curato dall\'avvocato Angelo Lanzellotti, nel clima che si avviava verso il Risorgimento.',
      },
    ],
  },

  // ── 4. SACRO DOVERE ─────────────────────────────────────────────────────
  {
    id: 'solidarieta',
    titolo: 'Il sacro dovere di aiutare i bisognosi',
    sub: 'Art. 19 della Dichiarazione — una norma rivoluzionaria',
    colore: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    icon: '🤝',
    blocchi: [
      {
        tipo: 'articolo',
        numero: 'Art. 19',
        testo: '"Quindi è sacro dovere dell\'uomo di alimentare i bisognosi."',
        nota: 'Dichiarazione dei diritti e doveri dell\'Uomo e del Cittadino — Progetto di Costituzione della Repubblica Napoletana, 1799',
      },
      {
        tipo: 'testo',
        contenuto:
          'Sei parole che, nel 1799, erano una piccola rivoluzione. In un\'epoca in cui le costituzioni parlavano quasi esclusivamente di diritti individuali — libertà, proprietà, sicurezza — Pagano inseriva tra i doveri fondamentali dell\'uomo quello di prendersi cura di chi è nel bisogno. Non come atto di carità volontaria, ma come obbligo morale e civile, definito esplicitamente "sacro".',
      },
      {
        tipo: 'box',
        label: 'Perché è rivoluzionario',
        colore: '#22c55e',
        contenuto:
          'La Costituzione francese del 1795, che Pagano conosceva bene, elencava i doveri del cittadino concentrandosi sul rispetto della legge e sui comportamenti privati irreprensibili. Non c\'era nulla di simile all\'art. 19 napoletano. Pagano andava oltre: lo Stato ha il dovere di garantire i diritti, e il cittadino ha il dovere di sostenere chi non ce la fa. Una visione solidaristica che anticipa di quasi duecento anni i principi fondamentali della Costituzione italiana del 1948.',
      },
      {
        tipo: 'confronto',
        coloreLeft: '#22c55e',
        coloreRight: '#38bdf8',
        left: {
          label: 'Costituzione Napoletana (1799)',
          items: [
            'Art. 19: "sacro dovere di alimentare i bisognosi"',
            'Solidarietà come dovere giuridico, non solo morale',
            'Il cittadino è parte attiva del benessere collettivo',
            'Assistenza medica finanziata dai benestanti',
            'Lo Stato tutela i lavoratori',
          ],
        },
        right: {
          label: 'Costituzione Italiana (1948)',
          items: [
            'Art. 2: doveri inderogabili di solidarietà politica, economica e sociale',
            'Art. 38: diritto al mantenimento e all\'assistenza sociale',
            'Art. 3: eguaglianza sostanziale — rimuovere gli ostacoli',
            'Art. 53: tutti concorrono alle spese pubbliche secondo capacità',
            'Lo stesso spirito, 150 anni dopo',
          ],
        },
      },
      {
        tipo: 'testo',
        contenuto:
          'Il resto della Dichiarazione disegnava un sistema coerente: l\'art. 20 affermava l\'obbligo di istruire e illuminare gli altri; gli artt. 25–26 imponevano ai pubblici funzionari di "consacrare la propria vita al bene della Repubblica" — una sorta di codice deontologico per chi esercita una funzione pubblica. Un sistema in cui diritti e doveri erano due facce della stessa medaglia.',
      },
      {
        tipo: 'highlight',
        colore: '#22c55e',
        testo: 'La Repubblica Napoletana fu la prima esperienza costituzionale italiana a inserire la solidarietà tra i doveri fondamentali dell\'uomo — non come buon costume, ma come norma scritta.',
      },
    ],
  },

  // ── 5. EFORATO ──────────────────────────────────────────────────────────
  {
    id: 'eforato',
    titolo: 'L\'Eforato',
    sub: 'Il primo germe di controllo di costituzionalità in Italia',
    colore: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    icon: '⚖',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Il contributo più originale di Pagano rispetto al modello francese fu l\'Eforato: un organo del tutto nuovo, senza precedenti nelle costituzioni dell\'epoca. Il suo compito era custodire la Costituzione e prevenire gli abusi dei poteri pubblici.',
      },
      {
        tipo: 'box',
        label: 'Cosa era l\'Eforato',
        colore: '#a78bfa',
        contenuto:
          'Era un corpo di cittadini eletti — uno per dipartimento, con almeno 45 anni di età, con esperienza nel corpo legislativo o nel potere esecutivo — che si riuniva per sessioni di 15 giorni. Non poteva esercitare direttamente alcun potere legislativo, esecutivo o giudiziario. Il suo ruolo era di vigilanza: sorvegliare che nessun potere invadesse le attribuzioni degli altri e che la Costituzione fosse rispettata. Vincenzo Cuoco, primo storico della Repubblica, lo definì "la parte più bella del Progetto del Pagano".',
      },
      {
        tipo: 'box',
        label: 'Il nome viene dall\'antica Grecia',
        colore: '#ffd700',
        contenuto:
          'Gli "efori" erano magistrati dell\'antica Sparta: cinque cittadini eletti con poteri di controllo sui re e sulle istituzioni. Pagano riprendeva il nome e l\'idea — un organo che vigila sui poteri — adattandola a una repubblica moderna. Non era il solo a pensarci: in Francia Sieyès aveva proposto un "jury constitutionnaire" con funzioni simili, ma il progetto fu respinto.',
      },
      {
        tipo: 'testo',
        contenuto:
          'L\'Eforato non è una Corte Costituzionale in senso moderno: non aveva una giurisdizione strutturata, non poteva annullare le leggi con effetti generali, e soprattutto non ebbe mai attuazione concreta — la Repubblica cadde prima. Ma l\'idea di fondo era la stessa che avrebbe ispirato Kelsen più di un secolo dopo: serve un organo apposito per custodire la Costituzione, separato dai tre poteri tradizionali.',
      },
      {
        tipo: 'highlight',
        colore: '#a78bfa',
        testo: 'Pagano aveva capito nel 1799 ciò che l\'Europa avrebbe formalizzato solo nel 1920 con la Corte costituzionale austriaca: il custode della Costituzione non può essere uno dei poteri che controlla.',
      },
    ],
  },

  // ── 6. CADUTA ───────────────────────────────────────────────────────────
  {
    id: 'caduta',
    titolo: 'La caduta della Repubblica',
    sub: 'Il Cardinale Ruffo, la Santa Fede e la restaurazione',
    colore: '#fb7185',
    bg: 'rgba(251,113,133,0.08)',
    icon: '⚡',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'La Repubblica napoletana era fragile fin dalla nascita. Era nata grazie all\'esercito francese, non a una rivoluzione popolare dal basso. Il popolo — i "lazzari", i ceti più umili — era spesso ostile ai patrioti illuministi, percepiti come intellettuali distanti e filofrancesi. La Chiesa alimentava questa ostilità.',
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Il Cardinale Ruffo', testo: 'Organizzò in Calabria l\'armata della Santa Fede, un esercito popolare e irregolare di contadini, briganti e fanatici religiosi. Risalì la penisola alimentando insurrezioni ovunque, facendo leva sul sentimento antifrancese e sulla devozione religiosa.' },
          { titolo: 'Gli inglesi', testo: 'Da parte loro tentarono un\'offensiva dal mare, occupando brevemente l\'isola di Procida. L\'ammiraglio Nelson era nel Mediterraneo con la flotta britannica.' },
          { titolo: 'Le difficoltà interne', testo: 'La Repubblica si dibatteva tra difficoltà finanziarie, focolai insurrezionali interni e la scarsa coesione del governo provvisorio. L\'abolizione dei feudi era rimasta in gran parte sulla carta.' },
          { titolo: 'Giugno 1799', testo: 'La Santa Fede riconquista Napoli. I Borbone tornano. Inizia una repressione durissima: migliaia di arrestati, centinaia di condanne a morte tra i patrioti.' },
        ],
      },
      {
        tipo: 'box',
        label: 'Il prezzo della sconfitta',
        colore: '#fb7185',
        contenuto:
          'Tre mila popolani rimasero uccisi durante la riconquista. Decine di intellettuali, avvocati, scienziati e nobili illuministi furono giustiziati in Piazza Mercato. Tra loro: Mario Pagano, Eleonora Fonseca Pimentel (che prima di salire al patibolo disse: "Forse un giorno più fortunate repubbliche si ricorderanno di noi"), Domenico Cirillo, medico e botanico di fama europea.',
      },
      {
        tipo: 'highlight',
        colore: '#fb7185',
        testo: '"Forse un giorno, più fortunate repubbliche si ricorderanno di noi." — Eleonora Fonseca Pimentel, 1799',
      },
    ],
  },

  // ── 7. EREDITÀ ──────────────────────────────────────────────────────────
  {
    id: 'eredita',
    titolo: 'L\'eredità',
    sub: 'Risorgimento, costituzionalismo europeo e Napoli oggi',
    colore: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    icon: '🌱',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'La Repubblica Napoletana durò sei mesi. La Costituzione non entrò mai in vigore. Eppure quel progetto non morì con i suoi autori.',
      },
      {
        tipo: 'lista',
        items: [
          { titolo: '1820 — Il testo riaffiora', testo: 'L\'avvocato Angelo Lanzellotti ripubblica la Costituzione dopo vent\'anni di censure. I moti del 1820–21 a Napoli rivendicano proprio una Costituzione. Il seme era rimasto sotto terra.' },
          { titolo: 'Il Risorgimento', testo: 'I patrioti risorgimentali trovarono nella Repubblica Napoletana un precedente ideale. L\'idea che anche il Sud avesse prodotto un pensiero costituzionale originale era politicamente importante.' },
          { titolo: 'Kelsen e l\'Eforato', testo: 'Quando si studia la storia della giustizia costituzionale, l\'Eforato di Pagano viene citato come il primo tentativo nella storia italiana di creare un organo di garanzia della Costituzione — con più di un secolo di anticipo sulla Corte austriaca del 1920.' },
          { titolo: 'La Costituzione del 1948', testo: 'Molti principi del Progetto Pagano — la solidarietà come dovere, l\'educazione pubblica come fondamento della democrazia, i doveri dei funzionari pubblici — riemergono nella Costituzione italiana del 1948. Il filo è lungo, ma esiste.' },
        ],
      },
      {
        tipo: 'box',
        label: 'Napoli, crocevia di idee',
        colore: '#22c55e',
        contenuto:
          'La storia della Repubblica Napoletana ricorda che Napoli non è stata solo destinataria passiva di rivoluzioni nate altrove. Ha prodotto un pensiero giuridico originale — da Filangeri a Pagano — che ha dialogato con l\'America, con la Francia, con l\'Europa. Un patrimonio che appartiene alla città e a tutta la tradizione costituzionale italiana.',
      },
      {
        tipo: 'highlight',
        colore: '#22c55e',
        testo: 'Oggi siamo quella "repubblica fortunata" di cui parlava Eleonora Pimentel. Abbiamo le leggi, abbiamo la storia, abbiamo il sangue di quei martiri come fondamento.',
      },
    ],
  },
];

export default function CostituzionNapoletanaPage() {
  const [aperta, setAperta] = useState<string | null>(null);

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        .np-link-active { opacity: 0.7; }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        <div style={{ padding: '20px 16px 140px' }}>

          {/* ── HERO ──────────────────────────────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, #0d1829, #111a2e)',
            borderRadius: 28,
            padding: '28px 20px',
            border: '0.5px solid rgba(255,215,0,0.18)',
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -50, right: -50,
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,215,0,0.07) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              display: 'inline-block',
              border: '1px solid rgba(255,215,0,0.35)',
              borderRadius: 99, padding: '4px 14px',
              fontSize: 9, letterSpacing: 3,
              textTransform: 'uppercase' as const,
              color: '#ffd700', fontWeight: 700, marginBottom: 14,
            }}>
              Napoli · 1799
            </div>

            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 10 }}>
              La Costituzione<br />della Repubblica<br />Napoletana
            </div>

            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, marginBottom: 20 }}>
              Un sogno durato sei mesi. Un documento di straordinaria modernità
              che non entrò mai in vigore — ma che anticipò principi oggi universali.
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { num: '372', label: 'articoli + 38 della\nDichiarazione dei diritti', col: '#ffd700' },
                { num: '~25', label: 'copie stampate\ncensurate fino al 1820', col: '#ffd700' },
                { num: '6', label: 'mesi di vita\ndella Repubblica', col: '#ffd700' },
                { num: '1799', label: 'anno in cui Pagano\nfu giustiziato', col: '#fb7185' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: `${s.col}09`,
                  border: `0.5px solid ${s.col}22`,
                  borderRadius: 14, padding: '12px',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.col }}>{s.num}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 3, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── SEZIONI ───────────────────────────────────────────────────── */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.28)', fontWeight: 700, marginBottom: 12 }}>
              Argomenti
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {sezioni.map((sezione) => (
              <div
                key={sezione.id}
                style={{
                  background: '#111526',
                  borderRadius: 20,
                  border: `0.5px solid ${aperta === sezione.id ? sezione.colore + '55' : 'rgba(255,255,255,0.05)'}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* HEADER */}
                <div
                  onClick={() => setAperta(aperta === sezione.id ? null : sezione.id)}
                  style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                >
                  <div style={{
                    width: 46, height: 46, borderRadius: 12,
                    background: sezione.bg,
                    border: `0.5px solid ${sezione.colore}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {sezione.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 3 }}>
                      {sezione.titolo}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.4 }}>
                      {sezione.sub}
                    </div>
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.3)', fontSize: 13, flexShrink: 0,
                    transform: aperta === sezione.id ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}>▾</div>
                </div>

                {/* CONTENUTO */}
                {aperta === sezione.id && (
                  <div style={{ padding: '0 16px 20px', borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {sezione.blocchi.map((blocco, bi) => {

                        if (blocco.tipo === 'testo') return (
                          <p key={bi} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85 }}>
                            {blocco.contenuto}
                          </p>
                        );

                        if (blocco.tipo === 'highlight') return (
                          <div key={bi} style={{
                            borderLeft: `3px solid ${blocco.colore}`,
                            paddingLeft: 14,
                            background: `${blocco.colore}08`,
                            borderRadius: '0 10px 10px 0',
                            padding: '12px 12px 12px 16px',
                          }}>
                            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontStyle: 'italic' }}>
                              {blocco.testo}
                            </p>
                          </div>
                        );

                        if (blocco.tipo === 'box') {
                          const col = blocco.colore ?? sezione.colore;
                          return (
                            <div key={bi} style={{
                              background: `${col}08`,
                              borderRadius: 14, padding: '14px',
                              border: `0.5px solid ${col}22`,
                            }}>
                              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase' as const, color: col, fontWeight: 700, marginBottom: 8 }}>
                                {blocco.label}
                              </div>
                              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85 }}>
                                {blocco.contenuto}
                              </p>
                            </div>
                          );
                        }

                        if (blocco.tipo === 'articolo') return (
                          <div key={bi} style={{
                            background: 'rgba(34,197,94,0.06)',
                            borderRadius: 16, padding: '18px',
                            border: '0.5px solid rgba(34,197,94,0.25)',
                          }}>
                            <div style={{
                              display: 'inline-block',
                              background: 'rgba(34,197,94,0.15)',
                              border: '0.5px solid rgba(34,197,94,0.3)',
                              borderRadius: 8, padding: '3px 10px',
                              fontSize: 9, fontWeight: 800, color: '#22c55e',
                              letterSpacing: 2, textTransform: 'uppercase' as const,
                              marginBottom: 12,
                            }}>
                              {blocco.numero}
                            </div>
                            <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.5, marginBottom: 10, fontStyle: 'italic' }}>
                              {blocco.testo}
                            </p>
                            {blocco.nota && (
                              <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                                — {blocco.nota}
                              </p>
                            )}
                          </div>
                        );

                        if (blocco.tipo === 'lista') return (
                          <div key={bi} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {blocco.items.map((item, ii) => (
                              <div key={ii} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <div style={{
                                  width: 5, height: 5, borderRadius: '50%',
                                  background: sezione.colore, flexShrink: 0, marginTop: 6,
                                }} />
                                <div>
                                  {item.titolo && (
                                    <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff' }}>
                                      {item.titolo}:{' '}
                                    </span>
                                  )}
                                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>
                                    {item.testo}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );

                        if (blocco.tipo === 'confronto') return (
                          <div key={bi} style={{ display: 'flex', gap: 8 }}>
                            {[
                              { col: blocco.coloreLeft, data: blocco.left },
                              { col: blocco.coloreRight, data: blocco.right },
                            ].map(({ col, data }, ci) => (
                              <div key={ci} style={{
                                flex: 1,
                                background: `${col}08`,
                                borderRadius: 14, padding: '12px 10px',
                                border: `0.5px solid ${col}28`,
                              }}>
                                <div style={{ fontSize: 9, fontWeight: 800, color: col, marginBottom: 10, letterSpacing: 0.5, lineHeight: 1.4 }}>
                                  {data.label.toUpperCase()}
                                </div>
                                {data.items.map((p, pi) => (
                                  <div key={pi} style={{ display: 'flex', gap: 7, marginBottom: 7, alignItems: 'flex-start' }}>
                                    <div style={{ width: 3, height: 3, borderRadius: '50%', background: col, flexShrink: 0, marginTop: 5 }} />
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>{p}</div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        );

                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── TIMELINE ──────────────────────────────────────────────────── */}
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.28)', fontWeight: 700, marginBottom: 14 }}>
            Cronologia
          </div>

          <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 24 }}>
            <div style={{
              position: 'absolute', left: 7, top: 8, bottom: 8,
              width: 1, background: 'rgba(255,215,0,0.18)',
            }} />

            {[
              { anno: '20 GEN 1799', titolo: 'Presa di Castel Sant\'Elmo', testo: 'I patrioti conquistano la rocca sul Vomero. Il 23 gennaio i francesi entrano a Napoli e la Repubblica è proclamata.', colore: '#ffd700' },
              { anno: '2 FEB 1799', titolo: 'Il Monitore Napoletano', testo: 'Eleonora Fonseca Pimentel dirige il primo giornale della Repubblica, con un bollettino anche in dialetto per il popolo.', colore: '#ffd700' },
              { anno: '1 APR 1799', titolo: 'Il Progetto di Costituzione', testo: 'Pagano presenta 372 articoli + 38 della Dichiarazione dei diritti. Non entrerà mai in vigore.', colore: '#ffd700' },
              { anno: 'GIU 1799', titolo: 'La caduta', testo: 'L\'armata della Santa Fede del Cardinale Ruffo riconquista Napoli. I Borbone tornano. La repressione è brutale.', colore: '#fb7185' },
              { anno: '29 OTT 1799', titolo: 'L\'esecuzione di Pagano', testo: 'Giustiziato in Piazza Mercato. Aveva 51 anni. Preghiere giunsero persino dallo zar di Russia — inutilmente.', colore: '#fb7185' },
              { anno: '1820', titolo: 'La Costituzione riaffiora', testo: 'Dopo vent\'anni di censure Angelo Lanzellotti ripubblica il testo. Il Risorgimento ritrova le sue radici napoletane.', colore: '#22c55e' },
            ].map((ev, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: 16 }}>
                <div style={{
                  position: 'absolute', left: -18, top: 4,
                  width: 8, height: 8, borderRadius: '50%',
                  background: ev.colore,
                }} />
                <div style={{ fontSize: 9, fontWeight: 800, color: ev.colore, letterSpacing: 2, marginBottom: 3 }}>
                  {ev.anno}
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 3 }}>
                  {ev.titolo}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                  {ev.testo}
                </div>
              </div>
            ))}
          </div>

          {/* ── CITAZIONE FINALE ──────────────────────────────────────────── */}
          <div style={{
            borderLeft: '3px solid #ffd700',
            background: 'rgba(255,215,0,0.05)',
            borderRadius: '0 16px 16px 0',
            padding: '16px 16px 16px 18px',
            marginBottom: 16,
          }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.85, fontStyle: 'italic', marginBottom: 8 }}>
              "Forse un giorno, più fortunate repubbliche si ricorderanno di noi."
            </p>
            <div style={{ fontSize: 9.5, color: '#ffd700', fontWeight: 700, letterSpacing: 1 }}>
              — ELEONORA FONSECA PIMENTEL · Napoli, 1799
            </div>
          </div>

          {/* ── TAG ───────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              { testo: 'Illuminismo', col: '#ffd700' },
              { testo: 'Diritti naturali', col: '#ffd700' },
              { testo: 'Eforato', col: '#a78bfa' },
              { testo: 'Giustizia costituzionale', col: '#a78bfa' },
              { testo: 'Mario Pagano', col: '#38bdf8' },
              { testo: 'Gaetano Filangeri', col: '#38bdf8' },
              { testo: 'Eleonora Fonseca Pimentel', col: '#38bdf8' },
              { testo: 'Solidarietà', col: '#22c55e' },
              { testo: 'Cardinale Ruffo', col: '#fb7185' },
              { testo: 'Restaurazione borbonica', col: '#fb7185' },
            ].map((tag, i) => (
              <div key={i} style={{
                background: `${tag.col}12`,
                border: `0.5px solid ${tag.col}28`,
                borderRadius: 7, padding: '3px 10px',
                fontSize: 10, fontWeight: 700, color: tag.col,
              }}>
                {tag.testo}
              </div>
            ))}
          </div>

        </div>

        <Footer />
      </div>
    </>
  );
}