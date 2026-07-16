import { Money } from "@/domain/money";

export interface Food {
  id: string;

  slug: string;

  name: string;

  description: string;

  categoryId: "main-course" | "snacks" | "alcoholic-beverage";

  price: Money;

  image: string;

  enabled: boolean;

  sortOrder: number;

  volume?: number;
}
