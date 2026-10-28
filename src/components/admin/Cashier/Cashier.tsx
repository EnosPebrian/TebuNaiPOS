"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Checkbox, Container, Divider, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import { catalog } from "@/domain/catalog";
import { configuredProductFactory } from "@/domain/products";
import { createCartItem, useOrderContext } from "@/domain/order";
import type { Order } from "@/domain/order/Order";
import { formatMoney } from "@/domain/money";
import ProductConfigurator from "@/components/product/ProductConfigurator";
import QuantityStepper from "@/components/common/QuantityStepper";

const transactionKey = "tebunai-counter-request-v1";
type Product = ReturnType<typeof catalog.getProducts>[number];
type PendingRequest = { key: string; body: string };
const requestEvent = "tebunai-counter-request";
function subscribe(listener: () => void) {
  window.addEventListener(requestEvent, listener);
  window.addEventListener("storage", listener);
  return () => { window.removeEventListener(requestEvent, listener); window.removeEventListener("storage", listener); };
}
function readRequest() { try { return sessionStorage.getItem(transactionKey) ?? ""; } catch { return "unavailable"; } }
function writeRequest(request: PendingRequest | null) {
  if (request) sessionStorage.setItem(transactionKey, JSON.stringify(request));
  else sessionStorage.removeItem(transactionKey);
  window.dispatchEvent(new Event(requestEvent));
}

export default function Cashier({ username }: { username: string }) {
  const router = useRouter();
  const { order, subtotal, addItem, updateQuantity, removeItem, clearOrder, hydrated } = useOrderContext();
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("Walk-in customer");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paid, setPaid] = useState(false);
  const [busy, setBusy] = useState(false);
  const stored = useSyncExternalStore(subscribe, readRequest, () => null);
  const ready = stored !== null;
  let pending: PendingRequest | null = null;
  let storageError = "";
  try {
    if (stored) {
      const value = JSON.parse(stored);
      if (typeof value.key !== "string" || typeof value.body !== "string" || !/^[a-f0-9-]{36}$/i.test(value.key)) throw new Error("Invalid saved request");
      pending = { key: value.key, body: value.body };
    }
  } catch { storageError = "The saved counter request cannot be read. Reopen this screen in a new tab and check All orders before starting another sale."; }
  const [saved, setSaved] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  async function submit() {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError("");
    try {
      const request = pending ?? { key: crypto.randomUUID(), body: JSON.stringify({ items: order.items.map(({ configuredProduct, quantity }) => ({ configuredProduct, quantity })), name, phone, notes, paymentReceived: paid }) };
      writeRequest(request);
      const response = await fetch("/api/admin/pos", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": request.key }, body: request.body });
      if (response.status === 401) { router.replace("/admin/login"); return; }
      const result = await response.json() as { order?: Order; error?: string };
      if (!response.ok || !result.order) {
        // Validation failures cannot have created a sale; retain the editable basket.
        if (!pending && [400, 403, 413, 415].includes(response.status)) writeRequest(null);
        throw new Error(result.error ?? "Unable to save this sale. Retry this request before starting another.");
      }
      setSaved(result.order); clearOrder();
      // Keep the completed request until New sale is explicitly chosen. Reload/retry
      // safely returns the same canonical order, even if the response was lost.
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save. Retry this request."); }
    finally { inFlight.current = false; setBusy(false); }
  }

  function newSale() {
    try { writeRequest(null); } catch { setError("Allow browser storage before starting another sale."); return; }
    setSaved(null); setName("Walk-in customer"); setPhone(""); setNotes(""); setPaid(false); setError("");
  }

  const products = catalog.getProducts().filter((entry) => `${entry.name} ${entry.description}`.toLowerCase().includes(search.trim().toLowerCase()));
  const locked = busy || Boolean(pending) || !hydrated || !ready || Boolean(storageError);
  return <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, overflowWrap: "anywhere", "& .MuiInputLabel-root": { color: "text.primary" } }}>
    <Typography variant="overline" color="primary">TEBU NAI · {username}</Typography>
    <Typography component="h1" variant="h3" sx={{ fontSize: { xs: "2.2rem", md: "3rem" }, mb: 2 }}>Cashier</Typography>
    <Stack component="nav" aria-label="Staff navigation" direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 3 }}>
      <Button component={Link} href="/admin">All orders</Button><Button component={Link} href="/admin/kitchen">Kitchen queue</Button><Button component={Link} href="/admin/pos" variant="contained">Cashier</Button>
    </Stack>
    {(error || storageError) && <Alert severity="error" sx={{ mb: 2 }}>{error || storageError}</Alert>}
    {saved ? <Stack spacing={2}>
      <Alert severity="success">Sale saved. Follow fulfillment in All orders or Kitchen queue.</Alert>
      <Typography component="h2" variant="h5">{saved.customer.name}</Typography><Typography>Reference: {saved.id}</Typography>
      <Typography>Total: {formatMoney(saved.total ?? saved.subtotal)} · {saved.paymentStatus === "paid" ? "Paid — recorded by staff" : "Unpaid"}</Typography>
      <Button component="a" href={`/admin/orders/${saved.id}/print`} target="_blank" rel="noopener noreferrer" variant="outlined">Print order slip</Button>
      <Button onClick={newSale} variant="contained">New sale</Button>
    </Stack> : pending ? <Stack spacing={2}>
      <Alert severity="info">A counter request is saved on this device. Retry to recover its result before starting another sale. Retrying will not create a duplicate.</Alert>
      <Button onClick={() => void submit()} disabled={busy || !ready} variant="contained">{busy ? "Saving…" : "Retry saved request"}</Button>
    </Stack> : <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
      <Box component="section" aria-label="Products">
        <TextField label="Search products" value={search} onChange={(event) => setSearch(event.target.value)} fullWidth disabled={locked} sx={{ mb: 2 }} />
        <Stack spacing={2}>{products.map((entry) => <Box key={entry.id} component="article" sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3 }}>
          <Typography component="h2" variant="h6">{entry.name}</Typography><Typography sx={{ mb: 1 }}>{entry.description}</Typography>
          <Button variant="outlined" disabled={locked} aria-label={`${entry.packageIds.length ? "Configure" : "Add"} ${entry.name}`} onClick={() => {
            if (entry.packageIds.length) setProduct(entry);
            else try { addItem(createCartItem(configuredProductFactory.createEmpty(entry.id), 1)); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to add item."); }
          }}>{entry.packageIds.length ? "Configure bottle" : `Add · ${formatMoney(entry.price ?? 0)}`}</Button>
        </Box>)}</Stack>
        {products.length === 0 && <Typography role="status">No matching products.</Typography>}
      </Box>
      <Stack component="section" aria-label="Counter basket" spacing={2}>
        <Typography component="h2" variant="h5">Counter basket</Typography>
        {!order.items.length && <Typography>Add products to start a sale.</Typography>}
        {order.items.map((item) => <Box key={item.id} component="article" sx={{ pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography component="h3" variant="h6">{item.productName}</Typography><Typography>{item.variantLabel} · {formatMoney(item.unitPrice)} each</Typography>
          <QuantityStepper value={item.quantity} onChange={(quantity) => updateQuantity(item.id, quantity)} />
          <Button disabled={locked} onClick={() => removeItem(item.id)} aria-label={`Remove ${item.productName}`}>Remove</Button>
        </Box>)}
        <Typography sx={{ fontWeight: 700 }} aria-live="polite">Total: {formatMoney(subtotal)}</Typography><Divider />
        <TextField label="Customer / pickup name" value={name} onChange={(event) => setName(event.target.value)} disabled={locked} slotProps={{ htmlInput: { maxLength: 100 } }} required />
        <TextField label="Phone (optional)" value={phone} onChange={(event) => setPhone(event.target.value)} disabled={locked} slotProps={{ htmlInput: { maxLength: 30, inputMode: "tel" } }} />
        <TextField label="Order notes" value={notes} onChange={(event) => setNotes(event.target.value)} disabled={locked} multiline minRows={2} slotProps={{ htmlInput: { maxLength: 500 } }} />
        <FormControlLabel control={<Checkbox checked={paid} onChange={(event) => setPaid(event.target.checked)} disabled={locked} />} label="I have received payment" />
        <Typography variant="body2">Pickup only. Record payment only after receiving it. Saving accepts the sale into the kitchen queue; it does not charge a customer.</Typography>
        <Button variant="contained" disabled={locked || !order.items.length || name.trim().length < 2} onClick={() => void submit()}>Save counter sale</Button>
      </Stack>
    </Box>}
    {product && <ProductConfigurator open onClose={() => setProduct(null)} product={product} configuredProduct={configuredProductFactory.createEmpty(product.id)} />}
  </Container>;
}
