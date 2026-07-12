"use client";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";

interface QuantityStepperProps {
  value: number;

  onChange: (value: number) => void;

  min?: number;

  max?: number;
}

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
}: QuantityStepperProps) {
  const decrease = () => {
    if (value <= min) return;

    onChange(value - 1);
  };

  const increase = () => {
    if (max && value >= max) return;

    onChange(value + 1);
  };

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
        Quantity
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mt: 2,

          p: 1,

          borderRadius: 999,

          border: "1px solid",

          borderColor: "divider",

          bgcolor: "background.paper",
        }}
      >
        <IconButton onClick={decrease} disabled={value <= min}>
          <RemoveRoundedIcon />
        </IconButton>

        <Typography
          sx={{
            fontWeight: 700,

            fontSize: 22,

            minWidth: 32,

            textAlign: "center",
          }}
        >
          {value}
        </Typography>

        <IconButton
          color="primary"
          onClick={increase}
          disabled={max ? value >= max : false}
        >
          <AddRoundedIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
