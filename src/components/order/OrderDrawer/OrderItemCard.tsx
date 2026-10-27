"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import QuantityStepper from "@/components/common/QuantityStepper";
import { catalog } from "@/domain/catalog";
import { formatMoney } from "@/domain/money";
import { OrderItem } from "@/domain/order/types";

interface OrderItemCardProps {
  item: OrderItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function OrderItemCard({ item, onQuantityChange, onRemove }: OrderItemCardProps) {
  const toppingNames = item.configuredProduct.configuration.toppingIds.map((id) => catalog.getTopping(id)?.name).filter(Boolean);
  return (
    <Box component="article" sx={{ display: "grid", gridTemplateColumns: { xs: "56px minmax(0, 1fr)", sm: "72px minmax(0, 1fr)" }, gap: 1.5, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, bgcolor: "rgba(169, 196, 108, 0.12)", overflow: "hidden" }}>
        <Image src={item.image} alt="" width={56} height={90} style={{ objectFit: "contain", maxWidth: "100%" }} />
      </Box>
      <Stack spacing={0.5}>
        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "space-between" }}>
          <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
            <Typography component="h3" variant="body1" sx={{ fontWeight: 700 }}>{item.productName}</Typography>
            <Typography variant="body2" color="text.secondary">{item.variantLabel}</Typography>
            {toppingNames.length > 0 && <Typography variant="body2" color="text.secondary">Toppings: {toppingNames.join(", ")}</Typography>}
          </Box>
          <IconButton aria-label={`Remove ${item.productName}`} size="small" onClick={onRemove} sx={{ alignSelf: "flex-start", minWidth: 44, minHeight: 44 }}><DeleteOutlineRoundedIcon fontSize="small" /></IconButton>
        </Box>
        <Typography color="primary.main" sx={{ fontWeight: 700 }}>{formatMoney(item.unitPrice * item.quantity)}</Typography>
        <Typography variant="caption" color="text.secondary">{formatMoney(item.unitPrice)} each</Typography>
        <QuantityStepper value={item.quantity} onChange={onQuantityChange} label={`Quantity for ${item.productName}`} compact />
      </Stack>
    </Box>
  );
}
