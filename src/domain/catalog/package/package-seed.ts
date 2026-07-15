import { Package } from "./package";

export const packages: Package[] = [
  { id: "250ml", name: "Personal Bottle", volume: 250, unit: "ml", basePrice: 15000, enabled: true, sortOrder: 1 },
  { id: "500ml", name: "Everyday Bottle", volume: 500, unit: "ml", basePrice: 20000, enabled: true, sortOrder: 2 },
  { id: "1500ml", name: "Family Bottle", volume: 1500, unit: "ml", basePrice: 50000, enabled: true, sortOrder: 3 },
];
