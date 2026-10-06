import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, computed, effect, inject, signal } from '@angular/core';
import { ComidaCorridaService, PromotionService, TestimonialService } from '../../../core/services';

interface SectionNavItem {
  id: string;
  label: string;
}

/**
 * Fixed side index for the home — an alternative to scrolling through all
 * sections. Lists only sections that actually render: three of them
 * (promotions, comida corrida, testimonials) depend on async data that may
 * be empty, so this mirrors each one's own `@if` condition instead of
 * reading the DOM (which would race the data load). The "current section"
 * highlight comes from an IntersectionObserver centered on the viewport —
 * not scroll-position math — to avoid the kind of drift that broke the
 * menu scrollspy earlier.
 */
@Component({
  selector: 'app-section-nav',
  templateUrl: './section-nav.html',
  styleUrl: './section-nav.scss',
})
export class SectionNav {
  private readonly promotions = inject(PromotionService);
  private readonly comidaCorrida = inject(ComidaCorridaService);
  private readonly testimonials = inject(TestimonialService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly items = computed<SectionNavItem[]>(() => {
    const list: SectionNavItem[] = [{ id: 'inicio', label: 'Inicio' }];
    if (this.promotions.hasPromotions()) list.push({ id: 'promociones', label: 'Promociones' });
    if (this.comidaCorrida.value()) list.push({ id: 'comida-corrida', label: 'Comida corrida' });
    list.push({ id: 'especialidades', label: 'Favoritos' });
    list.push({ id: 'historia', label: 'Historia' });
    list.push({ id: 'galeria', label: 'Galería' });
    if (this.testimonials.hasItems()) list.push({ id: 'resenas', label: 'Reseñas' });
    list.push({ id: 'ubicacion', label: 'Ubicación' });
    return list;
  });

  protected readonly activeId = signal('inicio');

  private observer?: IntersectionObserver;

  constructor() {
    effect(() => {
      const ids = this.items().map((item) => item.id);
      // Deferred a tick so the sibling section elements (gated on the same
      // signals this computed reads) have finished rendering into the DOM.
      setTimeout(() => this.observeSections(ids), 0);
    });

    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  protected selectNow(id: string): void {
    this.activeId.set(id);
  }

  private observeSections(ids: string[]): void {
    this.observer?.disconnect();
    if (typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.activeId.set(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    for (const id of ids) {
      const el = this.document.getElementById(id);
      if (el) this.observer.observe(el);
    }
  }
}
