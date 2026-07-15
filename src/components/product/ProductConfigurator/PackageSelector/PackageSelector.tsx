"use client";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import { catalog } from "@/domain/catalog";

interface Props {
  value?: string;

  onChange(packageId: string): void;
}

export default function PackageSelector({ value, onChange }: Props) {
  const packages = catalog.getPackages();

  return (
    <Stack spacing={2}>
      {packages.map((pkg) => (
        <Button
          key={pkg.id}
          fullWidth
          variant={value === pkg.id ? "contained" : "outlined"}
          onClick={() => onChange(pkg.id)}
        >
          {pkg.name}
        </Button>
      ))}
    </Stack>
  );
}
