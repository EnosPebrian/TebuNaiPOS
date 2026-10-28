import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/server/admin";
import { OrderProvider } from "@/domain/order";
import Cashier from "@/components/admin/Cashier/Cashier";

export default async function PosPage() {
  const username = await currentAdmin();
  if (!username) redirect("/admin/login");
  return <main id="main-content" tabIndex={-1}><OrderProvider storageKey="tebunai-counter-cart-v1"><Cashier username={username} /></OrderProvider></main>;
}
