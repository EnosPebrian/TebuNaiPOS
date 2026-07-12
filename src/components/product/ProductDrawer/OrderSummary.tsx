import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import { Product, ProductVariant } from "@/data/products";

interface OrderSummaryProps {
  product: Product;
  variant: ProductVariant;
}

export default function OrderSummary({ product, variant }: OrderSummaryProps) {
  return (
    <Box
      sx={{
        mt: 5,
      }}
    >
      <Typography
        variant="overline"
        color="primary"
        sx={{
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        Order Summary
      </Typography>

      <Box
        sx={{
          mt: 2,
          p: 3,
          borderRadius: 3,
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            {product.name}
          </Typography>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Bottle</Typography>

            <Typography fontWeight={600}>{variant.label}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Price</Typography>

            <Typography fontWeight={700} color="primary.main">
              Rp {variant.price.toLocaleString("id-ID")}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
