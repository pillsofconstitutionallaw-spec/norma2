#!/usr/bin/env python3
"""Allinea la tipografia delle pagine scritte con stili inline al design
system (titoli in Sora, etichette leggibili, testi non minuscoli).

Uso: python3 scripts/tipografia.py file1.tsx file2.tsx ...
Agisce solo dentro gli oggetti style={{ ... }}.
"""
import re
import sys

# Testi troppo piccoli del vecchio design → dimensioni leggibili su telefono
SCALA = {'8': '10', '9': '11', '10': '12', '11': '13', '12': '14'}


def oggetti_style(s):
    i = 0
    while True:
        i = s.find('style={{', i)
        if i < 0:
            return
        j = i + len('style={')
        prof, k = 0, j
        while k < len(s):
            if s[k] == '{':
                prof += 1
            elif s[k] == '}':
                prof -= 1
                if prof == 0:
                    break
            k += 1
        yield j, k + 1
        i = k + 1


def converti_oggetto(o):
    m = re.search(r"fontSize:\s*([0-9.]+)\b", o)
    dim = float(m.group(1)) if m else None
    peso900 = re.search(r"fontWeight:\s*900\b", o)
    spaziato = re.search(r"letterSpacing:\s*([0-9.]+)\b", o)
    maiuscolo = 'uppercase' in o

    # Titolo grande: Sora, peso 800, lettere strette
    if dim and dim >= 22 and peso900:
        o = re.sub(r"fontWeight:\s*900\b", "fontWeight: 800", o)
        o = re.sub(r"letterSpacing:\s*-?[0-9.]+\b", "letterSpacing: -0.8", o)
        if 'fontFamily' in o:
            o = re.sub(r"fontFamily:\s*(?:'[^']*'|\"[^\"]*\")", "fontFamily: 'var(--font-display)'", o)
        else:
            o = o.replace('{', "{ fontFamily: 'var(--font-display)',", 1)
        return o

    # Etichetta minuscola in maiuscoletto molto spaziata → intestazione di sezione
    if dim and dim <= 10 and maiuscolo and spaziato and float(spaziato.group(1)) >= 1.5:
        o = re.sub(r"fontSize:\s*[0-9.]+\b", "fontSize: 12", o, count=1)
        o = re.sub(r"letterSpacing:\s*[0-9.]+\b", "letterSpacing: 0.4", o, count=1)
        return o

    # Testi piccoli → un gradino più grandi
    if m and m.group(1) in SCALA:
        o = o[:m.start(1)] + SCALA[m.group(1)] + o[m.end(1):]
    # Peso 900 → 800 (titoli medi in Sora)
    if peso900:
        o = re.sub(r"fontWeight:\s*900\b", "fontWeight: 800", o)
        if dim and dim >= 15 and 'fontFamily' not in o:
            o = o.replace('{', "{ fontFamily: 'var(--font-display)',", 1)
    return o


def converti(s):
    for a, b in reversed(list(oggetti_style(s))):
        s = s[:a] + converti_oggetto(s[a:b]) + s[b:]
    return s


if __name__ == '__main__':
    for f in sys.argv[1:]:
        prima = open(f, encoding='utf-8').read()
        dopo = converti(prima)
        if dopo != prima:
            open(f, 'w', encoding='utf-8').write(dopo)
            print('aggiornato', f)
