import { Product } from "./product";

export const products: Product[] = [
  {
    id: "sugar-cane-juice",

    slug: "sugar-cane-juice",

    name: "Sugar Cane Juice",

    description:
      "Freshly pressed sugar cane juice with your favorite fruit and herbal toppings.",

    image: "/products/original.png",

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
      "tebu-nipis",
      "tebu-beet",
      "tebu-santan",
      "tebu-beet-lemon",
      "tebu-ginger-turmeric",
      "tebu-nanas-kunyit",
    ],

    enabled: true,
  },
];
