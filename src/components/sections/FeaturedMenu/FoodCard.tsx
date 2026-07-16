"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LocalBarRoundedIcon from "@mui/icons-material/LocalBarRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import QuantityStepper from "@/components/common/QuantityStepper";
import { Food } from "@/domain/catalog/food";
import { formatMoney } from "@/domain/money";
import { useOrderContext } from "@/domain/order";

interface FoodCardProps {
  food: Food;
}

export default function FoodCard({ food }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useOrderContext();
  const isAlcoholic = food.categoryId === "alcoholic-beverage";

  const addToCart = () => {
    addItem({
      id: food.id,
      productId: food.id,
      productName: food.name,
      image: food.image,
      variantId: food.volume ? `${food.volume}ml` : "regular",
      variantLabel: food.volume ? `${food.volume} ml bottle` : "Regular serving",
      quantity,
      unitPrice: food.price,
    });
  };

  return (
    <Card elevation={0} sx={{ height: "100%", borderRadius: 5, border: "1px solid", borderColor: "divider", transition: ".3s", "&:hover": { transform: "translateY(-6px)", boxShadow: "0 24px 60px rgba(0,0,0,.09)" } }}>
      <CardContent sx={{ p: 4, height: "100%" }}>
        <Stack spacing={2.5} sx={{ height: "100%" }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <Chip icon={isAlcoholic ? <LocalBarRoundedIcon /> : <RestaurantRoundedIcon />} label={isAlcoholic ? "Alcoholic Beverage" : food.categoryId === "main-course" ? "Main Course" : "Snack"} sx={{ fontWeight: 700, bgcolor: isAlcoholic ? "rgba(155, 98, 53, .12)" : "rgba(47, 111, 79, .10)" }} />
            {food.volume && <Typography color="text.secondary" sx={{ fontWeight: 700 }}>{food.volume} ml</Typography>}
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.04em" }}>{food.name}</Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.8, flexGrow: 1 }}>{food.description}</Typography>
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>{formatMoney(food.price)}</Typography>
          <QuantityStepper value={quantity} onChange={setQuantity} compact />
          <Button variant="contained" fullWidth size="large" onClick={addToCart} sx={{ borderRadius: 999, py: 1.4 }}>Add to Cart</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
