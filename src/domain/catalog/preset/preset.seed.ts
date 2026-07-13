import { Preset } from "./preset";

export const presets: Preset[] = [
  {
    id: "original",

    slug: "original",

    name: "Original",

    description: "Pure fresh sugar cane juice.",

    image: "/products/original.png",

    accentColor: "#6BAA75",

    defaultPackageId: "500ml",

    defaultToppingIds: [],

    featured: true,

    enabled: true,

    sortOrder: 1,
  },

  {
    id: "santan-nipis",

    slug: "santan-nipis",

    name: "Tebu Santan Nipis",

    description: "Fresh coconut with lime.",

    image: "/products/coconut-lime.png",

    accentColor: "#88C999",

    defaultPackageId: "500ml",

    defaultToppingIds: ["coconut", "lime"],

    featured: true,

    enabled: true,

    sortOrder: 2,
  },

  {
    id: "tomat-wortel",

    slug: "tomat-wortel",

    name: "Tebu Tomat Wortel",

    description: "Fresh tomato and carrot blend.",

    image: "/products/tomato-carrot.png",

    accentColor: "#F28C52",

    defaultPackageId: "500ml",

    defaultToppingIds: ["tomato", "carrot"],

    featured: true,

    enabled: true,

    sortOrder: 3,
  },

  {
    id: "lemon-nanas",

    slug: "lemon-nanas",

    name: "Tebu Lemon Nanas",

    description: "Refreshing pineapple and lemon.",

    image: "/products/lemon-pineapple.png",

    accentColor: "#F4D35E",

    defaultPackageId: "500ml",

    defaultToppingIds: ["lemon", "pineapple"],

    featured: true,

    enabled: true,

    sortOrder: 4,
  },

  {
    id: "jahe-lemon",

    slug: "jahe-lemon",

    name: "Tebu Jahe Lemon",

    description: "Warm ginger with fresh lemon.",

    image: "/products/ginger-lemon.png",

    accentColor: "#F7B267",

    defaultPackageId: "500ml",

    defaultToppingIds: ["ginger", "lemon"],

    featured: true,

    enabled: true,

    sortOrder: 5,
  },
];
