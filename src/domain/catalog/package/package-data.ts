import { Package } from "./package";

export const packages: Package[] = [
  {
    id: "bottle-250",
    name: "Personal Bottle",
    container: "bottle",
    volume: 250,
    unit: "ml",
    basePrice: 12000,
    available: true,
  },

  {
    id: "bottle-500",
    name: "Everyday Bottle",
    container: "bottle",
    volume: 500,
    unit: "ml",
    basePrice: 17000,
    available: true,
  },

  {
    id: "bottle-1500",
    name: "Family Bottle",
    container: "bottle",
    volume: 1500,
    unit: "ml",
    basePrice: 35000,
    available: true,
  },
];
