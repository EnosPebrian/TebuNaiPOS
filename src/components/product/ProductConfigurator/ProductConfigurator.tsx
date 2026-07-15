"use client";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import { ConfiguredProduct } from "@/domain/product";

interface ProductConfiguratorProps {
  open: boolean;

  onClose: () => void;

  configuredProduct: ConfiguredProduct;
}

export default function ProductConfigurator({
  open,
  onClose,
  configuredProduct,
}: ProductConfiguratorProps) {
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
              sm: 480,
            },
          },
        },
      }}
    >
      <Box
        sx={{
          p: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Product Configurator
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          This is the new Commerce Engine.
        </Typography>

        <Divider
          sx={{
            my: 4,
          }}
        />

        <Typography variant="body2">Product ID</Typography>

        <Typography fontWeight={700}>{configuredProduct.productId}</Typography>

        <Divider
          sx={{
            my: 4,
          }}
        />

        <Typography variant="body2">Package</Typography>

        <Typography>{configuredProduct.configuration.packageId}</Typography>

        <Divider
          sx={{
            my: 4,
          }}
        />

        <Typography variant="body2">Toppings</Typography>

        {configuredProduct.configuration.toppingIds.length === 0 ? (
          <Typography color="text.secondary">None selected</Typography>
        ) : (
          configuredProduct.configuration.toppingIds.map((id) => (
            <Typography key={id}>• {id}</Typography>
          ))
        )}

        <Divider
          sx={{
            my: 4,
          }}
        />

        <Button fullWidth variant="contained" size="large">
          Add To Cart
        </Button>
      </Box>
    </Drawer>
  );
}
