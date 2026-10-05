import { Component, inject } from '@angular/core';
import { ImgFallbackDirective } from '../../../core/directives/img-fallback.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { RestaurantService } from '../../../core/services';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

/** Editorial identity section. All copy comes from restaurant.json -> story. */
@Component({
  selector: 'app-story',
  imports: [RevealDirective, ImgFallbackDirective, SectionTitle],
  templateUrl: './story.html',
  styleUrl: './story.scss',
})
export class Story {
  protected readonly restaurant = inject(RestaurantService);
}
