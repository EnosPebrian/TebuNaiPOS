import { categories } from "./category";
import { foods } from "./food";
import { packages } from "./package";
import { presets } from "./preset";
import { products } from "./product";
import { toppings } from "./topping";
import { CatalogRepository } from "./catalog.repository";

// The existing food seed remains its source; every sellable item is exposed
// through the same Product repository and ConfiguredProduct commerce flow.
function catalogProducts() {
  return [
    ...products,
    ...foods.map((food) => ({
      id: food.id,
      slug: food.slug,
      name: food.name,
      description: food.description,
      image: food.image,
      categoryId: food.categoryId,
      packageIds: [],
      toppingIds: [],
      presetIds: [],
      enabled: food.enabled && food.categoryId !== "alcoholic-beverage",
      price: food.price,
      volume: food.volume,
    })),
  ];
}

class InMemoryCatalogRepository implements CatalogRepository {
  getCategories() {
    return categories.filter((c) => c.enabled);
  }

  getCategory(id: string) {
    return categories.find((c) => c.id === id && c.enabled);
  }

  getProducts() {
    return catalogProducts().filter((p) => p.enabled);
  }

  getProduct(id: string) {
    return catalogProducts().find((p) => p.id === id && p.enabled);
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
