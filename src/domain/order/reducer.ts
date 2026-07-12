import { Order, OrderItem } from "./types";

export type OrderAction =
  | {
      type: "ADD_ITEM";
      payload: OrderItem;
    }
  | {
      type: "UPDATE_QUANTITY";
      payload: {
        id: string;
        quantity: number;
      };
    }
  | {
      type: "REMOVE_ITEM";
      payload: string;
    }
  | {
      type: "CLEAR";
    };

export function orderReducer(state: Order, action: OrderAction): Order {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId,
      );

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existing.id
              ? {
                  ...item,
                  quantity: item.quantity + action.payload.quantity,
                }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                quantity: action.payload.quantity,
              }
            : item,
        ),
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "CLEAR":
      return {
        items: [],
      };

    default:
      return state;
  }
}
