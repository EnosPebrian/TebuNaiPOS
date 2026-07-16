"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { WHATSAPP_NUMBER } from "@/config/whatsapp";

const navItems = [
  {
    label: "Menu",
    href: "#menu",
  },
  {
    label: "Story",
    href: "#story",
  },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AppBar
        elevation={0}
        color="transparent"
        sx={{
          mt: 2,

          background: "transparent",

          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: 1280,

            width: "100%",

            mx: "auto",

            px: 3,

            py: 1,

            borderRadius: 999,

            background: scrolled
              ? "rgba(255,255,255,.78)"
              : "rgba(255,255,255,.45)",

            backdropFilter: "blur(18px)",

            border: "1px solid rgba(255,255,255,.5)",

            transition: ".35s",

            boxShadow: scrolled ? "0 12px 40px rgba(0,0,0,.08)" : "none",
          }}
        >
          <Typography
            component={Link}
            href="/"
            variant="h5"
            sx={{
              fontWeight: 700,
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Tebu Nai
          </Typography>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                href={item.href}
                color="inherit"
              >
                {item.label}
              </Button>
            ))}

            <Button
              variant="contained"
              color="primary"
              component="a"
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              sx={{
                borderRadius: 999,
                px: 3,
              }}
            >
              Open WhatsApp
            </Button>
          </Box>

          <IconButton
            sx={{ display: { md: "none" }, color: "inherit" }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 260 }}>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.label}
                component={Link}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}

            <Box sx={{ p: 2 }}>
              <Button fullWidth variant="contained" component="a" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
                Open WhatsApp
              </Button>
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
