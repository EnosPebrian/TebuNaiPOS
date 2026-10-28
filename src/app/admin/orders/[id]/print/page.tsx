import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { currentAdmin } from "@/lib/server/admin";
import { orderRepository } from "@/lib/server/mongoOrderRepository";
import { formatMoney } from "@/domain/money";
import { statusLabels } from "@/domain/order/lifecycle";
import { siteConfig } from "@/config/site";
import PrintOrderButton from "@/components/admin/PrintOrderButton";
import styles from "./print.module.css";

export default async function PrintOrderPage({ params }: { params: Promise<{ id: string }> }) {
  if (!await currentAdmin()) redirect("/admin/login");
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/i.test(id)) notFound();
  const record = await orderRepository.get(id);
  if (!record) notFound();
  const { order } = record;
  const date = new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(order.createdAt));
  return <main id="main-content" tabIndex={-1} className={styles.page}>
    <div className={styles.toolbar}><Link href="/admin">Back to orders</Link><PrintOrderButton /></div>
    <article className={styles.slip} aria-label="Order slip">
      <p>{siteConfig.name}</p><h1>Order slip</h1>
      <p>Reference: {order.id}<br />{date} WIB</p>
      {order.source === "counter" && <p>Counter sale · pickup</p>}
      <p><strong>Status:</strong> {statusLabels[order.status]}<br /><strong>Payment:</strong> {order.paymentStatus === "paid" ? "Paid — recorded by staff" : "Unpaid"}</p>
      {order.status === "pending-merchant-confirmation" && <p>Order request — awaiting merchant confirmation.</p>}
      {order.status === "cancelled" && <p>Cancelled order. Any refund must be handled separately.</p>}
      <h2>Customer and fulfillment</h2><p>{order.customer.name}<br />{order.customer.phone}<br />{order.fulfillment.method === "pickup" ? "Pickup" : "Delivery"}</p>
      {order.fulfillment.method === "delivery" && <p style={{ whiteSpace: "pre-wrap" }}>{order.fulfillment.address}</p>}
      {order.notes && <p style={{ whiteSpace: "pre-wrap" }}>Notes: {order.notes}</p>}
      <table className={styles.lines}><thead><tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Amount</th></tr></thead><tbody>{order.items.map((item) => <tr key={item.id}><td><strong>{item.productName}</strong><br />{item.variantLabel}<br />{formatMoney(item.unitPrice)} each</td><td>{item.quantity}</td><td>{formatMoney(item.quantity * item.unitPrice)}</td></tr>)}</tbody></table>
      <div className={styles.summary}><span>Items subtotal</span><span>{formatMoney(order.subtotal)}</span></div>
      <div className={styles.summary}><span>Delivery fee</span><span>{order.deliveryFee === null ? "To be quoted" : formatMoney(order.deliveryFee)}</span></div>
      <div className={styles.summary}><strong>Total</strong><strong>{order.total === null ? "Pending delivery quote" : formatMoney(order.total)}</strong></div>
      <p>All amounts are in Indonesian rupiah (IDR). Payment records are entered by staff; this slip does not collect a payment.</p>
    </article>
  </main>;
}
