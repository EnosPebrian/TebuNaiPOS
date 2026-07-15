"use client";

import { useMemo, useState } from "react";
import Button from "@mui/material/Button";

import ProductConfigurator from "../ProductConfigurator";
import { Product } from "@/data/products";
import { ConfiguredProduct } from "@/domain/product";

interface Props {
  product: Product;
}

export default function ChooseOptionsButton({ product }: Props) {
  const [open, setOpen] = useState(false);

  /**
   * Temporary bridge between the old
   * product model and the new commerce engine.
   *
   * Later this will come from
   * configuredProductFactory.createFromPreset().
   */
  const configuredProduct = useMemo<ConfiguredProduct>(
    () => ({
      productId: product.id,

      configuration: {
        packageId: undefined,
        toppingIds: [],
      },
    }),
    [product],
  );

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => setOpen(true)}
        sx={{
          mt: 2,
          height: 56,
          fontSize: 18,
          fontWeight: 700,
          borderRadius: 999,
        }}
      >
        Order Now
      </Button>

      <ProductConfigurator
        open={open}
        onClose={() => setOpen(false)}
        configuredProduct={configuredProduct}
      />
    </>
  );
}
