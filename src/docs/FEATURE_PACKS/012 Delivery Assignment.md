# Delivery driver assignment

Delivery orders reuse the existing Fulfillment and Order models. Staff confirm the delivery quote first, then assign a driver while the order is confirmed, preparing or ready. Driver name is required; phone is optional and is never invented. Names/contact values are normalized and validated. New assignment snapshots are immutable.

Reassignment or removal requires a staff note. Assignments cannot change after handoff or closure; pickup orders cannot have a driver. A new transition to Out for delivery requires an assignment. Deliveries already handed off before this release can still record payment and complete without retroactively adding one. Existing delivery-fee, payment and completion rules remain authoritative.

The existing protected PATCH endpoint verifies session, Origin, input limits and the current order version. Concurrent staff assignments cannot silently overwrite each other. History retains actor, time, note and each delivery-driver snapshot, including explicit unassigned states. The order card/details and protected print slip show the current assignment. Assignment does not send a driver message, charge a customer or issue a refund.

All orders and Kitchen queue can filter assigned or unassigned deliveries. Choosing the assignment filter in the UI selects Delivery; choosing Pickup clears it. The API rejects contradictory pickup/driver filters and arbitrary assignment values. Unassigned legacy delivery documents remain discoverable without a migration.

Driver contact details stay in authenticated staff views and print slips. Public checkout retries explicitly omit driver information even if staff have assigned the saved order. JSON reports/CSV retain their minimal reporting projection and do not expose driver contacts. No public tracking page, driver account, routing service or external notification integration is introduced.

Validation covers assignment normalization/immutability, quote/confirmation prerequisites, pickup rejection, audit-note requirements, concurrent assignment/version conflicts, handoff locks, legacy handoff compatibility, strict public/staff request shapes, assignment filters, private checkout retries, print content, report privacy, and desktop/mobile accessibility throughout the delivery lifecycle.
