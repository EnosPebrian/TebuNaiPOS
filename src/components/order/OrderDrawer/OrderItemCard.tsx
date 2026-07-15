"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import QuantityStepper from "@/components/common/QuantityStepper";
import { formatMoney } from "@/domain/money";
import { OrderItem } from "@/domain/order/types";

interface OrderItemCardProps {
  item: OrderItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function OrderItemCard({ item, onQuantityChange, onRemove }: OrderItemCardProps) {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 2, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 120, borderRadius: 2, bgcolor: "rgba(169, 196, 108, 0.12)", overflow: "hidden" }}>
        <Image src={item.image} alt="" width={72} height={96} style={{ objectFit: "contain" }} />
      </Box>
      <Stack spacing={0.5}>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>{item.productName}</Typography>
            <Typography variant="body2" color="text.secondary">{item.variantLabel}</Typography>
          </Box>
          <IconButton aria-label={`Remove ${item.productName}`} size="small" onClick={onRemove}>
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography color="primary.main" sx={{ fontWeight: 700 }}>{formatMoney(item.unitPrice * item.quantity)}</Typography>
        <QuantityStepper value={item.quantity} onChange={onQuantityChange} compact />
      </Stack>
    </Box>
  );
}
