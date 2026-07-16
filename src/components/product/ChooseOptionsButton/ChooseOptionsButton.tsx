"use client";

import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import ProductConfigurator from "../ProductConfigurator";
import { Product } from "@/data/products";
import { ConfiguredProduct } from "@/domain/products";

interface Props {
  product: Product;
  packageId: string;
}

export default function ChooseOptionsButton({ product, packageId }: Props) {
  const [open, setOpen] = useState(false);
  const configuredProduct = useMemo<ConfiguredProduct>(() => {
    const toppingIds = product.craftedFrom.filter(
      (ingredientId) => ingredientId !== "sugarcane",
    );

    return {
      productId: "sugar-cane-juice",
      configuration: { packageId, toppingIds },
    };
  }, [packageId, product]);

  return (
    <>
      <Button fullWidth variant="contained" size="large" onClick={() => setOpen(true)} sx={{ mt: 2, height: 56, fontSize: 18, fontWeight: 700, borderRadius: 999 }}>
        Order Now
      </Button>
      <ProductConfigurator open={open} onClose={() => setOpen(false)} product={product} configuredProduct={configuredProduct} />
    </>
  );
}
