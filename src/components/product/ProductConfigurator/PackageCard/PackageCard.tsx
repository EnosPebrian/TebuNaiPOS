"use client";

import Card from "@mui/material/Card";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Package } from "@/domain/catalog";
import { formatMoney } from "@/domain/money";

interface Props { item: Package; selected: boolean; }

export default function PackageCard({ item, selected }: Props) {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: "2px solid", borderColor: selected ? "primary.main" : "divider", bgcolor: selected ? "rgba(47,111,79,.07)" : "background.paper", transition: ".2s" }}>
      <FormControlLabel
        value={item.id}
        control={<Radio />}
        sx={{ m: 0, p: 1.5, width: "100%", alignItems: "center", "& .MuiFormControlLabel-label": { flex: 1 } }}
        label={
          <Stack spacing={0.5}>
            <Typography sx={{ fontWeight: 700 }}>{item.name} · {item.volume} ml</Typography>
            <Typography color="primary" sx={{ fontWeight: 700 }}>{formatMoney(item.basePrice)}</Typography>
          </Stack>
        }
      />
    </Card>
  );
}
