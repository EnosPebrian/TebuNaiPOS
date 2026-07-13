import { MenuItem } from "./menu-item";

export const menuItems: MenuItem[] = [
  {
    id: "original",

    categoryId: "classic",

    name: "Original",

    description: "Pure fresh sugarcane juice.",

    image: "/products/original.png",

    accentColor: "#6BAA75",

    defaultIngredientIds: ["sugarcane"],

    availablePackageIds: ["bottle-250", "bottle-500", "bottle-1500"],

    featured: true,
  },

  {
    id: "lemon",

    categoryId: "fruit",

    name: "Lemon",

    description: "Fresh sugarcane with lemon.",

    image: "/products/lemon.png",

    accentColor: "#FFD54F",

    defaultIngredientIds: ["sugarcane", "lemon"],

    availablePackageIds: ["bottle-250", "bottle-500", "bottle-1500"],

    featured: true,
  },

  {
    id: "pineapple",

    categoryId: "fruit",

    name: "Pineapple",

    description: "Fresh pineapple infusion.",

    image: "/products/pineapple.png",

    accentColor: "#F4B400",

    defaultIngredientIds: ["sugarcane", "pineapple"],

    availablePackageIds: ["bottle-250", "bottle-500", "bottle-1500"],

    featured: true,
  },
];
