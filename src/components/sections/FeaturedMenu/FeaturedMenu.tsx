"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ProductCard from "@/components/sections/SignatureCollection/ProductCard";
import { foods } from "@/domain/catalog/food";
import { products } from "@/data/products";
import FoodCard from "./FoodCard";

const menuCategories = [
  { id: "sugarcane-juice", name: "Sugarcane Juice" },
  { id: "main-course", name: "Main Course" },
  { id: "snacks", name: "Snacks" },
  { id: "alcoholic-beverage", name: "Alcoholic Beverage" },
] as const;

type MenuCategoryId = (typeof menuCategories)[number]["id"];

export default function FeaturedMenu() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryId>("sugarcane-juice");
  const selectedFood = foods
    .filter((food) => food.categoryId === selectedCategory && (food.enabled || selectedCategory === "alcoholic-beverage"))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <Section id="menu">
      <Container>
        <Stack spacing={2} sx={{ mb: 5, textAlign: "center" }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 4, fontWeight: 700 }}>THE MENU</Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: "2.1rem", md: "2.8rem" } }}>Discover Tebu Nai.</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 620, mx: "auto", lineHeight: 1.8 }}>
            Freshly pressed sugarcane juice, comforting meals, and small bites. Find your favorite, made to your taste.
          </Typography>
        </Stack>
        <Tabs
          value={selectedCategory}
          onChange={(_, value: MenuCategoryId) => setSelectedCategory(value)}
          aria-label="Menu categories"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          selectionFollowsFocus
          sx={{ mb: 5, borderBottom: 1, borderColor: "divider", "& .MuiTab-root": { minHeight: 64, fontWeight: 700, px: { xs: 2, md: 4 } } }}
        >
          {menuCategories.map((category) => (
            <Tab key={category.id} id={`menu-tab-${category.id}`} value={category.id} label={category.name} aria-controls={`menu-panel-${category.id}`} />
          ))}
        </Tabs>
        {menuCategories.map((category) => (
          <Box key={category.id} role="tabpanel" hidden={selectedCategory !== category.id} id={`menu-panel-${category.id}`} aria-labelledby={`menu-tab-${category.id}`} tabIndex={0}>
            {selectedCategory === category.id && (
              category.id === "sugarcane-juice" ? (
                <Grid container spacing={4}>
                  {products.map((product) => <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 3 }}><ProductCard product={product} /></Grid>)}
                </Grid>
              ) : (
                <Grid container spacing={4}>
                  {selectedFood.map((food) => (
                    <Grid key={food.id} size={{ xs: 12, sm: 6, lg: selectedFood.length === 1 ? 5 : 6 }} sx={selectedFood.length === 1 ? { mx: "auto" } : undefined}>
                      <FoodCard food={food} />
                    </Grid>
                  ))}
                </Grid>
              )
            )}
          </Box>
        ))}
      </Container>
    </Section>
  );
}
