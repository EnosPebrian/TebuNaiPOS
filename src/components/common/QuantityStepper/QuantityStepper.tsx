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
  label?: string;
}

export default function QuantityStepper({ value, onChange, min = 1, max = 99, compact = false, label = "Quantity" }: QuantityStepperProps) {
  return (
    <Box role="group" aria-label={label} sx={{ mt: compact ? 1 : 4 }}>
      {!compact && <Typography variant="overline" color="primary" sx={{ letterSpacing: 2, fontWeight: 700 }}>{label}</Typography>}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: compact ? 0 : 2, p: compact ? 0.25 : 1, borderRadius: 999, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
        <IconButton onClick={() => value > min && onChange(value - 1)} disabled={value <= min} aria-label={`Decrease ${label.toLowerCase()}`} sx={{ minWidth: 44, minHeight: 44 }}>
          <RemoveRoundedIcon fontSize={compact ? "small" : "medium"} />
        </IconButton>
        <Typography aria-live="polite" aria-atomic="true" sx={{ fontWeight: 700, fontSize: compact ? 16 : 22, minWidth: 32, textAlign: "center" }}>{value}</Typography>
        <IconButton color="primary" onClick={() => value < max && onChange(value + 1)} disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`} sx={{ minWidth: 44, minHeight: 44 }}>
          <AddRoundedIcon fontSize={compact ? "small" : "medium"} />
        </IconButton>
      </Box>
    </Box>
  );
}
