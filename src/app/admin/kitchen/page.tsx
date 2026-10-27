import { redirect } from "next/navigation";
import { currentAdmin } from "@/lib/server/admin";
import { orderRepository } from "@/lib/server/mongoOrderRepository";
import type { ManagedOrder } from "@/domain/order/lifecycle";
import OrderDashboard from "@/components/admin/OrderDashboard";

export default async function KitchenPage() {
  const username = await currentAdmin();
  if (!username) redirect("/admin/login");
  let initialData: { orders: ManagedOrder[]; total: number } = { orders: [], total: 0 };
  let initialError = "";
  try { initialData = await orderRepository.list(1, undefined, "kitchen"); } catch { initialError = "The order database is unavailable. Please retry shortly."; }
  return <main id="main-content" tabIndex={-1}><OrderDashboard username={username} initialData={initialData} initialError={initialError} view="kitchen" /></main>;
}
