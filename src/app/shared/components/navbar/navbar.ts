import { DOCUMENT } from '@angular/common';
import { Component, HostListener, computed, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { RestaurantService, SectionTransitionService } from '../../../core/services';
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
  imports: [Icon],
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
  private readonly transition = inject(SectionTransitionService);
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

  /** Plain href (not [routerLink]) — these links are intercepted in
   *  onLinkClick to run behind the curtain instead, and a routerLink
   *  directive on the same element would fire its own navigation too. */
  hrefFor(link: NavLink): string {
    const base = link.path ? '/' + link.path : '/';
    return link.fragment ? `${base}#${link.fragment}` : base;
  }

  /** Every nav link — same-page section jump or a different route — runs
   *  behind the curtain instead of a visible scroll or a blank-flash page
   *  swap. Middle-click/ctrl/cmd-click etc. fall through to the native
   *  link so "open in new tab" still works. */
  onLinkClick(event: MouseEvent, link: NavLink): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.close();
    const commands = link.path ? ['/' + link.path] : ['/'];
    this.transition.run(() => this.router.navigate(commands, link.fragment ? { fragment: link.fragment } : {}));
  }

  onBrandClick(event: MouseEvent): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.close();
    this.transition.run(() => this.router.navigate(['/']));
  }

  onMenuCtaClick(event: MouseEvent): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.close();
    this.transition.run(() => this.router.navigate(['/menu']));
  }
}
