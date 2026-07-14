import { Money } from "@/domain/money";
import { PricingLine } from "./pricingLine";

export interface PricingResult {
  lines: PricingLine[];

  subtotal: Money;

  discount: Money;

  charge: Money;

  grandTotal: Money;
}
