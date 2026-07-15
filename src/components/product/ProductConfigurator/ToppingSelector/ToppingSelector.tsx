"use client";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { catalog } from "@/domain/catalog";

interface Props {
  value: string[];

  onChange(toppingIds: string[]): void;
}

export default function ToppingSelector({ value, onChange }: Props) {
  const toppings = catalog.getToppings();

  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((x) => x !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <Stack spacing={1}>
      {toppings.map((topping) => (
        <FormControlLabel
          key={topping.id}
          control={
            <Checkbox
              checked={value.includes(topping.id)}
              onChange={() => toggle(topping.id)}
            />
          }
          label={
            <Typography>
              {topping.icon} {topping.name}
            </Typography>
          }
        />
      ))}
    </Stack>
  );
}
