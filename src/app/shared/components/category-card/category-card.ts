import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImgFallbackDirective } from '../../../core/directives/img-fallback.directive';
import { Category } from '../../../core/models';

@Component({
  selector: 'app-category-card',
  imports: [RouterLink, ImgFallbackDirective],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
})
export class CategoryCard {
  readonly category = input.required<Category>();
  readonly index = input<number>(0);
  readonly count = input<number>(0);

  protected get number(): string {
    return String(this.index() + 1).padStart(2, '0');
  }
}
