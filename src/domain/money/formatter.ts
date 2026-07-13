import { Money } from "./money";

/**
 * Format money into Indonesian Rupiah.
 *
 * Example:
 * 17000 -> "Rp 17.000"
 */
export function formatMoney(value: Money): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}
