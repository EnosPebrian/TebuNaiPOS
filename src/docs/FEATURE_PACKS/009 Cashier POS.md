# Cashier POS

Staff open `/admin/pos` from All orders or Kitchen queue. Existing owner authentication protects both the page and `POST /api/admin/pos`.

The cashier searches enabled catalog products, configures juice with the shared bottle/topping drawer, and adds meals/snacks. The shared cart provider uses a separate `tebunai-counter-cart-v1` storage key. It never changes the customer storefront cart.

Counter sales use the existing ConfiguredProduct, Pricing, Order and Fulfillment models. They are pickup orders accepted by staff, initially confirmed and visible in the kitchen queue. The pickup name defaults to the descriptive label “Walk-in customer”; a phone is optional and never invented. A supplied phone must be valid. Online checkout still requires a phone and merchant confirmation.

Payment is unpaid unless the cashier explicitly checks “I have received payment.” This only records a manual payment and never charges a customer. The server derives prices, rejects client totals/statuses and unavailable products, and saves the actor/payment state in initial history. The existing fulfillment transitions and protected print slip are reused. No inventory or refund behavior is implied.

The cashier request key and exact payload are retained in session storage before transmission. Double clicks, concurrent retries and reloads reuse the same request. An uncertain result locks further entry until Retry retrieves the canonical order. After success, New sale deliberately clears that request. Do not clear browser storage to work around an uncertain result: check All orders first. Browser drafts contain optional customer details; use a dedicated trusted cashier device and close the tab after work. A lost device or cleared browser storage cannot recover an unsent draft.

The request-key namespace includes the authenticated actor and counter channel, separate from online checkout. Writes require the configured Origin and share a server-side counter limit. Rum remains disabled at catalog and server validation layers.

Checks cover pricing, payment opt-in, online invariants, staff access, origin rejection, forged totals, concurrent duplicates, lost-response/reload recovery, customer-cart separation, print slips, and desktop/mobile accessibility.
