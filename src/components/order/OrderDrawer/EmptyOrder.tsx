"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function EmptyOrder() {
  return (
    <Box
      sx={{
        py: 12,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 56,
        }}
      >
        🍃
      </Typography>

      <Typography
        variant="h5"
        sx={{
          mt: 3,
          fontWeight: 700,
        }}
      >
        Nothing here yet
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mt: 2,
          maxWidth: 280,
          mx: "auto",
        }}
      >
        Choose your first fresh drink to start your order.
      </Typography>
    </Box>
  );
}
