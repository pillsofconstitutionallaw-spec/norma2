import Link from 'next/link';

export default function CodiciPage() {
  return (
    <main style={{ padding: '40px' }}>
      <h1>Codici</h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginTop: '30px',
        }}
      >
        <Link href="/codici/codice-civile">
          Codice Civile
        </Link>

        <Link href="/codici/codice-penale">
          Codice Penale
        </Link>

        <Link href="/codici/procedura-civile">
          Procedura Civile
        </Link>

        <Link href="/codici/procedura-penale">
          Procedura Penale
        </Link>
      </div>
    </main>
  );
}