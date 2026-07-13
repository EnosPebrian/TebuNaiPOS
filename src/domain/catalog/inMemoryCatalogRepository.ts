import { categories } from "./category";
import { packages } from "./package";
import { presets } from "./preset";
import { products } from "./product";
import { toppings } from "./topping";
import { CatalogRepository } from "./catalog.repository";

class InMemoryCatalogRepository implements CatalogRepository {
  getCategories() {
    return categories.filter((c) => c.enabled);
  }

  getCategory(id: string) {
    return categories.find((c) => c.id === id && c.enabled);
  }

  getProducts() {
    return products.filter((p) => p.enabled);
  }

  getProduct(id: string) {
    return products.find((p) => p.id === id && p.enabled);
  }

  getPackages() {
    return packages.filter((p) => p.enabled);
  }

  getPackage(id: string) {
    return packages.find((p) => p.id === id && p.enabled);
  }

  getToppings() {
    return toppings.filter((t) => t.enabled);
  }

  getTopping(id: string) {
    return toppings.find((t) => t.id === id && t.enabled);
  }

  getPresets() {
    return presets.filter((p) => p.enabled);
  }

  getPreset(id: string) {
    return presets.find((p) => p.id === id && p.enabled);
  }
}

export const catalogRepository = new InMemoryCatalogRepository();
