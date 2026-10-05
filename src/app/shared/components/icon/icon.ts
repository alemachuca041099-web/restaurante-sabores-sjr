import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export type IconName =
  | 'menu-card'
  | 'whatsapp'
  | 'map-pin'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-up'
  | 'check'
  | 'receipt';

interface IconDef {
  viewBox: string;
  fill: string;
  markup: string;
}

/** Static, hand-authored icon set — no external icon library needed. */
const ICONS: Record<IconName, IconDef> = {
  'menu-card': {
    viewBox: '0 0 24 24',
    fill: 'none',
    markup:
      '<path d="M12 5v15M4 6.8c2.4-1.2 5.5-1.2 8 .7 2.5-1.9 5.6-1.9 8-.7v11.6c-2.4-1.2-5.5-1.2-8 .7-2.5-1.9-5.6-1.9-8-.7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  whatsapp: {
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    markup:
      '<path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.1-1.3c1.5.8 3.1 1.2 4.9 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3C4.2 15 3.8 13.5 3.8 12c0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.7 8.2-8.2 8.2z"/>',
  },
  'map-pin': {
    viewBox: '0 0 24 24',
    fill: 'none',
    markup:
      '<path d="M12 21s7-6.6 7-11.5A7 7 0 1 0 5 9.5C5 14.4 12 21 12 21z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.4" stroke="currentColor" stroke-width="1.5"/>',
  },
  'chevron-left': {
    viewBox: '0 0 24 24',
    fill: 'none',
    markup: '<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  'chevron-right': {
    viewBox: '0 0 24 24',
    fill: 'none',
    markup: '<path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  'arrow-up': {
    viewBox: '0 0 24 24',
    fill: 'none',
    markup: '<path d="M12 19V6M5.5 12.5L12 6l6.5 6.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  check: {
    viewBox: '0 0 24 24',
    fill: 'none',
    markup: '<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  receipt: {
    viewBox: '0 0 24 24',
    fill: 'none',
    markup:
      '<path d="M6 3.5h12v17l-2.2-1.4-2 1.4-1.8-1.4-1.8 1.4-2-1.4L6 20.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  },
};

@Component({
  selector: 'app-icon',
  template: `<svg [attr.viewBox]="def().viewBox" [attr.fill]="def().fill" [innerHTML]="safeMarkup()"></svg>`,
  styleUrl: './icon.scss',
  host: {
    class: 'icon',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    'aria-hidden': 'true',
  },
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input<number>(18);

  private readonly sanitizer = inject(DomSanitizer);
  protected readonly def = computed(() => ICONS[this.name()]);
  protected readonly safeMarkup = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.def().markup));
}
