export interface DraftOrderItem {
  id: string;

  recipeId: string;

  packageId: string;

  ingredientIds: string[];

  quantity: number;
}
