import { describe, expect, it } from "vitest";
import { catalog, foods } from "../src/domain/catalog";
import {
  ConfiguredProduct,
  configuredProductFactory,
  immutableConfiguredProduct,
} from "../src/domain/products";
import { calculateConfiguredProductPrice, calculatePrice } from "../src/domain/pricing";
import {
  createCartItem,
  normalizeCartItems,
  readPersistedCart,
  repriceCartItems,
} from "../src/domain/order/cart";
import { orderReducer } from "../src/domain/order/reducer";

function juice(packageId = "500ml", toppingIds: readonly string[] = []): ConfiguredProduct {
  return { productId: "sugar-cane-juice", configuration: { packageId, toppingIds } };
}

describe("catalog pricing", () => {
  for (const [packageId, base, toppingPrice] of [
    ["250ml", 12000, 3000],
    ["500ml", 17000, 3000],
    ["1500ml", 35000, 5000],
  ] as const) {
    for (const toppingIds of [[], ["lime"], ["lime", "ginger"], catalog.getToppings().map((t) => t.id)]) {
      for (const quantity of [1, 2, 99]) {
        it(`${packageId}, ${toppingIds.length} toppings, quantity ${quantity}`, () => {
          const result = calculateConfiguredProductPrice(juice(packageId, toppingIds), quantity);
          expect(result.grandTotal).toBe((base + toppingPrice * toppingIds.length) * quantity);
          expect(result.subtotal).toBe(result.grandTotal);
          expect(result.discount).toBe(0);
          expect(calculatePrice({ packageId, toppingIds, quantity })).toEqual(result);
        });
      }
    }
  }

  it.each([
    ["nasi-bakar", 19000],
    ["nasi-sop-ayam", 19000],
    ["risol-mayo", 6000],
    ["risol-sayur-rouguette", 6000],
  ])("prices %s using the same product flow", (id, price) => {
    const configured = configuredProductFactory.createEmpty(id as string);
    expect(configured.configuration.packageId).toBeUndefined();
    expect(createCartItem(configured, 3).unitPrice).toBe(price);
    expect(calculateConfiguredProductPrice(configured, 3).grandTotal).toBe(Number(price) * 3);
  });

  it.each([0, -1, 1.5, 100, NaN, Infinity])("rejects invalid quantity %s", (quantity) => {
    expect(() => createCartItem(juice(), quantity)).toThrow();
  });

  it.each([
    juice("missing"),
    juice("500ml", ["missing"]),
    juice("500ml", ["lime", "lime"]),
    { productId: "missing", configuration: { toppingIds: [] } },
    { productId: "sugar-cane-juice", configuration: { toppingIds: [] } },
    { productId: "nasi-bakar", configuration: { packageId: "250ml", toppingIds: [] } },
    { productId: "nasi-bakar", configuration: { toppingIds: ["lime"] } },
  ])("rejects incompatible product selection %#", (configured) => {
    expect(() => createCartItem(configured, 1)).toThrow();
  });

  it("keeps rum visible only as a disabled seed and rejects forged orders", () => {
    const rum = foods.find((food) => food.id === "sugarcane-rum-250ml")!;
    expect(rum).toMatchObject({ price: 50000, volume: 250, enabled: false });
    expect(catalog.getProduct(rum.id)).toBeUndefined();
    const configured = { productId: rum.id, configuration: { toppingIds: [] } };
    expect(() => createCartItem(configured, 1)).toThrow();
    expect(() => calculateConfiguredProductPrice(configured, 1)).toThrow();
    expect(normalizeCartItems([{ configuredProduct: configured, quantity: 1, unitPrice: 1 }])).toEqual([]);
  });

  it("returns a deep immutable configuration independent of caller arrays", () => {
    const toppings = ["lime"];
    const configured = immutableConfiguredProduct(juice("500ml", toppings));
    toppings.push("ginger");
    expect(configured.configuration.toppingIds).toEqual(["lime"]);
    expect(Object.isFrozen(configured)).toBe(true);
    expect(Object.isFrozen(configured.configuration)).toBe(true);
    expect(Object.isFrozen(configured.configuration.toppingIds)).toBe(true);
  });

  it("validates that presets belong to their product", () => {
    expect(() => configuredProductFactory.createFromPreset("nasi-bakar", "original")).toThrow();
    expect(configuredProductFactory.createFromPreset("sugar-cane-juice", "santan-nipis").configuration.toppingIds).toEqual(["coconut", "lime"]);
  });
});

describe("configured cart", () => {
  it("merges identical topping sets regardless of selection order", () => {
    const a = createCartItem(juice("500ml", ["lime", "ginger"]), 2);
    const b = createCartItem(juice("500ml", ["ginger", "lime"]), 3);
    expect(a.id).toBe(b.id);
    expect(orderReducer({ items: [a] }, { type: "ADD_ITEM", payload: b }).items).toHaveLength(1);
    expect(orderReducer({ items: [a] }, { type: "ADD_ITEM", payload: b }).items[0].quantity).toBe(5);
  });

  it("keeps different toppings and bottle sizes as separate lines", () => {
    const items = [juice("250ml", ["lime"]), juice("500ml", ["lime"]), juice("500ml", ["ginger"])].map((c) => createCartItem(c, 1));
    expect(repriceCartItems(items)).toHaveLength(3);
  });

  it("changes quantity, removes and clears without mutating previous state", () => {
    const original = { items: [createCartItem(juice(), 2)] };
    const id = original.items[0].id;
    const updated = orderReducer(original, { type: "UPDATE_QUANTITY", payload: { id, quantity: 3 } });
    expect(original.items[0].quantity).toBe(2);
    expect(updated.items[0].quantity).toBe(3);
    expect(orderReducer(updated, { type: "UPDATE_QUANTITY", payload: { id, quantity: 0 } }).items).toEqual([]);
    expect(orderReducer(updated, { type: "REMOVE_ITEM", payload: id }).items).toEqual([]);
    expect(orderReducer(updated, { type: "CLEAR" }).items).toEqual([]);
  });

  it("rejects additions beyond the quantity cap and invalid updates", () => {
    const item = createCartItem(juice(), 99);
    const state = { items: [item] };
    expect(orderReducer(state, { type: "ADD_ITEM", payload: createCartItem(juice(), 1) })).toBe(state);
    for (const quantity of [100, -1, NaN, 1.2]) {
      expect(orderReducer(state, { type: "UPDATE_QUANTITY", payload: { id: item.id, quantity } })).toBe(state);
    }
  });

  it("applies the cart line limit after merging matching configurations", () => {
    const toppings = catalog.getToppings().slice(0, 7).map((topping) => topping.id);
    const items = Array.from({ length: 100 }, (_, index) =>
      createCartItem(juice("500ml", toppings.filter((_, bit) => Boolean(index & (1 << bit)))), 1),
    );
    const merged = repriceCartItems([...items, items[0]]);
    expect(merged).toHaveLength(100);
    expect(merged[0].quantity).toBe(2);
    const extra = createCartItem(juice("500ml", toppings.filter((_, bit) => Boolean(100 & (1 << bit)))), 1);
    expect(() => repriceCartItems([...items, extra])).toThrow();
  });

  it("recalculates persisted or checkout prices and display from the catalog", () => {
    const item = createCartItem(juice("1500ml", ["lime", "ginger"]), 2);
    const forged = { ...item, id: "forged", productName: "Incorrect", unitPrice: 1 };
    expect(repriceCartItems([forged])).toEqual([item]);
    expect(readPersistedCart(JSON.stringify({ version: 1, items: [forged] }))).toEqual([item]);
  });

  it("recovers valid lines while dropping corrupt or stale persisted data", () => {
    const item = createCartItem(juice(), 1);
    expect(normalizeCartItems([null, {}, { configuredProduct: {}, quantity: 1 }, item])).toEqual([item]);
    for (const stored of [null, "", "invalid json", "null", "[]", '{"version":2,"items":[]}', '{"version":1,"items":null}']) {
      expect(readPersistedCart(stored)).toEqual([]);
    }
  });
});
