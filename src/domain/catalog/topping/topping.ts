import { Money } from "@/domain/money";

/**
 * Extra ingredient that can be added
 * to Sugar Cane Juice.
 */
export interface Topping {
  /**
   * Unique identifier.
   */
  id: string;

  /**
   * URL slug.
   */
  slug: string;

  /**
   * Display name.
   */
  name: string;

  /**
   * Emoji shown in UI.
   */
  icon: string;

  /**
   * Additional price.
   */
  extraPrice: Money;

  /**
   * Whether customers can order it.
   */
  enabled: boolean;

  /**
   * Display order.
   */
  sortOrder: number;
}
