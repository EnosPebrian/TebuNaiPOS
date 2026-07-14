import { Money } from "@/domain/money";

/**
 * One line shown in
 * an order summary,
 * receipt,
 * or invoice.
 */
export interface PriceLine {
  /**
   * Unique identifier.
   */
  id: string;

  /**
   * Display label.
   *
   * Example:
   * 500 ml Bottle
   */
  label: string;

  /**
   * Quantity of this line.
   */
  quantity: number;

  /**
   * Unit price.
   */
  unitPrice: Money;

  /**
   * Total for this line.
   */
  total: Money;
}
