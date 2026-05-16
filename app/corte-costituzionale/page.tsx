'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ─── TIPI ────────────────────────────────────────────────────────────────────

type Sezione = {
  id: string;
  titolo: string;
  colore: string;
  bg: string;
  icon: string;
  blocchi: Blocco[];
};

type Blocco =
  | { tipo: 'testo'; contenuto: string }
  | { tipo: 'box'; label: string; contenuto: string; colore?: string }
  | { tipo: 'lista'; items: { titolo?: string; testo: string }[] }
  | { tipo: 'confronto'; left: { label: string; items: string[] }; right: { label: string; items: string[] }; coloreLeft: string; coloreRight: string }
  | { tipo: 'cards'; items: { titolo: string; testo: string; badge?: string; colore?: string }[] }
  | { tipo: 'highlight'; testo: string; colore: string };

// ─── DATI ─────────────────────────────────────────────────────────────────────

const sezioni: Sezione[] = [
  // ── 0A. KELSEN ────────────────────────────────────────────────────────────
  {
    id: 'kelsen',
    titolo: 'Hans Kelsen e la teoria pura del diritto',
    colore: '#ffd700',
    bg: 'rgba(255,215,0,0.08)',
    icon: '📐',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Hans Kelsen (1881–1973) è il giurista che ha progettato il modello di giustizia costituzionale accentrata che l\'Italia — come Austria, Germania e molti altri paesi europei — ha adottato. Per capire perché la Corte Costituzionale funziona come funziona, bisogna prima capire Kelsen.',
      },
      {
        tipo: 'box',
        label: 'La Teoria Pura del Diritto',
        colore: '#ffd700',
        contenuto:
          'Kelsen voleva costruire una scienza del diritto "pura": sgombra da politica, morale, sociologia. Il diritto, per lui, è un sistema autonomo di norme che si giustificano a vicenda in base alla loro posizione gerarchica — non perché siano giuste o utili, ma perché sono state prodotte nel modo corretto da chi aveva il potere di farlo. Questa idea si chiama "positivismo giuridico": conta la forma della norma, non il suo contenuto.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'La Stufenbau: l\'ordinamento a gradini',
            testo: 'Kelsen immagina l\'ordinamento giuridico come una piramide (Stufenbau = struttura a gradini). In cima c\'è la Costituzione. Sotto ci sono le leggi ordinarie. Ancora sotto i regolamenti, poi i provvedimenti amministrativi, poi i contratti e le sentenze. Ogni norma è valida solo se è stata prodotta rispettando la norma di grado superiore. Una legge che contraddice la Costituzione è invalida — punto.',
            colore: '#ffd700',
            badge: 'Concetto chiave',
          },
          {
            titolo: 'Il "legislatore negativo"',
            testo: 'La Corte Costituzionale, nel modello kelseniano, non crea norme: le elimina. È un legislatore al contrario — un legislatore negativo. Il Parlamento produce le leggi (legislatore positivo); la Corte rimuove quelle incostituzionali (legislatore negativo). Questo spiega perché, nella tradizione kelseniana, la Corte non può colmare vuoti normativi sostituendosi al Parlamento: può solo togliere, non aggiungere. (Le sentenze additive italiane sono un\'evoluzione successiva che ha superato — con cautela — questo limite originario.)',
            colore: '#ffd700',
            badge: 'Concetto chiave',
          },
          {
            titolo: 'Kelsen vs. il modello americano',
            testo: 'Negli Stati Uniti qualsiasi giudice può disapplicare una legge incostituzionale (modello diffuso, nato dalla sentenza Marbury v. Madison del 1803). Kelsen criticava questo sistema: se ogni giudice può interpretare la Costituzione a modo suo, si creano incertezze e contraddizioni. La sua proposta è un organo unico, specializzato, con effetti generali — così la decisione vale per tutti e l\'ordinamento rimane coerente.',
            colore: '#f97316',
            badge: 'Confronto',
          },
          {
            titolo: 'La Grundnorm: la norma fondamentale',
            testo: 'Se ogni norma è valida perché prodotta secondo una norma superiore, da cosa dipende la validità della Costituzione stessa? Kelsen risponde con la Grundnorm (norma fondamentale): un\'ipotesi logica, non scritta, che dice "bisogna obbedire alla Costituzione". Non è una norma giuridica vera, ma il presupposto logico che tiene in piedi l\'intera piramide. È uno dei punti più discussi — e criticati — della sua teoria.',
            colore: '#a78bfa',
            badge: 'Filosofia del diritto',
          },
        ],
      },
      {
        tipo: 'box',
        label: 'Kelsen e la Corte austriaca del 1920',
        colore: '#ffd700',
        contenuto:
          'Non si tratta solo di teoria: Kelsen progettò concretamente la prima Corte costituzionale moderna, istituita in Austria nel 1919 e consolidata dalla Costituzione del 1920. Ne fu anche giudice fino al 1930, quando il regime autoritario austriaco lo rimosse. Il modello austriaco divenne il prototipo che molti paesi europei adottarono dopo la Seconda guerra mondiale — compresa l\'Italia nel 1948.',
      },
      {
        tipo: 'highlight',
        colore: '#ffd700',
        testo: 'Il paradosso kelseniano: Kelsen costruisce un sistema in cui il diritto è separato dalla politica, ma la Corte Costituzionale — chiamata a far valere quella separazione — è inevitabilmente un organo con enormi ricadute politiche. Questo paradosso fu al centro del dibattito in Assemblea Costituente.',
      },
    ],
  },

  // ── 0B. ASSEMBLEA COSTITUENTE ─────────────────────────────────────────────
  {
    id: 'costituente',
    titolo: 'Il dibattito in Assemblea Costituente',
    colore: '#fb7185',
    bg: 'rgba(251,113,133,0.08)',
    icon: '🏛',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Tra il 1946 e il 1948 i costituenti italiani dovevano decidere come costruire la Corte Costituzionale — ammesso che volessero crearla. Il dibattito fu acceso, perché in gioco c\'era una domanda fondamentale: chi controlla il Parlamento? E chi controlla chi controlla il Parlamento?',
      },
      {
        tipo: 'box',
        label: 'Il trauma dello Statuto Albertino',
        colore: '#fb7185',
        contenuto:
          'La Costituzione del 1948 nasceva dalle ceneri del fascismo. I costituenti sapevano che lo Statuto Albertino — la carta precedente — era "crollato" anche perché mancava qualsiasi controllo sulle leggi: il Parlamento poteva approvare qualsiasi cosa, comprese le leggi razziali del 1938, senza che nessuno potesse fermarla. Questa consapevolezza rese l\'idea di un organo di garanzia quasi inevitabile. Ma su come costruirlo le posizioni erano radicalmente diverse.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'La linea kelseniana: organo specializzato e forte',
            testo: 'Una parte dei costituenti — vicina all\'impostazione kelseniana — voleva una Corte autonoma, distinta dai giudici ordinari, con potere di annullare le leggi con effetti generali. La logica era chiara: solo un organo specializzato e indipendente avrebbe garantito uniformità e certezza del diritto. Lasciare il controllo ai giudici ordinari avrebbe prodotto caos interpretativo.',
            colore: '#38bdf8',
            badge: 'Posizione tecnico-garantista',
          },
          {
            titolo: 'La preoccupazione per il "governo dei giudici"',
            testo: 'Altri temevano l\'effetto opposto: una Corte troppo forte avrebbe potuto trasformarsi in un contropotere politico, capace di bloccare riforme sociali approvate dalla maggioranza parlamentare. Il rischio era quello di un "governo dei giudici" — un organo non eletto che si sostituisce al Parlamento nelle scelte politiche fondamentali.',
            colore: '#f97316',
            badge: 'Preoccupazione democratica',
          },
          {
            titolo: 'La posizione di Togliatti',
            testo: 'Palmiro Togliatti, segretario del PCI e ministro della Giustizia nel governo provvisorio, fu tra i più critici. Temeva che una Corte forte potesse diventare uno strumento conservatore per bloccare le riforme sociali che la sinistra sperava di ottenere attraverso le elezioni. Una maggioranza parlamentare progressista che approvasse riforme redistributive avrebbe potuto vederle annullate da giudici di nomina opposta.',
            colore: '#a78bfa',
            badge: 'Posizione di sinistra',
          },
          {
            titolo: 'Il no al controllo preventivo',
            testo: 'Uno dei punti su cui si trovò un accordo trasversale fu il rifiuto del controllo preventivo (quello francese): se la Corte avesse dovuto esaminare ogni legge prima della sua entrata in vigore, si sarebbe trasformata in un filtro politico permanente sull\'attività legislativa — una sorta di terza Camera non eletta. Era troppo invasivo. Si scelse quindi il controllo successivo.',
            colore: '#22c55e',
            badge: 'Punto di accordo',
          },
        ],
      },
      {
        tipo: 'box',
        label: 'Il compromesso finale',
        colore: '#fb7185',
        contenuto:
          'Il risultato fu una soluzione di equilibrio, tipica della Costituzione del 1948 nel suo complesso. La Corte fu creata — e questo fu un successo della linea garantista — ma con tre limitazioni fondamentali pensate per ridurne il potere politico: (1) accesso filtrato, soprattutto tramite giudizio incidentale, così la Corte non può agire di propria iniziativa; (2) composizione mista (PdR + Parlamento + magistrature), così nessuna forza politica la controlla da sola; (3) nessun controllo preventivo, così non diventa un veto permanente sul legislatore.',
      },
      {
        tipo: 'confronto',
        coloreLeft: '#fb7185',
        coloreRight: '#22c55e',
        left: {
          label: 'Le preoccupazioni dei costituenti',
          items: [
            'Rischio di "governo dei giudici"',
            'Corte come terza Camera non eletta',
            'Blocco delle riforme sociali da parte di giudici conservatori',
            'Controllo preventivo = filtro politico permanente',
            'Chi nomina i giudici controlla l\'ordinamento',
          ],
        },
        right: {
          label: 'Le garanzie introdotte',
          items: [
            'Accesso solo per via incidentale o in via principale (no iniziativa d\'ufficio)',
            'Composizione tripartita per evitare controllo monopolistico',
            'Mandato 9 anni non rinnovabile (no interesse alla riconferma)',
            'Solo controllo successivo, non preventivo',
            'Incompatibilità con cariche politiche',
          ],
        },
      },
      {
        tipo: 'highlight',
        colore: '#fb7185',
        testo: 'La Corte entrò in funzione solo nel 1956, otto anni dopo la Costituzione. Il ritardo fu in parte politico: le forze che temevano una Corte troppo attiva rallentarono le nomine. La prima sentenza (n. 1/1956) stabilì subito che la Corte poteva giudicare anche le leggi anteriori alla Costituzione — un\'affermazione di autorità immediata e non scontata.',
      },
      {
        tipo: 'box',
        label: 'Il paradosso risolto: la "Costituzione vivente"',
        colore: '#ffd700',
        contenuto:
          'Col tempo si è visto che i timori erano in parte fondati e in parte no. La Corte ha svolto un ruolo politico inevitabile — non potrebbe essere altrimenti, dato che interpreta la Costituzione su questioni sensibili. Ma ha anche garantito diritti fondamentali contro maggioranze parlamentari che avrebbero potuto comprimerli. Il concetto di "Costituzione vivente" (la Costituzione come la Corte la interpreta nel tempo) descrive proprio questo: la Corte non applica meccanicamente un testo, ma lo fa evolvere adattandolo alla realtà sociale — nel bene e nel male, secondo le diverse sensibilità politiche.',
      },
    ],
  },

  // ── 1. CHE COS'È ──────────────────────────────────────────────────────────
  {
    id: 'cosè',
    titolo: "Cos'è la giustizia costituzionale",
    colore: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    icon: '⚖',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'La giustizia costituzionale è il sistema che garantisce che tutte le leggi rispettino la Costituzione. In pratica: chi controlla che il Parlamento non faccia leggi "sbagliate" rispetto alla Costituzione? Ci pensa la Corte Costituzionale.',
      },
      {
        tipo: 'confronto',
        coloreLeft: '#38bdf8',
        coloreRight: '#a78bfa',
        left: {
          label: 'Sindacato DIFFUSO (common law)',
          items: [
            'Ogni giudice può disapplicare una legge incostituzionale',
            'L\'effetto vale solo tra le parti del processo',
            'Rischio: sentenze diverse sullo stesso problema',
            'La Corte Suprema unifica l\'interpretazione',
            'Esempio: Stati Uniti',
          ],
        },
        right: {
          label: 'Sindacato ACCENTRATO (civil law)',
          items: [
            'Solo un organo specializzato giudica le leggi',
            'L\'effetto vale per tutti (erga omnes)',
            'Certezza del diritto garantita',
            'Accesso diretto o tramite giudici ordinari',
            'Esempio: Italia, Austria, Germania',
          ],
        },
      },
      {
        tipo: 'box',
        label: 'Chi ha inventato il modello italiano?',
        colore: '#f97316',
        contenuto:
          'Hans Kelsen, giurista austriaco. Secondo lui l\'ordinamento è una gerarchia di norme con la Costituzione in cima. La Corte è un "legislatore negativo": non crea leggi, ma elimina quelle incostituzionali. L\'Austria fu la prima, nel 1920, a usare questo modello — che poi ispirò l\'Italia nel 1948.',
      },
      {
        tipo: 'box',
        label: 'Sindacato preventivo vs successivo',
        colore: '#ffd700',
        contenuto:
          'In Francia il Conseil constitutionnel controlla le leggi PRIMA che entrino in vigore (preventivo). In Italia, invece, la Corte interviene DOPO: la legge è già in vigore quando viene impugnata (successivo). Esiste una piccola eccezione: un controllo preventivo esiste anche in Italia, ma solo per gli Statuti regionali.',
      },
    ],
  },

  // ── 2. COMPOSIZIONE ───────────────────────────────────────────────────────
  {
    id: 'composizione',
    titolo: 'Composizione e indipendenza',
    colore: '#38bdf8',
    bg: 'rgba(56,189,248,0.08)',
    icon: '👥',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'La Corte è formata da 15 giudici scelti tra magistrati delle giurisdizioni superiori, professori universitari di materie giuridiche e avvocati con almeno 20 anni di esercizio.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: '5 giudici',
            testo: 'Nominati dal Presidente della Repubblica',
            colore: '#f97316',
            badge: 'PdR',
          },
          {
            titolo: '5 giudici',
            testo: 'Eletti dal Parlamento in seduta comune (primi 3 scrutini: 2/3; dal 4° scrutinio: 3/5)',
            colore: '#38bdf8',
            badge: 'Parlamento',
          },
          {
            titolo: '5 giudici',
            testo: 'Eletti dalle magistrature ordinarie e amministrative',
            colore: '#a78bfa',
            badge: 'Magistrature',
          },
        ],
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Mandato 9 anni', testo: 'Non rinnovabile: così il giudice non ha incentivo a compiacere chi lo ha nominato per essere rieletto.' },
          { titolo: 'Rinnovo graduale', testo: 'I giudici non scadono tutti insieme, così la Corte mantiene sempre continuità.' },
          { titolo: 'Quorum minimo', testo: 'Servono almeno 11 giudici per deliberare validamente: i ritardi nelle nomine possono bloccare i lavori.' },
          { titolo: 'Incompatibilità', testo: 'I giudici non possono fare politica né svolgere altre professioni che ne compromettano l\'imparzialità.' },
          { titolo: 'Immunità funzionale', testo: 'Non possono essere perseguiti per le opinioni e decisioni prese nell\'esercizio delle loro funzioni.' },
          { titolo: 'Inamovibilità', testo: 'Non possono essere rimossi se non per motivi gravissimi, con decisione della Corte stessa a maggioranze qualificate.' },
          { titolo: 'Autodichia', testo: 'La Corte risolve internamente le controversie sul proprio personale, senza interferenze esterne.' },
        ],
      },
      {
        tipo: 'box',
        label: 'Il Presidente della Corte',
        colore: '#38bdf8',
        contenuto:
          'I giudici eleggono tra loro il Presidente a scrutinio segreto (maggioranza assoluta; al terzo scrutinio basta la relativa). Dura 3 anni ed è rieleggibile. Rappresenta la Corte, presiede udienze e camere di consiglio, sceglie il giudice relatore e, in caso di parità, il suo voto è decisivo.',
      },
    ],
  },

  // ── 3. COMPETENZE ─────────────────────────────────────────────────────────
  {
    id: 'competenze',
    titolo: 'Le competenze della Corte',
    colore: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    icon: '📋',
    blocchi: [
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Giudizio di legittimità costituzionale',
            testo: 'Controlla che le leggi e gli atti aventi forza di legge (decreti legge, decreti legislativi, leggi regionali) rispettino la Costituzione. Può avvenire in via incidentale o in via principale.',
            colore: '#f97316',
            badge: 'Art. 134 Cost.',
          },
          {
            titolo: 'Conflitti di attribuzione',
            testo: 'Risolve le liti tra poteri dello Stato (es. Parlamento vs. Magistratura) o tra Stato e Regioni, quando qualcuno "invade" le funzioni di un altro. Qui si può impugnare qualsiasi atto, non solo le leggi.',
            colore: '#38bdf8',
            badge: 'Art. 134 Cost.',
          },
          {
            titolo: 'Ammissibilità del referendum',
            testo: 'Prima del voto, verifica che il quesito referendario rispetti i limiti costituzionali (no a leggi tributarie, amnistia, trattati internazionali) e che sia chiaro e omogeneo.',
            colore: '#a78bfa',
            badge: 'Art. 75 Cost.',
          },
          {
            titolo: 'Accuse al Presidente della Repubblica',
            testo: 'Giudica il PdR per alto tradimento o attentato alla Costituzione. In questo caso la Corte è integrata da 16 giudici aggregati estratti a sorte.',
            colore: '#22c55e',
            badge: 'Art. 90 Cost.',
          },
        ],
      },
      {
        tipo: 'box',
        label: '⚠️ Cosa NON può giudicare la Corte',
        colore: '#f97316',
        contenuto:
          'I regolamenti amministrativi non sono sindacabili dalla Corte: ci pensa il giudice amministrativo (TAR e Consiglio di Stato) confrontandoli con la legge. La Corte interviene solo quando c\'è una violazione diretta della Costituzione da parte di una fonte primaria (legge o atto con forza di legge).',
      },
      {
        tipo: 'box',
        label: 'La norma interposta',
        colore: '#a78bfa',
        contenuto:
          'A volte il parametro di giudizio non è direttamente la Costituzione, ma una norma esterna "richiamata" da essa. Esempio: l\'art. 117 Cost. impone alla legge di rispettare gli obblighi internazionali e il diritto UE. Se una legge viola la CEDU, viola "indirettamente" anche la Costituzione tramite l\'art. 117: la CEDU diventa norma interposta.',
      },
    ],
  },

  // ── 4. GIUDIZIO INCIDENTALE ───────────────────────────────────────────────
  {
    id: 'incidentale',
    titolo: 'Il giudizio incidentale',
    colore: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    icon: '🔄',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'È la via più comune per arrivare alla Corte. Funziona così: un giudice sta celebrando un processo e si accorge che la legge che deve applicare potrebbe essere incostituzionale. Non può ignorarla né annullarla da solo: sospende il processo e manda la questione alla Corte.',
      },
      {
        tipo: 'highlight',
        colore: '#22c55e',
        testo: 'Il giudice non "sceglie" di sollevare la questione: è un passaggio obbligato se non riesce a decidere senza prima risolvere il dubbio di costituzionalità.',
      },
      {
        tipo: 'box',
        label: "L'ordinanza di rimessione",
        colore: '#22c55e',
        contenuto:
          "È il documento con cui il giudice trasmette la questione alla Corte. Deve essere motivata in modo rigoroso: la Corte non accetta questioni generiche o pretestuose. L'ordinanza delimita esattamente cosa deve giudicare la Corte.",
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Indicazione del giudizio a quo', testo: 'Chi sono le parti, qual è la causa, qual è il punto decisivo: la Corte deve capire il contesto.' },
          { titolo: 'Rilevanza', testo: 'La norma sospetta deve essere davvero necessaria per decidere quella causa. Se il giudice può decidere senza applicarla, non può sollevare la questione.' },
          { titolo: 'Non manifesta infondatezza', testo: 'Il dubbio deve essere serio. Il giudice deve spiegare quale articolo della Costituzione sarebbe violato e perché — non basta dire "secondo me è incostituzionale".' },
          { titolo: 'Norma impugnata precisa', testo: 'Quale articolo, quale comma, quale parte della legge si contesta. Se è vago, la Corte non può giudicare.' },
          { titolo: 'Interpretazione conforme tentata', testo: 'Prima di sollevare la questione, il giudice deve verificare se la norma può essere letta in modo compatibile con la Costituzione. Solo se non è possibile, può rivolgersi alla Corte.' },
          { titolo: 'Diritto vivente', testo: 'Se i tribunali applicano quella norma sempre nello stesso modo, il giudice deve tenerne conto. La Corte giudica la norma "come funziona davvero", non solo il testo scritto.' },
        ],
      },
    ],
  },

  // ── 5. GIUDIZIO IN VIA PRINCIPALE ─────────────────────────────────────────
  {
    id: 'principale',
    titolo: 'Il giudizio in via principale',
    colore: '#ffd700',
    bg: 'rgba(255,215,0,0.08)',
    icon: '🏛',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Mentre il giudizio incidentale nasce dentro un processo, quello in via principale è un ricorso diretto: lo Stato o una Regione contestano direttamente una legge perché ritengono che invada la loro sfera di competenze.',
      },
      {
        tipo: 'confronto',
        coloreLeft: '#ffd700',
        coloreRight: '#fb7185',
        left: {
          label: 'Lo Stato impugna una legge regionale',
          items: [
            'Il ricorso spetta al Governo',
            'Si contesta che la Regione abbia legiferato in materie riservate allo Stato',
            'Termine: 60 giorni dalla pubblicazione della legge regionale',
          ],
        },
        right: {
          label: 'La Regione impugna una legge statale',
          items: [
            'Il ricorso spetta alla Giunta regionale',
            'Si contesta che lo Stato abbia invaso competenze regionali',
            'Termine: 60 giorni dalla pubblicazione della legge statale',
          ],
        },
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Deposito', testo: 'Il ricorso va depositato in cancelleria entro 10 giorni dalla scadenza dei 60 giorni.' },
          { titolo: 'Contenuto', testo: 'Il ricorrente deve indicare i parametri costituzionali violati con motivazione puntuale.' },
          { titolo: 'Udienza pubblica', testo: 'Le parti illustrano le proprie posizioni davanti alla Corte.' },
          { titolo: 'Camera di consiglio', testo: 'Solo i giudici si riuniscono per deliberare e poi emettono sentenza.' },
        ],
      },
    ],
  },

  // ── 6. LE SENTENZE ────────────────────────────────────────────────────────
  {
    id: 'sentenze',
    titolo: 'Le tipologie di sentenze',
    colore: '#fb7185',
    bg: 'rgba(251,113,133,0.08)',
    icon: '📄',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Le decisioni della Corte hanno una struttura precisa: prima individua la norma impugnata e i parametri costituzionali, poi ricostruisce lo svolgimento del giudizio, poi motiva nel merito. Il dispositivo è la parte finale — quella che conta giuridicamente — e può essere di vario tipo.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Inammissibilità',
            testo: 'La Corte non entra nel merito: manca qualche requisito del giudizio (es. chi ha sollevato la questione non è un vero giudice, manca la rilevanza, la norma non è una legge, l\'ordinanza è scritta male). La norma resta in vigore. Il giudice non può riproporre la stessa questione identica.',
            colore: 'rgba(255,255,255,0.4)',
            badge: 'Processuale',
          },
          {
            titolo: 'Rigetto',
            testo: 'La Corte entra nel merito e dichiara che la norma non è incostituzionale. La legge resta in vigore. Effetto inter partes: altri giudici possono sollevare di nuovo la stessa questione con argomenti diversi.',
            colore: '#22c55e',
            badge: 'La norma resta',
          },
          {
            titolo: 'Accoglimento',
            testo: 'La Corte dichiara la norma incostituzionale. Dal giorno dopo la pubblicazione in Gazzetta Ufficiale, la norma cessa di avere effetto per tutti (erga omnes). La retroattività è parziale: non travolge i rapporti già esauriti né le sentenze passate in giudicato, ma i processi pendenti devono adeguarsi.',
            colore: '#f97316',
            badge: 'Norma eliminata',
          },
          {
            titolo: 'Cessazione della materia del contendere',
            testo: 'Durante il giudizio la norma impugnata viene modificata o abrogata dal legislatore: il problema non esiste più, la Corte chiude il giudizio senza decidere nel merito (salvo che residuino effetti da esaminare).',
            colore: '#38bdf8',
            badge: 'Il problema è scomparso',
          },
        ],
      },
    ],
  },

  // ── 7. SENTENZE MANIPOLATIVE ──────────────────────────────────────────────
  {
    id: 'manipolative',
    titolo: 'Le sentenze manipolative',
    colore: '#e879f9',
    bg: 'rgba(232,121,249,0.08)',
    icon: '✂',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Accoglimento e rigetto sono le decisioni base, ma spesso non bastano. Se la Corte dovesse scegliere solo tra "cancello tutto" o "non faccio niente", causerebbe danni enormi. Per questo ha sviluppato tecniche più sofisticate — le sentenze manipolative — che intervengono con precisione chirurgica.',
      },
      {
        tipo: 'highlight',
        colore: '#e879f9',
        testo: 'Principio delle "rime obbligate": la Corte non inventa norme, ma usa materiale normativo già presente nell\'ordinamento. Sostituisce le "rime sbagliate" con quelle conformi alla Costituzione.',
      },
      {
        tipo: 'lista',
        items: [
          {
            titolo: '1 — Parziale',
            testo: 'Incostituzionale solo una parte del testo. Il resto della legge rimane in vigore. Principio: "il valido non viene travolto dall\'invalido" (simile all\'art. 1419 c.c. sui contratti). Es.: sent. 90/1970 e 11/1979 sulla punibilità di chi prendeva la parola in riunioni pubbliche non preavvisate.',
          },
          {
            titolo: '2 — Additiva',
            testo: 'Incostituzionale nella parte in cui NON prevede qualcosa. La Corte aggiunge la previsione mancante. La legge resta in vigore, ma deve essere applicata come se contenesse anche quella parte. Es.: sent. 223/1983 sulla liberazione condizionale per i condannati all\'ergastolo.',
          },
          {
            titolo: '3 — Sostitutiva',
            testo: 'Incostituzionale perché prevede X anziché Y. La Corte sostituisce il frammento sbagliato con quello costituzionalmente corretto. Non sottrae potere al legislatore: opera al minimo indispensabile. Es.: sent. 96/2015 sulla fecondazione eterologa.',
          },
          {
            titolo: '4 — Additiva di prestazione',
            testo: 'Estende una determinata prestazione (es. un beneficio, un sussidio) ad altre categorie di soggetti che ne erano illegittimamente escluse.',
          },
          {
            titolo: '5 — Additiva di principio',
            testo: 'La Corte dichiara l\'illegittimità e indica il principio che il legislatore deve seguire per colmare la lacuna, ma non può farlo direttamente perché la materia è troppo complessa. Contiene un monito fortissimo al Parlamento.',
          },
          {
            titolo: '6 — Interpretativa di rigetto',
            testo: 'La norma non è incostituzionale, ma il giudice la stava leggendo male. La Corte indica l\'interpretazione corretta e salva la legge. Non elimina la norma. Il giudice a quo deve applicare la lettura indicata dalla Corte.',
          },
          {
            titolo: '7 — Interpretativa di accoglimento',
            testo: 'La norma ha più possibili significati: uno è incostituzionale, gli altri no. La Corte dichiara incostituzionale solo quella specifica interpretazione. La legge resta, ma non può più essere applicata in quel modo.',
          },
          {
            titolo: '8 — Monitorie / Esortative',
            testo: 'Di solito sono sentenze di rigetto: la Corte salva la norma ma avverte il legislatore che deve intervenire. Può essere un invito generico o un vero e proprio "decalogo" (es. sent. 225/1974 sul monopolio radiotelevisivo). In alcuni casi ammonisce: "Se non intervenite, la prossima volta dichiaro l\'illegittimità".',
          },
          {
            titolo: '9 — Legittimità provvisoria',
            testo: 'La Corte salva la legge temporaneamente, pur riconoscendo che è ormai incompatibile con la Costituzione, per evitare un vuoto normativo immediato. Dà al Parlamento il tempo di fare la riforma. Se non interviene, la dichiarazione di illegittimità diventa inevitabile.',
          },
          {
            titolo: '10 — Accoglimento con retroattività limitata',
            testo: 'La Corte dichiara l\'illegittimità ma ne limita gli effetti retroattivi, indicando un momento preciso dal quale decorre l\'incostituzionalità o escludendo gli effetti passati per ragioni di certezza del diritto. Tecnica molto usata negli anni \'80, molto discussa in dottrina.',
          },
        ],
      },
      {
        tipo: 'box',
        label: '💡 Perché la Corte non annulla sempre subito?',
        colore: '#e879f9',
        contenuto:
          'A volte la materia è talmente complessa che intervenire con una sentenza creerebbe più danni che benefici. Oppure la riforma richiede scelte politiche di dettaglio che spettano al Parlamento, non alla Corte. O ancora: non esiste ancora una disciplina alternativa da cui prendere il modello. In questi casi la Corte preferisce moniti e legittimità provvisoria, lasciando al legislatore il tempo di agire.',
      },
    ],
  },

  // ── 8. CONFLITTI DI ATTRIBUZIONE ──────────────────────────────────────────
  {
    id: 'conflitti',
    titolo: 'I conflitti di attribuzione',
    colore: '#38bdf8',
    bg: 'rgba(56,189,248,0.08)',
    icon: '⚡',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Quando un potere dello Stato ritiene che un altro abbia invaso le sue funzioni, può rivolgersi alla Corte. Così uno scontro politico diventa una controversia giuridica risolvibile in modo imparziale.',
      },
      {
        tipo: 'confronto',
        coloreLeft: '#38bdf8',
        coloreRight: '#f97316',
        left: {
          label: 'Conflitto INTERORGANICO (tra poteri dello Stato)',
          items: [
            'Es.: Parlamento vs. Magistratura',
            'Es.: Governo vs. Presidente della Repubblica',
            'Es.: singolo parlamentare vs. Camera',
            'Anche omissioni e comportamenti, non solo atti formali',
            'Caso Mancuso (sent. 7/1996): sfiducia individuale al ministro',
          ],
        },
        right: {
          label: 'Conflitto INTERSOGGETTIVO (Stato vs. Regioni)',
          items: [
            'Stato contro legge o atto regionale',
            'Regione contro atto statale',
            'Tra Regioni diverse',
            'NON per le leggi (quelle si impugnano in via principale)',
            'Si può chiedere la sospensione cautelare dell\'atto',
          ],
        },
      },
      {
        tipo: 'highlight',
        colore: '#38bdf8',
        testo: 'Differenza fondamentale: nel giudizio di legittimità si contesta la NORMA (solo leggi o atti con forza di legge). Nel conflitto di attribuzione si contesta l\'ORGANO che ha agito, e si può impugnare qualsiasi atto — anche sentenze, atti amministrativi, comportamenti.',
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Chi può sollevare il conflitto?', testo: 'Gli organi che esprimono "definitivamente" la volontà del potere. Nell\'esecutivo: il Governo. Nel giudiziario (potere diffuso): anche un singolo giudice. In casi particolari: commissioni parlamentari d\'inchiesta, singoli parlamentari, persino il comitato promotore di un referendum.' },
          { titolo: 'Come si apre il giudizio?', testo: 'Con ricorso alla Corte, deposito e pubblicazione in Gazzetta Ufficiale. Poi la Corte verifica preliminarmente l\'ammissibilità in camera di consiglio. Se ammette, notifica ai controinteressati che possono costituirsi.' },
          { titolo: 'Cosa decide la Corte?', testo: 'A chi spetta la competenza e, se necessario, annulla l\'atto invasivo. Spesso indica anche come la competenza deve essere esercitata (es. con quale procedura, coinvolgendo quali soggetti).' },
          { titolo: 'Strumento residuale', testo: 'Il conflitto si usa solo se non esistono altri rimedi giurisdizionali. Non serve per contestare leggi: quelle si impugnano con i giudizi sulle leggi.' },
        ],
      },
    ],
  },

  // ── 9. REFERENDUM ─────────────────────────────────────────────────────────
  {
    id: 'referendum',
    titolo: 'Ammissibilità del referendum',
    colore: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    icon: '🗳',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Prima che un referendum abrogativo vada al voto, la Corte verifica che il quesito rispetti le regole costituzionali. Il controllo non era previsto in origine dalla Costituzione: è stato introdotto dalla legge cost. 1/1953.',
      },
      {
        tipo: 'box',
        label: 'Come funziona il procedimento?',
        colore: '#a78bfa',
        contenuto:
          'L\'Ufficio centrale presso la Cassazione verifica la regolarità formale della richiesta. Poi trasmette l\'ordinanza alla Corte, che fissa la camera di consiglio entro il 20 gennaio, nomina il relatore e avvisa promotori e Governo. La sentenza deve arrivare entro il 10 febbraio.',
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Limiti espressi (art. 75 Cost.)', testo: 'Vietati i referendum su leggi tributarie e di bilancio, amnistia e indulto, ratifica di trattati internazionali.' },
          { titolo: 'Oggetto referendabile', testo: 'Il quesito deve riguardare una legge o atto con forza di legge. No a regolamenti o atti amministrativi.' },
          { titolo: 'Leggi costituzionali escluse', testo: 'Non si possono abrogare con referendum le leggi costituzionali o quelle "rinforzate".' },
          { titolo: 'Contenuto necessario', testo: 'Non si può abrogare una disciplina indispensabile per garantire diritti fondamentali o il funzionamento di organi costituzionali.' },
          { titolo: 'Quesito chiaro', testo: 'L\'elettore deve capire cosa viene abrogato. Vietati quesiti ambigui o con esiti non decifrabili.' },
          { titolo: 'Omogeneità', testo: 'Il quesito deve avere una "matrice razionalmente unitaria": non si possono mescolare materie eterogenee costringendo a un sì/no su cose diverse.' },
          { titolo: 'No a vuoti normativi intollerabili', testo: 'Se l\'abrogazione paralizzasse un procedimento costituzionale essenziale, il referendum è inammissibile. Es.: sent. 10/2025 sul referendum contro la legge Calderoli sull\'autonomia differenziata.' },
        ],
      },
    ],
  },

  // ── 10. GIUSTIZIA POLITICA ────────────────────────────────────────────────
  {
    id: 'politica',
    titolo: 'Giustizia politica e Tribunale dei ministri',
    colore: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    icon: '🏛',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Il Presidente della Repubblica è di norma irresponsabile per gli atti compiuti nell\'esercizio delle sue funzioni. Esistono però due eccezioni gravissime: alto tradimento e attentato alla Costituzione (art. 90 Cost.).',
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Messa in stato d\'accusa', testo: 'Deliberata dal Parlamento in seduta comune a maggioranza assoluta.' },
          { titolo: 'Giudizio', testo: 'Si svolge davanti alla Corte costituzionale integrata da 16 giudici aggregati estratti a sorte tra i cittadini eleggibili a senatore.' },
          { titolo: 'Natura delle condotte', testo: 'Solo azioni consapevoli e dirette a colpire l\'ordine costituzionale: la nozione è interpretata in modo molto restrittivo.' },
        ],
      },
      {
        tipo: 'box',
        label: 'I reati ministeriali: il Tribunale dei ministri',
        colore: '#22c55e',
        contenuto:
          'Dal 1989 (riforma dell\'art. 96 Cost.) i ministri e il Presidente del Consiglio non rispondono più davanti alla Corte, ma davanti alla magistratura ordinaria, con un filtro parlamentare. Il Tribunale dei ministri è un collegio di 3 magistrati sorteggiati nel distretto: svolge l\'istruttoria preliminare e, se ritiene ci siano elementi, trasmette gli atti alla Camera competente che deve autorizzare il procedimento. Solo dopo l\'autorizzazione il processo prosegue normalmente.',
      },
    ],
  },
];

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function CorteCostituzionalePage() {
  const [aperta, setAperta] = useState<string | null>(null);

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

          {/* HERO */}
          <div style={{
            background: 'linear-gradient(135deg, #0d1829, #111a2e)',
            borderRadius: 28,
            padding: '28px 24px',
            border: '0.5px solid rgba(249,115,22,0.2)',
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -50, right: -50,
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              display: 'inline-block',
              border: '1px solid rgba(249,115,22,0.3)',
              borderRadius: 99,
              padding: '4px 14px',
              fontSize: 9, letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#f97316', fontWeight: 700, marginBottom: 14,
            }}>
              Organo di garanzia costituzionale
            </div>

            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 10 }}>
              Corte<br />Costituzionale
            </div>

            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 20 }}>
              Istituita dalla Costituzione del 1948, operativa dal 1956. Garante della
              supremazia della Costituzione su tutte le altre fonti del diritto italiano.
              Il modello è quello kelseniano: la Corte è un "legislatore negativo" che
              elimina le norme incostituzionali senza crearne di nuove.
            </div>

            {/* Barre colorate */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { num: 10, label: 'sezioni', colore: '#f97316' },
                { num: 15, label: 'giudici', colore: '#38bdf8' },
                { num: 9, label: 'anni mandato', colore: '#a78bfa' },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1, background: `${s.colore}11`, borderRadius: 12,
                  padding: '10px 8px', border: `0.5px solid ${s.colore}33`, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.colore }}>{s.num}</div>
                  <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* INDICE RAPIDO */}
          <div style={{
            background: '#111526',
            borderRadius: 18,
            padding: '16px',
            border: '0.5px solid rgba(255,255,255,0.05)',
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 12 }}>
              Indice degli argomenti
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sezioni.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setAperta(s.id);
                    setTimeout(() => {
                      document.getElementById(`sezione-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                  }}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 8,
                    background: `${s.colore}11`,
                    border: `0.5px solid ${s.colore}33`,
                    color: s.colore,
                    fontSize: 10, fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {s.icon} {s.titolo}
                </button>
              ))}
            </div>
          </div>

          {/* SEZIONI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sezioni.map((sezione) => (
              <div
                key={sezione.id}
                id={`sezione-${sezione.id}`}
                style={{
                  background: '#111526',
                  borderRadius: 20,
                  border: `0.5px solid ${aperta === sezione.id ? sezione.colore + '55' : 'rgba(255,255,255,0.05)'}`,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* HEADER SEZIONE */}
                <div
                  onClick={() => setAperta(aperta === sezione.id ? null : sezione.id)}
                  style={{
                    padding: '18px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: sezione.bg,
                    border: `0.5px solid ${sezione.colore}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>
                    {sezione.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{sezione.titolo}</div>
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.3)', fontSize: 13, flexShrink: 0,
                    transform: aperta === sezione.id ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}>▾</div>
                </div>

                {/* CONTENUTO SEZIONE */}
                {aperta === sezione.id && (
                  <div style={{ padding: '0 16px 20px', borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {sezione.blocchi.map((blocco, bi) => {
                        // ── TESTO ──
                        if (blocco.tipo === 'testo') return (
                          <p key={bi} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85 }}>
                            {blocco.contenuto}
                          </p>
                        );

                        // ── HIGHLIGHT ──
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

                        // ── BOX ──
                        if (blocco.tipo === 'box') {
                          const col = blocco.colore ?? sezione.colore;
                          return (
                            <div key={bi} style={{
                              background: `${col}08`,
                              borderRadius: 14,
                              padding: '14px',
                              border: `0.5px solid ${col}22`,
                            }}>
                              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: col, fontWeight: 700, marginBottom: 8 }}>
                                {blocco.label}
                              </div>
                              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85 }}>
                                {blocco.contenuto}
                              </p>
                            </div>
                          );
                        }

                        // ── LISTA ──
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

                        // ── CONFRONTO ──
                        if (blocco.tipo === 'confronto') return (
                          <div key={bi} style={{ display: 'flex', gap: 8 }}>
                            {[
                              { col: blocco.coloreLeft, data: blocco.left },
                              { col: blocco.coloreRight, data: blocco.right },
                            ].map(({ col, data }, ci) => (
                              <div key={ci} style={{
                                flex: 1,
                                background: `${col}08`,
                                borderRadius: 14,
                                padding: '12px 10px',
                                border: `0.5px solid ${col}30`,
                              }}>
                                <div style={{ fontSize: 9.5, fontWeight: 800, color: col, marginBottom: 10, letterSpacing: 0.5, lineHeight: 1.4 }}>
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

                        // ── CARDS ──
                        if (blocco.tipo === 'cards') return (
                          <div key={bi} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {blocco.items.map((card, ci) => {
                              const col = card.colore ?? sezione.colore;
                              return (
                                <div key={ci} style={{
                                  background: `${col}08`,
                                  borderRadius: 14,
                                  padding: '14px',
                                  border: `0.5px solid ${col}22`,
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', flex: 1 }}>
                                      {card.titolo}
                                    </div>
                                    {card.badge && (
                                      <div style={{
                                        background: `${col}18`,
                                        borderRadius: 6,
                                        padding: '2px 8px',
                                        fontSize: 9, fontWeight: 700, color: col, letterSpacing: 0.5,
                                        flexShrink: 0,
                                      }}>
                                        {card.badge}
                                      </div>
                                    )}
                                  </div>
                                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>
                                    {card.testo}
                                  </p>
                                </div>
                              );
                            })}
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

          {/* NOTA FINALE */}
          <div style={{
            marginTop: 16,
            background: 'linear-gradient(135deg, rgba(249,115,22,0.05), rgba(56,189,248,0.05))',
            borderRadius: 18,
            padding: '18px 16px',
            border: '0.5px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 10 }}>
              Operatività storica
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              La Corte fu prevista dalla Costituzione nel 1948 ma diventò operativa solo nel{' '}
              <span style={{ color: '#f97316', fontWeight: 700 }}>1956</span>. Nel periodo
              transitorio, le controversie che oggi decide la Corte venivano risolte secondo le
              vecchie regole pre-costituzionali, nei limiti consentiti da quelle norme (VII
              Disposizione transitoria e finale). La legge n. 87/1953 ha poi disciplinato in
              dettaglio le procedure del giudizio costituzionale.
            </p>
          </div>

        </div>

        <Footer />
      </div>
    </>
  );
}