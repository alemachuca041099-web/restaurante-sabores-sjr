import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { createSlideCarousel } from '../../../core/utils/slide-carousel';
import { MenuService } from '../../../core/services';
import { CategoryCard } from '../../../shared/components/category-card/category-card';
import { Icon } from '../../../shared/components/icon/icon';
import { RailDots } from '../../../shared/components/rail-dots/rail-dots';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

@Component({
  selector: 'app-discover',
  imports: [RouterLink, RevealDirective, CategoryCard, SectionTitle, Icon, RailDots],
  templateUrl: './discover.html',
  styleUrl: './discover.scss',
})
export class Discover implements AfterViewInit {
  protected readonly menu = inject(MenuService);
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Mobile-only, one category at a time — slower and no progress bar, so
   * it reads as an unhurried browse rather than a "por tiempo limitado" push. */
  protected readonly carousel = createSlideCarousel({
    length: () => this.menu.categories().length,
    autoplay: true,
    intervalMs: 8000,
  });

  ngAfterViewInit(): void {
    this.carousel.observe(this.host.nativeElement);
  }
}
