import { redirect } from "next/navigation";
import { Alert, Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { currentAdmin } from "@/lib/server/admin";
import { enforceLimit } from "@/lib/server/database";
import { parseReportRange } from "@/lib/server/reportInput";
import { orderRepository } from "@/lib/server/mongoOrderRepository";
import { HttpError } from "@/lib/server/http";
import { wibToday, type SalesReport } from "@/domain/order/report";
import { formatMoney } from "@/domain/money";
import { statusLabels } from "@/domain/order/lifecycle";
import StaffNavigation from "@/components/admin/StaffNavigation";
import ProductSales from "@/components/admin/ProductSales";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const username = await currentAdmin();
  if (!username) redirect("/admin/login");
  const query = await searchParams;
  const params = new URLSearchParams();
  for (const key of ["from", "to"]) { const value = query[key]; if (Array.isArray(value)) value.forEach((entry) => params.append(key, entry)); else if (value !== undefined) params.set(key, value); }
  let report: SalesReport | null = null;
  let error = "";
  try { const range = parseReportRange(params); await enforceLimit("reports", 30, 60_000); report = await orderRepository.report(range); }
  catch (cause) { error = cause instanceof HttpError ? cause.message : "Reports are unavailable. Please retry shortly."; }
  const from = typeof query.from === "string" ? query.from : wibToday();
  const to = typeof query.to === "string" ? query.to : wibToday();
  const metrics = report ? [
    ["Orders created", String(report.created)], ["Counter / online", `${report.counter} / ${report.online}`],
    ["Completed orders", String(report.completed)], ["Completed order value", formatMoney(report.completedValue)],
    ["Active / cancelled", `${report.active} / ${report.cancelled}`], ["Delivery quotes pending", String(report.pendingQuotes)],
    ["Payments recorded", String(report.receipts)], ["Recorded payment value", formatMoney(report.receivedValue)],
    ["Recorded payments now cancelled", `${report.cancelledReceipts} · ${formatMoney(report.cancelledReceivedValue)}`],
  ] : [];
  return <main id="main-content" tabIndex={-1}><Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 }, overflowWrap: "anywhere", "& .MuiInputLabel-root": { color: "text.primary" } }}>
    <Typography variant="overline" color="primary">TEBU NAI · {username}</Typography><Typography component="h1" variant="h3" sx={{ fontSize: { xs: "2.2rem", md: "3rem" }, mb: 2 }}>Sales reports</Typography>
    <StaffNavigation active="reports" />
    <Typography sx={{ mb: 2 }}>Dates use Asia/Jakarta (WIB). Choose up to 31 days.</Typography>
    <Stack component="form" method="get" direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
      <TextField type="date" name="from" label="From date (WIB)" defaultValue={from} required slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: "2000-01-01", max: "2099-12-31" } }} />
      <TextField type="date" name="to" label="To date (WIB)" defaultValue={to} required slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: "2000-01-01", max: "2099-12-31" } }} />
      <Button type="submit" variant="contained">View report</Button>
    </Stack>
    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
    {report && <>
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>{report.range.from} to {report.range.to} · WIB</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 2, mb: 3 }}>
        {metrics.map(([label, value]) => <Box key={label} component="section" aria-label={label} sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper" }}><Typography component="h3" variant="subtitle1">{label}</Typography><Typography sx={{ fontSize: "1.6rem", fontWeight: 700 }}>{value}</Typography></Box>)}
      </Box>
      <Alert severity="info" sx={{ mb: 3 }}>Order counts and completed value use orders created in this period and their current status. Payments use the first payment-recorded event, including payments for older orders. Paid cancellations remain included and are shown separately. These figures are not net revenue; refunds, costs and reconciliation are not tracked.</Alert>
      <Button component="a" href={`/api/admin/reports?from=${report.range.from}&to=${report.range.to}&format=csv`} variant="outlined" sx={{ mb: 3 }}>Download CSV</Button>
      <ProductSales report={report} />
      <Typography component="h2" variant="h5" sx={{ mb: 1 }}>Order references</Typography>
      <Typography sx={{ mb: 2 }}>Showing {Math.min(20, report.rows.length)} of {report.rows.length} matching orders. CSV includes all matching references and no customer contact details. Times in CSV are UTC; its date filters are WIB.</Typography>
      {!report.rows.length && <Alert severity="info">No orders or recorded payments in this period.</Alert>}
      <Stack spacing={2}>{report.rows.slice(0, 20).map((row) => <Box key={row.id} component="article" sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <Typography component="h3" variant="subtitle1">{row.id}</Typography><Typography>{row.source === "counter" ? "Counter" : "Online"} · {statusLabels[row.status]} · {row.paymentStatus}</Typography>
        <Typography>Total: {row.total === null ? "Pending delivery quote" : formatMoney(row.total)}</Typography><Typography>Created in period: {row.createdInPeriod ? "Yes" : "No"} · Payment recorded in period: {row.receivedInPeriod ? "Yes" : "No"}</Typography>
      </Box>)}</Stack>
    </>}
  </Container></main>;
}
