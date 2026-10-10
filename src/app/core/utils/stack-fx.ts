import { DOCUMENT } from '@angular/common';
import { DestroyRef, ElementRef, inject } from '@angular/core';

export interface StackFxOptions {
  lerp?: number;
  eps?: number;
}

/**
 * Sticky stacked cards — see animaciones/tarjetas-apiladas-sticky.md.
 * For each selector (one per column/pile), computes two lerp'd values per
 * element every frame and writes them straight to the DOM (no Angular
 * change detection per scroll tick):
 *
 * - `--av` (arrival): 0 once the element has reached its sticky position, 1
 *   while it's still arriving from below.
 * - `--cv` (coverage): 0 until the *next* element in the same pile starts
 *   covering it, 1 once fully covered.
 *
 * CSS does the rest (scale/translate/filter/opacity keyed off those two
 * vars). Only runs the rAF loop while the container is near the viewport,
 * and stops once every value has settled — call from a component field
 * initializer (injection context), same shape as `createSlideCarousel`.
 */
export function createStackFx(selectors: string[], opts: StackFxOptions = {}): void {
  const document = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);
  const container = inject(ElementRef<HTMLElement>).nativeElement;

  const reduceMotion = document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
  if (reduceMotion) {
    for (const sel of selectors) {
      const list = Array.from(container.querySelectorAll(sel)) as HTMLElement[];
      list.forEach((el) => {
        el.style.setProperty('--av', '0');
        el.style.setProperty('--cv', '0');
      });
    }
    return;
  }

  const lerp = opts.lerp ?? 0.16;
  const eps = opts.eps ?? 0.0004;
  const arrival = new WeakMap<HTMLElement, number>();
  const coverage = new WeakMap<HTMLElement, number>();
  let raf = 0;
  let near = false;

  function loop(): void {
    raf = 0;
    if (!near) return;
    let moving = false;

    for (const sel of selectors) {
      const list = Array.from(container.querySelectorAll(sel)) as HTMLElement[];
      const rects = list.map((el) => el.getBoundingClientRect());

      list.forEach((el, i) => {
        const span = rects[i].height || 1;
        const pin = parseFloat(getComputedStyle(el).top) || 0;
        const aTarget = Math.min(1, Math.max(0, (rects[i].top - pin) / span));
        const aPrev = arrival.get(el) ?? aTarget;
        const a = aPrev + (aTarget - aPrev) * lerp;
        arrival.set(el, a);
        el.style.setProperty('--av', a.toFixed(4));
        if (Math.abs(aTarget - a) > eps) moving = true;

        if (i === list.length - 1) return;
        const next = rects[i + 1];
        const cTarget = Math.min(1, Math.max(0, 1 - (next.top - rects[i].top) / span));
        const cPrev = coverage.get(el) ?? cTarget;
        const c = cPrev + (cTarget - cPrev) * lerp;
        coverage.set(el, c);
        el.style.setProperty('--cv', c.toFixed(4));
        if (Math.abs(cTarget - c) > eps) moving = true;
      });
    }

    if (moving) raf = requestAnimationFrame(loop);
  }

  function wake(): void {
    if (near && !raf) raf = requestAnimationFrame(loop);
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      near = entry?.isIntersecting ?? false;
      wake();
    },
    { rootMargin: '30% 0px' },
  );
  io.observe(container);

  const win = document.defaultView;
  win?.addEventListener('scroll', wake, { passive: true });
  win?.addEventListener('resize', wake, { passive: true });
  wake();

  destroyRef.onDestroy(() => {
    cancelAnimationFrame(raf);
    io.disconnect();
    win?.removeEventListener('scroll', wake);
    win?.removeEventListener('resize', wake);
  });
}
