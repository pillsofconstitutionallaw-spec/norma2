const fs = require('fs');
const buildId = Date.now().toString();

let sw = fs.readFileSync('public/sw.js', 'utf8');
sw = sw.replace('norma-__BUILD_ID__', `norma-${buildId}`);
fs.writeFileSync('public/sw.js', sw);

console.log(`✓ SW aggiornato con build ID: ${buildId}`);