import { DOCUMENT } from '@angular/common';
import { Component, HostListener, inject, signal } from '@angular/core';
import { SectionTransitionService } from '../../../core/services';
import { Icon } from '../icon/icon';

/** Floating "back to top" button, shown once the user has scrolled past the hero. */
@Component({
  selector: 'app-scroll-top',
  imports: [Icon],
  templateUrl: './scroll-top.html',
  styleUrl: './scroll-top.scss',
  host: { '[class.is-visible]': 'visible()' },
})
export class ScrollTop {
  private readonly document = inject(DOCUMENT);
  private readonly transition = inject(SectionTransitionService);
  protected readonly visible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    const y = this.document.defaultView?.scrollY ?? 0;
    this.visible.set(y > (this.document.defaultView?.innerHeight ?? 800) * 0.6);
  }

  scrollUp(): void {
    this.transition.run(() => {
      this.document.defaultView?.scrollTo({ top: 0, behavior: 'auto' });
    });
  }
}
