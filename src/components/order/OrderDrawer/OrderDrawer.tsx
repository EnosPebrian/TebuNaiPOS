"use client";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { useOrderContext } from "@/domain/order/OrderContext";

import EmptyOrder from "./EmptyOrder";

interface Props {
  open: boolean;

  onClose: () => void;
}

export default function OrderDrawer({ open, onClose }: Props) {
  const { order, subtotal } = useOrderContext();

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 460,
            },
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            p: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
            }}
          >
            Your Fresh Order 🌿
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Review your selected drinks.
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 4,
          }}
        >
          {order.items.length === 0 ? (
            <EmptyOrder />
          ) : (
            order.items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  mb: 4,
                }}
              >
                <Typography fontWeight={700}>{item.productName}</Typography>

                <Typography color="text.secondary">
                  {item.variantLabel}
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                  }}
                >
                  Qty {item.quantity}
                </Typography>

                <Typography fontWeight={700} color="primary.main">
                  Rp {(item.unitPrice * item.quantity).toLocaleString("id-ID")}
                </Typography>
              </Box>
            ))
          )}
        </Box>

        <Divider />

        <Box
          sx={{
            p: 4,

            position: "sticky",

            bottom: 0,

            bgcolor: "background.paper",
          }}
        >
          <Typography color="text.secondary">Subtotal</Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mt: 1,
            }}
          >
            Rp {subtotal.toLocaleString("id-ID")}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
