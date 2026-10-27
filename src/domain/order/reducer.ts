import { Order, OrderItem } from "./types";
import { repriceCartItems } from "./cart";
import { MAX_ITEM_QUANTITY } from "@/domain/products";

export type OrderAction =
  | { type: "ADD_ITEM"; payload: OrderItem }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR" };

export function orderReducer(state: Order, action: OrderAction): Order {
  switch (action.type) {
    case "ADD_ITEM": {
      try {
        return { items: repriceCartItems([...state.items, action.payload]) };
      } catch {
        return state;
      }
    }
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (!Number.isInteger(quantity) || quantity < 0 || quantity > MAX_ITEM_QUANTITY) return state;
      if (quantity === 0) return { items: state.items.filter((item) => item.id !== id) };
      return {
        items: state.items.map((item) => item.id === id ? { ...item, quantity } : item),
      };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((item) => item.id !== action.payload) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}
