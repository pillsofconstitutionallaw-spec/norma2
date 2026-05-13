'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const dati = [
  {
    id: 'controlimiti', label: 'Principi Supremi', sub: 'Livello 0 · controlimiti', colore: '#ffd700',
    icon: '<path d="M12 2l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z"/>',
    subs: [
      {
        nome: 'Principi supremi inderogabili',
        def: `I principi supremi della Costituzione non possono essere modificati neppure da leggi di revisione costituzionale (procedimento ex art. 138 Cost.). Rappresentano il «nucleo duro» dell'ordinamento: valori fondanti che nessuna maggioranza parlamentare può sovvertire. Delineati dalla Corte Costituzionale a partire dalla sent. 1146/1988.`,
        esempi: ['Principio democratico (art. 1 Cost.)', 'Dignità umana e diritti inviolabili (art. 2 Cost.)', 'Principio di eguaglianza (art. 3 Cost.)', 'Tutela giurisdizionale (art. 24 Cost.)', 'Principio di laicità'],
        sentenze: [
          { n: 'Corte Cost. n. 1146/1988', caso: 'Definizione dei controlimiti', testo: 'La Costituzione italiana contiene alcuni principi supremi che non possono essere sovvertiti o modificati nel loro contenuto essenziale neppure da leggi di revisione costituzionale o da altre leggi costituzionali.', link: 'https://www.cortecostituzionale.it' },
          { n: 'Corte Cost. n. 238/2014', caso: 'Controlimiti vs immunità degli Stati stranieri', testo: 'Le norme di diritto internazionale consuetudinario non possono entrare nell\'ordinamento italiano se in contrasto con i principi supremi, tra cui il diritto alla tutela giurisdizionale (art. 24 Cost.).', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2014&numero=238' },
        ]
      },
      {
        nome: 'Controlimiti al diritto UE',
        def: `I principi supremi operano anche come limite al primato del diritto dell'Unione Europea. Anche il diritto UE — pur prevalendo sulle leggi ordinarie — non può violare i principi supremi della Costituzione italiana. Questa teoria dei «controlimiti» è stata elaborata dalla Corte Costituzionale a partire dagli anni '70.`,
        esempi: ['Diritti inviolabili della persona', 'Principio del giusto processo', 'Principio di legalità penale'],
        sentenze: [
          { n: 'Corte Cost. n. 183/1973 (Frontini)', caso: 'Prima elaborazione dei controlimiti', testo: 'La Corte si riserva il potere di giudicare se una norma comunitaria contrasta con i principi fondamentali dell\'ordinamento costituzionale o con i diritti inalienabili della persona umana.', link: 'https://www.cortecostituzionale.it' },
          { n: 'Corte Cost. n. 232/1989 (Fragd)', caso: 'Controlimiti operativi', testo: 'La Corte Costituzionale può dichiarare illegittima la legge di esecuzione dei Trattati UE nella parte in cui consente l\'applicazione di una norma comunitaria lesiva dei diritti fondamentali garantiti dalla Costituzione italiana.', link: 'https://www.cortecostituzionale.it' },
        ]
      },
    ]
  },
  {
    id: 'internazionale', label: 'Internazionale', sub: 'Livello 1 · ius cogens · CEDU', colore: '#a78bfa',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-2.5 3-4 6-4 9s1.5 6 4 9c2.5-3 4-6 4-9s-1.5-6-4-9z"/>',
    subs: [
      {
        nome: 'Diritto internazionale consuetudinario',
        def: `Le norme consuetudinarie internazionali entrano automaticamente nell'ordinamento italiano tramite l'adattamento automatico ex art. 10, comma 1, Cost. Si tratta di norme non scritte formate dalla prassi costante degli Stati accompagnata dall'opinio iuris.`,
        esempi: ['Immunità diplomatiche', 'Principio pacta sunt servanda', 'Ius cogens (norme imperative inderogabili)', 'Divieto di tortura', 'Principio di non-refoulement'],
        sentenze: [
          { n: 'Corte Cost. n. 48/1979', caso: 'Meccanismo di adattamento automatico', testo: 'L\'art. 10, comma 1, Cost. opera come trasformatore permanente delle norme consuetudinarie internazionali in norme interne. Non è necessario un atto di recepimento.', link: 'https://www.cortecostituzionale.it' },
          { n: 'Corte Cost. n. 238/2014', caso: 'Limite dei principi supremi alla consuetudine internazionale', testo: 'La norma consuetudinaria sull\'immunità degli Stati non è applicabile quando contrasta con il diritto alla tutela giurisdizionale (art. 24 Cost.), principio supremo dell\'ordinamento italiano.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2014&numero=238' },
        ]
      },
      {
        nome: 'Trattati internazionali',
        def: `I trattati sono accordi scritti tra Stati. In Italia il procedimento prevede: firma del Governo, autorizzazione parlamentare con legge (art. 80 Cost.), ratifica del Presidente della Repubblica, ordine di esecuzione. Il loro rango è pari alla legge ordinaria, salvo copertura costituzionale.`,
        esempi: ['Convenzione di Vienna sul diritto dei trattati (1969)', 'Statuto ONU (1945)', 'Convenzione ONU sui diritti del fanciullo (1989)', 'Accordi di Schengen'],
        sentenze: [
          { n: 'Corte Cost. nn. 348-349/2007', caso: 'Rango costituzionale della CEDU tramite art. 117 Cost.', testo: 'Le norme CEDU costituiscono «norme interposte» tra la Costituzione e la legge ordinaria, tramite l\'art. 117, comma 1, Cost. Una legge contrastante con la CEDU è incostituzionale.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2007&numero=348' },
        ]
      },
      {
        nome: 'CEDU — Convenzione Europea dei Diritti dell\'Uomo',
        def: `La Convenzione Europea dei Diritti dell'Uomo (Roma, 1950) è il principale strumento di protezione dei diritti fondamentali in Europa. È garantita dalla Corte EDU di Strasburgo. In Italia ha rango «subcostituzionale»: superiore alla legge ordinaria ma inferiore alla Costituzione.`,
        esempi: ['Art. 6 CEDU — Diritto a un equo processo', 'Art. 7 CEDU — Nulla poena sine lege', 'Art. 8 CEDU — Rispetto della vita privata', 'Art. 3 CEDU — Divieto di tortura'],
        sentenze: [
          { n: 'Corte EDU, Scoppola c. Italia (2009)', caso: 'Applicazione retroattiva della legge penale più favorevole', testo: 'L\'art. 7 CEDU comprende implicitamente il diritto all\'applicazione della pena più mite sopravvenuta. La sentenza ha costretto l\'Italia a riaprire numerosi procedimenti definitivi.', link: 'https://hudoc.echr.coe.int' },
          { n: 'Corte Cost. n. 49/2015', caso: 'Limiti all\'efficacia delle sentenze della Corte EDU', testo: 'Il giudice italiano non è tenuto a conformarsi alla giurisprudenza della Corte EDU quando essa contrasta con i principi fondamentali dell\'ordinamento costituzionale italiano.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2015&numero=49' },
        ]
      },
    ]
  },
  {
    id: 'ue', label: 'Unione Europea', sub: 'Livello 2 · primato · effetto diretto', colore: '#38bdf8',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/>',
    subs: [
      {
        nome: 'Diritto primario UE (Trattati)',
        def: `I Trattati istitutivi sono le «leggi costituzionali» dell'Unione Europea. TUE e TFUE definiscono competenze, istituzioni e principi fondamentali. La Carta dei Diritti Fondamentali (Nizza 2000, vincolante dal 2009) ha lo stesso valore giuridico dei Trattati.`,
        esempi: ['TUE — Trattato sull\'Unione Europea', 'TFUE — Trattato sul Funzionamento dell\'UE', 'Carta dei Diritti Fondamentali UE (Nizza 2000)'],
        sentenze: [
          { n: 'CGUE, Van Gend en Loos (1963)', caso: 'Effetto diretto del diritto comunitario', testo: 'Il diritto comunitario crea diritti in capo ai singoli che i giudici nazionali devono tutelare. Fondamento del principio di effetto diretto.', link: 'https://eur-lex.europa.eu' },
          { n: 'Corte Cost. n. 269/2017', caso: 'Doppio rinvio — Carta UE e Costituzione', testo: 'Quando una norma viola sia la Carta UE sia la Costituzione, il giudice deve sollevare questione di legittimità costituzionale.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2017&numero=269' },
        ]
      },
      {
        nome: 'Regolamenti UE',
        def: `I Regolamenti sono obbligatori e direttamente applicabili in tutti gli Stati membri senza recepimento (art. 288 TFUE). Prevalgono sulla legge ordinaria italiana: in caso di conflitto, il giudice deve disapplicare la norma interna.`,
        esempi: ['Regolamento GDPR n. 2016/679', 'Regolamento Dublino III n. 604/2013', 'Regolamento n. 1215/2012 (competenza giurisdizionale)'],
        sentenze: [
          { n: 'Corte Cost. n. 170/1984 (Granital)', caso: 'Disapplicazione diretta in caso di conflitto', testo: 'Il giudice italiano deve disapplicare la norma interna in contrasto con il regolamento comunitario direttamente applicabile, senza attendere la Corte Costituzionale.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=1984&numero=170' },
          { n: 'CGUE, Simmenthal (1978)', caso: 'Obbligo di disapplicazione immediata', testo: 'Il giudice nazionale deve disapplicare qualsiasi norma legislativa nazionale che contrasti con il diritto comunitario, senza dover attendere la previa abrogazione.', link: 'https://eur-lex.europa.eu' },
        ]
      },
      {
        nome: 'Direttive UE',
        def: `Le Direttive vincolano lo Stato membro quanto al risultato da raggiungere, lasciando libertà di forma e mezzi (art. 288 TFUE). Devono essere recepite entro il termine indicato con legge ordinaria o decreto legislativo.`,
        esempi: ['Direttiva 2011/83/UE (diritti dei consumatori)', 'Direttiva 2006/123/CE (servizi — Bolkestein)', 'Direttiva 2019/790/UE (copyright digitale)'],
        sentenze: [
          { n: 'CGUE, Francovich (1991)', caso: 'Responsabilità per mancato recepimento', testo: 'Lo Stato che non recepisce una direttiva nei termini è responsabile dei danni subiti dai singoli, anche se la direttiva non è dotata di effetto diretto.', link: 'https://eur-lex.europa.eu' },
          { n: 'CGUE, Marshall (1986)', caso: 'Effetto diretto verticale delle direttive', testo: 'Le direttive possono avere effetto diretto verticale quando le disposizioni sono precise e incondizionate e il termine di recepimento è scaduto.', link: 'https://eur-lex.europa.eu' },
        ]
      },
    ]
  },
  {
    id: 'costituzione', label: 'Costituzione', sub: 'Livello 3 · rigida · art. 138', colore: '#f97316',
    icon: '<path d="M7 3h10l4 4v14H3V3h4z"/><path d="M17 3v4h4"/><path d="M7 12h10M7 16h6"/>',
    subs: [
      {
        nome: 'Costituzione della Repubblica',
        def: `La Costituzione italiana (entrata in vigore il 1° gennaio 1948) è la legge fondamentale dello Stato. È rigida: non può essere modificata con legge ordinaria. Il procedimento ex art. 138 richiede doppia deliberazione di ciascuna Camera con intervallo di almeno 3 mesi e possibile referendum costituzionale.`,
        esempi: ['139 articoli + 18 disposizioni transitorie', 'Parte I — Diritti e doveri dei cittadini (artt. 13-54)', 'Parte II — Ordinamento della Repubblica (artt. 55-139)', 'Principi fondamentali (artt. 1-12)'],
        sentenze: [
          { n: 'Corte Cost. n. 1/1956', caso: 'Prima sentenza — sindacato su tutte le leggi', testo: 'La Corte Costituzionale è competente a sindacare tutte le leggi, comprese quelle anteriori alla Costituzione. Le disposizioni incompatibili sono illegittime con effetto erga omnes.', link: 'https://www.cortecostituzionale.it' },
          { n: 'Corte Cost. n. 1146/1988', caso: 'Nucleo duro immodificabile', testo: 'La Costituzione contiene principi supremi che non possono essere sovvertiti neppure da leggi di revisione costituzionale. Il procedimento ex art. 138 non è onnipotente.', link: 'https://www.cortecostituzionale.it' },
        ]
      },
      {
        nome: 'Leggi costituzionali',
        def: `Le leggi costituzionali sono approvate con lo stesso procedimento della revisione (art. 138 Cost.). Possono modificare il testo della Costituzione o introdurre discipline di rango costituzionale. Hanno lo stesso rango della Costituzione, salvo il rispetto dei principi supremi.`,
        esempi: ['L. Cost. n. 3/2001 — Riforma Titolo V (Regioni)', 'L. Cost. n. 1/2012 — Pareggio di bilancio', 'L. Cost. n. 1/2020 — Riduzione parlamentari', 'Statuti delle 5 Regioni a statuto speciale'],
        sentenze: [
          { n: 'Corte Cost. n. 366/1991', caso: 'Limiti alle leggi costituzionali', testo: 'Anche le leggi costituzionali devono rispettare i principi supremi dell\'ordinamento. Una legge costituzionale che li violasse potrebbe essere dichiarata illegittima dalla Corte.', link: 'https://www.cortecostituzionale.it' },
        ]
      },
    ]
  },
  {
    id: 'primarie', label: 'Fonti Primarie', sub: 'Livello 4 · legge · d.l. · d.lgs.', colore: '#22c55e',
    icon: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    subs: [
      {
        nome: 'Legge ordinaria',
        def: `La legge ordinaria è la forma tipica di esercizio della funzione legislativa da parte del Parlamento (artt. 70-74 Cost.). Il procedimento prevede: iniziativa legislativa, deliberazione di entrambe le Camere nel medesimo testo, promulgazione del Presidente della Repubblica, pubblicazione in Gazzetta Ufficiale ed entrata in vigore dopo 15 giorni (vacatio legis).`,
        esempi: ['Codice Civile (R.D. n. 262/1942)', 'Codice Penale (R.D. n. 1398/1930)', 'L. n. 300/1970 — Statuto dei Lavoratori', 'L. n. 190/2012 — Legge anticorruzione'],
        sentenze: [
          { n: 'Corte Cost. n. 63/1990', caso: 'Principio di continuità e divieto di reviviscenza', testo: 'L\'abrogazione di una legge non fa rivivere automaticamente la legge precedentemente abrogata da quella soppressa (divieto di reviviscenza).', link: 'https://www.cortecostituzionale.it' },
          { n: 'Corte Cost. n. 161/1995', caso: 'Limiti alla retroattività della legge', testo: 'La retroattività deve avere giustificazione ragionevole e non può colpire diritti quesiti in modo irrazionale o sproporzionato.', link: 'https://www.cortecostituzionale.it' },
        ]
      },
      {
        nome: 'Decreto Legislativo (d.lgs.)',
        def: `Atto avente forza di legge adottato dal Governo su delega del Parlamento (art. 76 Cost.). La legge delega deve indicare: oggetto, principi e criteri direttivi, termine di esercizio. Strumento fondamentale per la codificazione e il recepimento delle Direttive UE.`,
        esempi: ['D.Lgs. n. 206/2005 — Codice del Consumo', 'D.Lgs. n. 42/2004 — Codice dei Beni Culturali', 'D.Lgs. n. 81/2008 — T.U. Sicurezza sul lavoro'],
        sentenze: [
          { n: 'Corte Cost. n. 341/2007', caso: 'Eccesso di delega legislativa', testo: 'Il decreto legislativo è incostituzionale quando eccede i limiti della legge delega. I principi e criteri direttivi devono essere rispettati in modo sufficientemente determinato.', link: 'https://www.cortecostituzionale.it' },
          { n: 'Corte Cost. n. 98/2020', caso: 'Delega e recepimento direttive UE', testo: 'Il Governo può introdurre norme di attuazione purché strettamente necessarie al recepimento e coerenti con i principi della direttiva.', link: 'https://www.cortecostituzionale.it' },
        ]
      },
      {
        nome: 'Decreto-Legge (d.l.)',
        def: `Atto avente forza di legge adottato dal Governo in casi di necessità e urgenza straordinaria (art. 77 Cost.). Entra in vigore immediatamente ma deve essere convertito in legge entro 60 giorni, pena la perdita di efficacia ex tunc. È vietata la reiterazione di d.l. decaduti.`,
        esempi: ['D.L. n. 18/2020 — Cura Italia (COVID)', 'D.L. n. 34/2020 — Rilancio (COVID)', 'D.L. n. 1/2012 — Liberalizzazioni (Monti)'],
        sentenze: [
          { n: 'Corte Cost. n. 360/1996', caso: 'Divieto di reiterazione dei d.l. decaduti', testo: 'La reiterazione sistematica dei decreti-legge non convertiti è incostituzionale. Il Governo non può prorogare indefinitamente gli effetti di un d.l. decaduto.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=1996&numero=360' },
          { n: 'Corte Cost. n. 171/2007', caso: 'Controllo sui presupposti di necessità e urgenza', testo: 'La Corte può sindacare l\'effettiva sussistenza dei presupposti di necessità e urgenza. Un d.l. adottato senza tali presupposti reali è incostituzionale.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2007&numero=171' },
        ]
      },
      {
        nome: 'Referendum abrogativo',
        def: `Strumento di democrazia diretta (art. 75 Cost.) che consente ai cittadini di abrogare leggi ordinarie. Richiede 500.000 firme o 5 Consigli regionali. Non ammesso su leggi tributarie, di bilancio, di amnistia/indulto, di autorizzazione a ratificare trattati internazionali.`,
        esempi: ['Referendum 1991 — preferenza unica', 'Referendum 1993 — finanziamento pubblico partiti (abrogato)', 'Referendum 2011 — acqua pubblica e nucleare'],
        sentenze: [
          { n: 'Corte Cost. n. 16/1978', caso: 'Criteri di ammissibilità del referendum', testo: 'Il referendum non è ammissibile su leggi a contenuto costituzionalmente vincolato, su leggi che costituiscono il presupposto per il funzionamento degli organi costituzionali.', link: 'https://www.cortecostituzionale.it' },
        ]
      },
      {
        nome: 'Legge regionale',
        def: `Le Regioni esercitano la potestà legislativa nelle materie di competenza (art. 117 Cost., riformato dalla L. Cost. n. 3/2001). Si distingue tra competenza esclusiva statale, concorrente (Stato fissa i principi) e residuale delle Regioni.`,
        esempi: ['Leggi regionali sanità (competenza concorrente)', 'Leggi regionali governo del territorio', 'Statuti regionali (procedimento rinforzato)'],
        sentenze: [
          { n: 'Corte Cost. n. 303/2003', caso: 'Sussidiarietà legislativa — attrazione allo Stato', testo: 'Lo Stato può attrarre a sé funzioni legislative regionali quando esigenze unitarie lo richiedano, purché proporzionato e nel rispetto della leale collaborazione.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2003&numero=303' },
        ]
      },
    ]
  },
  {
    id: 'secondarie', label: 'Fonti Secondarie / DPCM', sub: 'Livello 5 · regolamenti · caso COVID', colore: '#fb923c',
    icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',
    subs: [
      {
        nome: 'Regolamenti governativi (art. 17 L. 400/1988)',
        def: `I regolamenti governativi sono le principali fonti normative secondarie. Adottati con d.P.R. su delibera del Consiglio dei Ministri, previo parere del Consiglio di Stato e registrazione Corte dei Conti. Non possono derogare alle leggi ordinarie né creare norme in materie coperte da riserva assoluta di legge.`,
        esempi: ['Regolamenti di esecuzione', 'Regolamenti di attuazione e integrazione', 'Regolamenti indipendenti', 'Regolamenti delegati (de-legislativi)'],
        sentenze: [
          { n: 'Corte Cost. n. 376/2005', caso: 'Riserva di legge e potere regolamentare', testo: 'Il regolamento non può riempire un vuoto normativo creato dal legislatore su materie soggette a riserva di legge.', link: 'https://www.cortecostituzionale.it' },
        ]
      },
      {
        nome: 'Regolamenti ministeriali e interministeriali',
        def: `I regolamenti ministeriali sono adottati da singoli Ministri con proprio decreto (d.m.). Sono subordinati ai regolamenti governativi e alle leggi. Disciplinano tariffe, procedure, requisiti tecnici, organizzazione degli uffici.`,
        esempi: ['D.M. — criteri sicurezza antincendio', 'D.M. — programmi scolastici', 'D.M. — requisiti asili nido', 'D.M. — tabelle onorari professionali'],
        sentenze: [
          { n: 'Cons. Stato, sez. VI, n. 1750/2015', caso: 'Disapplicazione del regolamento ministeriale illegittimo', testo: 'Il giudice amministrativo può disapplicarlo nel caso concreto senza dover attendere una pronuncia di annullamento. Il principio di gerarchia delle fonti impone la disapplicazione automatica.', link: 'https://www.giustizia-amministrativa.it' },
        ]
      },
      {
        nome: 'DPCM — Decreti del Presidente del Consiglio',
        def: `I DPCM sono atti del Presidente del Consiglio dei Ministri privi di base normativa organica. Non richiedono parere del Consiglio di Stato, né registrazione Corte dei Conti, né emanazione del Presidente della Repubblica.

Durante il lockdown COVID-19 (2020-2021), i DPCM hanno limitato libertà fondamentali senza avere forza di legge. La Corte Costituzionale con sent. n. 198/2021 li ha qualificati come «atti amministrativi necessitati», la cui legittimità dipendeva dalla tipizzazione delle misure nel D.L. n. 19/2020. Il dibattito rimane aperto: molti costituzionalisti (Baldassarre, Cassese) hanno evidenziato i rischi per il sistema delle fonti.`,
        esempi: ['DPCM 9 marzo 2020 — lockdown nazionale COVID', 'DPCM 3 novembre 2020 — zone colorate', 'DPCM nomina Sottosegretari di Stato', 'DPCM approvazione PTPCT (Piano Anticorruzione)'],
        sentenze: [
          { n: 'Corte Cost. n. 198/2021', caso: 'Natura giuridica DPCM COVID — «atti amministrativi necessitati»', testo: 'I DPCM del lockdown non sono fonti normative di rango secondario ma atti amministrativi necessitati. La loro legittimità dipendeva dalla tipizzazione nel D.L. n. 19/2020: non vi è stata delega in bianco al Presidente del Consiglio.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2021&numero=198' },
          { n: 'Tribunale di Roma, ord. 16 dicembre 2020', caso: 'DPCM illegittimi per violazione riserva di legge assoluta', testo: 'I DPCM del lockdown (marzo-maggio 2020) non potevano comprimere diritti fondamentali coperti da riserva di legge assoluta (artt. 13-22 Cost.) senza adeguata copertura legislativa.', link: 'https://www.cortecostituzionale.it' },
          { n: 'Corte Cost. n. 115/2011', caso: 'Deleghe in bianco e principio di legalità', testo: 'Il principio di legalità impone che la legge fornisca una disciplina sufficientemente determinata. Una norma che attribuisca poteri normativi senza fissare oggetto e criteri direttivi costituisce una delega in bianco incostituzionale.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2011&numero=115' },
        ]
      },
    ]
  },
  {
    id: 'regionali', label: 'Fonti Regionali / Locali', sub: 'Livello 6 · regioni · comuni', colore: '#e879f9',
    icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    subs: [
      {
        nome: 'Leggi e regolamenti regionali',
        def: `Le Regioni ordinarie (15) esercitano la potestà legislativa nelle materie di cui all'art. 117 Cost. Le Regioni a statuto speciale (5: Sicilia, Sardegna, Valle d'Aosta, Trentino-Alto Adige, Friuli-Venezia Giulia) hanno autonomia più ampia.`,
        esempi: ['Leggi regionali sanità', 'Leggi regionali governo del territorio', 'Regolamenti regionali di attuazione', 'Statuti regionali'],
        sentenze: [
          { n: 'Corte Cost. n. 303/2003', caso: 'Sussidiarietà e attrazione allo Stato', testo: 'Lo Stato può attrarre a sé funzioni legislative regionali quando esigenze di esercizio unitario lo richiedano, purché proporzionato e nel rispetto della leale collaborazione.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2003&numero=303' },
          { n: 'Corte Cost. n. 251/2016', caso: 'Deleghe al Governo e autonomie regionali', testo: 'Le leggi delega che incidono sulle autonomie regionali devono prevedere il coinvolgimento delle Regioni nella fase di elaborazione dei decreti legislativi attuativi.', link: 'https://www.cortecostituzionale.it' },
        ]
      },
      {
        nome: 'Statuti e regolamenti comunali',
        def: `I Comuni e le Province adottano statuti e regolamenti nell'ambito della propria autonomia organizzativa e funzionale (art. 114 Cost., D.Lgs. n. 267/2000 — TUEL). Lo statuto comunale è approvato con maggioranza dei 2/3.`,
        esempi: ['Statuto comunale', 'Regolamento edilizio', 'Regolamento gestione rifiuti', 'Regolamento tributi locali (IMU, TARI)'],
        sentenze: [
          { n: 'Corte Cost. n. 220/2013', caso: 'Province — enti costituzionalmente garantiti', testo: 'Lo Stato non può sopprimere con legge ordinaria le Province, enti garantiti dalla Costituzione (art. 114 Cost.), senza seguire il procedimento di revisione costituzionale.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2013&numero=220' },
        ]
      },
      {
        nome: 'Ordinanze del Sindaco',
        def: `Le ordinanze sindacali contingibili e urgenti (art. 54 TUEL) sono adottate in caso di emergenze sanitarie, sicurezza urbana, incolumità pubblica. Hanno carattere temporaneo e non possono derogare stabilmente alle leggi statali e regionali.`,
        esempi: ['Ordinanza anti-abbandono rifiuti', 'Ordinanza chiusura cantieri notturni', 'Ordinanza sgombero edifici pericolanti', 'Ordinanza anti-alcol aree pubbliche'],
        sentenze: [
          { n: 'Corte Cost. n. 196/2004', caso: 'Limiti delle ordinanze contingibili', testo: 'Le ordinanze sindacali non possono derogare a norme primarie in modo stabile e definitivo. Devono avere carattere temporaneo e proporzionato all\'emergenza.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2004&numero=196' },
          { n: 'Corte Cost. n. 115/2011', caso: 'Illegittimità ordinanze senza base legale determinata', testo: 'Il potere di ordinanza deve avere una base legale sufficientemente determinata: non possono essere conferiti poteri in bianco per limitare diritti dei cittadini.', link: 'https://www.cortecostituzionale.it/actionSchedaPronuncia.do?anno=2011&numero=115' },
        ]
      },
    ]
  },
  {
    id: 'consuetudine', label: 'Consuetudine', sub: 'Livello 7 · fonte-fatto · usi', colore: '#94a3b8',
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    subs: [
      {
        nome: 'Consuetudine (fonte-fatto)',
        def: `La consuetudine è una fonte-fatto: si forma spontaneamente nella prassi sociale senza un atto formale di produzione normativa.

Elementi costitutivi:
• Diuturnitas: comportamento costante, uniforme e reiterato nel tempo
• Opinio iuris ac necessitatis: convinzione che quel comportamento sia giuridicamente obbligatorio

Tipi per rapporto con la legge:
• Secundum legem: interpreta la legge — sempre ammessa
• Praeter legem: integra la legge in lacune — ammessa in diritto privato
• Contra legem: contraria alla legge — non ammessa in Italia

Nel diritto pubblico ha rilievo quasi nullo. Nel diritto internazionale è invece fonte primaria.`,
        esempi: ['Usi commerciali (Codice Civile rinvia agli usi)', 'Consuetudini del diritto internazionale (ius cogens)', 'Usi nella navigazione marittima', 'Prassi costituzionali (non tecnicamente fonti)'],
        sentenze: [
          { n: 'Cass. SS.UU. n. 24883/2008', caso: 'Prova degli usi normativi nel diritto privato', testo: 'Gli usi normativi hanno valore di fonte del diritto solo se provati dalla parte che li invoca, o se notori, o se raccolti nelle raccolte ufficiali delle Camere di Commercio.', link: 'https://www.italgiure.giustizia.it' },
          { n: 'Corte Cost. n. 1/1956', caso: 'Rango inferiore della consuetudine rispetto alla legge', testo: 'Nell\'ordinamento italiano la consuetudine è fonte di rango inferiore alla legge. In caso di contrasto, prevale sempre la legge ordinaria.', link: 'https://www.cortecostituzionale.it' },
        ]
      },
    ]
  },
];

export default function FontiDelDiritto() {
  const [apertoId, setApertoId] = useState<string | null>(null);
  const [apertoSub, setApertoSub] = useState<string | null>(null);
  const [apertaSent, setApertaSent] = useState<string | null>(null);

  function toggleId(id: string) {
    setApertoId(apertoId === id ? null : id);
    setApertoSub(null);
    setApertaSent(null);
  }

  function toggleSub(key: string) {
    setApertoSub(apertoSub === key ? null : key);
    setApertaSent(null);
  }

  function toggleSent(key: string) {
    setApertaSent(apertaSent === key ? null : key);
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        .fonti-app { font-family: 'Montserrat', sans-serif; background: #0a0d18; width: 100%; min-height: 100vh; }
        .fonti-feed { min-height: 100vh; padding: 20px 16px 140px; }
        .slbl { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; }
        .slbl-t { font-size: 9px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(255,255,255,0.22); }
        .slbl-l { flex: 1; height: 0.5px; background: rgba(255,255,255,0.05); }
        img { display: block; }
        a { text-decoration: none; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        @media (min-width: 768px) { .fonti-feed { padding: 32px 40px 140px; } }
        @media (min-width: 1024px) { .fonti-feed { padding: 40px 80px 140px; } }
        @media (min-width: 1280px) { .fonti-feed { padding: 40px 120px 140px; } }
      `}</style>

      <div className="fonti-app">
        <Header />
        <div className="fonti-feed">

          {/* TITOLO */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Diritto Pubblico</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 10, letterSpacing: -0.5 }}>Le Fonti del Diritto</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
              Tocca un livello per scoprire le singole fonti, le definizioni e le sentenze reali della Corte Costituzionale.
            </div>
          </div>

          {/* LISTA */}
          {dati.map((f) => {
            const isOpen = apertoId === f.id;
            return (
              <div key={f.id} style={{ marginBottom: 6 }}>

                {/* HEADER LIVELLO */}
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
                    <div style={{ marginRight: 14, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                </button>

                {/* SOTTOCATEGORIE */}
                {isOpen && (
                  <div style={{ marginTop: 4, paddingLeft: 4 }}>
                    {f.subs.map((sub, si) => {
                      const subKey = `${f.id}-${si}`;
                      const isSubOpen = apertoSub === subKey;
                      return (
                        <div key={si} style={{ background: '#0d1830', borderRadius: 10, marginBottom: 6, overflow: 'hidden', border: `0.5px solid ${isSubOpen ? f.colore + '66' : 'rgba(255,255,255,0.06)'}`, transition: 'border-color 0.15s' }}>

                          <button
                            onClick={() => toggleSub(subKey)}
                            style={{ width: '100%', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', gap: 8 }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', flex: 1, textAlign: 'left' }}>{sub.nome}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{sub.sentenze.length} sent.</span>
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

                              {/* Sentenze */}
                              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: f.colore, textTransform: 'uppercase', margin: '14px 0 8px' }}>Sentenze</div>
                              {sub.sentenze.map((s, senti) => {
                                const sentKey = `${subKey}-${senti}`;
                                const isSentOpen = apertaSent === sentKey;
                                return (
                                  <div key={senti} style={{ border: `0.5px solid ${isSentOpen ? f.colore + '66' : 'rgba(255,255,255,0.07)'}`, borderRadius: 8, marginBottom: 6, overflow: 'hidden', transition: 'border-color 0.15s' }}>
                                    <button
                                      onClick={() => toggleSent(sentKey)}
                                      style={{ width: '100%', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'transparent', border: 'none', cursor: 'pointer', gap: 8 }}
                                    >
                                      <div style={{ flex: 1, textAlign: 'left' }}>
                                        <div style={{ fontSize: 10, fontWeight: 800, color: f.colore, marginBottom: 2 }}>{s.n}</div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{s.caso}</div>
                                      </div>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={f.colore} strokeWidth="2"
                                        style={{ transform: isSentOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0, marginTop: 2 }}>
                                        <path d="M6 9l6 6 6-6"/>
                                      </svg>
                                    </button>
                                    {isSentOpen && (
                                      <div style={{ padding: '0 12px 12px' }}>
                                        <div style={{ height: 0.5, background: 'rgba(255,255,255,0.06)', marginBottom: 8 }} />
                                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 8 }}>«{s.testo}»</p>
                                        <a href={s.link} target="_blank" rel="noreferrer"
                                          style={{ fontSize: 9, fontWeight: 800, color: f.colore, letterSpacing: 1, textTransform: 'uppercase' }}>
                                          Leggi la sentenza →
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

          {/* BOX DPCM */}
          <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 14, background: 'rgba(251,146,60,0.07)', border: '0.5px solid rgba(251,146,60,0.25)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#fb923c', letterSpacing: 1, marginBottom: 5 }}>⚠️ IL CASO DPCM</div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>La pandemia COVID-19 ha messo in crisi il sistema delle fonti. Tocca «Fonti Secondarie / DPCM» per approfondire con la sentenza Corte Cost. 198/2021.</p>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}