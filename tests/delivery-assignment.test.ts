import { describe, expect, it } from "vitest";
import { createCheckoutOrder } from "@/domain/checkout";
import { createCartItem } from "@/domain/order/cart";
import { updateOrder } from "@/domain/order/lifecycle";
import { normalizeDeliveryDriver } from "@/domain/fulfillment/fulfillment";
import { checkoutInput, updateInput } from "@/lib/server/orderInput";
import { parseOrderQuery } from "@/domain/order/query";
import type { Order } from "@/domain/order/Order";

const items = [createCartItem({ productId: "nasi-bakar", configuration: { toppingIds: [] } }, 1)];
const details = { name: "Delivery fixture", phone: "081234567890", method: "delivery" as const, address: "Jl. Test No. 10, Jakarta", notes: "" };
const original = () => createCheckoutOrder(items, details, { id: "delivery-fixture", createdAt: "2026-10-28T00:00:00.000Z" });
const confirmed = () => updateOrder(original(), { version: 0, status: "confirmed", deliveryFee: 5000, note: "Quote agreed" });
const driver = { name: "Driver Alpha", phone: "" };
const assign = (order: Order, value: typeof driver | null = driver, note = "") => updateOrder(order, { version: 0, driver: value, note });

describe("delivery driver assignments", () => {
  it("normalizes and freezes assignment without changing price, address or original snapshot", () => {
    const before = confirmed(); const after = assign(before, { name: " Driver   Alpha ", phone: " +62 812 3456 7890 " });
    expect(after.fulfillment).toMatchObject({ address: details.address, driver: { name: "Driver Alpha", phone: "+62 812 3456 7890" } });
    expect(after.total).toBe(24000); expect(after.items).toBe(before.items);
    expect(before.fulfillment).not.toHaveProperty("driver"); expect(Object.isFrozen(after.fulfillment)).toBe(true);
    expect(after.fulfillment.method === "delivery" && Object.isFrozen(after.fulfillment.driver)).toBe(true);
  });
  it("requires confirmation and refuses pickup assignments", () => {
    expect(() => assign(original())).toThrow(/confirmed delivery/);
    const pickup = createCheckoutOrder(items, { ...details, method: "pickup" }, { id: "pickup", createdAt: "2026-10-28T00:00:00.000Z" });
    expect(() => assign(updateOrder(pickup, { version: 0, status: "confirmed", note: "" }))).toThrow(/delivery/);
  });
  it("requires a driver before handoff and locks changes afterwards", () => {
    const preparing = updateOrder(confirmed(), { version: 0, status: "preparing", note: "" });
    const ready = updateOrder(preparing, { version: 0, status: "ready", note: "" });
    expect(() => updateOrder(ready, { version: 0, status: "picked-up", note: "" })).toThrow(/Assign a driver/);
    const out = updateOrder(assign(ready), { version: 0, status: "picked-up", note: "" });
    expect(() => assign(out, { name: "Other driver", phone: "" }, "Changed route")).toThrow(/before handoff/);
    expect(() => assign(out, null, "Driver unavailable")).toThrow(/before handoff/);
  });
  it("requires an audit note for reassignment or removal", () => {
    const first = assign(confirmed());
    expect(() => assign(first, { name: "Driver Beta", phone: "" })).toThrow(/staff note/);
    expect(() => assign(first, null)).toThrow(/staff note/);
    expect(assign(first, { name: "Driver Beta", phone: "" }, "Original driver unavailable").fulfillment).toMatchObject({ driver: { name: "Driver Beta" } });
    expect(assign(first, null, "Driver unavailable").fulfillment).not.toHaveProperty("driver");
    expect(() => assign(first, driver, "Same driver")).toThrow(/different/);
  });
  it("accepts an absent optional phone and rejects invalid names/contact details", () => {
    expect(normalizeDeliveryDriver(driver).phone).toBe("");
    for (const invalid of [{ name: "x", phone: "" }, { name: "Driver\nAlpha", phone: "" }, { name: "Driver", phone: "not a phone" }, { name: "Driver", phone: "123" }]) expect(() => normalizeDeliveryDriver(invalid)).toThrow();
  });
  it("keeps legacy deliveries already handed off completable without retroactive assignment", () => {
    const legacy: Order = { ...confirmed(), status: "picked-up", paymentStatus: "paid" };
    expect(updateOrder(legacy, { version: 0, status: "completed", note: "Delivered" }).status).toBe("completed");
  });
  it("rejects forged driver data at public checkout and limits staff assignment shape", () => {
    const online = { items: items.map(({ configuredProduct, quantity }) => ({ configuredProduct, quantity })), details: { ...details, driver } };
    expect(checkoutInput.safeParse(online).success).toBe(false);
    expect(updateInput.safeParse({ version: 0, driver: { ...driver, role: "admin" }, note: "" }).success).toBe(false);
    expect(updateInput.safeParse({ version: 0, driver: null, note: "Removed" }).success).toBe(true);
  });
  it("validates delivery-only assignment filters", () => {
    expect(parseOrderQuery(new URLSearchParams("driver=unassigned")).filters.driver).toBe("unassigned");
    for (const query of ["driver=unknown", "driver=assigned&method=pickup", "driver=assigned&driver=unassigned"]) expect(() => parseOrderQuery(new URLSearchParams(query))).toThrow();
  });
});
