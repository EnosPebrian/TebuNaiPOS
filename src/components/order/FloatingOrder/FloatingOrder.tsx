"use client";

import { useState } from "react";

import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";

import { useOrderContext } from "@/domain/order/OrderContext";
import OrderDrawer from "../OrderDrawer";

export default function FloatingOrder() {
  const { itemCount, subtotal } = useOrderContext();

  const [open, setOpen] = useState(false);

  if (itemCount === 0) {
    return null;
  }

  return (
    <>
      <Slide direction="up" in={itemCount > 0}>
        <Box
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",

            right: 24,

            bottom: 24,

            zIndex: 1100,

            cursor: "pointer",

            px: 3,

            py: 2,

            borderRadius: 999,

            bgcolor: "primary.main",

            color: "primary.contrastText",

            backdropFilter: "blur(24px)",

            border: "1px solid rgba(255,255,255,.15)",

            boxShadow: "0 16px 40px rgba(0,0,0,.18)",

            transition: ".25s",

            "&:hover": {
              transform: "translateY(-4px)",
            },
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <ShoppingBagRoundedIcon />

            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                Your Order
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  opacity: 0.9,
                }}
              >
                {itemCount} drink{itemCount > 1 ? "s" : ""}
                {" • "}
                Rp {subtotal.toLocaleString("id-ID")}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Slide>

      <OrderDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
