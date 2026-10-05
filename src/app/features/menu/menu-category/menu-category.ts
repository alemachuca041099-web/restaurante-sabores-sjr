import { Component, input, output } from '@angular/core';
import { Category, Dish } from '../../../core/models';
import { DishCard } from '../../../shared/components/dish-card/dish-card';

/** One category block of the menu: heading + list of dish rows. */
@Component({
  selector: 'app-menu-category',
  imports: [DishCard],
  templateUrl: './menu-category.html',
  styleUrl: './menu-category.scss',
})
export class MenuCategory {
  readonly category = input.required<Category>();
  readonly items = input.required<Dish[]>();
  readonly showHeading = input<boolean>(true);
  readonly select = output<Dish>();
}
