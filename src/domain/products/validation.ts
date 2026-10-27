import { catalog, Product } from "@/domain/catalog";
import { ConfiguredProduct } from "./configuredProduct";

export const MAX_ITEM_QUANTITY = 99;

export function validateQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
    throw new Error(`Quantity must be a whole number from 1 to ${MAX_ITEM_QUANTITY}.`);
  }
}

export function validateConfiguredProduct(configured: ConfiguredProduct): Product {
  if (!configured || typeof configured.productId !== "string" || !configured.configuration) {
    throw new Error("Invalid product configuration.");
  }
  const product = catalog.getProduct(configured.productId);
  if (!product || product.categoryId === "alcoholic-beverage") {
    throw new Error("This product is unavailable for ordering.");
  }
  const { packageId, toppingIds } = configured.configuration;
  if (!Array.isArray(toppingIds) || !toppingIds.every((id) => typeof id === "string")) {
    throw new Error("Invalid topping selection.");
  }
  if (new Set(toppingIds).size !== toppingIds.length) {
    throw new Error("A topping can only be selected once.");
  }
  if (product.packageIds.length > 0) {
    if (!packageId || !product.packageIds.includes(packageId) || !catalog.getPackage(packageId)) {
      throw new Error("Choose an available package for this product.");
    }
  } else if (packageId !== undefined) {
    throw new Error("This product does not have package options.");
  }
  for (const id of toppingIds) {
    if (!product.toppingIds.includes(id) || !catalog.getTopping(id)) {
      throw new Error("A selected topping is unavailable for this product.");
    }
  }
  return product;
}

export function immutableConfiguredProduct(configured: ConfiguredProduct): ConfiguredProduct {
  validateConfiguredProduct(configured);
  return Object.freeze({
    productId: configured.productId,
    configuration: Object.freeze({
      ...(configured.configuration.packageId === undefined
        ? {}
        : { packageId: configured.configuration.packageId }),
      toppingIds: Object.freeze([...configured.configuration.toppingIds].sort()),
    }),
  });
}
