/**
 * Configuration selected by the customer.
 *
 * This object contains every configurable option
 * for a product.
 *
 * Today:
 * - Package
 * - Toppings
 *
 * Tomorrow:
 * - Ice Level
 * - Sugar Level
 * - Cheese
 * - Sauce
 */
export interface ProductConfiguration {
  /**
   * Selected package.
   */
  readonly packageId?: string;

  /**
   * Selected toppings.
   */
  readonly toppingIds: readonly string[];
}
