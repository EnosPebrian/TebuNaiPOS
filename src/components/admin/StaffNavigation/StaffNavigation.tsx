"use client";
import Link from "next/link";
import { Button, Stack } from "@mui/material";

const links = [{ id: "orders", label: "All orders", href: "/admin" }, { id: "kitchen", label: "Kitchen queue", href: "/admin/kitchen" }, { id: "pos", label: "Cashier", href: "/admin/pos" }, { id: "reports", label: "Reports", href: "/admin/reports" }] as const;
export default function StaffNavigation({ active }: { active: (typeof links)[number]["id"] }) {
  return <Stack component="nav" aria-label="Staff navigation" direction="row" spacing={1} useFlexGap sx={{ mb: 3, flexWrap: "wrap" }}>{links.map((link) => <Button key={link.id} component={Link} href={link.href} variant={active === link.id ? "contained" : "outlined"} aria-current={active === link.id ? "page" : undefined}>{link.label}</Button>)}</Stack>;
}
