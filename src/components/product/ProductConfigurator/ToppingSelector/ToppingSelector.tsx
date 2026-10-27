"use client";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { catalog } from "@/domain/catalog";
import { formatMoney } from "@/domain/money";

interface Props {
  value: readonly string[];
  productId?: string;
  unitPrice: number;
  onChange(toppingIds: string[]): void;
}

export default function ToppingSelector({ value, productId = "sugar-cane-juice", unitPrice, onChange }: Props) {
  const product = catalog.getProduct(productId);
  const toppings = catalog.getToppings().filter((topping) => topping.enabled && product?.toppingIds.includes(topping.id));
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  }
  return (
    <Stack spacing={0.5}>
      {toppings.map((topping) => (
        <FormControlLabel
          key={topping.id}
          control={<Checkbox checked={value.includes(topping.id)} onChange={() => toggle(topping.id)} />}
          label={<Typography><span aria-hidden="true">{topping.icon} </span>{topping.name} <Typography component="span" variant="body2" color="text.secondary">+{formatMoney(unitPrice)}</Typography></Typography>}
          sx={{ minHeight: 44 }}
        />
      ))}
    </Stack>
  );
}
