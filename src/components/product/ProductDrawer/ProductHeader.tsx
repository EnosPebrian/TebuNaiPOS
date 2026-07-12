import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ProductHeaderProps {
  category: string;
  name: string;
  description: string;
}

export default function ProductHeader({
  category,
  name,
  description,
}: ProductHeaderProps) {
  return (
    <Box>
      <Typography
        variant="overline"
        color="primary"
        sx={{
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        {category}
      </Typography>

      <Typography
        variant="h4"
        sx={{
          mt: 1,

          fontWeight: 800,

          letterSpacing: "-0.03em",
        }}
      >
        {name}
      </Typography>

      <Typography
        sx={{
          mt: 2,

          color: "text.secondary",

          lineHeight: 1.8,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
