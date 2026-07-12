"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

import { OrderItem, Order } from "./types";
import { orderReducer } from "./reducer";

interface OrderContextValue {
  order: Order;

  addItem: (item: OrderItem) => void;

  updateQuantity: (id: string, quantity: number) => void;

  removeItem: (id: string) => void;

  clearOrder: () => void;

  itemCount: number;

  subtotal: number;
}

const OrderContext = createContext<OrderContextValue | null>(null);

const initialState: Order = {
  items: [],
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, dispatch] = useReducer(orderReducer, initialState);

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const addItem = (item: OrderItem) =>
    dispatch({
      type: "ADD_ITEM",
      payload: item,
    });

  const updateQuantity = (id: string, quantity: number) =>
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        id,
        quantity,
      },
    });

  const removeItem = (id: string) =>
    dispatch({
      type: "REMOVE_ITEM",
      payload: id,
    });

  const clearOrder = () =>
    dispatch({
      type: "CLEAR",
    });

  return (
    <OrderContext.Provider
      value={{
        order,

        addItem,

        updateQuantity,

        removeItem,

        clearOrder,

        itemCount,

        subtotal,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error("useOrderContext must be used inside OrderProvider");
  }

  return context;
}
