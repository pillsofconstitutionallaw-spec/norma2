import { codiciMap } from '@/lib/codici';
import { notFound } from 'next/navigation';
import CodiceViewer from '@/components/codici/CodiceViewer';

const COLORI: Record<string, string> = {
  'codice-civile': '#38bdf8',
  'codice-penale': '#f97316',
  'procedura-civile': '#a78bfa',
  'procedura-penale': '#fb7185',
  'codice-appalti': '#eab308',
  'codice-privacy': '#8b5cf6',
  'codice-terzo-settore': '#84cc16',
  'processo-amministrativo': '#f59e0b',
  'processo-tributario': '#ec4899',
  'codice-antimafia': '#22c55e',
  'codice-strada': '#ef4444',
  'codice-consumo': '#06b6d4',
  'beni-culturali': '#f97316',
  'codice-turismo': '#14b8a6',
  'giustizia-contabile': '#a78bfa',
  'codice-contratti-pubblici': '#22c55e',
  'codice-ambiente': '#16a34a',
};

const SOTTOTITOLI: Record<string, string> = {
  'codice-civile': 'R.D. 16 marzo 1942, n. 262',
  'codice-penale': 'R.D. 19 ottobre 1930, n. 1398',
  'procedura-civile': 'R.D. 28 ottobre 1940, n. 1443',
  'procedura-penale': 'D.P.R. 22 settembre 1988, n. 447',
  'codice-appalti': 'D.Lgs. 31 marzo 2023, n. 36',
  'codice-privacy': 'D.Lgs. 30 giugno 2003, n. 196',
  'codice-terzo-settore': 'D.Lgs. 3 luglio 2017, n. 117',
  'processo-amministrativo': 'D.Lgs. 2 luglio 2010, n. 104',
  'processo-tributario': 'D.Lgs. 31 dicembre 1992, n. 546',
  'codice-antimafia': 'D.Lgs. 6 settembre 2011, n. 159',
  'codice-strada': 'D.Lgs. 30 aprile 1992, n. 285',
  'codice-consumo': 'D.Lgs. 6 settembre 2005, n. 206',
  'beni-culturali': 'D.Lgs. 22 gennaio 2004, n. 42',
  'codice-turismo': 'D.Lgs. 23 maggio 2011, n. 79',
  'giustizia-contabile': 'D.Lgs. 26 agosto 2016, n. 174',
  'codice-contratti-pubblici': 'D.Lgs. 31 marzo 2023, n. 36',
  'codice-ambiente': 'D.Lgs. 3 aprile 2006, n. 152',
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