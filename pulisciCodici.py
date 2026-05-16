#!/usr/bin/env python3
"""
Esegui nella root del progetto:
python3 pulisciCodici.py
"""

import re
import os

FILES = [
    'data/codici/codiceCivile.ts',
    'data/codici/codicePenale.ts',
    'data/codici/proceduraCivile.ts',
    'data/codici/proceduraPenale.ts',
]

def pulisci_testo(testo):
    if not testo:
        return ''
    testo = re.sub(
        r'CODICE\s+(?:PENALE|CIVILE|DI PROCEDURA CIVILE|DI PROCEDURA PENALE)'
        r'\s+Art\.\s*[\w\s\.]+content__ref_\d+\s+/akn/[^\s]+\s*\.?\s*',
        '', testo
    )
    testo = re.sub(r'content__ref_\d+\s+/akn/[^\s]+\s*', '', testo)
    testo = re.sub(r'\bins_\d+(?:_\d+)?\b\s*', '', testo)
    testo = re.sub(r'-{5,}.*$', '', testo, flags=re.DOTALL)
    testo = re.sub(r'AGGIORNAMENTO\s*\(\d+\).*$', '', testo, flags=re.DOTALL)
    testo = re.sub(r'/akn/[^\s"\'\\]+', '', testo)
    testo = re.sub(r'\(\(\s*', '', testo)
    testo = re.sub(r'\s*\)\)', '', testo)
    testo = re.sub(r'\s{2,}', ' ', testo)
    testo = re.sub(r'\.\s*\.', '.', testo)
    return testo.strip()

def processa_file(filepath):
    if not os.path.exists(filepath):
        print(f'  File non trovato: {filepath}')
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        contenuto = f.read()
    righe = contenuto.split('\n')
    nuove_righe = []
    for riga in righe:
        if '"testo":' in riga:
            m = re.search(r'"testo":\s*"(.*)"', riga)
            if m:
                testo_originale = m.group(1)
                testo_dec = (testo_originale
                             .replace('\\"', '"')
                             .replace('\\n', '\n')
                             .replace('\\\\', '\\'))
                testo_pulito = pulisci_testo(testo_dec)
                testo_enc = (testo_pulito
                             .replace('\\', '\\\\')
                             .replace('"', '\\"')
                             .replace('\n', ' '))
                riga = re.sub(r'"testo":\s*".*"', f'"testo": "{testo_enc}"', riga)
        nuove_righe.append(riga)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write('\n'.join(nuove_righe))
    print(f'  Pulito: {filepath}')

if __name__ == '__main__':
    print('Pulizia codici in corso...\n')
    for f in FILES:
        processa_file(f)
    print('\nFatto! Riavvia il dev server con: npm run dev')
