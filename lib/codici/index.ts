import { codiceCivile } from '@/data/codici/codiceCivile';
import codicePenale from '@/data/codici/codicePenale';
import proceduraCivile from '@/data/codici/proceduraCivile';
import proceduraPenale from '@/data/codici/proceduraPenale';

export const codiciMap = {
  'codice-civile': {
    nome: 'Codice Civile',
    slug: 'codice-civile',
    articoli: codiceCivile,
  },
  'codice-penale': {
    nome: 'Codice Penale',
    slug: 'codice-penale',
    articoli: codicePenale,
  },
  'procedura-civile': {
    nome: 'Codice di Procedura Civile',
    slug: 'procedura-civile',
    articoli: proceduraCivile,
  },
  'procedura-penale': {
    nome: 'Codice di Procedura Penale',
    slug: 'procedura-penale',
    articoli: proceduraPenale,
  },
};