"use client";

import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import QuantityStepper from "@/components/common/QuantityStepper";
import { Product } from "@/data/products";
import { catalog } from "@/domain/catalog";
import { useOrderContext } from "@/domain/order";
import { calculatePrice } from "@/domain/pricing";
import { formatMoney } from "@/domain/money";
import { ConfiguredProduct } from "@/domain/products";
import PackageSelector from "./PackageSelector";
import ToppingSelector from "./ToppingSelector";

interface ProductConfiguratorProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  configuredProduct: ConfiguredProduct;
}

export default function ProductConfigurator({ open, onClose, product, configuredProduct }: ProductConfiguratorProps) {
  const [configuration, setConfiguration] = useState(configuredProduct.configuration);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useOrderContext();

  useEffect(() => {
    if (open) {
      setConfiguration(configuredProduct.configuration);
      setQuantity(1);
    }
  }, [configuredProduct, open]);

  const price = useMemo(() => configuration.packageId ? calculatePrice({ packageId: configuration.packageId, toppingIds: configuration.toppingIds, quantity }) : null, [configuration, quantity]);
  const selectedPackage = configuration.packageId ? catalog.getPackage(configuration.packageId) : undefined;

  const addToCart = () => {
    if (!price || !selectedPackage || !configuration.packageId) return;
    const selectedConfiguration: ConfiguredProduct = {
      productId: configuredProduct.productId,
      configuration: { packageId: configuration.packageId, toppingIds: [...configuration.toppingIds] },
    };
    const configurationKey = [product.id, selectedConfiguration.configuration.packageId, ...selectedConfiguration.configuration.toppingIds.slice().sort()].join("-");
    addItem({
      id: configurationKey,
      productId: selectedConfiguration.productId,
      productName: product.name,
      image: product.image,
      variantId: selectedPackage.id,
      variantLabel: `${selectedPackage.name} (${selectedPackage.volume} ml)`,
      quantity,
      unitPrice: price.grandTotal / quantity,
    });
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { sx: { width: { xs: "100%", sm: 480 } } } }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>{product.name}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{product.description}</Typography>
        <Divider sx={{ my: 4 }} />
        <Typography variant="subtitle2" gutterBottom>Package</Typography>
        <PackageSelector value={configuration.packageId} onChange={(packageId) => setConfiguration((current) => ({ ...current, packageId }))} />
        <Divider sx={{ my: 4 }} />
        <Typography variant="subtitle2" gutterBottom>Choose Toppings</Typography>
        <ToppingSelector value={configuration.toppingIds} onChange={(toppingIds) => setConfiguration((current) => ({ ...current, toppingIds }))} />
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <Stack spacing={1} sx={{ mt: 4, mb: 2 }}>
          <Typography color="text.secondary">Total</Typography>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800 }}>{price ? formatMoney(price.grandTotal) : "Select a package"}</Typography>
        </Stack>
        <Button fullWidth variant="contained" size="large" disabled={!price} onClick={addToCart}>Add To Cart</Button>
      </Box>
    </Drawer>
  );
}
