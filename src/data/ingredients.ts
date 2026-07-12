import { IngredientId } from "./products";

export interface Ingredient {
  id: IngredientId;

  name: string;

  emoji: string;

  image?: string;

  customizable: boolean;

  extraPrice: number;
}

export const ingredients: Ingredient[] = [
  {
    id: "sugarcane",
    name: "Fresh Sugarcane",
    emoji: "🌿",
    customizable: false,
    extraPrice: 0,
  },
  {
    id: "lemon",
    name: "Fresh Lemon",
    emoji: "🍋",
    customizable: true,
    extraPrice: 2000,
  },
  {
    id: "lime",
    name: "Fresh Lime",
    emoji: "🍈",
    customizable: true,
    extraPrice: 2000,
  },
  {
    id: "pineapple",
    name: "Fresh Pineapple",
    emoji: "🍍",
    customizable: true,
    extraPrice: 3000,
  },
  {
    id: "turmeric",
    name: "Fresh Turmeric",
    emoji: "🟡",
    customizable: true,
    extraPrice: 2000,
  },
  {
    id: "ginger",
    name: "Fresh Ginger",
    emoji: "🫚",
    customizable: true,
    extraPrice: 2000,
  },
  {
    id: "coconut",
    name: "Fresh Coconut",
    emoji: "🥥",
    customizable: true,
    extraPrice: 3000,
  },
  {
    id: "strawberry",
    name: "Fresh Strawberry",
    emoji: "🍓",
    customizable: true,
    extraPrice: 3000,
  },
  {
    id: "kedondong",
    name: "Fresh Kedondong",
    emoji: "🥭",
    customizable: true,
    extraPrice: 3000,
  },
  {
    id: "beetroot",
    name: "Fresh Beetroot",
    emoji: "🫜",
    customizable: true,
    extraPrice: 3000,
  },
  {
    id: "carrot",
    name: "Fresh Carrot",
    emoji: "🥕",
    customizable: true,
    extraPrice: 3000,
  },
  {
    id: "tomato",
    name: "Fresh Tomato",
    emoji: "🍅",
    customizable: true,
    extraPrice: 3000,
  },
];

export const ingredientMap = Object.fromEntries(
  ingredients.map((ingredient) => [ingredient.id, ingredient]),
);
