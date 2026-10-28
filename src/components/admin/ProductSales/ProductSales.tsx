import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import type { SalesReport } from "@/domain/order/report";
import { formatMoney } from "@/domain/money";

export default function ProductSales({ report }: { report: SalesReport }) {
  return <Box component="section" aria-labelledby="product-sales-heading" sx={{ mb: 4 }}>
    <Typography id="product-sales-heading" component="h2" variant="h5" sx={{ mb: 1 }}>Product sales</Typography>
    <Typography sx={{ mb: 2 }}>Completed orders created in this WIB period only. Saved configurations include toppings; serving sizes and historical names stay separate. Item value includes toppings and excludes delivery. These are fulfilled sales figures, not payment receipts or current inventory.</Typography>
    <Typography sx={{ mb: 2, fontWeight: 700 }}>{report.productUnits} {report.productUnits === 1 ? "unit" : "units"} · {formatMoney(report.productValue)} item value</Typography>
    {report.missingItemOrders > 0 && <Alert severity="warning" sx={{ mb: 2 }}>{report.missingItemOrders} completed orders have no saved item details and are excluded from product totals. Product totals are incomplete.</Alert>}
    <Button component="a" href={`/api/admin/reports?from=${report.range.from}&to=${report.range.to}&format=products-csv`} variant="outlined" sx={{ mb: 2 }}>Download product CSV</Button>
    {!report.products.length ? <Alert severity="info">No completed order items in this period.</Alert> : <>
      <Typography sx={{ mb: 2 }}>Showing {Math.min(50, report.products.length)} of {report.products.length} configurations, ranked by units sold. Product CSV includes all configurations and no customer or driver details. Order counts per configuration can overlap.</Typography>
      <Stack spacing={2}>{report.products.slice(0, 50).map((row) => <Box key={JSON.stringify([row.productId, row.variantId, row.productName, row.variantLabel])} component="article" aria-label={`${row.productName} · ${row.variantLabel}`} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.paper" }}>
        <Typography component="h3" variant="subtitle1">{row.productName}</Typography>
        <Typography>{row.variantLabel}</Typography>
        <Typography>{row.quantity} {row.quantity === 1 ? "unit" : "units"} · {row.orders} completed {row.orders === 1 ? "order" : "orders"} · {formatMoney(row.itemValue)}</Typography>
      </Box>)}</Stack>
    </>}
  </Box>;
}
