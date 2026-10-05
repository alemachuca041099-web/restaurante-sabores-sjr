import { AfterViewInit, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { ScrollFadeDirective } from '../../../core/directives/scroll-fade.directive';
import { createSlideCarousel } from '../../../core/utils/slide-carousel';
import { Dish } from '../../../core/models';
import { MenuService } from '../../../core/services';
import { DishCard } from '../../../shared/components/dish-card/dish-card';
import { Icon } from '../../../shared/components/icon/icon';
import { RailDots } from '../../../shared/components/rail-dots/rail-dots';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

/**
 * Carousel of the dishes marked `featured: true` in menu.json. Two separate
 * layouts, not one responsive one: tablet/desktop keeps the partial-peek
 * scroll rail (several cards visible, arrows scroll by one screen); mobile
 * swaps to a single dish at a time, swipe-only — no autoplay, unlike the
 * promos and discover carousels, so browsing favorites never feels rushed.
 */
@Component({
  selector: 'app-featured-dishes',
  imports: [RevealDirective, ScrollFadeDirective, SectionTitle, DishCard, Icon, RailDots],
  templateUrl: './featured-dishes.html',
  styleUrl: './featured-dishes.scss',
})
export class FeaturedDishes implements AfterViewInit {
  protected readonly menu = inject(MenuService);
  protected readonly dishes = computed<Dish[]>(() => this.menu.featured());

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly rail = viewChild<ElementRef<HTMLElement>>('rail');

  /** Desktop/tablet rail position (scroll-driven). */
  protected readonly activeIndex = signal(0);

  /** Mobile single-slide stage — manual only. */
  protected readonly carousel = createSlideCarousel({ length: () => this.dishes().length });

  ngAfterViewInit(): void {
    this.carousel.observe(this.host.nativeElement);
  }

  protected open(dish: Dish): void {
    this.menu.openDish(dish);
  }

  protected scroll(direction: 1 | -1): void {
    this.scrollToIndex(this.activeIndex() + direction);
  }

  protected scrollToIndex(index: number): void {
    const el = this.rail()?.nativeElement;
    const card = el?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }

  protected onRailScroll(): void {
    const el = this.rail()?.nativeElement;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    let closest = 0;
    let closestDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.offsetLeft - el.scrollLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    this.activeIndex.set(closest);
  }
}
