import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export default function OurStory() {
  return (
    <Section id="story">
      <Container>
        <Typography
          variant="overline"
          color="primary"
          sx={{
            letterSpacing: 4,
            fontWeight: 700,
          }}
        >
          WHY WE STARTED
        </Typography>

        <Typography
          variant="h2"
          sx={{
            mt: 2,
            maxWidth: 700,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          Nature already
          <br />
          knows sweetness.
        </Typography>

        <Grid
          container
          spacing={10}
          sx={{
            mt: 8,
            alignItems: "center",
          }}
        >
          {/* LEFT */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={5}>
              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.9,
                }}
              >
                Before Tebu Nai became a business, it began with a season of
                reflection.
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: 34,
                    md: 48,
                  },
                  fontWeight: 700,
                  lineHeight: 1.18,
                  letterSpacing: "-0.03em",
                }}
              >
                “What kind of business can genuinely bring value to people's
                lives?”
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.9,
                }}
              >
                We didn't want to build just another drink brand. We wanted to
                create something that genuinely serves people.
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.9,
                }}
              >
                As we reflected on the drinks people enjoy every day, one simple
                truth became impossible to ignore.
              </Typography>

              <Typography
                sx={{
                  fontSize: 34,
                  fontWeight: 700,
                  color: "primary.main",
                  lineHeight: 1.2,
                }}
              >
                Nature already knows sweetness.
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.9,
                }}
              >
                Sugarcane carries its own sweetness, shaped patiently by nature.
                Instead of changing what nature has already done so well, we
                simply preserve it—pressing every bottle fresh to order and
                pairing it with real fruits and natural ingredients.
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  lineHeight: 1.9,
                }}
              >
                We hope every bottle encourages people to rediscover the simple
                goodness that nature has already provided.
              </Typography>
            </Stack>
          </Grid>

          {/* RIGHT */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: {
                  xs: 420,
                  md: 680,
                },
              }}
            >
              <Image
                src="/images/hero-bottle-v2.png"
                alt="Fresh sugarcane juice"
                fill
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            mt: 14,
            mb: 10,
          }}
        />

        <Box
          sx={{
            py: {
              xs: 6,
              md: 10,
            },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 34,
                md: 58,
              },
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              maxWidth: 900,
              mx: "auto",
            }}
          >
            Nature already knows sweetness.
            <br />
            Our role is simply to preserve it.
          </Typography>
        </Box>
      </Container>
    </Section>
  );
}
