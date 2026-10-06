import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './core/services';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { ScrollTop } from './shared/components/scroll-top/scroll-top';
import { PageLoader } from './shared/components/page-loader/page-loader';
import { Curtain } from './shared/components/curtain/curtain';
import { DishDetail } from './features/menu/dish-detail/dish-detail';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, ScrollTop, PageLoader, Curtain, DishDetail],
  templateUrl: './app.html',
})
export class App {
  // Instantiated so SEO tags follow restaurant.json.
  private readonly seo = inject(SeoService);
}
