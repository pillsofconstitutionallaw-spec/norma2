const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const filePath = path.join(
  __dirname,
  '../normativa/xml/19881024_088G0492_VIGENZA_20260425.xml'
);

const xml = fs.readFileSync(filePath, 'utf8');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
});

const data = parser.parse(xml);

function extractText(node) {

  if (!node) return '';

  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join(' ');
  }

  if (typeof node === 'object') {
    return Object.values(node)
      .map(extractText)
      .join(' ');
  }

  return '';
}

function findArticles(node, result = []) {

  if (!node || typeof node !== 'object') {
    return result;
  }

  if (node.article) {

    const articles = Array.isArray(node.article)
      ? node.article
      : [node.article];

    result.push(...articles);
  }

  for (const key in node) {
    findArticles(node[key], result);
  }

  return result;
}

const articoliRaw = findArticles(data);

const articoli = articoliRaw.map((articolo) => {

  const numero =
    articolo.num ||
    articolo.heading ||
    '';

  const testo = extractText(articolo)
    .replace(/\s+/g, ' ')
    .trim();

  return {
    numero: String(numero).trim(),
    rubrica: '',
    testo,
  };
});

const output = `const proceduraPenale = ${JSON.stringify(
  articoli,
  null,
  2
)};

export default proceduraPenale;
`;

fs.writeFileSync(
  path.join(
    __dirname,
    '../data/codici/proceduraPenale.ts'
  ),
  output
);

console.log(
  'Creato proceduraPenale.ts con',
  articoli.length,
  'articoli'
);