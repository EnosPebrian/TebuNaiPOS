"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItemButton, ListItemText, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { WHATSAPP_URL } from "@/config/whatsapp";

const navItems = [{ label: "Menu", href: "/#menu" }, { label: "Story", href: "/#story" }];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AppBar component="header" elevation={0} color="transparent" sx={{ mt: 2, px: { xs: 1.5, md: 3 }, background: "transparent", boxShadow: "none" }}>
        <Toolbar component="nav" aria-label="Main navigation" sx={{ maxWidth: 1280, width: "100%", mx: "auto", px: 3, py: 1, borderRadius: 999, background: scrolled ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.85)", backdropFilter: "blur(18px)", border: "1px solid rgba(47,111,79,.12)", transition: ".35s", boxShadow: scrolled ? "0 12px 40px rgba(0,0,0,.08)" : "none" }}>
          <Typography component={Link} href="/" variant="h5" sx={{ fontWeight: 700, flexGrow: 1, textDecoration: "none", color: "inherit" }}>Tebu Nai</Typography>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {navItems.map((item) => <Button key={item.label} component={Link} href={item.href} color="inherit">{item.label}</Button>)}
            <Button variant="contained" component="a" href={WHATSAPP_URL ?? undefined} target="_blank" rel="noopener noreferrer" disabled={!WHATSAPP_URL} sx={{ borderRadius: 999, px: 3 }}>Order Online</Button>
          </Box>
          <IconButton sx={{ display: { md: "none" }, color: "inherit" }} onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu" aria-expanded={drawerOpen} aria-controls={drawerOpen ? "mobile-navigation" : undefined}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} slotProps={{ paper: { sx: { width: "min(320px, 90vw)" } } }}>
        <Box component="nav" aria-label="Mobile navigation" id="mobile-navigation" sx={{ p: 2 }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 700 }}>Tebu Nai</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close navigation menu"><CloseRoundedIcon /></IconButton>
          </Stack>
          <List>
            {navItems.map((item) => <ListItemButton key={item.label} component={Link} href={item.href} onClick={() => setDrawerOpen(false)}><ListItemText primary={item.label} /></ListItemButton>)}
          </List>
          <Button fullWidth variant="contained" component="a" href={WHATSAPP_URL ?? undefined} target="_blank" rel="noopener noreferrer" disabled={!WHATSAPP_URL}>Order Online</Button>
          {!WHATSAPP_URL && <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>WhatsApp ordering is being set up.</Typography>}
        </Box>
      </Drawer>
    </>
  );
}
