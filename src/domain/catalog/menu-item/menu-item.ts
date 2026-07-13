interface IngredientSelection {
  ingredientId: string;

  quantity: number;
}

export interface MenuItem {
  id: string;

  categoryId: string;

  name: string;

  description: string;

  image: string;

  accentColor: string;

  defaultIngredientIds: IngredientSelection[];

  availablePackageIds: string[];

  featured: boolean;
}
