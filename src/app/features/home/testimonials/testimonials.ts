import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { TestimonialService } from '../../../core/services';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

/** Hidden automatically while testimonials.json is empty. */
@Component({
  selector: 'app-testimonials',
  imports: [RevealDirective, SectionTitle],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  protected readonly testimonials = inject(TestimonialService);

  protected stars(rating: number | undefined): number[] {
    return Array.from({ length: Math.max(0, Math.min(5, Math.round(rating ?? 0))) });
  }
}
