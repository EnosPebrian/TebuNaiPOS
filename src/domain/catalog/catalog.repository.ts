import { Category } from "./category";
import { Package } from "./package";
import { Preset } from "./preset";
import { Product } from "./product";
import { Topping } from "./topping";

export interface CatalogRepository {
  getCategories(): Category[];

  getCategory(id: string): Category | undefined;

  getProducts(): Product[];

  getProduct(id: string): Product | undefined;

  getPackages(): Package[];

  getPackage(id: string): Package | undefined;

  getToppings(): Topping[];

  getTopping(id: string): Topping | undefined;

  getPresets(): Preset[];

  getPreset(id: string): Preset | undefined;
}
