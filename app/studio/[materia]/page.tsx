'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// ─── FLASH CARD DATA ──────────────────────────────────────────────────────────

const flashcardsData: Record<string, { domanda: string; risposta: string }[]> = {

  'diritto-internazionale': [
    // INTRODUZIONE & SOGGETTI
    { domanda: "Cos'è il diritto internazionale?", risposta: "Il diritto della 'comunità degli Stati': regola i rapporti fra Stati creando diritti ed obblighi. Trova fondamento nella cooperazione degli Stati che si impegnano a rispettarlo (es. art. 10 Cost.)." },
    { domanda: "Quali sono le 3 funzioni del diritto internazionale?", risposta: "A) Funzione normativa (produzione norme); B) Funzione di accertamento giudiziario (arbitrato, CIG); C) Attuazione coattiva (repressione violazioni, basata sull'autotutela degli Stati)." },
    { domanda: "Quali sono i requisiti per la personalità giuridica internazionale di uno Stato?", risposta: "1) Effettività: esercizio effettivo del potere sulla comunità; 2) Indipendenza e sovranità esterna: l'ordinamento trova fondamento nella propria Costituzione, non in quella di un altro Stato." },
    { domanda: "Il riconoscimento è necessario per la personalità giuridica internazionale?", risposta: "No. Il riconoscimento è un atto politico. Ciò che conta è l'effettività (controllo del territorio) e l'indipendenza, non il riconoscimento formale da parte degli altri Stati." },
    { domanda: "I governi in esilio hanno personalità giuridica internazionale?", risposta: "No. Non hanno effettiva sovranità sul territorio. La Cassazione (1985-86) ha ammesso per l'OLP solo una soggettività limitata, funzionale all'autodeterminazione, negando immunità diplomatiche piena." },
    { domanda: "Cos'è il principio di autodeterminazione?", risposta: "Regola di d. int. consuetudinario e convenzionale che riconosce ai popoli sottoposti a dominazione straniera il diritto di diventare indipendenti. Si applica solo ai territori in cui la dominazione non risale a prima della II Guerra Mondiale." },
    { domanda: "Le organizzazioni internazionali hanno personalità giuridica?", risposta: "Sì. Enti come ONU e UE sono soggetti distinti dai loro membri, con personalità autonoma riconosciuta anche dalla CIG, funzionale allo svolgimento dei loro scopi istituzionali." },

    // FONTI – CONSUETUDINE
    { domanda: "Quali sono i due elementi costitutivi della consuetudine internazionale?", risposta: "1) Prassi (diuturnitas): comportamento ripetuto, costante e coerente degli Stati; 2) Opinio juris sive necessitatis: convinzione che quel comportamento sia giuridicamente dovuto, non solo opportuno." },
    { domanda: "Perché la sola prassi non basta a formare la consuetudine?", risposta: "Senza opinio juris non si distingue un mero uso da una norma giuridica. La ripetizione può dipendere da cortesia o convenienza. Per questo gli Stati accompagnano certi atti con 'dichiarazioni di neutralizzazione'." },
    { domanda: "Come si accerta l'opinio juris?", risposta: "Non si 'legge nella mente' dello Stato: si ricostruisce da dichiarazioni ufficiali, posizioni in sede ONU, motivazioni di atti normativi interni, argomentazioni in contenziosi, proteste o acquiescenza qualificata." },
    { domanda: "Cos'è il 'persistent objector'?", risposta: "Lo Stato che si oppone in modo manifesto e costante durante la formazione di una regola consuetudinaria potrebbe non esserne vincolato. È una figura controversa e non unanimemente accettata nella dottrina." },
    { domanda: "Qual è la funzione del soft law rispetto alla consuetudine?", risposta: "Il soft law (raccomandazioni, dichiarazioni) può avere 3 effetti: 1) Dichiarativo (fotografa norma già esistente); 2) Cristallizzante (chiude un processo in corso); 3) Generatore (avvia prassi+opinio juris). Non è mai fonte autonoma vincolante." },
    { domanda: "Le convenzioni di codificazione vincolano gli Stati non parti?", risposta: "No automaticamente. Vincolano solo le parti. Possono valere come diritto generale solo se le singole disposizioni corrispondono a una consuetudine accertata con prassi e opinio juris (es. caso Piattaforma Continentale Mar del Nord)." },

    // FONTI – PRINCIPI, EQUITÀ, JUS COGENS
    { domanda: "Quali sono i due tipi di principi generali del diritto internazionale?", risposta: "1) Principi comuni agli ordinamenti interni (art. 38 St. CIG): devono essere diffusi uniformemente e sentiti come obbligatori anche sul piano internazionale. 2) Principi propri dell'ord. internazionale: ricavati per induzione dal tessuto normativo internazionale esistente." },
    { domanda: "L'equità è fonte del diritto internazionale?", risposta: "No, come fonte autonoma di produzione. È ammessa solo come: a) criterio interpretativo (infra/secundum legem); b) base decisionale se le parti autorizzano ex aequo et bono. Il suo ruolo tipico è propulsivo nella formazione della consuetudine." },
    { domanda: "Cos'è lo jus cogens?", risposta: "Norme che esprimono valori fondamentali della comunità internazionale, collocate gerarchicamente al vertice. Prevalgono su tutte le altre fonti e limitano la libertà degli Stati. Es.: divieto di tortura, genocidio, trattati istitutivi di schiavitù sono nulli se li violano." },

    // TRATTATI
    { domanda: "Qual è la differenza tra accordo formale e accordo in forma semplificata?", risposta: "L'accordo formale richiede ratifica solenne e intervento del Parlamento. L'accordo in forma semplificata (executive agreement) entra in vigore con la sola firma o scambio di note, senza ratifica parlamentare." },
    { domanda: "Cosa sono le riserve ai trattati?", risposta: "Dichiarazioni unilaterali con cui uno Stato esclude o modifica l'effetto giuridico di alcune clausole. Sono ammesse salvo che il trattato le vieti, siano incompatibili con l'oggetto e lo scopo del trattato, o altri contraenti le abbiano escluse." },
    { domanda: "Quali sono le cause di invalidità dei trattati?", risposta: "Violenza (fisica o psicologica) su rappresentanti; corruzione del rappresentante; errore essenziale; dolo; e la causa più grave: contrasto con lo jus cogens (norma imperativa generale preesistente → nullità assoluta)." },
    { domanda: "Cosa prevede il principio pacta sunt servanda?", risposta: "Ogni trattato in vigore vincola le parti e deve essere eseguito in buona fede. È la norma fondamentale del diritto dei trattati, codificata all'art. 26 della Convenzione di Vienna del 1969." },
    { domanda: "Cosa significa clausola rebus sic stantibus?", risposta: "Uno Stato può invocare il mutamento fondamentale delle circostanze come causa di estinzione del trattato, ma solo se: le circostanze costituivano base essenziale del consenso, il mutamento è imprevedibile e radicalmente trasforma gli obblighi." },

    // ADATTAMENTO NELL'ORDINAMENTO ITALIANO
    { domanda: "Come l'ordinamento italiano si adatta al diritto internazionale generale?", risposta: "Mediante adattamento automatico: art. 10 co. 1 Cost. dispone che l'ordinamento italiano si conforma alle norme internazionali generalmente riconosciute. Le norme consuetudinarie entrano direttamente nell'ordinamento senza atto di recepimento." },
    { domanda: "Come l'ordinamento italiano si adatta ai trattati?", risposta: "Mediante adattamento speciale: con ordine di esecuzione (legge o decreto). Le norme pattizie non entrano automaticamente; richiedono un provvedimento interno che le rende applicabili. Hanno rango pari all'atto di recepimento (di solito legge ordinaria)." },
    { domanda: "Qual è il rango dei trattati internazionali nella gerarchia delle fonti italiane?", risposta: "Dopo la riforma del 2001 (art. 117 Cost.), i trattati sono 'norme interposte': resistono alle leggi ordinarie successive ma cedono di fronte alla Costituzione. Se una legge viola un trattato, è incostituzionale per violazione dell'art. 117." },

    // RESPONSABILITÀ INTERNAZIONALE
    { domanda: "Quali sono gli elementi dell'illecito internazionale?", risposta: "1) Elemento oggettivo: violazione di un obbligo internazionale vigente per lo Stato; 2) Elemento soggettivo: il fatto è attribuibile allo Stato. Non è richiesta la colpa; la responsabilità è oggettiva salvo eccezioni." },
    { domanda: "Quando è attribuibile allo Stato il comportamento di un individuo privato?", risposta: "Solo se l'individuo agiva sotto il controllo effettivo dello Stato (test Nicaragua, CIG 1986) o sotto la direzione/controllo complessivo dell'operazione (test Tadić, Trib. penale per la ex-Jugoslavia). Non basta il controllo generico." },
    { domanda: "Quali sono le cause di esclusione dell'illecito?", risposta: "Consenso dello Stato leso; legittima difesa; contromisure; forza maggiore; stato di necessità; distress. Tali circostanze escludono l'illiceità ma non estinguono l'obbligo risarcitorio se causano danno materiale." },
    { domanda: "Cosa sono le contromisure?", risposta: "Misure di autotutela: lo Stato leso può sospendere temporaneamente obblighi nei confronti dello Stato responsabile, in risposta all'illecito, per indurlo a cessare la violazione e riparare. Devono essere proporzionali e non possono violare obblighi erga omnes." },

    // IMMUNITÀ E DIRITTI UMANI
    { domanda: "Qual è la regola sull'immunità dalla giurisdizione civile degli Stati?", risposta: "Distinzione tra atti iure imperii (atti sovrani: immunità assoluta) e atti iure gestionis (atti commerciali/privati: nessuna immunità). L'immunità assoluta è tramontata; oggi prevale il criterio della natura dell'atto." },
    { domanda: "I crimini internazionali gravi possono escludere l'immunità?", risposta: "Questione dibattuta. La CIG (Germania c. Italia, 2012) ha ribadito l'immunità anche per crimini di guerra e violazioni jus cogens. Parte della dottrina sostiene invece che lo jus cogens prevalga sull'immunità, ma non è il diritto positivo vigente." },
    { domanda: "Cosa sono le obbligazioni erga omnes?", risposta: "Obblighi che uno Stato ha nei confronti della comunità internazionale nel suo insieme (es. divieto di genocidio, apartheid). Qualsiasi Stato può invocarle e reagire alla loro violazione, non solo lo Stato direttamente leso." },
    { domanda: "Qual è la struttura della Corte Internazionale di Giustizia?", risposta: "15 giudici eletti da AG e CS dell'ONU per 9 anni. Ha competenza contenzioso (solo tra Stati che abbiano accettato) e consultiva (pareri a organi ONU). Le sentenze sono vincolanti ma dipende dallo Stato per l'esecuzione." },

    // ORGANIZZAZIONI INTERNAZIONALI & ONU
    { domanda: "Quali sono gli organi principali dell'ONU?", risposta: "Assemblea Generale, Consiglio di Sicurezza, Segretariato, Corte Internazionale di Giustizia, Consiglio Economico e Sociale (ECOSOC), Consiglio di Amministrazione fiduciaria (inattivo)." },
    { domanda: "Come funziona il veto nel Consiglio di Sicurezza ONU?", risposta: "Le risoluzioni su questioni sostanziali richiedono 9 voti favorevoli su 15 inclusi tutti i 5 membri permanenti (USA, Russia, Cina, UK, Francia). Il voto contrario di uno dei 5 blocca la risoluzione (diritto di veto)." },
    { domanda: "Qual è la differenza tra raccomandazioni e decisioni vincolanti del CS?", risposta: "Le risoluzioni del CS adottate ai sensi del Capitolo VII (pace e sicurezza internazionale) sono vincolanti per tutti gli Stati membri (art. 25 Carta ONU). Le raccomandazioni dell'AG non sono giuridicamente vincolanti." },
    { domanda: "Cosa prevede il divieto di uso della forza (art. 2 co. 4 Carta ONU)?", risposta: "Gli Stati devono astenersi dall'uso della forza contro l'integrità territoriale o l'indipendenza politica di qualsiasi Stato. Eccezioni: legittima difesa individuale/collettiva (art. 51) e autorizzazione del Consiglio di Sicurezza (Cap. VII)." },

    // DIRITTO DEL MARE
    { domanda: "Qual è l'estensione del mare territoriale?", risposta: "12 miglia marine dalla linea di base. Lo Stato costiero esercita sovranità piena, ma gli altri Stati godono del diritto di passaggio inoffensivo (navigazione continua e rapida non pregiudizievole per la pace e sicurezza)." },
    { domanda: "Cosa è la Zona Economica Esclusiva (ZEE)?", risposta: "Zona fino a 200 miglia marine: lo Stato costiero ha diritti sovrani per l'esplorazione e sfruttamento delle risorse naturali (pesca, petrolio), ma non sovranità piena. Gli altri Stati conservano libertà di navigazione e sorvolo." },
    { domanda: "Cos'è la piattaforma continentale?", risposta: "Il prolungamento sommerso del territorio terrestre fino a 200 mn (o fino a 350 mn se la piattaforma naturale si estende oltre). Lo Stato costiero ha diritti esclusivi sulle risorse del fondo e sottosuolo marino." },
    { domanda: "Cosa sono le acque internazionali (alto mare)?", risposta: "La porzione di mare al di là della ZEE, aperta a tutti gli Stati (libertà di navigazione, pesca, sorvolo, posa cavi). Res communis: non soggetta ad alcuna sovranità. Regolata principalmente dalla UNCLOS (1982)." },
  ],

  'diritto-internazionale-privato': [
    // FONDAMENTI
    { domanda: "Cos'è il diritto internazionale privato?", risposta: "Diritto relazionale speciale che regola il modo in cui i sistemi giuridici statali si rapportano tra loro per le fattispecie di diritto privato con elementi di internazionalità. Risolve 4 problemi: giurisdizione, legge applicabile, efficacia decisioni straniere, cooperazione tra autorità." },
    { domanda: "Quali sono i 4 problemi del diritto internazionale privato?", risposta: "1) Giurisdizione: quale autorità è competente; 2) Legge applicabile: quale ordinamento regola la fattispecie; 3) Efficacia delle decisioni straniere: a quali condizioni valgono all'estero; 4) Cooperazione tra autorità di Stati diversi." },
    { domanda: "Qual è la principale fonte interna italiana di d.i.p.?", risposta: "Legge n. 218/1995: determina l'ambito della giurisdizione italiana, pone i criteri per la legge applicabile e disciplina l'efficacia delle sentenze straniere. Cede però alle norme uniformi europee e convenzionali." },

    // FONTI E COORDINAMENTO
    { domanda: "Come si coordinano le fonti nel d.i.p. italiano?", risposta: "Gerarchia: 1) Convenzioni internazionali (art. 2 L. 218/95 le fa prevalere); 2) Regolamenti UE (primato del diritto dell'Unione); 3) Legge 218/1995 (diritto comune). Il giudice italiano disapplica le norme interne incompatibili con il diritto UE." },
    { domanda: "Qual è il ruolo del Trattato di Amsterdam per il d.i.p.?", risposta: "Ha attribuito all'UE il potere di adottare misure nel settore della cooperazione giudiziaria in materia civile (art. 81 TFUE). Da qui nascono i Regolamenti Bruxelles I bis, Roma I, Roma II, che hanno quasi completamente sostituito le norme interne." },
    { domanda: "Cosa sono le clausole di disconnessione?", risposta: "Previsioni in convenzioni internazionali che escludono l'applicazione della convenzione quando la fattispecie rientra nell'ambito di uno strumento concorrente (tipicamente del diritto UE), lasciando agli Stati membri libertà di applicare le proprie regole uniformi." },

    // GIURISDIZIONE – BRUXELLES I BIS
    { domanda: "Qual è il principio generale di giurisdizione nel Reg. Bruxelles I bis?", risposta: "Actor sequitur forum rei: la competenza spetta ai giudici dello Stato membro del domicilio del convenuto (art. 4). È il foro generale, ma non esclusivo: concorrono i fori speciali degli artt. 7, 8, 9." },
    { domanda: "Cos'è la competenza speciale in materia contrattuale (art. 7 Brux. I bis)?", risposta: "Il convenuto può essere citato nel luogo in cui l'obbligazione è stata o doveva essere eseguita. Per compravendita: luogo di consegna. Per servizi: luogo di prestazione. Se il luogo è in uno Stato terzo, si applica la regola generale (art. 7.1.a)." },
    { domanda: "Cos'è la 'teoria dell'ubiquità' in materia di illeciti (art. 7.2)?", risposta: "La competenza spetta al giudice del 'luogo in cui l'evento dannoso è avvenuto', interpretato dalla CIG (Mines de Potasse) come sia il luogo del fatto generatore sia il luogo della lesione. Il danneggiato sceglie il foro." },
    { domanda: "Cosa sono le competenze esclusive (art. 24 Brux. I bis)?", risposta: "Fori inderogabili a prescindere dal domicilio del convenuto. Es.: controversie su diritti reali immobiliari → giudici dello Stato in cui è situato l'immobile. Nulli sono eventuali accordi che vi derogano; qualunque altro giudice deve dichiararsi incompetente d'ufficio." },
    { domanda: "A quali condizioni è valido un accordo di proroga della competenza (art. 25)?", risposta: "Deve designare giudici di uno Stato membro; essere stipulato per iscritto (o forma equipollente); riferirsi a controversie determinate. Produce effetto di proroga (al giudice scelto) e di deroga (agli altri giudici). È indipendente dalla validità del contratto principale." },
    { domanda: "Cos'è la proroga tacita (art. 26)?", risposta: "Se il convenuto compare in giudizio senza eccepire l'incompetenza, il giudice acquista competenza per proroga tacita. Condizioni: convenuto si costituisce + omette di contestare la giurisdizione nel primo atto difensivo." },
    { domanda: "Come funziona la litispendenza intra-europea (art. 29)?", risposta: "Stessa causa tra stesse parti pendente in due SM: il giudice adito per secondo sospende il procedimento finché il primo non accerta la propria competenza. Se il primo si dichiara competente, il secondo declina. Obiettivo: evitare decisioni incompatibili." },
    { domanda: "Quali sono i motivi di diniego del riconoscimento ex art. 45 Brux. I bis?", risposta: "1) Manifesta contrarietà all'ordine pubblico; 2) Violazione del contraddittorio (convenuto non ha potuto difendersi); 3) Incompatibilità con decisione locale precedente; 4) Violazione di fori esclusivi o fori protettivi (consumatori, lavoratori, assicurati)." },

    // LEGGE APPLICABILE – PRINCIPI GENERALI
    { domanda: "Cosa sono le norme di conflitto?", risposta: "Norme che identificano il sistema giuridico da cui trarre la disciplina sostanziale della fattispecie. Sono generalmente bilaterali (indicano la legge applicabile indipendentemente dal paese) e operano localizzando un elemento della fattispecie (criterio di collegamento)." },
    { domanda: "Cos'è la qualificazione nel d.i.p.?", risposta: "L'operazione intellettuale con cui si stabilisce sotto quale categoria della norma di conflitto ricade la fattispecie. Per le norme interne le categorie si interpretano secondo la lex fori; per le norme uniformi in modo autonomo (secondo i principi del sistema a cui appartengono)." },
    { domanda: "Cos'è il rinvio (renvoi) e come funziona in Italia?", risposta: "Le norme di conflitto dello Stato richiamato rinviano a un diverso ordinamento. In Italia (art. 13 L. 218/95): si accetta il rinvio indietro (alla lex fori) sempre; il rinvio in avanti (a Stato terzo) solo se il terzo Stato accetta. Escluso quando la legge è scelta dalle parti." },
    { domanda: "Cos'è il limite dell'ordine pubblico nel d.i.p.?", risposta: "Clausola che esclude l'applicazione della legge straniera richiamata quando produrrebbe effetti manifestamente incompatibili con i principi fondamentali dell'ordinamento del foro. Ha carattere eccezionale, geograficamente e temporalmente relativo, e opera solo a valle del richiamo." },
    { domanda: "Cosa sono le norme di applicazione necessaria?", risposta: "Norme materiali che si applicano a prescindere dalla legge designata dalla norma di conflitto, perché lo Stato le ritiene cruciali per la salvaguardia dei suoi interessi pubblici. Operano a monte della norma di conflitto. Es.: norme antitrust, tutela dei consumatori, protezione dati." },

    // ROMA I – CONTRATTI
    { domanda: "Qual è il principio cardine del Reg. Roma I per i contratti?", risposta: "Autonomia delle parti: il contratto è disciplinato dalla legge scelta dalle parti (art. 3). La scelta può essere espressa o tacita (risultare chiaramente dalle circostanze). Le parti possono scegliere la legge di qualsiasi Stato, anche senza collegamenti con la fattispecie." },
    { domanda: "In assenza di scelta, quale legge si applica ai contratti (Roma I)?", risposta: "Art. 4: per i contratti nominati (vendita, servizi, locazione immobili, distribuzione, franchising) si applicano criteri specifici predeterminati. Per gli altri: legge della residenza abituale del prestatore caratteristico. Clausola di eccezione se il contratto ha nessi manifestamente più stretti con altro paese." },
    { domanda: "Qual è la legge applicabile ai contratti di consumo (Roma I, art. 6)?", risposta: "Legge del paese di residenza abituale del consumatore (protezione minima garantita), purché il professionista svolga o diriga le sue attività verso quel paese. Una scelta di legge diversa non priva il consumatore delle tutele imperative della sua legge." },
    { domanda: "Come si determina la residenza abituale di una società ai fini di Roma I?", risposta: "Art. 19: coincide con il luogo dell'amministrazione centrale. Se il contratto è concluso tramite una filiale/succursale, la residenza abituale rilevante è il luogo di quest'ultima (non della sede centrale)." },
    { domanda: "Cosa sono le norme di applicazione necessaria nel Roma I (art. 9)?", risposta: "Par. 2: si applicano sempre le norme imperative del foro. Par. 3: si può dare efficacia anche a quelle dello Stato di adempimento del contratto, se ne è impossibile o illegale l'adempimento, previa valutazione discrezionale del giudice sulla loro natura." },

    // ROMA II – ILLECITI EXTRACONTRATTUALI
    { domanda: "Qual è la regola generale di Roma II per i fatti illeciti (art. 4)?", risposta: "Si applica la legge del paese in cui il danno si verifica (lex loci damni). Non rileva dove si è verificata la condotta né dove si sentono le conseguenze indirette. Deroga: se entrambe le parti risiedono nello stesso Stato, si applica la legge di tale Stato." },
    { domanda: "Come funziona la clausola di eccezione di Roma II (art. 4.3)?", risposta: "Se dal complesso delle circostanze risulta chiaramente che l'illecito ha collegamenti manifestamente più stretti con un paese diverso da quello indicato dalla regola di base, si applica la legge di quel diverso paese. Es.: relazione preesistente tra le parti." },
    { domanda: "Qual è la regola di conflitto per gli illeciti concorrenziali (Roma II, art. 6)?", risposta: "Concorrenza sleale: legge del paese sul cui mercato il concorrente o il consumatore è leso. Restrizioni della concorrenza (antitrust): legge del mercato interessato. Non è ammessa scelta di legge." },

    // EFFICACIA DECISIONI STRANIERE – DIRITTO COMUNE
    { domanda: "Quali sono le condizioni per il riconoscimento automatico delle sentenze straniere in Italia (art. 64 L. 218/95)?", risposta: "a) Competenza internazionale del giudice straniero; b) Atto introduttivo portato a conoscenza del convenuto; c) Diritti essenziali della difesa rispettati; d) Passaggio in giudicato; e) No conflitto con giudicato italiano; f) Non contraria all'ordine pubblico italiano." },
    { domanda: "Qual è la differenza tra riconoscimento automatico (art. 64) e procedura di delibazione (art. 67)?", risposta: "Il riconoscimento è automatico se sussistono le condizioni. Se la sentenza non viene spontaneamente eseguita o la sua riconoscibilità è contestata, chiunque vi abbia interesse può chiedere un accertamento in via principale davanti alla corte d'appello competente (art. 67)." },
    { domanda: "Come funziona il riconoscimento automatico nel Reg. Bruxelles I bis?", risposta: "Art. 36: le decisioni di uno SM sono automaticamente riconosciute negli altri senza alcuna procedura. Art. 39: sono anche direttamente esecutive senza exequatur. Il diniego può essere richiesto solo per i motivi tassativi dell'art. 45." },
    { domanda: "Cosa è l'exequatur?", risposta: "Il provvedimento che dichiara una sentenza straniera esecutiva nello Stato richiesto. Nel vecchio regime Bruxelles I era ancora richiesto. Con Bruxelles I bis è stato eliminato per le decisioni tra SM: l'esecutività è automatica. Sopravvive per decisioni da Stati terzi e in alcuni regolamenti (es. Reg. Successioni)." },
  ],
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function FlashCardMateria({ params }: { params: { materia: string } }) {
  const materia = params.materia as string;
  const cards = flashcardsData[materia] ?? [];

  const [indice, setIndice] = useState(0);
  const [girata, setGirata] = useState(false);
  const [sapevo, setSapevo] = useState(0);
  const [nonSapevo, setNonSapevo] = useState(0);
  const [completate, setCompletate] = useState<number[]>([]);
  const [fase, setFase] = useState<'studio' | 'fine'>('studio');

  const titoloMateria: Record<string, string> = {
    'diritto-internazionale': 'Diritto Internazionale',
    'diritto-internazionale-privato': 'Diritto Internazionale Privato',
  };

  const coloreMateria: Record<string, string> = {
    'diritto-internazionale': '#38bdf8',
    'diritto-internazionale-privato': '#a78bfa',
  };

  const colore = coloreMateria[materia] ?? '#38bdf8';
  const titolo = titoloMateria[materia] ?? materia;
  const carta = cards[indice];
  const progresso = cards.length > 0 ? Math.round((completate.length / cards.length) * 100) : 0;

  function giraCarta() { setGirata(!girata); }

  function rispondi(conosco: boolean) {
    if (conosco) setSapevo(s => s + 1);
    else setNonSapevo(s => s + 1);
    setCompletate(prev => [...prev, indice]);
    if (indice + 1 >= cards.length) {
      setFase('fine');
    } else {
      setIndice(i => i + 1);
      setGirata(false);
    }
  }

  function ricomincia() {
    setIndice(0);
    setGirata(false);
    setSapevo(0);
    setNonSapevo(0);
    setCompletate([]);
    setFase('studio');
  }

  if (cards.length === 0) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0d18' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Montserrat, sans-serif' }}>Flash card non ancora disponibili per questa materia.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', background: '#0a0d18', padding: '20px 16px 80px', fontFamily: 'Montserrat, sans-serif' }}>
        <div style={{ maxWidth: 540, margin: '0 auto' }}>

          {/* Header materia */}
          <div style={{ marginBottom: 24, paddingTop: 8 }}>
            <div style={{ fontSize: 11, color: colore, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Studio</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>{titolo}</h1>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{cards.length} flash card</div>
          </div>

          {fase === 'studio' && carta && (
            <>
              {/* Progress bar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{indice + 1} / {cards.length}</span>
                  <span style={{ fontSize: 12, color: colore, fontWeight: 700 }}>{progresso}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progresso}%`, background: colore, borderRadius: 2, transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Carta */}
              <div
                onClick={giraCarta}
                style={{
                  background: girata ? `rgba(${colore === '#38bdf8' ? '56,189,248' : '167,139,250'},0.08)` : 'rgba(255,255,255,0.04)',
                  border: `0.5px solid ${girata ? colore : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 20,
                  padding: '28px 24px',
                  cursor: 'pointer',
                  minHeight: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 10, color: girata ? colore : 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
                  {girata ? '✓ Risposta' : '? Domanda — tocca per girare'}
                </div>
                <div style={{ fontSize: 16, color: '#fff', fontWeight: girata ? 400 : 700, lineHeight: 1.6, flex: 1 }}>
                  {girata ? carta.risposta : carta.domanda}
                </div>
                {!girata && (
                  <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                    Tocca per vedere la risposta
                  </div>
                )}
              </div>

              {/* Bottoni risposta */}
              {girata && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <button
                    onClick={() => rispondi(false)}
                    style={{
                      padding: '14px', borderRadius: 14, border: '0.5px solid rgba(239,68,68,0.4)',
                      background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                      fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}
                  >
                    ✗ Non sapevo
                  </button>
                  <button
                    onClick={() => rispondi(true)}
                    style={{
                      padding: '14px', borderRadius: 14, border: `0.5px solid ${colore}66`,
                      background: `${colore}1a`, color: colore,
                      fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                    }}
                  >
                    ✓ Sapevo
                  </button>
                </div>
              )}

              {/* Contatori */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'rgba(239,68,68,0.07)', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#ef4444' }}>{nonSapevo}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Da ripassare</div>
                </div>
                <div style={{ background: `${colore}0d`, border: `0.5px solid ${colore}33`, borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: colore }}>{sapevo}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Sapevo</div>
                </div>
              </div>
            </>
          )}

          {fase === 'fine' && (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>
                {sapevo >= cards.length * 0.8 ? '🏆' : sapevo >= cards.length * 0.6 ? '👍' : '📚'}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Sessione completata!</h2>
              <div style={{ fontSize: 36, fontWeight: 900, color: colore, marginBottom: 4 }}>
                {sapevo}/{cards.length}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
                {Math.round((sapevo / cards.length) * 100)}% di risposte corrette
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ background: 'rgba(239,68,68,0.07)', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: 14, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#ef4444' }}>{nonSapevo}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Da ripassare</div>
                </div>
                <div style={{ background: `${colore}0d`, border: `0.5px solid ${colore}33`, borderRadius: 14, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: colore }}>{sapevo}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Sapevo</div>
                </div>
              </div>
              <button
                onClick={ricomincia}
                style={{
                  width: '100%', padding: 16, borderRadius: 16,
                  border: `0.5px solid ${colore}66`,
                  background: `${colore}1a`, color: colore,
                  fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                }}
              >
                Ricomincia ↺
              </button>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
