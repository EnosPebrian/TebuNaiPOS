/**
 * Represents one customized sugar cane juice
 * before it is added to the cart.
 */
export interface DraftDrink {
  /**
   * Selected package.
   */
  packageId: string;

  /**
   * Selected toppings.
   */
  toppingIds: string[];
}
