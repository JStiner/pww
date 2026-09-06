# Pressure Washer Warehouse storefront POC

Static proof of concept for a future P&W online catalog/order experience.

## Current scope

- Lowe's-inspired compact retail information architecture, reskinned for P&W.
- Static product/category data only; no database or QuickBooks connection.
- Search, category/brand filters, product-detail view, localStorage cart, service, rentals, about and contact views.
- Product pricing and availability are explicitly demonstration data.
- Business copy and product categories are based on the current `pwwillinois.com` site.
- Current-site photos are imported into `assets/img/inventory` by the one-time GitHub Actions workflow, with original URLs retained as browser fallbacks.

## Run locally

This is a static site. Serve the repository root with any HTTP server, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Important production decisions still open

1. Confirm QuickBooks Online vs. QuickBooks Desktop and version/plan.
2. Inventory cleanup/mapping rules: SKU, category, brand, online visibility, online sellability, pickup/shipping and quote-only behavior.
3. Confirm official business hours; the current P&W website contains conflicting hours blocks.
4. Replace demonstration prices/availability with real inventory data.
5. Decide payment, pickup/shipping and order-to-QuickBooks workflow.
6. Add Supabase-backed admin/product-image management only after catalog rules are settled.

## Data model direction

The static `assets/js/inventory.js` object intentionally mirrors fields that can later map into a database/catalog layer: product id, brand, category, subcategory, price, image, availability, summary and specs.
