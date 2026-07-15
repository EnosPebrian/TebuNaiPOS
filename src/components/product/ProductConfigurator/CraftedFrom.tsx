import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { IngredientId } from "@/data/products";
import { ingredientMap } from "@/data/ingredients";

interface CraftedFromProps {
  ingredients: IngredientId[];
}

export default function CraftedFrom({ ingredients }: CraftedFromProps) {
  return (
    <Box
      sx={{
        mt: 5,
      }}
    >
      <Typography
        variant="overline"
        color="primary"
        sx={{
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        Crafted From
      </Typography>

      <Stack
        spacing={2}
        sx={{
          mt: 2,
        }}
      >
        {ingredients.map((id) => {
          const ingredient = ingredientMap[id];

          return (
            <Stack
              key={id}
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 28,
                }}
              >
                {ingredient.icon}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 500,
                }}
              >
                {ingredient.name}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
}
