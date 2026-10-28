"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import QuantityStepper from "@/components/common/QuantityStepper";
import { Product } from "@/data/products";
import { catalog } from "@/domain/catalog";
import { createCartItem, useOrderContext } from "@/domain/order";
import { calculateConfiguredProductPrice, getToppingPrice } from "@/domain/pricing";
import { formatMoney } from "@/domain/money";
import { ConfiguredProduct, configuredProductFactory } from "@/domain/products";
import PackageSelector from "./PackageSelector";
import ToppingSelector from "./ToppingSelector";

interface ProductConfiguratorProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  configuredProduct: ConfiguredProduct;
  onAdded?: () => void;
}

export default function ProductConfigurator({ open, onClose, product, configuredProduct, onAdded }: ProductConfiguratorProps) {
  const [selectedProduct, setSelectedProduct] = useState(() => configuredProductFactory.clone(configuredProduct));
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const { addItem } = useOrderContext();
  const configuration = selectedProduct.configuration;
  const price = calculateConfiguredProductPrice(selectedProduct, quantity);
  const selectedPackage = configuration.packageId ? catalog.getPackage(configuration.packageId) : undefined;
  const toppingUnitPrice = configuration.packageId ? getToppingPrice(configuration.packageId) : 0;

  const addToCart = () => {
    try {
      addItem(createCartItem(selectedProduct, quantity));
      onAdded?.();
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to add this item. Please review your quantity.");
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { role: "dialog", "aria-modal": true, "aria-labelledby": "configuration-title", sx: { width: { xs: "100%", sm: 480 } } } }}>
      <Box sx={{ p: { xs: 3, sm: 4 }, pb: "max(32px, env(safe-area-inset-bottom))" }}>
        <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
          <Typography id="configuration-title" component="h2" variant="h4" sx={{ fontWeight: 700 }}>{product.name}</Typography>
          <IconButton onClick={onClose} aria-label="Close item configuration"><CloseRoundedIcon /></IconButton>
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{product.description}</Typography>
        <Divider sx={{ my: 3 }} />
        <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
          <Typography component="legend" variant="subtitle2" sx={{ mb: 2 }}>Choose your bottle</Typography>
          <PackageSelector productId={selectedProduct.productId} value={configuration.packageId} onChange={(packageId) => setSelectedProduct((current) => ({ ...current, configuration: { ...current.configuration, packageId } }))} />
        </Box>
        <Divider sx={{ my: 3 }} />
        <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
          <Typography component="legend" variant="subtitle2" sx={{ mb: 1 }}>Choose toppings · optional</Typography>
          <ToppingSelector productId={selectedProduct.productId} unitPrice={toppingUnitPrice} value={configuration.toppingIds} onChange={(toppingIds) => setSelectedProduct((current) => ({ ...current, configuration: { ...current.configuration, toppingIds } }))} />
        </Box>
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <Box sx={{ mt: 3, p: 2.5, bgcolor: "rgba(47,111,79,.06)", borderRadius: 3 }} aria-live="polite" aria-atomic="true">
          <Typography component="h3" variant="subtitle1" sx={{ fontWeight: 800 }}>Item Configuration</Typography>
          <Typography sx={{ mt: 1 }}>Bottle: {selectedPackage?.volume} ml</Typography>
          <Typography>Toppings: {configuration.toppingIds.length ? configuration.toppingIds.map((id) => catalog.getTopping(id)?.name).join(", ") : "None"}</Typography>
          <Typography>Quantity: {quantity}</Typography>
          <Stack direction="row" sx={{ justifyContent: "space-between", gap: 1, mt: 2 }}>
            <Typography sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography color="primary.main" sx={{ fontWeight: 800 }}>{formatMoney(price.grandTotal)}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">{formatMoney(price.grandTotal / quantity)} per bottle</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button fullWidth variant="contained" size="large" onClick={addToCart} sx={{ mt: 3, minHeight: 52 }}>Add To Cart</Button>
      </Box>
    </Drawer>
  );
}
