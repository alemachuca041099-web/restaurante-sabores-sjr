import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page/home-page').then((m) => m.HomePage),
    title: 'SABORES | Restaurante en San Juan del Río',
  },
  {
    path: 'menu',
    loadComponent: () => import('./features/menu/menu-page/menu-page').then((m) => m.MenuPage),
    title: 'Menú | SABORES',
  },
  { path: '**', redirectTo: '' },
];
