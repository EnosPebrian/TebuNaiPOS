"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { formatMoney } from "@/domain/money";
import { useOrderContext } from "@/domain/order/OrderContext";
import OrderDrawer from "../OrderDrawer";

export default function FloatingOrder() {
  const { itemCount, subtotal } = useOrderContext();
  const [open, setOpen] = useState(false);
  return (
    <>
      {itemCount > 0 && <Button
        variant="contained"
        onClick={() => setOpen(true)}
        aria-label={`View cart, ${itemCount} items, ${formatMoney(subtotal)}`}
        aria-haspopup="dialog"
        sx={{ position: "fixed", right: { xs: 16, sm: 24 }, bottom: "max(16px, env(safe-area-inset-bottom))", zIndex: 1100, px: 3, py: 1.5, borderRadius: 999, boxShadow: "0 16px 40px rgba(0,0,0,.18)", maxWidth: "calc(100vw - 32px)" }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <ShoppingBagRoundedIcon />
          <Box sx={{ textAlign: "left" }}>
            <Typography component="span" sx={{ display: "block", fontWeight: 700 }}>Your Cart</Typography>
            <Typography component="span" sx={{ display: "block", fontSize: 13 }} aria-live="polite">{itemCount} item{itemCount !== 1 ? "s" : ""} · {formatMoney(subtotal)}</Typography>
          </Box>
        </Stack>
      </Button>}
      <OrderDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
