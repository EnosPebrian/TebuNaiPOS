export interface Package {
  id: string;

  name: string;

  container: "bottle" | "cup" | "jug";

  volume: number;

  unit: string;

  basePrice: Money;

  available: boolean;
}
