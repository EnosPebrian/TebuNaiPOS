import type { ConfiguredProduct } from "@/domain/products";
import type { OrderItem as CartItem } from "./types";

/** A priced item captured when the customer prepares a checkout order. */
export interface OrderItem extends Readonly<Omit<CartItem, "configuredProduct">> {
  readonly configuredProduct: ConfiguredProduct;
}
