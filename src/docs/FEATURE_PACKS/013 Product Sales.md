# Product sales

Sales reports now show completed product configurations, ranked by units, with quantities, distinct completed-order counts and saved item value. The same protected report query supplies the page, JSON and `format=products-csv` export; order CSV remains unchanged.

## Meaning

- Uses orders created in the selected inclusive WIB dates (up to 31 days) with current status completed. This is not a completion-date report. Later fulfillment changes historical figures.
- Active and cancelled orders are excluded, including paid cancellations. Older orders paid in the period do not contribute to product sales.
- Saved unit price multiplied by saved quantity includes toppings and excludes delivery. No current-catalog lookup or repricing occurs.
- Groups by saved product/configuration identifiers and labels. Toppings are included in saved product names, bottle sizes are in serving labels. Renamed snapshots remain separate. A configuration's order count counts each order once; counts across configurations overlap.
- Missing or empty legacy item arrays are excluded and counted in a visible incomplete-data warning. No item details are invented.
- Shows 50 configurations; CSV includes all. Existing 5,000 candidate-order cap and ten-second query limit apply. Shorten the period when exceeded.

## Access and privacy

Existing owner session and report rate limits apply. MongoDB projects only the item identifiers, saved labels, quantity and unit price needed for the breakdown. Domain output explicitly lists allowed fields. Neither export includes customer or driver details, staff notes, images or the raw configuration object. CSV uses UTF-8 BOM, quoted cells and spreadsheet-formula escaping. Responses are private and not cached.

## Verification and release

Unit coverage checks historical pricing, quantity multiplication, delivery exclusion, status/date boundaries, grouping, overlapping order counts, missing legacy details, CSV escaping and privacy. Existing desktop/mobile authenticated integration coverage completes a configured sale through the real temporary MongoDB, then checks JSON, product CSV, access control, duplicate format rejection, responsive display and accessibility.

Run `npm run validate` and `npm run test:e2e` (locally `PLAYWRIGHT_CHANNEL=chrome` when needed). Push a feature branch, pass GitHub and preview checks, merge the exact tested commit, and verify the matching production deployment. No database migration or new environment variables are required. A Git revert can restore the prior report behavior without changing saved orders.
