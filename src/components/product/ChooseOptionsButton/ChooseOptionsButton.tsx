"use client";

import { useState } from "react";
import Button from "@mui/material/Button";

import ProductDrawer from "../ProductDrawer";
import { Product } from "@/data/products";

interface Props {
  product: Product;
}

export default function ChooseOptionsButton({ product }: Props) {
  const [open, setOpen] = useState(false);

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

      <ProductDrawer
        open={open}
        onClose={() => setOpen(false)}
        product={product}
      />
    </>
  );
}
