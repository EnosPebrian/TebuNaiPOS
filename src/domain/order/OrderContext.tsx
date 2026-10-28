"use client";

import { createContext, useContext, useEffect, useReducer, ReactNode } from "react";
import { OrderItem, Order } from "./types";
import { orderReducer, OrderAction } from "./reducer";
import { CART_STORAGE_KEY, readPersistedCart, repriceCartItems } from "./cart";

interface OrderContextValue {
  order: Order;
  addItem: (item: OrderItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearOrder: () => void;
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
}

const OrderContext = createContext<OrderContextValue | null>(null);
interface ProviderState { cart: Order; hydrated: boolean }
type ProviderAction = OrderAction | { type: "HYDRATE"; items: OrderItem[] };

function providerReducer(state: ProviderState, action: ProviderAction): ProviderState {
  if (action.type === "HYDRATE") return { cart: { items: action.items }, hydrated: true };
  return { ...state, cart: orderReducer(state.cart, action) };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(providerReducer, { cart: { items: [] }, hydrated: false });
  const order = state.cart;

  useEffect(() => {
    const load = () => {
      try {
        dispatch({ type: "HYDRATE", items: readPersistedCart(window.localStorage.getItem(CART_STORAGE_KEY)) });
      } catch {
        // Shopping still works for browsers that disallow local storage.
        dispatch({ type: "HYDRATE", items: [] });
      }
    };
    load();
    const onStorage = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY || event.key === null) load();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ version: 1, items: order.items }));
    } catch {
      // Keep the in-memory cart usable when storage is unavailable or full.
    }
  }, [order.items, state.hydrated]);

  const addItem = (item: OrderItem) => {
    if (!state.hydrated) throw new Error("Your cart is loading. Please try again in a moment.");
    // Surface a useful error to the caller for a cart limit or restricted item.
    repriceCartItems([...order.items, item]);
    dispatch({ type: "ADD_ITEM", payload: item });
  };
  const updateQuantity = (id: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const clearOrder = () => dispatch({ type: "CLEAR" });
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <OrderContext.Provider value={{ order, addItem, updateQuantity, removeItem, clearOrder, itemCount, subtotal, hydrated: state.hydrated }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrderContext must be used inside OrderProvider");
  return context;
}
