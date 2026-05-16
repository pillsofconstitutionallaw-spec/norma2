'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ─── TIPI ────────────────────────────────────────────────────────────────────

type Film = {
  titolo: string;
  anno: string;
  regia: string;
  tag: string;
  colore: string;
  trama: string;
  perché: string;
};

type Libro = {
  titolo: string;
  autore: string;
  anno: string;
  tag: string;
  colore: string;
  trama: string;
  perché: string;
};

type Podcast = {
  titolo: string;
  chi: string;
  tag: string;
  colore: string;
  descrizione: string;
  dove: string;
};

// ─── DATI ────────────────────────────────────────────────────────────────────

const film: Film[] = [
  {
    titolo: 'La parola ai giurati',
    anno: '1957',
    regia: 'Sidney Lumet',
    tag: 'Processo · Giuria',
    colore: '#f97316',
    trama: 'New York, anni \'50. Un ragazzo di quartiere povero è accusato di aver ucciso il padre. Le prove sembrano schiaccianti, la condanna alla sedia elettrica sembra scontata. Dodici giurati si chiudono in una stanza per deliberare. Undici votano subito colpevole. Solo uno — il giurato numero 8 — chiede di ragionare ancora. In novantasei minuti di tensione crescente, dubbi, pregiudizi e argomenti si scontrano tra loro finché la certezza non comincia a sgretolarsi.',
    perché: 'Il film più efficace mai girato sulla presunzione di innocenza e sul ragionevole dubbio. Mostra come i pregiudizi possono distorcere il giudizio e come una sola persona convinta possa cambiare il corso della giustizia. Obbligatorio per chiunque studia diritto processuale.',
  },
  {
    titolo: 'Philadelphia',
    anno: '1993',
    regia: 'Jonathan Demme',
    tag: 'Discriminazione · Diritti',
    colore: '#38bdf8',
    trama: 'Andrew Beckett è un brillante avvocato di Philadelphia, licenziato dallo studio dove lavorava dopo che i colleghi scoprono che è sieropositivo e omosessuale. Nessun avvocato vuole difenderlo. Trova infine Joe Miller, che personalmente non approva l\'omosessualità ma accetta il caso. Il processo diventa uno scontro tra dignità umana e pregiudizio, con sullo sfondo la crisi dell\'AIDS negli anni \'90.',
    perché: 'Tom Hanks vinse l\'Oscar. Ma oltre all\'interpretazione, il film è un caso di studio sul licenziamento discriminatorio, sulla prova in giudizio e su come il diritto possa essere usato per difendere i più vulnerabili. Imprescindibile per chi si occupa di diritto del lavoro e diritti fondamentali.',
  },
  {
    titolo: 'Il processo ai Chicago 7',
    anno: '2020',
    regia: 'Aaron Sorkin',
    tag: 'Processo storico · Politica',
    colore: '#a78bfa',
    trama: 'Chicago, 1968. Sette attivisti — tra cui Abbie Hoffman, Tom Hayden e Bobby Seale — vengono processati dal Governo federale per aver organizzato le proteste contro la guerra in Vietnam durante la Convention democratica, sfociate in scontri con la polizia. Il processo è una farsa: il giudice è apertamente ostile, la difesa viene sabotata, uno degli imputati viene letteralmente incatenato e imbavagliato in aula. Sorkin racconta tutto con la sua sceneggiatura fulminante.',
    perché: 'Mostra come un processo possa essere usato come strumento politico di repressione. Perfetto per riflettere sui principi del giusto processo, dell\'indipendenza del giudice e del diritto di difesa. Basato su fatti reali, è anche una lezione di storia americana.',
  },
  {
    titolo: 'Codice d\'onore',
    anno: '1992',
    regia: 'Rob Reiner',
    tag: 'Corte marziale · Etica',
    colore: '#22c55e',
    trama: 'Due marines sono accusati di aver ucciso un commilitone a Guantanamo. Il tenente Kaffee — avvocato pigro e abituato ai patteggiamenti — viene incaricato della difesa ma scopre che dietro al caso si nasconde qualcosa di molto più grande: un ordine segreto impartito dal colonnello Jessup (Jack Nicholson, indimenticabile). "La verità? Non sei pronto per la verità!" è la battuta più famosa del cinema giudiziario.',
    perché: 'Esplora il conflitto tra obbedienza agli ordini e responsabilità individuale, il rapporto tra militare e giustizia civile, e il coraggio di affrontare un sistema che si protegge. Grandissima lezione sull\'etica professionale dell\'avvocato.',
  },
  {
    titolo: 'Lincoln Lawyer',
    anno: '2011',
    regia: 'Brad Furman',
    tag: 'Avvocatura · Thriller',
    colore: '#ffd700',
    trama: 'Mickey Haller è un avvocato difensore di Los Angeles che lavora letteralmente dal sedile posteriore della sua Lincoln Town Car, spostandosi tra i tribunali della città. Quando gli arriva un caso apparentemente facile — un ricco accusato di aggressione — si trova intrappolato in una tela di menzogne, colpevolezze nascoste e segreti professionali che mettono a rischio la sua stessa vita.',
    perché: 'Tratto dai romanzi di Michael Connelly, è il ritratto più realistico e avvincente del difensore penale. Affronta temi delicati come il segreto professionale, il dovere di difendere anche chi sai essere colpevole, e i limiti etici dell\'avvocatura. La serie TV su Netflix approfondisce ulteriormente.',
  },
  {
    titolo: 'La bolla di sapone — The Rainmaker',
    anno: '1997',
    regia: 'Francis Ford Coppola',
    tag: 'David contro Golia · Assicurazioni',
    colore: '#fb7185',
    trama: 'Rudy Baylor è un giovane neo-avvocato squattrinato di Memphis. Il suo primo caso — e forse l\'unico che riesce a ottenere — è difendere una famiglia povera contro una grande compagnia assicurativa che ha negato le cure a un ragazzo malato di leucemia, condannandolo a morte. Contro di lui i migliori avvocati del paese. Con lui solo la rabbia e la convinzione di avere ragione.',
    perché: 'Tratto da Grisham, è il film definitivo sul diritto come strumento di giustizia contro il potere economico. Racconta benissimo le asimmetrie del processo civile, la responsabilità delle compagnie assicurative e il valore della perseveranza nell\'esercizio della professione.',
  },
  {
    titolo: 'Schegge di paura',
    anno: '1996',
    regia: 'Gregory Hoblit',
    tag: 'Thriller · Doppia personalità',
    colore: '#e879f9',
    trama: 'Chicago. L\'arcivescovo è stato brutalmente assassinato. L\'accusato è Aaron Stampler, un ragazzo apparentemente ingenuo e confuso trovato coperto di sangue vicino al corpo. L\'avvocato difensore Martin Vail — Richard Gere, brillante e ambizioso — lo prende come caso mediaticamente utile alla propria carriera. Ma quanto più conosce Aaron, tanto più la situazione si complica in modo imprevedibile.',
    perché: 'Edward Norton alla sua prima grande interpretazione: da solo vale il film. Ma oltre al thriller magistrale, è un caso di studio sul disturbo dissociativo in aula, sulla responsabilità penale e sulla capacità di intendere e volere. Finale che lascia senza fiato.',
  },
  {
    titolo: 'Erin Brockovich',
    anno: '2000',
    regia: 'Steven Soderbergh',
    tag: 'Causa collettiva · Ambiente',
    colore: '#22c55e',
    trama: 'Erin Brockovich è una madre single, senza laurea in legge, che lavora come segretaria in uno studio legale di Los Angeles. Quasi per caso si imbatte in una serie di documenti medici che non tornano: una grande società di gas ha contaminato le acque di una piccola città in California per anni, causando tumori e malattie gravi agli abitanti. Inizia così la più grande class action della storia americana contro una grande azienda, guidata da una donna senza titoli accademici ma con una determinazione fuori dal comune.',
    perché: 'Basato su una storia vera. Mostra la potenza della responsabilità civile ambientale e della prova documentale. Julia Roberts ha vinto l\'Oscar. Ma la vera protagonista — Erin Brockovich in carne e ossa — fa un cameo nel film.',
  },
];

const libri: Libro[] = [
  {
    titolo: 'Il nome della rosa',
    autore: 'Umberto Eco',
    anno: '1980',
    tag: 'Romanzo · Ermeneutica giuridica',
    colore: '#ffd700',
    trama: 'Un\'abbazia medievale, inverno del 1327. Il frate francescano Guglielmo da Baskerville e il novizio Adso da Melk arrivano per partecipare a un dibattito teologico. In pochi giorni si susseguono morti misteriose tra i monaci. Guglielmo indaga con metodo quasi scientifico — anticipando Sherlock Holmes di secoli — tra labirinti di pietra, biblioteche segrete e manoscritti proibiti. La soluzione è nascosta nel libro più pericoloso del mondo.',
    perché: 'Non è un libro di diritto, ma è il libro sull\'interpretazione. Eco dimostra che ogni testo — compresa una norma giuridica — può essere letto in modi diversi e che il significato non è mai definitivo. Fondamentale per chi studia ermeneutica giuridica e filosofia del diritto.',
  },
  {
    titolo: 'Il processo',
    autore: 'Franz Kafka',
    anno: '1925',
    tag: 'Romanzo · Critica al sistema',
    colore: '#fb7185',
    trama: 'Josef K. si sveglia una mattina e viene arrestato senza che gli venga spiegato il motivo. Inizia così la sua discesa in un labirinto kafkiano — appunto — di tribunali inaccessibili, avvocati inefficaci, procedure incomprensibili e giudici invisibili. Il processo non arriverà mai a sentenza. Josef K. non saprà mai di cosa è accusato. La macchina della giustizia si muove indipendentemente dalla verità e dalla colpa.',
    perché: 'Il libro che ogni giurista dovrebbe leggere per capire cosa succede quando il sistema si chiude su se stesso. Kafka — che era laureato in legge e lavorava per una compagnia di assicurazioni — conosceva bene la burocrazia. La sua critica è ancora ferocemente attuale.',
  },
  {
    titolo: 'Il buio oltre la siepe',
    autore: 'Harper Lee',
    anno: '1960',
    tag: 'Romanzo · Razzismo e giustizia',
    colore: '#38bdf8',
    trama: 'Alabama, anni \'30. Scout Finch è una bambina che osserva il mondo con gli occhi dell\'innocenza. Suo padre, Atticus Finch, è un avvocato che accetta di difendere Tom Robinson, un uomo di colore accusato di aver violentato una donna bianca nel profondo Sud razzista. La sentenza è scontata prima ancora che cominci il processo. Ma Atticus fa la cosa giusta comunque.',
    perché: 'Premio Pulitzer 1961, uno dei romanzi più letti nelle facoltà di giurisprudenza del mondo. Atticus Finch è il modello dell\'avvocato integro. Il libro pone una domanda fondamentale: cosa significa fare il proprio dovere quando sai già che perderai?',
  },
  {
    titolo: 'A sangue freddo',
    autore: 'Truman Capote',
    anno: '1966',
    tag: 'Non-fiction · Pena di morte',
    colore: '#f97316',
    trama: 'Kansas, novembre 1959. Una famiglia intera viene massacrata nella propria fattoria. I colpevoli sono Dick Hickock e Perry Smith, due ex detenuti. Capote ricostruisce i fatti con la precisione di un atto processuale: le indagini, la cattura, il processo, il carcere, l\'esecuzione. Sei anni di lavoro, centinaia di ore di interviste, amicizia con i condannati. Il risultato è il libro che ha inventato il "romanzo di non-fiction".',
    perché: 'Capolavoro assoluto della letteratura americana. Per un giurista è anche un\'analisi impietosa del sistema giudiziario americano, della pena di morte, del profilo criminologico degli autori di reato e del rapporto tra stampa e giustizia.',
  },
  {
    titolo: 'Le correzioni',
    autore: 'Gianrico Carofiglio',
    anno: 'Serie Guerrieri · dal 2002',
    tag: 'Legal thriller italiano · Bari',
    colore: '#a78bfa',
    trama: 'Guido Guerrieri è un avvocato penalista di Bari — colto, malinconico, onesto fino al punto di esserne svantaggiato. Carofiglio, ex magistrato antimafia, ha scritto una serie di romanzi che seguono Guerrieri attraverso casi difficili e spesso scomodi. Ogni libro è anche un\'immersione nel funzionamento reale della giustizia italiana, con le sue lentezze, i suoi rituali, le sue ingiustizie e i suoi rari momenti di riscatto.',
    perché: 'Il miglior legal thriller italiano. Carofiglio scrive da chi ha vissuto le aule di giustizia dall\'interno. I libri sono romanzi veri, non manuali camuffati: ma insegnano più diritto processuale penale di molti testi accademici. Inizia da "Testimone inconsapevole".',
  },
  {
    titolo: 'Il coraggio di essere liberi',
    autore: 'Marco Cappato',
    anno: '2022',
    tag: 'Saggio · Fine vita · Diritti civili',
    colore: '#22c55e',
    trama: 'Marco Cappato racconta in prima persona la sua battaglia politica e giuridica per la liberalizzazione dell\'eutanasia in Italia, culminata nel caso Cappato-Fabo (DJ Fabo) e nella sentenza 242/2019 della Corte Costituzionale. Non è solo un memoir: è la storia di come un singolo individuo, attraverso la propria azione civile e penale, ha costretto il sistema a confrontarsi con una questione che il Parlamento aveva ignorato per decenni.',
    perché: 'Unico nel suo genere: un protagonista di una delle sentenze costituzionali più importanti degli ultimi anni racconta dall\'interno come si costruisce una battaglia giuridica. Perfetto per capire il rapporto tra diritto, politica e disobbedienza civile.',
  },
  {
    titolo: 'Mio padre era un uomo giusto',
    autore: 'Umberto Ambrosoli',
    anno: '2009',
    tag: 'Biografia · Mafia · Professione',
    colore: '#fb7185',
    trama: 'Giorgio Ambrosoli era un avvocato milanese che nel 1979 fu incaricato di liquidare la Banca Privata Italiana di Michele Sindona, banchiere vicino alla mafia e alla P2. Sapeva che accettare quell\'incarico era pericoloso — lo aveva scritto in una lettera alla moglie. Fu assassinato la notte del 12 luglio 1979. Suo figlio Umberto ricostruisce la vicenda con rigore e commozione.',
    perché: 'Una delle storie più importanti dell\'Italia repubblicana. Racconta cos\'è la professione legale nella sua forma più alta — e il prezzo che può costare. Per ogni giurista che si chiede cosa significhi avere una coscienza professionale.',
  },
  {
    titolo: 'Giustizia',
    autore: 'Michael J. Sandel',
    anno: '2009',
    tag: 'Filosofia · Etica pubblica',
    colore: '#38bdf8',
    trama: 'Il filosofo di Harvard Michael Sandel prende le questioni più spinose della filosofia morale — è giusto torturare un terrorista per salvare molte vite? È accettabile pagare qualcuno per fare il militare al posto tuo? Perché alcune disuguaglianze ci sembrano giuste e altre no? — e le trasforma in un corso universitario che milioni di persone in tutto il mondo hanno seguito online. Non dà risposte, ma pone le domande giuste.',
    perché: 'Fondamentale per chiunque voglia capire i fondamenti filosofici del diritto. Sandel porta Aristotele, Kant, Rawls e Mill nelle strade di oggi, con casi concreti e linguaggio accessibile. Il libro trascritto dal corso — ma il corso stesso su YouTube è ancora più efficace.',
  },
];

const podcast: Podcast[] = [
  {
    titolo: 'Diritto al Punto',
    chi: 'Avvocati fiorentini — team DAPP',
    tag: 'Generalista · Per tutti i livelli',
    colore: '#38bdf8',
    descrizione: 'Il podcast giuridico italiano più accessibile. Ogni episodio affronta un tema diverso — dal diritto penale alla privacy, dalla violenza di genere al diritto digitale — con linguaggio semplice e senza tecnicismi inutili. Selezionato tra i migliori podcast emergenti al Festival del Podcasting 2020. Ideale per chi vuole restare aggiornato senza annegare nel gergo legale.',
    dove: 'Spotify · Apple Podcast',
  },
  {
    titolo: 'Giustizia Bistrot',
    chi: 'Gloria Liccioli con avv. Gulisano e Guidi',
    tag: 'Divulgativo · Costituzione',
    colore: '#a78bfa',
    descrizione: 'Nasce da un\'idea di una giornalista e di due avvocati che volevano parlare di diritto come si parla al bar: chiaro, diretto, senza paura di semplificare. Le prime puntate costruiscono le basi — Costituzione, fonti del diritto — per poi passare a temi contemporanei come libertà di espressione, immigrazione, diritti digitali. Puntate brevi (15-20 minuti), perfette in pausa pranzo.',
    dove: 'Spotify · Apple Podcast',
  },
  {
    titolo: 'Radio Radicale — Speciale Giustizia',
    chi: 'Radio Radicale',
    tag: 'Avanzato · Attualità giuridica',
    colore: '#f97316',
    descrizione: 'Non è un podcast divulgativo: è la registrazione diretta di udienze della Corte Costituzionale, sedute del CSM, dibattiti parlamentari su riforme della giustizia. Chi vuole sentire come funziona davvero il sistema — non come viene raccontato — trova qui materiale inesauribile. Richiede una base giuridica per essere seguito, ma è insostituibile per chi vuole capire l\'attualità istituzionale italiana.',
    dove: 'Apple Podcast · RadioRadicale.it',
  },
  {
    titolo: 'AudioConsenso',
    chi: 'DirittoConsenso — Lorenzo Venezia e Roberto Giuliani',
    tag: 'Interdisciplinare · Diritto e società',
    colore: '#22c55e',
    descrizione: 'Un progetto ambizioso che affronta il diritto nei suoi aspetti più insoliti e interdisciplinari: dal diritto internazionale dello spazio al GDPR, dalla corporate social responsibility alla politica di vicinato dell\'Unione Europea. Oltre 50 episodi, ospiti esperti, temi che non trovi nei manuali. Per chi vuole uscire dalle categorie tradizionali e capire come il diritto si intreccia con tutto il resto.',
    dove: 'Spotify · Apple Podcast',
  },
  {
    titolo: 'Poteri Forti',
    chi: 'Pagella Politica',
    tag: 'Fact-checking · Istituzioni',
    colore: '#ffd700',
    descrizione: 'Non è un podcast strettamente giuridico, ma è il migliore per capire come funzionano davvero le istituzioni italiane. Ogni settimana Pagella Politica verifica le affermazioni dei politici, spiega come vengono approvate le leggi, analizza le riforme costituzionali in corso. Chi segue questo podcast conosce la Costituzione meglio di molti avvocati. Fondamentale per capire l\'Italia contemporanea.',
    dove: 'Spotify · Apple Podcast',
  },
  {
    titolo: 'Lawfare Podcast',
    chi: 'Lawfare Institute',
    tag: 'In inglese · Diritto internazionale',
    colore: '#fb7185',
    descrizione: 'Per chi legge l\'inglese: il podcast di riferimento su sicurezza nazionale, politica estera americana e diritto internazionale. Ospiti che includono ex segretari di Stato, giudici federali, professori di Harvard. Approfondisce temi come la Corte Penale Internazionale, le guerre cyber, il diritto dei conflitti armati. Indispensabile per chiunque voglia lavorare nel diritto internazionale o nelle istituzioni europee.',
    dove: 'Spotify · Apple Podcast · Lawfaremedia.org',
  },
];

// ─── SEZIONE TIPO ─────────────────────────────────────────────────────────────

type Tab = 'film' | 'libri' | 'podcast';

export default function CulturaPage() {
  const [tab, setTab] = useState<Tab>('film');
  const [apertoFilm, setApertoFilm] = useState<number | null>(null);
  const [apertoLibro, setApertoLibro] = useState<number | null>(null);
  const [apertoPodcast, setApertoPodcast] = useState<number | null>(null);

  const tabs: { id: Tab; label: string; emoji: string; num: number }[] = [
    { id: 'film', label: 'Film', emoji: '🎬', num: film.length },
    { id: 'libri', label: 'Libri', emoji: '📚', num: libri.length },
    { id: 'podcast', label: 'Podcast', emoji: '🎙', num: podcast.length },
  ];

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <div style={{ padding: '28px 16px 0' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0d1829, #111a2e)',
            borderRadius: 24, padding: '24px 20px',
            border: '0.5px solid rgba(255,255,255,0.06)',
            marginBottom: 20,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 160, height: 160, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(143,211,255,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              display: 'inline-block',
              border: '1px solid rgba(143,211,255,0.25)',
              borderRadius: 99, padding: '4px 14px',
              fontSize: 9, letterSpacing: 3,
              textTransform: 'uppercase' as const,
              color: '#8fd3ff', fontWeight: 700, marginBottom: 14,
            }}>
              Cultura giuridica
            </div>

            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.12, letterSpacing: -0.5, marginBottom: 8 }}>
              Film, Libri<br />e Podcast
            </div>

            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
              I migliori contenuti per chi studia, esercita o semplicemente ama il diritto.
              Non manuali — storie, idee, voci.
            </div>
          </div>
        </div>

        {/* ── TAB ───────────────────────────────────────────────────────────── */}
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
          {tabs.map((t) => {
            const attivo = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '12px 8px',
                  borderRadius: 14,
                  background: attivo ? 'rgba(143,211,255,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `0.5px solid ${attivo ? 'rgba(143,211,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}
              >
                <span style={{ fontSize: 20 }}>{t.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: attivo ? '#8fd3ff' : 'rgba(255,255,255,0.35)' }}>
                  {t.label}
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 700,
                  color: attivo ? 'rgba(143,211,255,0.6)' : 'rgba(255,255,255,0.2)',
                }}>
                  {t.num} titoli
                </span>
              </button>
            );
          })}
        </div>

        {/* ── CONTENUTO ─────────────────────────────────────────────────────── */}
        <div style={{ padding: '0 16px 140px', display: 'flex', flexDirection: 'column', gap: 8 }}>

          {/* FILM */}
          {tab === 'film' && film.map((f, i) => {
            const aperto = apertoFilm === i;
            return (
              <div key={i} style={{
                background: '#111526',
                borderRadius: 20,
                border: `0.5px solid ${aperto ? f.colore + '44' : 'rgba(255,255,255,0.05)'}`,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                <div
                  onClick={() => setApertoFilm(aperto ? null : i)}
                  style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{
                    width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                    background: `${f.colore}12`,
                    border: `0.5px solid ${f.colore}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    🎬
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'inline-block',
                      background: `${f.colore}14`, border: `0.5px solid ${f.colore}30`,
                      borderRadius: 5, padding: '2px 7px',
                      fontSize: 8, fontWeight: 700, color: f.colore,
                      letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 5,
                    }}>
                      {f.tag}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 2 }}>
                      {f.titolo}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>
                      {f.anno} · Regia: {f.regia}
                    </div>
                  </div>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: aperto ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>

                {aperto && (
                  <div style={{ padding: '0 16px 18px', animation: 'fadeIn 0.2s ease' }}>
                    <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: `${f.colore}99`, textTransform: 'uppercase' as const, marginBottom: 7 }}>
                          La trama
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                          {f.trama}
                        </div>
                      </div>
                      <div style={{
                        background: `${f.colore}08`,
                        border: `0.5px solid ${f.colore}22`,
                        borderRadius: 12, padding: '12px 14px',
                      }}>
                        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: f.colore, textTransform: 'uppercase' as const, marginBottom: 6 }}>
                          Perché vederlo
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8 }}>
                          {f.perché}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* LIBRI */}
          {tab === 'libri' && libri.map((l, i) => {
            const aperto = apertoLibro === i;
            return (
              <div key={i} style={{
                background: '#111526',
                borderRadius: 20,
                border: `0.5px solid ${aperto ? l.colore + '44' : 'rgba(255,255,255,0.05)'}`,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                <div
                  onClick={() => setApertoLibro(aperto ? null : i)}
                  style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{
                    width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                    background: `${l.colore}12`,
                    border: `0.5px solid ${l.colore}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    📖
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'inline-block',
                      background: `${l.colore}14`, border: `0.5px solid ${l.colore}30`,
                      borderRadius: 5, padding: '2px 7px',
                      fontSize: 8, fontWeight: 700, color: l.colore,
                      letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 5,
                    }}>
                      {l.tag}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 2 }}>
                      {l.titolo}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>
                      {l.autore} · {l.anno}
                    </div>
                  </div>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: aperto ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>

                {aperto && (
                  <div style={{ padding: '0 16px 18px', animation: 'fadeIn 0.2s ease' }}>
                    <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: `${l.colore}99`, textTransform: 'uppercase' as const, marginBottom: 7 }}>
                          Di cosa parla
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                          {l.trama}
                        </div>
                      </div>
                      <div style={{
                        background: `${l.colore}08`,
                        border: `0.5px solid ${l.colore}22`,
                        borderRadius: 12, padding: '12px 14px',
                      }}>
                        <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: l.colore, textTransform: 'uppercase' as const, marginBottom: 6 }}>
                          Perché leggerlo
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', lineHeight: 1.8 }}>
                          {l.perché}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* PODCAST */}
          {tab === 'podcast' && podcast.map((p, i) => {
            const aperto = apertoPodcast === i;
            return (
              <div key={i} style={{
                background: '#111526',
                borderRadius: 20,
                border: `0.5px solid ${aperto ? p.colore + '44' : 'rgba(255,255,255,0.05)'}`,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                <div
                  onClick={() => setApertoPodcast(aperto ? null : i)}
                  style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{
                    width: 50, height: 50, borderRadius: 12, flexShrink: 0,
                    background: `${p.colore}12`,
                    border: `0.5px solid ${p.colore}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22,
                  }}>
                    🎙
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'inline-block',
                      background: `${p.colore}14`, border: `0.5px solid ${p.colore}30`,
                      borderRadius: 5, padding: '2px 7px',
                      fontSize: 8, fontWeight: 700, color: p.colore,
                      letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 5,
                    }}>
                      {p.tag}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 2 }}>
                      {p.titolo}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>
                      {p.chi}
                    </div>
                  </div>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: aperto ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>

                {aperto && (
                  <div style={{ padding: '0 16px 18px', animation: 'fadeIn 0.2s ease' }}>
                    <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                        {p.descrizione}
                      </div>
                      <div style={{
                        background: `${p.colore}08`,
                        border: `0.5px solid ${p.colore}22`,
                        borderRadius: 10, padding: '10px 12px',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <span style={{ fontSize: 14 }}>🎧</span>
                        <div>
                          <div style={{ fontSize: 8, fontWeight: 700, color: p.colore, letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 2 }}>
                            Dove ascoltarlo
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                            {p.dove}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        </div>

        <Footer />
      </div>
    </>
  );
}