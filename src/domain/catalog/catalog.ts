import { categories } from "./category";
import { ingredients } from "./ingredient";
import { menuItems } from "./menu-item";
import { packages } from "./package";

export const catalog = {
  getCategories() {
    return categories;
  },

  getCategory(id: string) {
    return categories.find((c) => c.id === id);
  },

  getIngredients() {
    return ingredients;
  },

  getIngredient(id: string) {
    return ingredients.find((i) => i.id === id);
  },

  getPackages() {
    return packages;
  },

  getPackage(id: string) {
    return packages.find((p) => p.id === id);
  },

  getMenuItems() {
    return menuItems;
  },

  getMenuItem(id: string) {
    return menuItems.find((m) => m.id === id);
  },
};
