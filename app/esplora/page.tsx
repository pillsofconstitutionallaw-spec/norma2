import { redirect } from 'next/navigation';

// Le sezioni di Esplora ora stanno nella Home (pannello "Tutte le sezioni").
// Questo indirizzo resta per i link salvati e apre direttamente il pannello.
export default function EsploraPage() {
  redirect('/#sezioni');
}
