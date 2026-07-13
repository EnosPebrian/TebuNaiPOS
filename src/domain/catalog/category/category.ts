/**
 * Business category of a sellable item.
 *
 * Examples:
 * - Sugarcane Juice
 * - Snack
 * - Main Course
 * - Dessert
 */
export interface Category {
  /**
   * Unique identifier.
   */
  id: string;

  /**
   * URL friendly identifier.
   *
   * Example:
   * sugarcane-juice
   */
  slug: string;

  /**
   * Display name.
   */
  name: string;

  /**
   * Whether this category can be used.
   */
  enabled: boolean;

  /**
   * Display order.
   */
  sortOrder: number;
}
