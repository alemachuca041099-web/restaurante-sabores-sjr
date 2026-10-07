import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { ImgFallbackDirective } from '../../../core/directives/img-fallback.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { createSlideCarousel } from '../../../core/utils/slide-carousel';
import { RestaurantService } from '../../../core/services';
import { RailDots } from '../../../shared/components/rail-dots/rail-dots';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

/**
 * Editorial identity section. All copy comes from restaurant.json -> story.
 * Desktop/tablet (≥640px) keeps the side-by-side grid; mobile swaps to a
 * swipeable one-card-at-a-time stage — same mechanic as the Favoritos
 * carousel — splitting photo / text / highlights into separate slides
 * instead of stacking all of it in one long scroll.
 */
@Component({
  selector: 'app-story',
  imports: [RevealDirective, ImgFallbackDirective, SectionTitle, RailDots, NgTemplateOutlet],
  templateUrl: './story.html',
  styleUrl: './story.scss',
})
export class Story implements AfterViewInit {
  protected readonly restaurant = inject(RestaurantService);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  protected readonly slideCount = computed(() => (this.restaurant.story()?.highlights.length ? 3 : 2));
  protected readonly carousel = createSlideCarousel({ length: () => this.slideCount() });

  /** Each slide (photo / text / facts) has a very different natural height —
   *  without this, the flex track would stretch every slide to match the
   *  tallest one (the photo), leaving huge dead space on the short ones. */
  protected readonly stageHeight = signal<number | null>(null);

  constructor() {
    effect(() => {
      const index = this.carousel.index();
      requestAnimationFrame(() => {
        const slide = this.track()?.nativeElement.children[index] as HTMLElement | undefined;
        if (slide) this.stageHeight.set(slide.offsetHeight);
      });
    });
  }

  ngAfterViewInit(): void {
    this.carousel.observe(this.host.nativeElement);
  }
}
