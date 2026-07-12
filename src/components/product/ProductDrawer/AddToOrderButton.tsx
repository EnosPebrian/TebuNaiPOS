"use client";

import { useState } from "react";

import Button from "@mui/material/Button";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

interface AddToOrderButtonProps {
  onClick: () => void;
}

export default function AddToOrderButton({ onClick }: AddToOrderButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;

    setLoading(true);

    setTimeout(() => {
      onClick();
      setLoading(false);
    }, 300);
  };

  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      disabled={loading}
      onClick={handleClick}
      startIcon={loading ? <CheckRoundedIcon /> : undefined}
      sx={{
        mt: 5,
        height: 56,

        borderRadius: 999,

        fontWeight: 700,

        fontSize: 18,

        transition: ".25s",

        transform: loading ? "scale(.98)" : "scale(1)",

        "&.Mui-disabled": {
          bgcolor: "success.main",
          color: "common.white",
        },
      }}
    >
      {loading ? "Added to Your Order" : "Add to Your Order"}
    </Button>
  );
}
