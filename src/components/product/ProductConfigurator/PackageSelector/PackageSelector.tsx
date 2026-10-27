"use client";

import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import { catalog } from "@/domain/catalog";
import PackageCard from "../PackageCard";

interface Props {
  value?: string;
  productId?: string;
  onChange(packageId: string): void;
}

export default function PackageSelector({ value, productId = "sugar-cane-juice", onChange }: Props) {
  const product = catalog.getProduct(productId);
  const packages = catalog.getPackages().filter((pkg) => pkg.enabled && product?.packageIds.includes(pkg.id));
  return (
    <RadioGroup aria-label="Bottle size" value={value ?? ""} onChange={(_, packageId) => onChange(packageId)}>
      <Stack spacing={2}>
        {packages.map((pkg) => <PackageCard key={pkg.id} item={pkg} selected={value === pkg.id} />)}
      </Stack>
    </RadioGroup>
  );
}
