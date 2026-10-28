"use client";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import type { OrderFilters as Filters } from "@/domain/order/query";
import { kitchenStatuses, orderStatuses, statusLabels } from "@/domain/order/lifecycle";

export default function OrderFilters({ value, onChange, onApply, onReset, busy, kitchen }: { value: Filters; onChange: (value: Filters) => void; onApply: () => void; onReset: () => void; busy: boolean; kitchen: boolean }) {
  return <Box component="form" aria-label="Order filters" onSubmit={(event) => { event.preventDefault(); onApply(); }} sx={{ mb: 3, "& .MuiInputLabel-root, & .MuiFormHelperText-root": { color: "text.primary" } }}>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2 }}>
      <TextField label="Order reference" value={value.reference ?? ""} onChange={(event) => onChange({ ...value, reference: event.target.value })} disabled={busy} helperText="Full reference or first 8 characters" slotProps={{ htmlInput: { maxLength: 36 } }} />
      <TextField select label="Order status" value={value.status ?? ""} onChange={(event) => onChange({ ...value, status: event.target.value as Filters["status"] })} disabled={busy}><MenuItem value="">{kitchen ? "All active orders" : "All orders"}</MenuItem>{(kitchen ? kitchenStatuses : orderStatuses).map((status) => <MenuItem key={status} value={status}>{statusLabels[status]}</MenuItem>)}</TextField>
      <TextField select label="Payment" value={value.payment ?? ""} onChange={(event) => onChange({ ...value, payment: event.target.value as Filters["payment"] })} disabled={busy}><MenuItem value="">All payments</MenuItem><MenuItem value="paid">Paid</MenuItem><MenuItem value="unpaid">Unpaid</MenuItem></TextField>
      <TextField select label="Order source" value={value.source ?? ""} onChange={(event) => onChange({ ...value, source: event.target.value as Filters["source"] })} disabled={busy}><MenuItem value="">All sources</MenuItem><MenuItem value="counter">Counter</MenuItem><MenuItem value="online">Online</MenuItem></TextField>
      <TextField select label="Fulfillment" value={value.method ?? ""} onChange={(event) => onChange({ ...value, method: event.target.value as Filters["method"], ...(event.target.value === "pickup" ? { driver: undefined } : {}) })} disabled={busy}><MenuItem value="">All methods</MenuItem><MenuItem value="pickup">Pickup</MenuItem><MenuItem value="delivery">Delivery</MenuItem></TextField>
      <TextField select label="Driver assignment" value={value.driver ?? ""} onChange={(event) => onChange({ ...value, driver: event.target.value as Filters["driver"], ...(event.target.value ? { method: "delivery" } : {}) })} disabled={busy}><MenuItem value="">All assignments</MenuItem><MenuItem value="assigned">Assigned deliveries</MenuItem><MenuItem value="unassigned">Unassigned deliveries</MenuItem></TextField>
      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
        <TextField fullWidth type="date" label="From date (WIB)" value={value.from ?? ""} onChange={(event) => onChange({ ...value, from: event.target.value })} disabled={busy} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField fullWidth type="date" label="To date (WIB)" value={value.to ?? ""} onChange={(event) => onChange({ ...value, to: event.target.value })} disabled={busy} slotProps={{ inputLabel: { shrink: true } }} />
      </Stack>
    </Box>
    <Stack direction="row" spacing={1} sx={{ mt: 2 }}><Button type="submit" variant="contained" disabled={busy}>Apply filters</Button><Button type="button" onClick={onReset} disabled={busy}>Clear filters</Button></Stack>
  </Box>;
}
