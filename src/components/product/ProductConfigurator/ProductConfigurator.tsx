"use client";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useState } from "react";
import { ConfiguredProduct } from "@/domain/product";
import { catalog } from "@/domain/catalog";
import PackageSelector from "./PackageSelector";
import ToppingSelector from "./ToppingSelector";

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
  const product = catalog.getProduct(configuredProduct.productId);

  if (!product) {
    return null;
  }

  const [configuration, setConfiguration] = useState(
    configuredProduct.configuration,
  );

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
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          {product.name}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
          }}
        >
          {product.description}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <Typography variant="subtitle2" gutterBottom>
          Package
        </Typography>

        <PackageSelector
          value={configuration.packageId}
          onChange={(packageId) =>
            setConfiguration({
              ...configuration,
              packageId,
            })
          }
        />

        <Divider sx={{ my: 4 }} />

        <Typography variant="subtitle2" gutterBottom>
          Choose Toppings
        </Typography>

        <ToppingSelector
          value={configuration.toppingIds}
          onChange={(toppingIds) =>
            setConfiguration({
              ...configuration,
              toppingIds,
            })
          }
        />

        {configuredProduct.configuration.toppingIds.length === 0 ? (
          <Typography color="text.secondary">No topping selected</Typography>
        ) : (
          configuredProduct.configuration.toppingIds.map((id) => (
            <Typography key={id}>• {id}</Typography>
          ))
        )}

        <Divider sx={{ my: 4 }} />

        <Button fullWidth variant="contained" size="large">
          Add To Cart
        </Button>
      </Box>
    </Drawer>
  );
}
