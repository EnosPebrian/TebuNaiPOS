"use client";

import Link from "next/link";
import { type FormEvent, useMemo, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { siteConfig } from "@/config/site";
import { createWhatsAppUrl, WHATSAPP_URL } from "@/config/whatsapp";
import {
  buildWhatsAppOrderMessage,
  type CheckoutDetails,
  type CheckoutErrors,
  createCheckoutOrder,
  validateCheckoutDetails,
} from "@/domain/checkout";
import { formatMoney } from "@/domain/money";
import { repriceCartItems, useOrderContext } from "@/domain/order";
import type { Order } from "@/domain/order/Order";

const initialDetails: CheckoutDetails = {
  name: "",
  phone: "",
  method: "pickup",
  address: "",
  notes: "",
};

const cardStyles = {
  p: { xs: 3, md: 4 },
  bgcolor: "background.paper",
  borderRadius: 4,
  border: "1px solid",
  borderColor: "divider",
};

export default function CheckoutForm({ saveOrders = false }: { saveOrders?: boolean }) {
  const { order, hydrated } = useOrderContext();
  const [details, setDetails] = useState<CheckoutDetails>(initialDetails);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const requestKey = useRef({ signature: "", key: "" });
  const [prepared, setPrepared] = useState<{ order: Order; signature: string } | null>(null);

  const pricedCart = useMemo(() => {
    try {
      const items = repriceCartItems(order.items);
      return {
        items,
        subtotal: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
        error: "",
      };
    } catch (error) {
      return {
        items: [],
        subtotal: 0,
        error: error instanceof Error ? error.message : "Your cart needs to be reviewed.",
      };
    }
  }, [order.items]);

  const signature = JSON.stringify({ items: order.items, details });
  const preparedOrder = prepared?.signature === signature ? prepared.order : null;
  const message = preparedOrder ? buildWhatsAppOrderMessage(preparedOrder, siteConfig.name) : "";
  const handoffUrl = preparedOrder ? createWhatsAppUrl(message) : null;

  const update = <Field extends keyof CheckoutDetails>(field: Field, value: CheckoutDetails[Field]) => {
    setDetails((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setSubmitError("");
    setPrepared(null);
    setCopyStatus("");
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyStatus("Message copied. Open the store chat and paste it before sending.");
    } catch {
      setCopyStatus("Copy is unavailable in this browser. Expand the preview and select its text to copy it manually.");
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateCheckoutDetails(details);
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById("checkout-" + firstField)?.focus();
      return;
    }
    try {
      let snapshot = createCheckoutOrder(order.items, details, {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      });
      if (saveOrders) {
        setSaving(true);
        if (requestKey.current.signature !== signature) requestKey.current = { signature, key: crypto.randomUUID() };
        const response = await fetch("/api/orders", {
          method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestKey.current.key },
          body: JSON.stringify({ items: order.items.map(({ configuredProduct, quantity }) => ({ configuredProduct, quantity })), details }),
        });
        const result = await response.json() as { order?: Order; error?: string };
        if (!response.ok || !result.order) throw new Error(result.error ?? "Unable to save the order. Please retry; your cart is still available.");
        snapshot = result.order;
      }
      setPrepared({ order: snapshot, signature });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to prepare this order. Please review your cart.");
    } finally {
      setSaving(false);
    }
  };

  if (!hydrated) {
    return (
      <Container maxWidth="sm" sx={{ py: 12 }}>
        <Typography role="status">Loading your cart…</Typography>
      </Container>
    );
  }

  if (order.items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 7, md: 12 } }}>
        <Stack spacing={3} sx={{ ...cardStyles, textAlign: "center" }}>
          <Typography component="h1" variant="h3">Your cart is empty</Typography>
          <Typography color="text.secondary">Choose your drinks, meals or snacks before checkout.</Typography>
          <Button component={Link} href="/#menu" variant="contained">Browse the menu</Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Button component={Link} href="/#menu" sx={{ mb: 3 }}>← Continue shopping</Button>
      <Box
        component="form"
        noValidate
        onSubmit={submit}
        sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.15fr 1fr" }, gap: { xs: 3, md: 4 } }}
      >
        <Stack component="fieldset" disabled={saving} spacing={3} sx={{ ...cardStyles, m: 0, minWidth: 0 }}>
          <Box>
            <Typography component="h1" variant="h3" sx={{ fontWeight: 700, fontSize: { xs: "2rem", md: "2.5rem" } }}>Checkout</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Prepare your order request, then send it through WhatsApp.</Typography>
          </Box>
          {!WHATSAPP_URL && (
            <Alert severity="warning">WhatsApp ordering is temporarily unavailable. You can review your cart, but the store must configure its contact number before you can send an order.</Alert>
          )}
          <TextField
            id="checkout-name"
            label="Customer name"
            value={details.name}
            onChange={(event) => update("name", event.target.value)}
            required
            fullWidth
            autoComplete="name"
            error={Boolean(errors.name)}
            helperText={errors.name}
            slotProps={{ htmlInput: { maxLength: 100 } }}
          />
          <TextField
            id="checkout-phone"
            label="Phone number"
            value={details.phone}
            onChange={(event) => update("phone", event.target.value)}
            required
            fullWidth
            type="tel"
            autoComplete="tel"
            error={Boolean(errors.phone)}
            helperText={errors.phone ?? "Use a number where the store can reach you."}
            slotProps={{ htmlInput: { maxLength: 30 } }}
          />
          <FormControl component="fieldset" error={Boolean(errors.method)}>
            <FormLabel component="legend" id="checkout-fulfillment-label">Fulfillment</FormLabel>
            <RadioGroup
              row
              aria-labelledby="checkout-fulfillment-label"
              value={details.method}
              onChange={(event) => update("method", event.target.value === "delivery" ? "delivery" : "pickup")}
            >
              <FormControlLabel value="pickup" control={<Radio />} label="Pickup" />
              <FormControlLabel value="delivery" control={<Radio />} label="Delivery" />
            </RadioGroup>
          </FormControl>
          {details.method === "delivery" && (
            <>
              <TextField
                id="checkout-address"
                label="Delivery address"
                value={details.address}
                onChange={(event) => update("address", event.target.value)}
                required
                fullWidth
                multiline
                minRows={3}
                autoComplete="street-address"
                error={Boolean(errors.address)}
                helperText={errors.address ?? "Include street, building, area and any helpful directions."}
                slotProps={{ htmlInput: { maxLength: 500 } }}
              />
              <Alert severity="info">The store will confirm delivery availability and quote the delivery fee in WhatsApp before you agree to the final total.</Alert>
            </>
          )}
          <TextField
            id="checkout-notes"
            label="Order notes (optional)"
            value={details.notes}
            onChange={(event) => update("notes", event.target.value)}
            fullWidth
            multiline
            minRows={2}
            error={Boolean(errors.notes)}
            helperText={errors.notes ?? "Up to 500 characters."}
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
          {(submitError || pricedCart.error) && (
            <Alert severity="error">{submitError || pricedCart.error} Return to the menu to review your items.</Alert>
          )}
          <Button type="submit" variant="contained" size="large" disabled={Boolean(pricedCart.error)}>
            {saving ? "Saving your order…" : saveOrders ? "Save order & prepare WhatsApp message" : "Prepare WhatsApp message"}
          </Button>
          <Typography variant="body2" color="text.secondary">
            No payment is collected here. The store confirms availability, timing and payment details in WhatsApp.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {saveOrders ? "Saving sends your contact and delivery details to the store’s order system. Sending the WhatsApp message is a separate step." : "Your contact and delivery details are included in the prepared message. The store receives them only when you send it in WhatsApp."}
          </Typography>
          {preparedOrder && (
            <Stack spacing={2} sx={{ borderTop: "1px solid", borderColor: "divider", pt: 3 }}>
              <Alert severity="success" role="status">{saveOrders ? "Order saved. " : ""}Your message is prepared. Open WhatsApp and send it to request your order.</Alert>
              {handoffUrl ? (
                <Button component="a" href={handoffUrl} target="_blank" rel="noopener noreferrer" variant="contained" size="large">
                  Open WhatsApp
                </Button>
              ) : (
                <Button variant="contained" disabled>Open WhatsApp — unavailable</Button>
              )}
              <Typography variant="body2" color="text.secondary">
                Opening WhatsApp does not send the message or confirm an order. Your cart stays saved if you need to retry.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If WhatsApp cannot load the prepared message, copy it and paste it into the store chat.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button type="button" variant="outlined" onClick={copyMessage}>Copy order message</Button>
                {WHATSAPP_URL && (
                  <Button component="a" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Open store chat</Button>
                )}
              </Stack>
              {copyStatus && <Typography variant="body2" role="status">{copyStatus}</Typography>}
              <Box component="details">
                <Typography component="summary" sx={{ cursor: "pointer", fontWeight: 600 }}>Preview prepared message</Typography>
                <Typography component="pre" variant="body2" sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", mt: 2 }}>
                  {message}
                </Typography>
              </Box>
            </Stack>
          )}
        </Stack>
        <Stack component="aside" aria-labelledby="order-summary-title" spacing={2} sx={{ ...cardStyles, alignSelf: "start", minWidth: 0 }}>
          <Typography component="h2" variant="h5" id="order-summary-title" sx={{ fontWeight: 700 }}>Your order</Typography>
          {pricedCart.items.map((item) => (
            <Box key={item.id} sx={{ overflowWrap: "anywhere" }}>
              <Typography sx={{ fontWeight: 700 }}>{item.productName} × {item.quantity}</Typography>
              <Typography variant="body2" color="text.secondary">{item.variantLabel}</Typography>
              <Typography variant="body2" color="text.secondary">{formatMoney(item.unitPrice)} each</Typography>
              <Typography color="primary.main" sx={{ mt: 0.5, fontWeight: 700 }}>{formatMoney(item.unitPrice * item.quantity)}</Typography>
            </Box>
          ))}
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Typography>Items subtotal</Typography>
            <Typography sx={{ fontWeight: 700 }}>{formatMoney(pricedCart.subtotal)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Typography>Delivery fee</Typography>
            <Typography sx={{ textAlign: "right" }}>{details.method === "pickup" ? "Pickup · Rp 0" : "To be quoted"}</Typography>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>{details.method === "pickup" ? "Total" : "Final total"}</Typography>
            <Typography sx={{ fontWeight: 800, textAlign: "right" }}>
              {details.method === "pickup" ? formatMoney(pricedCart.subtotal) : "Pending delivery quote"}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">All prices are in Indonesian rupiah (IDR).</Typography>
        </Stack>
      </Box>
    </Container>
  );
}
