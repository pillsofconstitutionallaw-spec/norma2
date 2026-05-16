'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const sentenze = [
  // ── FONTI DEL DIRITTO ────────────────────────────────────────────────────
  {
    numero: '1/1956',
    titolo: 'Primato della Costituzione',
    tag: 'Fonti del diritto',
    anno: '1956',
    caso: 'Appena operativa, la Corte si trovava davanti a una domanda cruciale: poteva controllare anche le leggi approvate prima dell\'entrata in vigore della Costituzione nel 1948? Le leggi fasciste erano ancora in vigore e molte erano palesemente incompatibili con i nuovi principi costituzionali.',
    principio: 'La Corte risponde sì, senza esitazioni. La Costituzione è la fonte suprema dell\'ordinamento e tutte le leggi — anche quelle anteriori — devono conformarsi ad essa. È la prima sentenza in assoluto della Corte: già con questa pronuncia si afferma che nessuna legge è al riparo dal controllo di costituzionalità, indipendentemente da quando è stata approvata.',
  },
  {
    numero: '360/1996',
    titolo: 'Decreti-legge reiterati',
    tag: 'Fonti del diritto',
    anno: '1996',
    caso: 'Il Governo aveva preso l\'abitudine di reiterare i decreti-legge non convertiti dal Parlamento entro i 60 giorni: invece di lasciarli decadere, ne emanava uno nuovo con lo stesso contenuto, e poi un altro ancora. In questo modo norme provvisorie rimanevano in vigore per anni senza mai passare dall\'approvazione parlamentare.',
    principio: 'La reiterazione sistematica è incostituzionale. Il decreto-legge è uno strumento eccezionale, pensato per casi di necessità e urgenza, e la sua forza dipende dal fatto che il Parlamento deve convertirlo o farlo decadere. Riemetterlo continuamente altera l\'equilibrio tra Governo e Parlamento, svuota il ruolo del legislativo e trasforma uno strumento straordinario in uno ordinario. La Corte pone fine alla prassi.',
  },
  {
    numero: '10/2015',
    titolo: 'Robin Tax e retroattività limitata',
    tag: 'Fonti del diritto',
    anno: '2015',
    caso: 'La cosiddetta "Robin Tax" era un\'addizionale IRES che colpiva le imprese del settore energetico. La Corte la dichiarava incostituzionale, ma si pose un problema serio: l\'effetto retroattivo della sentenza avrebbe obbligato lo Stato a restituire miliardi di euro di imposte già incassate, con un impatto devastante sul bilancio pubblico.',
    principio: 'La Corte dichiara l\'illegittimità ma limita gli effetti nel tempo: la sentenza non travolge i rapporti già esauriti. È una delle applicazioni più esplicite della tecnica della "retroattività limitata": la Corte riconosce che una dichiarazione di incostituzionalità con effetti pieni potrebbe creare danni sistemici superiori al beneficio, e calibra la pronuncia di conseguenza. Decisione molto discussa in dottrina.',
  },

  // ── UNIONE EUROPEA ────────────────────────────────────────────────────────
  {
    numero: '183/1973',
    titolo: 'Frontini',
    tag: 'Unione Europea',
    anno: '1973',
    caso: 'L\'Italia aveva trasferito poteri legislativi alle Comunità europee in base all\'art. 11 della Costituzione, che consente limitazioni di sovranità per favorire la pace e la giustizia tra le nazioni. La questione era: questi trasferimenti di sovranità hanno limiti? Il Parlamento europeo può legiferare su tutto senza che la Corte italiana possa sindacare nulla?',
    principio: 'L\'Italia può consentire limitazioni di sovranità, ma esistono dei confini invalicabili: i principi fondamentali dell\'ordinamento costituzionale e i diritti inviolabili della persona. Se un regolamento europeo violasse questi principi, la Corte italiana si riserva il potere di non applicarlo. Nasce la dottrina dei "controlimiti": il diritto europeo è primato, ma non in modo assoluto.',
  },
  {
    numero: '170/1984',
    titolo: 'Granital',
    tag: 'Unione Europea',
    anno: '1984',
    caso: 'Una legge italiana successiva era in conflitto con un regolamento europeo già in vigore. Il giudice ordinario si chiedeva come comportarsi: doveva sollevare questione di legittimità davanti alla Corte costituzionale, aspettare la sentenza e poi disapplicare? O poteva agire direttamente?',
    principio: 'Svolta decisiva: il giudice ordinario deve disapplicare direttamente la legge italiana incompatibile con il diritto europeo, senza passare dalla Corte costituzionale. I due ordinamenti — italiano ed europeo — sono separati ma coordinati. Il diritto UE prevale, e il giudice comune è abilitato ad applicarlo direttamente. Questo è il sistema che funziona ancora oggi.',
  },
  {
    numero: '232/1989',
    titolo: 'Caso Fragd — Prima applicazione dei controlimiti',
    tag: 'Unione Europea',
    anno: '1989',
    caso: 'Per la prima volta la Corte costituzionale italiana si trova a dover valutare concretamente se una norma comunitaria potrebbe violare un diritto fondamentale garantito dalla Costituzione italiana. Non si trattava di un caso ipotetico: la questione era reale e urgente.',
    principio: 'La Corte applica per la prima volta in modo concreto la dottrina dei controlimiti elaborata in Frontini: i principi fondamentali della Costituzione e i diritti inviolabili dell\'uomo costituiscono un limite al primato del diritto comunitario. Se una norma europea violasse questi principi, la Corte italiana potrebbe dichiararla inapplicabile in Italia. I controlimiti passano dalla teoria alla pratica.',
  },

  // ── DIRITTO INTERNAZIONALE ────────────────────────────────────────────────
  {
    numero: '1146/1988',
    titolo: 'Controlimiti e principi supremi',
    tag: 'Diritto internazionale',
    anno: '1988',
    caso: 'Fino a che punto le norme internazionali — comprese quelle dei trattati — possono incidere sull\'ordinamento italiano? Esiste un nucleo duro della Costituzione che nessuna norma esterna può toccare, nemmeno una legge di revisione costituzionale?',
    principio: 'Sì: esistono principi supremi dell\'ordinamento costituzionale che non possono essere sovvertiti nemmeno da leggi di revisione costituzionale, figurarsi da norme internazionali. Sono un nucleo irriducibile — dignità della persona, separazione dei poteri, diritti fondamentali — che funziona come limite assoluto verso qualsiasi fonte, interna o esterna. È la base teorica di tutta la giurisprudenza sui controlimiti.',
  },
  {
    numero: '238/2014',
    titolo: 'Controlimiti e immunità Germania',
    tag: 'Diritto internazionale',
    anno: '2014',
    caso: 'La Corte internazionale di giustizia aveva stabilito nel 2012 che la Germania godeva di immunità giurisdizionale per i crimini di guerra commessi in Italia durante la Seconda guerra mondiale. I tribunali italiani erano stati condannati per aver giudicato lo Stato tedesco. Le vittime italiane dei crimini nazisti si trovavano così senza tutela: nessun giudice poteva condannare la Germania a risarcirle.',
    principio: 'La Corte applica i controlimiti in modo diretto e coraggioso: l\'immunità assoluta dello Stato straniero, così come interpretata dalla Corte internazionale di giustizia, sacrifica il diritto fondamentale delle vittime di accedere al giudice. Questo diritto — l\'art. 24 Cost. — è un principio supremo dell\'ordinamento italiano che prevale sul diritto internazionale consuetudinario. La sentenza della CIG non viene applicata nella parte in cui nega ogni tutela giurisdizionale alle vittime.',
  },
  {
    numero: '349/2007',
    titolo: 'CEDU come norma interposta',
    tag: 'Diritto internazionale',
    anno: '2007',
    caso: 'La Convenzione europea dei diritti dell\'uomo (CEDU) è un trattato internazionale che l\'Italia ha ratificato. Ma che posto occupa nell\'ordinamento italiano? Un giudice che ritiene una legge italiana in contrasto con la CEDU può disapplicarla direttamente, come fa con il diritto UE? O deve fare qualcos\'altro?',
    principio: 'La CEDU non funziona come il diritto UE. Il giudice ordinario non può disapplicare direttamente la legge italiana: deve sollevare questione di legittimità costituzionale davanti alla Corte, usando come parametro l\'art. 117 Cost. (che impone il rispetto degli obblighi internazionali). Le norme CEDU, così come interpretate dalla Corte di Strasburgo, diventano "norme interposte": violando la CEDU, la legge viola anche la Costituzione. Le cosiddette "sentenze gemelle" con la n. 348/2007.',
  },

  // ── PARLAMENTO ────────────────────────────────────────────────────────────
  {
    numero: '154/1985',
    titolo: 'Autonomia parlamentare',
    tag: 'Parlamento',
    anno: '1985',
    caso: 'I regolamenti parlamentari sono le regole interne con cui Camera e Senato organizzano i propri lavori. Possono essere impugnati davanti alla Corte costituzionale? Oppure il Parlamento è sovrano nella propria organizzazione interna e la Corte non può intervenire?',
    principio: 'I regolamenti parlamentari godono di una forte autonomia: non sono, in linea generale, sindacabili dalla Corte costituzionale. Il Parlamento ha il diritto di disciplinare liberamente il proprio funzionamento interno. La Corte si riserva però di intervenire in casi estremi in cui l\'autonomia parlamentare si scontri con diritti fondamentali o con il principio democratico stesso.',
  },
  {
    numero: '17/2019',
    titolo: 'Maxiemendamento e fiducia',
    tag: 'Parlamento',
    anno: '2019',
    caso: 'Durante l\'approvazione della legge di bilancio, il Governo aveva presentato un maxiemendamento — un testo unico che sostituiva l\'intero testo del disegno di legge — ponendoci sopra la fiducia. Il Parlamento era stato di fatto escluso dalla discussione nel merito: o votava tutto in blocco o cadeva il Governo.',
    principio: 'La Corte riconosce l\'ampia autonomia interna delle Camere nella gestione dei propri lavori, e non dichiara l\'illegittimità della procedura. Tuttavia nella motivazione sottolinea con forza che l\'uso sistematico del maxiemendamento con fiducia rischia di svuotare la funzione legislativa del Parlamento. Un monito chiaro al Governo, anche se non tradotto in una dichiarazione di incostituzionalità.',
  },

  // ── GOVERNO ───────────────────────────────────────────────────────────────
  {
    numero: '7/1996',
    titolo: 'Sfiducia individuale al ministro',
    tag: 'Governo',
    anno: '1996',
    caso: 'Il caso "Mancuso": il Senato aveva approvato una mozione di sfiducia individuale nei confronti di un singolo ministro. Il ministro contestò di non essere obbligato a dimettersi, sostenendo che la Costituzione prevedesse solo la sfiducia all\'intero Governo. La vicenda aprì un conflitto di attribuzioni davanti alla Corte.',
    principio: 'La Corte riconosce la piena legittimità costituzionale della sfiducia individuale al singolo ministro. Essa è compatibile con il sistema parlamentare italiano: il ministro che la riceve è obbligato a dimettersi. Il Presidente della Repubblica può poi nominare un successore senza necessità di crisi dell\'intero Governo. Viene chiarito un punto fondamentale della forma di governo parlamentare italiana.',
  },
  {
    numero: '262/2009',
    titolo: 'Legittimo impedimento del Presidente del Consiglio',
    tag: 'Governo',
    anno: '2009',
    caso: 'Una legge aveva previsto che il Presidente del Consiglio e i Ministri potessero invocare il "legittimo impedimento" derivante dall\'esercizio delle loro funzioni per sospendere i processi penali a loro carico. In pratica, la legge sospendeva i procedimenti penali nei confronti delle quattro massime cariche dello Stato.',
    principio: 'La Corte dichiara l\'incostituzionalità della norma. Non è ammissibile una sospensione automatica e generalizzata dei processi legata alla carica ricoperta, perché crea una disparità ingiustificata rispetto agli altri cittadini e viola il principio di uguaglianza davanti alla legge. Il legittimo impedimento deve essere valutato caso per caso dal giudice, non può essere stabilito per legge in modo automatico per una categoria di persone.',
  },

  // ── PRESIDENTE DELLA REPUBBLICA ───────────────────────────────────────────
  {
    numero: '200/2006',
    titolo: 'Potere di grazia',
    tag: 'Presidente della Repubblica',
    anno: '2006',
    caso: 'Conflitto tra il Presidente della Repubblica Ciampi e il Ministro della Giustizia Castelli sul potere di grazia. Il Ministro sosteneva che la sua controfirma fosse indispensabile e che potesse bloccare la concessione della grazia; il Presidente riteneva invece di avere un potere autonomo.',
    principio: 'La grazia è un potere che appartiene in via esclusiva al Presidente della Repubblica: è un atto presidenziale in senso proprio. Il Ministro della Giustizia deve controfirmare l\'atto, ma la sua controfirma ha un valore formale e non può tradursi in un potere di veto sostanziale. La Corte delimita con precisione i confini tra i poteri del Capo dello Stato e del Governo.',
  },

  // ── PRINCIPI FONDAMENTALI ────────────────────────────────────────────────
  {
    numero: '203/1989',
    titolo: 'Laicità dello Stato',
    tag: 'Principi fondamentali',
    anno: '1989',
    caso: 'La questione riguardava l\'insegnamento della religione cattolica nelle scuole pubbliche e il suo rapporto con il principio di neutralità dello Stato in materia religiosa. Il Concordato con la Santa Sede prevedeva quell\'insegnamento, ma la Costituzione garantisce la libertà di coscienza.',
    principio: 'La laicità è un principio supremo dell\'ordinamento costituzionale italiano, anche se non è scritto esplicitamente in nessun articolo. Non significa ostilità o indifferenza dello Stato verso la religione, ma equidistanza e imparzialità rispetto a tutte le confessioni. Lo Stato non può favorire né penalizzare nessuna religione. È una delle sentenze "additive di principio" più importanti: la Corte ricava un principio fondamentale non dal testo ma dallo spirito della Costituzione.',
  },

  // ── DIRITTI FONDAMENTALI ─────────────────────────────────────────────────
  {
    numero: '364/1988',
    titolo: 'Ignoranza inevitabile della legge penale',
    tag: 'Diritto penale',
    anno: '1988',
    caso: 'L\'art. 5 del codice penale stabiliva che "nessuno può invocare a propria scusa l\'ignoranza della legge penale" — il brocardo latino ignorantia legis non excusat. Ma questa regola assoluta è costituzionalmente compatibile con il principio di colpevolezza? È giusto punire chi non poteva davvero conoscere che il proprio comportamento fosse vietato?',
    principio: 'No: la regola assoluta è incostituzionale. L\'art. 5 c.p. viene dichiarato illegittimo nella parte in cui non prevede un\'eccezione per l\'ignoranza inevitabile. Se la mancata conoscenza della legge penale non dipende da negligenza o indifferenza del soggetto — ma da oscurità della norma, contraddittorietà della giurisprudenza, o carenza di informazione non imputabile all\'agente — quella ignoranza è scusabile. Non si può punire chi ha fatto tutto il possibile per rispettare la legge. Sentenza additiva fondamentale per il diritto penale.',
  },
  {
    numero: '509/2000',
    titolo: 'Danno biologico',
    tag: 'Diritti fondamentali',
    anno: '2000',
    caso: 'Il danno biologico — il danno alla salute psicofisica della persona, indipendentemente dalle conseguenze economiche — era riconosciuto dalla giurisprudenza civile ma non aveva ancora un fondamento costituzionale chiaro. Le assicurazioni contestavano spesso l\'entità dei risarcimenti.',
    principio: 'Il diritto alla salute garantito dall\'art. 32 Cost. include la tutela dell\'integrità psicofisica della persona come valore in sé, a prescindere dalle conseguenze patrimoniali. Il danno biologico ha quindi piena copertura costituzionale: chi lede la salute altrui deve risarcirla non solo per le perdite economiche subite dalla vittima, ma per il pregiudizio all\'integrità della persona in quanto tale.',
  },
  {
    numero: '85/2013',
    titolo: 'Caso ILVA — Salute vs. lavoro',
    tag: 'Diritti fondamentali',
    anno: '2013',
    caso: 'L\'ILVA di Taranto era il più grande stabilimento siderurgico d\'Europa e produceva emissioni altamente inquinanti che causavano danni gravissimi alla salute dei residenti. I giudici avevano disposto il sequestro dell\'impianto, ma il Governo aveva emanato un decreto-legge che imponeva la continuazione della produzione per salvaguardare migliaia di posti di lavoro. Un diritto contro l\'altro.',
    principio: 'Nessun diritto fondamentale è assoluto al punto da azzerare gli altri: tutti i diritti costituzionali devono essere bilanciati. La salute non può essere sacrificata interamente al lavoro, né il lavoro alla salute. Il decreto-legge che consentiva la produzione era costituzionale solo a condizione che prevedesse misure concrete di risanamento ambientale con tempi certi. La Corte impone un bilanciamento reale, non la supremazia automatica di uno dei diritti in gioco.',
  },
  {
    numero: '151/2009',
    titolo: 'Fecondazione assistita e salute della donna',
    tag: 'Diritti fondamentali',
    anno: '2009',
    caso: 'La legge 40/2004 sulla procreazione medicalmente assistita imponeva di produrre e impiantare non più di tre embrioni in un unico e contemporaneo impianto, vietando la crioconservazione degli embrioni soprannumerari. Questa regola rigida poteva mettere a rischio la salute della donna, costringendola a subire impianti multipli anche quando era clinicamente sconsigliabile.',
    principio: 'La tutela della salute della donna prevale su limiti legislativi irragionevoli. Il divieto assoluto di crioconservazione e la regola dei tre embrioni — applicati in modo rigido indipendentemente dalle condizioni cliniche — ledono il diritto alla salute garantito dall\'art. 32 Cost. Il medico deve poter valutare caso per caso quanti embrioni produrre e impiantare, in base alle condizioni della paziente. Prima importante breccia nella legge 40.',
  },
  {
    numero: '278/2013',
    titolo: 'Diritto del figlio a conoscere le proprie origini',
    tag: 'Diritti fondamentali',
    anno: '2013',
    caso: 'Una madre aveva partorito in anonimato — diritto che la legge italiana garantisce per tutelare la donna in situazioni di difficoltà. Il figlio, diventato adulto, voleva conoscere la propria identità biologica. L\'anonimato materno sembrava un muro invalicabile: i dati erano segreti e non c\'era nessuna procedura per tentare un contatto.',
    principio: 'Occorre bilanciare due diritti entrambi fondamentali: il diritto all\'identità personale del figlio (sapere da chi discende) e il diritto all\'anonimato della madre. La Corte non elimina l\'anonimato, ma dichiara illegittima la sua assolutezza: deve essere prevista una procedura che consenta di interpellare la madre — interpellare, non obbligarla — per verificare se sia disposta a revocare l\'anonimato. Il diritto alle origini non può essere sacrificato senza nemmeno tentare il contatto.',
  },
  {
    numero: '162/2014',
    titolo: 'Fecondazione eterologa',
    tag: 'Diritti fondamentali',
    anno: '2014',
    caso: 'La legge 40/2004 vietava in modo assoluto la fecondazione eterologa — quella che utilizza gameti di un donatore esterno alla coppia. Le coppie con infertilità assoluta non avevano altra opzione: erano costrette ad andare all\'estero per accedere a una tecnica legale in quasi tutti i paesi europei.',
    principio: 'Il divieto assoluto è incostituzionale. Il diritto di formare una famiglia e quello alla salute — intesa anche come salute riproduttiva — non possono essere compressi in modo totale e irragionevole. La distinzione tra fecondazione omologa (consentita) ed eterologa (vietata) non regge al vaglio costituzionale quando la coppia non ha alternative. La Corte supera definitivamente quel divieto, aprendo all\'eterologa in Italia.',
  },
  {
    numero: '275/2016',
    titolo: 'Diritti sociali e vincoli di bilancio',
    tag: 'Diritti fondamentali',
    anno: '2016',
    caso: 'Una Regione aveva tagliato i servizi di assistenza alle persone con disabilità grave — trasporto, accompagnamento, sostegno alla comunicazione — invocando la mancanza di risorse finanziarie e i vincoli di bilancio. Le persone disabili si trovavano senza servizi essenziali per condurre una vita dignitosa.',
    principio: 'I diritti fondamentali incomprimibili non possono essere sacrificati per ragioni di bilancio. Non è la disponibilità finanziaria a determinare l\'ampiezza dei diritti, ma sono i diritti a determinare le necessarie disponibilità finanziarie. Quando si tratta di diritti inviolabili — come quello delle persone con disabilità grave a ricevere assistenza essenziale — l\'argomento "non ci sono soldi" non è una giustificazione costituzionalmente accettabile.',
  },
  {
    numero: '242/2019',
    titolo: 'Caso Cappato — Suicidio medicalmente assistito',
    tag: 'Diritti fondamentali',
    anno: '2019',
    caso: 'Marco Cappato aveva accompagnato Fabiano Antoniani (DJ Fabo) in Svizzera per accedere al suicidio assistito, legale lì ma non in Italia. Era stato accusato di aiuto al suicidio, reato punito dall\'art. 580 c.p. La questione era: è costituzionale punire chi aiuta a morire una persona malata terminale, cosciente e già dipendente da trattamenti di sostegno vitale?',
    principio: 'No, non sempre. La Corte — con una pronuncia molto elaborata, preceduta da un\'ordinanza interlocutoria nel 2018 — dichiara illegittimo l\'art. 580 c.p. nella parte in cui punisce chi agevola il suicidio di una persona che: è affetta da una patologia irreversibile; è tenuta in vita da trattamenti di sostegno vitale; soffre in modo intollerabile; è pienamente capace di decidere. In queste condizioni specifiche, aiutare a morire non è punibile. La Corte non legalizza il suicidio assistito in generale, ma crea uno spazio di non punibilità e invita il Parlamento a legiferare.',
  },
  {
    numero: '32/2020',
    titolo: 'Ergastolo ostativo e funzione rieducativa',
    tag: 'Diritti fondamentali',
    anno: '2020',
    caso: 'L\'ergastolo ostativo è la forma più dura di reclusione: il condannato per reati di mafia o terrorismo che non collabora con la giustizia non può accedere a nessun beneficio penitenziario — permessi, semilibertà, liberazione condizionale. La collaborazione con la giustizia diventava l\'unica via d\'uscita, indipendentemente dal percorso rieducativo reale della persona.',
    principio: 'La presunzione assoluta che il non collaborante sia ancora pericoloso e irrecuperabile è incostituzionale. L\'art. 27 Cost. impone che la pena tenda alla rieducazione del condannato, e questo principio vale per tutti, anche per i mafiosi. Ogni detenuto deve avere la possibilità — non la certezza — di dimostrare il proprio cambiamento. Il giudice deve poter valutare caso per caso, con elementi concreti, se la pericolosità persiste. La Corte non abolisce l\'ergastolo ostativo, ma ne spezza l\'automatismo.',
  },
  {
    numero: '138/2010',
    titolo: 'Matrimonio tra persone dello stesso sesso',
    tag: 'Diritti fondamentali',
    anno: '2010',
    caso: 'Due coppie dello stesso sesso avevano chiesto di pubblicare le proprie intenzioni matrimoniali. I tribunali avevano rifiutato. La questione sollevata era se l\'art. 29 Cost. — che garantisce i diritti della famiglia come società naturale fondata sul matrimonio — comprendesse anche il matrimonio tra persone dello stesso sesso.',
    principio: 'La Corte afferma che l\'art. 29 Cost., nella sua formulazione storica, si riferisce al matrimonio tra uomo e donna. Non esiste un diritto costituzionale al matrimonio omosessuale come configurato dall\'art. 29. Tuttavia la Corte compie un passo importante: le coppie omosessuali sono "formazioni sociali" protette dall\'art. 2 Cost. e il Parlamento ha il dovere di garantire loro tutele adeguate. Un monito esplicito che anticipava le unioni civili del 2016.',
  },

  // ── LEGGE ELETTORALE ─────────────────────────────────────────────────────
  {
    numero: '1/2014',
    titolo: 'Porcellum incostituzionale',
    tag: 'Legge elettorale',
    anno: '2014',
    caso: 'La legge elettorale del 2005 (soprannominata "Porcellum" dal suo stesso artefice, Roberto Calderoli) prevedeva un premio di maggioranza senza soglia minima — chi vinceva prendeva il 55% dei seggi anche con il 20% dei voti — e liste bloccate integrali, senza possibilità per l\'elettore di esprimere preferenze.',
    principio: 'La Corte dichiara incostituzionali il premio di maggioranza senza soglia e le liste bloccate integrali. Il primo viola il principio di eguaglianza del voto: il voto di un elettore "vale" moltissimo se la sua lista vince, pochissimo se perde, in modo sproporzionato. Le liste bloccate totali ledono invece la libertà di voto: l\'elettore non sceglie i propri rappresentanti ma solo un partito. La sentenza impone al Parlamento di riscrivere la legge elettorale.',
  },
  {
    numero: '35/2017',
    titolo: 'Italicum',
    tag: 'Legge elettorale',
    anno: '2017',
    caso: 'L\'Italicum, approvato nel 2015 per sostituire il Porcellum, prevedeva un ballottaggio tra i due partiti più votati con un premio di maggioranza del 54% dei seggi assegnato al vincitore, anche se al primo turno aveva ottenuto una minoranza di voti. Chi perdeva il ballottaggio rimaneva senza rappresentanza adeguata.',
    principio: 'La Corte elimina il premio di maggioranza al ballottaggio: assegnare il 54% dei seggi a chi vince il secondo turno — che può essere avvenuto con percentuali molto basse al primo — è sproporzionato e viola il principio di rappresentatività. Restano invece le liste capiste bloccate per una quota, che la Corte ritiene accettabili. La sentenza ridisegna la legge senza eliminarla completamente.',
  },

  // ── DEMOCRAZIA DIRETTA ────────────────────────────────────────────────────
  {
    numero: '199/2012',
    titolo: 'Effetti del referendum abrogativo',
    tag: 'Democrazia diretta',
    anno: '2012',
    caso: 'Nel 2011 un referendum aveva abrogato la norma che consentiva la gestione privata dei servizi idrici. Il Governo, con un successivo decreto, aveva reintrodotto sostanzialmente la stessa disciplina abrogata dal voto popolare, aggirando di fatto la volontà espressa dagli elettori.',
    principio: 'Il legislatore non può ripristinare una disciplina sostanzialmente identica a quella abrogata dal referendum, almeno finché permanga il contesto normativo e la situazione fattuale che avevano giustificato il voto. Il referendum abrogativo produce un effetto vincolante che il Parlamento non può eludere immediatamente: la volontà popolare deve essere rispettata, non aggirata con un cambio di etichetta.',
  },
  {
    numero: '10/2025',
    titolo: 'Referendum autonomia differenziata',
    tag: 'Democrazia diretta',
    anno: '2025',
    caso: 'I promotori avevano raccolto le firme per un referendum abrogativo integrale della legge Calderoli sull\'autonomia differenziata (l. 86/2024). Il quesito chiedeva di cancellare interamente la legge. Ma la Corte aveva già dichiarato incostituzionali alcune sue disposizioni nel 2024, e la legge era in parte già modificata.',
    principio: 'Il referendum viene dichiarato inammissibile. L\'abrogazione totale della legge creerebbe un vuoto procedurale tale da rendere di fatto inattuabile l\'art. 116 co. 3 Cost., che prevede il meccanismo dell\'autonomia differenziata. Eliminare la legge non elimina il precetto costituzionale che la prevede: il risultato sarebbe paralizzare un meccanismo costituzionale essenziale, rendendo non prevedibili le conseguenze per l\'ordinamento. Un quesito che crea vuoti normativi intollerabili è inammissibile.',
  },

  // ── TRIBUTI ───────────────────────────────────────────────────────────────
  {
    numero: '70/2015',
    titolo: 'Blocco rivalutazione pensioni',
    tag: 'Tributi',
    anno: '2015',
    caso: 'Una legge del 2011 aveva bloccato per due anni la rivalutazione automatica delle pensioni superiori a tre volte il minimo INPS, nel pieno della crisi economica. Milioni di pensionati avevano visto il loro potere d\'acquisto erodersi dall\'inflazione senza possibilità di adeguamento.',
    principio: 'La Corte dichiara incostituzionale il blocco totale e indiscriminato. Le pensioni non sono un trasferimento statale revocabile a piacimento: sono redditi da lavoro differiti nel tempo, frutto di contributi versati per decenni. Un blocco totale — senza distinzioni di reddito, senza misure compensative, senza limiti temporali certi — viola i principi di proporzionalità, ragionevolezza e il diritto di proprietà. Lo Stato deve poi restituire agli interessati gli arretrati per gli anni del blocco.',
  },

  // ── REGIONI ───────────────────────────────────────────────────────────────
  {
    numero: '303/2003',
    titolo: 'Sussidiarietà Stato-Regioni',
    tag: 'Regioni',
    anno: '2003',
    caso: 'Con la riforma del Titolo V del 2001 le Regioni avevano ottenuto molte nuove competenze legislative. Ma poteva lo Stato intervenire ugualmente in materie regionali quando c\'era un interesse unitario che richiedeva una disciplina uniforme a livello nazionale?',
    principio: 'Sì, ma con condizioni. Il principio di sussidiarietà — che normalmente attribuisce le funzioni all\'ente più vicino al cittadino — può operare anche "in ascesa": quando un\'esigenza di disciplina unitaria è giustificata e lo Stato attrae a sé la funzione, deve però coinvolgere le Regioni nel procedimento decisionale, attraverso intese e accordi in sede di Conferenza Stato-Regioni. La leale collaborazione è la chiave.',
  },
  {
    numero: '192/2024',
    titolo: 'Autonomia differenziata — Legge Calderoli',
    tag: 'Regioni',
    anno: '2024',
    caso: 'La legge 86/2024 (legge Calderoli) disciplinava il procedimento per l\'attribuzione di forme e condizioni particolari di autonomia alle Regioni ordinarie, come previsto dall\'art. 116 co. 3 Cost. Varie Regioni avevano impugnato la legge davanti alla Corte, sostenendo che violasse il principio di unità della Repubblica e i livelli essenziali delle prestazioni.',
    principio: 'La Corte dichiara illegittime diverse disposizioni della legge. In particolare: l\'eccessiva delega al Governo nella determinazione dei livelli essenziali delle prestazioni (LEP) senza sufficiente coinvolgimento parlamentare; alcune modalità di trasferimento delle funzioni che potevano compromettere la coesione nazionale; la possibilità di "devoluzione in blocco" di materie senza un\'adeguata valutazione delle risorse. La legge sopravvive ma viene profondamente ridisegnata.',
  },

  // ── AMBIENTE ──────────────────────────────────────────────────────────────
  {
    numero: '356/1996',
    titolo: 'Tutela dell\'ambiente come valore primario',
    tag: 'Ambiente',
    anno: '1996',
    caso: 'La Costituzione del 1948 non conteneva un esplicito riferimento alla tutela dell\'ambiente — la parola "ambiente" non compariva nel testo originario. Esisteva comunque una copertura costituzionale per la protezione ambientale? O era una materia lasciata alla libera scelta del legislatore ordinario?',
    principio: 'L\'ambiente è un valore primario e assoluto dell\'ordinamento, riconoscibile già nel testo costituzionale del 1948 attraverso la combinazione di più articoli (artt. 9, 32, 41, 42). La sua tutela non è rimessa alla discrezionalità del legislatore ordinario: è un obbligo costituzionale. Con la riforma del 2022 l\'art. 9 Cost. è stato modificato per includere esplicitamente la tutela dell\'ambiente, confermando l\'orientamento giurisprudenziale della Corte.',
  },
];

const coloreTag: Record<string, string> = {
  'Fonti del diritto': '#f97316',
  'Unione Europea': '#38bdf8',
  'Diritto internazionale': '#a78bfa',
  'Parlamento': '#ffd700',
  'Governo': '#fb7185',
  'Presidente della Repubblica': '#e879f9',
  'Principi fondamentali': '#22c55e',
  'Diritto penale': '#f97316',
  'Diritti fondamentali': '#22c55e',
  'Legge elettorale': '#38bdf8',
  'Democrazia diretta': '#a78bfa',
  'Tributi': '#ffd700',
  'Regioni': '#fb7185',
  'Ambiente': '#22c55e',
};

export default function SentenzePage() {
  const [attiva, setAttiva] = useState<number | null>(null);
  const [filtroTag, setFiltroTag] = useState<string | null>(null);

  const tags = [...new Set(sentenze.map((s) => s.tag))].sort();
  const filtrate = filtroTag ? sentenze.filter((s) => s.tag === filtroTag) : sentenze;

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

        {/* HERO */}
        <div style={{ padding: '32px 16px 20px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10 }}>
            Corte Costituzionale
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: -1, marginBottom: 10 }}>
            Sentenze<br />fondamentali
          </div>
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 20 }}>
            Le decisioni che hanno scritto la storia della Repubblica e definito i confini del potere.
          </div>

          {/* Stat pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { num: sentenze.length, label: 'sentenze' },
              { num: tags.length, label: 'materie' },
              { num: '1956–2025', label: 'periodo' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(143,211,255,0.07)',
                border: '0.5px solid rgba(143,211,255,0.15)',
                borderRadius: 10, padding: '6px 12px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#8fd3ff' }}>{s.num}</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FILTRO TAG */}
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => { setFiltroTag(null); setAttiva(null); }}
            style={{
              padding: '5px 12px', borderRadius: 8,
              background: !filtroTag ? 'rgba(143,211,255,0.12)' : 'rgba(255,255,255,0.04)',
              border: `0.5px solid ${!filtroTag ? 'rgba(143,211,255,0.3)' : 'rgba(255,255,255,0.08)'}`,
              color: !filtroTag ? '#8fd3ff' : 'rgba(255,255,255,0.35)',
              fontSize: 10, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Tutte
          </button>
          {tags.map((tag) => {
            const col = coloreTag[tag] ?? '#8fd3ff';
            const attivo = filtroTag === tag;
            return (
              <button
                key={tag}
                onClick={() => { setFiltroTag(attivo ? null : tag); setAttiva(null); }}
                style={{
                  padding: '5px 12px', borderRadius: 8,
                  background: attivo ? `${col}18` : 'rgba(255,255,255,0.04)',
                  border: `0.5px solid ${attivo ? col + '55' : 'rgba(255,255,255,0.08)'}`,
                  color: attivo ? col : 'rgba(255,255,255,0.35)',
                  fontSize: 10, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* LISTA SENTENZE */}
        <div style={{ padding: '0 16px 140px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtrate.map((s, i) => {
            const idx = sentenze.indexOf(s);
            const aperta = attiva === idx;
            const col = coloreTag[s.tag] ?? '#8fd3ff';

            return (
              <div
                key={idx}
                onClick={() => setAttiva(aperta ? null : idx)}
                style={{
                  background: aperta ? '#111a30' : '#0f1424',
                  border: `0.5px solid ${aperta ? col + '44' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 20,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                {/* HEADER */}
                <div style={{ padding: '16px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Numero / anno */}
                  <div style={{
                    flexShrink: 0, width: 52, height: 52,
                    borderRadius: 14,
                    background: aperta ? `${col}18` : 'rgba(255,255,255,0.04)',
                    border: `0.5px solid ${aperta ? col + '44' : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 1,
                  }}>
                    <div style={{ fontSize: 7, fontWeight: 700, color: aperta ? col : 'rgba(255,255,255,0.3)', letterSpacing: 0.5 }}>SENT.</div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: aperta ? col : 'rgba(255,255,255,0.5)', lineHeight: 1 }}>{s.anno}</div>
                  </div>

                  {/* Testi */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'inline-block',
                      background: `${col}14`,
                      border: `0.5px solid ${col}30`,
                      borderRadius: 5, padding: '2px 7px',
                      fontSize: 8, fontWeight: 700, color: col,
                      letterSpacing: 1, textTransform: 'uppercase',
                      marginBottom: 5,
                    }}>
                      {s.tag}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff', lineHeight: 1.25 }}>
                      {s.titolo}
                    </div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>
                      n. {s.numero}
                    </div>
                  </div>

                  {/* Freccia */}
                  <div style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: aperta ? 'rotate(90deg)' : 'none',
                    transition: 'transform 0.2s',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>

                {/* ESPANSIONE */}
                {aperta && (
                  <div style={{ padding: '0 16px 20px', animation: 'fadeIn 0.2s ease' }}>
                    <div style={{
                      borderTop: '0.5px solid rgba(255,255,255,0.06)',
                      paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12,
                    }}>
                      {/* Il caso */}
                      <div>
                        <div style={{
                          fontSize: 8, fontWeight: 700, letterSpacing: 2,
                          color: `${col}99`, textTransform: 'uppercase', marginBottom: 7,
                        }}>
                          Il caso
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>
                          {s.caso}
                        </div>
                      </div>

                      {/* Il principio */}
                      <div style={{
                        background: `${col}08`,
                        border: `0.5px solid ${col}22`,
                        borderRadius: 12, padding: '14px',
                      }}>
                        <div style={{
                          fontSize: 8, fontWeight: 700, letterSpacing: 2,
                          color: col, textTransform: 'uppercase', marginBottom: 7,
                        }}>
                          Il principio
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.75 }}>
                          {s.principio}
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