"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Chip, Container, Divider, Drawer, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { formatMoney } from "@/domain/money";
import { type ManagedOrder, type OrderStatus, type OrderUpdate, kitchenStatuses, nextStatuses, orderStatuses, statusLabels } from "@/domain/order/lifecycle";

const displayDate = (value: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value)) + " WIB";

export default function OrderDashboard({ username, initialData, initialError, view = "orders" }: { username: string; initialData: { orders: ManagedOrder[]; total: number }; initialError: string; view?: "orders" | "kitchen" }) {
  const router = useRouter();
  const [orders, setOrders] = useState<ManagedOrder[]>(initialData.orders);
  const [selected, setSelected] = useState<ManagedOrder | null>(null);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialData.total);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [note, setNote] = useState("");
  const [fee, setFee] = useState("");
  async function load(nextPage = page, nextStatus = status) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/orders?page=${nextPage}&status=${nextStatus}&view=${view}`, { cache: "no-store" });
      if (response.status === 401) { router.replace("/admin/login"); return; }
      const result = await response.json() as { orders: ManagedOrder[]; total: number; error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to load orders.");
      setOrders(result.orders); setTotal(result.total);
      setSelected((previous) => previous ? result.orders.find((record) => record.order.id === previous.order.id) ?? null : null);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load orders."); }
    finally { setBusy(false); }
  }
  async function change(update: Omit<OrderUpdate, "version" | "note">) {
    if (!selected) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/orders/${selected.order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...update, version: selected.version, note }) });
      const result = await response.json() as ManagedOrder & { error?: string };
      if (response.status === 401) { router.replace("/admin/login"); return; }
      if (!response.ok) { if (response.status === 409) await load(); throw new Error(result.error ?? "Unable to change the order."); }
      if ((status && result.order.status !== status) || (view === "kitchen" && !kitchenStatuses.includes(result.order.status))) { setSelected(null); setOrders((previous) => previous.filter((entry) => entry.order.id !== result.order.id)); setTotal((previous) => previous - 1); }
      else { setSelected(result); setOrders((previous) => previous.map((entry) => entry.order.id === result.order.id ? result : entry)); }
      setNote(""); setFee("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to change the order."); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to sign out. Please retry.");
      router.replace("/admin/login"); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to sign out."); setBusy(false); }
  }
  return <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 }, overflowWrap: "anywhere" }}>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", mb: 4 }}>
      <Box><Typography variant="overline" color="primary">TEBU NAI · {username}</Typography><Typography component="h1" variant="h3" sx={{ fontSize: { xs: "2.2rem", md: "3rem" } }}>{view === "kitchen" ? "Kitchen queue" : "Orders"}</Typography></Box>
      <Stack direction="row" spacing={1}><Button onClick={() => { setBusy(true); setError(""); void load(); }} disabled={busy}>Refresh</Button><Button onClick={logout} disabled={busy}>Sign out</Button></Stack>
    </Stack>
    <Stack component="nav" aria-label="Staff navigation" direction="row" spacing={1} useFlexGap sx={{ mb: 3, flexWrap: "wrap" }}><Button component={Link} href="/admin" variant={view === "orders" ? "contained" : "outlined"}>All orders</Button><Button component={Link} href="/admin/kitchen" variant={view === "kitchen" ? "contained" : "outlined"}>Kitchen queue</Button><Button component={Link} href="/admin/pos" variant="outlined">Cashier</Button></Stack>
    {view === "kitchen" && <Typography sx={{ mb: 3 }} color="text.primary">Confirmed, preparing and ready orders · oldest first. Refresh to see new work.</Typography>}
    {error && !selected && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" }, mb: 3 }}>
      <FormControl sx={{ minWidth: 240 }}><InputLabel id="status-filter" sx={{ color: "text.primary" }}>Order status</InputLabel><Select labelId="status-filter" label="Order status" value={status} disabled={busy} onChange={(event) => { const value = event.target.value as OrderStatus | ""; setStatus(value); setPage(1); void load(1, value); }}><MenuItem value="">{view === "kitchen" ? "All active orders" : "All orders"}</MenuItem>{(view === "kitchen" ? kitchenStatuses : orderStatuses).map((value) => <MenuItem key={value} value={value}>{statusLabels[value]}</MenuItem>)}</Select></FormControl>
      <Typography role="status" color="text.primary">{busy ? "Loading…" : `${total} order${total === 1 ? "" : "s"}`}</Typography>
    </Stack>
    <Stack spacing={2}>
      {!busy && orders.length === 0 && <Alert severity="info">No orders in this view yet.</Alert>}
      {orders.map((record) => <Box key={record.order.id} component="article" sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
          <Box><Typography component="h2" variant="h6">{record.order.customer.name}</Typography><Typography variant="body2" color="text.secondary">{displayDate(record.order.createdAt)} · {record.order.fulfillment.method}</Typography><Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>Reference: {record.order.id}</Typography></Box>
          <Stack spacing={1}><Chip label={statusLabels[record.order.status]} /><Typography sx={{ fontWeight: 700 }}>{record.order.total === null ? `${formatMoney(record.order.subtotal)} + delivery quote` : formatMoney(record.order.total)}</Typography><Button variant="outlined" onClick={() => { setSelected(record); setNote(""); setFee(""); setError(""); }}>Manage order</Button></Stack>
        </Stack>
      </Box>)}
    </Stack>
    <Stack direction="row" spacing={2} sx={{ my: 3, alignItems: "center", justifyContent: "center" }}><Button disabled={page === 1 || busy} onClick={() => { setPage(page - 1); void load(page - 1); }}>Previous</Button><Typography>Page {page}</Typography><Button disabled={page * 20 >= total || busy} onClick={() => { setPage(page + 1); void load(page + 1); }}>Next</Button></Stack>
    <Drawer anchor="right" open={Boolean(selected)} onClose={() => !busy && setSelected(null)} slotProps={{ paper: { role: "dialog", "aria-modal": true, "aria-labelledby": "admin-order-title", sx: { width: { xs: "100%", sm: 560 } } } }}>
      {selected && <Stack spacing={2.5} sx={{ p: { xs: 3, sm: 4 }, pb: 5, overflowWrap: "anywhere" }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}><Typography component="h2" variant="h4" id="admin-order-title">Order details</Typography><IconButton aria-label="Close order details" onClick={() => setSelected(null)} disabled={busy}><CloseIcon /></IconButton></Stack>
        {error && <Alert severity="error">{error}</Alert>}
        <Typography sx={{ overflowWrap: "anywhere" }}>Reference: {selected.order.id}</Typography><Chip label={statusLabels[selected.order.status]} />
        {selected.order.source === "counter" && <Typography>Created at the counter</Typography>}
        <Button component="a" href={`/admin/orders/${selected.order.id}/print`} target="_blank" rel="noopener noreferrer" variant="outlined">Print order slip</Button>
        <Box><Typography component="h3" variant="h6">{selected.order.customer.name}</Typography><Typography>{selected.order.customer.phone}</Typography><Typography>Fulfillment: {selected.order.fulfillment.method}</Typography>{selected.order.fulfillment.method === "delivery" && <Typography sx={{ whiteSpace: "pre-wrap" }}>{selected.order.fulfillment.address}</Typography>}{selected.order.notes && <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>Notes: {selected.order.notes}</Typography>}</Box>
        <Divider />
        {selected.order.items.map((item) => <Box key={item.id}><Typography sx={{ fontWeight: 700 }}>{item.productName} × {item.quantity}</Typography><Typography variant="body2">{item.variantLabel}</Typography><Typography>{formatMoney(item.unitPrice)} each · {formatMoney(item.unitPrice * item.quantity)}</Typography></Box>)}
        <Divider /><Typography>Items subtotal: {formatMoney(selected.order.subtotal)}</Typography><Typography>Delivery fee: {selected.order.deliveryFee === null ? "Not quoted" : formatMoney(selected.order.deliveryFee)}</Typography><Typography sx={{ fontWeight: 700 }}>Total: {selected.order.total === null ? "Pending delivery quote" : formatMoney(selected.order.total)}</Typography><Typography>Payment: {selected.order.paymentStatus}</Typography>
        {nextStatuses(selected.order).length > 0 && <>
          {selected.order.status === "pending-merchant-confirmation" && selected.order.fulfillment.method === "delivery" && <TextField label="Delivery fee (IDR)" value={fee} type="number" onChange={(event) => setFee(event.target.value)} slotProps={{ htmlInput: { min: 0, max: 1000000, step: 1 } }} disabled={busy} helperText="Confirm the quote with the customer before confirming this order." />}
          <TextField label="Staff note" value={note} multiline minRows={2} onChange={(event) => setNote(event.target.value)} disabled={busy} slotProps={{ htmlInput: { maxLength: 500 } }} helperText="A reason is required for cancellation. Notes are kept in the order history." />
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>{nextStatuses(selected.order).map((value) => <Button key={value} variant={value === "cancelled" ? "outlined" : "contained"} color={value === "cancelled" ? "error" : "primary"} disabled={busy} onClick={() => void change({ status: value, ...(value === "confirmed" && fee !== "" ? { deliveryFee: Number(fee) } : {}) })}>{value === "cancelled" ? "Cancel order" : `Mark ${statusLabels[value].toLowerCase()}`}</Button>)}</Stack>
          {selected.order.paymentStatus === "unpaid" && selected.order.status !== "pending-merchant-confirmation" && <Button variant="outlined" disabled={busy} onClick={() => void change({ paymentStatus: "paid" })}>Record payment received</Button>}
          <Typography variant="body2" color="text.secondary">Payment recording is manual. It does not charge a customer or issue a refund.</Typography>
        </>}
        <Divider /><Typography component="h3" variant="h6">Order history</Typography>
        {[...selected.history].reverse().map((event, index) => <Box key={`${event.at}-${index}`}><Typography variant="body2" sx={{ fontWeight: 700 }}>{statusLabels[event.status]} · {event.paymentStatus}</Typography><Typography variant="body2" color="text.secondary">{event.actor} · {displayDate(event.at)}</Typography>{event.note && <Typography variant="body2">{event.note}</Typography>}</Box>)}
      </Stack>}
    </Drawer>
  </Container>;
}
