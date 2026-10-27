# Saved Orders and Protected Admin

## Scope

Continue the existing Catalog, ConfiguredProduct, Pricing, Cart, Checkout, Order, Customer and Fulfillment domains. MongoDB storage implements OrderRepository. A single configured owner manages saved order requests. No catalog/POS/inventory redesign or alcohol activation is included.

## Checkout

The server accepts only validated product configurations, quantities and customer/fulfillment details. It reprices using the existing engine, generates the reference/time and saves an immutable Order snapshot. The existing cart remains intact. A stable key for retries and a unique database index prevent duplicate inserts for the same request. A changed payload under that key is rejected.

Saving is distinct from sending WhatsApp, accepting an order and receiving payment. Customer data storage is explained before submission. Unconfigured storage preserves the existing WhatsApp-only mode. A configured but unavailable database produces a retryable error without pretending to save.

## Staff operations

Pending → Confirmed → Preparing → Ready → Completed (pickup).

Pending → Confirmed → Preparing → Ready → Picked Up / Out for Delivery → Completed (delivery).

Quote delivery before confirmation. Record actual payment received before completion. Require a cancellation reason; do not imply refunds. Completed/cancelled orders are closed. Every update uses an expected version and appends actor, timestamp, status, payment state, delivery fee, total and note in the same atomic document update.

## Boundaries

- Encrypted HTTP-only, SameSite Strict session; Secure on HTTPS; eight-hour expiry.
- Credentials are salted scrypt hashes in private settings, not source/client code. Missing settings fail closed. Hash rotation invalidates old sessions.
- Authorize each admin page and each admin API; private data never relies on hiding controls.
- Check the exact configured Origin on writes, bound request streams, validate strict schemas and use shared database request limits.
- No public order list/detail API. Return no raw database errors, request fingerprints or internal idempotency keys.
- Single-owner login and global shared limits are intentional first-release constraints. Production setup needs fresh credentials, HTTPS, authenticated/private MongoDB and explicit deployment approval.

## Local operation

`npm run setup:local` creates ignored local configuration and an access file. `npm run db:local` starts real MongoDB on loopback with a persistent data directory. Browser tests use an isolated temporary MongoDB process, separate generated credentials and synthetic orders, then clean up that test instance.

See README.md for commands, settings and the exact manual-payment limits.
