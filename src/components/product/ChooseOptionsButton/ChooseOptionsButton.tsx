"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import ProductConfigurator from "../ProductConfigurator";
import { Product } from "@/data/products";
import { configuredProductFactory } from "@/domain/products";

interface Props { product: Product; packageId: string; }

export default function ChooseOptionsButton({ product, packageId }: Props) {
  const [open, setOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const configuredProduct = configuredProductFactory.createEmpty("sugar-cane-juice");
  const selectedProduct = {
    ...configuredProduct,
    configuration: { packageId, toppingIds: product.craftedFrom.filter((ingredientId) => ingredientId !== "sugarcane") },
  };

  return (
    <>
      <Button fullWidth variant="contained" size="large" onClick={() => setOpen(true)} aria-label={`Configure ${product.name}`} sx={{ mt: 2, minHeight: 56, fontSize: 18, fontWeight: 700, borderRadius: 999 }}>
        Choose Options
      </Button>
      {open && <ProductConfigurator open onClose={() => setOpen(false)} product={product} configuredProduct={selectedProduct} onAdded={() => setAdded(true)} />}
      <Snackbar open={added} autoHideDuration={3500} onClose={() => setAdded(false)} message="Item added to cart" />
    </>
  );
}
