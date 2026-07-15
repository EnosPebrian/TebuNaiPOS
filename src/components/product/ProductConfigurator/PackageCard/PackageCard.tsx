"use client";

import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { Package } from "@/domain/catalog";

interface Props {
  item: Package;
  selected: boolean;
  onClick(): void;
}

export default function PackageCard({ item, selected, onClick }: Props) {
  return (
    <Card
      elevation={selected ? 6 : 0}
      sx={{
        borderRadius: 3,
        border: selected ? "2px solid" : "1px solid",

        borderColor: selected ? "primary.main" : "divider",

        bgcolor: selected ? "primary.50" : "background.paper",

        transition: ".2s",
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          p: 2,
        }}
      >
        <Stack spacing={1}>
          <Typography sx={{ fontWeight: 700 }}>🧴 {item.name}</Typography>

          <Typography color="text.secondary">{item.volume} ml</Typography>

          <Typography color="primary" sx={{ fontWeight: 700 }}>
            Rp {item.basePrice.toLocaleString("id-ID")}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
