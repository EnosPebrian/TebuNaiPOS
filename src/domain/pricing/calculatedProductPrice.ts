import { Product } from "@/data/products";
import { ProductPackage } from "@/data/packages";

export function calculateProductPrice(
  product: Product,
  productPackage: ProductPackage,
) {
  const flavorCount = Math.max(product.craftedFrom.length - 1, 0);

  return productPackage.basePrice + flavorCount * productPackage.flavorPrice;
}
