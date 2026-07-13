import { Money } from "@/domain/money";

export interface Package {
  id: string;

  name: string;

  volume: number;

  unit: "ml";

  basePrice: Money;

  enabled: boolean;

  sortOrder: number;
}
