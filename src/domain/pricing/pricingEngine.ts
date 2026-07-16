import { catalog } from "@/domain/catalog";

import { PricingLine } from "./pricingLine";
import { PricingResult } from "./pricingResult";

export interface PricingRequest {
  packageId: string;

  toppingIds: string[];

  quantity: number;
}

export function calculatePrice(request: PricingRequest): PricingResult {
  const lines: PricingLine[] = [];

  const pkg = catalog.getPackage(request.packageId);

  if (!pkg) {
    throw new Error("Package not found.");
  }

  lines.push({
    id: pkg.id,

    type: "package",

    label: pkg.name,

    quantity: 1,

    unitPrice: pkg.basePrice,

    total: pkg.basePrice,
  });

  for (const toppingId of request.toppingIds) {
    const topping = catalog.getTopping(toppingId);

    if (!topping) continue;

    const toppingPrice = pkg.volume === 1500 ? 5000 : 3000;

    lines.push({
      id: topping.id,

      type: "topping",

      label: topping.name,

      quantity: 1,

      unitPrice: toppingPrice,

      total: toppingPrice,
    });
  }

  const singleDrinkTotal = lines.reduce((sum, line) => sum + line.total, 0);

  return {
    lines,

    subtotal: singleDrinkTotal * request.quantity,

    discount: 0,

    charge: 0,

    grandTotal: singleDrinkTotal * request.quantity,
  };
}
