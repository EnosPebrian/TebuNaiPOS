export interface OrderItem {
  id: string;

  productId: string;

  productName: string;

  image: string;

  variantId: string;

  variantLabel: string;

  quantity: number;

  unitPrice: number;
}

export interface Order {
  items: OrderItem[];
}
