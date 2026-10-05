export interface Address {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  /** Free-text query used to build the Google Maps link. */
  mapsQuery: string;
}

export interface OpeningHours {
  /** e.g. "Lunes a viernes" */
  days: string;
  /** e.g. "09:00 – 18:00" or "Cerrado" */
  hours: string;
}

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  url: string;
}

export interface StoryHighlight {
  label: string;
  value: string;
}

export interface Story {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  highlights: StoryHighlight[];
  image: string;
  imageAlt: string;
  /** True while `paragraphs`/`highlights` are example copy awaiting the restaurant's real story. */
  isPlaceholder?: boolean;
}

export interface Invoicing {
  /** Link to the branded self-invoicing portal (e.g. Facturapi E-Receipts). Empty hides the CTA. */
  url: string;
  note: string;
}

export interface Seo {
  title: string;
  description: string;
  image: string;
  url: string;
}

export interface Restaurant {
  name: string;
  legalName: string;
  tagline: string;
  /** Short, character-driven line used only in the hero (falls back to `tagline`). */
  heroDescriptor?: string;
  /** Small identity tags shown under the hero CTAs, e.g. "Cocina mexicana". */
  cuisineTags?: string[];
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDefaultMessage: string;
  address: Address;
  hours: OpeningHours[];
  hoursNote: string;
  social: SocialLink[];
  story: Story;
  seo: Seo;
  invoicing?: Invoicing;
}
