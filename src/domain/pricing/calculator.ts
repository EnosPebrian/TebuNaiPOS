import { catalog } from "@/domain/catalog";

import { PricingResult } from "./types";

export interface DraftPricingInput {
  packageId: string;

  ingredientIds: string[];

  quantity: number;
}

export function calculateDraftOrder(input: DraftPricingInput): PricingResult {
  const pkg = catalog.getPackage(input.packageId);

  if (!pkg) {
    throw new Error("Package not found.");
  }

  const lines = [];

  lines.push({
    id: pkg.id,

    label: pkg.name,

    quantity: 1,

    unitPrice: pkg.basePrice,

    total: pkg.basePrice,
  });

  for (const ingredientId of input.ingredientIds) {
    const ingredient = catalog.getIngredient(ingredientId);

    if (!ingredient) continue;

    if (ingredient.extraPrice === 0) continue;

    lines.push({
      id: ingredient.id,

      label: ingredient.name,

      quantity: 1,

      unitPrice: ingredient.extraPrice,

      total: ingredient.extraPrice,
    });
  }

  const singleItemSubtotal = lines.reduce((sum, line) => sum + line.total, 0);

  return {
    lines,

    subtotal: singleItemSubtotal * input.quantity,

    discounts: 0,

    charges: 0,

    grandTotal: singleItemSubtotal * input.quantity,
  };
}
