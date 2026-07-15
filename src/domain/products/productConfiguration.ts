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
  packageId?: string;

  /**
   * Selected toppings.
   */
  toppingIds: string[];
}
