import { Money } from "@/domain/money";

export interface PriceLine {
  id: string;

  label: string;

  quantity: number;

  unitPrice: Money;

  total: Money;
}

export interface PricingResult {
  lines: PriceLine[];

  subtotal: Money;

  discounts: Money;

  charges: Money;

  grandTotal: Money;
}
