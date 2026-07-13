/**
 * Preset
 *
 * A recommended drink combination.
 *
 * Example:
 * Tebu Santan Nipis
 *
 * opens
 *
 * Sugar Cane Juice
 * + Coconut
 * + Lime
 */
export interface Preset {
  /**
   * Unique identifier.
   */
  id: string;

  /**
   * URL friendly identifier.
   */
  slug: string;

  /**
   * Display name.
   */
  name: string;

  /**
   * Short marketing description.
   */
  description: string;

  /**
   * Image shown on homepage.
   */
  image: string;

  /**
   * Theme color.
   */
  accentColor: string;

  /**
   * Default package.
   */
  defaultPackageId: string;

  /**
   * Preselected toppings.
   */
  defaultToppingIds: string[];

  /**
   * Featured on homepage.
   */
  featured: boolean;

  /**
   * Can customers order it?
   */
  enabled: boolean;

  /**
   * Display order.
   */
  sortOrder: number;
}
