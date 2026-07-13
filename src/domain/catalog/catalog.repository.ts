import { Category } from "./category";
import { Ingredient } from "./ingredient";
import { MenuItem } from "./menu-item";
import { Package } from "./package";

export interface CatalogRepository {
  getCategories(): Category[];

  getIngredients(): Ingredient[];

  getPackages(): Package[];

  getMenuItems(): MenuItem[];
}
