import { Preset } from "./preset";

export const presets: Preset[] = [
  {
    id: "tebu-nipis",

    slug: "tebu-nipis",

    name: "Tebu Nipis",

    description: "Refreshing sugar cane juice with fresh lime.",

    image: "/products/tebu-nipis.png",

    accentColor: "#8BC34A",

    defaultPackageId: "500ml",

    defaultToppingIds: ["lime"],

    featured: true,

    enabled: true,

    sortOrder: 1,
  },

  {
    id: "tebu-beet",

    slug: "tebu-beet",

    name: "Tebu Beet",

    description: "Fresh sugar cane juice with beetroot.",

    image: "/products/tebu-beet.png",

    accentColor: "#B71C1C",

    defaultPackageId: "500ml",

    defaultToppingIds: ["beetroot"],

    featured: true,

    enabled: true,

    sortOrder: 2,
  },

  {
    id: "tebu-santan",

    slug: "tebu-santan",

    name: "Tebu Santan",

    description: "Creamy fresh coconut blended with sugar cane juice.",

    image: "/products/tebu-santan.png",

    accentColor: "#A5D6A7",

    defaultPackageId: "500ml",

    defaultToppingIds: ["coconut"],

    featured: true,

    enabled: true,

    sortOrder: 3,
  },

  {
    id: "tebu-beet-lemon",

    slug: "tebu-beet-lemon",

    name: "Tebu Beet Lemon",

    description: "A vibrant blend of beetroot with refreshing lemon.",

    image: "/products/tebu-beet-lemon.png",

    accentColor: "#C62828",

    defaultPackageId: "500ml",

    defaultToppingIds: ["beetroot", "lemon"],

    featured: true,

    enabled: true,

    sortOrder: 4,
  },

  {
    id: "tebu-ginger-turmeric",

    slug: "tebu-ginger-turmeric",

    name: "Tebu Ginger Turmeric",

    description: "A warming blend of ginger and turmeric.",

    image: "/products/tebu-ginger-turmeric.png",

    accentColor: "#F9A825",

    defaultPackageId: "500ml",

    defaultToppingIds: ["ginger", "turmeric"],

    featured: true,

    enabled: true,

    sortOrder: 5,
  },

  {
    id: "tebu-nanas-kunyit",

    slug: "tebu-nanas-kunyit",

    name: "Tebu Nanas Kunyit",

    description: "Sweet pineapple balanced with aromatic turmeric.",

    image: "/products/tebu-nanas-kunyit.png",

    accentColor: "#FFB300",

    defaultPackageId: "500ml",

    defaultToppingIds: ["pineapple", "turmeric"],

    featured: true,

    enabled: true,

    sortOrder: 6,
  },
];
