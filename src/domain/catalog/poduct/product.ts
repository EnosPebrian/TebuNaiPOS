/**
 * A sellable product.
 *
 * Example:
 * Sugar Cane Juice
 */
export interface Product {
  /**
   * Unique identifier.
   */
  id: string;

  /**
   * URL friendly name.
   */
  slug: string;

  /**
   * Display name.
   */
  name: string;

  /**
   * Product description.
   */
  description: string;

  /**
   * Hero image.
   */
  image: string;

  /**
   * Business category.
   */
  categoryId: string;

  /**
   * Available package options.
   */
  packageIds: string[];

  /**
   * Available topping options.
   */
  toppingIds: string[];

  /**
   * Available preset options.
   */
  presetIds: string[];

  /**
   * Can customers order this?
   */
  enabled: boolean;
}
