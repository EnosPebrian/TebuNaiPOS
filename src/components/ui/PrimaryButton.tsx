"use client";

import Button, { ButtonProps } from "@mui/material/Button";

export default function PrimaryButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        px: 4,
        py: 1.6,
        borderRadius: 999,
        fontWeight: 600,
        boxShadow: "0 10px 30px rgba(47,111,79,.15)",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 18px 40px rgba(47,111,79,.22)",
        },

        transition: ".3s",
        ...props.sx,
      }}
    />
  );
}
