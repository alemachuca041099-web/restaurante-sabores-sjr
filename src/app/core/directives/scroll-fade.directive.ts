import { Directive, ElementRef, OnDestroy, inject, signal } from '@angular/core';

/**
 * Tracks whether a horizontally-scrolling element has more content past
 * either edge, exposing it as host classes so a wrapping element can fade
 * that edge out (see the `.scroll-x` + `:has()` rules in styles.scss).
 * Without this, a `.scroll-x` row gives mobile users zero hint that there's
 * more to swipe to once the last visible card lines up with the viewport edge.
 */
@Directive({
  selector: '[appScrollFade]',
  host: {
    '[class.can-scroll-start]': 'canStart()',
    '[class.can-scroll-end]': 'canEnd()',
  },
})
export class ScrollFadeDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly canStart = signal(false);
  protected readonly canEnd = signal(false);

  private readonly resizeObserver = new ResizeObserver(() => this.update());

  constructor() {
    const node = this.el.nativeElement;
    node.addEventListener('scroll', this.update, { passive: true });
    this.resizeObserver.observe(node);
    // Content (images) can change the scrollWidth after first paint.
    queueMicrotask(() => this.update());
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('scroll', this.update);
    this.resizeObserver.disconnect();
  }

  private readonly update = (): void => {
    const node = this.el.nativeElement;
    const max = node.scrollWidth - node.clientWidth;
    this.canStart.set(node.scrollLeft > 4);
    this.canEnd.set(node.scrollLeft < max - 4);
  };
}
