# Tebu Nai Commerce

Next.js App Router, TypeScript and Material UI, preserving:

`Catalog → ConfiguredProduct → Pricing → Cart → Checkout → Order → Fulfillment`

The customer storefront supports bottle/topping configuration, exact IDR pricing, meals/snacks, a persistent browser cart and WhatsApp order requests. The saved-order release adds MongoDB storage and a protected, single-owner order dashboard. Rum remains informational and unavailable for ordering throughout the domain and server API.

## Local setup

Use Node.js 24 LTS:

```sh
npm ci
npm run setup:local
npm run db:local
```

Keep the database process running. In another terminal:

```sh
npm run dev -- --hostname 127.0.0.1 --port 3200
```

Open `http://127.0.0.1:3200` and `http://127.0.0.1:3200/admin`. The generated local username/password are in ignored `.local-data/admin-access.txt`; the password is never printed by setup. To deliberately rotate the local password and invalidate existing sessions: `npm run setup:local -- --reset-admin`.

The development runner starts a real MongoDB server bound to `127.0.0.1:27019`. Data persists in `.local-data/mongodb` when the runner stops. It downloads MongoDB's official binary on first use, which can be large on Windows. `MONGOMS_SYSTEM_BINARY` may point to a verified installed binary to avoid a repeat download. These local files and all `.env.local` settings are ignored by Git. Local MongoDB has no authentication and must stay bound to loopback; use an authenticated, TLS-protected managed database or private MongoDB service for deployment.

For a local production preview, use `npm run build` then `npm run start -- --hostname 127.0.0.1 --port 3200` instead of the dev command. `APP_ORIGIN` must match the exact browser origin, including its port.

## Configuration

Copy the blank `.env.example` when configuring a new environment. Public variables are embedded at build time and require a rebuild after changes:

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: confirmed business number in international digits; no fallback is invented. Missing configuration disables WhatsApp destinations.
- `NEXT_PUBLIC_SITE_URL`: real public origin for canonical metadata and sitemap. Leave blank for local work.

Private server settings:

- `MONGODB_URI`, `MONGODB_DB`: database connection and database name. Orders are stored in `orders`; shared request counters use `rate_limits` with a TTL index.
- `APP_ORIGIN`: exact HTTPS application origin. HTTP is accepted only on loopback for development. Writes require a matching Origin header.
- `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`: explicit owner account, salted scrypt hash, and a random encrypted-session secret of at least 32 characters. `setup:local` generates these for local development. Use fresh credentials and a fresh secret for production.

Do not place private settings in `NEXT_PUBLIC_*` variables or commit local credentials. Missing configuration fails closed for admin/API access. If storage is not configured, the storefront retains its previous WhatsApp-only preparation flow. If configured storage is unavailable, saving reports a failure and retains the cart; it never claims an order was saved.

## Order behavior

Checkout sends product configurations and quantities to `POST /api/orders`. The server validates customer/fulfillment details, rejects unavailable products including rum, and derives all prices from the catalog. Client prices/totals are not accepted. The server creates the reference and timestamp, saves the order, and returns the canonical snapshot for the WhatsApp message. Repeated requests with the same idempotency key cannot create duplicate orders; changing the payload under an existing key returns a conflict.

A saved order is an unpaid request awaiting merchant confirmation. Opening WhatsApp does not send a message or confirm payment. The cart remains available. Customer and delivery details are sent to the order system when the customer chooses Save; the checkout explains this before submission. Delivery fees/final totals remain unknown until the merchant quotes them.

Staff sign in at `/admin` to view paginated orders, filter by status, review customer/fulfillment/item details, and update an order:

- Awaiting confirmation → Confirmed → Preparing → Ready.
- Pickup: Ready → Completed.
- Delivery: Ready → Out for delivery → Completed.
- Cancellation is available before handoff and requires a reason.
- Delivery confirmation requires a quoted fee, including an explicitly entered zero when appropriate. Fees cannot change after confirmation.
- Payment received must be recorded manually before completion. Recording payment does not charge a customer; cancellation does not refund one.

Updates compare the order version atomically, preventing one staff session from silently overwriting another. History records the actor, timestamp, status, payment state, fee/total and staff note. Times display in Asia/Jakarta (WIB). Closed orders cannot be edited through these controls.

Admin pages and every admin API verify the encrypted HTTP-only session. Cookies use SameSite Strict, an eight-hour lifetime and Secure on HTTPS. Password-hash rotation invalidates old sessions. This release supports one configured owner account; individual staff roles, MFA, payment gateways, refunds, inventory, customer accounts and public order tracking remain outside this release. There is no public order-list/detail endpoint.

The database enforces unique request keys and indexes order date/status. Shared database limits allow 10 login attempts per 15-minute bucket and 120 checkout writes/120 admin updates per minute each. These limits are intentionally global for this single-store release and do not trust forwarded IP headers. Hosting traffic controls may be added for higher traffic; they must not replace the application authorization checks.

## Catalog pricing

| Product | Base IDR | Each topping IDR |
| --- | ---: | ---: |
| Juice 250 ml | 12,000 | 3,000 |
| Juice 500 ml | 17,000 | 3,000 |
| Juice 1500 ml | 35,000 | 5,000 |
| Nasi Bakar / Nasi Sop Ayam | 19,000 each | — |
| Risol Mayo / Risol Sayur–Rouguette | 6,000 each | — |
| Rum 250 ml, unavailable | 50,000 | — |

Cart limits remain 99 units per configuration and 100 distinct configurations. Valid stored lines are repriced from the catalog; corrupt/unavailable lines are dropped. ConfiguredProduct remains immutable. Pricing remains centralized. No alcoholic sales switch was introduced; a future alcohol release requires explicit owner authorization and confirmed licensing, age verification and sales requirements.

## Validation

```sh
npm run validate
npx playwright install chromium
npm run test:e2e
```

Validation runs zero-warning ESLint, strict TypeScript, unit tests and a production build. Browser tests run desktop/mobile storefront and admin scenarios against a real, isolated temporary MongoDB instance with generated test-only credentials; they do not use the development order database. They check persistence, duplicate prevention, access control, origin checks, server pricing, invalid/restricted inputs, conflicting edits, fulfillment/payment workflows, logout, keyboard behavior and automated accessibility. `PLAYWRIGHT_CHANNEL=chrome` selects installed Chrome locally. On restricted Windows runners, set TEMP/TMP to a writable scratch directory if Vite reports temporary-file rename errors.

The CI workflow validates and runs browser tests without publishing. For deployment, configure Node.js 24, a private authenticated MongoDB connection, exact HTTPS APP_ORIGIN, fresh admin credentials and the real public merchant/site variables. Run validation and inspect the store/admin flows before owner-authorized deployment. Build-time Google-font access is needed by the existing Next.js font setup. No deployment or payment processing is performed by these scripts.

References: [Next.js authentication](https://nextjs.org/docs/app/guides/authentication), [MongoDB compound operations](https://www.mongodb.com/docs/drivers/node/current/crud/compound-operations/), [iron-session](https://github.com/vvo/iron-session), [local MongoDB runner](https://typegoose.github.io/mongodb-memory-server/docs/guides/quick-start-guide/).
## Sales reports

Staff can open `/admin/reports` for a WIB date range of up to 31 days. Order counts and completed values use orders created in the period; recorded payments use the first paid history event, including older orders paid during the period. Paid cancellations are shown separately and remain included in recorded receipts. These are operational figures, not net revenue; refunds and costs are not tracked. Historical status figures may change as orders are fulfilled or cancelled.

The protected CSV export includes references, lifecycle, amounts and explicit WIB-period flags/UTC timestamps, with no customer contact details. The page displays up to 20 references; CSV includes all matches. Reports exceeding 5,000 candidate orders require a shorter date range. See [Sales reports](src/docs/FEATURE_PACKS/010%20Sales%20Reports.md).

## Cashier

Staff can open `/admin/pos` to search products, reuse juice configuration, and save pickup counter sales. The basket is stored separately from the customer cart. A phone is optional for a walk-in customer; online checkout still requires one. Counter sales are confirmed into the kitchen queue. Payment remains unpaid unless staff explicitly check that it has been received. Prices and availability are validated again by the server; rum remains unavailable.

The exact save request is retained in the current tab for safe retries after network failures or reloads. Retry an uncertain save before starting another sale. After success, use Print order slip or New sale. Optional customer details remain on the cashier device while a request is retained; use a trusted device. This release records manual payments only. See [Cashier POS](src/docs/FEATURE_PACKS/009%20Cashier%20POS.md).

## Kitchen queue and print slips

Staff can open `/admin/kitchen` for confirmed, preparing and ready orders sorted oldest first. Pending requests must be confirmed from All orders. Orders leave the queue when cancelled, completed or handed off for delivery. Status changes reuse the existing version-checked controls.

Each saved order has a protected Print order slip link. The print page includes the saved configuration, amounts, delivery quote and actual recorded payment/status, and hides its controls on paper. Unpaid requests remain clearly marked unpaid. No payment is collected by printing a slip.

The existing GitHub remote is EnosPebrian/TebuNaiPOS and the Vercel project is tebu-nai-pos. Deployments require the real production MongoDB connection, exact HTTPS APP_ORIGIN, fresh admin settings and the confirmed public merchant settings in Vercel; local `.env.local` and database files must never be published. Node.js is pinned to the 24.x release line. The Next.js and lint packages are aligned on 16.4.3 with compatible security fixes reflected in the lockfile.

## Order search and automatic refresh

All orders and Kitchen queue support reference-prefix search (at least 8 characters), payment/source/fulfillment/status filters and optional paired WIB creation dates (up to 31 days). Apply filters starts at page one; Clear filters restores the view. Updates reload matching rows and counts, and the server corrects a page that no longer exists. Cards show payment and source. Filters reset on a full reload.

Kitchen refresh defaults on every 30 seconds; All orders can opt in. Background refresh pauses while the tab is hidden, an order drawer is open or filters are being edited. Failures retain the prior data and show an error. The last-updated time changes only after a successful read. Existing version checks still protect staff changes. See [Order operations](src/docs/FEATURE_PACKS/011%20Order%20Operations.md).
