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
  // ── 1. TRATTATI ─────────────────────────────────────────────────────────────
  {
    id: 'trattati',
    titolo: 'I trattati fondativi',
    colore: '#FFD700',
    bg: 'rgba(255,215,0,0.08)',
    icon: '📜',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "L'Unione Europea nasce da una serie di trattati internazionali firmati tra il 1951 e il 2007. Non esiste una \"Costituzione europea\" vera e propria: le basi giuridiche dell'UE sono due trattati di pari rango — il TUE e il TFUE — integrati dalla Carta dei diritti fondamentali.",
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'CECA (1951) — Trattato di Parigi',
            testo: 'Comunità Europea del Carbone e dell\'Acciaio: il primo passo. Francia, Germania, Italia, Belgio, Olanda, Lussemburgo mettono in comune carbone e acciaio — le materie prime della guerra — per rendere un nuovo conflitto materialmente impossibile. Ispirata dall\'idea di Jean Monnet.',
            colore: '#f97316',
            badge: '6 fondatori',
          },
          {
            titolo: 'Trattati di Roma (1957)',
            testo: 'Istituiscono la CEE (Comunità Economica Europea) e l\'Euratom. La CEE crea il mercato comune: libera circolazione di merci, persone, servizi e capitali (le "quattro libertà"). È il nucleo da cui tutto si sviluppa.',
            colore: '#FFD700',
            badge: 'Mercato comune',
          },
          {
            titolo: 'Atto Unico Europeo (1986)',
            testo: 'Prima grande riforma dei trattati. Completa il mercato interno, rafforza il Parlamento Europeo, introduce il voto a maggioranza qualificata per molte decisioni. Fissa l\'obiettivo del mercato unico per il 31 dicembre 1992.',
            colore: '#22c55e',
            badge: 'Mercato unico',
          },
          {
            titolo: 'Trattato di Maastricht (1992) — TUE',
            testo: 'Il più importante. Crea l\'Unione Europea, istituisce la cittadinanza europea, avvia l\'Unione Economica e Monetaria (euro), introduce i tre "pilastri" (Comunità, PESC, GAI) e rafforza significativamente i poteri del Parlamento. Entrato in vigore nel 1993.',
            colore: '#003FA3',
            badge: 'Nasce l\'UE',
          },
          {
            titolo: 'Trattato di Amsterdam (1997)',
            testo: 'Incorpora Schengen nel diritto UE, rafforza la PESC, introduce l\'area di libertà, sicurezza e giustizia, consolida i diritti fondamentali. Prepara l\'allargamento verso est.',
            colore: '#a78bfa',
            badge: 'Schengen + diritti',
          },
          {
            titolo: 'Trattato di Nizza (2001)',
            testo: 'Riforma istituzionale in vista dell\'allargamento a 10 nuovi Stati (2004). Ridistribuisce seggi al PE e pesi al Consiglio, estende il voto a maggioranza qualificata. Considerato insufficiente: apre il percorso verso la Costituzione europea.',
            colore: '#38bdf8',
            badge: 'Allargamento',
          },
          {
            titolo: 'Trattato di Lisbona (2007) — in vigore dal 2009',
            testo: 'Dopo il fallimento della Costituzione europea (bocciata da Francia e Olanda nel 2005), Lisbona incorpora gran parte delle riforme senza chiamarle "Costituzione". Fonde i pilastri, crea il Presidente del Consiglio Europeo e l\'Alto Rappresentante, rende la Carta dei diritti vincolante, introduce l\'art. 50 (recesso). È il diritto primario vigente.',
            colore: '#FFD700',
            badge: 'Diritto vigente',
          },
        ],
      },
      {
        tipo: 'box',
        label: 'TUE e TFUE — i due trattati vigenti',
        colore: '#FFD700',
        contenuto:
          'Il TUE (Trattato sull\'Unione Europea) stabilisce i valori, gli obiettivi e la struttura istituzionale. Il TFUE (Trattato sul Funzionamento dell\'UE) disciplina nel dettaglio le politiche, le competenze e le procedure. Hanno lo stesso rango giuridico. La Carta dei diritti fondamentali dell\'UE (proclamata nel 2000, vincolante dal 2009) completa il quadro.',
      },
      {
        tipo: 'highlight',
        colore: '#FFD700',
        testo: 'L\'art. 50 TUE — introdotto da Lisbona — disciplina il recesso volontario di uno Stato membro. È la norma che ha governato la Brexit (2016–2020): primo utilizzo storico di un meccanismo che nessuno si aspettava venisse mai attivato.',
      },
    ],
  },

  // ── 2. COMMISSIONE ───────────────────────────────────────────────────────────
  {
    id: 'commissione',
    titolo: 'La Commissione Europea',
    colore: '#003FA3',
    bg: 'rgba(0,63,163,0.08)',
    icon: '⚙',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "La Commissione è il principale organo esecutivo dell'UE e custode dei trattati. È l'istituzione più «federale»: i Commissari agiscono nell'interesse generale dell'Unione, non del proprio Stato. Ha tre funzioni fondamentali: propone le leggi, esegue il bilancio, controlla il rispetto del diritto UE.",
      },
      {
        tipo: 'box',
        label: 'Composizione',
        colore: '#003FA3',
        contenuto:
          'Un Commissario per ogni Stato membro (27 dopo la Brexit). Il Presidente è eletto dal Parlamento su proposta del Consiglio Europeo a maggioranza qualificata. Gli altri Commissari sono nominati di comune accordo dai governi nazionali con il Presidente e approvati dal PE. Il Collegio dei Commissari deve ricevere la fiducia del Parlamento.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Monopolio di iniziativa legislativa',
            testo: 'Solo la Commissione può proporre atti legislativi dell\'UE. Parlamento e Consiglio possono chiedere alla Commissione di presentare una proposta, ma non possono legiferare di propria iniziativa. Questo monopolio è la principale leva di potere della Commissione.',
            colore: '#003FA3',
            badge: 'Funzione chiave',
          },
          {
            titolo: 'Custode dei trattati',
            testo: 'La Commissione vigila sul rispetto del diritto UE da parte degli Stati membri. Se uno Stato viola il diritto europeo, la Commissione apre una procedura di infrazione (art. 258 TFUE): prima lettera di messa in mora, poi parere motivato, poi ricorso alla Corte di Giustizia. Se la Corte condanna lo Stato e questo non si adegua, può essere irrogata una sanzione pecuniaria.',
            colore: '#f97316',
            badge: 'Infrazione',
          },
          {
            titolo: 'Esecuzione del bilancio',
            testo: 'La Commissione gestisce il bilancio UE sotto il controllo della Corte dei Conti europea. Presenta ogni anno il rendiconto al Parlamento, che vota la procedura di discarico. Il PE può rifiutare il discarico — il che è di fatto una censura politica alla Commissione.',
            colore: '#22c55e',
            badge: 'Bilancio',
          },
          {
            titolo: 'Concorrenza e aiuti di Stato',
            testo: 'La Commissione ha poteri esclusivi in materia di concorrenza: può vietare cartelli, sanzionare abusi di posizione dominante, bloccare fusioni e dichiarare illegali gli aiuti di Stato incompatibili con il mercato interno. Le maxi-sanzioni a Google, Apple e Meta sono esempi di questo potere.',
            colore: '#a78bfa',
            badge: 'Antitrust',
          },
        ],
      },
      {
        tipo: 'box',
        label: 'Mozione di censura',
        colore: '#f97316',
        contenuto:
          'Il Parlamento Europeo può sfiduciare l\'intera Commissione con una mozione di censura approvata da 2/3 dei voti espressi e dalla maggioranza dei componenti. Non può sfiduciare il singolo Commissario: l\'istituzione funziona come organo collegiale. Nel 1999 la Commissione Santer si dimise prima del voto di censura a seguito dello scandalo sulle irregolarità nella gestione dei fondi.',
      },
    ],
  },

  // ── 3. PARLAMENTO ────────────────────────────────────────────────────────────
  {
    id: 'parlamento',
    titolo: 'Il Parlamento Europeo',
    colore: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    icon: '🗳',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Il Parlamento Europeo è l\'unica istituzione dell\'UE eletta direttamente dai cittadini. Elegge i suoi componenti ogni 5 anni con suffragio universale diretto in tutti gli Stati membri. Rappresenta i cittadini (non gli Stati), ed è organizzato per gruppi politici transnazionali.',
      },
      {
        tipo: 'box',
        label: 'Composizione e proporzionalità degressiva',
        colore: '#22c55e',
        contenuto:
          'Il PE ha 720 seggi (dal 2024). I seggi sono distribuiti tra gli Stati con il criterio della proporzionalità degressiva: gli Stati più piccoli hanno più seggi di quanti ne avrebbero in proporzione alla popolazione, ma meno degli Stati grandi. Ogni Stato ha almeno 6 seggi (minimo) e al massimo 96 (Germania). I parlamentari siedono per gruppo politico, non per delegazione nazionale.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Funzione legislativa (codecisione)',
            testo: 'La procedura legislativa ordinaria (ex codecisione) richiede l\'accordo di Parlamento e Consiglio su un testo identico. Il PE può emendare, bloccare o negoziare in trilogue con la Commissione e il Consiglio. Il Parlamento ha così un potere legislativo reale, non consultivo.',
            colore: '#22c55e',
            badge: 'Codecisione',
          },
          {
            titolo: 'Funzione di bilancio',
            testo: 'Il PE approva il bilancio annuale dell\'UE in codecisione con il Consiglio. Può respingerlo e proporre emendamenti. Ha l\'ultima parola sulle spese non obbligatorie. Vota anche il Quadro Finanziario Pluriennale (QFP), il bilancio a lungo termine dell\'UE.',
            colore: '#FFD700',
            badge: 'Potere di borsa',
          },
          {
            titolo: 'Controllo politico',
            testo: 'Elegge il Presidente della Commissione, approva l\'intero Collegio, può votare la mozione di censura. Istituisce commissioni d\'inchiesta, riceve petizioni dei cittadini, nomina il Mediatore europeo (Ombudsman). Controlla la BCE attraverso audizioni e relazioni.',
            colore: '#003FA3',
            badge: 'Controllo',
          },
          {
            titolo: 'Sede e sessioni',
            testo: 'Strasburgo è la sede ufficiale per le sessioni plenarie mensili. Bruxelles ospita le commissioni parlamentari e le sessioni aggiuntive. Il Segretariato generale ha sede a Lussemburgo. Questa divisione su tre città è stabilita dai trattati e costa all\'UE circa 130 milioni di euro l\'anno.',
            colore: '#a78bfa',
            badge: 'Tre sedi',
          },
        ],
      },
      {
        tipo: 'highlight',
        colore: '#22c55e',
        testo: 'Il PE ha progressivamente ampliato i suoi poteri dai trattati del 1986 in poi. Nato come assemblea consultiva nel 1957, è diventato colegislatore alla pari del Consiglio. Le elezioni europee però restano segnate da un basso tasso di partecipazione: nel 2024 circa il 51% in media (ma in forte disomogeneità tra Stati).',
      },
    ],
  },

  // ── 4. CONSIGLIO EUROPEO ─────────────────────────────────────────────────────
  {
    id: 'consiglio-europeo',
    titolo: 'Il Consiglio Europeo',
    colore: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    icon: '🏛',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          'Il Consiglio Europeo (da non confondere con il Consiglio dell\'UE) riunisce i Capi di Stato o di governo degli Stati membri, il suo Presidente e il Presidente della Commissione. Non legifera: definisce gli orientamenti politici generali e le priorità dell\'Unione.',
      },
      {
        tipo: 'confronto',
        coloreLeft: '#f97316',
        coloreRight: '#38bdf8',
        left: {
          label: 'Consiglio Europeo',
          items: [
            'Capi di Stato o di governo',
            'Si riunisce almeno 4 volte l\'anno',
            'Definisce gli orientamenti strategici',
            'Non legifera',
            'Decide in genere per consenso o unanimità',
            'Presidente fisso per 2 anni e mezzo rinnovabile',
          ],
        },
        right: {
          label: 'Consiglio dell\'UE (dei Ministri)',
          items: [
            'Ministri dei governi nazionali',
            'Composizione varia per materia',
            'Co-legifera con il Parlamento',
            'Adotta atti legislativi',
            'Vota a maggioranza qualificata o unanimità',
            'Presidenza a rotazione semestrale',
          ],
        },
      },
      {
        tipo: 'box',
        label: 'Il Presidente del Consiglio Europeo',
        colore: '#f97316',
        contenuto:
          'Dal Trattato di Lisbona il Consiglio Europeo ha un Presidente stabile (non più a rotazione). Dura 2 anni e mezzo, rinnovabile una volta. Presiede e anima i lavori, facilita il consenso, rappresenta l\'UE all\'estero per le questioni di politica estera. Non ha poteri esecutivi propri: è più un moderatore ad alto livello. Il primo è stato Herman Van Rompuy (2009), poi Donald Tusk e Charles Michel.',
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Voto a unanimità', testo: 'Il Consiglio Europeo decide di solito per consenso. Nelle materie più sensibili (revisione dei trattati, allargamento, politica estera) vige l\'unanimità: ogni Stato ha di fatto un diritto di veto.' },
          { titolo: 'Conclusioni', testo: 'I risultati dei vertici sono le "Conclusioni del Consiglio Europeo", documenti politici che orientano tutta l\'attività legislativa successiva delle altre istituzioni.' },
          { titolo: 'Euro Summit', testo: 'I Capi di Stato o di governo dei Paesi dell\'Eurozona si riuniscono separatamente come Euro Summit per le questioni della zona euro.' },
        ],
      },
    ],
  },

  // ── 5. CONSIGLIO UE ──────────────────────────────────────────────────────────
  {
    id: 'consiglio-ue',
    titolo: "Il Consiglio dell'UE",
    colore: '#38bdf8',
    bg: 'rgba(56,189,248,0.08)',
    icon: '🤝',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "Il Consiglio dell'Unione Europea (detto anche Consiglio dei Ministri) rappresenta i governi degli Stati membri. È co-legislatore con il Parlamento nella procedura ordinaria e ha un ruolo centrale nella politica estera e nella coordinazione economica.",
      },
      {
        tipo: 'box',
        label: 'Composizione variabile',
        colore: '#38bdf8',
        contenuto:
          'Il Consiglio non ha una composizione fissa: si riunisce in 10 formazioni diverse a seconda della materia (Affari generali, ECOFIN, Agricoltura, Ambiente, ecc.). Partecipa il ministro nazionale competente per quella materia. Il Consiglio Affari generali coordina i lavori e prepara il Consiglio Europeo.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Maggioranza qualificata (MQ)',
            testo: 'Dal Trattato di Lisbona la regola generale è la doppia maggioranza: almeno il 55% degli Stati membri (15 su 27) che rappresentino almeno il 65% della popolazione UE. Per bloccare una decisione serve una minoranza di blocco di almeno 4 Stati che rappresentino il 35% della popolazione.',
            colore: '#38bdf8',
            badge: '55% + 65%',
          },
          {
            titolo: 'Unanimità — le materie sensibili',
            testo: 'Richiedono unanimità (ogni Stato ha veto): politica fiscale, politica estera e di sicurezza, revisione dei trattati, allargamento UE, politica di difesa, risorse proprie dell\'UE, alcune questioni di giustizia e affari interni. L\'unanimità rende queste materie particolarmente difficili da riformare.',
            colore: '#f97316',
            badge: 'Diritto di veto',
          },
          {
            titolo: 'COREPER',
            testo: 'Il Comitato dei Rappresentanti Permanenti (ambasciatori degli Stati a Bruxelles) prepara i lavori del Consiglio. In pratica la maggior parte delle decisioni è già raggiunta a livello di COREPER I (vicerappresentanti) o COREPER II (ambasciatori) prima che i ministri si riuniscano. I punti su cui c\'è già accordo diventano "punti A" (approvati senza discussione); quelli controversi sono "punti B".',
            colore: '#a78bfa',
            badge: 'Preparazione',
          },
          {
            titolo: 'Presidenza a rotazione',
            testo: 'La presidenza del Consiglio (non del Consiglio Europeo) ruota ogni 6 mesi tra gli Stati membri in un ordine prestabilito. Il Paese che presiede fissa le priorità politiche del semestre e gestisce i negoziati. L\'Italia ha presieduto nel secondo semestre 2024.',
            colore: '#22c55e',
            badge: '6 mesi',
          },
        ],
      },
    ],
  },

  // ── 6. CORTE DI GIUSTIZIA ────────────────────────────────────────────────────
  {
    id: 'cgue',
    titolo: 'La Corte di Giustizia dell\'UE',
    colore: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    icon: '⚖',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "La Corte di Giustizia dell'Unione Europea (CGUE) ha sede a Lussemburgo ed è l'organo giurisdizionale supremo dell'UE. Garantisce l'interpretazione e l'applicazione uniforme del diritto europeo in tutti gli Stati membri. È divisa in due organi: la Corte di Giustizia vera e propria e il Tribunale.",
      },
      {
        tipo: 'box',
        label: 'Composizione',
        colore: '#a78bfa',
        contenuto:
          'La Corte di Giustizia è composta da un giudice per Stato membro (27) più 11 Avvocati generali. I giudici sono nominati di comune accordo dai governi per 6 anni rinnovabili, previo parere di un comitato consultivo. Il Tribunale ha almeno 2 giudici per Stato (54 totali). Gli Avvocati generali presentano conclusioni indipendenti in molte cause, che la Corte non è obbligata a seguire ma nella pratica spesso segue.',
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Rinvio pregiudiziale (art. 267 TFUE)',
            testo: 'Qualsiasi giudice nazionale può — e quello di ultima istanza deve — sospendere il processo e chiedere alla CGUE di interpretare una norma UE o di verificarne la validità. La risposta vincola il giudice nazionale e tutti i giudici degli altri Stati con la stessa questione. È il meccanismo che assicura l\'uniformità del diritto europeo. Rappresenta oltre il 60% del carico di lavoro della Corte.',
            colore: '#a78bfa',
            badge: 'Strumento chiave',
          },
          {
            titolo: 'Ricorso per inadempimento',
            testo: 'La Commissione (art. 258 TFUE) o un altro Stato (art. 259) possono portare uno Stato davanti alla Corte per violazione del diritto UE. Se condannato e lo Stato non si adegua, la Commissione può chiedere una sanzione pecuniaria forfettaria e/o una penalità di mora (art. 260 TFUE).',
            colore: '#f97316',
            badge: 'Infrazione',
          },
          {
            titolo: 'Ricorso di annullamento (art. 263)',
            testo: 'Permette di contestare la legittimità degli atti delle istituzioni UE. Possono ricorrere gli Stati, le istituzioni, e — in modo molto limitato — i privati (devono dimostrare di essere interessati direttamente e individualmente dall\'atto). Il Tribunale è competente in primo grado.',
            colore: '#38bdf8',
            badge: 'Annullamento',
          },
          {
            titolo: 'I principi elaborati dalla CGUE',
            testo: 'La Corte ha elaborato i principi fondamentali dell\'ordinamento UE: primato del diritto UE (Costa/ENEL, 1964), effetto diretto (Van Gend en Loos, 1963), responsabilità dello Stato per violazione del diritto UE (Francovich, 1991). Questi principi non erano scritti nei trattati originali: sono stati costruiti caso per caso in via giurisprudenziale.',
            colore: '#22c55e',
            badge: 'Giurisprudenza',
          },
        ],
      },
      {
        tipo: 'highlight',
        colore: '#a78bfa',
        testo: 'Costa c. ENEL (1964): la Corte afferma che il diritto comunitario prevale sulle leggi nazionali anche successive. Van Gend en Loos (1963): il diritto comunitario crea diritti che i singoli possono far valere davanti ai giudici nazionali. Queste due sentenze sono la pietra angolare dell\'ordinamento giuridico europeo.',
      },
    ],
  },

  // ── 7. BILANCIO ──────────────────────────────────────────────────────────────
  {
    id: 'bilancio',
    titolo: 'Il bilancio europeo',
    colore: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    icon: '💶',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "Il bilancio dell'UE è uno strumento di redistribuzione, non di macroeconomia: è relativamente piccolo rispetto al PIL europeo (~1%) ed è sempre in pareggio (l'UE non può indebitarsi con il bilancio ordinario). Le entrate vengono dai contributi degli Stati e da risorse proprie.",
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Quadro Finanziario Pluriennale (QFP)',
            testo: 'Il bilancio è programmato su periodi di 7 anni attraverso il QFP (o "Multiannual Financial Framework"). Il QFP fissa i massimali di spesa per ciascuna categoria. Va approvato all\'unanimità dal Consiglio e con il consenso del Parlamento. Il QFP 2021–2027 vale circa 1.216 miliardi di euro.',
            colore: '#22c55e',
            badge: '7 anni',
          },
          {
            titolo: 'Entrate: le risorse proprie',
            testo: 'Il bilancio è finanziato da: dazi doganali sulle importazioni da Paesi terzi (~15%); contributo basato sull\'IVA degli Stati (~10%); contributo basato sul Reddito Nazionale Lordo degli Stati (~70%); nuova risorsa sui rifiuti di plastica (dal 2021). Gli Stati più ricchi sono contribuenti netti.',
            colore: '#FFD700',
            badge: 'Entrate',
          },
          {
            titolo: 'Spese: dove va il bilancio',
            testo: 'Le due voci principali sono la Politica Agricola Comune (PAC) — circa il 31% — e i Fondi Strutturali e di Coesione per ridurre le disparità regionali — circa il 35%. Il resto è destinato a ricerca e innovazione (Horizon Europe), politica estera, sicurezza e migrazione, amministrazione.',
            colore: '#003FA3',
            badge: 'Spese',
          },
          {
            titolo: 'Next Generation EU',
            testo: 'In risposta alla pandemia, nel 2020 l\'UE ha istituito il programma NGEU da 750 miliardi (a prezzi 2018), di cui 360 miliardi in prestiti e 390 miliardi in sovvenzioni agli Stati. È la prima volta che l\'UE si è indebitata sui mercati in modo massiccio per finanziare spesa degli Stati. In Italia corrisponde al PNRR (Piano Nazionale di Ripresa e Resilienza).',
            colore: '#f97316',
            badge: 'PNRR',
          },
        ],
      },
      {
        tipo: 'box',
        label: 'La procedura di bilancio',
        colore: '#22c55e',
        contenuto:
          'La Commissione propone il progetto di bilancio entro il 1° settembre. Consiglio e Parlamento esaminano la proposta e possono emendarla. Se non trovano accordo, si apre una conciliazione di 21 giorni. Se non si raggiunge l\'intesa, il PE può rigettare il bilancio (è avvenuto nel 1979 e nel 1984). In assenza di bilancio, l\'UE va avanti per dodicesimi provvisori.',
      },
    ],
  },

  // ── 8. CONSIGLIO D'EUROPA + CEDU ────────────────────────────────────────────
  {
    id: 'coe-cedu',
    titolo: "Consiglio d'Europa e CEDU",
    colore: '#fb7185',
    bg: 'rgba(251,113,133,0.08)',
    icon: '🛡',
    blocchi: [
      {
        tipo: 'box',
        label: '⚠ Attenzione: non è un organo dell\'UE',
        colore: '#f97316',
        contenuto:
          'Il Consiglio d\'Europa e la CEDU non fanno parte dell\'Unione Europea. Sono istituzioni internazionali separate, nate prima dell\'UE, con una membership diversa (47 Stati, inclusi Stati non-UE come Turchia, Georgia, Svizzera). Non vanno confusi con il Consiglio dell\'UE o il Consiglio Europeo.',
      },
      {
        tipo: 'testo',
        contenuto:
          "Il Consiglio d'Europa è un'organizzazione internazionale fondata nel 1949 a Londra con l'obiettivo di promuovere la democrazia, i diritti umani e lo stato di diritto in Europa. La sua sede è a Strasburgo. Il principale strumento del Consiglio d'Europa è la Convenzione Europea dei Diritti dell'Uomo (CEDU), firmata nel 1950 ed entrata in vigore nel 1953.",
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'La CEDU — Convenzione Europea dei Diritti dell\'Uomo',
            testo: 'Catalogo di diritti fondamentali: vita, divieto di tortura, libertà personale, processo equo, rispetto della vita privata, libertà di pensiero, espressione, associazione, diritto di proprietà, divieto di discriminazione. Il sistema è dinamico: la Corte interpreta la Convenzione come "strumento vivente", adattandola all\'evoluzione sociale.',
            colore: '#fb7185',
            badge: 'Diritti fondamentali',
          },
          {
            titolo: 'La Corte EDU — Corte Europea dei Diritti dell\'Uomo',
            testo: 'Ha sede a Strasburgo e giudica i ricorsi dei singoli che lamentano violazioni della CEDU da parte di uno Stato membro. Prima di ricorrere è necessario aver esaurito i rimedi interni. Le sentenze sono vincolanti: lo Stato condannato deve pagare un\'equa soddisfazione e adottare misure generali per rimuovere la violazione. Il Comitato dei Ministri del Consiglio d\'Europa ne controlla l\'esecuzione.',
            colore: '#a78bfa',
            badge: 'Ricorsi individuali',
          },
          {
            titolo: 'Protocolo 16 — pareri consultivi',
            testo: 'Dal 2018 le corti di ultima istanza degli Stati ratificanti possono chiedere alla Corte EDU un parere consultivo su questioni di interpretazione della Convenzione. Non è vincolante ma ha grande autorevolezza. L\'Italia non ha ancora ratificato il Protocollo 16.',
            colore: '#38bdf8',
            badge: 'Dialogo tra corti',
          },
          {
            titolo: 'CEDU e UE: il rapporto',
            testo: 'La Carta dei diritti fondamentali dell\'UE (vincolante dal 2009) si ispira largamente alla CEDU e garantisce diritti equivalenti. Il Trattato di Lisbona prevede l\'adesione dell\'UE alla CEDU, ma la CGUE ha bloccato l\'accordo di adesione nel Parere 2/13 del 2014, ritenendo che compromettesse l\'autonomia del diritto UE. Il negoziato sull\'adesione è ripartito ma ancora aperto.',
            colore: '#FFD700',
            badge: 'UE e CEDU',
          },
        ],
      },
      {
        tipo: 'lista',
        items: [
          { titolo: 'Organi del Consiglio d\'Europa', testo: 'Il Comitato dei Ministri (ministri degli Esteri o loro delegati) è l\'organo decisionale; l\'Assemblea Parlamentare (PACE) è l\'organo deliberativo composto da parlamentari nazionali; il Congresso dei Poteri Locali e Regionali; il Segretario Generale (eletto dalla PACE per 5 anni).' },
          { titolo: 'La Russia e il Consiglio d\'Europa', testo: 'La Russia era membro dal 1996. A seguito dell\'invasione dell\'Ucraina nel 2022, è stata espulsa: primo caso di espulsione nella storia dell\'organizzazione. Questo ha privato circa 145 milioni di russi della tutela della CEDU.' },
          { titolo: 'Differenza con la CIG', testo: 'La Corte EDU giudica i ricorsi degli individui contro gli Stati per violazione della CEDU. La Corte Internazionale di Giustizia (dell\'ONU) giudica invece le controversie tra Stati e può emettere pareri consultivi su richiesta degli organi ONU.' },
        ],
      },
    ],
  },

  // ── 9. ALTRE ISTITUZIONI ─────────────────────────────────────────────────────
  {
    id: 'altre',
    titolo: 'Altre istituzioni e organi chiave',
    colore: '#e879f9',
    bg: 'rgba(232,121,249,0.08)',
    icon: '🔧',
    blocchi: [
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Banca Centrale Europea (BCE)',
            testo: 'Istituita nel 1998, sede a Francoforte. Definisce e attua la politica monetaria per i 20 Paesi dell\'Eurozona. Ha come mandato primario la stabilità dei prezzi (inflazione vicina al 2% nel medio termine). È indipendente dalle istituzioni politiche: non può ricevere istruzioni da governi o istituzioni UE. Il Consiglio direttivo è composto dal Comitato esecutivo (6 membri) e dai governatori delle banche centrali nazionali dell\'Eurozona.',
            colore: '#003FA3',
            badge: 'Politica monetaria',
          },
          {
            titolo: 'Corte dei Conti europea',
            testo: 'Organo di controllo esterno sul bilancio UE. Verifica la legalità e la regolarità delle operazioni contabili e valuta la sana gestione finanziaria. Presenta ogni anno una Dichiarazione di affidabilità (DAS). Non ha poteri giurisdizionali: se trova irregolarità, le segnala alla Commissione e all\'OLAF (Ufficio antifrode). Ha sede a Lussemburgo.',
            colore: '#f97316',
            badge: 'Controllo bilancio',
          },
          {
            titolo: 'Comitato Economico e Sociale (CESE)',
            testo: 'Organo consultivo che rappresenta le parti sociali: datori di lavoro, sindacati e organizzazioni della società civile. Deve essere consultato obbligatoriamente su determinate materie (politiche economiche, sociali, occupazione) ma i suoi pareri non sono vincolanti.',
            colore: '#22c55e',
            badge: 'Consultivo',
          },
          {
            titolo: 'Comitato delle Regioni (CdR)',
            testo: 'Organo consultivo che rappresenta le autorità locali e regionali. Consultato su questioni che riguardano regioni e comuni (coesione, trasporti, ambiente, istruzione). Può ricorrere alla CGUE se ritiene che un atto violi il principio di sussidiarietà.',
            colore: '#38bdf8',
            badge: 'Regioni',
          },
        ],
      },
      {
        tipo: 'box',
        label: 'I principi strutturali dell\'UE',
        colore: '#e879f9',
        contenuto:
          'Attribuzione: l\'UE agisce solo nei limiti delle competenze attribuitele dai trattati. Sussidiarietà: l\'UE interviene solo se e nella misura in cui gli obiettivi non possono essere raggiunti dagli Stati. Proporzionalità: il contenuto e la forma dell\'azione UE non devono andare al di là di quanto necessario. Questi tre principi — art. 5 TUE — definiscono i confini tra azione UE e sovranità degli Stati.',
      },
      {
        tipo: 'confronto',
        coloreLeft: '#e879f9',
        coloreRight: '#FFD700',
        left: {
          label: 'Competenze esclusive UE',
          items: [
            'Unione doganale',
            'Politica commerciale comune',
            'Politica monetaria (Eurozona)',
            'Politica della concorrenza',
            'Conservazione risorse biologiche del mare',
          ],
        },
        right: {
          label: 'Competenze concorrenti',
          items: [
            'Mercato interno',
            'Politica sociale',
            'Coesione economica e sociale',
            'Ambiente e energia',
            'Trasporti e reti trans-europee',
          ],
        },
      },
    ],
  },

  // ── 10. ELEZIONE COMMISSIONE ─────────────────────────────────────────────────
  {
    id: 'elezione-commissione',
    titolo: 'Come si elegge la Commissione',
    colore: '#003FA3',
    bg: 'rgba(0,63,163,0.08)',
    icon: '🗳',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "La formazione di una nuova Commissione è un processo in più fasi che coinvolge Consiglio Europeo, governi nazionali e Parlamento Europeo. Dura circa 4–5 mesi dopo le elezioni europee e si conclude con un voto di fiducia del PE sull'intero Collegio.",
      },
      {
        tipo: 'lista',
        items: [
          {
            titolo: 'Fase 1 — Proposta del Presidente (art. 17 par. 7 TUE)',
            testo: 'Entro un mese dalle elezioni europee il Consiglio Europeo propone, a maggioranza qualificata e tenendo conto dei risultati elettorali, un candidato alla Presidenza della Commissione. Nella prassi il candidato appartiene al gruppo politico più grande al PE (tradizionalmente il PPE). Poi il Parlamento Europeo vota: servono la maggioranza assoluta dei componenti (almeno 361 su 720). Se il PE respinge il candidato, il Consiglio Europeo ha un mese per proporre un nuovo nome.',
          },
          {
            titolo: 'Fase 2 — Nomina dei Commissari',
            testo: 'Il Presidente eletto concorda con i governi nazionali i nomi dei Commissari: ogni Stato membro propone un candidato. Il Presidente può chiedere al governo di sostituire un nominativo. I Commissari vengono poi formalmente proposti dal Consiglio (a maggioranza qualificata) di comune accordo con il Presidente.',
          },
          {
            titolo: 'Fase 3 — Audizioni parlamentari',
            testo: 'Ogni Commissario designato viene convocato davanti alla commissione parlamentare competente per materia per un\'audizione pubblica di circa 3 ore. La commissione emette un parere (favorevole o sfavorevole). Se il parere è negativo, il governo proponente di norma ritira il candidato e ne propone uno nuovo. È la fase più rischiosa: nel 2004 il candidato italiano Buttiglione fu respinto; nel 2024 la candidata ungherese Varga fu sostituita.',
          },
          {
            titolo: 'Fase 4 — Voto di investitura del Collegio',
            testo: 'Dopo tutte le audizioni, il PE vota sull\'intero Collegio (non sui singoli Commissari). Serve la maggioranza assoluta dei voti espressi. Il Consiglio Europeo procede poi alla nomina formale con voto a maggioranza qualificata. Il mandato dura 5 anni, allineato alla legislatura del PE.',
          },
          {
            titolo: 'Il "Spitzenkandidat" — sistema controverso',
            testo: 'Dal 2014 i gruppi politici europei presentano un candidato di punta (Spitzenkandidat) prima delle elezioni, con l\'idea che il gruppo vincitore "vinca" automaticamente la Presidenza. Nel 2014 funzionò (Juncker per il PPE). Nel 2019 non funzionò: i governi scelsero Von der Leyen, che non era Spitzenkandidat. Il meccanismo non è previsto dai trattati ed è oggetto di tensione istituzionale tra PE e Consiglio Europeo.',
          },
          {
            titolo: 'Dimissioni e sostituzione in corso di mandato',
            testo: 'Se un Commissario si dimette, viene dichiarato incompatibile dalla Corte di Giustizia o viene rimosso dal Presidente, il governo dello Stato membro interessato propone un sostituto. Se il PE approva una mozione di censura, l\'intero Collegio deve dimettersi (incluso il Presidente). Il Consiglio Europeo nomina allora un Presidente ad interim fino alla formazione del nuovo Collegio.',
          },
        ],
      },
      {
        tipo: 'highlight',
        colore: '#003FA3',
        testo: 'Il paradosso della Commissione: è l\'istituzione più indipendente dai governi nazionali (i Commissari non ricevono istruzioni dagli Stati), ma è formata proprio dai governi nazionali. La sua legittimità democratica è indiretta: deriva dal voto di investitura del PE eletto direttamente dai cittadini.',
      },
    ],
  },

  // ── 11. PROCEDURA LEGISLATIVA ────────────────────────────────────────────────
  {
    id: 'procedura-legislativa',
    titolo: 'La procedura legislativa ordinaria',
    colore: '#a78bfa',
    bg: 'rgba(167,139,250,0.08)',
    icon: '📋',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "La procedura legislativa ordinaria (PLO) — ex codecisione — è il meccanismo standard con cui l'UE produce regolamenti, direttive e decisioni. Colloca Parlamento e Consiglio su un piano di parità: entrambi devono approvare lo stesso testo. Si articola in tre possibili letture e, se necessario, una fase di conciliazione.",
      },
      {
        tipo: 'box',
        label: 'Gli atti legislativi: regolamento, direttiva, decisione',
        colore: '#a78bfa',
        contenuto:
          'Il regolamento è direttamente applicabile in tutti gli Stati senza necessità di recepimento. La direttiva vincola gli Stati quanto all\'obiettivo ma lascia loro libertà sui mezzi: va recepita entro il termine indicato con una legge nazionale. La decisione è vincolante solo per i destinatari indicati (uno Stato, un\'impresa, una persona). Le raccomandazioni e i pareri non sono vincolanti.',
      },
      {
        tipo: 'lista',
        items: [
          {
            titolo: 'Proposta della Commissione',
            testo: 'Solo la Commissione può presentare la proposta (monopolio di iniziativa). Prima della proposta formale la Commissione consulta parti sociali, esperti, pubblico (consultazione pubblica) e pubblica una valutazione d\'impatto. La proposta viene trasmessa simultaneamente al PE e al Consiglio, e ai parlamenti nazionali (che possono emettere un parere motivato entro 8 settimane — meccanismo del "cartellino giallo").',
          },
          {
            titolo: 'Prima lettura al Parlamento',
            testo: 'La commissione parlamentare competente nomina un relatore che elabora un progetto di relazione con emendamenti. Il PE vota in seduta plenaria a maggioranza semplice. Il PE può: approvare senza modifiche (legge approvata se il Consiglio fa lo stesso), adottare emendamenti, o respingere la proposta. La posizione del PE in prima lettura viene trasmessa al Consiglio.',
          },
          {
            titolo: 'Prima lettura al Consiglio',
            testo: 'Il Consiglio esamina la posizione del PE. Se la approva integralmente, l\'atto è adottato. Se intende modificarla, adotta una "posizione del Consiglio in prima lettura" che viene comunicata al PE. Il Consiglio agisce normalmente a maggioranza qualificata, salvo per materie che richiedono unanimità.',
          },
          {
            titolo: 'Seconda lettura al Parlamento (3 mesi)',
            testo: 'Il PE ha 3 mesi (prorogabili a 4) per esaminare la posizione del Consiglio. Può: approvare o non pronunciarsi (l\'atto è adottato nella versione del Consiglio); respingere a maggioranza assoluta (l\'atto non è adottato — fallimento); adottare emendamenti a maggioranza assoluta e trasmetterli al Consiglio.',
          },
          {
            titolo: 'Seconda lettura al Consiglio (3 mesi)',
            testo: 'Se il PE ha emendato, il Consiglio ha 3 mesi. Può: approvare tutti gli emendamenti del PE a maggioranza qualificata (o unanimità se la Commissione ha parere contrario) → l\'atto è adottato; non approvare → si apre la conciliazione.',
          },
          {
            titolo: 'Conciliazione (21 giorni)',
            testo: 'Si riunisce il Comitato di conciliazione: delegazione paritetica di PE (co-presiduta dal Vicepresidente PE) e Consiglio (rappresentanti dei 27 governi). La Commissione partecipa come mediatore. Il Comitato ha 21 giorni per concordare un testo comune. Se non ci riesce, l\'atto decade definitivamente.',
          },
          {
            titolo: 'Terza lettura (6 settimane)',
            testo: 'Se il Comitato approva un testo comune, PE (a maggioranza semplice) e Consiglio (a MQ) devono approvarlo entrambi nelle 6 settimane successive, senza possibilità di ulteriori emendamenti. Se uno dei due non approva, l\'atto decade. In pratica quasi nulla arriva alla terza lettura: la grande maggioranza delle leggi UE viene approvata in prima lettura attraverso accordi informali chiamati "trilogo".',
          },
          {
            titolo: 'Il trilogo — la vera sede della legislazione UE',
            testo: 'Prima ancora che il PE voti formalmente in prima lettura, negoziatori di PE, Consiglio e Commissione si incontrano in riunioni informali a tre (trilogo). Quasi l\'80% degli atti è adottato grazie a un accordo raggiunto in trilogo e poi formalizzato in prima lettura. Il trilogo accelera enormemente il processo ma è criticato per la scarsa trasparenza: avviene a porte chiuse, senza stenografato pubblico.',
          },
        ],
      },
      {
        tipo: 'confronto',
        coloreLeft: '#a78bfa',
        coloreRight: '#FFD700',
        left: {
          label: 'Procedura ordinaria (PLO)',
          items: [
            'Co-decisione PE + Consiglio',
            'Commissione ha monopolio di iniziativa',
            'Maggioranza qualificata al Consiglio',
            'Materie: mercato interno, ambiente, trasporti…',
            'La grande maggioranza degli atti UE',
          ],
        },
        right: {
          label: 'Procedure speciali',
          items: [
            'Consultazione: PE solo consultato (fiscalità, PESC)',
            'Approvazione: PE vota sì/no senza emendamenti',
            'Unanimità al Consiglio in molte proc. speciali',
            'Materie: revisione trattati, ammissione nuovi Stati',
            'Quadro Finanziario Pluriennale: approvazione PE',
          ],
        },
      },
    ],
  },

  // ── 12. BCE ──────────────────────────────────────────────────────────────────
  {
    id: 'bce',
    titolo: 'La Banca Centrale Europea (BCE)',
    colore: '#FFD700',
    bg: 'rgba(255,215,0,0.08)',
    icon: '💶',
    blocchi: [
      {
        tipo: 'testo',
        contenuto:
          "La BCE è la banca centrale dei 20 Paesi che hanno adottato l'euro (Eurozona). Fondata nel 1998 con sede a Francoforte, ha come mandato primario la stabilità dei prezzi — definita come inflazione vicina al 2% nel medio termine. È l'istituzione più indipendente dell'intero sistema UE: l'art. 130 TFUE vieta esplicitamente a qualsiasi istituzione politica di impartirle istruzioni.",
      },
      {
        tipo: 'cards',
        items: [
          {
            titolo: 'Consiglio Direttivo — il cuore decisionale',
            testo: 'Organo di governo principale della BCE. Composto dal Comitato Esecutivo (6 membri: Presidente, Vicepresidente e 4 consiglieri) più i governatori delle banche centrali nazionali dei 20 Paesi dell\'Eurozona (totale 26 componenti). Si riunisce ogni 6 settimane per le decisioni di politica monetaria. I governatori delle banche centrali dei Paesi più grandi votano a rotazione (sistema di rotation dal 2015). Le decisioni si prendono a maggioranza semplice; in caso di parità decide il Presidente.',
            colore: '#FFD700',
            badge: 'Governance',
          },
          {
            titolo: 'Comitato Esecutivo',
            testo: 'I 6 membri del Comitato Esecutivo sono nominati dal Consiglio Europeo a maggioranza qualificata su raccomandazione del Consiglio UE, previo parere del PE e del Consiglio Direttivo. Mandato di 8 anni non rinnovabile — una garanzia di indipendenza. Gestisce le operazioni quotidiane e attua la politica monetaria definita dal Consiglio Direttivo. Il Presidente (attualmente Christine Lagarde) rappresenta la BCE all\'esterno e presiede le riunioni.',
            colore: '#003FA3',
            badge: 'Comitato Esecutivo',
          },
          {
            titolo: 'Strumenti di politica monetaria — tassi di interesse',
            testo: 'La BCE fissa tre tassi chiave: il tasso sulle operazioni di rifinanziamento principale (MRO rate — il "tasso BCE" citato nei media); il tasso sulla deposit facility (tasso che le banche ricevono per depositare riserve overnight presso la BCE — strumento usato nella politica dei tassi negativi 2014–2022); il tasso sul marginal lending facility (tasso per i prestiti overnight alle banche). Alzare i tassi raffredda l\'economia e riduce l\'inflazione; abbassarli la stimola.',
            colore: '#22c55e',
            badge: 'Tassi',
          },
          {
            titolo: 'Quantitative Easing — acquisto di titoli',
            testo: 'Quando i tassi sono già a zero (zero lower bound), la BCE acquista titoli di Stato e obbligazioni societarie sul mercato secondario per immettere liquidità nel sistema (QE). Programmi principali: APP (Asset Purchase Programme, dal 2015); PEPP (Pandemic Emergency Purchase Programme, 2020–2022, 1.850 miliardi, risposta alla pandemia). Il QE abbassa i rendimenti dei titoli di Stato e stimola il credito privato. Molto controverso: la Corte Costituzionale tedesca lo ha messo in discussione nel 2020 (sentenza Weiss).',
            colore: '#f97316',
            badge: 'QE',
          },
          {
            titolo: 'TLTRO — Operazioni mirate di rifinanziamento',
            testo: 'Le Targeted Longer-Term Refinancing Operations offrono alle banche commerciali prestiti a lungo termine (2–3 anni) a tassi agevolati, a condizione che le banche usino la liquidità per erogare credito all\'economia reale (no prestiti ai governi). Strumento usato intensivamente dal 2016 al 2022 per stimolare il credito a imprese e famiglie.',
            colore: '#a78bfa',
            badge: 'TLTRO',
          },
          {
            titolo: 'TPI e OMT — Strumenti anti-frammentazione',
            testo: 'Lo spread tra i rendimenti dei titoli di Stato periferici (Italia, Spagna) e tedeschi può diventare destabilizzante. La BCE ha due strumenti di emergenza: OMT (Outright Monetary Transactions, 2012, introdotto dal "whatever it takes" di Draghi — mai usato formalmente ma cruciale per fermare la crisi dell\'euro); TPI (Transmission Protection Instrument, 2022 — acquisti mirati di titoli per evitare una frammentazione ingiustificata dei mercati obbligazionari).',
            colore: '#ef4444',
            badge: 'Anti-spread',
          },
          {
            titolo: 'Supervisione bancaria — SSM',
            testo: 'Dal novembre 2014 la BCE supervisiona direttamente le circa 110 banche più grandi dell\'Eurozona nell\'ambito del Meccanismo di Vigilanza Unico (SSM). Per le banche minori la supervisione spetta alle autorità nazionali, in coordinamento con la BCE. È il pilastro della Banking Union europea. La BCE può revocare le licenze bancarie e imporre requisiti patrimoniali aggiuntivi.',
            colore: '#38bdf8',
            badge: 'Banking Union',
          },
        ],
      },
      {
        tipo: 'box',
        label: 'Indipendenza e mandato — il dibattito politico',
        colore: '#FFD700',
        contenuto:
          'L\'indipendenza della BCE è sancita dall\'art. 130 TFUE: nessuna istituzione UE o governo nazionale può impartirle istruzioni. Il mandato primario è la stabilità dei prezzi. Solo dopo, "senza pregiudicare" tale obiettivo, la BCE può supportare le politiche economiche generali dell\'UE (crescita, occupazione). Questo disegno istituzionale — mutuato dalla Bundesbank tedesca — è contestato da chi vorrebbe una banca centrale con doppio mandato (come la Fed americana: piena occupazione + stabilità prezzi). Durante la pandemia e la guerra in Ucraina il perimetro del mandato è stato oggetto di acceso dibattito politico.',
      },
      {
        tipo: 'highlight',
        colore: '#FFD700',
        testo: '"Whatever it takes to preserve the euro. And believe me, it will be enough." — Mario Draghi, 26 luglio 2012. Queste parole — pronunciate prima che l\'OMT fosse formalmente adottato — bastarono da sole a fermare la crisi speculativa sui titoli di Stato italiani e spagnoli. Il caso più famoso di forward guidance (comunicazione come strumento di politica monetaria).',
      },
    ],
  },
];

export default function UnioneEuropeaPage() {
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
            background: 'linear-gradient(135deg, #0a1428, #0d1a38)',
            borderRadius: 28,
            padding: '28px 24px',
            border: '0.5px solid rgba(255,215,0,0.2)',
            marginBottom: 24,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -50, right: -50,
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,63,163,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              display: 'inline-block',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: 99,
              padding: '4px 14px',
              fontSize: 9, letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#FFD700', fontWeight: 700, marginBottom: 14,
            }}>
              Organizzazione sovranazionale
            </div>

            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 10 }}>
              Unione<br />Europea
            </div>

            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 20 }}>
              Fondata sui Trattati di Roma del 1957, riformata da Maastricht (1992) e
              Lisbona (2009). 27 Stati membri, 450 milioni di cittadini. Mercato unico,
              moneta comune per 20 Paesi, e il più avanzato sistema di integrazione
              sovranazionale mai realizzato.
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { num: 27, label: 'Stati membri', colore: '#003FA3' },
                { num: 12, label: 'sezioni', colore: '#FFD700' },
                { num: 20, label: 'Paesi €', colore: '#22c55e' },
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
                            borderLeft: `3px solid ${blocco.colore}`, paddingLeft: 14,
                            background: `${blocco.colore}08`, borderRadius: '0 10px 10px 0',
                            padding: '12px 12px 12px 16px',
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
            background: 'linear-gradient(135deg, rgba(0,63,163,0.05), rgba(255,215,0,0.05))',
            borderRadius: 18, padding: '18px 16px',
            border: '0.5px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 10 }}>
              Nota
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              Il Consiglio d'Europa e la CEDU{' '}
              <span style={{ color: '#fb7185', fontWeight: 700 }}>non fanno parte dell'UE</span>.
              Sono istituzioni separate con 47 Stati membri. La Corte EDU di Strasburgo e la
              Corte di Giustizia UE di Lussemburgo sono due organi giurisdizionali distinti
              con competenze diverse.
            </p>
          </div>

        </div>
        <Footer />
      </div>
    </>
  );
}
