import { Component, computed, input, output } from '@angular/core';

/**
 * Position indicator for a horizontally-scrolling rail of cards — the
 * mobile-only counterpart to the arrow buttons (which only show ≥640px).
 * Without this, swiping through a mobile carousel gives no sense of how
 * many cards there are or where you are among them.
 */
@Component({
  selector: 'app-rail-dots',
  template: `
    <div class="rail-dots" role="tablist" aria-label="Posición en el carrusel">
      @for (i of dots(); track i) {
        <button
          type="button"
          role="tab"
          class="rail-dots__dot"
          [class.is-active]="i === active()"
          [attr.aria-selected]="i === active()"
          [attr.aria-label]="'Ir a la tarjeta ' + (i + 1) + ' de ' + count()"
          (click)="select.emit(i)"
        ></button>
      }
    </div>
  `,
  styleUrl: './rail-dots.scss',
})
export class RailDots {
  readonly count = input.required<number>();
  readonly active = input<number>(0);
  readonly select = output<number>();

  protected readonly dots = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
