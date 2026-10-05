import { Injectable, computed } from '@angular/core';
import { Testimonial, TestimonialsData } from '../models';
import { loadJsonSignal } from './data-loader';

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private readonly data = loadJsonSignal<TestimonialsData>('testimonials.json', { testimonials: [] });
  readonly items = computed<Testimonial[]>(() => this.data()?.testimonials ?? []);
  readonly hasItems = computed(() => this.items().length > 0);
}
