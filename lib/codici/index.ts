import { codiceCivile } from '@/data/codici/codiceCivile';
import { codicePenale } from '@/data/codici/codicePenale';
import { proceduraCivile } from '@/data/codici/proceduraCivile';
import { proceduraPenale } from '@/data/codici/proceduraPenale';
import { codiceAppalti } from '@/data/codici/codiceAppalti';
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

export const codiciMap = {
  'codice-civile': { nome: 'Codice Civile', slug: 'codice-civile', articoli: codiceCivile },
  'codice-penale': { nome: 'Codice Penale', slug: 'codice-penale', articoli: codicePenale },
  'procedura-civile': { nome: 'Codice di Procedura Civile', slug: 'procedura-civile', articoli: proceduraCivile },
  'procedura-penale': { nome: 'Codice di Procedura Penale', slug: 'procedura-penale', articoli: proceduraPenale },
  'codice-appalti': { nome: 'Codice degli Appalti', slug: 'codice-appalti', articoli: codiceAppalti },
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
};
