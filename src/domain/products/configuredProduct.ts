import { ProductConfiguration } from "./productConfiguration";

/**
 * A catalog product configured by the customer.
 */
export interface ConfiguredProduct {
  /**
   * Product from catalog.
   */
  productId: string;

  /**
   * Customer selections.
   */
  configuration: ProductConfiguration;
}
