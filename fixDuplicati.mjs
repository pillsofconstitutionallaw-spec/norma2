import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DIR = './data/codici';

function isSimilar(a, b, threshold) {
  if (!b) return false;
  const wordsA = new Set(a.toLowerCase().split(/\s+/));
  const wordsB = new Set(b.toLowerCase().split(/\s+/));
  const intersection = [...wordsA].filter(w => wordsB.has(w)).length;
  const union = new Set([...wordsA, ...wordsB]).size;
  return (intersection / union) >= threshold;
}

function fixCaso2(testo) {
  let prev = null;
  let current = testo;
  while (current !== prev) {
    prev = current;
    const parts = [];
    const SEP = /([;\.]) (?=[A-Za-z\(\[])/g;
    let lastIdx = 0, m;
    while ((m = SEP.exec(current)) !== null) {
      parts.push(current.slice(lastIdx, m.index + 1));
      lastIdx = m.index + m[0].length;
    }
    parts.push(current.slice(lastIdx));
    const deduped = [];
    for (const part of parts) {
      const trimmed = part.trim().replace(/[;\.]\s*$/, '').trim();
      const prevTrimmed = deduped.length > 0 ? deduped[deduped.length-1].trim().replace(/[;\.]\s*$/, '').trim() : '';
      if (!isSimilar(trimmed, prevTrimmed, 0.82)) deduped.push(part);
    }
    current = deduped.join(' ').trim();
  }
  return current !== testo ? current : null;
}

function fixTesto(testo) {
  const m1 = testo.match(/\s*\.?\s*Art\.\s*\d+[a-z-]*\s*\.?\s*\.\s*/i);
  if (m1) return testo.substring(0, testo.indexOf(m1[0])).trim().replace(/\s*\.$/, '');
  return fixCaso2(testo) ?? testo;
}

const files = readdirSync(DIR).filter(f => f.endsWith('.ts'));
let totalFixed = 0;

for (const file of files) {
  const path = join(DIR, file);
  const content = readFileSync(path, 'utf8');
  let fixedCount = 0;

  const fixedContent = content.replace(/testo: '([^']*)'/g, (match, testo) => {
    const fixed = fixTesto(testo);
    if (fixed !== testo) { fixedCount++; return `testo: '${fixed}'`; }
    return match;
  }).replace(/"testo":\s*"((?:[^"\\]|\\.)*)"/g, (match, testo) => {
    const fixed = fixTesto(testo);
    if (fixed !== testo) { fixedCount++; return `"testo": "${fixed}"`; }
    return match;
  });

  if (fixedCount > 0) {
    writeFileSync(path, fixedContent, 'utf8');
    console.log(`✅ ${file}: corretti ${fixedCount} articoli`);
    totalFixed += fixedCount;
  } else {
    console.log(`⏭️  ${file}: nessuna duplicazione trovata`);
  }
}
console.log(`\n✨ Totale articoli corretti: ${totalFixed}`);
