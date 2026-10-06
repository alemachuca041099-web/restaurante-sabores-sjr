import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

/**
 * Drives the curtain wipe used for in-page section jumps (navbar links,
 * "back to top") instead of letting the user watch a smooth scroll fly
 * past every section in between. The curtain covers the screen, the actual
 * scroll happens instantly while hidden, then it parts to reveal the
 * destination already in place.
 */
@Injectable({ providedIn: 'root' })
export class SectionTransitionService {
  private readonly document = inject(DOCUMENT);
  readonly covering = signal(false);

  private readonly reduceMotion =
    this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;

  /** Panel slide-in duration — must match .curtain__panel's transition in curtain.scss. */
  private readonly closeMs = 420;
  /** Extra beat fully covered, so a Router-driven anchor scroll has time to settle. */
  private readonly holdMs = 120;
  private readonly openMs = 420;
  private busy = false;

  /** Runs `jump` (the actual scroll/navigation) hidden behind the curtain. */
  run(jump: () => void): void {
    if (this.reduceMotion || this.busy) {
      jump();
      return;
    }
    this.busy = true;
    const html = this.document.documentElement;
    html.classList.add('is-jumping');
    this.covering.set(true);

    setTimeout(() => {
      jump();
      setTimeout(() => {
        this.covering.set(false);
        setTimeout(() => {
          html.classList.remove('is-jumping');
          this.busy = false;
        }, this.openMs);
      }, this.holdMs);
    }, this.closeMs);
  }
}
