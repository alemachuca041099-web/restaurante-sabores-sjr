import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RestaurantService } from './restaurant.service';

/**
 * Keeps <title>, meta description and Open Graph tags in sync with restaurant.json.
 * index.html ships static defaults so crawlers/WhatsApp previews work before JS runs.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly restaurantService = inject(RestaurantService);

  constructor() {
    effect(() => {
      const seo = this.restaurantService.seo();
      if (!seo) return;
      const origin = this.document.location?.origin ?? '';
      const url = seo.url || origin;
      const image = seo.image.startsWith('http') ? seo.image : `${origin}/${seo.image}`;

      this.title.setTitle(seo.title);
      this.meta.updateTag({ name: 'description', content: seo.description });
      this.meta.updateTag({ property: 'og:title', content: seo.title });
      this.meta.updateTag({ property: 'og:description', content: seo.description });
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ name: 'twitter:title', content: seo.title });
      this.meta.updateTag({ name: 'twitter:description', content: seo.description });
      this.meta.updateTag({ name: 'twitter:image', content: image });
    });
  }
}
