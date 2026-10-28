"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Checkbox, Chip, Container, Divider, Drawer, FormControlLabel, IconButton, Stack, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StaffNavigation from "@/components/admin/StaffNavigation";
import OrderFiltersForm from "@/components/admin/OrderFilters";
import { orderQueryParams, parseOrderQuery, type OrderFilters } from "@/domain/order/query";
import { formatMoney } from "@/domain/money";
import { type ManagedOrder, type OrderUpdate, kitchenStatuses, nextStatuses, statusLabels } from "@/domain/order/lifecycle";

const displayDate = (value: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value)) + " WIB";

export default function OrderDashboard({ username, initialData, initialError, view = "orders" }: { username: string; initialData: { orders: ManagedOrder[]; total: number }; initialError: string; view?: "orders" | "kitchen" }) {
  const router = useRouter();
  const [orders, setOrders] = useState<ManagedOrder[]>(initialData.orders);
  const [selected, setSelected] = useState<ManagedOrder | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [draft, setDraft] = useState<OrderFilters>({});
  const [autoRefresh, setAutoRefresh] = useState(view === "kitchen");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialData.total);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [note, setNote] = useState("");
  const [fee, setFee] = useState("");
  const actionLock = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(filters);
  const fetchOrders = useCallback(async (nextPage: number, nextFilters: OrderFilters) => {
    abort.current = new AbortController();
    const response = await fetch(`/api/admin/orders?${orderQueryParams(nextPage, view, nextFilters)}`, { cache: "no-store", signal: abort.current.signal });
    if (response.status === 401) { router.replace("/admin/login"); throw new Error("Your session expired. Sign in again."); }
    const result = await response.json() as { orders: ManagedOrder[]; total: number; page: number; error?: string };
    if (!response.ok) throw new Error(result.error ?? "Unable to load orders.");
    return result;
  }, [router, view]);
  const applyListing = useCallback((result: { orders: ManagedOrder[]; total: number; page: number }, refreshSelected = true) => {
    setOrders(result.orders); setTotal(result.total); setPage(result.page); setLastUpdated(new Date().toISOString());
    if (refreshSelected) setSelected((previous) => previous ? result.orders.find((record) => record.order.id === previous.order.id) ?? null : null);
  }, []);
  const load = useCallback(async (nextPage = page, nextFilters = filters, background = false) => {
    if (actionLock.current) return;
    let normalized: OrderFilters;
    try { normalized = parseOrderQuery(orderQueryParams(nextPage, view, nextFilters)).filters; }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Review your filters."); return; }
    actionLock.current = true; setBusy(true);
    try {
      applyListing(await fetchOrders(nextPage, normalized), !background);
      setFilters(normalized); if (!background) setDraft(normalized); setError("");
    } catch (cause) { if (!(cause instanceof Error && cause.name === "AbortError")) setError(cause instanceof Error ? cause.message : "Unable to load orders."); }
    finally { actionLock.current = false; setBusy(false); }
  }, [applyListing, fetchOrders, filters, page, view]);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    if (!autoRefresh || selected || dirty) return;
    const refresh = () => { if (!document.hidden && !actionLock.current) void load(page, filters, true); };
    const timer = window.setInterval(refresh, 30_000);
    document.addEventListener("visibilitychange", refresh);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, [autoRefresh, selected, dirty, load, page, filters]);
  async function change(update: Omit<OrderUpdate, "version" | "note">) {
    if (!selected || actionLock.current) return;
    actionLock.current = true; setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/orders/${selected.order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...update, version: selected.version, note }) });
      const result = await response.json() as ManagedOrder & { error?: string };
      if (response.status === 401) { router.replace("/admin/login"); return; }
      if (!response.ok) { if (response.status === 409) applyListing(await fetchOrders(page, filters)); throw new Error(result.error ?? "Unable to change the order."); }
      if ((filters.status && result.order.status !== filters.status) || (filters.payment && result.order.paymentStatus !== filters.payment) || (view === "kitchen" && !kitchenStatuses.includes(result.order.status))) { setSelected(null); setOrders((previous) => previous.filter((entry) => entry.order.id !== result.order.id)); }
      else { setSelected(result); setOrders((previous) => previous.map((entry) => entry.order.id === result.order.id ? result : entry)); }
      setNote(""); setFee("");
      try { applyListing(await fetchOrders(page, filters)); }
      catch { setError("Order updated, but the list could not refresh. Refresh to check the latest list."); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to change the order."); }
    finally { actionLock.current = false; setBusy(false); }
  }
  async function logout() {
    if (actionLock.current) return;
    actionLock.current = true; setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to sign out. Please retry.");
      router.replace("/admin/login"); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to sign out."); setBusy(false); actionLock.current = false; }
  }
  return <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 }, overflowWrap: "anywhere" }}>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", mb: 4 }}>
      <Box><Typography variant="overline" color="primary">TEBU NAI · {username}</Typography><Typography component="h1" variant="h3" sx={{ fontSize: { xs: "2.2rem", md: "3rem" } }}>{view === "kitchen" ? "Kitchen queue" : "Orders"}</Typography></Box>
      <Stack direction="row" spacing={1}><Button onClick={() => void load()} disabled={busy}>Refresh</Button><Button onClick={logout} disabled={busy}>Sign out</Button></Stack>
    </Stack>
    <StaffNavigation active={view} />
    {view === "kitchen" && <Typography sx={{ mb: 3 }} color="text.primary">Confirmed, preparing and ready orders · oldest first.</Typography>}
    <FormControlLabel control={<Checkbox checked={autoRefresh} onChange={(event) => setAutoRefresh(event.target.checked)} />} label="Auto refresh every 30 seconds" />
    <Typography variant="body2" sx={{ mb: 3 }}>{autoRefresh && (selected || dirty) ? "Auto refresh paused while you edit." : autoRefresh ? "Auto refresh runs while this tab is visible." : "Auto refresh is off."} {lastUpdated ? `Last updated: ${displayDate(lastUpdated)}` : "Loaded with this page."}</Typography>
    {error && !selected && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
    <OrderFiltersForm value={draft} onChange={setDraft} onApply={() => void load(1, draft)} onReset={() => void load(1, {})} busy={busy} kitchen={view === "kitchen"} />
    <Typography role="status" color="text.primary" sx={{ mb: 2 }}>{busy ? "Loading…" : `${total} order${total === 1 ? "" : "s"}`}</Typography>
    <Stack spacing={2}>
      {!busy && orders.length === 0 && <Alert severity="info">No orders in this view yet.</Alert>}
      {orders.map((record) => <Box key={record.order.id} component="article" sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
          <Box><Typography component="h2" variant="h6">{record.order.customer.name}</Typography><Typography variant="body2" color="text.secondary">{displayDate(record.order.createdAt)} · {record.order.fulfillment.method}</Typography><Typography variant="body2" sx={{ overflowWrap: "anywhere" }}>Reference: {record.order.id}</Typography></Box>
          <Stack spacing={1}><Chip label={statusLabels[record.order.status]} /><Typography variant="body2">{record.order.paymentStatus === "paid" ? "Paid" : "Unpaid"} · {record.order.source === "counter" ? "Counter" : "Online"}</Typography><Typography sx={{ fontWeight: 700 }}>{record.order.total === null ? `${formatMoney(record.order.subtotal)} + delivery quote` : formatMoney(record.order.total)}</Typography><Button variant="outlined" disabled={busy} onClick={() => { setSelected(record); setNote(""); setFee(""); setError(""); }}>Manage order</Button></Stack>
        </Stack>
      </Box>)}
    </Stack>
    <Stack direction="row" spacing={2} sx={{ my: 3, alignItems: "center", justifyContent: "center" }}><Button disabled={page === 1 || busy} onClick={() => void load(page - 1)}>Previous</Button><Typography>Page {page}</Typography><Button disabled={page * 20 >= total || busy || page >= 1000} onClick={() => void load(page + 1)}>Next</Button></Stack>
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
