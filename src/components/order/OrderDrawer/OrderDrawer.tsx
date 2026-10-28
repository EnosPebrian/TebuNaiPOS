"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/domain/money";
import { useOrderContext } from "@/domain/order/OrderContext";
import EmptyOrder from "./EmptyOrder";
import OrderItemCard from "./OrderItemCard";

interface Props { open: boolean; onClose: () => void; }

export default function OrderDrawer({ open, onClose }: Props) {
  const { order, subtotal, updateQuantity, removeItem, clearOrder } = useOrderContext();
  const router = useRouter();
  const hasItems = order.items.length > 0;
  return (
    <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { role: "dialog", "aria-modal": true, "aria-labelledby": "cart-title", sx: { width: { xs: "100%", sm: 460 } } } }}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
            <Typography id="cart-title" component="h2" variant="h4" sx={{ fontWeight: 800 }}>Your Fresh Order</Typography>
            <IconButton onClick={onClose} aria-label="Close cart"><CloseRoundedIcon /></IconButton>
          </Stack>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Review your drinks, meals, and snacks.</Typography>
          {hasItems && <Button onClick={clearOrder} color="inherit" size="small" sx={{ mt: 1 }}>Clear cart</Button>}
        </Box>
        <Divider />
        <Box sx={{ flex: 1, overflow: "auto", p: { xs: 2, sm: 3 } }}>
          {hasItems ? (
            <Stack spacing={2}>
              {order.items.map((item) => <OrderItemCard key={item.id} item={item} onQuantityChange={(quantity) => updateQuantity(item.id, quantity)} onRemove={() => removeItem(item.id)} />)}
            </Stack>
          ) : <EmptyOrder onBrowse={onClose} />}
        </Box>
        <Divider />
        <Box sx={{ p: { xs: 3, sm: 4 }, pb: "max(24px, env(safe-area-inset-bottom))", bgcolor: "background.paper" }}>
          <Box aria-live="polite" aria-atomic="true">
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>{formatMoney(subtotal)}</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Delivery arrangements are confirmed with the merchant.</Typography>
          <Button fullWidth variant="contained" size="large" disabled={!hasItems} sx={{ mt: 3, minHeight: 48 }} onClick={() => { onClose(); router.push("/checkout"); }}>Continue to Checkout</Button>
        </Box>
      </Box>
    </Drawer>
  );
}
