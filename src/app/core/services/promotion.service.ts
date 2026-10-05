import { Injectable, computed } from '@angular/core';
import { Promotion, PromotionsData } from '../models';
import { loadJsonSignal } from './data-loader';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private readonly data = loadJsonSignal<PromotionsData>('promotions.json', { promotions: [] });

  /** Promotions that are active and inside their date range (if any). */
  readonly active = computed<Promotion[]>(() => {
    const today = startOfToday();
    return (this.data()?.promotions ?? []).filter((p) => p.active && isWithinRange(p, today));
  });

  readonly hasPromotions = computed(() => this.active().length > 0);
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function parseIsoDate(value: string | undefined): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function isWithinRange(promo: Promotion, today: Date): boolean {
  const start = parseIsoDate(promo.startDate);
  const end = parseIsoDate(promo.endDate);
  if (start && today < start) return false;
  if (end && today > end) return false;
  return true;
}
