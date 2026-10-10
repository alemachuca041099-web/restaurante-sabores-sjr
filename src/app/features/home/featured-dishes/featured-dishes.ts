import { AfterViewInit, Component, ElementRef, computed, inject } from '@angular/core';
import { ImgFallbackDirective } from '../../../core/directives/img-fallback.directive';
import { createScrollTilt } from '../../../core/utils/scroll-tilt';
import { createSlideCarousel } from '../../../core/utils/slide-carousel';
import { createStackFx } from '../../../core/utils/stack-fx';
import { DISH_TAG_LABELS, Dish } from '../../../core/models';
import { MxnPipe } from '../../../core/pipes/mxn.pipe';
import { MenuService } from '../../../core/services';
import { DishCard } from '../../../shared/components/dish-card/dish-card';
import { RailDots } from '../../../shared/components/rail-dots/rail-dots';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

/**
 * "Nuestros favoritos" — the dishes marked `featured: true` in menu.json.
 * Two different mechanics, not one responsive one:
 *
 * - Desktop/tablet (≥900px): the ZELYON "tarjetas apiladas" pattern (see
 *   animaciones/tarjetas-apiladas-sticky.md) — two sticky columns (text,
 *   photo) that stack as the PAGE scrolls, each card pinned until the next
 *   one arrives and covers it. No swipe, no arrows — the page's own
 *   scroll is the only input, exactly like the ZELYON source.
 * - Mobile (<900px): the original swipe carousel, one dish at a time —
 *   a sticky-stack doesn't translate to a narrow screen the way it does
 *   on desktop (ZELYON itself falls back to a carousel below its own
 *   breakpoint for the same reason).
 */
@Component({
  selector: 'app-featured-dishes',
  imports: [ImgFallbackDirective, MxnPipe, SectionTitle, DishCard, RailDots],
  templateUrl: './featured-dishes.html',
  styleUrl: './featured-dishes.scss',
})
export class FeaturedDishes implements AfterViewInit {
  protected readonly menu = inject(MenuService);
  protected readonly dishes = computed<Dish[]>(() => this.menu.featured());

  private readonly host = inject(ElementRef<HTMLElement>);

  // Desktop/tablet: sticky-stack arrival/coverage, see core/utils/stack-fx.ts.
  // Writes --av/--cv straight to the DOM; nothing to read back here.
  private readonly _stackFx = createStackFx(['.pf-card', '.pf-shot']);

  /** Mobile: swipe carousel + its own lateral entrance, unchanged from before. */
  protected readonly carousel = createSlideCarousel({ length: () => this.dishes().length });
  protected readonly tilt = createScrollTilt({ staggerCount: 5, staggerStep: 0.08, style: 'lateral' });

  ngAfterViewInit(): void {
    this.carousel.observe(this.host.nativeElement);
  }

  protected open(dish: Dish): void {
    this.menu.openDish(dish);
  }

  /** First tag's label, if any — one badge per card, not the full list. */
  protected tagLabel(dish: Dish): string | null {
    const tag = dish.tags?.[0];
    return tag ? DISH_TAG_LABELS[tag] : null;
  }
}
