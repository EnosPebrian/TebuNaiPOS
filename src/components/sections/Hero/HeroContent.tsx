import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

export default function HeroContent() {
  return (
    <Stack spacing={4}>
      {/* Eyebrow */}

      <Typography
        sx={{
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "primary.main",
          fontSize: ".82rem",
        }}
      >
        Premium Fresh Sugarcane Juice
      </Typography>

      {/* Heading */}

      <Typography
        variant="h1"
        sx={{
          fontWeight: 800,

          lineHeight: 0.95,

          letterSpacing: "-0.04em",

          maxWidth: 680,
        }}
      >
        Nature's Sweetness.
        <br />
        Pressed Fresh.
      </Typography>

      {/* Description */}

      <Typography
        color="text.secondary"
        sx={{
          mt: 4,

          maxWidth: 620,

          color: "text.secondary",

          lineHeight: 1.9,

          fontSize: {
            xs: 18,
            md: 21,
          },
        }}
      >
        Every cup is freshly pressed from carefully selected sugarcane and
        served immediately, bringing you the pure sweetness of nature in every
        sip.
      </Typography>

      {/* Buttons */}

      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: 6,
        }}
      >
        <PrimaryButton>Order Online</PrimaryButton>

        <SecondaryButton>Explore Menu</SecondaryButton>
      </Stack>

      {/* Badges */}

      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{
          mt: 7,
        }}
      >
        <Typography color="text.secondary">✓ Made Fresh Daily</Typography>

        <Typography color="text.secondary">✓ Pressed to Order</Typography>

        <Typography color="text.secondary">✓ Natural Ingredients</Typography>
      </Stack>
    </Stack>
  );
}
