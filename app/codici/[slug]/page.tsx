import { codiciMap } from '@/lib/codici';
import { notFound } from 'next/navigation';
import CodiceViewer from '@/components/codici/CodiceViewer';

const COLORI: Record<string, string> = {
  'codice-civile': '#38bdf8',
  'codice-penale': '#f97316',
  'procedura-civile': '#a78bfa',
  'procedura-penale': '#fb7185',
};

const SOTTOTITOLI: Record<string, string> = {
  'codice-civile': 'R.D. 16 marzo 1942, n. 262',
  'codice-penale': 'R.D. 19 ottobre 1930, n. 1398',
  'procedura-civile': 'R.D. 28 ottobre 1940, n. 1443',
  'procedura-penale': 'D.P.R. 22 settembre 1988, n. 447',
};

export default async function CodicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const codice = codiciMap[slug as keyof typeof codiciMap];

  if (!codice) return notFound();

  return (
    <CodiceViewer
      titolo={codice.nome}
      sottotitolo={SOTTOTITOLI[slug] ?? ''}
      colore={COLORI[slug] ?? '#8fd3ff'}
      articoli={codice.articoli}
    />
  );
}