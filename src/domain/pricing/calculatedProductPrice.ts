import { Product, ProductPackage } from "@/data/products";
import { calculateConfiguredProductPrice } from "./pricingEngine";

export function calculateProductPrice(
  product: Product,
  productPackage: ProductPackage,
) {
  return calculateConfiguredProductPrice({
    productId: "sugar-cane-juice",
    configuration: {
      packageId: `${productPackage.volume}ml`,
      toppingIds: product.craftedFrom.filter((id) => id !== "sugarcane"),
    },
  }, 1).grandTotal;
}
