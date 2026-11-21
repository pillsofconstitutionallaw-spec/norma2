import { codiceCivile } from '@/data/codici/codiceCivile';
import { codicePenale } from '@/data/codici/codicePenale';
import { proceduraCivile } from '@/data/codici/proceduraCivile';
import { proceduraPenale } from '@/data/codici/proceduraPenale';
import { codicePrivacy } from '@/data/codici/codicePrivacy';
import { codiceTerzoSettore } from '@/data/codici/codiceTerzoSettore';
import { codiceProcessoAmministrativo } from '@/data/codici/codiceProcessoAmministrativo';
import { codiceProcessoTributario } from '@/data/codici/codiceProcessoTributario';
import { codiceAntimafia } from '@/data/codici/codiceAntimafia';
import { codiceStrada } from '@/data/codici/codiceStrada';
import { codiceConsumo } from '@/data/codici/codiceConsumo';
import { codiceBeniCulturali } from '@/data/codici/codiceBeniCulturali';
import { codiceTurismo } from '@/data/codici/codiceTurismo';
import { codiceGiustiziaContabile } from '@/data/codici/codiceGiustiziaContabile';
import { codiceContratti } from '@/data/codici/codiceContratti';
import { codiceAmbiente } from '@/data/codici/codiceAmbiente';

import { codiceCrisiImpresa } from '@/data/codici/codiceCrisiImpresa';
import { codiceAssicurazioni } from '@/data/codici/codiceAssicurazioni';
import { codiceNavigazione } from '@/data/codici/codiceNavigazione';
import { codiceOrdinamentoMilitare } from '@/data/codici/codiceOrdinamentoMilitare';
import { codiceComunicazioniElettroniche } from '@/data/codici/codiceComunicazioniElettroniche';
import { codiceAmministrazioneDigitale } from '@/data/codici/codiceAmministrazioneDigitale';
import { codiceProtezioneCivile } from '@/data/codici/codiceProtezioneCivile';
import { testoUnicoBancario } from '@/data/codici/testoUnicoBancario';
import { testoUnicoFinanza } from '@/data/codici/testoUnicoFinanza';
import { testoUnicoImmigrazione } from '@/data/codici/testoUnicoImmigrazione';
export const codiciMap = {
  'codice-civile': { nome: 'Codice Civile', slug: 'codice-civile', articoli: codiceCivile },
  'codice-penale': { nome: 'Codice Penale', slug: 'codice-penale', articoli: codicePenale },
  'procedura-civile': { nome: 'Codice di Procedura Civile', slug: 'procedura-civile', articoli: proceduraCivile },
  'procedura-penale': { nome: 'Codice di Procedura Penale', slug: 'procedura-penale', articoli: proceduraPenale },
  'codice-appalti': { nome: 'Codice degli Appalti', slug: 'codice-appalti', articoli: codiceContratti },
  'codice-privacy': { nome: 'Codice della Privacy', slug: 'codice-privacy', articoli: codicePrivacy.map((articolo) => ({ ...articolo, titolo: articolo.rubrica, contenuto: articolo.testo })) },
  'codice-terzo-settore': { nome: 'Codice del Terzo Settore', slug: 'codice-terzo-settore', articoli: codiceTerzoSettore },
  'processo-amministrativo': { nome: 'Codice del Processo Amministrativo', slug: 'processo-amministrativo', articoli: codiceProcessoAmministrativo },
  'processo-tributario': { nome: 'Codice del Processo Tributario', slug: 'processo-tributario', articoli: codiceProcessoTributario },
  'codice-antimafia': { nome: 'Codice Antimafia', slug: 'codice-antimafia', articoli: codiceAntimafia },
  'codice-strada': { nome: 'Codice della Strada', slug: 'codice-strada', articoli: codiceStrada },
  'codice-consumo': { nome: 'Codice del Consumo', slug: 'codice-consumo', articoli: codiceConsumo },
  'beni-culturali': { nome: 'Codice dei Beni Culturali', slug: 'beni-culturali', articoli: codiceBeniCulturali },
  'codice-turismo': { nome: 'Codice del Turismo', slug: 'codice-turismo', articoli: codiceTurismo },
  'giustizia-contabile': { nome: 'Codice della Giustizia Contabile', slug: 'giustizia-contabile', articoli: codiceGiustiziaContabile },
  'codice-contratti-pubblici': { nome: 'Codice dei Contratti Pubblici', slug: 'codice-contratti-pubblici', articoli: codiceContratti },
  'codice-ambiente': { nome: 'Codice dell\'Ambiente', slug: 'codice-ambiente', articoli: codiceAmbiente },
  'crisi-impresa': { nome: "Codice della Crisi d'Impresa", slug: 'crisi-impresa', articoli: codiceCrisiImpresa },
  'codice-assicurazioni': { nome: 'Codice delle Assicurazioni Private', slug: 'codice-assicurazioni', articoli: codiceAssicurazioni },
  'codice-navigazione': { nome: 'Codice della Navigazione', slug: 'codice-navigazione', articoli: codiceNavigazione },
  'ordinamento-militare': { nome: "Codice dell'Ordinamento Militare", slug: 'ordinamento-militare', articoli: codiceOrdinamentoMilitare },
  'comunicazioni-elettroniche': { nome: 'Codice delle Comunicazioni Elettroniche', slug: 'comunicazioni-elettroniche', articoli: codiceComunicazioniElettroniche },
  'amministrazione-digitale': { nome: "Codice dell'Amministrazione Digitale", slug: 'amministrazione-digitale', articoli: codiceAmministrazioneDigitale },
  'protezione-civile': { nome: 'Codice della Protezione Civile', slug: 'protezione-civile', articoli: codiceProtezioneCivile },
  'testo-unico-bancario': { nome: 'Testo Unico Bancario', slug: 'testo-unico-bancario', articoli: testoUnicoBancario },
  'testo-unico-finanza': { nome: 'Testo Unico della Finanza', slug: 'testo-unico-finanza', articoli: testoUnicoFinanza },
  'testo-unico-immigrazione': { nome: 'Testo Unico Immigrazione', slug: 'testo-unico-immigrazione', articoli: testoUnicoImmigrazione },
};
