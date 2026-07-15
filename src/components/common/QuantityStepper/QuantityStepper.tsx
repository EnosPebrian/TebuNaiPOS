"use client";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  compact?: boolean;
}

export default function QuantityStepper({ value, onChange, min = 1, max, compact = false }: QuantityStepperProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };
  const increase = () => {
    if (!max || value < max) onChange(value + 1);
  };

  return (
    <Box sx={{ mt: compact ? 1 : 5 }}>
      {!compact && <Typography variant="overline" color="primary" sx={{ letterSpacing: 2, fontWeight: 700 }}>Quantity</Typography>}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: compact ? 0 : 2, p: compact ? 0.25 : 1, borderRadius: 999, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
        <IconButton onClick={decrease} disabled={value <= min} aria-label="Decrease quantity" size={compact ? "small" : "medium"}>
          <RemoveRoundedIcon fontSize={compact ? "small" : "medium"} />
        </IconButton>
        <Typography sx={{ fontWeight: 700, fontSize: compact ? 16 : 22, minWidth: 32, textAlign: "center" }}>{value}</Typography>
        <IconButton color="primary" onClick={increase} disabled={max ? value >= max : false} aria-label="Increase quantity" size={compact ? "small" : "medium"}>
          <AddRoundedIcon fontSize={compact ? "small" : "medium"} />
        </IconButton>
      </Box>
    </Box>
  );
}
