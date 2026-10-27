import { catalog } from "@/domain/catalog";
import {
  ConfiguredProduct,
  validateConfiguredProduct,
  validateQuantity,
} from "@/domain/products";
import { PricingLine } from "./pricingLine";
import { PricingResult } from "./pricingResult";

export interface PricingRequest {
  productId?: string;
  packageId?: string;
  toppingIds: readonly string[];
  quantity: number;
}

/** One topping rule shared by the configurator, cart and checkout. */
export function getToppingPrice(packageId: string): number {
  const pkg = catalog.getPackage(packageId);
  if (!pkg) throw new Error("Package not found.");
  return pkg.volume === 1500 ? 5000 : 3000;
}

export function calculateConfiguredProductPrice(
  configured: ConfiguredProduct,
  quantity: number,
): PricingResult {
  validateQuantity(quantity);
  const product = validateConfiguredProduct(configured);
  const { packageId, toppingIds } = configured.configuration;
  const lines: PricingLine[] = [];
  if (packageId) {
    const pkg = catalog.getPackage(packageId)!;
    lines.push({
      id: pkg.id,
      type: "package",
      label: `${pkg.name} (${pkg.volume} ml)`,
      quantity: 1,
      unitPrice: pkg.basePrice,
      total: pkg.basePrice,
    });
    for (const toppingId of toppingIds) {
      const topping = catalog.getTopping(toppingId)!;
      const price = getToppingPrice(packageId);
      lines.push({
        id: topping.id,
        type: "topping",
        label: topping.name,
        quantity: 1,
        unitPrice: price,
        total: price,
      });
    }
  } else {
    if (!Number.isSafeInteger(product.price) || product.price! < 0) {
      throw new Error("This product has no valid price.");
    }
    lines.push({
      id: product.id,
      type: "product",
      label: product.name,
      quantity: 1,
      unitPrice: product.price!,
      total: product.price!,
    });
  }
  const subtotal = lines.reduce((sum, line) => sum + line.total, 0) * quantity;
  return { lines, subtotal, discount: 0, charge: 0, grandTotal: subtotal };
}

/** Backwards-compatible entry point for existing juice presentation cards. */
export function calculatePrice(request: PricingRequest): PricingResult {
  return calculateConfiguredProductPrice({
    productId: request.productId ?? "sugar-cane-juice",
    configuration: { packageId: request.packageId, toppingIds: request.toppingIds },
  }, request.quantity);
}
