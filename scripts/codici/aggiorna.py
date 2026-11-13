#!/usr/bin/env python3
"""Rigenera data/codici/*.ts dal testo vigente su Normattiva.

Uso:
  python3 scripts/codici/aggiorna.py            # tutti i codici
  python3 scripts/codici/aggiorna.py codicePenale codiceCivile
  python3 scripts/codici/aggiorna.py --da-cartella DIR   # usa XML già scaricati (DIR/<nome>.xml)

Un codice che non si scarica o che esce sospetto (troppi pochi articoli,
troppi testi vuoti, crollo rispetto alla versione attuale) NON viene
sovrascritto: meglio un testo di qualche giorno fa che un codice rotto.
Esce con codice 1 se almeno un codice è stato saltato, così la GitHub Action
lo segnala.
"""
import json, os, re, sys
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))
from fonti import CODICI
from parser import converti
from scarica import scarica_akn

RADICE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATI = os.path.join(RADICE, "data", "codici")


def articoli_attuali(nome):
    p = os.path.join(DATI, nome + ".ts")
    if not os.path.exists(p):
        return 0
    return len(re.findall(r'"numero"\s*:', open(p, encoding="utf-8").read()))


def controlla(nome, arts):
    if len(arts) < 30:
        return f"solo {len(arts)} articoli"
    vigenti = [a for a in arts if not a["abrogato"]]
    vuoti = sum(1 for a in vigenti if len(a["testo"]) < 15)
    if vuoti > max(3, len(vigenti) * 0.02):
        return f"{vuoti} articoli vigenti con testo vuoto"
    prima = articoli_attuali(nome)
    if prima and len(arts) < prima * 0.8:
        return f"articoli scesi da {prima} a {len(arts)}"
    return None


def scrivi(nome, arts):
    corpo = json.dumps(arts, ensure_ascii=False, indent=1)
    ts = (f"// Generato da scripts/codici/aggiorna.py — testo vigente Normattiva al {date.today():%d/%m/%Y}.\n"
          f"// Non modificare a mano: le modifiche verrebbero sovrascritte al prossimo aggiornamento.\n"
          f"import type {{ ArticoloCodice }} from '@/components/codici/CodiceViewer';\n\n"
          f"export const {nome}: ArticoloCodice[] = {corpo};\n")
    with open(os.path.join(DATI, nome + ".ts"), "w", encoding="utf-8") as f:
        f.write(ts)


def main():
    args = sys.argv[1:]
    cartella = None
    if "--da-cartella" in args:
        i = args.index("--da-cartella")
        cartella = args[i + 1]
        del args[i:i + 2]
    scelti = [c for c in CODICI if not args or c[0] in args]

    saltati = []
    for nome, urn, opzioni in scelti:
        try:
            if cartella:
                xml = open(os.path.join(cartella, nome + ".xml"), "rb").read()
            else:
                xml = scarica_akn(urn)
            arts = converti(xml, **opzioni)
            problema = controlla(nome, arts)
        except Exception as e:
            problema = f"errore: {e}"
        if problema:
            print(f"✗ {nome}: {problema} — lasciato invariato")
            saltati.append(nome)
            continue
        scrivi(nome, arts)
        abrog = sum(a["abrogato"] for a in arts)
        print(f"✓ {nome}: {len(arts)} articoli ({abrog} abrogati)")

    if saltati:
        print("Saltati:", ", ".join(saltati))
        sys.exit(1)


if __name__ == "__main__":
    main()
