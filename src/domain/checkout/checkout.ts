import type { Customer } from "@/domain/customer/customer";
import type { Fulfillment } from "@/domain/fulfillment/fulfillment";
import { repriceCartItems } from "@/domain/order/cart";
import type { Order } from "@/domain/order/Order";
import type { OrderItem } from "@/domain/order/types";
import { formatMoney } from "@/domain/money";

export interface CheckoutDetails {
  name: string;
  phone: string;
  method: "pickup" | "delivery";
  address: string;
  notes: string;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutDetails, string>>;

function cleanText(value: string): string {
  return Array.from(value.trim())
    .filter((character) => character === "\n" || character === "\t" || (character.charCodeAt(0) >= 32 && character.charCodeAt(0) !== 127))
    .join("");
}

function cleanName(value: string): string {
  return cleanText(value).replace(/\s+/g, " ");
}

export function validateCheckoutDetails(details: CheckoutDetails): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const name = cleanName(details.name);
  const phone = details.phone.trim();
  if (name.length < 2 || name.length > 100) {
    errors.name = "Enter your name using 2 to 100 characters.";
  }
  if (!/^\+?[0-9][0-9 ()-]*$/.test(phone) || !/^\d{8,15}$/.test(phone.replace(/\D/g, ""))) {
    errors.phone = "Enter a valid phone number using 8 to 15 digits.";
  }
  if (details.method !== "pickup" && details.method !== "delivery") {
    errors.method = "Choose pickup or delivery.";
  }
  if (details.method === "delivery" && (cleanText(details.address).length < 10 || details.address.length > 500)) {
    errors.address = "Enter a full delivery address using 10 to 500 characters.";
  }
  if (details.notes.length > 500) {
    errors.notes = "Keep order notes to 500 characters.";
  }
  return errors;
}

export function createCheckoutOrder(
  items: readonly OrderItem[],
  details: CheckoutDetails,
  metadata: { id: string; createdAt: string },
): Order {
  if (Object.keys(validateCheckoutDetails(details)).length) {
    throw new Error("Check the customer and delivery details before continuing.");
  }
  if (!items.length) throw new Error("Add an item to your cart before checkout.");
  const repricedItems = repriceCartItems(items);
  const frozenItems = Object.freeze(repricedItems.map((item) => Object.freeze({
    ...item,
    configuredProduct: Object.freeze({
      ...item.configuredProduct,
      configuration: Object.freeze({
        ...item.configuredProduct.configuration,
        toppingIds: Object.freeze([...item.configuredProduct.configuration.toppingIds]),
      }),
    }),
  })));
  const customer: Customer = Object.freeze({
    name: cleanName(details.name),
    phone: details.phone.trim(),
  });
  const fulfillment: Fulfillment = details.method === "pickup"
    ? Object.freeze({ method: "pickup" })
    : Object.freeze({ method: "delivery", address: cleanText(details.address) });
  const subtotal = repricedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return Object.freeze({
    ...metadata,
    customer,
    fulfillment,
    notes: cleanText(details.notes),
    items: frozenItems,
    subtotal,
    deliveryFee: fulfillment.method === "pickup" ? 0 : null,
    total: fulfillment.method === "pickup" ? subtotal : null,
    status: "pending-merchant-confirmation",
    paymentStatus: "unpaid",
  });
}

export function buildWhatsAppOrderMessage(order: Order, merchantName: string): string {
  return [
    "*Order request — " + merchantName + "*",
    "Reference: " + order.id,
    "Prepared: " + order.createdAt,
    "",
    "Name: " + order.customer.name,
    "Phone: " + order.customer.phone,
    "Fulfillment: " + (order.fulfillment.method === "pickup" ? "Pickup" : "Delivery"),
    ...(order.fulfillment.method === "delivery" ? ["Address: " + order.fulfillment.address] : []),
    ...(order.notes ? ["Notes: " + order.notes] : []),
    "",
    "*Items*",
    ...order.items.map((item, index) => [
      (index + 1) + ". " + item.productName + " × " + item.quantity,
      "   " + item.variantLabel,
      "   " + formatMoney(item.unitPrice) + " each · " + formatMoney(item.unitPrice * item.quantity),
    ].join("\n")),
    "",
    "Items subtotal: " + formatMoney(order.subtotal),
    "Delivery fee: " + (order.deliveryFee === null ? "To be quoted by merchant" : formatMoney(order.deliveryFee)),
    order.total === null
      ? "Final total: Pending delivery quote and merchant confirmation"
      : "Total: " + formatMoney(order.total),
    "",
    "Please confirm availability, fulfillment details and payment instructions.",
    "This is an unpaid order request, pending merchant confirmation.",
  ].join("\n");
}
