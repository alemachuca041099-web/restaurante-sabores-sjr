import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService, SectionTransitionService, WhatsappService } from '../../../core/services';
import { Icon } from '../../../shared/components/icon/icon';

const HERO_IMAGE = {
  src: 'assets/images/hero/mole-de-olla-wide.jpg',
  alt: 'Mole de olla con elote, calabaza y carne de res servido en cazuela de barro',
};

/** Max vertical drift of the background photo, as % of its own box — must
 *  stay within the extra height .hero__bg has in hero.scss (156%) so the
 *  travel never exposes an empty edge. */
const PARALLAX_RANGE = 24;

@Component({
  selector: 'app-hero',
  imports: [Icon],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements OnDestroy {
  protected readonly restaurant = inject(RestaurantService);
  protected readonly whatsapp = inject(WhatsappService);
  protected readonly image = HERO_IMAGE;

  private readonly router = inject(Router);
  private readonly transition = inject(SectionTransitionService);

  private readonly document = inject(DOCUMENT);
  private readonly heroEl = viewChild<ElementRef<HTMLElement>>('heroEl');
  private readonly reduceMotion =
    this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
  private rafId = 0;

  /** 0 (top of viewport) to 100 (scrolled fully past) — drives the photo's translateY. */
  protected readonly parallaxY = signal(0);

  // getBoundingClientRect() forces a synchronous layout read, so it's throttled
  // to one per animation frame instead of running on every raw scroll event —
  // otherwise it can visibly stutter the page's scrolling anywhere, not just
  // near the hero, because window:scroll fires on every scroll on the page.
  @HostListener('window:scroll')
  onScroll(): void {
    if (this.reduceMotion || this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = 0;
      const win = this.document.defaultView;
      const el = this.heroEl()?.nativeElement;
      if (!win || !el) return;

      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / (rect.height || win.innerHeight)));
      this.parallaxY.set(progress * PARALLAX_RANGE);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }

  protected goToMenu(event: MouseEvent): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.transition.run(() => this.router.navigate(['/menu']));
  }
}
