export interface MenuItem {
  id: string;

  categoryId: string;

  name: string;

  description: string;

  image: string;

  accentColor: string;

  defaultIngredientIds: string[];

  availablePackageIds: string[];

  featured: boolean;
}
