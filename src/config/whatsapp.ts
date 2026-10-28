/**
 * Public merchant contact configuration. Set this before building the site.
 * There is deliberately no default phone number.
 */
export function normalizeMerchantNumber(value: string | undefined): string | null {
  const candidate = value?.trim() ?? "";
  if (!/^\+?[1-9][0-9 ()-]*$/.test(candidate)) return null;
  const digits = candidate.replace(/\D/g, "");
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}

export const WHATSAPP_NUMBER =
  normalizeMerchantNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ?? "";

export function createWhatsAppUrl(
  message?: string,
  merchantNumber: string = WHATSAPP_NUMBER,
): string | null {
  const number = normalizeMerchantNumber(merchantNumber);
  if (!number) return null;
  return "https://wa.me/" + number + (message ? "?text=" + encodeURIComponent(message) : "");
}

export const WHATSAPP_URL = createWhatsAppUrl();
