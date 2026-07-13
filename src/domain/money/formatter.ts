import { Money } from "./money";

export function formatMoney(value: Money): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}
