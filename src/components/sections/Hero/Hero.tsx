import Grid from "@mui/material/Grid";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

export default function Hero() {
  return (
    <Section
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container>
        <Grid
          container
          spacing={6}
          sx={{
            alignItems: "center",
          }}
        >
          <Grid size={{ xs: 12, md: 7 }}>
            <HeroContent />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <HeroImage />
          </Grid>
        </Grid>
      </Container>
    </Section>
  );
}
