import { DOCUMENT } from '@angular/common';
import { Component, HostListener, effect, inject, output, signal } from '@angular/core';
import { RestaurantService } from '../../../core/services';

/**
 * Full-screen splash shown while the app boots. Stays up for a minimum time
 * (so it never just flashes) and waits for the brand font to be ready, then
 * fades out once. Respects prefers-reduced-motion by skipping straight out.
 */
@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.html',
  styleUrl: './page-loader.scss',
  host: { '[class.is-leaving]': 'leaving()', '[class.is-done]': 'done()' },
})
export class PageLoader {
  protected readonly restaurant = inject(RestaurantService);
  private readonly document = inject(DOCUMENT);

  protected readonly leaving = signal(false);
  protected readonly done = signal(false);
  readonly finished = output<void>();

  private readonly reduceMotion =
    this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;

  private readonly minVisible = this.reduceMotion ? 0 : 900;
  private readonly startedAt = Date.now();

  constructor() {
    effect(() => {
      this.document.body.classList.toggle('no-scroll', !this.done());
    });

    const fontsReady = this.document.fonts?.ready ?? Promise.resolve();
    void fontsReady.then(() => this.scheduleLeave());
    // Safety net in case fonts.ready never resolves (older engines).
    setTimeout(() => this.scheduleLeave(), 2500);
  }

  private scheduleLeave(): void {
    if (this.leaving() || this.done()) return;
    const elapsed = Date.now() - this.startedAt;
    const wait = Math.max(0, this.minVisible - elapsed);
    setTimeout(() => this.leave(), wait);
  }

  private leave(): void {
    if (this.leaving()) return;
    this.leaving.set(true);
    const transitionMs = this.reduceMotion ? 0 : 700;
    setTimeout(() => {
      this.done.set(true);
      this.finished.emit();
    }, transitionMs);
  }

  @HostListener('window:load')
  onWindowLoad(): void {
    this.scheduleLeave();
  }
}
