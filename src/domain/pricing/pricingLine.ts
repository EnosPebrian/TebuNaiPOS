import { Money } from "@/domain/money";

export type PricingLineType = "package" | "topping" | "discount" | "charge";

export interface PricingLine {
  /**
   * Unique identifier.
   */
  id: string;

  /**
   * Line type.
   */
  type: PricingLineType;

  /**
   * Display label.
   */
  label: string;

  /**
   * Quantity.
   */
  quantity: number;

  /**
   * Price for one unit.
   */
  unitPrice: Money;

  /**
   * Total price.
   */
  total: Money;
}
