"use client";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

interface QuantitySelectorProps {
  value: number;

  onChange: (value: number) => void;
}

export default function QuantitySelector({
  value,
  onChange,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    onChange(value + 1);
  };

  return (
    <Stack
      spacing={2}
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
        Quantity
      </Typography>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={decrease}
          sx={{
            width: 48,
            height: 48,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <RemoveRoundedIcon />
        </IconButton>

        <Typography
          sx={{
            width: 48,
            textAlign: "center",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>

        <IconButton
          onClick={increase}
          color="primary"
          sx={{
            width: 48,
            height: 48,
          }}
        >
          <AddRoundedIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
