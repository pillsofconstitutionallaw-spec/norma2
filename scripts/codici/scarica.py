"""Scarica da Normattiva l'XML Akoma Ntoso vigente di un atto.

Normattiva serve l'XML (do/atto/caricaAKN) solo dentro una sessione: prima si
apre la pagina dell'atto via URN, che imposta il cookie e contiene il link
caricaAKN con dataGU e codiceRedaz già compilati.
"""
import html, http.cookiejar, re, time, urllib.parse, urllib.request
from datetime import date

BASE = "https://www.normattiva.it"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")


def _opener():
    jar = http.cookiejar.CookieJar()
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    op.addheaders = [("User-Agent", UA), ("Accept-Language", "it-IT,it;q=0.9")]
    return op


def scarica_akn(urn: str, tentativi: int = 3) -> bytes:
    ultimo = None
    for i in range(tentativi):
        try:
            op = _opener()
            pagina = op.open(f"{BASE}/uri-res/N2Ls?{urn}", timeout=60).read().decode("utf-8", "replace")
            m = re.search(r'caricaAKN\?([^"\']+)', pagina)
            if not m:
                raise RuntimeError("link caricaAKN non trovato nella pagina dell'atto")
            q = dict(urllib.parse.parse_qsl(html.unescape(m.group(1))))
            q["dataVigenza"] = date.today().strftime("%Y%m%d")
            xml = op.open(f"{BASE}/do/atto/caricaAKN?{urllib.parse.urlencode(q)}", timeout=180).read()
            if not xml.lstrip().startswith(b"<?xml"):
                raise RuntimeError("Normattiva ha risposto con HTML invece dell'XML")
            return xml
        except Exception as e:  # rete instabile: riprova
            ultimo = e
            time.sleep(5 * (i + 1))
    raise RuntimeError(f"{urn}: {ultimo}")
