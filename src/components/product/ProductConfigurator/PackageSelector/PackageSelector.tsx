"use client";

import Stack from "@mui/material/Stack";

import { catalog } from "@/domain/catalog";

import PackageCard from "../PackageCard";

interface Props {
  value?: string;

  onChange(packageId: string): void;
}

export default function PackageSelector({ value, onChange }: Props) {
  const packages = catalog.getPackages();

  return (
    <Stack spacing={2}>
      {packages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          item={pkg}
          selected={value === pkg.id}
          onClick={() => onChange(pkg.id)}
        />
      ))}
    </Stack>
  );
}
