import { Product } from "./product";

export const products: Product[] = [
  {
    id: "sugar-cane-juice",

    slug: "sugar-cane-juice",

    name: "Sugar Cane Juice",

    description:
      "Freshly pressed sugar cane juice with your favorite fruit and herbal toppings.",

    image: "/images/products/original.png",

    categoryId: "sugarcane-juice",

    packageIds: ["250ml", "500ml", "1500ml"],

    toppingIds: [
      "lemon",
      "lime",
      "pineapple",
      "ginger",
      "beetroot",
      "coconut",
      "tomato",
      "carrot",
      "orange",
      "turmeric",
      "strawberry",
      "kedondong",
    ],

    presetIds: [
      "original",
      "santan-nipis",
      "tomat-wortel",
      "lemon-nanas",
      "jahe-lemon",
    ],

    enabled: true,
  },
];
