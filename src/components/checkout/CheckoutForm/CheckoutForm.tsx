"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { siteConfig } from "@/config/site";
import { formatMoney } from "@/domain/money";
import { useOrderContext } from "@/domain/order";

type FulfillmentMethod = "pickup" | "delivery";

export default function CheckoutForm() {
  const { order, subtotal, clearOrder } = useOrderContext();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<FulfillmentMethod>("pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (order.items.length === 0 || (method === "delivery" && !address.trim())) return;

    const items = order.items
      .map((item) => `- ${item.productName} × ${item.quantity}\n  ${item.variantLabel}\n  ${formatMoney(item.unitPrice * item.quantity)}`)
      .join("\n");
    const message = [
      `*New order — ${siteConfig.name}*`,
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Fulfillment: ${method === "pickup" ? "Pickup" : "Delivery"}`,
      ...(method === "delivery" ? [`Address: ${address}`] : []),
      ...(notes.trim() ? [`Notes: ${notes.trim()}`] : []),
      "",
      "*Items*",
      items,
      "",
      `*Total: ${formatMoney(subtotal)}*`,
    ].join("\n");
    const merchantNumber = siteConfig.whatsapp.replace(/\D/g, "");

    window.open(`https://wa.me/${merchantNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
    clearOrder();
  };

  if (submitted) {
    return <Container maxWidth="sm" sx={{ py: { xs: 12, md: 18 } }}><Stack spacing={3} sx={{ textAlign: "center", p: 5, bgcolor: "background.paper", borderRadius: 4, border: "1px solid", borderColor: "divider" }}><Typography variant="h3">WhatsApp is ready</Typography><Typography color="text.secondary">Your order details have been prepared for WhatsApp. Send the message to place your order.</Typography><Button component={Link} href="/" variant="contained">Back to Tebu Nai</Button></Stack></Container>;
  }

  if (order.items.length === 0) {
    return <Container maxWidth="sm" sx={{ py: { xs: 12, md: 18 } }}><Stack spacing={3} sx={{ textAlign: "center", p: 5, bgcolor: "background.paper", borderRadius: 4, border: "1px solid", borderColor: "divider" }}><Typography variant="h3">Your cart is empty</Typography><Typography color="text.secondary">Choose a fresh drink before continuing to checkout.</Typography><Button component={Link} href="/" variant="contained">Browse the menu</Button></Stack></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 10 } }}>
      <Box component="form" onSubmit={submit} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" }, gap: 4 }}>
        <Stack spacing={3} sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.paper", borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
          <Box><Typography variant="h3" sx={{ fontWeight: 700 }}>Checkout</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Tell us how to prepare your order.</Typography></Box>
          <TextField label="Customer name" value={name} onChange={(event) => setName(event.target.value)} required fullWidth autoComplete="name" />
          <TextField label="Phone number" value={phone} onChange={(event) => setPhone(event.target.value)} required fullWidth type="tel" autoComplete="tel" />
          <FormControl><Typography sx={{ mb: 1, fontWeight: 700 }}>Fulfillment</Typography><RadioGroup row value={method} onChange={(event) => setMethod(event.target.value as FulfillmentMethod)}><FormControlLabel value="pickup" control={<Radio />} label="Pickup" /><FormControlLabel value="delivery" control={<Radio />} label="Delivery" /></RadioGroup></FormControl>
          {method === "delivery" && <TextField label="Delivery address" value={address} onChange={(event) => setAddress(event.target.value)} required fullWidth multiline minRows={3} autoComplete="street-address" />}
          <TextField label="Order notes (optional)" value={notes} onChange={(event) => setNotes(event.target.value)} fullWidth multiline minRows={3} />
          <Button type="submit" variant="contained" size="large">Place Order on WhatsApp</Button>
        </Stack>
        <Stack spacing={2} sx={{ alignSelf: "start", p: { xs: 3, md: 4 }, bgcolor: "background.paper", borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Your order</Typography>
          {order.items.map((item) => <Box key={item.id}><Typography sx={{ fontWeight: 700 }}>{item.productName} × {item.quantity}</Typography><Typography variant="body2" color="text.secondary">{item.variantLabel}</Typography><Typography color="primary.main" sx={{ mt: 0.5, fontWeight: 700 }}>{formatMoney(item.unitPrice * item.quantity)}</Typography></Box>)}
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Typography color="text.secondary">Total</Typography><Typography variant="h5" sx={{ fontWeight: 800 }}>{formatMoney(subtotal)}</Typography></Box>
        </Stack>
      </Box>
    </Container>
  );
}
