import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

import { products } from "@/data/products";

import ProductCard from "./ProductCard";

export default function SignatureCollection() {
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <Section>
      <Container>
        <Stack
          spacing={2}
          sx={{
            mb: 8,
            textAlign: "center",
          }}
        >
          <Typography
            variant="overline"
            color="primary"
            sx={{
              letterSpacing: 4,
              fontWeight: 700,
            }}
          >
            SIGNATURE COLLECTION
          </Typography>

          <Typography
            variant="h2"
            sx={{
              maxWidth: 700,
              mx: "auto",
            }}
          >
            Crafted from Nature.
            <br />
            Pressed Fresh Daily.
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 640,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            Explore our handcrafted sugarcane beverages, made from freshly
            pressed sugarcane and natural ingredients.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid
              key={product.id}
              size={{
                xs: 12,
                sm: 6,
                lg: 3,
              }}
            >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
