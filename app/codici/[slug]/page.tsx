import { notFound } from 'next/navigation';
import { codiciMap } from '@/lib/codici';

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
    <main style={{ padding: '40px' }}>
      <h1>{codice.nome}</h1>

      {codice.articoli.map((articolo) => (
        <div
          key={articolo.numero}
          style={{
            marginBottom: '30px',
            borderBottom: '1px solid #ccc',
            paddingBottom: '20px',
          }}
        >
          <h2>Art. {articolo.numero}</h2>

          {articolo.rubrica && (
            <h3>{articolo.rubrica}</h3>
          )}

          <p>{articolo.testo}</p>
        </div>
      ))}
    </main>
  );
}