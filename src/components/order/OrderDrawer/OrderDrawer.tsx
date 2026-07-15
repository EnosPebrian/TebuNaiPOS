"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/domain/money";
import { useOrderContext } from "@/domain/order/OrderContext";
import EmptyOrder from "./EmptyOrder";
import OrderItemCard from "./OrderItemCard";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function OrderDrawer({ open, onClose }: Props) {
  const { order, subtotal, updateQuantity, removeItem } = useOrderContext();
  const router = useRouter();
  const hasItems = order.items.length > 0;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { sx: { width: { xs: "100%", sm: 460 } } } }}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Your Fresh Order</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Review your selected drinks.</Typography>
        </Box>
        <Divider />
        <Box sx={{ flex: 1, overflow: "auto", p: 4 }}>
          {hasItems ? (
            <Stack spacing={2}>
              {order.items.map((item) => (
                <OrderItemCard key={item.id} item={item} onQuantityChange={(quantity) => updateQuantity(item.id, quantity)} onRemove={() => removeItem(item.id)} />
              ))}
            </Stack>
          ) : <EmptyOrder />}
        </Box>
        <Divider />
        <Box sx={{ p: 4, bgcolor: "background.paper" }}>
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>{formatMoney(subtotal)}</Typography>
          <Button fullWidth variant="contained" size="large" disabled={!hasItems} sx={{ mt: 3 }} onClick={() => { onClose(); router.push("/checkout"); }}>
            Continue to Checkout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
