import { afterEach, describe, expect, it, vi } from "vitest";
import { randomBytes, scryptSync } from "node:crypto";
import { createCheckoutOrder } from "@/domain/checkout";
import { createCartItem } from "@/domain/order/cart";
import { nextStatuses, updateOrder } from "@/domain/order/lifecycle";
import { checkoutInput, serverOrder } from "@/lib/server/orderInput";
import { appOrigin, HttpError, readJson, requireOrigin } from "@/lib/server/http";
import { adminConfigured, verifyAdmin } from "@/lib/server/admin";

const details = { name: "Test Customer", phone: "081234567890", method: "pickup" as const, address: "", notes: "" };
const items = [createCartItem({ productId: "sugar-cane-juice", configuration: { packageId: "500ml", toppingIds: ["lime"] } }, 2)];
const metadata = { id: "test-order", createdAt: "2026-10-27T00:00:00.000Z" };
const initial = () => createCheckoutOrder(items, details, metadata);
const change = (status: Parameters<typeof updateOrder>[1]["status"], version = 0) => ({ status, version, note: "" });
afterEach(() => vi.unstubAllEnvs());

describe("order lifecycle", () => {
  it("walks pickup from request to completion with explicit payment", () => {
    const order = initial();
    expect(() => updateOrder(order, change("completed"))).toThrow();
    let current = updateOrder(order, change("confirmed"));
    current = updateOrder(current, change("preparing"));
    current = updateOrder(current, change("ready"));
    expect(nextStatuses(current)).toEqual(["completed", "cancelled"]);
    expect(() => updateOrder(current, change("completed"))).toThrow(/payment/i);
    current = updateOrder(current, { version: 3, note: "Cash verified", paymentStatus: "paid" });
    current = updateOrder(current, change("completed"));
    expect(nextStatuses(current)).toEqual([]);
    expect(order.status).toBe("pending-merchant-confirmation");
    expect(order.paymentStatus).toBe("unpaid");
    expect(Object.isFrozen(current)).toBe(true);
  });
  it("requires a delivery quote, preserves totals and uses delivery-only pickup status", () => {
    const order = createCheckoutOrder(items, { ...details, method: "delivery", address: "Jl. Test No. 10, Jakarta" }, metadata);
    expect(() => updateOrder(order, change("confirmed"))).toThrow(/fee/);
    let current = updateOrder(order, { ...change("confirmed"), deliveryFee: 10000 });
    expect(current.total).toBe(50000);
    expect(() => updateOrder(current, { version: 1, note: "", deliveryFee: 1 })).toThrow();
    current = updateOrder(current, change("preparing"));
    current = updateOrder(current, change("ready"));
    expect(nextStatuses(current)[0]).toBe("picked-up");
    expect(() => updateOrder(current, change("completed"))).toThrow();
  });
  it("rejects invalid fees, repeated payment, terminal edits, and cancellation without a reason", () => {
    const order = initial();
    expect(() => updateOrder(order, change("cancelled"))).toThrow(/reason/);
    const cancelled = updateOrder(order, { ...change("cancelled"), note: "Customer requested cancellation" });
    expect(() => updateOrder(cancelled, change("confirmed"))).toThrow(/closed/);
    expect(() => updateOrder(order, { version: 0, note: "", paymentStatus: "paid" })).toThrow();
    expect(() => updateOrder(order, { version: 0, note: "", deliveryFee: 1000 })).toThrow();
    const delivery = createCheckoutOrder(items, { ...details, method: "delivery", address: "Jl. Test No. 10, Jakarta" }, metadata);
    for (const deliveryFee of [-1, NaN, 0.5, 1000001]) expect(() => updateOrder(delivery, { ...change("confirmed"), deliveryFee })).toThrow();
    const confirmed = updateOrder(order, change("confirmed"));
    const paid = updateOrder(confirmed, { version: 1, note: "", paymentStatus: "paid" });
    expect(() => updateOrder(paid, { version: 2, note: "", paymentStatus: "paid" })).toThrow();
    expect(updateOrder(paid, { ...change("cancelled"), note: "Customer cancelled; refund handled separately" }).paymentStatus).toBe("paid");
  });
});

describe("untrusted checkout requests", () => {
  it("accepts selections and derives server prices, rejects client prices and forged products", () => {
    const input = { items: items.map(({ configuredProduct, quantity }) => ({ configuredProduct, quantity })), details };
    expect(serverOrder(checkoutInput.parse(input), metadata.id, metadata.createdAt).subtotal).toBe(40000);
    expect(checkoutInput.safeParse({ ...input, subtotal: 1 }).success).toBe(false);
    expect(checkoutInput.safeParse({ ...input, items: [{ ...input.items[0], unitPrice: 1 }] }).success).toBe(false);
    const rum = { ...input, items: [{ configuredProduct: { productId: "sugarcane-rum-250ml", configuration: { toppingIds: [] } }, quantity: 1 }] };
    expect(() => serverOrder(checkoutInput.parse(rum), metadata.id, metadata.createdAt)).toThrow();
  });
  it("rejects cross-origin writes, unconfigured origins, bad protocols and oversized streams", async () => {
    expect(appOrigin()).toBeNull();
    vi.stubEnv("APP_ORIGIN", "http://127.0.0.1:3200");
    const request = new Request("http://127.0.0.1:3200/api/orders", { method: "POST", headers: { origin: "https://evil.example" } });
    expect(() => requireOrigin(request)).toThrow(HttpError);
    vi.stubEnv("APP_ORIGIN", "http://example.com"); expect(appOrigin()).toBeNull();
    vi.stubEnv("APP_ORIGIN", "https://example.com"); expect(appOrigin()?.origin).toBe("https://example.com");
    const large = new Request("https://example.com", { method: "POST", headers: { "content-type": "application/json" }, body: "x".repeat(70000) });
    await expect(readJson(large, checkoutInput)).rejects.toMatchObject({ status: 413 });
    const invalid = new Request("https://example.com", { method: "POST", headers: { "content-type": "application/json" }, body: "{" });
    await expect(readJson(invalid, checkoutInput)).rejects.toMatchObject({ status: 400 });
  });
});

describe("admin credentials", () => {
  it("fails closed without configuration and verifies salted password hashes", () => {
    expect(adminConfigured()).toBe(false);
    const salt = randomBytes(16).toString("hex");
    vi.stubEnv("APP_ORIGIN", "http://127.0.0.1:3200");
    vi.stubEnv("ADMIN_USERNAME", "test-owner");
    vi.stubEnv("ADMIN_PASSWORD_HASH", `scrypt:${salt}:${scryptSync("test-password-long", salt, 64).toString("hex")}`);
    vi.stubEnv("ADMIN_SESSION_SECRET", "test-secret-with-at-least-thirty-two-characters");
    expect(adminConfigured()).toBe(true);
    expect(verifyAdmin("test-owner", "test-password-long")).toBe(true);
    expect(verifyAdmin("wrong", "test-password-long")).toBe(false);
    expect(verifyAdmin("test-owner", "wrong-password")).toBe(false);
    expect(verifyAdmin("test-owner", "x".repeat(129))).toBe(false);
  });
});
