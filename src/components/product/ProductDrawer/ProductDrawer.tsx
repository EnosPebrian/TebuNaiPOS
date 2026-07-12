"use client";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ProductImage from "./ProductImage";
import ProductHeader from "./ProductHeader";
import CraftedFrom from "./CraftedFrom";
import VariantSelector from "./VariantSelector";
import AddToOrderButton from "./AddToOrderButton";
import OrderSummary from "./OrderSummary";
import QuantitySelector from "./QuantitySelector";
import { OrderItem } from "@/domain/order/types";
import { useOrderContext } from "@/domain/order/OrderContext";
import { Product } from "@/data/products";
import Divider from "@mui/material/Divider";
import { useState } from "react";

interface ProductDrawerProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}
const categoryLabel = {
  classic: "Classic Collection",
  fruit: "Fruit Collection",
  wellness: "Wellness Collection",
};

export default function ProductDrawer({
  open,
  onClose,
  product,
}: ProductDrawerProps) {
  const defaultVariant =
    product.variants.find((variant) => variant.featured) ?? product.variants[0];

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  const [quantity, setQuantity] = useState(1);

  const total = selectedVariant.price * quantity;

  const handleAddToOrder = () => {
    const item: OrderItem = {
      id: crypto.randomUUID(),

      productId: product.id,

      productName: product.name,

      image: product.image,

      variantId: selectedVariant.id,

      variantLabel: selectedVariant.label,

      quantity,

      unitPrice: selectedVariant.price,
    };

    addItem(item);

    setQuantity(1);

    setSelectedVariant(defaultVariant);

    onClose();
  };

  const { addItem } = useOrderContext();

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
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
          },
        },
      }}
    >
      <Box
        sx={{
          p: 4,
        }}
      >
        <ProductImage
          image={product.image}
          name={product.name}
          accentColor={product.accentColor}
        />

        <ProductHeader
          category={categoryLabel[product.category]}
          name={product.name}
          description={product.description}
        />

        <CraftedFrom ingredients={product.craftedFrom} />

        <VariantSelector
          variants={product.variants}
          value={selectedVariant}
          onChange={setSelectedVariant}
        />

        <QuantitySelector value={quantity} onChange={setQuantity} />

        <OrderSummary product={product} variant={selectedVariant} />

        <AddToOrderButton onClick={handleAddToOrder} />

        <Divider
          sx={{
            my: 5,
          }}
        />
      </Box>
    </Drawer>
  );
}
