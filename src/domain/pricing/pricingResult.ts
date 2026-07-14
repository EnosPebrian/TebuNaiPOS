import { Money } from "@/domain/money";
import { PricingLine } from "./pricingLine";

/**
 * Result returned by the pricing engine.
 */
export interface PricingResult {
  /**
   * All receipt lines.
   */
  lines: PricingLine[];

  /**
   * Total before discounts.
   */
  subtotal: Money;

  /**
   * Total discount.
   */
  discount: Money;

  /**
   * Extra charges.
   *
   * Example:
   * Delivery fee.
   */
  charge: Money;

  /**
   * Final amount.
   */
  grandTotal: Money;
}
