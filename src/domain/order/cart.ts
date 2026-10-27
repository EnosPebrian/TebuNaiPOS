import { catalog } from "@/domain/catalog";
import { calculateConfiguredProductPrice } from "@/domain/pricing";
import { ConfiguredProduct, immutableConfiguredProduct, MAX_ITEM_QUANTITY, validateQuantity } from "@/domain/products";
import { OrderItem } from "./types";

export const CART_STORAGE_KEY = "tebunai-cart-v1";
export const MAX_CART_ITEMS = 100;

export function createCartItem(configured: ConfiguredProduct, quantity: number): OrderItem {
  validateQuantity(quantity);
  const configuredProduct = immutableConfiguredProduct(configured);
  const product = catalog.getProduct(configuredProduct.productId)!;
  const { packageId, toppingIds } = configuredProduct.configuration;
  const pkg = packageId ? catalog.getPackage(packageId) : undefined;
  const toppingNames = toppingIds.map((id) => catalog.getTopping(id)!.name);
  const unitPrice = calculateConfiguredProductPrice(configuredProduct, 1).grandTotal;
  const id = JSON.stringify([product.id, packageId ?? null, toppingIds]);
  return {
    id,
    productId: product.id,
    productName: [product.name, ...toppingNames].join(" + "),
    image: product.image,
    variantId: id,
    variantLabel: pkg ? `${pkg.name} (${pkg.volume} ml)` : "Regular serving",
    quantity,
    unitPrice,
    configuredProduct,
  };
}

/** Reject invalid drafts and recalculate all catalog-dependent values. */
export function repriceCartItems(items: readonly OrderItem[]): OrderItem[] {
  if (!Array.isArray(items) || items.length > MAX_CART_ITEMS * MAX_ITEM_QUANTITY) {
    throw new Error("The cart has too many items. Please review your order.");
  }
  const result: OrderItem[] = [];
  for (const candidate of items) {
    const item = createCartItem(candidate.configuredProduct, candidate.quantity);
    const existingIndex = result.findIndex((entry) => entry.id === item.id);
    if (existingIndex === -1) {
      result.push(item);
      if (result.length > MAX_CART_ITEMS) {
        throw new Error("The cart has too many items. Please review your order.");
      }
    } else {
      const quantity = result[existingIndex].quantity + item.quantity;
      validateQuantity(quantity);
      result[existingIndex] = { ...result[existingIndex], quantity };
    }
  }
  return result;
}

/** Storage is untrusted: discard malformed/obsolete lines and ignore saved prices. */
export function normalizeCartItems(value: unknown): OrderItem[] {
  if (!Array.isArray(value) || value.length > MAX_CART_ITEMS) return [];
  let result: OrderItem[] = [];
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object") continue;
    try {
      const item = candidate as Partial<OrderItem>;
      if (!item.configuredProduct || typeof item.quantity !== "number") continue;
      result = repriceCartItems([...result, createCartItem(item.configuredProduct, item.quantity)]);
    } catch {
      // A corrupt, unavailable, or restricted item must never become orderable.
    }
  }
  return result;
}

export function readPersistedCart(serialized: string | null): OrderItem[] {
  if (!serialized) return [];
  try {
    const parsed: unknown = JSON.parse(serialized);
    if (!parsed || typeof parsed !== "object" || !("version" in parsed) || parsed.version !== 1 || !("items" in parsed)) {
      return [];
    }
    return normalizeCartItems(parsed.items);
  } catch {
    return [];
  }
}
