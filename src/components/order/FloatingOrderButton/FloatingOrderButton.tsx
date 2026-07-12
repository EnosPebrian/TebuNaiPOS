"use client";

import Fab from "@mui/material/Fab";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";

import { useOrder } from "@/domain/order";

export default function FloatingOrderButton() {
  const { itemCount } = useOrder();

  if (itemCount === 0) return null;

  return (
    <Fab
      color="primary"
      variant="extended"
      sx={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 1300,
        px: 3,
        height: 64,
        borderRadius: 999,
      }}
    >
      <Badge badgeContent={itemCount} color="error">
        <LocalDrinkOutlinedIcon />
      </Badge>

      <Stack
        sx={{
          ml: 2,
        }}
      >
        <Typography fontWeight={700}>Your Order</Typography>

        <Typography variant="caption">
          {itemCount} Drink{itemCount > 1 ? "s" : ""}
        </Typography>
      </Stack>
    </Fab>
  );
}
