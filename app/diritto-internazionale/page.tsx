'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Rif = { n: string; caso: string; testo: string; link: string };
type Voce = { nome: string; def: string; esempi: string[]; rifLabel: string; rif: Rif[] };
type Sezione = { id: string; label: string; sub: string; colore: string; icon: string; voci: Voce[] };

const sezioni: Sezione[] = [
  {
    id: 'fonti',
    label: 'Fonti del diritto internazionale',
    sub: 'Gerarchia · art. 38 Statuto CIG',
    colore: '#ffd700',
    icon: '<path d="M12 3V21M12 3L5 7L12 11L19 7L12 3Z"/><path d="M5 7L2 14C2 16 3.5 17 5 17C6.5 17 8 16 8 14L5 7Z"/><path d="M19 7L16 14C16 16 17.5 17 19 17C20.5 17 22 16 22 14L19 7Z"/><path d="M3 21H21"/>',
    voci: [
      {
        nome: 'Consuetudine internazionale',
        def: `È la fonte primaria del diritto internazionale generale: norme non scritte che vincolano tutti gli Stati della comunità internazionale.

Elementi costitutivi:
• Diuturnitas (prassi): comportamento costante e uniforme degli Stati ripetuto nel tempo
• Opinio iuris ac necessitatis: convinzione che quel comportamento sia giuridicamente obbligatorio

In Italia entra automaticamente nell'ordinamento tramite l'adattamento automatico ex art. 10, comma 1, Cost.`,
        esempi: ['Immunità degli Stati esteri dalla giurisdizione', 'Immunità diplomatiche', 'Pacta sunt servanda', 'Divieto dell\'uso della forza', 'Consuetudini particolari (regionali o locali)'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, Nicaragua c. USA (1986)', caso: 'Prova della consuetudine e opinio iuris', testo: 'La Corte ricostruisce il divieto dell\'uso della forza e il principio di non ingerenza come norme consuetudinarie, distinte dalle corrispondenti norme pattizie della Carta ONU.', link: 'https://www.icj-cij.org' },
          { n: 'CPGI, Lotus (1927)', caso: 'Formazione della consuetudine e sovranità', testo: 'In assenza di una norma proibitiva gli Stati restano liberi di agire: la consuetudine si ricava dalla prassi accompagnata dalla convinzione di obbligatorietà.', link: 'https://www.icj-cij.org' },
          { n: 'Corte Cost. n. 238/2014', caso: 'Limite dei controlimiti alla consuetudine', testo: 'La consuetudine sull\'immunità degli Stati non entra nell\'ordinamento italiano quando contrasta con il diritto alla tutela giurisdizionale (art. 24 Cost.).', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2014&numero=238' },
        ],
      },
      {
        nome: 'Ius cogens (norme imperative)',
        def: `Lo ius cogens è costituito dalle norme imperative del diritto internazionale generale, inderogabili da accordi tra Stati. Sono definite dall'art. 53 della Convenzione di Vienna del 1969: una norma accettata e riconosciuta dalla comunità internazionale degli Stati nel suo insieme come norma alla quale non è permessa alcuna deroga.

Un trattato in contrasto con una norma di ius cogens è nullo.`,
        esempi: ['Divieto di genocidio', 'Divieto di tortura', 'Divieto di schiavitù', 'Divieto di aggressione', 'Principio di autodeterminazione dei popoli'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, Barcelona Traction (1970)', caso: 'Obblighi erga omnes', testo: 'Esistono obblighi degli Stati verso la comunità internazionale nel suo complesso (erga omnes): per la loro importanza, tutti gli Stati hanno un interesse giuridico alla loro protezione.', link: 'https://www.icj-cij.org' },
          { n: 'TPIY, Furundžija (1998)', caso: 'Divieto di tortura come ius cogens', testo: 'Il divieto di tortura ha assunto il rango di norma imperativa, gerarchicamente superiore alle norme pattizie e consuetudinarie ordinarie.', link: 'https://www.icty.org' },
        ],
      },
      {
        nome: 'Trattati e accordi internazionali',
        def: `Il trattato è un accordo tra soggetti di diritto internazionale destinato a produrre effetti giuridici vincolanti. Costituisce il diritto internazionale particolare: vincola solo gli Stati contraenti.

La disciplina è contenuta nella Convenzione di Vienna sul diritto dei trattati (1969): formazione (negoziazione, firma, ratifica), riserve, interpretazione in buona fede, cause di invalidità ed estinzione.`,
        esempi: ['Trattati bilaterali e multilaterali', 'Convenzioni di codificazione', 'Accordi in forma semplificata', 'Ratifica con autorizzazione parlamentare (art. 80 Cost.)'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, Gabčíkovo-Nagymaros (1997)', caso: 'Estinzione e sospensione dei trattati', testo: 'Lo stato di necessità e il mutamento delle circostanze non liberano automaticamente lo Stato dagli obblighi pattizi: vanno interpretati restrittivamente alla luce della Convenzione di Vienna.', link: 'https://www.icj-cij.org' },
          { n: 'Corte Cost. nn. 348-349/2007', caso: 'CEDU come norma interposta (art. 117 Cost.)', testo: 'I trattati sui diritti umani, in particolare la CEDU, operano come norme interposte tra Costituzione e legge ordinaria tramite l\'art. 117, comma 1, Cost.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2007&numero=348' },
        ],
      },
      {
        nome: 'Principi generali di diritto',
        def: `Sono i principi comuni agli ordinamenti giuridici interni degli Stati, utilizzabili nel diritto internazionale per colmare lacune normative. Previsti dall'art. 38 dello Statuto della Corte Internazionale di Giustizia come terza fonte, hanno funzione integrativa.

Si distinguono dai principi propri dell'ordinamento internazionale, ricavati per induzione dalle norme esistenti.`,
        esempi: ['Nemo iudex in re sua', 'Ne bis in idem', 'Buona fede', 'Responsabilità per fatto illecito', 'Divieto di abuso del diritto'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CPGI, Fabbrica di Chorzów (1928)', caso: 'Obbligo di riparazione', testo: 'È principio di diritto internazionale che la violazione di un impegno comporta l\'obbligo di riparare in forma adeguata: la riparazione deve cancellare le conseguenze dell\'atto illecito.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Fonti di terzo grado',
        def: `Sono gli atti adottati dalle organizzazioni internazionali in base ai trattati istitutivi. La loro forza giuridica deriva dall'accordo internazionale che ha creato l'organizzazione: sono gerarchicamente subordinate agli accordi da cui traggono origine.`,
        esempi: ['Risoluzioni vincolanti del Consiglio di Sicurezza ONU (cap. VII Carta)', 'Regolamenti e direttive dell\'Unione Europea', 'Decisioni di organi di organizzazioni internazionali'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, parere sulla Namibia (1971)', caso: 'Effetti delle risoluzioni del Consiglio di Sicurezza', testo: 'Le decisioni del Consiglio di Sicurezza adottate ai sensi della Carta sono obbligatorie per tutti gli Stati membri, che hanno l\'obbligo di conformarvisi.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Soft law',
        def: `Il soft law comprende atti privi di forza vincolante diretta (dichiarazioni, risoluzioni, raccomandazioni, codici di condotta) che però orientano la condotta degli Stati e possono contribuire alla formazione di nuove consuetudini o all'interpretazione dei trattati.`,
        esempi: ['Risoluzioni dell\'Assemblea Generale ONU', 'Dichiarazioni di principi', 'Codici di condotta', 'Linee guida e standard internazionali'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, parere sulle armi nucleari (1996)', caso: 'Valore delle risoluzioni dell\'Assemblea Generale', testo: 'Le risoluzioni dell\'Assemblea Generale, pur non vincolanti, possono avere valore normativo e fornire prova dell\'esistenza di una norma o dell\'emergere di un\'opinio iuris.', link: 'https://www.icj-cij.org' },
        ],
      },
    ],
  },
  {
    id: 'dichiarazioni',
    label: 'Le dichiarazioni',
    sub: 'Soft law · principi fondamentali',
    colore: '#a78bfa',
    icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/>',
    voci: [
      {
        nome: 'Dichiarazione Universale dei Diritti Umani (1948)',
        def: `Adottata dall'Assemblea Generale ONU il 10 dicembre 1948 (Ris. 217 A III). Non è un trattato vincolante, ma rappresenta il fondamento della protezione internazionale dei diritti umani. Molte delle sue disposizioni sono oggi considerate diritto consuetudinario.`,
        esempi: ['Art. 1 — Tutti gli esseri umani nascono liberi ed eguali', 'Art. 3 — Diritto alla vita, libertà e sicurezza', 'Art. 5 — Divieto di tortura', 'Ha ispirato i Patti del 1966 e la CEDU'],
        rifLabel: 'Testo e seguito',
        rif: [
          { n: 'Patti del 1966', caso: 'Trasposizione in trattati vincolanti', testo: 'I principi della Dichiarazione sono stati resi vincolanti con il Patto sui diritti civili e politici e il Patto sui diritti economici, sociali e culturali.', link: 'https://www.un.org/en/about-us/universal-declaration-of-human-rights' },
        ],
      },
      {
        nome: 'Dichiarazione sulle relazioni amichevoli (1970)',
        def: `Risoluzione 2625 (XXV) dell'Assemblea Generale ONU. Codifica i principi fondamentali del diritto internazionale che regolano le relazioni amichevoli e la cooperazione tra Stati conformemente alla Carta ONU. È ritenuta espressione di diritto consuetudinario.`,
        esempi: ['Divieto dell\'uso della forza', 'Soluzione pacifica delle controversie', 'Non ingerenza negli affari interni', 'Eguaglianza sovrana degli Stati', 'Autodeterminazione dei popoli'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'CIG, Nicaragua c. USA (1986)', caso: 'Valore consuetudinario dei principi', testo: 'La Corte richiama la Ris. 2625 come prova dell\'opinio iuris degli Stati sul divieto dell\'uso della forza e sul principio di non ingerenza.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Dichiarazione sulla decolonizzazione (1960)',
        def: `Risoluzione 1514 (XV) dell'Assemblea Generale ONU sulla concessione dell'indipendenza ai paesi e ai popoli coloniali. Afferma il diritto all'autodeterminazione di tutti i popoli e condanna il colonialismo in ogni sua forma.`,
        esempi: ['Diritto all\'autodeterminazione dei popoli', 'Condanna del dominio coloniale', 'Integrità territoriale degli Stati'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'CIG, Sahara Occidentale (1975)', caso: 'Autodeterminazione dei popoli', testo: 'Il principio di autodeterminazione si applica ai territori non autonomi: la volontà liberamente espressa dei popoli è elemento essenziale.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Dichiarazione di Stoccolma (1972)',
        def: `Adottata alla Conferenza ONU sull'ambiente umano. Primo grande atto internazionale che riconosce la tutela dell'ambiente come responsabilità comune. Pone le basi del diritto internazionale dell'ambiente.`,
        esempi: ['Diritto a un ambiente di qualità', 'Responsabilità nella gestione delle risorse', 'Principio di cooperazione internazionale'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Principio 21', caso: 'Sovranità e responsabilità ambientale', testo: 'Gli Stati hanno il diritto sovrano di sfruttare le proprie risorse, ma la responsabilità di non causare danni all\'ambiente di altri Stati o di aree oltre la giurisdizione nazionale.', link: 'https://www.un.org' },
        ],
      },
      {
        nome: 'Dichiarazione di Rio (1992)',
        def: `Adottata alla Conferenza ONU su ambiente e sviluppo (Earth Summit). Consacra il principio dello sviluppo sostenibile e una serie di principi che orientano il diritto internazionale dell'ambiente contemporaneo.`,
        esempi: ['Principio di precauzione', 'Chi inquina paga', 'Sviluppo sostenibile', 'Responsabilità comuni ma differenziate'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Principio 15', caso: 'Principio di precauzione', testo: 'In caso di rischio di danno grave o irreversibile, l\'assenza di certezza scientifica assoluta non deve servire da pretesto per rinviare misure di prevenzione del degrado ambientale.', link: 'https://www.un.org' },
        ],
      },
      {
        nome: 'Dichiarazione sui diritti dei popoli indigeni (2007)',
        def: `Risoluzione 61/295 dell'Assemblea Generale ONU. Riconosce i diritti collettivi e individuali dei popoli indigeni, tra cui identità culturale, terre, risorse e autodeterminazione interna.`,
        esempi: ['Diritto all\'autodeterminazione interna', 'Tutela delle terre e risorse tradizionali', 'Consenso libero, previo e informato'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Sistema interamericano', caso: 'Applicazione giurisprudenziale', testo: 'La Corte interamericana dei diritti umani ha richiamato i principi della Dichiarazione per tutelare il diritto delle comunità indigene alle terre ancestrali.', link: 'https://www.un.org' },
        ],
      },
      {
        nome: 'Dichiarazione di Vienna (1993)',
        def: `Adottata alla Conferenza mondiale sui diritti umani di Vienna. Riafferma l'universalità, l'indivisibilità e l'interdipendenza di tutti i diritti umani, superando la contrapposizione tra diritti civili-politici ed economici-sociali. Ha portato all'istituzione dell'Alto Commissariato ONU per i diritti umani.`,
        esempi: ['Universalità e indivisibilità dei diritti umani', 'Diritti umani come legittima preoccupazione internazionale', 'Istituzione dell\'Alto Commissariato ONU'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Programma d\'azione di Vienna', caso: 'Effetti istituzionali', testo: 'La Conferenza raccomandò la creazione dell\'Alto Commissario per i diritti umani, istituito dall\'Assemblea Generale con Ris. 48/141 nel 1993.', link: 'https://www.ohchr.org' },
        ],
      },
      {
        nome: 'Dichiarazione del Millennio (2000)',
        def: `Risoluzione 55/2 dell'Assemblea Generale ONU. Fissa valori e obiettivi comuni per il XXI secolo e dà origine agli Obiettivi di Sviluppo del Millennio (MDGs), poi evoluti negli Obiettivi di Sviluppo Sostenibile (Agenda 2030).`,
        esempi: ['Lotta alla povertà estrema', 'Sviluppo sostenibile', 'Pace, sicurezza e disarmo', 'Tutela dei diritti umani e della democrazia'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Agenda 2030', caso: 'Evoluzione degli obiettivi', testo: 'Gli Obiettivi del Millennio sono confluiti nei 17 Obiettivi di Sviluppo Sostenibile adottati con la Ris. 70/1 del 2015.', link: 'https://www.un.org' },
        ],
      },
      {
        nome: 'Dichiarazione sulla violenza contro le donne (1993)',
        def: `Risoluzione 48/104 dell'Assemblea Generale ONU. Primo strumento internazionale che definisce e affronta la violenza di genere come violazione dei diritti umani, anche quando commessa nella sfera privata.`,
        esempi: ['Violenza fisica, sessuale e psicologica', 'Responsabilità degli Stati (due diligence)', 'Violenza nella sfera familiare e pubblica'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Convenzione di Istanbul (2011)', caso: 'Seguito vincolante', testo: 'I principi della Dichiarazione hanno trovato veste pattizia nella Convenzione del Consiglio d\'Europa sulla prevenzione e la lotta alla violenza contro le donne.', link: 'https://www.coe.int' },
        ],
      },
      {
        nome: 'Dichiarazione di Filadelfia (1944)',
        def: `Adottata dall'Organizzazione Internazionale del Lavoro (OIL), ridefinisce fini e principi dell'Organizzazione. Afferma che "il lavoro non è una merce" e che povertà e ingiustizia sociale minacciano la pace ovunque si manifestino.`,
        esempi: ['Il lavoro non è una merce', 'Libertà di espressione e associazione', 'Diritto al benessere materiale e allo sviluppo'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Costituzione OIL', caso: 'Integrazione nei principi OIL', testo: 'La Dichiarazione è allegata alla Costituzione dell\'OIL e ne costituisce parte integrante, ispirando le convenzioni internazionali sul lavoro.', link: 'https://www.ilo.org' },
        ],
      },
    ],
  },
  {
    id: 'trattati',
    label: 'I trattati più importanti',
    sub: 'Convenzioni e patti fondamentali',
    colore: '#38bdf8',
    icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    voci: [
      {
        nome: 'Carta delle Nazioni Unite (1945)',
        def: `Firmata a San Francisco il 26 giugno 1945, è il trattato istitutivo dell'ONU. Fissa i fini dell'Organizzazione (mantenimento della pace, cooperazione, diritti umani), la struttura degli organi e il divieto dell'uso della forza.`,
        esempi: ['Art. 2.4 — Divieto dell\'uso della forza', 'Art. 51 — Legittima difesa', 'Cap. VII — Azioni del Consiglio di Sicurezza', 'Art. 103 — Prevalenza degli obblighi della Carta'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, Nicaragua c. USA (1986)', caso: 'Divieto dell\'uso della forza e legittima difesa', testo: 'L\'art. 51 ammette la legittima difesa solo in risposta a un attacco armato; le misure devono essere necessarie e proporzionate.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Convenzione di Vienna sul diritto dei trattati (1969)',
        def: `Codifica le regole consuetudinarie sulla formazione, validità, interpretazione, efficacia ed estinzione dei trattati. È il "trattato sui trattati", riferimento fondamentale del diritto internazionale pattizio.`,
        esempi: ['Art. 26 — Pacta sunt servanda', 'Art. 31-32 — Interpretazione in buona fede', 'Art. 53 — Ius cogens', 'Art. 62 — Mutamento fondamentale delle circostanze'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, Gabčíkovo-Nagymaros (1997)', caso: 'Applicazione delle regole di Vienna', testo: 'La Corte applica gli artt. 60-62 della Convenzione come espressione di diritto consuetudinario in materia di estinzione e sospensione dei trattati.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Convenzione Europea dei Diritti dell\'Uomo (1950)',
        def: `Firmata a Roma nel 1950 nell'ambito del Consiglio d'Europa. Principale strumento di protezione dei diritti fondamentali in Europa, garantito dalla Corte EDU di Strasburgo. In Italia ha rango subcostituzionale (norma interposta ex art. 117 Cost.).`,
        esempi: ['Art. 2 — Diritto alla vita', 'Art. 3 — Divieto di tortura', 'Art. 6 — Equo processo', 'Art. 8 — Vita privata e familiare'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'Corte EDU, Soering c. Regno Unito (1989)', caso: 'Divieto di estradizione e art. 3', testo: 'L\'estradizione verso uno Stato in cui l\'interessato rischia trattamenti inumani (corridoio della morte) viola l\'art. 3 CEDU.', link: 'https://hudoc.echr.coe.int' },
          { n: 'Corte Cost. nn. 348-349/2007', caso: 'Rango della CEDU in Italia', testo: 'La CEDU è norma interposta: una legge ordinaria con essa contrastante è incostituzionale per violazione dell\'art. 117 Cost.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2007&numero=348' },
        ],
      },
      {
        nome: 'Patti delle Nazioni Unite (1966)',
        def: `I due Patti adottati dall'Assemblea Generale nel 1966 rendono vincolanti i principi della Dichiarazione Universale: il Patto sui diritti civili e politici e il Patto sui diritti economici, sociali e culturali. Entrati in vigore nel 1976.`,
        esempi: ['Patto sui diritti civili e politici (ICCPR)', 'Patto sui diritti economici, sociali e culturali (ICESCR)', 'Comitato dei diritti umani (organo di controllo)'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Comitato dei diritti umani ONU', caso: 'Controllo sull\'attuazione del Patto', testo: 'Il Comitato esamina i rapporti periodici degli Stati e le comunicazioni individuali, adottando "osservazioni" sulla conformità delle condotte statali.', link: 'https://www.ohchr.org' },
        ],
      },
      {
        nome: 'Convenzioni di Ginevra (1949)',
        def: `Le quattro Convenzioni di Ginevra del 1949 e i Protocolli aggiuntivi costituiscono il nucleo del diritto internazionale umanitario (ius in bello): proteggono feriti, naufraghi, prigionieri di guerra e popolazione civile durante i conflitti armati.`,
        esempi: ['Tutela dei feriti e malati', 'Trattamento dei prigionieri di guerra', 'Protezione dei civili', 'Art. 3 comune — conflitti non internazionali'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, Nicaragua c. USA (1986)', caso: 'Art. 3 comune come standard minimo', testo: 'L\'art. 3 comune alle Convenzioni esprime considerazioni elementari di umanità applicabili in ogni conflitto armato, anche non internazionale.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Statuto di Roma della CPI (1998)',
        def: `Istituisce la Corte Penale Internazionale (CPI), competente a giudicare i crimini internazionali più gravi commessi dagli individui. È entrato in vigore nel 2002. Opera secondo il principio di complementarità rispetto alle giurisdizioni nazionali.`,
        esempi: ['Genocidio', 'Crimini contro l\'umanità', 'Crimini di guerra', 'Crimine di aggressione'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Principio di complementarità', caso: 'Rapporto con le giurisdizioni nazionali', testo: 'La CPI interviene solo quando lo Stato competente non vuole o non può effettivamente svolgere le indagini o il processo.', link: 'https://www.icc-cpi.int' },
        ],
      },
      {
        nome: 'Convenzione sul diritto del mare (1982)',
        def: `Convenzione di Montego Bay (UNCLOS). Disciplina in modo organico gli spazi marini: mare territoriale, zona economica esclusiva, piattaforma continentale, alto mare e fondali oltre la giurisdizione nazionale.`,
        esempi: ['Mare territoriale (12 miglia)', 'Zona economica esclusiva (200 miglia)', 'Piattaforma continentale', 'Libertà dell\'alto mare'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'Tribunale del diritto del mare (ITLOS)', caso: 'Soluzione delle controversie marittime', testo: 'L\'UNCLOS prevede un sistema obbligatorio di soluzione delle controversie affidato a ITLOS, CIG o tribunali arbitrali.', link: 'https://www.itlos.org' },
        ],
      },
      {
        nome: 'Convenzione sui diritti del fanciullo (1989)',
        def: `Adottata dall'Assemblea Generale ONU, è il trattato sui diritti umani più ratificato al mondo. Riconosce il minore come titolare autonomo di diritti e pone il superiore interesse del minore al centro di ogni decisione.`,
        esempi: ['Superiore interesse del minore', 'Diritto all\'ascolto', 'Tutela contro lo sfruttamento', 'Diritto all\'identità e alla famiglia'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Comitato sui diritti del fanciullo', caso: 'Organo di controllo', testo: 'Il Comitato vigila sull\'attuazione della Convenzione esaminando i rapporti degli Stati e adottando commenti generali interpretativi.', link: 'https://www.ohchr.org' },
        ],
      },
      {
        nome: 'Convenzione sul genocidio (1948)',
        def: `Convenzione per la prevenzione e la repressione del crimine di genocidio, adottata dall'Assemblea Generale ONU il giorno prima della Dichiarazione Universale. Definisce il genocidio e impone agli Stati obblighi di prevenzione e punizione. Le sue norme sono considerate ius cogens.`,
        esempi: ['Definizione di genocidio (art. II)', 'Obbligo di prevenzione e punizione', 'Genocidio come crimine internazionale'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, Bosnia c. Serbia (2007)', caso: 'Obbligo di prevenire il genocidio', testo: 'Gli Stati hanno l\'obbligo di fare quanto in loro potere per prevenire il genocidio: la Serbia ha violato tale obbligo in relazione a Srebrenica.', link: 'https://www.icj-cij.org' },
          { n: 'CIG, parere riserve (1951)', caso: 'Riserve ai trattati sui diritti umani', testo: 'Uno Stato può formulare riserve compatibili con l\'oggetto e lo scopo della Convenzione: principio poi codificato nella Convenzione di Vienna.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Convenzione di Ginevra sui rifugiati (1951)',
        def: `Definisce lo status di rifugiato e i diritti delle persone che fuggono da persecuzioni. Cardine del diritto internazionale dei rifugiati, completata dal Protocollo di New York del 1967. Sancisce il principio di non-refoulement.`,
        esempi: ['Definizione di rifugiato', 'Principio di non-refoulement (art. 33)', 'Divieto di sanzioni per ingresso irregolare'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Principio di non-refoulement', caso: 'Divieto di respingimento', testo: 'Nessuno Stato può espellere o respingere un rifugiato verso un territorio in cui la sua vita o libertà sarebbero minacciate: norma oggi consuetudinaria.', link: 'https://www.unhcr.org' },
        ],
      },
      {
        nome: 'Convenzione di Vienna sulle relazioni diplomatiche (1961)',
        def: `Codifica il diritto consuetudinario sulle relazioni diplomatiche tra Stati. Disciplina le funzioni delle missioni diplomatiche, le immunità e i privilegi degli agenti diplomatici e l'inviolabilità delle sedi.`,
        esempi: ['Inviolabilità della sede diplomatica', 'Immunità dalla giurisdizione penale', 'Valigia diplomatica', 'Persona non grata'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, Personale diplomatico USA a Teheran (1980)', caso: 'Inviolabilità delle missioni', testo: 'L\'Iran ha violato gli obblighi della Convenzione non proteggendo l\'ambasciata e il personale statunitense durante la crisi degli ostaggi.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Convenzione contro la tortura (1984)',
        def: `Convenzione ONU contro la tortura e altri trattamenti o pene crudeli, inumani o degradanti (CAT). Definisce la tortura, impone agli Stati di prevenirla e perseguirla e introduce il principio di giurisdizione universale per questo crimine.`,
        esempi: ['Definizione di tortura (art. 1)', 'Divieto assoluto e inderogabile', 'Giurisdizione universale', 'Comitato contro la tortura (CAT)'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Divieto di tortura come ius cogens', caso: 'Natura della norma', testo: 'Il divieto di tortura ha carattere assoluto e inderogabile: nessuna circostanza eccezionale può essere invocata per giustificarla.', link: 'https://www.ohchr.org' },
        ],
      },
      {
        nome: 'Trattato di non proliferazione nucleare (1968)',
        def: `Il TNP è il principale strumento per limitare la diffusione delle armi nucleari. Si fonda su tre pilastri: non proliferazione, disarmo e uso pacifico dell'energia nucleare. È sottoposto al controllo dell'AIEA.`,
        esempi: ['Non proliferazione delle armi nucleari', 'Obbligo di disarmo (art. VI)', 'Uso pacifico dell\'energia nucleare', 'Controlli dell\'AIEA'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, parere armi nucleari (1996)', caso: 'Liceità della minaccia e dell\'uso', testo: 'L\'uso delle armi nucleari è generalmente contrario al diritto internazionale umanitario; esiste un obbligo di negoziare in buona fede il disarmo nucleare.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Accordo di Parigi sul clima (2015)',
        def: `Adottato nell'ambito della Convenzione quadro ONU sui cambiamenti climatici (UNFCCC). Impegna gli Stati a contenere l'aumento della temperatura globale ben al di sotto dei 2°C, puntando a 1,5°C, tramite contributi determinati a livello nazionale (NDC).`,
        esempi: ['Obiettivo +1,5°C / ben sotto +2°C', 'Contributi nazionali (NDC)', 'Responsabilità comuni ma differenziate', 'Meccanismo di revisione periodica'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Principio di precauzione', caso: 'Fondamento dell\'azione climatica', testo: 'L\'Accordo si fonda sul principio di precauzione e sullo sviluppo sostenibile, già affermati nella Dichiarazione di Rio del 1992.', link: 'https://unfccc.int' },
        ],
      },
      {
        nome: 'Convenzione di Vienna sulle relazioni consolari (1963)',
        def: `Codifica il diritto consuetudinario sulle relazioni consolari, parallela a quella sulle relazioni diplomatiche del 1961. Disciplina funzioni, immunità e privilegi dei consoli e, in particolare, il diritto dello straniero arrestato a comunicare con il proprio consolato.`,
        esempi: ['Funzioni consolari (assistenza ai cittadini)', 'Immunità funzionale dei consoli', 'Art. 36 — notifica consolare allo straniero arrestato', 'Inviolabilità degli archivi consolari'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, LaGrand (2001)', caso: 'Diritto alla notifica consolare', testo: 'L\'art. 36 attribuisce diritti individuali allo straniero arrestato; gli USA hanno violato la Convenzione non informando i fratelli LaGrand del diritto all\'assistenza consolare.', link: 'https://www.icj-cij.org' },
          { n: 'CIG, Avena (2004)', caso: 'Rimedi per la violazione', testo: 'La Corte impone agli USA il riesame delle condanne di 51 cittadini messicani pronunciate in violazione del diritto alla notifica consolare.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Convenzione contro la discriminazione razziale (1965)',
        def: `La CERD (International Convention on the Elimination of All Forms of Racial Discrimination) è il primo grande trattato ONU sui diritti umani a vocazione universale. Vieta ogni distinzione fondata su razza, colore, ascendenza o origine nazionale ed etnica, istituendo un apposito Comitato di controllo (CERD).`,
        esempi: ['Divieto di discriminazione razziale', 'Obbligo di misure positive', 'Divieto di propaganda razzista', 'Comitato CERD e ricorsi interstatali'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, Georgia c. Russia (2011)', caso: 'Condizioni di accesso alla Corte', testo: 'La clausola compromissoria della CERD richiede il previo esperimento delle procedure di negoziato e davanti al Comitato prima del ricorso alla CIG.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Convenzione contro la discriminazione delle donne (1979)',
        def: `La CEDAW (Convention on the Elimination of All Forms of Discrimination Against Women) è la "carta dei diritti delle donne". Impone agli Stati di eliminare ogni discriminazione di genere in ambito politico, economico, sociale e familiare, con un Protocollo opzionale (1999) che ammette ricorsi individuali.`,
        esempi: ['Eliminazione della discriminazione di genere', 'Misure speciali temporanee (azioni positive)', 'Parità in famiglia e lavoro', 'Comitato CEDAW e Protocollo opzionale'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Comitato CEDAW', caso: 'Controllo e raccomandazioni', testo: 'Il Comitato esamina i rapporti statali e le comunicazioni individuali; con la Raccomandazione gen. n. 19 ha qualificato la violenza di genere come forma di discriminazione.', link: 'https://www.ohchr.org' },
        ],
      },
      {
        nome: 'Convenzione sui diritti delle persone con disabilità (2006)',
        def: `La CRPD segna il passaggio dal modello medico-assistenziale al modello sociale della disabilità: la persona disabile è titolare di diritti su base di eguaglianza con gli altri. Impone accessibilità, accomodamento ragionevole e piena partecipazione alla vita sociale.`,
        esempi: ['Modello sociale della disabilità', 'Accomodamento ragionevole', 'Accessibilità e vita indipendente', 'Capacità giuridica su base di eguaglianza'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Comitato CRPD', caso: 'Organo di controllo', testo: 'Il Comitato vigila sull\'attuazione della Convenzione tramite rapporti periodici, comunicazioni individuali e commenti generali interpretativi.', link: 'https://www.ohchr.org' },
        ],
      },
      {
        nome: 'Patto Briand-Kellogg (1928)',
        def: `Patto generale di rinuncia alla guerra, sottoscritto a Parigi. Per la prima volta gli Stati rinunciano alla guerra come strumento di politica nazionale. Pur privo di efficaci meccanismi di garanzia, ha posto le basi del divieto dell'uso della forza poi sancito dalla Carta ONU.`,
        esempi: ['Rinuncia alla guerra come strumento politico', 'Soluzione pacifica delle controversie', 'Precedente dell\'art. 2.4 della Carta ONU'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'Processo di Norimberga (1946)', caso: 'Crimini contro la pace', testo: 'Il Tribunale di Norimberga richiama il Patto come fondamento dell\'illiceità della guerra di aggressione e della responsabilità penale individuale per crimini contro la pace.', link: 'https://www.un.org' },
        ],
      },
      {
        nome: 'Convenzioni dell\'Aja (1899 e 1907)',
        def: `Adottate dalle Conferenze internazionali della pace dell'Aja, codificano le leggi e gli usi della guerra terrestre (ius in bello) e i mezzi di soluzione pacifica delle controversie. Costituiscono, insieme alle Convenzioni di Ginevra, il nucleo del diritto bellico.`,
        esempi: ['Leggi e usi della guerra terrestre', 'Clausola Martens (umanità e coscienza pubblica)', 'Istituzione della Corte permanente di arbitrato', 'Divieto di mezzi che causano mali superflui'],
        rifLabel: 'Giurisprudenza',
        rif: [
          { n: 'CIG, parere armi nucleari (1996)', caso: 'Principi cardine dello ius in bello', testo: 'La Corte richiama il diritto dell\'Aja per i principi di distinzione tra combattenti e civili e di divieto di causare sofferenze inutili.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Convenzione di Palermo sul crimine organizzato (2000)',
        def: `Convenzione ONU contro la criminalità organizzata transnazionale (UNTOC), aperta alla firma a Palermo. Principale strumento di cooperazione internazionale contro le mafie, completata da tre Protocolli (tratta di persone, traffico di migranti, armi da fuoco).`,
        esempi: ['Definizione di gruppo criminale organizzato', 'Protocollo sulla tratta di esseri umani', 'Protocollo sul traffico di migranti', 'Cooperazione giudiziaria ed estradizione'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Protocolli di Palermo', caso: 'Estensione della Convenzione', testo: 'I tre Protocolli addizionali estendono la cooperazione alla tratta di persone, al traffico di migranti e alla fabbricazione e traffico illeciti di armi da fuoco.', link: 'https://www.unodc.org' },
        ],
      },
      {
        nome: 'Convenzione ONU contro la corruzione (2003)',
        def: `La UNCAC (Convenzione di Merida) è il primo strumento globale giuridicamente vincolante contro la corruzione. Impone agli Stati misure di prevenzione, incriminazione, cooperazione internazionale e recupero dei beni (asset recovery).`,
        esempi: ['Prevenzione e incriminazione della corruzione', 'Recupero dei beni (asset recovery)', 'Cooperazione internazionale', 'Trasparenza della pubblica amministrazione'],
        rifLabel: 'Riferimenti',
        rif: [
          { n: 'Meccanismo di riesame UNCAC', caso: 'Controllo sull\'attuazione', testo: 'Un meccanismo tra pari (peer review) verifica l\'attuazione della Convenzione da parte degli Stati membri, individuando buone pratiche e carenze.', link: 'https://www.unodc.org' },
        ],
      },
    ],
  },
  {
    id: 'sentenze',
    label: 'Le sentenze',
    sub: 'CIG · CEDU · giurisprudenza italiana',
    colore: '#22c55e',
    icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M9 13l2 2 4-4"/>',
    voci: [
      {
        nome: 'Corte Internazionale di Giustizia (CIG)',
        def: `Organo giudiziario principale dell'ONU, con sede all'Aja. Decide le controversie tra Stati (giurisdizione fondata sul consenso) e rende pareri consultivi. Le sue sentenze hanno contribuito in modo decisivo alla formazione del diritto internazionale generale.`,
        esempi: ['Giurisdizione fondata sul consenso degli Stati', 'Sentenze vincolanti tra le parti', 'Pareri consultivi su richiesta degli organi ONU'],
        rifLabel: 'Sentenze chiave',
        rif: [
          { n: 'Nicaragua c. USA (1986)', caso: 'Uso della forza e non ingerenza', testo: 'Distingue le norme consuetudinarie dalle norme pattizie sul divieto dell\'uso della forza e afferma il principio di non ingerenza negli affari interni.', link: 'https://www.icj-cij.org' },
          { n: 'Barcelona Traction (1970)', caso: 'Obblighi erga omnes', testo: 'Introduce la categoria degli obblighi verso la comunità internazionale nel suo complesso, alla cui tutela tutti gli Stati hanno interesse giuridico.', link: 'https://www.icj-cij.org' },
          { n: 'CPGI, Lotus (1927)', caso: 'Sovranità e libertà degli Stati', testo: 'In assenza di norma proibitiva, gli Stati restano liberi: pietra angolare del diritto internazionale classico imperniato sulla sovranità.', link: 'https://www.icj-cij.org' },
          { n: 'Canale di Corfù (1949)', caso: 'Prima sentenza della CIG', testo: 'L\'Albania è responsabile per i danni alle navi britanniche: ogni Stato ha l\'obbligo di non lasciare utilizzare il proprio territorio per atti lesivi dei diritti altrui.', link: 'https://www.icj-cij.org' },
          { n: 'Piattaforma continentale Mare del Nord (1969)', caso: 'Formazione della consuetudine', testo: 'Una norma pattizia può trasformarsi in consuetudine solo con una prassi estesa, uniforme e accompagnata da opinio iuris: l\'equidistanza non era ancora consuetudinaria.', link: 'https://www.icj-cij.org' },
          { n: 'Personale diplomatico USA a Teheran (1980)', caso: 'Inviolabilità diplomatica', testo: 'L\'Iran ha violato gli obblighi sulle relazioni diplomatiche e consolari non proteggendo l\'ambasciata e il personale statunitense durante la crisi degli ostaggi.', link: 'https://www.icj-cij.org' },
          { n: 'Mandato d\'arresto (RDC c. Belgio, 2002)', caso: 'Immunità dei ministri in carica', testo: 'Il Ministro degli esteri in carica gode di immunità penale assoluta dalla giurisdizione straniera, anche per crimini internazionali, finché resta in carica.', link: 'https://www.icj-cij.org' },
          { n: 'Gabčíkovo-Nagymaros (1997)', caso: 'Diritto dei trattati e ambiente', testo: 'Applica le regole di Vienna su estinzione e sospensione e valorizza lo sviluppo sostenibile nella gestione delle risorse idriche condivise.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Corte EDU (Strasburgo)',
        def: `La Corte europea dei diritti dell'uomo giudica i ricorsi per violazione della CEDU. Le sue sentenze, vincolanti per gli Stati condannati, hanno avuto profondo impatto sugli ordinamenti interni, Italia compresa.`,
        esempi: ['Ricorsi individuali e statali', 'Sentenze vincolanti per lo Stato condannato', 'Margine di apprezzamento degli Stati'],
        rifLabel: 'Sentenze chiave',
        rif: [
          { n: 'Soering c. Regno Unito (1989)', caso: 'Estradizione e divieto di tortura', testo: 'L\'estradizione verso uno Stato in cui si rischiano trattamenti inumani viola l\'art. 3 CEDU.', link: 'https://hudoc.echr.coe.int' },
          { n: 'Scoppola c. Italia (2009)', caso: 'Legge penale più favorevole', testo: 'L\'art. 7 CEDU comprende il diritto all\'applicazione della pena più mite sopravvenuta.', link: 'https://hudoc.echr.coe.int' },
          { n: 'Hirsi Jamaa c. Italia (2012)', caso: 'Respingimenti in alto mare', testo: 'I respingimenti collettivi di migranti verso la Libia violano il divieto di trattamenti inumani, di espulsioni collettive e il principio di non-refoulement (art. 3 e Prot. 4).', link: 'https://hudoc.echr.coe.int' },
          { n: 'Torreggiani c. Italia (2013)', caso: 'Sovraffollamento carcerario', testo: 'Sentenza "pilota": il sovraffollamento delle carceri italiane costituisce trattamento inumano e degradante (art. 3) e impone misure strutturali allo Stato.', link: 'https://hudoc.echr.coe.int' },
          { n: 'Lautsi c. Italia (2011)', caso: 'Crocifisso nelle aule', testo: 'La Grande Camera riconosce un ampio margine di apprezzamento allo Stato: l\'esposizione del crocifisso non viola di per sé la libertà religiosa e il diritto all\'istruzione.', link: 'https://hudoc.echr.coe.int' },
          { n: 'M.S.S. c. Belgio e Grecia (2011)', caso: 'Trasferimenti Dublino', testo: 'Il trasferimento di un richiedente asilo verso uno Stato con un sistema d\'accoglienza carente può violare l\'art. 3 CEDU.', link: 'https://hudoc.echr.coe.int' },
        ],
      },
      {
        nome: 'Tribunali penali internazionali (TPIY, TPIR, CPI)',
        def: `La giustizia penale internazionale persegue la responsabilità individuale per i crimini più gravi. Dai processi di Norimberga e Tokyo ai tribunali ad hoc per l'ex Jugoslavia (TPIY) e il Ruanda (TPIR), fino alla Corte Penale Internazionale (CPI), permanente, istituita con lo Statuto di Roma.`,
        esempi: ['Responsabilità penale individuale', 'Irrilevanza della qualifica ufficiale', 'Genocidio, crimini contro l\'umanità, crimini di guerra', 'Principio di complementarità (CPI)'],
        rifLabel: 'Sentenze chiave',
        rif: [
          { n: 'TPIY, Tadić (1995)', caso: 'Competenza e nozione di conflitto armato', testo: 'Il Tribunale afferma la propria competenza e definisce i criteri per distinguere conflitti armati internazionali e interni, estendendo le garanzie umanitarie.', link: 'https://www.icty.org' },
          { n: 'TPIR, Akayesu (1998)', caso: 'Prima condanna per genocidio', testo: 'Prima sentenza che applica la Convenzione sul genocidio, qualificando anche la violenza sessuale come atto di genocidio.', link: 'https://unictr.irmct.org' },
          { n: 'TPIY, Furundžija (1998)', caso: 'Tortura come ius cogens', testo: 'Il divieto di tortura ha rango di norma imperativa, gerarchicamente superiore alle norme pattizie e consuetudinarie ordinarie.', link: 'https://www.icty.org' },
          { n: 'CPI, Lubanga (2012)', caso: 'Prima condanna della CPI', testo: 'Prima sentenza della Corte Penale Internazionale: condanna per il crimine di guerra di arruolamento e impiego di bambini soldato.', link: 'https://www.icc-cpi.int' },
        ],
      },
      {
        nome: 'Pareri consultivi della CIG',
        def: `Oltre alle controversie tra Stati, la Corte Internazionale di Giustizia rende pareri consultivi su richiesta dell'Assemblea Generale, del Consiglio di Sicurezza o di altri organi e agenzie ONU. Pur non vincolanti, hanno grande autorità nella ricostruzione del diritto internazionale generale.`,
        esempi: ['Richiesti da organi e agenzie ONU', 'Non vincolanti ma autorevoli', 'Ricostruzione del diritto consuetudinario'],
        rifLabel: 'Pareri chiave',
        rif: [
          { n: 'Riserve alla Convenzione sul genocidio (1951)', caso: 'Riserve ai trattati sui diritti umani', testo: 'Uno Stato può formulare riserve compatibili con l\'oggetto e lo scopo del trattato: criterio poi codificato nella Convenzione di Vienna.', link: 'https://www.icj-cij.org' },
          { n: 'Namibia (1971)', caso: 'Effetti delle risoluzioni ONU', testo: 'La presenza sudafricana in Namibia è illegittima: le decisioni del Consiglio di Sicurezza sono obbligatorie per tutti gli Stati membri.', link: 'https://www.icj-cij.org' },
          { n: 'Sahara Occidentale (1975)', caso: 'Autodeterminazione dei popoli', testo: 'Il principio di autodeterminazione si applica ai territori non autonomi: decisiva è la volontà liberamente espressa del popolo.', link: 'https://www.icj-cij.org' },
          { n: 'Liceità delle armi nucleari (1996)', caso: 'Uso della forza e ius in bello', testo: 'L\'uso delle armi nucleari è generalmente contrario al diritto umanitario; permane l\'obbligo di negoziare in buona fede il disarmo nucleare.', link: 'https://www.icj-cij.org' },
          { n: 'Muro in Palestina (2004)', caso: 'Occupazione e diritto umanitario', testo: 'La costruzione del muro nei territori palestinesi occupati viola il diritto internazionale umanitario e i diritti umani; Israele deve cessarne la costruzione e riparare.', link: 'https://www.icj-cij.org' },
          { n: 'Dichiarazione d\'indipendenza del Kosovo (2010)', caso: 'Secessione e diritto internazionale', testo: 'La dichiarazione unilaterale d\'indipendenza del Kosovo non viola, in sé, alcuna norma di diritto internazionale generale.', link: 'https://www.icj-cij.org' },
        ],
      },
      {
        nome: 'Immunità degli Stati (giurisprudenza italiana)',
        def: `Il tema dell'immunità degli Stati stranieri dalla giurisdizione ha generato un dialogo (e un conflitto) tra giudici italiani e CIG, culminato nella teoria dei controlimiti come limite alla consuetudine internazionale.`,
        esempi: ['Immunità ristretta (atti iure imperii / iure gestionis)', 'Crimini internazionali e immunità', 'Controlimiti e art. 24 Cost.'],
        rifLabel: 'Sentenze chiave',
        rif: [
          { n: 'Cass. SS.UU., Ferrini (2004)', caso: 'Crimini internazionali e immunità', testo: 'L\'immunità dello Stato estero non opera per i crimini internazionali: la tutela dei diritti fondamentali prevale sulla regola dell\'immunità.', link: 'https://www.italgiure.giustizia.it' },
          { n: 'CIG, Germania c. Italia (2012)', caso: 'Immunità giurisdizionale dello Stato', testo: 'L\'Italia ha violato l\'immunità della Germania: la regola consuetudinaria sull\'immunità non conosce eccezioni per i crimini, anche gravi.', link: 'https://www.icj-cij.org' },
          { n: 'Corte Cost. n. 238/2014', caso: 'Controlimiti alla sentenza CIG', testo: 'La norma consuetudinaria sull\'immunità non entra nell\'ordinamento italiano nella parte in cui nega la tutela giurisdizionale (art. 24 Cost.) per i crimini contro l\'umanità.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2014&numero=238' },
        ],
      },
    ],
  },
];

export default function DirittoInternazionale() {
  const [apertoId, setApertoId] = useState<string | null>('fonti');
  const [apertaVoce, setApertaVoce] = useState<string | null>(null);
  const [apertoRif, setApertoRif] = useState<string | null>(null);

  function toggleId(id: string) {
    setApertoId(apertoId === id ? null : id);
    setApertaVoce(null);
    setApertoRif(null);
  }
  function toggleVoce(key: string) {
    setApertaVoce(apertaVoce === key ? null : key);
    setApertoRif(null);
  }
  function toggleRif(key: string) {
    setApertoRif(apertoRif === key ? null : key);
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        .di-app { font-family: 'Montserrat', sans-serif; background: #0a0d18; width: 100%; min-height: 100vh; }
        .di-feed { min-height: 100vh; padding: 20px 16px 140px; }
        a { text-decoration: none; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        @media (min-width: 768px) { .di-feed { padding: 32px 40px 140px; } }
        @media (min-width: 1024px) { .di-feed { padding: 40px 80px 140px; } }
        @media (min-width: 1280px) { .di-feed { padding: 40px 120px 140px; } }
      `}</style>

      <div className="di-app">
        <Header />
        <div className="di-feed">

          {/* TITOLO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Diritto Internazionale</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 10, letterSpacing: -0.5 }}>Fonti, dichiarazioni, trattati e sentenze</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              Tocca una sezione per scoprire le voci, le definizioni e i riferimenti. Materiale basato sul manuale Conforti-Iovane.
            </div>
          </div>

          {/* LISTA */}
          {sezioni.map((f) => {
            const isOpen = apertoId === f.id;
            return (
              <div key={f.id} style={{ marginBottom: 6 }}>

                {/* HEADER SEZIONE */}
                <button
                  onClick={() => toggleId(f.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'stretch', borderRadius: 12, overflow: 'hidden', border: 'none', cursor: 'pointer', padding: 0, background: 'transparent' }}
                >
                  <div style={{ width: 4, background: f.colore, flexShrink: 0 }} />
                  <div style={{ background: '#111526', width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={f.colore} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                      dangerouslySetInnerHTML={{ __html: f.icon }} />
                  </div>
                  <div style={{ background: '#111526', padding: '12px 14px 12px 0', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: 0 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{f.label}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, textAlign: 'left' }}>{f.sub}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 14, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{f.voci.length}</span>
                      <div style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </button>

                {/* VOCI */}
                {isOpen && (
                  <div style={{ marginTop: 4, paddingLeft: 4 }}>
                    {f.voci.map((sub, si) => {
                      const subKey = `${f.id}-${si}`;
                      const isSubOpen = apertaVoce === subKey;
                      return (
                        <div key={si} style={{ background: '#0d1830', borderRadius: 10, marginBottom: 6, overflow: 'hidden', border: `0.5px solid ${isSubOpen ? f.colore + '66' : 'rgba(255,255,255,0.06)'}`, transition: 'border-color 0.15s' }}>

                          <button
                            onClick={() => toggleVoce(subKey)}
                            style={{ width: '100%', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', gap: 8 }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', flex: 1, textAlign: 'left' }}>{sub.nome}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{sub.rif.length}</span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={f.colore} strokeWidth="2"
                                style={{ transform: isSubOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                <path d="M6 9l6 6 6-6"/>
                              </svg>
                            </div>
                          </button>

                          {isSubOpen && (
                            <div style={{ padding: '0 14px 14px' }}>
                              <div style={{ height: 0.5, background: 'rgba(255,255,255,0.06)', marginBottom: 10 }} />

                              {/* Definizione */}
                              {sub.def.split('\n').map((r, i) => (
                                r.trim()
                                  ? <p key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 6 }}
                                      dangerouslySetInnerHTML={{ __html: r.replace(/•/g, `<span style="color:${f.colore}">•</span>`) }} />
                                  : <br key={i} />
                              ))}

                              {/* Esempi */}
                              {sub.esempi && sub.esempi.length > 0 && (
                                <>
                                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: f.colore, textTransform: 'uppercase', margin: '12px 0 8px' }}>Esempi</div>
                                  {sub.esempi.map((e, ei) => (
                                    <div key={ei} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
                                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: f.colore, flexShrink: 0, marginTop: 6 }} />
                                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{e}</span>
                                    </div>
                                  ))}
                                </>
                              )}

                              {/* Riferimenti */}
                              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: f.colore, textTransform: 'uppercase', margin: '14px 0 8px' }}>{sub.rifLabel}</div>
                              {sub.rif.map((s, senti) => {
                                const rifKey = `${subKey}-${senti}`;
                                const isRifOpen = apertoRif === rifKey;
                                return (
                                  <div key={senti} style={{ border: `0.5px solid ${isRifOpen ? f.colore + '66' : 'rgba(255,255,255,0.07)'}`, borderRadius: 8, marginBottom: 6, overflow: 'hidden', transition: 'border-color 0.15s' }}>
                                    <button
                                      onClick={() => toggleRif(rifKey)}
                                      style={{ width: '100%', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'transparent', border: 'none', cursor: 'pointer', gap: 8 }}
                                    >
                                      <div style={{ flex: 1, textAlign: 'left' }}>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: f.colore, marginBottom: 2 }}>{s.n}</div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{s.caso}</div>
                                      </div>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={f.colore} strokeWidth="2"
                                        style={{ transform: isRifOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, marginTop: 2 }}>
                                        <path d="M6 9l6 6 6-6"/>
                                      </svg>
                                    </button>
                                    {isRifOpen && (
                                      <div style={{ padding: '0 12px 12px' }}>
                                        <div style={{ height: 0.5, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
                                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 8 }}>«{s.testo}»</p>
                                        <a href={s.link} target="_blank" rel="noreferrer"
                                          style={{ fontSize: 9, fontWeight: 800, color: f.colore, letterSpacing: 1, textTransform: 'uppercase' }}>
                                          Approfondisci →
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>
      <Footer />
    </>
  );
}
