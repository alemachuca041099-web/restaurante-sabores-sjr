import { DestroyRef, inject, signal } from '@angular/core';

export interface SlideCarouselOptions {
  /** Number of slides — read live, so it can react to async data. */
  length: () => number;
  autoplay?: boolean;
  intervalMs?: number;
}

/**
 * Shared "one slide at a time" behavior for the promotions, discover and
 * featured-dishes mobile carousels: active index, optional autoplay that
 * only runs while the section is actually on screen, and swipe-to-advance.
 * Each caller keeps its own template/styles — this only owns the state.
 */
export function createSlideCarousel(opts: SlideCarouselOptions) {
  const destroyRef = inject(DestroyRef);
  const intervalMs = opts.intervalMs ?? 6000;
  const reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const index = signal(0);
  const playing = signal(opts.autoplay ?? false);
  const seen = signal(false);

  let timer: ReturnType<typeof setInterval> | undefined;
  let io: IntersectionObserver | undefined;
  let visible = false;
  let dragStartX = 0;
  let dragging = false;

  function arm(): void {
    clearInterval(timer);
    const total = opts.length();
    if (reduceMotion || !playing() || !visible || total < 2) return;
    timer = setInterval(() => {
      index.update((i) => (i + 1) % opts.length());
    }, intervalMs);
  }

  function observe(host: HTMLElement): void {
    if (typeof IntersectionObserver === 'undefined') {
      visible = true;
      seen.set(true);
      arm();
      return;
    }
    io = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting);
        if (isVisible === visible) return;
        visible = isVisible;
        if (isVisible) seen.set(true);
        arm();
      },
      { threshold: 0.3 },
    );
    io.observe(host);
    destroyRef.onDestroy(() => {
      clearInterval(timer);
      io?.disconnect();
    });
  }

  function go(direction: 1 | -1): void {
    const total = opts.length();
    index.update((i) => (i + direction + total) % total);
    arm();
  }

  function to(i: number): void {
    index.set(i);
    arm();
  }

  function toggle(): void {
    playing.update((v) => !v);
    arm();
  }

  function pause(): void {
    playing.set(false);
    arm();
  }

  function resume(): void {
    if (reduceMotion || !(opts.autoplay ?? false)) return;
    playing.set(true);
    arm();
  }

  function onPointerDown(event: PointerEvent): void {
    dragStartX = event.clientX;
    dragging = true;
  }

  function onPointerUp(event: PointerEvent): void {
    if (!dragging) return;
    dragging = false;
    const dx = event.clientX - dragStartX;
    if (Math.abs(dx) > 44) go(dx < 0 ? 1 : -1);
  }

  return { index, playing, seen, observe, go, to, toggle, pause, resume, onPointerDown, onPointerUp };
}
