import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ListaCodici from '@/components/codici/ListaCodici';
import { codiciMap } from '@/lib/codici';

// Server component: i conteggi si calcolano qui, al build, dai dati veri.
// Al browser arrivano solo i numeri, non gli 11 MB di testi dei codici.
export default function CodiciPage() {
  const conteggi = Object.fromEntries(
    Object.entries(codiciMap).map(([slug, c]) => [
      slug,
      (c.articoli as { abrogato?: boolean }[]).filter(a => !a.abrogato).length,
    ]),
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <Header />
      <main className="pagina">
        <h1 className="titolo-grande appare">Codici</h1>
        <p className="sottotitolo appare" style={{ animationDelay: '30ms' }}>
          Testo vigente da Normattiva, aggiornato ogni settimana.
        </p>

        <ListaCodici conteggi={conteggi} />

        <p style={{ marginTop: 28, fontSize: 11.5, lineHeight: 1.6, color: 'var(--text-3)', textAlign: 'center', padding: '0 12px' }}>
          Fonte: Normattiva.it. Le spiegazioni AI hanno scopo didattico e non sostituiscono il parere di un professionista.
        </p>
      </main>
      <Footer />
    </div>
  );
}
