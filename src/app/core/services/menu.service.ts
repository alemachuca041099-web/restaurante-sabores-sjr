import { Injectable, computed, signal } from '@angular/core';
import { Category, Dish, MenuData } from '../models';
import { loadJsonSignal } from './data-loader';

const EMPTY_MENU: MenuData = { categories: [], items: [] };

@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly data = loadJsonSignal<MenuData>('menu.json', EMPTY_MENU);

  readonly loaded = computed(() => this.data() !== null);

  readonly categories = computed<Category[]>(() =>
    [...(this.data()?.categories ?? [])].sort((a, b) => a.order - b.order),
  );

  readonly items = computed<Dish[]>(() => this.data()?.items ?? []);

  readonly featured = computed<Dish[]>(() => this.items().filter((d) => d.featured));

  /** Dish currently open in the detail modal. */
  readonly selectedDish = signal<Dish | null>(null);

  itemsByCategory(categoryId: string): Dish[] {
    return this.items().filter((d) => d.categoryId === categoryId);
  }

  countByCategory(categoryId: string): number {
    return this.itemsByCategory(categoryId).length;
  }

  categoryById(id: string): Category | undefined {
    return this.categories().find((c) => c.id === id);
  }

  categoryName(id: string): string {
    return this.categoryById(id)?.name ?? '';
  }

  dishById(id: string): Dish | undefined {
    return this.items().find((d) => d.id === id);
  }

  openDish(dish: Dish): void {
    this.selectedDish.set(dish);
  }

  closeDish(): void {
    this.selectedDish.set(null);
  }
}
