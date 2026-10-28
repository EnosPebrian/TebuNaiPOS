import { ProductConfiguration } from "./productConfiguration";

/**
 * A catalog product configured by the customer.
 */
export interface ConfiguredProduct {
  /**
   * Product from catalog.
   */
  readonly productId: string;

  /**
   * Customer selections.
   */
  readonly configuration: ProductConfiguration;
}
