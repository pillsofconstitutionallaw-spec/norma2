const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const filePath = path.join(
  __dirname,
  '../normativa/xml/19401028_040U1443_VIGENZA_20260220.xml'
);

const xml = fs.readFileSync(filePath, 'utf8');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
});

const data = parser.parse(xml);

const attachments =
  data.akomaNtoso.act.attachments?.attachment || [];

const articoli = [];

function extractText(node) {

  if (!node) return '';

  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join(' ');
  }

  if (typeof node === 'object') {
    return Object.entries(node)
      .filter(([key]) => !key.startsWith('@'))
      .map(([, value]) => extractText(value))
      .join(' ');
  }

  return '';
}

function pulisci(testo = '') {
  return String(testo)
    .replace(/\s+/g, ' ')
    .trim();
}

for (const attachment of attachments) {

  const doc = attachment.doc;

  if (!doc) continue;

  const nome = doc.name || '';

  if (
    !nome.includes(
      'CODICE DI PROCEDURA CIVILE-art.'
    )
  ) {
    continue;
  }

  const numero = nome
    .replace(
      'CODICE DI PROCEDURA CIVILE-art.',
      ''
    )
    .trim();

  const testo = pulisci(
    extractText(doc.mainBody)
  );

  articoli.push({
    numero,
    rubrica: '',
    testo,
  });
}

const output = `const proceduraCivile = ${JSON.stringify(
  articoli,
  null,
  2
)};

export default proceduraCivile;
`;

fs.writeFileSync(
  path.join(
    __dirname,
    '../data/codici/proceduraCivile.ts'
  ),
  output
);

console.log(
  'Creato proceduraCivile.ts con',
  articoli.length,
  'articoli'
);