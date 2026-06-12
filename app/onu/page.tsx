'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

const sezioni: Sezione[] = [
  // ── 1. STORIA E CARTA ────────────────────────────────────────────────────────
  {
    id: 'storia',
    titolo: 'Storia e Carta delle Nazioni Unite',
    colore: '#38bdf8',
    bg: 'rgba(56,189,248,0.08)',
    icon: '📜',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "Le Nazioni Unite nascono dalle ceneri della Seconda guerra mondiale. La Carta delle Nazioni Unite viene firmata a San Francisco il 26 giugno 1945 da 51 Stati fondatori ed entra in vigore il 24 ottobre 1945 — data che si celebra ogni anno come Giornata delle Nazioni Unite. Oggi l'ONU conta 193 Stati membri: praticamente tutti i Paesi riconosciuti del mondo.",
      },
      {
        tipo: 'box',
        label: 'La Carta ONU — struttura e valore',
        colore: '#38bdf8',
        contenuto:
          'La Carta è un trattato internazionale vincolante per tutti gli Stati membri. Ha un rango speciale: l\'art. 103 stabilisce che gli obblighi derivanti dalla Carta prevalgono su qualsiasi altro accordo internazionale. È strutturata in 111 articoli e un Preambolo. I principi fondamentali — sovranità degli Stati, divieto dell\'uso della forza, non ingerenza negli affari interni, uguaglianza degli Stati — sono alla base del diritto internazionale contemporaneo.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Prima della Carta: la Società delle Nazioni',
            testo: 'Il predecessore dell\'ONU era la Società delle Nazioni, fondata nel 1919 con il Patto della Società delle Nazioni allegato al Trattato di Versailles. Fallì per tre ragioni: gli USA non vi aderirono mai (il Senato rifiutò la ratifica); non aveva meccanismi coercitivi efficaci; non impedì le aggressioni degli anni \'30 (Etiopia, Cina, Polonia). La sua esperienza negativa informò il disegno istituzionale dell\'ONU.',
            colore: '#f97316',
            badge: 'Precedente storico',
          },
          {
            titolo: 'Dichiarazione delle Nazioni Unite (1942)',
            testo: 'Il termine "Nazioni Unite" fu coniato da Franklin D. Roosevelt. Il 1° gennaio 1942, 26 Paesi alleati nella lotta contro l\'Asse firmarono la "Dichiarazione delle Nazioni Unite": si impegnavano a non concludere pace separata con le potenze nemiche. Fu il primo nucleo di quella che divenne l\'organizzazione.',
            colore: '#38bdf8',
            badge: 'Origine del nome',
          },
          {
            titolo: 'Conferenza di San Francisco (1945)',
            testo: 'Dal 25 aprile al 26 giugno 1945, rappresentanti di 50 Paesi (la Polonia firmò in seguito come 51° membro fondatore) negoziarono e firmarono la Carta. Era ancora in corso la guerra nel Pacifico. L\'URSS, gli USA, il Regno Unito, la Cina e la Francia — le 5 grandi potenze — avevano già concordato le linee generali a Dumbarton Oaks (1944) e a Yalta (febbraio 1945).',
            colore: '#a78bfa',
            badge: 'Fondazione',
          },
          {
            titolo: 'I scopi dell\'ONU (art. 1 Carta)',
            testo: '1) Mantenere la pace e la sicurezza internazionale; 2) sviluppare relazioni amichevoli tra le nazioni basate sul principio dell\'eguaglianza dei diritti e dell\'autodeterminazione dei popoli; 3) promuovere la cooperazione internazionale nella soluzione dei problemi economici, sociali, culturali e umanitari; 4) essere un centro di coordinamento per il raggiungimento di questi fini.',
            colore: '#22c55e',
            badge: 'Art. 1 Carta',
          },
        ],
      },
      {
        tipo: 'highlight',
        colore: '#38bdf8',
        testo: 'Art. 2 par. 4 Carta ONU: "I Membri devono astenersi nelle loro relazioni internazionali dalla minaccia o dall\'uso della forza, sia contro l\'integrità territoriale o l\'indipendenza politica di qualsiasi Stato, sia in qualunque altra maniera incompatibile con i fini delle Nazioni Unite." È la norma fondamentale del diritto internazionale contemporaneo.',
      },
    ],
  },

  // ── 2. ASSEMBLEA GENERALE ───────────────────────────────────────────────────
  {
    id: 'assemblea',
    titolo: 'Assemblea Generale',
    colore: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    icon: '🏛',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "L'Assemblea Generale è l'organo deliberativo principale dell'ONU. Vi partecipano tutti e 193 gli Stati membri, ciascuno con un voto di uguale peso — indipendentemente dalla dimensione, dalla popolazione o dalla potenza economica. Si riunisce in sessione ordinaria ogni anno (settembre–dicembre) e in sessioni speciali o d'emergenza quando necessario.",
      },
      {
        tipo: 'box',
        label: 'Voto: regola della maggioranza',
        colore: '#22c55e',
        contenuto:
          'Per le questioni ordinarie basta la maggioranza semplice. Per le "questioni importanti" — pace e sicurezza, ammissione di nuovi membri, bilancio, modifiche alla Carta — serve la maggioranza dei 2/3 dei presenti e votanti. Non esiste diritto di veto: ogni Stato vale un voto. Le decisioni dell\'AG si chiamano "risoluzioni" e non sono giuridicamente vincolanti per gli Stati, salvo le eccezioni previste dalla Carta (bilancio, ammissione nuovi membri).',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Funzioni principali',
            testo: 'Discute qualsiasi questione rientrante nei fini della Carta; approva il bilancio ONU e le quote di contribuzione degli Stati; elegge i membri non permanenti del Consiglio di Sicurezza, i giudici della CIG, il Segretario Generale (su raccomandazione del CdS); ammette nuovi Stati (su raccomandazione del CdS); promuove la codificazione del diritto internazionale; adotta dichiarazioni e convenzioni internazionali.',
            colore: '#22c55e',
            badge: 'Funzioni',
          },
          {
            titolo: 'Risoluzione "Uniting for Peace" (1950)',
            testo: 'Durante la guerra di Corea, l\'URSS boicottava il CdS. L\'AG adottò la risoluzione 377 che consente all\'AG di riunirsi in sessione d\'emergenza e raccomandare misure collettive (incluso l\'uso della forza) quando il CdS non riesce ad agire per la paralisi del veto. È stata invocata più volte, anche sulla crisi ucraina (2022).',
            colore: '#f97316',
            badge: 'Precedente chiave',
          },
          {
            titolo: 'Dichiarazione Universale dei Diritti Umani (1948)',
            testo: 'Adottata dall\'AG il 10 dicembre 1948 con risoluzione 217(III). Non è un trattato vincolante ma ha acquisito nel tempo valore di norma consuetudinaria internazionale. Enuncia i diritti civili, politici, economici, sociali e culturali di ogni essere umano. È il documento di riferimento da cui derivano tutti i trattati sui diritti umani.',
            colore: '#a78bfa',
            badge: 'UDHR 1948',
          },
          {
            titolo: 'Comitati principali',
            testo: 'L\'AG lavora attraverso 6 comitati principali: 1° (disarmo e sicurezza), 2° (economia e finanza), 3° (questioni sociali, umanitarie e culturali), 4° (politica speciale e decolonizzazione), 5° (amministrativo e di bilancio), 6° (giuridico). Ogni Stato è rappresentato in tutti i comitati.',
            colore: '#38bdf8',
            badge: '6 comitati',
          },
        ],
      },
    ],
  },

  // ── 3. CONSIGLIO DI SICUREZZA ───────────────────────────────────────────────
  {
    id: 'cds',
    titolo: 'Consiglio di Sicurezza',
    colore: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    icon: '🛡',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "Il Consiglio di Sicurezza è l'organo con la responsabilità primaria del mantenimento della pace e della sicurezza internazionale. A differenza dell'AG, le sue risoluzioni vincolanti hanno forza giuridica obbligatoria per tutti gli Stati membri. Opera in sessione permanente e può riunirsi in qualsiasi momento.",
      },
      {
        tipo: 'box',
        label: 'Composizione: P5 + 10 eletti',
        colore: '#f97316',
        contenuto:
          '15 membri totali. 5 permanenti (P5): Stati Uniti, Russia, Cina, Regno Unito, Francia — le potenze vincitrici della Seconda guerra mondiale. 10 non permanenti: eletti dall\'AG per 2 anni a rotazione geografica, non immediatamente rieleggibili. Il P5 riflette la realtà del 1945, non quella contemporanea: né India, né Brasile, né Germania, né Giappone sono rappresentati in modo permanente.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Il diritto di veto',
            testo: 'Su qualsiasi questione sostanziale (non procedurale) ogni membro permanente può bloccare la decisione con il proprio veto. Basta che un solo P5 voti contro per impedire l\'adozione della risoluzione. L\'astensione — per prassi consolidata — non equivale a veto. Il veto è stato usato migliaia di volte: l\'URSS/Russia ne è stata storicamente la maggiore utilizzatrice, poi gli USA (spesso a difesa di Israele).',
            colore: '#f97316',
            badge: 'Meccanismo chiave',
          },
          {
            titolo: 'Capitolo VI — Soluzione pacifica',
            testo: 'Il CdS può invitare le parti a risolvere la controversia con mezzi pacifici, raccomandare procedure o termini di soluzione. Non impone nulla: è la fase del dialogo e della mediazione. Il CdS può anche inviare osservatori o missioni d\'inchiesta.',
            colore: '#22c55e',
            badge: 'Cap. VI',
          },
          {
            titolo: 'Capitolo VII — Azione coercitiva',
            testo: 'Quando il CdS accerta una minaccia alla pace, una violazione della pace o un atto di aggressione, può adottare misure vincolanti: embargo commerciale, sanzioni economiche e finanziarie (art. 41), fino all\'autorizzazione dell\'uso della forza militare (art. 42). Le risoluzioni del Cap. VII sono le più forti del sistema ONU. Esempi: Corea (1950), Kuwait (1990), Somalia (1992), Kosovo (1999 — controverso, senza risoluzione).',
            colore: '#f97316',
            badge: 'Cap. VII',
          },
          {
            titolo: 'Limiti: la paralisi da veto',
            testo: 'Il veto ha spesso paralizzato il CdS nelle crisi più gravi: Ungheria (1956, veto URSS), Vietnam, Afghanistan, Siria (multipli veti Russia/Cina dal 2011), Ucraina (2022, veto Russia). Quando il CdS è paralizzato, la comunità internazionale non ha uno strumento vincolante e le risposte sono frammentate o bilaterali.',
            colore: '#ef4444',
            badge: 'Criticità',
          },
        ],
      },
      {
        tipo: 'confronto',
        coloreLeft: '#22c55e',
        coloreRight: '#ef4444',
        left: {
          label: 'Quando il CdS funziona',
          items: [
            'Unanimità tra P5 su una minaccia chiara',
            'Interessi dei P5 non contrapposti',
            'Crisi in zone non strategiche per i P5',
            'Risoluzioni Cap. VII (Arabia Saudita, Corea del Nord)',
            'Sanzioni e misure non militari',
          ],
        },
        right: {
          label: 'Quando il CdS si blocca',
          items: [
            'Conflitti in cui P5 sono parte o alleati',
            'Crisi Siria, Ucraina: veto Russia',
            'Crisi Gaza: veto USA',
            'Crisi Taiwan: veto Cina',
            'Riforma della composizione (unanimità P5 richiesta)',
          ],
        },
      },
    ],
  },

  // ── 4. SEGRETARIATO ──────────────────────────────────────────────────────────
  {
    id: 'segretariato',
    titolo: 'Segretariato e Segretario Generale',
    colore: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    icon: '🖊',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "Il Segretariato è l'apparato amministrativo delle Nazioni Unite. Gestisce le operazioni quotidiane, prepara studi e rapporti, organizza le conferenze, esegue le decisioni degli organi politici. Ha sede principale a New York, con uffici a Ginevra, Vienna e Nairobi.",
      },
      {
        tipo: 'box',
        label: 'Il Segretario Generale',
        colore: '#a78bfa',
        contenuto:
          'È il "più alto funzionario amministrativo" dell\'ONU (art. 97 Carta). Nominato dall\'AG su raccomandazione del CdS per un mandato di 5 anni rinnovabile una volta. Il P5 ha quindi un veto anche sulla scelta del SG. In pratica il SG viene da un Paese neutrale o di piccole dimensioni, per non scontentare nessun P5. I Segretari Generali: Trygve Lie (Norvegia), Dag Hammarskjöld (Svezia — morto in un incidente aereo in Congo nel 1961), U Thant (Birmania), Kurt Waldheim (Austria), Javier Pérez de Cuéllar (Perù), Boutros Boutros-Ghali (Egitto), Kofi Annan (Ghana — Nobel per la Pace 2001), Ban Ki-moon (Corea del Sud), António Guterres (Portogallo — in carica).',
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Funzioni politiche', testo: 'Può portare all\'attenzione del CdS qualsiasi questione che minacci la pace (art. 99 Carta). Esercita la funzione di "buoni uffici": media tra le parti, avvia negoziati, invia inviati speciali. La forza del SG è soprattutto la moral authority, non poteri formali.' },
          { titolo: 'Indipendenza', testo: 'Il Segretariato deve agire esclusivamente nell\'interesse dell\'ONU: il personale non può ricevere istruzioni da governi nazionali e gli Stati si impegnano a non influenzarlo (art. 100 Carta). In pratica questa indipendenza è solo parziale: le grandi potenze esercitano pressione informalmente.' },
          { titolo: 'Il Segretariato nell\'era moderna', testo: 'Con oltre 44.000 dipendenti internazionali, il Segretariato ha un bilancio biennale di circa 3,1 miliardi di dollari (bilancio ordinario, senza peacekeeping). Le lingue di lavoro sono inglese e francese; le sei lingue ufficiali ONU sono inglese, francese, spagnolo, russo, cinese e arabo.' },
        ],
      },
    ],
  },

  // ── 5. CIG ───────────────────────────────────────────────────────────────────
  {
    id: 'cig',
    titolo: 'Corte Internazionale di Giustizia',
    colore: '#FFD700',
    bg: 'rgba(255,215,0,0.08)',
    icon: '⚖',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "La Corte Internazionale di Giustizia (CIG) è il principale organo giudiziario delle Nazioni Unite. Ha sede all'Aia (Paesi Bassi) e svolge due funzioni: risolvere le controversie tra Stati (funzione contenziosa) e fornire pareri consultivi agli organi ONU (funzione consultiva).",
      },
      {
        tipo: 'box',
        label: 'Composizione',
        colore: '#FFD700',
        contenuto:
          '15 giudici eletti per 9 anni dall\'AG e dal CdS (votazioni parallele e separate, entrambe richiedono la maggioranza assoluta). I giudici sono rieletti ogni 3 anni per 1/3 del collegio. Non possono esserci due giudici della stessa nazionalità. Le 5 grandi potenze hanno quasi sempre un giudice nella Corte. Il presidente è eletto dai giudici per 3 anni. Esiste il meccanismo del giudice ad hoc: se una parte in causa non ha un giudice della propria nazionalità nel collegio, può designarne uno.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Giurisdizione contenziosa — consenso necessario',
            testo: 'Solo gli Stati possono essere parti davanti alla CIG. La Corte ha giurisdizione solo se entrambe le parti acconsentono: con clausola compromissoria in un trattato, con la dichiarazione di accettazione della giurisdizione obbligatoria (clausola facoltativa, art. 36 par. 2 Statuto), o con accordo ad hoc. Le sentenze sono definitive, obbligatorie e non appellabili. Se uno Stato non esegue la sentenza, l\'altra parte può ricorrere al CdS.',
            colore: '#FFD700',
            badge: 'Contenziosa',
          },
          {
            titolo: 'Funzione consultiva',
            testo: 'L\'AG, il CdS e altri organi ONU autorizzati possono chiedere alla CIG un parere consultivo su qualsiasi questione giuridica. I pareri non sono vincolanti ma hanno grande autorità. Esempi: liceità delle armi nucleari (1996), separazione del Kosovo (2010), separazione dell\'arcipelago delle Chagos (2019).',
            colore: '#38bdf8',
            badge: 'Pareri',
          },
          {
            titolo: 'Differenza dalla Corte EDU',
            testo: 'La CIG giudica solo controversie tra Stati; gli individui non hanno accesso diretto. La Corte EDU giudica i ricorsi degli individui contro gli Stati per violazioni della CEDU. Sono due sistemi completamente separati per funzione, base giuridica e soggetti legittimati a ricorrere.',
            colore: '#a78bfa',
            badge: 'Distinzione',
          },
          {
            titolo: 'Casi storici rilevanti',
            testo: 'Nicaragua c. Stati Uniti (1986): condanna degli USA per il sostegno ai Contras e la minatura dei porti nicaraguensi. Bosnia c. Serbia (2007): genocidio di Srebrenica, Serbia condannata per omessa prevenzione. Germania c. Italia (2012): immunità degli Stati per crimini di guerra. Sudafrica c. Israele (2024): misure cautelari sul conflitto a Gaza.',
            colore: '#f97316',
            badge: 'Sentenze chiave',
          },
        ],
      },
    ],
  },

  // ── 6. ECOSOC E AGENZIE ──────────────────────────────────────────────────────
  {
    id: 'ecosoc',
    titolo: 'ECOSOC e agenzie specializzate',
    colore: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    icon: '🌐',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "Il Consiglio Economico e Sociale (ECOSOC) è uno dei sei organi principali dell'ONU. Coordina il lavoro delle agenzie specializzate, dei fondi e dei programmi ONU nelle sfere economica, sociale, ambientale e umanitaria. Ha 54 membri eletti dall'AG per 3 anni.",
      },
      {
        tipo: 'box',
        label: 'Come si collega alle agenzie',
        colore: '#22c55e',
        contenuto:
          'Le agenzie specializzate dell\'ONU sono organizzazioni internazionali autonome collegate all\'ONU mediante accordi. Hanno statuti, budget e leadership propri, ma coordinano il lavoro con l\'ECOSOC e il Segretariato. Alcune esistevano prima dell\'ONU (come l\'ILO, fondata nel 1919). Altre sono state create nel quadro dell\'ONU. Rispondono all\'AG per le questioni di bilancio e programma.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'OMS — Organizzazione Mondiale della Sanità',
            testo: 'Sede a Ginevra, fondata nel 1948. Coordina la risposta alle emergenze sanitarie globali, definisce gli standard internazionali di salute, gestisce il Regolamento Sanitario Internazionale. Sotto scrutinio durante la pandemia COVID-19 per la gestione delle informazioni iniziali dalla Cina.',
            colore: '#38bdf8',
            badge: 'Salute',
          },
          {
            titolo: 'UNESCO — Organizzazione per l\'Educazione, la Scienza e la Cultura',
            testo: 'Sede a Parigi. Promuove l\'educazione, la scienza, la cultura e la comunicazione. Gestisce il programma del Patrimonio dell\'Umanità. Gli USA si sono ritirati due volte (1984–2003 e 2017–2023) per ragioni politiche (presunte distorsioni contro Israele).',
            colore: '#FFD700',
            badge: 'Cultura',
          },
          {
            titolo: 'ILO — Organizzazione Internazionale del Lavoro',
            testo: 'Sede a Ginevra, fondata nel 1919. Unica agenzia a struttura tripartita: governi, datori di lavoro e sindacati siedono insieme. Adotta convenzioni e raccomandazioni internazionali del lavoro. Ha ottenuto il Premio Nobel per la Pace nel 1969.',
            colore: '#f97316',
            badge: 'Lavoro',
          },
          {
            titolo: 'UNICEF — Fondo per l\'Infanzia',
            testo: 'Istituito nel 1946 per aiutare i bambini europei dopo la guerra. Oggi opera in oltre 190 Paesi per la sopravvivenza, la protezione e lo sviluppo dei bambini. È un fondo ONU (non agenzia), finanziato quasi interamente da contributi volontari.',
            colore: '#22c55e',
            badge: 'Infanzia',
          },
          {
            titolo: 'UNHCR — Alto Commissariato per i Rifugiati',
            testo: 'Fondato nel 1950. Protegge i rifugiati, gli sfollati interni e gli apolidi. Gestisce i campi profughi, coordina il reinsediamento. Premio Nobel per la Pace 1954 e 1981. Oggi segue oltre 110 milioni di sfollati forzati nel mondo.',
            colore: '#a78bfa',
            badge: 'Rifugiati',
          },
          {
            titolo: 'FMI — Fondo Monetario Internazionale',
            testo: 'Fondato a Bretton Woods nel 1944, sede a Washington. Monitora la stabilità del sistema monetario internazionale, presta assistenza finanziaria agli Stati in difficoltà di bilancio con programmi condizionati a riforme economiche (condizionalità). Il sistema di voto è ponderato per quota: gli USA detengono il 17% dei voti e hanno de facto potere di veto sulle decisioni principali (che richiedono l\'85%). Direttore Generale è tradizionalmente europeo.',
            colore: '#003FA3',
            badge: 'Finanza int.',
          },
          {
            titolo: 'Banca Mondiale (Gruppo BM)',
            testo: 'Cinque istituzioni correlate con sede a Washington. Le principali sono la IBRD (International Bank for Reconstruction and Development) — presta a Paesi a reddito medio — e l\'IDA (International Development Association) — presta ai Paesi più poveri a condizioni agevolate. Il Presidente è tradizionalmente americano. Finanzia infrastrutture, salute, istruzione e riduzione della povertà nel mondo in via di sviluppo.',
            colore: '#22c55e',
            badge: 'Sviluppo',
          },
          {
            titolo: 'FAO — Organizzazione per l\'Alimentazione e l\'Agricoltura',
            testo: 'Sede a Roma, fondata nel 1945. Lavora per eliminare la fame nel mondo, promuovere l\'agricoltura sostenibile e migliorare la sicurezza alimentare. Gestisce il programma FAOSTAT (la più grande banca dati mondiale su alimentazione e agricoltura). Pubblica annualmente il rapporto "State of Food Security in the World". Dal 2019 il Direttore Generale è l\'italiano Qu Dongyu.',
            colore: '#f97316',
            badge: 'Alimentazione',
          },
          {
            titolo: 'WFP — Programma Alimentare Mondiale',
            testo: 'Sede a Roma. Il più grande organo umanitario del mondo: distribuisce cibo d\'emergenza in zone di conflitto, carestia e disastro naturale. Raggiunge ogni anno oltre 150 milioni di persone in 80 Paesi. Premio Nobel per la Pace 2020. È un fondo ONU (non agenzia specializzata) e dipende quasi interamente da contributi volontari.',
            colore: '#FFD700',
            badge: 'Fame zero',
          },
          {
            titolo: 'AIEA — Agenzia Internazionale per l\'Energia Atomica',
            testo: 'Sede a Vienna, fondata nel 1957. Promuove gli usi pacifici dell\'energia nucleare e verifica che gli Stati rispettino il Trattato di Non Proliferazione Nucleare (TNP, 1968). Conduce ispezioni negli impianti nucleari degli Stati. Premio Nobel per la Pace 2005. Svolge un ruolo centrale nelle crisi nucleari: Iran, Corea del Nord, centrali ucraine durante il conflitto con la Russia.',
            colore: '#a78bfa',
            badge: 'Nucleare',
          },
          {
            titolo: 'UNDP — Programma per lo Sviluppo',
            testo: 'Principale organo ONU per la cooperazione allo sviluppo. Opera in 170 Paesi. Pubblica ogni anno l\'Indice di Sviluppo Umano (ISU/HDI) che classifica i Paesi per aspettativa di vita, istruzione e reddito. Gestisce programmi di governance, riduzione della povertà e resilienza ai cambiamenti climatici. È un fondo ONU, finanziato da contributi volontari.',
            colore: '#38bdf8',
            badge: 'Sviluppo umano',
          },
          {
            titolo: 'WIPO — Organizzazione Mondiale per la Proprietà Intellettuale',
            testo: 'Sede a Ginevra, fondata nel 1967. Amministra i principali trattati internazionali sulla proprietà intellettuale: Convenzione di Parigi (brevetti e marchi, 1883), Convenzione di Berna (diritto d\'autore, 1886), Accordo di Madrid (registrazione internazionale marchi), PCT (brevetti internazionali). Gestisce un sistema di risoluzione delle controversie sui domini internet (UDRP).',
            colore: '#fb7185',
            badge: 'Proprietà int.',
          },
          {
            titolo: 'IMO — Organizzazione Marittima Internazionale',
            testo: 'Sede a Londra. Regola il trasporto marittimo internazionale: sicurezza delle navi, prevenzione dell\'inquinamento marino (Convenzione MARPOL), condizioni di lavoro dei marittimi. L\'85% del commercio mondiale viaggia via mare. Ogni nave battente bandiera di uno Stato membro deve rispettare gli standard IMO.',
            colore: '#003FA3',
            badge: 'Trasporto marittimo',
          },
        ],
      },
      {
        tipo: 'box',
        label: 'Fondi e programmi ONU — la differenza con le agenzie',
        colore: '#22c55e',
        contenuto:
          'Le agenzie specializzate (OMS, UNESCO, ILO, AIEA, ecc.) sono organizzazioni autonome con propri statuti e membership, collegate all\'ONU da accordi. I fondi e programmi (UNICEF, UNDP, WFP, UNHCR, UNFPA) sono invece organi sussidiari dell\'AG, creati con una risoluzione ONU, senza personalità giuridica separata, e dipendono quasi interamente da contributi volontari. Entrambi rispondono all\'ECOSOC ma con gradi diversi di autonomia.',
      },
    ],
  },

  // ── 7. PEACEKEEPING ──────────────────────────────────────────────────────────
  {
    id: 'peacekeeping',
    titolo: 'Operazioni di pace (Peacekeeping)',
    colore: '#38bdf8',
    bg: 'rgba(56,189,248,0.08)',
    icon: '🕊',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "Le operazioni di peacekeeping ONU non sono espressamente previste dalla Carta: si sono sviluppate attraverso la prassi a partire dal 1948. Il Segretario Generale Dag Hammarskjöld le definì come il \"Capitolo sei e mezzo\" — tra la risoluzione pacifica (Cap. VI) e l'azione coercitiva (Cap. VII). Oggi l'ONU gestisce oltre 10 missioni attive in 3 continenti.",
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'I tre principi del peacekeeping tradizionale',
            testo: '1) Consenso delle parti: la missione opera solo con l\'accordo degli Stati interessati. 2) Imparzialità: i caschi blu non prendono partito. 3) Non uso della forza, salvo legittima difesa o difesa del mandato. Questi principi distinguono il peacekeeping dall\'intervento militare coercitivo del Cap. VII.',
            colore: '#38bdf8',
            badge: 'Principi',
          },
          {
            titolo: 'Prima missione: UNTSO (1948)',
            testo: 'L\'Organizzazione delle Nazioni Unite per la Supervisione della Tregua (UNTSO) in Palestina è la più antica missione ONU ancora attiva. Sorveglia le linee di cessate il fuoco tra Israele e i Paesi arabi vicini. Poi venne UNMOGIP in Kashmir (1949) — ancora attiva.',
            colore: '#f97316',
            badge: 'Prima missione',
          },
          {
            titolo: 'Evoluzione: missioni multidimensionali',
            testo: 'Dalle semplici missioni di osservazione, il peacekeeping si è evoluto in operazioni complesse: protezione dei civili, supporto ai processi elettorali, ricostruzione istituzionale, disarmo e reintegrazione, promozione dei diritti umani. La missione in Kosovo (UNMIK, 1999) aveva de facto poteri di governo del territorio.',
            colore: '#22c55e',
            badge: 'Evoluzione',
          },
          {
            titolo: 'Crisi e fallimenti',
            testo: 'Rwanda (1994): UNAMIR non ricevette l\'autorizzazione a intervenire per fermare il genocidio; 800.000 morti in 100 giorni. Srebrenica (1995): il battaglione olandese (Dutchbat) non protesse la zona sicura; circa 8.000 bosniaci uccisi. Questi fallimenti portarono alla dottrina della "Responsabilità di Proteggere" (R2P) del 2005.',
            colore: '#ef4444',
            badge: 'Fallimenti',
          },
        ],
      },
      {
        tipo: 'box',
        label: 'La Responsabilità di Proteggere (R2P)',
        colore: '#38bdf8',
        contenuto:
          'Adottata dal World Summit del 2005, la R2P stabilisce che ogni Stato ha la responsabilità di proteggere la propria popolazione da genocidio, crimini di guerra, pulizia etnica e crimini contro l\'umanità. Se uno Stato non è in grado o non vuole farlo, la responsabilità ricade sulla comunità internazionale — che può intervenire, con l\'autorizzazione del CdS. La R2P è stata invocata per la Libia (2011, RES. 1973) ma l\'intervento NATO è andato molto oltre il mandato, generando critiche che hanno reso più difficile invocarne di nuove (Siria).',
      },
    ],
  },

  // ── 8. RIFORMA ONU ───────────────────────────────────────────────────────────
  {
    id: 'riforma',
    titolo: 'Il dibattito sulla riforma',
    colore: '#fb7185',
    bg: 'rgba(251,113,133,0.08)',
    icon: '🔧',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "L'ONU è spesso criticata per essere inefficiente, costosa e bloccata dalla politica delle grandi potenze. Il dibattito sulla riforma è in corso da decenni, ma le riforme strutturali sono difficilissime: qualsiasi modifica della Carta richiede la ratifica di 2/3 degli Stati membri inclusi tutti e 5 i P5.",
      },
      {
        tipo: 'confronto',
        coloreLeft: '#fb7185',
        coloreRight: '#22c55e',
        left: {
          label: 'Critiche principali',
          items: [
            'Il CdS riflette il 1945, non il mondo attuale',
            'Il veto paralizza la risposta alle crisi',
            'India (1,4 mld) non è membro permanente',
            'Africa non ha seggio permanente',
            'Doppi standard nell\'applicazione dei principi',
            'Burocrazia costosa e frammentata',
          ],
        },
        right: {
          label: 'Argomenti in favore dello status quo',
          items: [
            'Il CdS funzionante richiede consenso P5',
            'Senza veto i P5 non avrebbero aderito nel 1945',
            'La riforma richiede il veto dei P5: circolo vizioso',
            'Frammentazione preferibile all\'assenza di forum',
            'Il sistema regge rispetto alla guerra fredda',
          ],
        },
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Il G4 e la riforma del CdS',
            testo: 'Brasile, Germania, India e Giappone (G4) chiedono da anni un seggio permanente al CdS. L\'Unione Africana chiede due seggi permanenti per il continente. Gli USA appoggiano l\'India, la Russia è ambigua, la Cina si oppone al Giappone. Il consenso P5 necessario rende la riforma quasi impossibile nell\'immediato.',
            colore: '#f97316',
            badge: 'Riforma CdS',
          },
          {
            titolo: 'Riforma del Segretariato',
            testo: 'Kofi Annan (2002–2006) e Ban Ki-moon hanno avviato riforme interne: riduzione del personale, modernizzazione gestionale, creazione di nuovi organi (come il Consiglio per i Diritti Umani nel 2006 — che ha sostituito la criticata Commissione per i Diritti Umani). Le riforme strutturali profonde sono però politicamente difficili.',
            colore: '#38bdf8',
            badge: 'Riforma interna',
          },
          {
            titolo: 'SDGs — Agenda 2030',
            testo: 'I 17 Obiettivi di Sviluppo Sostenibile adottati dall\'AG nel 2015 rappresentano la grande agenda normativa dell\'ONU moderna: povertà zero, fame zero, salute, istruzione, parità di genere, acqua pulita, energia, lavoro dignitoso, città sostenibili, clima, partnership. Non sono vincolanti ma fungono da framework globale di riferimento.',
            colore: '#22c55e',
            badge: 'SDGs 2030',
          },
        ],
      },
      {
        tipo: 'highlight',
        colore: '#fb7185',
        testo: 'Il paradosso fondamentale dell\'ONU: è l\'unico forum universale per la cooperazione internazionale, ma le sue decisioni più importanti dipendono dal consenso dei P5 — le stesse potenze che spesso sono parte dei conflitti da risolvere. È simultaneamente indispensabile e insufficiente.',
      },
    ],
  },
];

export default function ONUPage() {
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
            background: 'linear-gradient(135deg, #071428, #0a1a2e)',
            borderRadius: 28, padding: '28px 24px',
            border: '0.5px solid rgba(56,189,248,0.2)',
            marginBottom: 24, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -50, right: -50,
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              display: 'inline-block', border: '1px solid rgba(56,189,248,0.3)', borderRadius: 99,
              padding: '4px 14px', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase',
              color: '#38bdf8', fontWeight: 700, marginBottom: 14,
            }}>
              Organizzazione intergovernativa universale
            </div>

            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 10 }}>
              Nazioni<br />Unite (ONU)
            </div>

            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 20 }}>
              Fondate nel 1945 a San Francisco dopo la Seconda guerra mondiale.
              193 Stati membri — praticamente l'intera comunità internazionale.
              6 organi principali, 15 agenzie specializzate, oltre 44.000 dipendenti.
              Il principale forum multilaterale per la pace, la sicurezza e lo sviluppo.
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { num: 193, label: 'Stati membri', colore: '#38bdf8' },
                { num: 8, label: 'sezioni', colore: '#22c55e' },
                { num: 1945, label: 'fondazione', colore: '#FFD700' },
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

          {/* INDICE */}
          <div style={{
            background: '#111526', borderRadius: 18, padding: '16px',
            border: '0.5px solid rgba(255,255,255,0.05)', marginBottom: 20,
          }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 12 }}>
              Indice degli argomenti
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sezioni.map((s) => (
                <button key={s.id}
                  onClick={() => {
                    setAperta(s.id);
                    setTimeout(() => document.getElementById(`sezione-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                  }}
                  style={{
                    padding: '5px 10px', borderRadius: 8,
                    background: `${s.colore}11`, border: `0.5px solid ${s.colore}33`,
                    color: s.colore, fontSize: 10, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                  }}>
                  {s.icon} {s.titolo}
                </button>
              ))}
            </div>
          </div>

          {/* SEZIONI */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sezioni.map((sezione) => (
              <div key={sezione.id} id={`sezione-${sezione.id}`} style={{
                background: '#111526', borderRadius: 20,
                border: `0.5px solid ${aperta === sezione.id ? sezione.colore + '55' : 'rgba(255,255,255,0.05)'}`,
                overflow: 'hidden', transition: 'border-color 0.2s',
              }}>
                <div onClick={() => setAperta(aperta === sezione.id ? null : sezione.id)} style={{
                  padding: '18px 16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: sezione.bg, border: `0.5px solid ${sezione.colore}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                  }}>{sezione.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{sezione.titolo}</div>
                  </div>
                  <div style={{
                    color: 'rgba(255,255,255,0.3)', fontSize: 13, flexShrink: 0,
                    transform: aperta === sezione.id ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}>▾</div>
                </div>

                {aperta === sezione.id && (
                  <div style={{ padding: '0 16px 20px', borderTop: '0.5px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {sezione.blocchi.map((blocco, bi) => {
                        if (blocco.tipo === 'testo') return (
                          <p key={bi} style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85 }}>{blocco.contenuto}</p>
                        );
                        if (blocco.tipo === 'highlight') return (
                          <div key={bi} style={{
                            borderLeft: `3px solid ${blocco.colore}`, background: `${blocco.colore}08`,
                            borderRadius: '0 10px 10px 0', padding: '12px 12px 12px 16px',
                          }}>
                            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontStyle: 'italic' }}>{blocco.testo}</p>
                          </div>
                        );
                        if (blocco.tipo === 'box') {
                          const col = blocco.colore ?? sezione.colore;
                          return (
                            <div key={bi} style={{ background: `${col}08`, borderRadius: 14, padding: '14px', border: `0.5px solid ${col}22` }}>
                              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: col, fontWeight: 700, marginBottom: 8 }}>{blocco.label}</div>
                              <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.85 }}>{blocco.contenuto}</p>
                            </div>
                          );
                        }
                        if (blocco.tipo === 'lista') return (
                          <div key={bi} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {blocco.items.map((item, ii) => (
                              <div key={ii} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <div style={{ width: 5, height: 5, borderRadius: '50%', background: sezione.colore, flexShrink: 0, marginTop: 6 }} />
                                <div>
                                  {item.titolo && <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff' }}>{item.titolo}: </span>}
                                  <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>{item.testo}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                        if (blocco.tipo === 'confronto') return (
                          <div key={bi} style={{ display: 'flex', gap: 8 }}>
                            {[{ col: blocco.coloreLeft, data: blocco.left }, { col: blocco.coloreRight, data: blocco.right }].map(({ col, data }, ci) => (
                              <div key={ci} style={{ flex: 1, background: `${col}08`, borderRadius: 14, padding: '12px 10px', border: `0.5px solid ${col}30` }}>
                                <div style={{ fontSize: 9.5, fontWeight: 800, color: col, marginBottom: 10, letterSpacing: 0.5, lineHeight: 1.4 }}>{data.label.toUpperCase()}</div>
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
                        if (blocco.tipo === 'cards') return (
                          <div key={bi} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {blocco.items.map((card, ci) => {
                              const col = card.colore ?? sezione.colore;
                              return (
                                <div key={ci} style={{ background: `${col}08`, borderRadius: 14, padding: '14px', border: `0.5px solid ${col}22` }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', flex: 1 }}>{card.titolo}</div>
                                    {card.badge && (
                                      <div style={{ background: `${col}18`, borderRadius: 6, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: col, letterSpacing: 0.5, flexShrink: 0 }}>
                                        {card.badge}
                                      </div>
                                    )}
                                  </div>
                                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8 }}>{card.testo}</p>
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

          <div style={{
            marginTop: 16,
            background: 'linear-gradient(135deg, rgba(56,189,248,0.05), rgba(34,197,94,0.05))',
            borderRadius: 18, padding: '18px 16px',
            border: '0.5px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 10 }}>
              Le sei lingue ufficiali ONU
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              Arabo, cinese, inglese, francese, russo e spagnolo. Tutti i documenti ufficiali sono tradotti nelle sei lingue. Le lingue di lavoro del Segretariato sono{' '}
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>inglese e francese</span>.
            </p>
          </div>

        </div>
        <Footer />
      </div>
    </>
  );
}
