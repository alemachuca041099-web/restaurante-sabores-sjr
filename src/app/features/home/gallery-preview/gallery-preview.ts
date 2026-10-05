import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { ImgFallbackDirective } from '../../../core/directives/img-fallback.directive';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { GalleryItem } from '../../../core/models';
import { GalleryService } from '../../../core/services';
import { Modal } from '../../../shared/components/modal/modal';
import { SectionTitle } from '../../../shared/components/section-title/section-title';

@Component({
  selector: 'app-gallery-preview',
  imports: [RevealDirective, ImgFallbackDirective, SectionTitle, Modal],
  templateUrl: './gallery-preview.html',
  styleUrl: './gallery-preview.scss',
})
export class GalleryPreview {
  protected readonly gallery = inject(GalleryService);

  /** Index of the item open in the lightbox, or null. */
  protected readonly activeIndex = signal<number | null>(null);

  protected readonly active = computed<GalleryItem | null>(() => {
    const i = this.activeIndex();
    return i === null ? null : (this.gallery.items()[i] ?? null);
  });

  protected readonly hasMany = computed(() => this.gallery.items().length > 1);

  protected open(i: number): void {
    this.activeIndex.set(i);
  }

  protected close(): void {
    this.activeIndex.set(null);
  }

  protected step(delta: number): void {
    const items = this.gallery.items();
    const i = this.activeIndex();
    if (i === null || !items.length) return;
    this.activeIndex.set((i + delta + items.length) % items.length);
  }

  @HostListener('document:keydown.arrowright')
  next(): void {
    if (this.activeIndex() !== null) this.step(1);
  }

  @HostListener('document:keydown.arrowleft')
  prev(): void {
    if (this.activeIndex() !== null) this.step(-1);
  }
}
