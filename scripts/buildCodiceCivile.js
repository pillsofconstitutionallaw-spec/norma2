const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');

const xml = fs.readFileSync(
  './normativa/xml/19420404_042U0262_VIGENZA_20260429.xml',
  'utf8'
);

const parser = new XMLParser({
  ignoreAttributes: false,
});

const data = parser.parse(xml);

const attachments =
  data.akomaNtoso.act.attachments.attachment;

const articoli = [];

function pulisci(testo = '') {
  return String(testo)
    .replace(/\s+/g, ' ')
    .replace(/ ?@_eId ?/g, ' ')
    .replace(/ ?#text ?/g, ' ')
    .trim();
}

function estraiTesto(nodo) {

  if (!nodo) return '';

  if (typeof nodo === 'string') {
    return nodo;
  }

  if (Array.isArray(nodo)) {
    return nodo.map(estraiTesto).join(' ');
  }

  if (typeof nodo === 'object') {
    return Object.entries(nodo)
      .filter(([key]) => !key.startsWith('@_'))
      .map(([, value]) => estraiTesto(value))
      .join(' ');
  }

  return '';
}

for (const attachment of attachments) {

  const doc = attachment.doc;

  if (!doc) continue;

  const nome =
    doc['@_name'] || '';

  if (!nome.includes('CODICE CIVILE-art.')) {
    continue;
  }

  const numero =
    nome.replace('CODICE CIVILE-art.', '').trim();

  const testo =
    pulisci(
      estraiTesto(doc.mainBody)
    );

  articoli.push({
    numero,
    rubrica: '',
    testo,
  });
}

fs.writeFileSync(
  './data/codici/codiceCivile.json',
  JSON.stringify(articoli, null, 2)
);

console.log(
  'Creato codiceCivile.json con',
  articoli.length,
  'articoli'
);