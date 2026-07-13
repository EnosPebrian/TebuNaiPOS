import { Category } from "./category";
import { Ingredient } from "./ingredient";
import { MenuItem } from "./menu-item";
import { ProductPackage } from "./package";

export interface CatalogRepository {
  getCategories(): Category[];

  getIngredients(): Ingredient[];

  getPackages(): ProductPackage[];

  getMenuItems(): MenuItem[];
}
