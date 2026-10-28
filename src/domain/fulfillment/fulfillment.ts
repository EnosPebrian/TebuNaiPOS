export interface DeliveryDriver { readonly name: string; readonly phone: string }

export function normalizeDeliveryDriver(driver: DeliveryDriver): DeliveryDriver {
  const name = driver.name.trim().replace(/\s+/g, " ");
  const phone = driver.phone.trim();
  if (name.length < 2 || name.length > 100 || /[\u0000-\u001f\u007f]/.test(driver.name)) throw new Error("Enter a driver name using 2 to 100 characters.");
  if (phone && (!/^\+?[0-9][0-9 ()-]*$/.test(phone) || !/^\d{8,15}$/.test(phone.replace(/\D/g, "")))) throw new Error("Enter a valid driver phone using 8 to 15 digits, or leave it blank.");
  return Object.freeze({ name, phone });
}

export type Fulfillment =
  | { readonly method: "pickup" }
  | { readonly method: "delivery"; readonly address: string; readonly driver?: DeliveryDriver };
