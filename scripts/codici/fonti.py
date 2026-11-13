"""Elenco dei codici pubblicati sul sito e da dove prenderli su Normattiva."""
import re


def _per_intervalli(intervalli):
    """Libro di un articolo dei codici regi, che nell'XML non lo riportano."""
    def libro(numero):
        m = re.match(r"\d+", str(numero))
        n = int(m.group()) if m else 0
        for fino_a, nome in intervalli:
            if n <= fino_a:
                return nome
        return intervalli[-1][1]
    return libro


LIBRI_CIVILE = _per_intervalli([
    (455, "Libro I — Delle persone e della famiglia"),
    (809, "Libro II — Delle successioni"),
    (1172, "Libro III — Della proprietà"),
    (2059, "Libro IV — Delle obbligazioni"),
    (2642, "Libro V — Del lavoro"),
    (2969, "Libro VI — Della tutela dei diritti"),
])
LIBRI_PENALE = _per_intervalli([
    (240, "Libro I — Dei reati in generale"),
    (649, "Libro II — Dei delitti in particolare"),
    (734, "Libro III — Delle contravvenzioni in particolare"),
])
LIBRI_PROC_CIVILE = _per_intervalli([
    (162, "Libro I — Disposizioni generali"),
    (473, "Libro II — Del processo di cognizione"),
    (632, "Libro III — Del processo di esecuzione"),
    (840, "Libro IV — Dei procedimenti speciali"),
])
LIBRI_PROC_AMM = _per_intervalli([
    (39, "Libro I — Disposizioni generali"),
    (90, "Libro II — Processo amministrativo di primo grado"),
    (111, "Libro III — Impugnazioni"),
    (132, "Libro IV — Ottemperanza e riti speciali"),
    (137, "Libro V — Norme finali"),
])

# nome file/variabile, URN, opzioni del parser
CODICI = [
    ("codiceCivile", "urn:nir:stato:regio.decreto:1942-03-16;262",
     dict(prefisso="CODICE CIVILE-art.", libri=LIBRI_CIVILE)),
    ("codicePenale", "urn:nir:stato:regio.decreto:1930-10-19;1398",
     dict(prefisso="Codice Penale-art.", libri=LIBRI_PENALE)),
    ("proceduraCivile", "urn:nir:stato:regio.decreto:1940-10-28;1443",
     dict(prefisso="CODICE DI PROCEDURA CIVILE-art.", libri=LIBRI_PROC_CIVILE)),
    ("proceduraPenale", "urn:nir:stato:decreto.del.presidente.della.repubblica:1988-09-22;447",
     dict(salta_premessa=True)),
    ("codiceContratti", "urn:nir:stato:decreto.legislativo:2023-03-31;36", {}),
    ("codicePrivacy", "urn:nir:stato:decreto.legislativo:2003-06-30;196", {}),
    ("codiceTerzoSettore", "urn:nir:stato:decreto.legislativo:2017-07-03;117", {}),
    ("codiceProcessoAmministrativo", "urn:nir:stato:decreto.legislativo:2010-07-02;104",
     dict(prefisso="Allegato 1 Codice del processo amministrativo-art.", libri=LIBRI_PROC_AMM)),
    ("codiceProcessoTributario", "urn:nir:stato:decreto.legislativo:1992-12-31;546", {}),
    ("codiceAntimafia", "urn:nir:stato:decreto.legislativo:2011-09-06;159", {}),
    ("codiceStrada", "urn:nir:stato:decreto.legislativo:1992-04-30;285", {}),
    ("codiceConsumo", "urn:nir:stato:decreto.legislativo:2005-09-06;206", {}),
    ("codiceBeniCulturali", "urn:nir:stato:decreto.legislativo:2004-01-22;42",
     dict(salta_premessa=True)),
    ("codiceTurismo", "urn:nir:stato:decreto.legislativo:2011-05-23;79",
     dict(prefisso="Allegato 1 Codice della normativa statale in tema di turismo-art.")),
    ("codiceGiustiziaContabile", "urn:nir:stato:decreto.legislativo:2016-08-26;174",
     dict(prefisso="Allegato 1 Codice della giustizia contabile-art.")),
    ("codiceAmbiente", "urn:nir:stato:decreto.legislativo:2006-04-03;152", {}),
]
