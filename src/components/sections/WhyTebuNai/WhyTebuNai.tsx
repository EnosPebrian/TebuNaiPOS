import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import GrassOutlinedIcon from "@mui/icons-material/GrassOutlined";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { Stack } from "@mui/material";

const features = [
  {
    title: "Pressed Fresh",
    description: "Every bottle is freshly pressed after you place your order.",
    icon: <SpaOutlinedIcon fontSize="large" />,
  },
  {
    title: "No Preservatives",
    description: "No preservatives, no artificial coloring, no added sugar.",
    icon: <WaterDropOutlinedIcon fontSize="large" />,
  },
  {
    title: "Pickup & Delivery",
    description: "Enjoy pickup or delivery directly from our store.",
    icon: <LocalShippingOutlinedIcon fontSize="large" />,
  },
  {
    title: "Natural Ingredients",
    description: "Made from selected sugarcane and real fruits.",
    icon: <GrassOutlinedIcon fontSize="large" />,
  },
];

export default function WhyTebuNai() {
  return (
    <Section>
      <Container>
        <Typography
          variant="overline"
          color="primary"
          sx={{
            letterSpacing: 4,
            fontWeight: 700,
          }}
        >
          WHY TEBU NAI
        </Typography>

        <Typography
          variant="h2"
          sx={{
            mt: 2,
            mb: 8,
            fontWeight: 800,
            maxWidth: 520,
          }}
        >
          Freshly Pressed.
          <br />
          Naturally Better.
        </Typography>

        <Grid
          container
          spacing={8}
          sx={{
            alignItems: "center",
          }}
        >
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mt: 2,
                maxWidth: 470,
                lineHeight: 1.9,
              }}
            >
              Every bottle is freshly pressed from carefully selected sugarcane
              and blended with real fruits. No preservatives, no added sugar,
              just honest freshness in every sip.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={6}>
              {features.map((feature) => (
                <Stack
                  key={feature.title}
                  direction="row"
                  spacing={3}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      boxShadow: "0 10px 30px rgba(47,111,79,.08)",
                      borderRadius: "50%",
                      bgcolor: "rgba(47,111,79,.08)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "primary.main",
                      flexShrink: 0,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {feature.title}
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.8,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Section>
  );
}
