"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { WHATSAPP_URL } from "@/config/whatsapp";

export default function HeroContent() {
  return (
    <Stack spacing={4}>
      <Typography sx={{ letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, color: "primary.main", fontSize: ".82rem" }}>
        Premium Fresh Sugarcane Juice
      </Typography>
      <Typography variant="h1" sx={{ fontWeight: 800, lineHeight: 0.98, letterSpacing: "-0.04em", maxWidth: 680, fontSize: { xs: "3rem", sm: "4.5rem", lg: "6rem" } }}>
        Nature&apos;s Sweetness.<br />Pressed Fresh.
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 620, lineHeight: 1.9, fontSize: { xs: 18, md: 21 } }}>
        Every bottle is freshly pressed from carefully selected sugarcane, bringing you the pure sweetness of nature in every sip.
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "stretch", sm: "center" } }}>
        <PrimaryButton component="a" href={WHATSAPP_URL ?? undefined} disabled={!WHATSAPP_URL} aria-describedby={!WHATSAPP_URL ? "hero-order-status" : undefined}>
          Order Online
        </PrimaryButton>
        <SecondaryButton component="a" href="/#menu">Explore Menu</SecondaryButton>
      </Stack>
      {!WHATSAPP_URL && <Typography id="hero-order-status" variant="body2" color="text.secondary">WhatsApp ordering is being set up. You can still explore the menu and prepare your cart.</Typography>}
      <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
        <Typography color="text.secondary">✓ Made Fresh Daily</Typography>
        <Typography color="text.secondary">✓ Pressed to Order</Typography>
        <Typography color="text.secondary">✓ Natural Ingredients</Typography>
      </Stack>
    </Stack>
  );
}
