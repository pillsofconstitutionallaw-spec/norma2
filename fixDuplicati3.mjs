import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { createRequire } from 'module';
import vm from 'vm';

const DIR = './data/codici';

function isSimilar(a, b, t) {
  if (!b) return false;
  const A = new Set(a.toLowerCase().split(/\s+/));
  const B = new Set(b.toLowerCase().split(/\s+/));
  const i = [...A].filter(w => B.has(w)).length;
  return i / new Set([...A,...B]).size >= t;
}

function fixCaso2(testo) {
  let prev = null, cur = testo;
  while (cur !== prev) {
    prev = cur;
    const parts = [], SEP = /([;\.]) (?=[A-Za-z\(\[])/g;
    let last = 0, m;
    while ((m = SEP.exec(cur)) !== null) { parts.push(cur.slice(last, m.index+1)); last = m.index+m[0].length; }
    parts.push(cur.slice(last));
    const out = [];
    for (const p of parts) {
      const t = p.trim().replace(/[;\.]\s*$/,'').trim();
      const pt = out.length ? out[out.length-1].trim().replace(/[;\.]\s*$/,'').trim() : '';
      if (!isSimilar(t, pt, 0.82)) out.push(p);
    }
    cur = out.join(' ').trim();
  }
  return cur !== testo ? cur : null;
}

function fixTesto(testo) {
  const m = testo.match(/\s*\.?\s*Art\.\s*\d+[a-z-]*\s*\.?\s*\.\s*/i);
  if (m) return testo.substring(0, testo.indexOf(m[0])).trim().replace(/\s*\.$/, '');
  return fixCaso2(testo) ?? testo;
}

function parseTS(content) {
  // Rimuove tutto fino al primo "[" e l'ultimo ";" 
  const start = content.indexOf('[');
  const end = content.lastIndexOf(']');
  if (start === -1 || end === -1) return null;
  const arrStr = content.slice(start, end + 1);
  const ctx = vm.createContext({});
  try {
    return vm.runInContext('(' + arrStr + ')', ctx);
  } catch(e) {
    return null;
  }
}

const files = readdirSync(DIR).filter(f => f.endsWith('.ts'));
let totalFixed = 0;

for (const file of files) {
  const filePath = join(DIR, file);
  const content = readFileSync(filePath, 'utf8');
  
  const varMatch = content.match(/export const (\w+)/);
  if (!varMatch) { console.log(`⏭️  ${file}: skip`); continue; }
  const varName = varMatch[1];

  const articoli = parseTS(content);
  if (!articoli) { console.log(`⚠️  ${file}: parse fallito`); continue; }

  let fixedCount = 0;
  for (const art of articoli) {
    if (art.testo) {
      const fixed = fixTesto(art.testo);
      if (fixed !== art.testo) { art.testo = fixed; fixedCount++; }
    }
  }

  if (fixedCount > 0) {
    const newContent = `export const ${varName} = ${JSON.stringify(articoli, null, 2)};\n`;
    writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ ${file}: corretti ${fixedCount} articoli`);
    totalFixed += fixedCount;
  } else {
    console.log(`⏭️  ${file}: nessuna duplicazione trovata`);
  }
}
console.log(`\n✨ Totale articoli corretti: ${totalFixed}`);
