import { AfterViewInit, Component, ElementRef, OnDestroy, inject, signal } from '@angular/core';
import { ImgFallbackDirective } from '../../../core/directives/img-fallback.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { MxnPipe } from '../../../core/pipes/mxn.pipe';
import { PromotionService, WhatsappService } from '../../../core/services';
import { Icon } from '../../../shared/components/icon/icon';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

/**
 * One promo at a time, full-width — not a multi-card rail. Autoplay every
 * 6s, swipeable on touch, with a progress-dot scrubber that doubles as the
 * "how long until it advances" indicator. Keeps advancing regardless of the
 * pointer — only the explicit play/pause button and being scrolled
 * off-screen (so it never burns a cycle nobody sees) stop it.
 */
@Component({
  selector: 'app-promotions-section',
  imports: [RevealDirective, ImgFallbackDirective, MxnPipe, SectionTitle, Icon],
  templateUrl: './promotions-section.html',
  styleUrl: './promotions-section.scss',
})
export class PromotionsSection implements AfterViewInit, OnDestroy {
  protected readonly promotions = inject(PromotionService);
  protected readonly whatsapp = inject(WhatsappService);

  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly index = signal(0);
  protected readonly playing = signal(true);
  /** True once the section has entered the viewport at least once — gates the slide-in animation so it never fires already-scrolled-past. */
  protected readonly seen = signal(false);

  private timer?: ReturnType<typeof setInterval>;
  private io?: IntersectionObserver;
  private visible = false;
  private readonly reduceMotion =
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  private dragStartX = 0;
  private dragging = false;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.visible = true;
      this.seen.set(true);
      this.arm();
      return;
    }
    this.io = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting);
        if (isVisible === this.visible) return;
        this.visible = isVisible;
        if (isVisible) this.seen.set(true);
        this.arm();
      },
      { threshold: 0.3 },
    );
    this.io.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.io?.disconnect();
  }

  private arm(): void {
    clearInterval(this.timer);
    const total = this.promotions.active().length;
    if (this.reduceMotion || !this.playing() || !this.visible || total < 2) return;
    this.timer = setInterval(() => this.advance(), 6000);
  }

  private advance(): void {
    const total = this.promotions.active().length;
    this.index.update((i) => (i + 1) % total);
  }

  protected go(direction: 1 | -1): void {
    const total = this.promotions.active().length;
    this.index.update((i) => (i + direction + total) % total);
    this.arm();
  }

  protected to(i: number): void {
    this.index.set(i);
    this.arm();
  }

  protected toggle(): void {
    this.playing.update((v) => !v);
    this.arm();
  }

  protected onPointerDown(event: PointerEvent): void {
    this.dragStartX = event.clientX;
    this.dragging = true;
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.dragging) return;
    this.dragging = false;
    const dx = event.clientX - this.dragStartX;
    if (Math.abs(dx) > 44) this.go(dx < 0 ? 1 : -1);
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
