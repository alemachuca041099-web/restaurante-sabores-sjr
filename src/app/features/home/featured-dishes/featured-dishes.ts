import { AfterViewInit, Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { ScrollFadeDirective } from '../../../core/directives/scroll-fade.directive';
import { createSlideCarousel } from '../../../core/utils/slide-carousel';
import { createScrollTilt } from '../../../core/utils/scroll-tilt';
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
 *
 * Cards get a 3D entrance tied directly to page scroll position (not a
 * threshold-triggered fade): as the section approaches, each one rotates
 * in from a tilted, receded state to flat, staggered by index. Swiping
 * between dishes on mobile is unaffected — this only drives the one-time
 * reveal as the section comes into view.
 */
@Component({
  selector: 'app-featured-dishes',
  imports: [ScrollFadeDirective, SectionTitle, DishCard, Icon, RailDots],
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

  /** 3D entrance per card, see animaciones/scroll-progreso-3d.md — shared
   *  with Promociones and Nuestra identidad instead of each reimplementing it. */
  protected readonly tilt = createScrollTilt({ staggerCount: 5, staggerStep: 0.08 });

  // True while an arrow-click-triggered smooth scroll is still settling.
  // onRailScroll() ignores the rail's native `scroll` events during this
  // window — otherwise those events (which fire continuously as the
  // animation progresses, reporting the *lagging* real position) would
  // overwrite the optimistic index scroll() already set, undoing rapid
  // clicks back down to wherever the animation had only gotten to so far.
  private programmaticScroll = false;
  private programmaticScrollTimer?: ReturnType<typeof setTimeout>;

  /** Mobile single-slide stage — manual only. */
  protected readonly carousel = createSlideCarousel({ length: () => this.dishes().length });

  ngAfterViewInit(): void {
    this.carousel.observe(this.host.nativeElement);
  }

  protected open(dish: Dish): void {
    this.menu.openDish(dish);
  }

  // Advances activeIndex() optimistically, right away — not from the rail's
  // measured scroll position, which during an in-flight smooth-scroll lags
  // behind (or doesn't move at all yet between two clicks fired a few ms
  // apart) and would make a second quick click re-target the same card the
  // first one did. Clicking the arrow rapidly several times now always
  // ends up `clicks` cards further: each call retargets scrollIntoView to
  // a newer card before the previous animation finishes, and the browser
  // just smoothly redirects toward the latest target instead of restarting.
  protected scroll(direction: 1 | -1): void {
    const next = Math.min(this.lastReachableIndex(), Math.max(0, this.activeIndex() + direction));
    this.activeIndex.set(next);
    this.scrollToIndex(next);
  }

  // The rail doesn't scroll one full card per index once it's close to the
  // end — the last few cards are already visible at max scroll without
  // moving further. Clamping to dishes().length - 1 let a burst of clicks
  // push activeIndex() past that point (reachable with no visible effect,
  // since scrollIntoView on an already-visible card is a no-op); from
  // there, clicking "anterior" needed several clicks before the rail
  // visibly moved again, which read as it "not working" at the end. This
  // finds the last index that still has room to scroll further right, so
  // activeIndex() never drifts past what's actually reachable.
  private lastReachableIndex(): number {
    const el = this.rail()?.nativeElement;
    if (!el) return 0;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const children = Array.from(el.children) as HTMLElement[];
    let last = 0;
    children.forEach((child, i) => {
      if (child.offsetLeft <= maxScrollLeft) last = i;
    });
    return last;
  }

  protected scrollToIndex(index: number): void {
    const el = this.rail()?.nativeElement;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!card) return;

    this.programmaticScroll = true;
    clearTimeout(this.programmaticScrollTimer);
    // Comfortably longer than a browser's smooth-scroll duration (usually
    // a few hundred ms) — re-armed on every call, so a burst of clicks
    // keeps extending the window until the *last* one actually settles.
    this.programmaticScrollTimer = setTimeout(() => {
      this.programmaticScroll = false;
    }, 600);

    card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }

  protected onRailScroll(): void {
    if (this.programmaticScroll) return;
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
