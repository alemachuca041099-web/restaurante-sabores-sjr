import { Location } from '@angular/common';
import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { RevealDirective } from '../../../core/directives/reveal.directive';
import { ScrollFadeDirective } from '../../../core/directives/scroll-fade.directive';
import { Category, Dish } from '../../../core/models';
import { MenuService, RestaurantService } from '../../../core/services';
import { ComidaCorrida } from '../../home/comida-corrida/comida-corrida';
import { SectionTitle } from '../../../shared/components/section-title/section-title';
import { MenuCategory } from '../menu-category/menu-category';

const ALL = 'todos';

@Component({
  selector: 'app-menu-page',
  imports: [RevealDirective, ScrollFadeDirective, SectionTitle, MenuCategory, ComidaCorrida],
  templateUrl: './menu-page.html',
  styleUrl: './menu-page.scss',
})
export class MenuPage {
  protected readonly menu = inject(MenuService);
  protected readonly restaurant = inject(RestaurantService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly tabsList = viewChild<ElementRef<HTMLElement>>('tabsList');
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly ALL = ALL;

  private readonly fragment = toSignal(this.route.fragment, { initialValue: null });

  /** Active category id or 'todos'. */
  protected readonly activeId = signal<string>(ALL);
  protected readonly query = signal('');
  protected readonly onlyAvailable = signal(false);

  /** Mobile only — the search/availability row starts collapsed so the
   * sticky bar doesn't eat a third of a small screen by default. */
  protected readonly searchOpen = signal(false);

  /** Changes every time the filters change; used to replay the enter animation. */
  protected readonly animationKey = computed(() => `${this.activeId()}|${this.query()}|${this.onlyAvailable()}`);

  protected readonly categories = computed<Category[]>(() => this.menu.categories());

  protected readonly filteredItems = computed<Dish[]>(() => {
    const q = this.query().trim().toLowerCase();
    const only = this.onlyAvailable();
    return this.menu.items().filter((d) => {
      if (only && !d.available) return false;
      if (!q) return true;
      return `${d.name} ${d.description}`.toLowerCase().includes(q);
    });
  });

  /** Categories to render (with their filtered items). */
  protected readonly sections = computed<{ category: Category; items: Dish[] }[]>(() => {
    const active = this.activeId();
    const items = this.filteredItems();
    return this.categories()
      .filter((c) => active === ALL || c.id === active)
      .map((c) => ({ category: c, items: items.filter((d) => d.categoryId === c.id) }))
      .filter((s) => s.items.length > 0 || active !== ALL);
  });

  protected readonly resultCount = computed(() => this.sections().reduce((n, s) => n + s.items.length, 0));

  constructor() {
    // Sync the active tab with the URL fragment (/menu#pescados-mariscos).
    effect(() => {
      const f = this.fragment();
      const valid = f && this.categories().some((c) => c.id === f);
      this.activeId.set(valid ? f : ALL);
    });

    // Keep the active pill in view — landing on /menu#bebidas shouldn't leave
    // the selected tab scrolled off the edge of the mobile filter bar.
    effect(() => {
      const id = this.activeId();
      queueMicrotask(() => this.scrollTabIntoView(id));
    });
  }

  protected select(id: string): void {
    this.activeId.set(id);
    // Location.replaceState, not router.navigate — this app enables
    // anchorScrolling app-wide (so a link like /#promociones jumps to that
    // section), but a tab click here already does its job by filtering; it
    // should never also jump the page to the matching #id further down.
    // Going through the Router with a fragment would trigger exactly that.
    const path = this.router.createUrlTree([], { relativeTo: this.route }).toString();
    this.location.replaceState(id === ALL ? path : `${path}#${id}`);
  }

  // Scrolls only the tabs' own horizontal scrollbar (list.scrollLeft) — never
  // window/document scroll. btn.scrollIntoView() looked like the obvious way
  // to do this, but it also nudges the page vertically (the global
  // scroll-padding-top makes the browser think a tab tucked near the sticky
  // bar isn't "visible enough" and corrects for it), which is the small
  // unwanted scroll this replaces.
  private scrollTabIntoView(id: string): void {
    const list = this.tabsList()?.nativeElement;
    const btn = list?.querySelector<HTMLElement>(`[data-cat="${id}"]`);
    if (!list || !btn) return;
    const target = btn.offsetLeft - (list.clientWidth - btn.clientWidth) / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected toggleAvailable(): void {
    this.onlyAvailable.update((v) => !v);
  }

  protected toggleSearch(): void {
    this.searchOpen.update((v) => !v);
    if (this.searchOpen()) {
      // preventScroll: true — the input sits inside a sticky bar, so its
      // natural (non-stuck) position in the document is much further down;
      // without this, a plain .focus() yanks the page down to that spot.
      queueMicrotask(() => this.searchInput()?.nativeElement.focus({ preventScroll: true }));
    }
  }

  protected open(dish: Dish): void {
    this.menu.openDish(dish);
  }
}
