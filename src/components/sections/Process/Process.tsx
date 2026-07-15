import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

const steps = [
  { number: "01", title: "Choose your blend", description: "Pick a fresh sugarcane blend and the bottle size that suits your day." },
  { number: "02", title: "Make it yours", description: "Add your favourite fruit or herbal toppings for a drink made to order." },
  { number: "03", title: "Pressed fresh", description: "We prepare your order with natural ingredients and fresh-pressed sugarcane." },
];

export default function Process() {
  return (
    <Section>
      <Container>
        <Stack spacing={2} sx={{ maxWidth: 640, mb: 7 }}>
          <Typography variant="overline" color="primary" sx={{ letterSpacing: 3, fontWeight: 700 }}>HOW IT WORKS</Typography>
          <Typography variant="h2">Freshness, made simple.</Typography>
        </Stack>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 3 }}>
          {steps.map((step) => (
            <Box key={step.number} sx={{ p: 4, border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper" }}>
              <Typography color="primary" sx={{ fontWeight: 700, letterSpacing: 1 }}>{step.number}</Typography>
              <Typography variant="h5" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>{step.title}</Typography>
              <Typography color="text.secondary">{step.description}</Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Section>
  );
}
