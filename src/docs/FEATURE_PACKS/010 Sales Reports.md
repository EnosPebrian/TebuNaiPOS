# Sales reports

Staff open `/admin/reports` using the existing owner account. The page and `/api/admin/reports` both verify the encrypted staff session. The shared staff navigation links orders, kitchen, cashier and reports.

Dates are inclusive calendar dates in Asia/Jakarta (WIB). The repository uses an inclusive UTC lower bound and exclusive next-day UTC upper bound. Defaults are today's WIB date. Invalid/repeated filters, reversed ranges, and ranges over 31 days are rejected.

Order counts, source splits, completed order value, current active/cancelled status and pending delivery quotes use orders created in the selected period. Closed cancelled orders are not pending quotes. Payment counts/value use each order's first paid history event and that event's total. Subsequent fulfillment/payment-state history entries never count another receipt. Payments for older orders are included when first recorded in this period.

Paid orders that are currently cancelled remain in recorded payment value and appear separately. Refunds are not tracked or assumed. The page explicitly states that recorded values are not net revenue and exclude costs/reconciliation. Totals and status reflect the current saved state, so a historical report can change after later fulfillment or cancellation.

The existing OrderRepository exposes a reporting projection rather than a new commerce model. MongoDB reads only reference, dates, source, lifecycle, amounts and minimal payment history. Customer names, phones, addresses, notes, request keys, actor details and fingerprints are not returned or exported. An index on the history payment state/date supports payment-period selection. Reports reject more than 5,000 candidate orders instead of truncating totals. A 10-second database limit and shared 30-request/minute report limit bound work.

The page shows the first 20 references. CSV contains all matching references, period flags, current lifecycle, amounts and first payment timestamp. Missing delivery quotes remain blank. Date filters are WIB; timestamps are explicitly UTC. CSV includes a UTF-8 BOM, quoted cells and formula-prefix escaping. Downloads are authenticated, private/no-store and have a fixed safe filename derived only from validated dates.

Tests cover WIB midnight boundaries, leap/invalid dates, 31-day limits, repeated filters, source/status summaries, nullable quotes, older-order payments, repeated paid history events, paid cancellations, formula escaping, staff access, CSV privacy, actual MongoDB projections, desktop/mobile rendering and accessibility. No payment collection, refund processing or customer reporting endpoint is introduced.
