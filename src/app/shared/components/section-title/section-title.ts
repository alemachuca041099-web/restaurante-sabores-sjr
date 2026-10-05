import { Component, input } from '@angular/core';
import { RevealDirective } from '../../../core/directives/reveal.directive';

/**
 * Editorial section heading: eyebrow + big serif title + optional lead.
 * Use `<em>` inside the title input? No: pass `accent` to italicize a word in gold.
 */
@Component({
  selector: 'app-section-title',
  imports: [RevealDirective],
  templateUrl: './section-title.html',
  styleUrl: './section-title.scss',
  host: { '[class.is-center]': 'align() === "center"' },
})
export class SectionTitle {
  readonly eyebrow = input<string>('');
  readonly title = input.required<string>();
  /** Word or phrase from `title` to render in italic gold. */
  readonly accent = input<string>('');
  readonly lead = input<string>('');
  readonly align = input<'start' | 'center'>('start');
  readonly level = input<'h1' | 'h2'>('h2');

  protected parts(): { text: string; accent: boolean }[] {
    const title = this.title();
    const accent = this.accent();
    if (!accent || !title.includes(accent)) return [{ text: title, accent: false }];
    const [before, after] = title.split(accent);
    return [
      { text: before, accent: false },
      { text: accent, accent: true },
      { text: after, accent: false },
    ].filter((p) => p.text.length > 0);
  }
}
