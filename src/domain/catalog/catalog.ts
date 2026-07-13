import { catalogRepository } from "./inMemoryCatalogRepository";

export const catalog = {
  getCategories() {
    return catalogRepository.getCategories();
  },

  getCategory(id: string) {
    return catalogRepository.getCategory(id);
  },

  getProducts() {
    return catalogRepository.getProducts();
  },

  getProduct(id: string) {
    return catalogRepository.getProduct(id);
  },

  getPackages() {
    return catalogRepository.getPackages();
  },

  getPackage(id: string) {
    return catalogRepository.getPackage(id);
  },

  getToppings() {
    return catalogRepository.getToppings();
  },

  getTopping(id: string) {
    return catalogRepository.getTopping(id);
  },

  getPresets() {
    return catalogRepository.getPresets();
  },

  getPreset(id: string) {
    return catalogRepository.getPreset(id);
  },
};
