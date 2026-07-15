export type ProductCategory = "classic" | "fruit" | "wellness";

export type IngredientId =
  | "sugarcane"
  | "lemon"
  | "lime"
  | "pineapple"
  | "turmeric"
  | "ginger"
  | "coconut"
  | "strawberry"
  | "kedondong"
  | "beetroot"
  | "carrot"
  | "tomato";

export interface ProductPackage {
  id: string;

  name: string;

  label: string;

  volume: number;

  container: "bottle" | "cup";

  basePrice: number;

  flavorPrice: number;

  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  label: string;
  volume: number;
  package: "bottle" | "cup";
  price: number;
  featured?: boolean;
}

const bottlePackages: ProductPackage[] = [
  {
    id: "personal",

    name: "Personal Bottle",

    label: "250 ml",

    volume: 250,

    container: "bottle",

    basePrice: 13000,

    flavorPrice: 2000,
  },

  {
    id: "everyday",

    name: "Everyday Bottle",

    label: "500 ml",

    volume: 500,

    container: "bottle",

    basePrice: 17000,

    flavorPrice: 3000,

    featured: true,
  },

  {
    id: "family",

    name: "Family Bottle",

    label: "1.5 L",

    volume: 1500,

    container: "bottle",

    basePrice: 35000,

    flavorPrice: 5000,
  },
];

const classicVariants: ProductVariant[] = [
  {
    id: "250",
    label: "250 ml",
    volume: 250,
    package: "bottle",
    price: 15000,
  },
  {
    id: "500",
    label: "500 ml",
    volume: 500,
    package: "bottle",
    price: 20000,
    featured: true,
  },
  {
    id: "1500",
    label: "1500 ml",
    volume: 1500,
    package: "bottle",
    price: 50000,
  },
];

const fruitVariants: ProductVariant[] = [
  {
    id: "250",
    label: "250 ml",
    volume: 250,
    package: "bottle",
    price: 17000,
  },
  {
    id: "500",
    label: "500 ml",
    volume: 500,
    package: "bottle",
    price: 22000,
    featured: true,
  },
  {
    id: "1500",
    label: "1500 ml",
    volume: 1500,
    package: "bottle",
    price: 55000,
  },
];

const premiumVariants: ProductVariant[] = [
  {
    id: "250",
    label: "250 ml",
    volume: 250,
    package: "bottle",
    price: 18000,
  },
  {
    id: "500",
    label: "500 ml",
    volume: 500,
    package: "bottle",
    price: 24000,
    featured: true,
  },
  {
    id: "1500",
    label: "1500 ml",
    volume: 1500,
    package: "bottle",
    price: 60000,
  },
];

export interface Product {
  id: string;

  category: ProductCategory;

  name: string;

  tagline: string;

  description: string;

  image: string;

  accentColor: string;

  featured: boolean;

  craftedFrom: IngredientId[];

  variants: ProductVariant[];
}

export const products: Product[] = [
  {
    id: "original",
    category: "classic",
    name: "Original",
    tagline: "Pure Sugarcane",
    description: "Freshly pressed sugarcane with its natural sweetness.",
    image: "/images/products/original.png",
    accentColor: "#A9C46C",
    featured: false,
    variants: classicVariants,
    craftedFrom: ["sugarcane"],
  },

  {
    id: "lemon",
    category: "classic",
    name: "Lemon",
    tagline: "Bright & Refreshing",
    description: "Fresh lemon blended with natural sugarcane.",
    image: "/images/products/lemon.png",
    accentColor: "#F7D84B",
    featured: false,
    variants: classicVariants,
    craftedFrom: ["sugarcane", "lemon"],
  },

  {
    id: "lime",
    category: "classic",
    name: "Jeruk Nipis",
    tagline: "Fresh Citrus",
    description: "Refreshing sugarcane with fresh lime.",
    image: "/images/products/lime.png",
    accentColor: "#8ED15A",
    featured: true,
    variants: classicVariants,
    craftedFrom: ["sugarcane", "lime"],
  },

  {
    id: "pineapple",
    category: "fruit",
    name: "Nanas",
    tagline: "Tropical Freshness",
    description: "Sweet pineapple meets freshly pressed sugarcane.",
    image: "/images/products/pineapple.png",
    accentColor: "#F2C94C",
    featured: false,
    variants: fruitVariants,
    craftedFrom: ["sugarcane", "pineapple"],
  },

  {
    id: "pineapple-turmeric",
    category: "wellness",
    name: "Nanas & Kunyit",
    tagline: "Golden Refreshment",
    description: "Fresh pineapple with turmeric for wellness.",
    image: "/images/products/pineapple-turmeric.png",
    accentColor: "#E9A825",
    featured: true,
    variants: premiumVariants,
    craftedFrom: ["sugarcane", "pineapple", "turmeric"],
  },

  {
    id: "ginger",
    category: "wellness",
    name: "Jahe",
    tagline: "Warm & Comforting",
    description: "Fresh ginger blended with natural sugarcane.",
    image: "/images/products/ginger.png",
    accentColor: "#C97A2D",
    featured: false,
    variants: fruitVariants,
    craftedFrom: ["sugarcane", "ginger"],
  },

  {
    id: "turmeric",
    category: "wellness",
    name: "Kunyit",
    tagline: "Golden Wellness",
    description: "Natural turmeric blended with fresh sugarcane.",
    image: "/images/products/turmeric.png",
    accentColor: "#F0A51A",
    featured: false,
    variants: fruitVariants,
    craftedFrom: ["sugarcane", "turmeric"],
  },

  {
    id: "coconut",
    category: "wellness",
    name: "Santan",
    tagline: "Creamy Refreshment",
    description: "Fresh coconut blended with sugarcane.",
    image: "/images/products/coconut.png",
    accentColor: "#BFD8C1",
    featured: true,
    variants: premiumVariants,
    craftedFrom: ["sugarcane", "coconut"],
  },

  {
    id: "strawberry",
    category: "fruit",
    name: "Strawberry",
    tagline: "Sweet & Fruity",
    description: "Fresh strawberries paired with sugarcane.",
    image: "/images/products/strawberry.png",
    accentColor: "#E84C6A",
    featured: false,
    variants: premiumVariants,
    craftedFrom: ["sugarcane", "strawberry"],
  },

  {
    id: "kedondong",
    category: "fruit",
    name: "Kedondong",
    tagline: "Local Tropical",
    description: "A uniquely Indonesian tropical refreshment.",
    image: "/images/products/kedondong.png",
    accentColor: "#A7C94F",
    featured: false,
    variants: premiumVariants,
    craftedFrom: ["sugarcane", "kedondong"],
  },

  {
    id: "beetroot",
    category: "fruit",
    name: "Beetroot",
    tagline: "Rich Antioxidants",
    description: "Fresh beetroot blended with sugarcane.",
    image: "/images/products/beetroot.png",
    accentColor: "#8A1846",
    featured: true,
    variants: premiumVariants,
    craftedFrom: ["sugarcane", "beetroot"],
  },

  {
    id: "carrot",
    category: "fruit",
    name: "Wortel",
    tagline: "Naturally Vibrant",
    description: "Sweet carrot meets fresh sugarcane.",
    image: "/images/products/carrot.png",
    accentColor: "#F28C28",
    featured: false,
    variants: premiumVariants,
    craftedFrom: ["sugarcane", "carrot"],
  },

  {
    id: "tomato",
    category: "fruit",
    name: "Tomat",
    tagline: "Fresh Garden",
    description: "Fresh tomato blended with sugarcane.",
    image: "/images/products/tomato.png",
    accentColor: "#D64541",
    featured: false,
    variants: premiumVariants,
    craftedFrom: ["sugarcane", "tomato"],
  },
];
