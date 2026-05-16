export interface ArticoloCodice {
  numero: number | string;
  libro?: string;
  titolo?: string;
  rubrica?: string;
  testo: string;
}

export interface Codice {
  nome: string;
  slug: string;
  articoli: ArticoloCodice[];
}