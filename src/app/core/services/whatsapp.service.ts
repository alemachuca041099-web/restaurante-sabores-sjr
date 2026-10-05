import { Injectable, computed, inject } from '@angular/core';
import { RestaurantService } from './restaurant.service';

@Injectable({ providedIn: 'root' })
export class WhatsappService {
  private readonly restaurantService = inject(RestaurantService);

  private readonly number = computed(() => this.restaurantService.restaurant()?.whatsapp ?? '');

  private readonly defaultMessage = computed(
    () => this.restaurantService.restaurant()?.whatsappDefaultMessage ?? '',
  );

  /** True once the phone number has been loaded from restaurant.json. */
  readonly ready = computed(() => this.number().length > 0);

  /** Generic contact link (used by floating button, footer, location). */
  readonly defaultUrl = computed(() => this.buildUrl(this.defaultMessage()));

  buildUrl(message?: string): string {
    const number = this.number();
    if (!number) return '';
    const base = `https://wa.me/${number}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  dishInquiryUrl(dishName: string): string {
    const name = this.restaurantService.name();
    return this.buildUrl(`Hola, me gustaría información sobre el platillo ${dishName} de ${name}.`);
  }

  promotionInquiryUrl(promoTitle: string): string {
    const name = this.restaurantService.name();
    return this.buildUrl(`Hola, me gustaría información sobre la promoción "${promoTitle}" de ${name}.`);
  }

  comidaCorridaInquiryUrl(): string {
    const name = this.restaurantService.name();
    return this.buildUrl(`Hola, me gustaría saber el guiso de la comida corrida de hoy en ${name}.`);
  }
}
