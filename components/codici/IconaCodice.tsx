// Un'icona per ogni codice, legata al suo argomento. Tratto 24x24, colore
// dal testo corrente. Con `anima` i tratti si disegnano da soli (vedi
// .disegna in globals.css), in sequenza con un piccolo ritardo tra loro.

const ICONE: Record<string, React.ReactNode> = {
  // Civile: la casa (persone, famiglia, proprietà)
  'codice-civile': <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 9.5V20h13V9.5" /><path d="M10 20v-5.5h4V20" /></>,
  // Penale: le manette
  'codice-penale': <><circle cx="6.5" cy="16" r="4" /><circle cx="17.5" cy="16" r="4" /><path d="M4.6 12.5 5.6 9h1.8l1 3.5" /><path d="M19.4 12.5 18.4 9h-1.8l-1 3.5" /><path d="M7 9c1.5-2.5 3-3 5-1.5S15.5 6.5 17 9" /></>,
  // Procedura civile: il martelletto del giudice
  'procedura-civile': <><path d="m14.5 3.5 6 6" /><path d="m11 7 6 6" /><path d="M12.8 5.2 18.8 11.2" /><path d="M14 10 5 19" /><path d="M3 21h9" /></>,
  // Procedura penale: la bilancia
  'procedura-penale': <><path d="M12 3v17" /><path d="M5 7h14" /><path d="M5 7 2.5 13a2.5 2.5 0 0 0 5 0z" /><path d="M19 7l-2.5 6a2.5 2.5 0 0 0 5 0z" /><path d="M8 20h8" /></>,
  // Contratti pubblici / appalti: il contratto firmato
  'codice-contratti-pubblici': <><path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5z" /><path d="M14 2.5v5h5" /><path d="M8 11.5h7M8 15h4" /><path d="M8 18.5c1-1.4 2-1.4 2.6 0s1.6 1.2 2.6-.4" /></>,
  'codice-appalti': <><path d="M14 2.5H6.5A1.5 1.5 0 0 0 5 4v16a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 20V7.5z" /><path d="M14 2.5v5h5" /><path d="M8 11.5h7M8 15h4" /><path d="M8 18.5c1-1.4 2-1.4 2.6 0s1.6 1.2 2.6-.4" /></>,
  // Privacy: il lucchetto
  'codice-privacy': <><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V7.5a4 4 0 0 1 8 0V11" /><path d="M12 15v2.5" /></>,
  // Terzo settore: il cuore tra le mani
  'codice-terzo-settore': <><path d="M12 13.5s-4.5-2.7-4.5-5.6A2.3 2.3 0 0 1 12 7a2.3 2.3 0 0 1 4.5.9c0 2.9-4.5 5.6-4.5 5.6z" /><path d="M2 15l4 0 3 3h6" /><path d="M22 15h-4l-2 2" /><path d="M2 20h20" /></>,
  // Processo amministrativo: il palazzo della pubblica amministrazione
  'processo-amministrativo': <><path d="M2.5 10 12 4l9.5 6" /><path d="M4 10h16" /><path d="M6 10v8M10 10v8M14 10v8M18 10v8" /><path d="M3 21h18" /></>,
  // Processo tributario: lo scontrino con la percentuale
  'processo-tributario': <><path d="M6 2.5h12v19l-3-2-3 2-3-2-3 2z" /><path d="m9 15 6-6" /><circle cx="9.5" cy="9.5" r="1" /><circle cx="14.5" cy="14.5" r="1" /></>,
  // Antimafia: lo scudo con la spunta
  'codice-antimafia': <><path d="M12 2.5 4.5 5.5v6c0 5 3.3 8.7 7.5 10 4.2-1.3 7.5-5 7.5-10v-6z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  // Strada: l'automobile
  'codice-strada': <><path d="M4 16.5V12l2-5.5h12l2 5.5v4.5z" /><path d="M4 12h16" /><circle cx="7.5" cy="16.5" r="2" /><circle cx="16.5" cy="16.5" r="2" /></>,
  // Consumo: il carrello
  'codice-consumo': <><path d="M2.5 3.5h3l2.2 11h11l2-8H7" /><circle cx="9.5" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></>,
  // Beni culturali: gli archi del Colosseo
  'beni-culturali': <><path d="M3 20V8.5C3 6.3 7 4.5 12 4.5s9 1.8 9 4" /><path d="M21 8.5V20" /><path d="M3 11h18M3 20h18" /><path d="M6 20v-4.5a1.5 1.5 0 0 1 3 0V20M10.5 20v-4.5a1.5 1.5 0 0 1 3 0V20M15 20v-4.5a1.5 1.5 0 0 1 3 0V20" /></>,
  // Turismo: l'aereo
  'codice-turismo': <><path d="M21 15.5v-2l-8-5V4a1.5 1.5 0 0 0-3 0v4.5l-8 5v2l8-2.5v5l-2.2 1.6V21l3.7-1 3.7 1v-1.4L13 18v-5z" /></>,
  // Giustizia contabile: la moneta con l'euro
  'giustizia-contabile': <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.6a4.2 4.2 0 1 0 0 6.8" /><path d="M7 10.5h6M7 13.5h6" /></>,
  // Ambiente: la foglia
  'codice-ambiente': <><path d="M5 19c0-8 5-14 15-15-1 10-6 15-14 15" /><path d="M5 19c3-4 6-7 10-10" /></>,
};

export function IconaCodice({ slug, size = 24, colore, anima = false, ritardo = 0 }: {
  slug: string; size?: number; colore?: string; anima?: boolean; ritardo?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" className={anima ? 'disegna' : undefined}
      style={{ color: colore, ['--d' as string]: `${ritardo}ms` }} aria-hidden>
      {ICONE[slug] ?? <rect x="4" y="3" width="16" height="18" rx="2" />}
    </svg>
  );
}
