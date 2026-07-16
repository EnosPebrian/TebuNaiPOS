"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ProductCard from "@/components/sections/SignatureCollection/ProductCard";
import { foods } from "@/domain/catalog/food";
import { products } from "@/data/products";
import FoodCard from "./FoodCard";

const menuCategories = [
  { id: "sugarcane-juice", name: "Sugarcane Juice", description: "Freshly pressed, made to your taste." },
  { id: "main-course", name: "Main Course", description: "Comforting plates for every appetite." },
  { id: "snacks", name: "Snacks", description: "Small bites with big flavor." },
  { id: "alcoholic-beverage", name: "Alcoholic Beverage", description: "Crafted from sugarcane." },
] as const;

type MenuCategoryId = (typeof menuCategories)[number]["id"];

export default function FeaturedMenu() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId>("sugarcane-juice");
  const selectedFood = foods.filter((food) => food.enabled && food.categoryId === selectedCategory).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <Section id="menu">
      <Container>
        <Stack spacing={2} sx={{ mb: 6, textAlign: "center" }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 4, fontWeight: 700 }}>THE MENU</Typography>
          <Typography variant="h2">Discover Tebu Nai.</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 620, mx: "auto", lineHeight: 1.8 }}>Choose from freshly pressed sugarcane juice, hearty meals, snacks, and our sugarcane spirit.</Typography>
        </Stack>
        <Grid container spacing={2} sx={{ mb: 6 }}>
          {menuCategories.map((category) => {
            const selected = category.id === selectedCategory;
            return <Grid key={category.id} size={{ xs: 12, sm: 6, md: 3 }}><Card elevation={0} sx={{ height: "100%", borderRadius: 4, border: "2px solid", borderColor: selected ? "primary.main" : "divider", bgcolor: selected ? "rgba(47, 111, 79, .08)" : "background.paper", transition: ".2s" }}><CardActionArea onClick={() => setSelectedCategory(category.id)} sx={{ p: 2.5, height: "100%" }}><Typography sx={{ fontWeight: 800 }}>{category.name}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{category.description}</Typography></CardActionArea></Card></Grid>;
          })}
        </Grid>
        {selectedCategory === "sugarcane-juice" ? <Grid container spacing={4}>{products.map((product) => <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 3 }}><ProductCard product={product} /></Grid>)}</Grid> : <Box><Grid container spacing={4}>{selectedFood.map((food) => <Grid key={food.id} size={{ xs: 12, sm: 6, lg: selectedFood.length === 1 ? 5 : 6 }} sx={selectedFood.length === 1 ? { mx: "auto" } : undefined}><FoodCard food={food} /></Grid>)}</Grid></Box>}
      </Container>
    </Section>
  );
}
