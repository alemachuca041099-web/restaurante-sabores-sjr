export interface Promotion {
  id: string;
  title: string;
  description: string;
  price: number | null;
  image: string;
  /** Human-readable validity shown to the user, e.g. "Todos los jueves". */
  validity: string;
  /** ISO date (YYYY-MM-DD). Optional. */
  startDate?: string;
  /** ISO date (YYYY-MM-DD). Optional. */
  endDate?: string;
  active: boolean;
}

export interface PromotionsData {
  promotions: Promotion[];
}
