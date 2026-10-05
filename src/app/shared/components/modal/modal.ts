import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

/**
 * Accessible drawer/modal shell. Slides up from the bottom on mobile and
 * in from the right on desktop. Content is projected.
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  host: { '[class.is-open]': 'open()' },
})
export class Modal {
  readonly open = input.required<boolean>();
  readonly label = input<string>('Detalle');
  readonly closed = output<void>();

  private readonly document = inject(DOCUMENT);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    effect(() => {
      const isOpen = this.open();
      this.document.body.classList.toggle('no-scroll', isOpen);
      if (isOpen) {
        // Move focus into the dialog after it renders.
        setTimeout(() => this.panel()?.nativeElement.focus(), 50);
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.closed.emit();
  }

  close(): void {
    this.closed.emit();
  }
}
