"""Converte l'XML Akoma Ntoso di Normattiva in una lista di articoli:
{numero, rubrica, libro, testo, abrogato}.

Normattiva usa due strutture:
  - "corpo": gli articoli sono <article> nel <body>, raggruppati in <chapter>
    (decreti legislativi, c.p.p.);
  - "allegati": ogni articolo è un <doc name="<Prefisso>-art. N"> in un
    allegato, e il testo comincia con "Art. N. (Rubrica) ..." seguito dalle
    note di aggiornamento (codici regi e codici allegati a un decreto).
"""
import re
import xml.etree.ElementTree as ET

A = "{http://docs.oasis-open.org/legaldocml/ns/akn/3.0}"

# ---------------------------------------------------------------- testo

def _testo(el, salta=("authorialNote", "eol")):
    """Testo di un elemento, saltando le note a piè di pagina."""
    if el is None:
        return ""
    parti = []

    def visita(e):
        if e.tag.replace(A, "") in salta:
            if e.tail:
                parti.append(e.tail)
            return
        if e.text:
            parti.append(e.text)
        for c in e:
            visita(c)
        if e.tail and e is not el:
            parti.append(e.tail)

    visita(el)
    return "".join(parti)


def _spazi(s):
    return re.sub(r"\s+", " ", s).strip()


# Riferimenti alle note: (96) (3a) (15b) ((233)) ((289a))
_NOTE = re.compile(r"\s*\(\(\s*\d+[a-z]?\s*\)\)|\s*\(\d+[a-z]?\)(?=[\s.,;:(]|$)")


def pulisci(s):
    s = _NOTE.sub("", s)
    # (( testo )) segnala il testo modificato: si tiene il testo, non le parentesi
    s = s.replace("((", "").replace("))", "")
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n[ \t]*(\n[ \t]*)+", "\n\n", s)
    s = re.sub(r" +([.,;:])", r"\1", s)
    return s.strip()


def _abrogato(rubrica, testo):
    t = testo.strip().upper()
    return (not t) or bool(re.match(r"^\(?\s*(L')?ARTICOLO\s+(E'\s+)?ABROGAT|^ABROGAT|^ARTICOLO ABROGATO|^\(?ABROGATO", t)) \
        or bool(re.match(r"^\(?\s*abrogat", rubrica.strip(), re.I))


def _numero(raw):
    n = _spazi(raw)
    n = re.sub(r"^(art(icolo)?\.?)\s*", "", n, flags=re.I).rstrip(". ")
    n = n.replace("-", " ").lower()
    n = re.sub(r"(\d)\s*([a-z])", r"\1 \2", n)       # 3bis -> 3 bis
    return int(n) if n.isdigit() else n


# ---------------------------------------------------------------- libro

_ORD = (r"(?:(?:[IVXLC]+|PRIM[AO]|SECOND[AO]|TERZ[AO]|QUART[AO]|QUINT[AO]|SEST[AO]|SETTIM[AO]|OTTAV[AO]"
        r"|NON[AO]|DECIM[AO]|UNIC[AO])(?:[\s-]?(?:BIS|TER|QUATER|QUINQUIES|SEXIES))?)")
_ROMANI = {"PRIM": "I", "SECOND": "II", "TERZ": "III", "QUART": "IV", "QUINT": "V", "SEST": "VI",
           "SETTIM": "VII", "OTTAV": "VIII", "NON": "IX", "DECIM": "X", "UNIC": "unica"}


def _ordinale(o):
    """'QUINTA-BIS' -> 'V-bis', 'IIIBIS' -> 'III-bis', 'PRIMO' -> 'I'."""
    o = re.sub(r"[\s-]", "", o.upper())
    m = re.match(r"^(.*?)(BIS|TER|QUATER|QUINQUIES|SEXIES)?$", o)
    base, suff = m.group(1), m.group(2)
    if not re.fullmatch(r"[IVXLC]+", base):
        base = _ROMANI.get(base[:-1], base)  # PRIMA/PRIMO -> PRIM -> I
    return base + ("-" + suff.lower() if suff else "")


_DIV = re.compile(
    r"\b(LIBRO|PARTE|TITOLO)\s+(" + _ORD + r")\b\s*(.*?)(?=\s+\b(?:LIBRO|PARTE|TITOLO|CAPO|SEZIONE)\s+" + _ORD + r"\b|$)",
    re.I,
)


def _bello(s):
    """MAIUSCOLO -> Maiuscola iniziale."""
    s = _spazi(s.strip(" -–—.")).strip()
    if s.isupper():
        s = s.capitalize()
    return s


def _divisione(testo, livello):
    for m in _DIV.finditer(testo):
        if m.group(1).upper() == livello:
            ordn = _ordinale(m.group(2).upper())
            desc = _bello(m.group(3))
            etichetta = f"{livello.capitalize()} {ordn}"
            return f"{etichetta} — {desc}" if desc else etichetta
    return None


# ---------------------------------------------------------------- corpo

def _articoli_corpo(body):
    capitoli = [_spazi(pulisci(_testo(c.find(A + "num")) + " " + _testo(c.find(A + "heading"))))
                for c in body.iter(A + "chapter")]
    # Livello del filtro: Libro se esiste, altrimenti Parte, altrimenti Titolo
    tutto = " ".join(capitoli)
    livello = next((l for l in ("LIBRO", "PARTE", "TITOLO")
                    if re.search(r"\b" + l + r"\s+" + _ORD + r"\b", tutto, re.I)), None)

    articoli, libro = [], ""

    def visita(el):
        nonlocal libro
        for c in el:
            tag = c.tag.replace(A, "")
            if tag == "chapter" and livello:
                h = _spazi(pulisci(_testo(c.find(A + "num")) + " " + _testo(c.find(A + "heading"))))
                d = _divisione(h, livello)
                if d:
                    libro = d
                visita(c)
            elif tag == "article":
                articoli.append(_articolo_corpo(c, libro))
            elif tag not in ("num", "heading"):
                visita(c)

    visita(body)
    return articoli


def _articolo_corpo(art, libro):
    numero = _numero(_testo(art.find(A + "num")))
    rubrica = _bello(pulisci(_spazi(_testo(art.find(A + "heading"))))).strip("() .")
    commi = []
    for figlio in art:
        tag = figlio.tag.replace(A, "")
        if tag in ("num", "heading"):
            continue
        t = pulisci(_spazi(_testo(figlio)))
        if t:
            commi.append(t)
    if not rubrica and commi and re.fullmatch(r"\(.*\)\.?", commi[0]):
        rubrica = commi.pop(0).rstrip(".")[1:-1].strip()  # rubrica finita nel primo comma
    testo = "\n\n".join(commi)
    return {"numero": numero, "rubrica": rubrica, "libro": libro,
            "testo": testo, "abrogato": _abrogato(rubrica, testo)}


# ---------------------------------------------------------------- allegati

_SUFFISSI = (r"(?:(?:un|duo|ter|quater|quinquies|sexies|septies|octies|novies)?decies|bis|ter|quater|"
             r"quinquies|sexies|septies|octies|novies)\b")


def _rubrica_iniziale(s):
    """Stacca '(Rubrica).' o '(Rubrica)' all'inizio, con parentesi annidate."""
    s = s.lstrip()
    if not s.startswith("("):
        return "", s
    prof = 0
    for i, ch in enumerate(s):
        prof += ch == "("
        prof -= ch == ")"
        if prof == 0:
            rub = s[1:i].strip()
            resto = s[i + 1:].lstrip(" .\n")
            return rub, resto
    return "", s


def _articoli_allegati(act, prefisso, libri):
    grezzi = []
    for doc in act.iter(A + "doc"):
        nome = doc.get("name") or ""
        if not nome.startswith(prefisso):
            continue
        body = doc.find(A + "mainBody")
        commi, fine = [], False
        for p in (body.iter(A + "p") if body is not None else []):
            # dentro un <p> i commi sono separati da righe vuote
            for blocco in re.split(r"\n\s*\n", _testo(p)):
                t = _spazi(blocco)
                if re.fullmatch(r"-{3,}", t) or t.upper().startswith("AGGIORNAMENTO"):
                    fine = True  # da qui in poi solo note di aggiornamento
                    break
                if t:
                    commi.append(t)
            if fine:
                break
        testo = "\n\n".join(commi)
        # "Art. N" a inizio riga: un "articolo 1" a metà frase (es. "previsto
        # dall'articolo 1") non è l'inizio dell'articolo
        m = re.search(r"^[^\S\n]*(?:[A-Z ]+ )?Art(?:icolo)?\.?\s*\d+(?:[\s\-]*" + _SUFFISSI + r")?(?:\.\d+)?\s*\.?\s*",
                      testo, re.I | re.M)
        intestazione = ""
        if m:
            # quello che precede "Art. N" sono le intestazioni (Libro, Titolo...)
            intestazione, testo = pulisci(testo[:m.start()]), testo[m.end():]
        rubrica, testo = _rubrica_iniziale(testo)
        if not rubrica:
            # rubrica senza parentesi su una riga sua, seguita dal comma 1
            blocchi = testo.split("\n\n", 1)
            if len(blocchi) == 2 and len(blocchi[0]) < 160 and not re.match(r"\d", blocchi[0]) \
                    and not blocchi[0].rstrip().endswith((":", ";", ",")):
                rubrica, testo = blocchi[0].strip("() ."), blocchi[1]
        # "149-bis. (Rubrica)" ripetuto in testa al testo
        testo = re.sub(r"^\s*\d+[\s-]*" + _SUFFISSI + r"\.\s*", "", testo, flags=re.I)
        if not rubrica:
            rubrica, testo = _rubrica_iniziale(testo)
        rubrica = pulisci(rubrica)
        while rubrica.startswith("(") and rubrica.rstrip(" .").endswith(")"):
            rubrica = rubrica.rstrip(" .")[1:-1].strip()
        rubrica, testo = rubrica.rstrip("."), pulisci(testo)
        if not testo and "ABROGAT" in rubrica.upper():
            rubrica, testo = "", rubrica
        grezzi.append((_numero(nome[len(prefisso):]), rubrica, testo, intestazione))

    livello = None
    if not libri:
        tutto = " ".join(g[3] for g in grezzi)
        livello = next((l for l in ("LIBRO", "PARTE", "TITOLO")
                        if re.search(r"\b" + l + r"\s+" + _ORD + r"\b", tutto, re.I)), None)

    articoli, corrente = [], ""
    for numero, rubrica, testo, intestazione in grezzi:
        if libri:
            libro = libri(numero)
        else:
            corrente = (livello and _divisione(_spazi(intestazione), livello)) or corrente
            libro = corrente
        articoli.append({"numero": numero, "rubrica": rubrica, "libro": libro,
                         "testo": testo, "abrogato": _abrogato(rubrica, testo)})
    return articoli


def converti(xml_bytes, prefisso=None, libri=None, salta_premessa=False):
    act = ET.fromstring(xml_bytes).find(A + "act")
    if prefisso:
        arts = _articoli_allegati(act, prefisso, libri)
    else:
        arts = _articoli_corpo(act.find(A + "body"))
    if salta_premessa:
        # articoli del decreto che approva il codice: stanno prima del primo
        # Libro/Parte/Titolo e ripetono i numeri 1, 2... del codice
        while arts and not arts[0]["libro"]:
            arts.pop(0)
    return arts
