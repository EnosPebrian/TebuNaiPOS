"use client";
import { type FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert, Button, Container, Stack, TextField, Typography } from "@mui/material";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Sign-in failed.");
      setPassword(""); router.replace("/admin"); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to sign in."); }
    finally { setBusy(false); }
  }
  return <Container maxWidth="sm" sx={{ py: { xs: 6, md: 12 } }}>
    <Stack component="form" onSubmit={submit} spacing={3} sx={{ p: { xs: 3, md: 5 }, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 4 }}>
      <Typography variant="overline" color="primary">TEBU NAI · STAFF</Typography>
      <Typography component="h1" variant="h3" sx={{ fontSize: { xs: "2rem", sm: "2.5rem" } }}>Manage orders</Typography>
      <Typography color="text.secondary">Sign in to review and fulfill customer requests.</Typography>
      {!configured && <Alert severity="info">Admin access is not set up. The store owner must complete local or hosting configuration first.</Alert>}
      <TextField required label="Username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" disabled={busy || !configured} slotProps={{ htmlInput: { maxLength: 64 } }} />
      <TextField required label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" disabled={busy || !configured} slotProps={{ htmlInput: { maxLength: 128 } }} />
      {error && <Alert severity="error">{error}</Alert>}
      <Button type="submit" variant="contained" size="large" disabled={busy || !configured}>{busy ? "Signing in…" : "Sign in"}</Button>
      <Button component={Link} href="/">Back to the store</Button>
    </Stack>
  </Container>;
}
