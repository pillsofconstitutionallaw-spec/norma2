import { codiciMap } from '@/lib/codici';
import { notFound } from 'next/navigation';

function renderJSON(data: any) {
  return (
    <pre
      style={{
        whiteSpace: 'pre-wrap',
        fontSize: '12px',
        lineHeight: 1.5,
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function CodicePage({
  params,
}: {
  params: { slug: string };
}) {

  const codice =
    codiciMap[params.slug as keyof typeof codiciMap];

  if (!codice) {
    return notFound();
  }

  return (
    <main
      style={{
        padding: '40px',
        background: '#0a0d18',
        color: 'white',
        minHeight: '100vh',
      }}
    >
      <h1>{codice.nome}</h1>

      {renderJSON(codice.articoli)}
    </main>
  );
}