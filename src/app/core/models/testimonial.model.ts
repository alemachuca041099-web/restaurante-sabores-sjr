export interface Testimonial {
  id: string;
  author: string;
  quote: string;
  /** 1 – 5 */
  rating?: number;
  source?: string;
  date?: string;
}

export interface TestimonialsData {
  testimonials: Testimonial[];
}
