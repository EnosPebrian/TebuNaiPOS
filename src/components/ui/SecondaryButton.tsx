"use client";

import Button, { ButtonProps } from "@mui/material/Button";

export default function SecondaryButton(props: ButtonProps) {
  return (
    <Button
      variant="outlined"
      {...props}
      sx={{
        px: 4,
        py: 1.6,
        borderRadius: 999,

        borderWidth: 2,

        "&:hover": {
          borderWidth: 2,
          background: "rgba(47,111,79,.05)",
        },

        ...props.sx,
      }}
    />
  );
}
