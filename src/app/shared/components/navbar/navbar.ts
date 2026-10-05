import { DOCUMENT } from '@angular/common';
import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { RestaurantService } from '../../../core/services';
import { Icon } from '../icon/icon';

interface NavLink {
  label: string;
  /** Route path ('' for home). */
  path: string;
  /** Optional fragment (section id) on the home page. */
  fragment?: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', path: '' },
  { label: 'Menú', path: 'menu' },
  { label: 'Especialidades', path: '', fragment: 'especialidades' },
  { label: 'Promociones', path: '', fragment: 'promociones' },
  { label: 'Galería', path: '', fragment: 'galeria' },
  { label: 'Ubicación', path: '', fragment: 'ubicacion' },
];

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Icon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  host: {
    '[class.is-scrolled]': 'scrolled()',
    '[class.is-open]': 'open()',
    '[class.is-solid]': 'solid()',
  },
})
export class Navbar {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  protected readonly restaurant = inject(RestaurantService);

  protected readonly links = NAV_LINKS;
  protected readonly scrolled = signal(false);
  protected readonly open = signal(false);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Pages without a dark hero get a solid bar from the start. */
  protected readonly solid = computed(() => this.url().startsWith('/menu'));

  protected readonly currentFragment = computed(() => this.url().split('#')[1] ?? '');

  constructor() {
    effect(() => {
      this.document.body.classList.toggle('no-scroll', this.open());
    });
    this.onScroll();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set((this.document.defaultView?.scrollY ?? 0) > 24);
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.open.set(false);
  }

  @HostListener('window:resize')
  onResize(): void {
    if ((this.document.defaultView?.innerWidth ?? 0) >= 960) this.open.set(false);
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  close(): void {
    this.open.set(false);
  }

  isActive(link: NavLink): boolean {
    const [path, fragment] = this.url().replace(/^\//, '').split('#');
    if (link.path === 'menu') return path.startsWith('menu');
    if (link.fragment) return path === '' && fragment === link.fragment;
    return path === '' && !fragment;
  }
}
