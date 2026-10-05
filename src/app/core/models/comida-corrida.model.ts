export interface Guiso {
  id: string;
  name: string;
  /** Optional clarification, e.g. "Bistec de puerco". */
  note?: string;
}

export interface ComidaCorrida {
  title: string;
  subtitle: string;
  price: number;
  includes: string[];
  note: string;
  image: string;
  guisos: Guiso[];
}
