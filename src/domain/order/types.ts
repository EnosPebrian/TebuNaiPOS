import { ConfiguredProduct } from "@/domain/products";

/** Current cart line. Its display and price are derived from this configuration. */
export interface OrderItem {
  id: string;

  productId: string;

  productName: string;

  image: string;

  variantId: string;

  variantLabel: string;

  quantity: number;

  unitPrice: number;

  configuredProduct: ConfiguredProduct;
}

/** Existing provider draft state; a final Order snapshot is created at checkout. */
export interface Order {
  items: OrderItem[];
}
