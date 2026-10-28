import { describe, expect, it } from "vitest";
import { counterOrder, posInput } from "@/lib/server/posInput";
import { serverOrder, checkoutInput } from "@/lib/server/orderInput";

const input = { name: "Walk-in customer", phone: "", notes: "Less ice", paymentReceived: false, items: [{ configuredProduct: { productId: "sugar-cane-juice", configuration: { packageId: "1500ml", toppingIds: ["lime", "ginger"] } }, quantity: 2 }] };
const timestamp = "2026-10-28T00:00:00.000Z";

describe("counter sales", () => {
  it("uses canonical pricing and permits a genuinely absent walk-in phone", () => {
    const order = counterOrder(posInput.parse(input), "counter-test", timestamp);
    expect(order).toMatchObject({ source: "counter", status: "confirmed", paymentStatus: "unpaid", subtotal: 90000, total: 90000, deliveryFee: 0, customer: { phone: "" }, fulfillment: { method: "pickup" } });
    expect(Object.isFrozen(order)).toBe(true);
  });
  it("records received payment only when explicitly requested", () => {
    expect(counterOrder(posInput.parse({ ...input, paymentReceived: true }), "paid", timestamp).paymentStatus).toBe("paid");
    expect(posInput.safeParse({ ...input, paymentReceived: "true" }).success).toBe(false);
  });
  it("rejects restricted products, malformed contact details and forged prices", () => {
    expect(() => counterOrder(posInput.parse({ ...input, phone: "made up" }), "bad", timestamp)).toThrow();
    expect(() => counterOrder(posInput.parse({ ...input, items: [{ configuredProduct: { productId: "sugarcane-rum-250ml", configuration: { toppingIds: [] } }, quantity: 1 }] }), "bad", timestamp)).toThrow();
    expect(posInput.safeParse({ ...input, total: 1 }).success).toBe(false);
    expect(posInput.safeParse({ ...input, status: "completed" }).success).toBe(false);
  });
  it("keeps online phone and merchant confirmation requirements", () => {
    const online = { items: input.items, details: { name: input.name, phone: "", method: "pickup" as const, address: "", notes: "" } };
    expect(() => serverOrder(checkoutInput.parse(online), "online", timestamp)).toThrow();
    expect(serverOrder(checkoutInput.parse({ ...online, details: { ...online.details, phone: "081234567890" } }), "online", timestamp)).toMatchObject({ status: "pending-merchant-confirmation", paymentStatus: "unpaid" });
    expect(checkoutInput.safeParse({ ...online, source: "counter" }).success).toBe(false);
  });
});
