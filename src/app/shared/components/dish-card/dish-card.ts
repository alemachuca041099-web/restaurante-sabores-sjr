import { Component, computed, inject, input, output } from '@angular/core';
import { ImgFallbackDirective } from '../../../core/directives/img-fallback.directive';
import { DISH_TAG_LABELS, Dish } from '../../../core/models';
import { MxnPipe } from '../../../core/pipes/mxn.pipe';
import { MenuService } from '../../../core/services';

/**
 * Menu list row: photo, name with dotted leader, price and description.
 * Variant `tile` renders a photo-first card for grids.
 */
@Component({
  selector: 'app-dish-card',
  imports: [MxnPipe, ImgFallbackDirective],
  templateUrl: './dish-card.html',
  styleUrl: './dish-card.scss',
  host: {
    '[class.is-unavailable]': '!dish().available',
    '[class.variant-tile]': 'variant() === "tile"',
  },
})
export class DishCard {
  readonly dish = input.required<Dish>();
  readonly variant = input<'row' | 'tile'>('row');
  readonly showCategory = input<boolean>(false);
  readonly select = output<Dish>();

  private readonly menu = inject(MenuService);

  protected readonly categoryName = computed(() => this.menu.categoryName(this.dish().categoryId));
  protected readonly tagLabels = computed(() => (this.dish().tags ?? []).map((t) => DISH_TAG_LABELS[t]));

  protected onSelect(): void {
    this.select.emit(this.dish());
  }
}
