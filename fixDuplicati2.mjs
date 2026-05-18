import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

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
  const filePath = join(DIR, file);
  let content = readFileSync(filePath, 'utf8');
  
  // Estrae il nome della variabile es. "codiceCivile"
  const varMatch = content.match(/export const (\w+)\s*=/);
  if (!varMatch) { console.log(`⏭️  ${file}: formato non riconosciuto`); continue; }
  const varName = varMatch[1];
  
  // Converte in JSON valido: rimuove "export const X =" e ";" finale
  let jsonStr = content
    .replace(/^export const \w+ = /, '')
    .replace(/;\s*$/, '')
    .trim();
  
  let articoli;
  try {
    // Usa eval in un contesto sicuro per parsare il TS (gestisce virgolette singole)
    articoli = eval(jsonStr);
  } catch(e) {
    console.log(`⚠️  ${file}: errore parse - ${e.message}`);
    continue;
  }
  
  let fixedCount = 0;
  for (const art of articoli) {
    if (art.testo) {
      const fixed = fixTesto(art.testo);
      if (fixed !== art.testo) {
        art.testo = fixed;
        fixedCount++;
      }
    }
  }
  
  if (fixedCount > 0) {
    // Ricostruisce il file TS
    const newContent = `export const ${varName} = ${JSON.stringify(articoli, null, 2)};\n`;
    writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ ${file}: corretti ${fixedCount} articoli`);
    totalFixed += fixedCount;
  } else {
    console.log(`⏭️  ${file}: nessuna duplicazione trovata`);
  }
}
console.log(`\n✨ Totale articoli corretti: ${totalFixed}`);
