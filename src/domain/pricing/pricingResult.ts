import { Money } from "@/domain/money";
import { PriceLine } from "./priceLine";

/**
 * Result returned by the pricing engine.
 */
export interface PricingResult {
  /**
   * All receipt lines.
   */
  lines: PriceLine[];

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
