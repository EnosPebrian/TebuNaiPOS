"use client";
import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { DeliveryDriver } from "@/domain/fulfillment/fulfillment";

export default function DriverAssignment({ current, busy, onAssign }: { current?: DeliveryDriver; busy: boolean; onAssign: (driver: DeliveryDriver | null) => void }) {
  const [name, setName] = useState(current?.name ?? "");
  const [phone, setPhone] = useState(current?.phone ?? "");
  return <Box component="section" aria-label="Driver assignment" sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, "& .MuiInputLabel-root, & .MuiFormHelperText-root": { color: "text.primary" } }}>
    <Typography component="h3" variant="h6" sx={{ mb: 2 }}>Driver assignment</Typography>
    <Stack spacing={2}>
      <TextField label="Driver name" value={name} onChange={(event) => setName(event.target.value)} disabled={busy} slotProps={{ htmlInput: { maxLength: 100 } }} />
      <TextField label="Driver phone (optional)" value={phone} onChange={(event) => setPhone(event.target.value)} disabled={busy} slotProps={{ htmlInput: { maxLength: 30, inputMode: "tel" } }} />
      <Typography variant="body2">Use the staff note above to explain reassignment or removal. Assignment is locked after handoff. No message is sent to the driver.</Typography>
      <Button variant="outlined" disabled={busy || name.trim().length < 2} onClick={() => onAssign({ name, phone })}>{current ? "Save driver" : "Assign driver"}</Button>
      {current && <Button color="error" disabled={busy} onClick={() => onAssign(null)}>Remove driver</Button>}
    </Stack>
  </Box>;
}
