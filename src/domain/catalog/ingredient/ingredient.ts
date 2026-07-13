import { Money } from "@/domain/money";

export interface Ingredient {
  id: string;

  name: string;

  icon: string;

  extraPrice: Money;

  available: boolean;

  tags: string[];
}
