'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Referendum = {
  id: number;
  data: string;
  anno: number;
  tipo: 'abrogativo' | 'costituzionale' | 'istituzionale';
  titolo: string;
  descrizione: string;
  esito: 'approvato' | 'respinto' | 'non_valido';
  si?: number;
  no?: number;
  partecipazione?: number;
};

const REFERENDUM: Referendum[] = [
  // 1946
  { id: 1, anno: 1946, data: '2 giugno 1946', tipo: 'istituzionale', titolo: 'Monarchia o Repubblica', descrizione: 'Gli italiani scelsero tra monarchia e repubblica. Il 54% votò per la Repubblica, dando vita alla democrazia italiana moderna e ponendo fine alla Casa Savoia.', esito: 'approvato', si: 54.3, no: 45.7, partecipazione: 89.1 },
  // 1974
  { id: 2, anno: 1974, data: '12-13 maggio 1974', tipo: 'abrogativo', titolo: 'Abrogazione della legge sul divorzio', descrizione: 'Primo referendum abrogativo della storia italiana. I cittadini furono chiamati a decidere se abolire la legge Fortuna-Baslini che aveva introdotto il divorzio nel 1970. Il 59% votò per mantenerlo.', esito: 'respinto', si: 40.7, no: 59.3, partecipazione: 87.7 },
  // 1978
  { id: 3, anno: 1978, data: '11 giugno 1978', tipo: 'abrogativo', titolo: 'Finanziamento pubblico dei partiti', descrizione: 'Referendum per abrogare la legge sul finanziamento pubblico dei partiti politici. La proposta fu respinta con il 56% contrario.', esito: 'respinto', si: 43.6, no: 56.4, partecipazione: 81.2 },
  { id: 4, anno: 1978, data: '11 giugno 1978', tipo: 'abrogativo', titolo: 'Ordine pubblico (Legge Reale)', descrizione: 'Referendum per abrogare alcune norme della legge Reale sull\'ordine pubblico, approvata durante gli anni di piombo. I votanti scelsero di mantenere la legge.', esito: 'respinto', si: 23.5, no: 76.5, partecipazione: 81.2 },
  // 1981
  { id: 5, anno: 1981, data: '17-18 maggio 1981', tipo: 'abrogativo', titolo: 'Abrogazione della legge sull\'aborto', descrizione: 'Referendum promosso dal Movimento per la Vita per abrogare la legge 194/1978 sull\'interruzione volontaria di gravidanza. Il 67% votò per mantenere la legge.', esito: 'respinto', si: 32.0, no: 68.0, partecipazione: 79.4 },
  { id: 6, anno: 1981, data: '17-18 maggio 1981', tipo: 'abrogativo', titolo: 'Legge sull\'aborto (versione radicale)', descrizione: 'Referendum promosso dai Radicali per liberalizzare ulteriormente l\'aborto, eliminando i limiti temporali. Respinto con il 79% contrario.', esito: 'respinto', si: 11.6, no: 88.4, partecipazione: 79.4 },
  { id: 7, anno: 1981, data: '17-18 maggio 1981', tipo: 'abrogativo', titolo: 'Ergastolo', descrizione: 'Referendum per l\'abolizione della pena dell\'ergastolo, promosso dai Radicali. Il 77% votò per mantenere l\'ergastolo.', esito: 'respinto', si: 22.6, no: 77.4, partecipazione: 79.4 },
  { id: 8, anno: 1981, data: '17-18 maggio 1981', tipo: 'abrogativo', titolo: 'Porto d\'armi', descrizione: 'Referendum per la liberalizzazione del porto d\'armi. Nettamente respinto con il 85% contrario.', esito: 'respinto', si: 15.0, no: 85.0, partecipazione: 79.4 },
  { id: 9, anno: 1981, data: '17-18 maggio 1981', tipo: 'abrogativo', titolo: 'Falso in bilancio', descrizione: 'Referendum per la depenalizzazione del falso in bilancio. Respinto con il 80% contrario.', esito: 'respinto', si: 20.0, no: 80.0, partecipazione: 79.4 },
  // 1985
  { id: 10, anno: 1985, data: '9-10 giugno 1985', tipo: 'abrogativo', titolo: 'Scala mobile (taglio punti)', descrizione: 'Referendum promosso dal PCI contro il decreto governativo che tagliava 4 punti di scala mobile. Il 54% votò per mantenere il taglio, confermando la scelta del governo Craxi.', esito: 'respinto', si: 45.7, no: 54.3, partecipazione: 77.9 },
  // 1987
  { id: 11, anno: 1987, data: '8-9 novembre 1987', tipo: 'abrogativo', titolo: 'Nucleare — Localizzazione centrali', descrizione: 'Dopo Chernobyl, referendum per abolire i poteri del CIPE sulla localizzazione delle centrali nucleari. Approvato con il 80%.', esito: 'approvato', si: 79.7, no: 20.3, partecipazione: 65.1 },
  { id: 12, anno: 1987, data: '8-9 novembre 1987', tipo: 'abrogativo', titolo: 'Nucleare — Finanziamento estero', descrizione: 'Referendum per abolire i contributi pubblici per la costruzione di centrali nucleari all\'estero. Approvato con l\'80%.', esito: 'approvato', si: 80.6, no: 19.4, partecipazione: 65.1 },
  { id: 13, anno: 1987, data: '8-9 novembre 1987', tipo: 'abrogativo', titolo: 'Responsabilità civile dei giudici', descrizione: 'Referendum per estendere la responsabilità civile dei magistrati. Approvato con il 80%, aprendo la strada alla legge Vassalli.', esito: 'approvato', si: 80.2, no: 19.8, partecipazione: 65.1 },
  { id: 14, anno: 1987, data: '8-9 novembre 1987', tipo: 'abrogativo', titolo: 'Commissione inquirente', descrizione: 'Referendum per abolire la Commissione parlamentare inquirente sui ministri. Approvato con il 85%.', esito: 'approvato', si: 85.0, no: 15.0, partecipazione: 65.1 },
  { id: 15, anno: 1987, data: '8-9 novembre 1987', tipo: 'abrogativo', titolo: 'Partecipazione enti locali a S.p.A.', descrizione: 'Referendum per eliminare la possibilità per gli enti locali di partecipare a società per azioni. Approvato.', esito: 'approvato', si: 79.9, no: 20.1, partecipazione: 65.1 },
  // 1990
  { id: 16, anno: 1990, data: '3-4 giugno 1990', tipo: 'abrogativo', titolo: 'Caccia — Liste chiuse', descrizione: 'Referendum per limitare la caccia. Non raggiunse il quorum con solo il 43% di partecipazione.', esito: 'non_valido', partecipazione: 43.4 },
  { id: 17, anno: 1990, data: '3-4 giugno 1990', tipo: 'abrogativo', titolo: 'Caccia — Periodi', descrizione: 'Referendum per modificare i periodi di caccia. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 43.4 },
  { id: 18, anno: 1990, data: '3-4 giugno 1990', tipo: 'abrogativo', titolo: 'Pesticidi in agricoltura', descrizione: 'Referendum per limitare l\'uso di pesticidi in agricoltura. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 43.4 },
  // 1991
  { id: 19, anno: 1991, data: '9 giugno 1991', tipo: 'abrogativo', titolo: 'Preferenze elettorali (da 3 a 1)', descrizione: 'Referendum per ridurre da tre a una le preferenze esprimibili nelle elezioni politiche. Approvato con il 95.6%, fu il segnale più forte della crisi della Prima Repubblica.', esito: 'approvato', si: 95.6, no: 4.4, partecipazione: 62.5 },
  // 1993
  { id: 20, anno: 1993, data: '18-19 aprile 1993', tipo: 'abrogativo', titolo: 'Sistema elettorale del Senato', descrizione: 'Referendum che abolì il sistema proporzionale per il Senato introducendo il maggioritario. Approvato con il 82.7%, aprì la strada alla Seconda Repubblica.', esito: 'approvato', si: 82.7, no: 17.3, partecipazione: 77.0 },
  { id: 21, anno: 1993, data: '18-19 aprile 1993', tipo: 'abrogativo', titolo: 'Finanziamento pubblico dei partiti', descrizione: 'Referendum per abrogare il finanziamento pubblico ai partiti. Approvato con il 90.3% sull\'onda di Tangentopoli.', esito: 'approvato', si: 90.3, no: 9.7, partecipazione: 77.0 },
  { id: 22, anno: 1993, data: '18-19 aprile 1993', tipo: 'abrogativo', titolo: 'Ministero dell\'Agricoltura', descrizione: 'Referendum per abolire il Ministero dell\'Agricoltura. Approvato con l\'70%.', esito: 'approvato', si: 70.1, no: 29.9, partecipazione: 77.0 },
  { id: 23, anno: 1993, data: '18-19 aprile 1993', tipo: 'abrogativo', titolo: 'Ministero del Turismo', descrizione: 'Referendum per abolire il Ministero del Turismo. Approvato.', esito: 'approvato', si: 82.2, no: 17.8, partecipazione: 77.0 },
  { id: 24, anno: 1993, data: '18-19 aprile 1993', tipo: 'abrogativo', titolo: 'Nomine bancarie', descrizione: 'Referendum per sottrarre al governo la nomina dei vertici delle banche pubbliche. Approvato con il 89.8%.', esito: 'approvato', si: 89.8, no: 10.2, partecipazione: 77.0 },
  { id: 25, anno: 1993, data: '18-19 aprile 1993', tipo: 'abrogativo', titolo: 'USL e riforma sanitaria', descrizione: 'Referendum sulla riforma delle Unità Sanitarie Locali. Approvato.', esito: 'approvato', si: 74.9, no: 25.1, partecipazione: 77.0 },
  { id: 26, anno: 1993, data: '18-19 aprile 1993', tipo: 'abrogativo', titolo: 'Legge antidroga', descrizione: 'Referendum per depenalizzare il consumo personale di droghe. Approvato con il 55.4%.', esito: 'approvato', si: 55.4, no: 44.6, partecipazione: 77.0 },
  { id: 27, anno: 1993, data: '18-19 aprile 1993', tipo: 'abrogativo', titolo: 'Legge Mammì — Televisione', descrizione: 'Referendum per abrogare alcune norme della legge Mammì sulle televisioni private. Approvato.', esito: 'approvato', si: 56.3, no: 43.7, partecipazione: 77.0 },
  { id: 28, anno: 1993, data: '18-19 aprile 1993', tipo: 'abrogativo', titolo: 'Legge Mammì — Pubblicità', descrizione: 'Referendum su norme della legge Mammì relative alla pubblicità televisiva. Approvato.', esito: 'approvato', si: 53.0, no: 47.0, partecipazione: 77.0 },
  // 1995
  { id: 29, anno: 1995, data: '11 giugno 1995', tipo: 'abrogativo', titolo: 'Televisione — Tre reti per proprietario', descrizione: 'Referendum per limitare a due le reti televisive per ogni proprietario. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 57.0 },
  { id: 30, anno: 1995, data: '11 giugno 1995', tipo: 'abrogativo', titolo: 'Orario negozi', descrizione: 'Referendum per liberalizzare gli orari dei negozi. Approvato ma non raggiunse il quorum.', esito: 'non_valido', partecipazione: 57.0 },
  { id: 31, anno: 1995, data: '11 giugno 1995', tipo: 'abrogativo', titolo: 'Sindacati — Trattenute in busta paga', descrizione: 'Referendum per eliminare le trattenute sindacali automatiche in busta paga. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 57.0 },
  // 1997
  { id: 32, anno: 1997, data: '15-16 giugno 1997', tipo: 'abrogativo', titolo: 'Sistema elettorale — Quota proporzionale', descrizione: 'Referendum per eliminare la quota proporzionale del 25% nella legge Mattarella. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 30.2 },
  // 1999
  { id: 33, anno: 1999, data: '18 aprile 1999', tipo: 'abrogativo', titolo: 'Legge elettorale — Abolizione proporzionale', descrizione: 'Referendum per eliminare completamente la quota proporzionale nella Camera. Approvato ma quorum non raggiunto per pochi voti (49.6%).', esito: 'non_valido', partecipazione: 49.6 },
  // 2000
  { id: 34, anno: 2000, data: '21 maggio 2000', tipo: 'abrogativo', titolo: 'Legge elettorale — Scorporo', descrizione: 'Referendum per eliminare lo scorporo nella legge elettorale. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 32.4 },
  { id: 35, anno: 2000, data: '21 maggio 2000', tipo: 'abrogativo', titolo: 'Rimborso spese elettorali', descrizione: 'Referendum per abolire il rimborso delle spese elettorali ai partiti. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 32.4 },
  { id: 36, anno: 2000, data: '21 maggio 2000', tipo: 'abrogativo', titolo: 'Pluralità di cariche sindacali', descrizione: 'Referendum per limitare le cariche sindacali. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 32.4 },
  { id: 37, anno: 2000, data: '21 maggio 2000', tipo: 'abrogativo', titolo: 'Trattenute sindacali', descrizione: 'Referendum sulle trattenute sindacali in busta paga. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 32.4 },
  { id: 38, anno: 2000, data: '21 maggio 2000', tipo: 'abrogativo', titolo: 'Licenziamenti — Art. 18 Statuto dei Lavoratori', descrizione: 'Referendum per estendere le tutele dell\'Art. 18 dello Statuto dei Lavoratori a tutte le imprese. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 32.4 },
  { id: 39, anno: 2000, data: '21 maggio 2000', tipo: 'abrogativo', titolo: 'Magistratura — Separazione delle carriere', descrizione: 'Referendum per separare le carriere dei magistrati giudicanti e requirenti. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 32.4 },
  { id: 40, anno: 2000, data: '21 maggio 2000', tipo: 'abrogativo', titolo: 'Consigli giudiziari', descrizione: 'Referendum sui consigli giudiziari. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 32.4 },
  // 2001
  { id: 41, anno: 2001, data: '7 ottobre 2001', tipo: 'costituzionale', titolo: 'Riforma Titolo V della Costituzione', descrizione: 'Referendum confermativo sulla riforma del Titolo V della Costituzione che ampliava i poteri delle Regioni. Approvato con il 64.2% ma con partecipazione molto bassa.', esito: 'approvato', si: 64.2, no: 35.8, partecipazione: 34.1 },
  // 2003
  { id: 42, anno: 2003, data: '15-16 giugno 2003', tipo: 'abrogativo', titolo: 'Art. 18 Statuto dei Lavoratori — Estensione', descrizione: 'Referendum per estendere le tutele dell\'Art. 18 alle piccole imprese. Non raggiunse il quorum con solo il 25.7% di partecipazione.', esito: 'non_valido', partecipazione: 25.7 },
  { id: 43, anno: 2003, data: '15-16 giugno 2003', tipo: 'abrogativo', titolo: 'Art. 18 Statuto dei Lavoratori — Abolizione parziale', descrizione: 'Referendum per depotenziare l\'Art. 18. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 25.7 },
  // 2005
  { id: 44, anno: 2005, data: '12-13 giugno 2005', tipo: 'abrogativo', titolo: 'Fecondazione assistita — Ricerca sugli embrioni', descrizione: 'Referendum per abrogare i limiti alla ricerca sugli embrioni previsti dalla legge 40/2004. Non raggiunse il quorum (25.9%).', esito: 'non_valido', partecipazione: 25.9 },
  { id: 45, anno: 2005, data: '12-13 giugno 2005', tipo: 'abrogativo', titolo: 'Fecondazione assistita — Limiti produzione embrioni', descrizione: 'Referendum per abolire i limiti alla produzione di embrioni in vitro. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 25.9 },
  { id: 46, anno: 2005, data: '12-13 giugno 2005', tipo: 'abrogativo', titolo: 'Fecondazione assistita — Donazione gameti', descrizione: 'Referendum per consentire la donazione di gameti. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 25.9 },
  { id: 47, anno: 2005, data: '12-13 giugno 2005', tipo: 'abrogativo', titolo: 'Fecondazione assistita — Diritti embrione', descrizione: 'Referendum per modificare le norme sui diritti dell\'embrione. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 25.9 },
  // 2006
  { id: 48, anno: 2006, data: '25-26 giugno 2006', tipo: 'costituzionale', titolo: 'Riforma costituzionale Berlusconi (Devolution)', descrizione: 'Referendum confermativo sulla riforma costituzionale del centro-destra che introduceva il federalismo devolution e la devoluzione di poteri alle regioni. Respinta con il 61.7%.', esito: 'respinto', si: 38.3, no: 61.7, partecipazione: 52.5 },
  // 2009
  { id: 49, anno: 2009, data: '21-22 giugno 2009', tipo: 'abrogativo', titolo: 'Legge elettorale — Voto disgiunto', descrizione: 'Referendum per eliminare la possibilità per i partiti di presentare più liste collegate. Non raggiunse il quorum (23.3%).', esito: 'non_valido', partecipazione: 23.3 },
  { id: 50, anno: 2009, data: '21-22 giugno 2009', tipo: 'abrogativo', titolo: 'Legge elettorale — Soglie di sbarramento', descrizione: 'Referendum sulle soglie di sbarramento nella legge elettorale. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 23.3 },
  { id: 51, anno: 2009, data: '21-22 giugno 2009', tipo: 'abrogativo', titolo: 'Legge elettorale — Liste bloccate', descrizione: 'Referendum per modificare le liste bloccate. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 23.3 },
  // 2011
  { id: 52, anno: 2011, data: '12-13 giugno 2011', tipo: 'abrogativo', titolo: 'Acqua pubblica — Gestione privata', descrizione: 'Referendum per abrogare le norme che favorivano la privatizzazione dei servizi idrici. Approvato con il 95.8%. Grande partecipazione spontanea (57%).', esito: 'approvato', si: 95.8, no: 4.2, partecipazione: 57.0 },
  { id: 53, anno: 2011, data: '12-13 giugno 2011', tipo: 'abrogativo', titolo: 'Acqua pubblica — Profitto', descrizione: 'Referendum per eliminare il profitto garantito dai gestori privati dell\'acqua. Approvato con il 95.7%.', esito: 'approvato', si: 95.7, no: 4.3, partecipazione: 57.0 },
  { id: 54, anno: 2011, data: '12-13 giugno 2011', tipo: 'abrogativo', titolo: 'Nucleare (seconda volta)', descrizione: 'Referendum per abrogare le norme che consentivano il ritorno al nucleare. Approvato con il 94.1%.', esito: 'approvato', si: 94.1, no: 5.9, partecipazione: 57.0 },
  { id: 55, anno: 2011, data: '12-13 giugno 2011', tipo: 'abrogativo', titolo: 'Legittimo impedimento', descrizione: 'Referendum per abrogare la legge sul legittimo impedimento che consentiva ai ministri di non comparire in giudizio. Approvato con il 94.6%.', esito: 'approvato', si: 94.6, no: 5.4, partecipazione: 57.0 },
  // 2016
  { id: 56, anno: 2016, data: '17 aprile 2016', tipo: 'abrogativo', titolo: 'Trivelle — Concessioni entro 12 miglia', descrizione: 'Referendum per bloccare le concessioni di estrazione petrolifera entro 12 miglia dalla costa alla loro naturale scadenza. Non raggiunse il quorum (32.2%).', esito: 'non_valido', partecipazione: 32.2 },
  { id: 57, anno: 2016, data: '4 dicembre 2016', tipo: 'costituzionale', titolo: 'Riforma costituzionale Renzi-Boschi', descrizione: 'Referendum sulla riforma che riduceva i poteri del Senato e modificava il riparto di competenze tra Stato e Regioni. Respinta con il 59.1%, causando le dimissioni del premier Renzi.', esito: 'respinto', si: 40.9, no: 59.1, partecipazione: 68.5 },
  // 2020
  { id: 58, anno: 2020, data: '20-21 settembre 2020', tipo: 'costituzionale', titolo: 'Riduzione dei parlamentari', descrizione: 'Referendum confermativo per ridurre il numero di parlamentari da 945 a 600 (deputati da 630 a 400, senatori da 315 a 200). Approvato con il 69.6%.', esito: 'approvato', si: 69.6, no: 30.4, partecipazione: 51.1 },
  // 2022
  { id: 59, anno: 2022, data: '12 giugno 2022', tipo: 'abrogativo', titolo: 'Custodia cautelare — Limitazioni', descrizione: 'Referendum per modificare le norme sulla custodia cautelare eliminando alcune fattispecie. Non raggiunse il quorum (21.5%).', esito: 'non_valido', partecipazione: 21.5 },
  { id: 60, anno: 2022, data: '12 giugno 2022', tipo: 'abrogativo', titolo: 'Separazione delle carriere dei magistrati', descrizione: 'Referendum per separare definitivamente le carriere dei magistrati giudicanti e requirenti. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 21.5 },
  { id: 61, anno: 2022, data: '12 giugno 2022', tipo: 'abrogativo', titolo: 'CSM — Elezione membri togati', descrizione: 'Referendum per modificare il sistema di elezione dei membri togati del Consiglio Superiore della Magistratura. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 21.5 },
  { id: 62, anno: 2022, data: '12 giugno 2022', tipo: 'abrogativo', titolo: 'Valutazione dei magistrati', descrizione: 'Referendum per consentire agli avvocati di partecipare alla valutazione dei magistrati. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 21.5 },
  { id: 63, anno: 2022, data: '12 giugno 2022', tipo: 'abrogativo', titolo: 'Candidature al CSM', descrizione: 'Referendum per abolire il limite alle candidature al CSM. Non raggiunse il quorum.', esito: 'non_valido', partecipazione: 21.5 },
];

const COLORI_TIPO: Record<string, string> = {
  abrogativo: '#38bdf8',
  costituzionale: '#f97316',
  istituzionale: '#ffd700',
};

const LABEL_TIPO: Record<string, string> = {
  abrogativo: 'Abrogativo',
  costituzionale: 'Costituzionale',
  istituzionale: 'Istituzionale',
};

export default function ReferendumPage() {
  const [search, setSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('tutti');
  const [filtroEsito, setFiltroEsito] = useState<string>('tutti');
  const [aperto, setAperto] = useState<number | null>(null);

  const anni = useMemo(() => [...new Set(REFERENDUM.map(r => r.anno))].sort((a, b) => b - a), []);

  const filtrati = useMemo(() => {
    let lista = REFERENDUM;
    if (filtroTipo !== 'tutti') lista = lista.filter(r => r.tipo === filtroTipo);
    if (filtroEsito !== 'tutti') lista = lista.filter(r => r.esito === filtroEsito);
    if (search.trim()) {
      const q = search.toLowerCase();
      lista = lista.filter(r =>
        r.titolo.toLowerCase().includes(q) ||
        r.descrizione.toLowerCase().includes(q) ||
        String(r.anno).includes(q)
      );
    }
    return lista;
  }, [filtroTipo, filtroEsito, search]);

  const perAnno = useMemo(() => {
    const groups: { anno: number; items: Referendum[] }[] = [];
    const anni = [...new Set(filtrati.map(r => r.anno))].sort((a, b) => b - a);
    anni.forEach(anno => {
      groups.push({ anno, items: filtrati.filter(r => r.anno === anno) });
    });
    return groups;
  }, [filtrati]);

  const totali = { approvati: REFERENDUM.filter(r => r.esito === 'approvato').length, respinti: REFERENDUM.filter(r => r.esito === 'respinto').length, non_validi: REFERENDUM.filter(r => r.esito === 'non_valido').length };

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0d18; }
        ::-webkit-scrollbar { display: none; }
        html, body { overflow-x: hidden; }
        input::placeholder { color: rgba(255,255,255,0.2); font-family: Montserrat, sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .ref-card:active { opacity: 0.8; }
      `}</style>

      <div style={{ fontFamily: 'Montserrat, sans-serif', background: '#0a0d18', minHeight: '100vh' }}>
        <Header />

        <div style={{ padding: '20px 16px 140px' }}>

          {/* HERO */}
          <div style={{
            background: 'linear-gradient(135deg,#0d1829,#111a2e)',
            borderRadius: 24, padding: '24px 20px',
            border: '0.5px solid rgba(255,215,0,0.2)',
            marginBottom: 20, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40, width: 160, height: 160,
              borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(255,215,0,0.06) 0%,transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              display: 'inline-block',
              border: '1px solid rgba(255,215,0,0.3)', borderRadius: 99,
              padding: '4px 14px', fontSize: 9, letterSpacing: 3,
              textTransform: 'uppercase' as const, color: '#ffd700', fontWeight: 700, marginBottom: 14,
            }}>
              Democrazia diretta · Dal 1946
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 14 }}>
              Referendum<br />in Italia
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
              {[
                { n: totali.approvati, l: 'approvati', c: '#22c55e' },
                { n: totali.respinti, l: 'respinti', c: '#fb7185' },
                { n: totali.non_validi, l: 'quorum non raggiunto', c: 'rgba(255,255,255,0.4)' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: `${s.c}12`, border: `0.5px solid ${s.c}30`,
                  borderRadius: 10, padding: '6px 12px',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: s.c }}>{s.n}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEARCH */}
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Cerca per titolo, anno o argomento..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', height: 48,
                background: '#111526',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '0 44px 0 16px',
                color: '#fff', fontSize: 13,
                fontFamily: 'Montserrat, sans-serif',
              }}
            />
            <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* FILTRI TIPO */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 8 }}>
            {[
              { id: 'tutti', label: 'Tutti' },
              { id: 'abrogativo', label: 'Abrogativi' },
              { id: 'costituzionale', label: 'Costituzionali' },
              { id: 'istituzionale', label: 'Istituzionali' },
            ].map(f => (
              <button key={f.id} onClick={() => setFiltroTipo(f.id)} style={{
                padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
                background: filtroTipo === f.id ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)',
                border: `0.5px solid ${filtroTipo === f.id ? 'rgba(255,215,0,0.35)' : 'rgba(255,255,255,0.08)'}`,
                color: filtroTipo === f.id ? '#ffd700' : 'rgba(255,255,255,0.35)',
                fontSize: 10, fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
              }}>{f.label}</button>
            ))}
          </div>

          {/* FILTRI ESITO */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginBottom: 16 }}>
            {[
              { id: 'tutti', label: 'Tutti gli esiti', c: 'rgba(255,255,255,0.4)' },
              { id: 'approvato', label: '● Approvati', c: '#22c55e' },
              { id: 'respinto', label: '● Respinti', c: '#fb7185' },
              { id: 'non_valido', label: '● Quorum non raggiunto', c: 'rgba(255,255,255,0.4)' },
            ].map(f => (
              <button key={f.id} onClick={() => setFiltroEsito(f.id)} style={{
                padding: '5px 11px', borderRadius: 8, cursor: 'pointer',
                background: filtroEsito === f.id ? `${f.c}14` : 'rgba(255,255,255,0.04)',
                border: `0.5px solid ${filtroEsito === f.id ? f.c + '40' : 'rgba(255,255,255,0.08)'}`,
                color: filtroEsito === f.id ? f.c : 'rgba(255,255,255,0.35)',
                fontSize: 10, fontWeight: 700, fontFamily: 'Montserrat, sans-serif',
              }}>{f.label}</button>
            ))}
          </div>

          {/* CONTATORE */}
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>
            {filtrati.length} referendum trovati
          </div>

          {/* LISTA PER ANNO */}
          {perAnno.map(({ anno, items }) => (
            <div key={anno} style={{ marginBottom: 24 }}>
              {/* Label anno */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
              }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#ffd700', letterSpacing: -0.5 }}>{anno}</div>
                <div style={{ flex: 1, height: 0.5, background: 'rgba(255,215,0,0.15)' }} />
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>
                  {items.length} {items.length === 1 ? 'referendum' : 'referendum'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map(r => {
                  const isAperto = aperto === r.id;
                  const coloreEsito = r.esito === 'approvato' ? '#22c55e' : r.esito === 'respinto' ? '#fb7185' : 'rgba(255,255,255,0.35)';
                  const colTipo = COLORI_TIPO[r.tipo];

                  return (
                    <div
                      key={r.id}
                      className="ref-card"
                      onClick={() => setAperto(isAperto ? null : r.id)}
                      style={{
                        background: '#111526',
                        borderRadius: 16,
                        border: `0.5px solid ${isAperto ? coloreEsito + '44' : 'rgba(255,255,255,0.05)'}`,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      {/* HEADER */}
                      <div style={{ padding: '14px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        {/* Bollino esito */}
                        <div style={{
                          width: 12, height: 12, borderRadius: '50%',
                          background: coloreEsito,
                          flexShrink: 0, marginTop: 4,
                          boxShadow: `0 0 8px ${coloreEsito}60`,
                        }} />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Badge tipo */}
                          <div style={{
                            display: 'inline-block', marginBottom: 6,
                            background: `${colTipo}10`, border: `0.5px solid ${colTipo}25`,
                            borderRadius: 5, padding: '2px 7px',
                            fontSize: 8, fontWeight: 700, color: colTipo, letterSpacing: 1,
                          }}>
                            {LABEL_TIPO[r.tipo].toUpperCase()}
                          </div>

                          {/* Titolo */}
                          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 4 }}>
                            {r.titolo}
                          </div>

                          {/* Data + partecipazione */}
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                            {r.data}
                            {r.partecipazione && ` · Partecipazione ${r.partecipazione}%`}
                          </div>
                        </div>

                        {/* Freccia */}
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                          border: '0.5px solid rgba(255,255,255,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transform: isAperto ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                            stroke="rgba(255,255,255,0.35)" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                      </div>

                      {/* CONTENUTO APERTO */}
                      {isAperto && (
                        <div style={{ padding: '0 14px 16px', animation: 'fadeIn 0.2s ease' }}>
                          <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.05)', paddingTop: 14 }}>

                            {/* Descrizione */}
                            <div style={{
                              background: 'rgba(255,255,255,0.03)',
                              border: '0.5px solid rgba(255,255,255,0.06)',
                              borderRadius: 12, padding: '14px',
                              fontSize: 13, color: 'rgba(255,255,255,0.75)',
                              lineHeight: 1.85, marginBottom: 12,
                              fontFamily: 'Georgia, serif',
                            }}>
                              {r.descrizione}
                            </div>

                            {/* Risultato */}
                            {(r.si !== undefined || r.no !== undefined) && (
                              <div style={{
                                background: `${coloreEsito}08`,
                                border: `0.5px solid ${coloreEsito}22`,
                                borderRadius: 12, padding: '12px 14px',
                              }}>
                                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const, color: coloreEsito, marginBottom: 10 }}>
                                  Risultato
                                </div>
                                {r.si !== undefined && (
                                  <div style={{ marginBottom: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                      <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>SÌ</span>
                                      <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>{r.si}%</span>
                                    </div>
                                    <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                                      <div style={{ height: '100%', borderRadius: 99, background: '#22c55e', width: `${r.si}%` }} />
                                    </div>
                                  </div>
                                )}
                                {r.no !== undefined && (
                                  <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                      <span style={{ fontSize: 11, color: '#fb7185', fontWeight: 700 }}>NO</span>
                                      <span style={{ fontSize: 11, color: '#fb7185', fontWeight: 700 }}>{r.no}%</span>
                                    </div>
                                    <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)' }}>
                                      <div style={{ height: '100%', borderRadius: 99, background: '#fb7185', width: `${r.no}%` }} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {r.esito === 'non_valido' && (
                              <div style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '0.5px solid rgba(255,255,255,0.08)',
                                borderRadius: 12, padding: '10px 14px',
                                fontSize: 12, color: 'rgba(255,255,255,0.4)',
                                display: 'flex', alignItems: 'center', gap: 8,
                              }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
                                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                Quorum non raggiunto — il referendum non è valido
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtrati.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 13, marginTop: 48 }}>
              Nessun referendum trovato
            </div>
          )}

          {/* NOTA */}
          <div style={{
            marginTop: 8,
            background: 'rgba(255,215,0,0.04)',
            border: '0.5px solid rgba(255,215,0,0.12)',
            borderRadius: 14, padding: '14px',
            fontSize: 11, color: 'rgba(255,255,255,0.28)', lineHeight: 1.7,
          }}>
            Archivio dei referendum italiani dal 1946 ad oggi. I dati percentuali sono approssimati. Fonte: Ministero dell'Interno, Corte Costituzionale.
          </div>

        </div>

        <Footer />
      </div>
    </>
  );
}
