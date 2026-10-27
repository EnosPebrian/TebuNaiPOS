import { describe, expect, it } from "vitest";

import { createWhatsAppUrl, normalizeMerchantNumber } from "@/config/whatsapp";
import {
  buildWhatsAppOrderMessage,
  type CheckoutDetails,
  createCheckoutOrder,
  validateCheckoutDetails,
} from "@/domain/checkout";
import { createCartItem } from "@/domain/order/cart";

const details: CheckoutDetails = {
  name: "Test Customer",
  phone: "+62 812 0000 0000",
  method: "pickup",
  address: "",
  notes: "",
};
const metadata = { id: "test-order-001", createdAt: "2026-10-27T00:00:00.000Z" };

function juiceItem() {
  return createCartItem({
    productId: "sugar-cane-juice",
    configuration: { packageId: "500ml", toppingIds: ["lemon", "ginger"] },
  }, 2);
}

describe("checkout validation", () => {
  it("accepts pickup without a delivery address", () => {
    expect(validateCheckoutDetails(details)).toEqual({});
  });

  it.each(["", " ", "A", "a".repeat(101)])("rejects invalid customer name %j", (name) => {
    expect(validateCheckoutDetails({ ...details, name }).name).toBeDefined();
  });

  it.each(["", "123", "abcdefgh", "+62<script>12345678", "1".repeat(16)])("rejects invalid phone %j", (phone) => {
    expect(validateCheckoutDetails({ ...details, phone }).phone).toBeDefined();
  });

  it("requires a complete delivery address and rejects oversized notes", () => {
    expect(validateCheckoutDetails({ ...details, method: "delivery", address: "" }).address).toBeDefined();
    expect(validateCheckoutDetails({ ...details, method: "delivery", address: "Jl. Test No. 10, Jakarta" })).toEqual({});
    expect(validateCheckoutDetails({ ...details, notes: "x".repeat(501) }).notes).toBeDefined();
  });
});

describe("immutable checkout Order", () => {
  it("reprices tampered input and captures independent immutable data", () => {
    const item = { ...juiceItem(), unitPrice: 1, productName: "tampered" };
    const result = createCheckoutOrder([item], details, metadata);
    expect(result.items[0].unitPrice).toBe(23000);
    expect(result.items[0].productName).not.toBe("tampered");
    expect(result.subtotal).toBe(46000);
    expect(result.deliveryFee).toBe(0);
    expect(result.total).toBe(46000);
    expect(result.paymentStatus).toBe("unpaid");
    expect(result.status).toBe("pending-merchant-confirmation");
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.items)).toBe(true);
    expect(Object.isFrozen(result.items[0])).toBe(true);
    expect(Object.isFrozen(result.items[0].configuredProduct.configuration.toppingIds)).toBe(true);
    item.quantity = 3;
    expect(result.items[0].quantity).toBe(2);
  });

  it("leaves delivery price and final total unquoted rather than inventing a fee", () => {
    const result = createCheckoutOrder([juiceItem()], {
      ...details,
      method: "delivery",
      address: "Jl. Test No. 10, Jakarta",
    }, metadata);
    expect(result.subtotal).toBe(46000);
    expect(result.deliveryFee).toBeNull();
    expect(result.total).toBeNull();
  });

  it("rejects empty carts and invalid details", () => {
    expect(() => createCheckoutOrder([], details, metadata)).toThrow();
    expect(() => createCheckoutOrder([juiceItem()], { ...details, name: "" }, metadata)).toThrow();
  });

  it("rejects crafted alcohol orders at checkout", () => {
    const forged = {
      ...juiceItem(),
      configuredProduct: {
        productId: "sugarcane-rum-250ml",
        configuration: { toppingIds: [] },
      },
    };
    expect(() => createCheckoutOrder([forged], details, metadata)).toThrow();
  });
});

describe("WhatsApp handoff", () => {
  it("includes item quantities, package, toppings, prices and customer fulfillment in the request", () => {
    const order = createCheckoutOrder([juiceItem()], {
      ...details,
      method: "delivery",
      address: "Jl. Test No. 10, Jakarta",
      notes: "No ice & thank you",
    }, metadata);
    const message = buildWhatsAppOrderMessage(order, "Tebu Nai");
    expect(message).toContain("Test Customer");
    expect(message).toContain("Jl. Test No. 10, Jakarta");
    expect(message).toContain("500");
    expect(message).toContain("Lemon");
    expect(message).toContain("Ginger");
    expect(message).toContain("× 2");
    expect(message).toContain("Rp 23.000");
    expect(message).toContain("Rp 46.000");
    expect(message).toContain("Delivery fee: To be quoted by merchant");
    expect(message).toContain("unpaid order request");
  });

  it("safely encodes the entire message into a link using only the configured number", () => {
    // Synthetic test contact, never configured in the app or opened by this test.
    const number = "15555550100";
    const message = "Test & café\nline two? #order";
    const url = createWhatsAppUrl(message, number)!;
    expect(url).toBe("https://wa.me/" + number + "?text=" + encodeURIComponent(message));
    expect(new URL(url).searchParams.get("text")).toBe(message);
  });

  it.each(["", " ", "0", "08123456789", "not-a-phone", "https://example.com", "1".repeat(16)])("disables absent or invalid merchant contact %j", (number) => {
    expect(normalizeMerchantNumber(number)).toBeNull();
    expect(createWhatsAppUrl("order", number)).toBeNull();
  });

  it("normalizes explicitly supplied international formatting", () => {
    expect(normalizeMerchantNumber("+1 (555) 555-0100")).toBe("15555550100");
    expect(normalizeMerchantNumber(undefined)).toBeNull();
  });
});
