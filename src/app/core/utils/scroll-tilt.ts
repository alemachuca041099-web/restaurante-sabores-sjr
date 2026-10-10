import { DOCUMENT } from '@angular/common';
import { DestroyRef, ElementRef, inject, signal } from '@angular/core';

export interface ScrollTiltOptions {
  /** How many leading items get a staggered start (0 = no stagger — a single wrapper settles as one piece). */
  staggerCount?: number;
  /** Fraction of total progress each staggered step delays its start by. */
  staggerStep?: number;
}

/**
 * Scroll-progress → 3D transform, per `animaciones/scroll-progreso-3d.md`.
 * Ties a card's (or a whole carousel's) tilt/depth/opacity directly to how
 * far the host element has scrolled into view — not a threshold-triggered
 * fade — so it rotates/settles in lockstep with the scroll position itself.
 * Call from a component field initializer (constructor-equivalent
 * injection context), same shape as `createSlideCarousel`.
 */
export function createScrollTilt(opts: ScrollTiltOptions = {}) {
  const document = inject(DOCUMENT);
  const destroyRef = inject(DestroyRef);
  const hostEl = inject(ElementRef<HTMLElement>).nativeElement;

  // TEMP: reduced-motion gate disabled while diagnosing "no veo el efecto"
  // — restore `document.defaultView?.matchMedia(...).matches ?? false` once
  // confirmed this isn't the cause.
  const reduceMotion = false;
  const revealProgress = signal(reduceMotion ? 1 : 0);

  const staggerCount = opts.staggerCount ?? 0;
  const staggerStep = opts.staggerStep ?? 0.08;

  let raf = 0;

  function onScroll(): void {
    if (reduceMotion || raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const win = document.defaultView;
      if (!win) return;
      const rect = hostEl.getBoundingClientRect();
      // Starts animating once the host's top is a full viewport away,
      // finishes once it's reached 35% from the top.
      const start = win.innerHeight;
      const end = win.innerHeight * 0.35;
      revealProgress.set(Math.min(1, Math.max(0, (start - rect.top) / (start - end))));
    });
  }

  if (!reduceMotion) {
    const win = document.defaultView;
    win?.addEventListener('scroll', onScroll, { passive: true });
    win?.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    destroyRef.onDestroy(() => {
      cancelAnimationFrame(raf);
      win?.removeEventListener('scroll', onScroll);
      win?.removeEventListener('resize', onScroll);
    });
  }

  /** Per-item local progress (0–1) — staggered by index when staggerCount > 0. */
  function progressFor(index = 0): number {
    const staggerIndex = staggerCount > 0 ? Math.min(index, staggerCount) : 0;
    const threshold = staggerIndex * staggerStep;
    const p = revealProgress();
    if (p <= threshold) return 0;
    return Math.min(1, (p - threshold) / (1 - threshold));
  }

  /** Inline transform + opacity for an item at the given index. */
  function styleFor(index = 0): Record<string, string> {
    const t = progressFor(index);
    const tilt = (1 - t) * 50;
    const lift = (1 - t) * 48;
    const depth = (1 - t) * -120;
    const scale = 0.88 + t * 0.12;
    return {
      transform: `perspective(1200px) translateY(${lift}px) translateZ(${depth}px) rotateX(${tilt}deg) scale(${scale})`,
      opacity: `${0.15 + t * 0.85}`,
    };
  }

  return { revealProgress, progressFor, styleFor };
}
