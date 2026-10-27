"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function EmptyOrder({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <Box sx={{ py: 8, textAlign: "center" }}>
      <Typography sx={{ fontSize: 56 }} aria-hidden="true">🍃</Typography>
      <Typography component="h3" variant="h5" sx={{ mt: 3, fontWeight: 700 }}>Nothing here yet</Typography>
      <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 280, mx: "auto" }}>Choose a fresh drink, meal, or snack to start your order.</Typography>
      <Button component="a" href="/#menu" onClick={onBrowse} variant="outlined" sx={{ mt: 3 }}>Browse Menu</Button>
    </Box>
  );
}
