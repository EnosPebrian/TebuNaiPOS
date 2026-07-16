"use client";
import { useState } from "react";
import Image from "next/image";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { Product } from "@/data/products";
import ChooseOptionsButton from "@/components/product/ChooseOptionsButton";
import { formatMoney } from "@/domain/money";
import { calculatePrice } from "@/domain/pricing";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const featuredSize =
    product.variants.find((size) => size.featured) ?? product.variants[0];
  const [selectedSizeId, setSelectedSizeId] = useState(featuredSize.id);
  const selectedSize =
    product.variants.find((size) => size.id === selectedSizeId) ?? featuredSize;
  const selectedPrice = calculatePrice({
    packageId: `${selectedSize.id}ml`,
    toppingIds: product.craftedFrom.filter(
      (ingredientId) => ingredientId !== "sugarcane",
    ),
    quantity: 1,
  });
  const categoryLabel = {
    classic: "Classic Collection",
    fruit: "Fruit Collection",
    wellness: "Wellness Collection",
  };
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",

        borderRadius: "32px",

        border: "1px solid",

        borderColor: "divider",

        transition: ".35s",

        backgroundColor: "background.paper",

        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 30px 80px rgba(0,0,0,.10)",
        },

        "&:hover img": {
          transform: "translateY(-12px) scale(1.05)",
        },

        "&:hover .product-glow": {
          transform: "scale(1.25)",
          opacity: 1,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: 260,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Box
          className="product-glow"
          sx={{
            position: "absolute",

            width: 220,

            height: 220,

            borderRadius: "50%",

            background: `radial-gradient(circle, ${product.accentColor}55 0%, transparent 70%)`,

            filter: "blur(30px)",

            transition: "all .35s ease",
          }}
        />

        <Image
          src={product.image}
          alt={product.name}
          width={220}
          height={280}
          style={{
            objectFit: "contain",
            transition: ".35s ease",
            zIndex: 2,
          }}
        />
      </Box>

      <CardContent
        sx={{
          px: 4,
          pb: 4,
          pt: 2,
        }}
      >
        <Stack spacing={2}>
          <Chip
            label={categoryLabel[product.category]}
            size="small"
            sx={{
              width: "fit-content",
              borderRadius: 999,
              fontWeight: 600,
              bgcolor: `${product.accentColor}22`,
              color: "text.primary",
              border: `1px solid ${product.accentColor}55`,
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontSize: 40,
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            {product.name}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,

              color: "text.secondary",

              lineHeight: 1.8,

              minHeight: 96,
            }}
          >
            {product.description}
          </Typography>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: 1.2,
              }}
            >
              Harga
            </Typography>

            <Typography
              sx={{
                fontSize: 36,
                fontWeight: 700,
                color: "primary.main",
                lineHeight: 1,
              }}
            >
              {formatMoney(selectedPrice.grandTotal)}
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: "100%",
            }}
          >
            {product.variants.map((size) => (
              <Chip
                key={size.id}
                label={size.label}
                clickable
                onClick={() => setSelectedSizeId(size.id)}
                color={size.id === selectedSize.id ? "primary" : "default"}
                variant={size.id === selectedSize.id ? "filled" : "outlined"}
                sx={{
                  flex: 1,
                  height: 38,
                  borderRadius: 999,
                  fontWeight: 600,

                  "& .MuiChip-label": {
                    px: 0,
                    textAlign: "center",
                  },
                }}
              />
            ))}
          </Stack>
          <Divider />
          <ChooseOptionsButton product={product} packageId={`${selectedSize.id}ml`} />
        </Stack>
      </CardContent>
    </Card>
  );
}
