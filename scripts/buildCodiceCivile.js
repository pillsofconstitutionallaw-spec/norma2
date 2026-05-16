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

fs.writeFileSync(
  './data/codici/codiceCivile.json',
  JSON.stringify(data, null, 2)
);

console.log('JSON creato');