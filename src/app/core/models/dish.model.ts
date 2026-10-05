import { Category } from './category.model';

export type DishTag = 'casa' | 'picante' | 'vegetariano' | 'nuevo';

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  featured: boolean;
  available: boolean;
  tags?: DishTag[];
  /** Optional extra note shown in the detail modal (portion, allergens, etc.). */
  note?: string;
}

export interface MenuData {
  categories: Category[];
  items: Dish[];
}

export const DISH_TAG_LABELS: Record<DishTag, string> = {
  casa: 'Especialidad de la casa',
  picante: 'Picante',
  vegetariano: 'Vegetariano',
  nuevo: 'Nuevo',
};
