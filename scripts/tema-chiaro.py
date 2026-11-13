#!/usr/bin/env python3
"""Converte i colori del vecchio tema scuro, scritti a mano nelle pagine,
nelle variabili del tema chiaro (app/globals.css).

Uso: python3 scripts/tema-chiaro.py file1.tsx file2.tsx ...

Le sostituzioni guardano il contesto: il testo bianco diventa scuro, ma
resta bianco quando lo stesso oggetto style ha uno sfondo colorato o una
sfumatura (pulsanti, copertine, testo su immagini).
"""
import re
import sys

# Sfondi scuri → sfondo pagina / card
SFONDI = {
    '#0a0d18': 'var(--bg)', '#050816': 'var(--bg)', '#030509': 'var(--bg)', '#0a1220': 'var(--bg)', '#061224': 'var(--bg)',
    '#111526': 'var(--surface)', '#0d1829': 'var(--surface)', '#111a2e': 'var(--surface)', '#0d1526': 'var(--surface)',
    '#07162b': 'var(--surface-2)', '#0d1f3c': 'var(--surface-2)', '#0e1e42': 'var(--surface-2)', '#1a0a3a': 'var(--surface-2)',
    '#022c22': 'var(--surface-2)',
    '#041428': 'var(--accent-strong)', '#0a3060': 'var(--accent-strong)',
    '#8fd3ff': 'var(--accent)', '#a8c8f0': 'var(--accent)',
}
# Colori pastello pensati per il nero → versione leggibile sul bianco
PASTELLI = {
    '#ffd700': '#ca8a04', '#fbbf24': '#d97706', '#38bdf8': '#0284c7', '#22c55e': '#16a34a',
    '#a78bfa': '#7c3aed', '#fb7185': '#e11d48', '#4ade80': '#16a34a', '#34d399': '#059669',
    '#818cf8': '#4f46e5', '#c4b5fd': '#7c3aed', '#e879f9': '#c026d3', '#60a5fa': '#2563eb',
    '#f87171': '#dc2626', '#c084fc': '#9333ea',
}

RGBA_BIANCO = re.compile(r"rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([0-9.]+)\s*\)")


def testo_per_alfa(a: float) -> str:
    if a >= 0.75:
        return 'var(--text)'
    if a >= 0.45:
        return 'var(--text-2)'
    return 'var(--text-3)'


def ha_sfondo_colorato(obj: str) -> bool:
    """Lo style ha uno sfondo pieno/sfumato su cui il testo bianco va tenuto."""
    for m in re.finditer(r"background(?:Color|Image)?\s*:\s*([^,}\n]+(?:\([^)]*\))?[^,}\n]*)", obj):
        v = m.group(1).lower()
        if 'gradient' in v or 'url(' in v:
            return True
        neutri = [h for h, d in SFONDI.items() if d in ('var(--bg)', 'var(--surface)', 'var(--surface-2)')]
        if any(h in v for h in neutri) or 'none' in v or 'transparent' in v or 'var(--' in v:
            continue
        if re.search(r"rgba\(\s*255\s*,\s*255\s*,\s*255", v):
            continue
        if re.search(r"#[0-9a-f]{3,8}\b|rgba?\(|\$\{", v):
            return True
    return False


def converti_oggetto(obj: str) -> str:
    colorato = ha_sfondo_colorato(obj)

    def prop(m):
        nome, val = m.group(1), m.group(2)
        n = nome.lower()
        if n == 'color' or n == 'caretcolor':
            if not colorato:
                val = RGBA_BIANCO.sub(lambda r: testo_per_alfa(float(r.group(1))), val)
                val = re.sub(r"(['\"])#fff(?:fff)?\1|(['\"])white\2", "'var(--text)'", val, flags=re.I)
            return f"{nome}: {val}"
        if n.startswith('background'):
            val = RGBA_BIANCO.sub(lambda r: 'var(--fill)' if float(r.group(1)) <= 0.15 else r.group(0), val)
            return f"{nome}: {val}"
        if n.startswith('border') or n == 'outline':
            val = RGBA_BIANCO.sub(lambda r: 'var(--line)' if float(r.group(1)) <= 0.35 else r.group(0), val)
            return f"{nome}: {val}"
        if n == 'fontfamily' and 'montserrat' in val.lower():
            return f"{nome}: 'var(--font-ui)'"
        return m.group(0)

    # proprietà semplici:  nome: valore   (valore fino a virgola/fine oggetto, rispettando backtick e parentesi)
    return re.sub(r"\b(color|caretColor|background|backgroundColor|border(?:Top|Bottom|Left|Right)?(?:Color)?|outline|fontFamily)\s*:\s*((?:`[^`]*`|'[^']*'|\"[^\"]*\"|[^,}\n])+)",
                  prop, obj)


def oggetti_style(s: str):
    """Trova gli oggetti style={{ ... }} con le graffe bilanciate."""
    i = 0
    while True:
        i = s.find('style={{', i)
        if i < 0:
            return
        j = i + len('style={')
        prof = 0
        k = j
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


def converti_css(blocco: str) -> str:
    """Regole CSS dentro <style jsx> e template string."""
    def decl(m):
        p, v = m.group(1).lower(), m.group(2)
        if p == 'color':
            v = RGBA_BIANCO.sub(lambda r: testo_per_alfa(float(r.group(1))), v)
            v = re.sub(r"#fff(?:fff)?\b|\bwhite\b", 'var(--text)', v, flags=re.I)
        elif p.startswith('background'):
            v = RGBA_BIANCO.sub(lambda r: 'var(--fill)' if float(r.group(1)) <= 0.15 else r.group(0), v)
        elif p.startswith('border'):
            v = RGBA_BIANCO.sub(lambda r: 'var(--line)' if float(r.group(1)) <= 0.35 else r.group(0), v)
        elif p == 'font-family' and 'montserrat' in v.lower():
            v = 'var(--font-ui)'
        return f"{m.group(1)}: {v}"
    return re.sub(r"([a-zA-Z-]+)\s*:\s*([^;{}]+)", decl, blocco)


def converti(s: str) -> str:
    # 1) oggetti style, dall'ultimo al primo per non spostare gli indici
    pezzi = list(oggetti_style(s))
    for a, b in reversed(pezzi):
        s = s[:a] + converti_oggetto(s[a:b]) + s[b:]
    # 2) blocchi CSS in <style jsx> / <style>
    s = re.sub(r"(<style[^>]*>\{`)(.*?)(`\}</style>)", lambda m: m.group(1) + converti_css(m.group(2)) + m.group(3), s, flags=re.S)
    # 3) SVG: tratti/riempimenti bianchi trasparenti → colore del testo corrente
    s = re.sub(r"(stroke|fill)=\"rgba\(255,\s*255,\s*255,\s*[0-9.]+\)\"", r'\1="currentColor"', s)
    s = re.sub(r"(stroke|fill)=\{?'rgba\(255,\s*255,\s*255,\s*[0-9.]+\)'\}?", r'\1="currentColor"', s)
    # 4) colori esadecimali ovunque (anche dentro template e costanti)
    def hex_alfa(nuovo):
        def f(m):
            alfa = m.group(1)
            if not alfa:
                return nuovo
            if nuovo.startswith('#'):
                return nuovo + alfa
            return f"color-mix(in srgb, {nuovo} {round(int(alfa, 16) / 2.55)}%, transparent)"
        return f
    for vecchio, nuovo in {**SFONDI, **PASTELLI}.items():
        s = re.sub(re.escape(vecchio) + r"([0-9a-fA-F]{2})?(?![0-9a-fA-F])", hex_alfa(nuovo), s, flags=re.I)
    # var(--x)18  (alfa esadecimale accodato a una variabile) non è CSS valido:
    s = re.sub(r"(var\(--[a-z0-9-]+\))([0-9a-fA-F]{2})\b", lambda m: f"color-mix(in srgb, {m.group(1)} {round(int(m.group(2),16)/2.55)}%, transparent)", s)
    # 5) negli attributi SVG le variabili CSS non sono affidabili: colore esplicito
    VALORI = {'--accent': '#4f46e5', '--accent-strong': '#312e81', '--text': '#0b0b0f', '--text-2': '#5b5b66',
              '--text-3': '#8e8e99', '--surface': '#ffffff', '--surface-2': '#f7f7fa', '--bg': '#f2f2f7',
              '--fill': '#e5e5ea', '--line': '#d8d8de'}
    def attr(m):
        return re.sub(r"var\((--[a-z0-9-]+)\)", lambda v: VALORI.get(v.group(1), v.group(0)), m.group(0))
    s = re.sub(r"\b(?:stroke|fill|stopColor|floodColor)=(?:\{[^{}\n]*\}|\"[^\"]*\")", attr, s)
    return s


if __name__ == '__main__':
    for f in sys.argv[1:]:
        prima = open(f, encoding='utf-8').read()
        dopo = converti(prima)
        if dopo != prima:
            open(f, 'w', encoding='utf-8').write(dopo)
            print('convertito', f)
