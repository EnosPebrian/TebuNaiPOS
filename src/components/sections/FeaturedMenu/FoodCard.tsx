"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LocalBarRoundedIcon from "@mui/icons-material/LocalBarRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import QuantityStepper from "@/components/common/QuantityStepper";
import { Food } from "@/domain/catalog/food";
import { formatMoney } from "@/domain/money";
import { createCartItem, useOrderContext } from "@/domain/order";
import { configuredProductFactory } from "@/domain/products";

interface FoodCardProps { food: Food; }

export default function FoodCard({ food }: FoodCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const { addItem } = useOrderContext();
  const isAlcoholic = food.categoryId === "alcoholic-beverage";
  const orderable = food.enabled && !isAlcoholic;

  const addToCart = () => {
    if (!orderable) return;
    try {
      addItem(createCartItem(configuredProductFactory.createEmpty(food.id), quantity));
      setError("");
      setAdded(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to add this item. Please review your quantity.");
    }
  };

  return (
    <>
      <Card component="article" elevation={0} sx={{ height: "100%", borderRadius: 5, border: "1px solid", borderColor: "divider", transition: ".3s", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 24px 60px rgba(0,0,0,.09)" } }}>
        <CardContent sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
          <Stack spacing={2.5} sx={{ height: "100%" }}>
            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 1, flexWrap: "wrap" }}>
              <Chip icon={isAlcoholic ? <LocalBarRoundedIcon /> : <RestaurantRoundedIcon />} label={isAlcoholic ? "Alcoholic Beverage" : food.categoryId === "main-course" ? "Main Course" : "Snack"} sx={{ fontWeight: 700, bgcolor: isAlcoholic ? "rgba(155, 98, 53, .12)" : "rgba(47, 111, 79, .10)" }} />
              {food.volume && <Typography color="text.secondary" sx={{ fontWeight: 700 }}>{food.volume} ml</Typography>}
            </Stack>
            <Typography component="h3" variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.04em", overflowWrap: "anywhere" }}>{food.name}</Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.8, flexGrow: 1 }}>{food.description}</Typography>
            <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>{formatMoney(food.price)}</Typography>
            {isAlcoholic && <Alert severity="info">Unavailable for ordering. Licensing, age verification, and applicable online sales requirements must be confirmed before sales can be authorized.</Alert>}
            {orderable && <QuantityStepper value={quantity} onChange={setQuantity} label={`Quantity for ${food.name}`} compact />}
            {error && <Alert severity="error">{error}</Alert>}
            <Button variant="contained" fullWidth size="large" onClick={addToCart} disabled={!orderable} sx={{ borderRadius: 999, py: 1.4 }}>
              {orderable ? "Add to Cart" : "Currently unavailable"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Snackbar open={added} autoHideDuration={3500} onClose={() => setAdded(false)} message={`${quantity} × ${food.name} added to cart`} />
    </>
  );
}
