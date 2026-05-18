#!/usr/bin/env python3
"""
Converte file XML Normattiva in file .ts per il progetto Norma2.
Uso: python3 xmlToTs.py <file.xml> <nomeVariabile> <output.ts>
Es:  python3 xmlToTs.py codiceAmbiente.xml codiceAmbiente data/codici/codiceAmbiente.ts
"""

from lxml import etree
import re, json, sys, os

AKN = 'http://docs.oasis-open.org/legaldocml/ns/akn/3.0'

def tag(el):
    return el.tag.split('}')[-1] if '}' in el.tag else el.tag

def has_ancestor(el, tag_name):
    p = el.getparent()
    while p is not None:
        if tag(p) == tag_name:
            return True
        p = p.getparent()
    return False

def extract_testo(article):
    """Estrae il testo dell'articolo escludendo note e sezioni di aggiornamento."""
    parts = []
    
    for para in article.findall(f'.//{{{AKN}}}paragraph'):
        # Salta paragrafi dentro authorialNote o section (note a pie' di pagina)
        if has_ancestor(para, 'authorialNote') or has_ancestor(para, 'section'):
            continue
        
        # Raccoglie testo da tutti i nodi figli
        for node in para.iter():
            if tag(node) == 'authorialNote':
                # Non iterare dentro le note
                node.tail  # mantieni il tail
                continue
            if has_ancestor(node, 'authorialNote'):
                continue
            if node.text and node.text.strip():
                parts.append(node.text.strip())
            if node.tail and node.tail.strip():
                t = node.tail.strip()
                if t not in ('((', '))'):
                    parts.append(t)
    
    testo = ' '.join(parts)
    # Pulizia: spazi multipli, newline
    testo = re.sub(r'\s+', ' ', testo).strip()
    # Rimuove trattini e separatori da fine testo
    testo = re.sub(r'\s*[-–]+\s*$', '', testo).strip()
    return testo

def get_libro(article):
    """Risale la gerarchia per trovare il nome del libro/parte/titolo."""
    parent = article.getparent()
    candidates = []
    while parent is not None:
        t = tag(parent)
        if t in ('book', 'part', 'title', 'chapter', 'section'):
            num_el = parent.find(f'{{{AKN}}}num')
            head_el = parent.find(f'{{{AKN}}}heading')
            num = num_el.text.strip() if num_el is not None and num_el.text else ''
            head = head_el.text.strip() if head_el is not None and head_el.text else ''
            # Rimuove markup tipo (( ))
            head = re.sub(r'\(\(|\)\)', '', head).strip()
            num = re.sub(r'\(\(|\)\)', '', num).strip()
            if head or num:
                label = f"{num} — {head}".strip(' —') if (num and head) else (num or head)
                candidates.append(label)
        parent = parent.getparent()
    
    # Prende il contenitore più vicino all'articolo
    return candidates[0] if candidates else ''

def parse_xml(path):
    tree = etree.parse(path)
    root = tree.getroot()
    
    articles = root.findall(f'.//{{{AKN}}}article')
    result = []
    
    for art in articles:
        # Numero
        num_el = art.find(f'{{{AKN}}}num')
        num_text = num_el.text.strip() if num_el is not None and num_el.text else ''
        num_match = re.search(r'(\d+)', num_text)
        numero = int(num_match.group(1)) if num_match else 0
        
        # Rubrica
        heading_el = art.find(f'{{{AKN}}}heading')
        rubrica = heading_el.text.strip() if heading_el is not None and heading_el.text else ''
        rubrica = re.sub(r'\(\(|\)\)', '', rubrica).strip()
        
        # Libro
        libro = get_libro(art)
        
        # Testo
        testo = extract_testo(art)
        
        # Abrogato
        abrogato = bool(re.search(r'ARTICOLO ABROGATO|ARTICOLO SOPPRESSO', testo, re.I))
        
        result.append({
            'numero': numero,
            'rubrica': rubrica,
            'libro': libro,
            'testo': testo,
            'abrogato': abrogato
        })
    
    return result

def main():
    if len(sys.argv) < 4:
        print("Uso: python3 xmlToTs.py <input.xml> <nomeVariabile> <output.ts>")
        print("Es:  python3 xmlToTs.py ambiente.xml codiceAmbiente data/codici/codiceAmbiente.ts")
        sys.exit(1)
    
    xml_path = sys.argv[1]
    var_name = sys.argv[2]
    out_path = sys.argv[3]
    
    print(f"Parsing {xml_path}...")
    articles = parse_xml(xml_path)
    print(f"Trovati {len(articles)} articoli")
    
    # Genera il file .ts
    os.makedirs(os.path.dirname(out_path) if os.path.dirname(out_path) else '.', exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(f'export const {var_name} = ')
        f.write(json.dumps(articles, ensure_ascii=False, indent=2))
        f.write(';\n')
    
    print(f"✅ Scritto: {out_path}")

if __name__ == '__main__':
    main()
