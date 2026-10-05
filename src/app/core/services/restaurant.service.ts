import { Injectable, computed } from '@angular/core';
import { Restaurant } from '../models';
import { loadJsonSignal } from './data-loader';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  /** Raw data (null until loaded). */
  readonly restaurant = loadJsonSignal<Restaurant | null>('restaurant.json', null);

  readonly name = computed(() => this.restaurant()?.name ?? 'SABORES');
  readonly tagline = computed(() => this.restaurant()?.tagline ?? '');
  readonly heroDescriptor = computed(() => this.restaurant()?.heroDescriptor ?? this.tagline());
  readonly cuisineTags = computed(() => this.restaurant()?.cuisineTags ?? []);
  readonly address = computed(() => this.restaurant()?.address ?? null);
  readonly hours = computed(() => this.restaurant()?.hours ?? []);
  readonly story = computed(() => this.restaurant()?.story ?? null);
  readonly seo = computed(() => this.restaurant()?.seo ?? null);
  readonly invoicingUrl = computed(() => this.restaurant()?.invoicing?.url ?? '');
  readonly invoicingNote = computed(() => this.restaurant()?.invoicing?.note ?? '');

  readonly fullAddress = computed(() => {
    const a = this.address();
    if (!a) return '';
    return `${a.street}, ${a.neighborhood}, ${a.city}, ${a.state}`;
  });

  readonly phoneHref = computed(() => {
    const phone = this.restaurant()?.phone;
    return phone ? `tel:+52${phone}` : '';
  });

  readonly mapsUrl = computed(() => {
    const a = this.address();
    if (!a) return '';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.mapsQuery)}`;
  });

  readonly mapsEmbedUrl = computed(() => {
    const a = this.address();
    if (!a) return '';
    return `https://www.google.com/maps?q=${encodeURIComponent(a.mapsQuery)}&output=embed`;
  });
}
