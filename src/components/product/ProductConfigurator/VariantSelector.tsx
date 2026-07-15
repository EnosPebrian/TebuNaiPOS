"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { ProductVariant } from "@/data/products";

interface VariantSelectorProps {
  variants: ProductVariant[];

  value: ProductVariant;

  onChange: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  value,
  onChange,
}: VariantSelectorProps) {
  return (
    <Box sx={{ mt: 5 }}>
      <Typography
        variant="overline"
        color="primary"
        sx={{
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        Choose Bottle
      </Typography>

      <Stack
        spacing={2}
        sx={{
          mt: 2,
        }}
      >
        {variants.map((variant) => {
          const active = value.id === variant.id;

          return (
            <Box
              key={variant.id}
              onClick={() => onChange(variant)}
              sx={{
                cursor: "pointer",

                borderRadius: 3,

                p: 2.5,

                border: "2px solid",

                borderColor: active ? "primary.main" : "divider",

                bgcolor: active ? "primary.50" : "background.paper",

                transition: ".25s",

                "&:hover": {
                  borderColor: "primary.main",
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                }}
              >
                {variant.label}
              </Typography>

              <Typography color="text.secondary">
                Rp {variant.price.toLocaleString("id-ID")}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
