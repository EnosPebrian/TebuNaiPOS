# Kitchen Queue and Order Slips

The protected `/admin/kitchen` view reuses the existing OrderDashboard, order repository and status controls. It lists only confirmed, preparing and ready orders, oldest first. Pending requests require confirmation from All orders. Completed, cancelled and handed-off delivery orders leave the kitchen queue. Filters accept only active kitchen states. Pagination and optimistic version checks remain in force.

The protected `/admin/orders/[id]/print` view produces an order slip from the saved canonical snapshot. It displays the reference, Jakarta timestamp, customer/fulfillment details, configuration, quantities, prices, quoted delivery fee, total and actual recorded payment/status. An unpaid request is never labelled paid. Print controls disappear in print media. Authentication is checked before any order lookup, and the page inherits admin noindex metadata.

These are operational tools for the existing commerce flow. No new Cart, Pricing or Order concepts, payment gateway, inventory system, public order lookup or alcohol-sales switch is introduced.

Deployment continues through the existing GitHub/Vercel project. Local database files and credentials must stay ignored; a production MongoDB connection, exact HTTPS origin and fresh admin credentials belong in Vercel environment settings.
