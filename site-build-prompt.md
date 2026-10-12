You are building an ecommerce website for a small startup in Nepal. The site is also the shop's inventory system: there is no other stock system to sync with. Build it step by step in the order given under "Build order", and stop after each step so I can review before you continue.

Fill in the bracketed parts before using this prompt.

## Business

- Shop name: The Vanvasi Project
- What it sells: flavoured butters, currently Hot Honey Butter and Garlic Butter. The range is small and will grow a flavour at a time.
- Location: Lazimpat, Nursery Road, Kathmandu
- Each flavour comes in several sizes. Each size is a variant with its own price and its own stock. Sizes: [e.g. 100 g, 250 g].
- Butter is perishable. Stock is tracked in batches, each with a best-before date.
- Customers either pick up from Lazimpat or get home delivery. Delivery is within Kathmandu only.
- Domain: [NAME].com.np
- Currency: NPR only. Language: English at launch.
- Most customers use phones. Design mobile first.

## Brand look

Clean and minimal, built from the logo. The logo is a deep forest green V filled with wood-grain contour lines, over "THE VANAVASI PROJECT" in classical serif capitals with wide letter spacing, and a circular stamp version.

Design tokens (colours and fonts in one place, so the client can adjust them later):

- Primary: deep forest green from the logo, [HEX FROM CLIENT, roughly #1F3A2B]
- Background: white and a warm off-white; no patterns or textures except the logo's contour lines, used sparingly as a divider or section background at low opacity
- Accent: butter yellow [HEX], used only for small moments such as a flavour tag or a sale badge
- Headings: a classical serif in capitals with wide tracking, matching the logo ([FONT FROM CLIENT]; use Cormorant Garamond or Cinzel as a stand-in until then)
- Body: a clean sans-serif (Inter or similar) at comfortable size and line height
- Generous white space, thin rules, no shadows or gradients except where needed to keep text readable on a photo
- Tone: calm and premium; flavours are called "characters"

## Landing page

The home page is one long scrolling page:

1. Hero, full screen: a full-bleed landscape photo of Nepal's hills (Ilam tea gardens or similar). A floating pill-shaped navigation bar at the top centre: logo mark on the left; Shop, Our story, Visit us in the middle; cart on the right. Centred over the sky: a short headline in the serif capitals ("[HEADLINE, e.g. Crafted in the Himalayas]"), one line of subtext, and two buttons: a filled "Shop the butters" and a plain "Visit Lazimpat". A small "Scroll" chip at the bottom centre. Add a soft gradient behind the text only if the photo makes it hard to read.
2. Products: the flavour range as clean cards on off-white, each with the product photo cut out on a plain background, the flavour name in serif capitals, a one-line description, "from" price, and an add-to-cart that opens the size picker. Cards fade and rise in as they scroll into view.
3. Our story: two or three short paragraphs beside a second landscape or kitchen photo, with the contour-line pattern as a quiet divider.
4. Pickup and delivery: the Lazimpat address with a small map link, pickup hours, and a line saying delivery is available within Kathmandu.
5. Footer: the circular stamp logo, contact details, social links.

Motion and speed:

The feel to aim for is the smooth, editorial scrolling of verostudio.com. Use it as a reference for how the site moves only; do not copy its layout, text or images.

- Smooth scrolling with Lenis on desktop. Leave native scrolling on touch devices (Lenis's default), because smoothed touch scrolling feels laggy on phones.
- GSAP with ScrollTrigger for scroll effects:
  - Headlines reveal line by line (each line slides up from behind a mask).
  - Images reveal with a clip-path wipe as they enter, with a slight scale-down from 1.1 to 1.
  - Gentle parallax on the hero photo (it moves slower than the page).
  - Product cards rise and fade in with a small stagger.
- Headings mix upright and italic serif for emphasis, e.g. "butter *the* forest *way*". Pick a heading font that has a true italic.
- Navigation links and buttons use a text-roll hover: the label slides up and an identical copy slides in from below.
- The menu on phones opens as a full-screen overlay with the links revealed in sequence.
- No preloader or percentage counter. Shoppers should see products immediately.
- Animate only transform and opacity (and clip-path for image reveals), never layout properties. Keep durations between 0.6 s and 1.2 s with a soft ease-out.
- Respect prefers-reduced-motion: turn off Lenis and all scroll animations, and show everything in place.
- Load GSAP and Lenis only on the shop pages, not in the admin panel.
- The hero photo is served in AVIF or WebP at several sizes, with a small blurred placeholder, so the page looks complete on a slow mobile connection. Hero image under about 250 KB on phones.
- Every section works at phone width first; the navigation pill collapses to logo, cart and a menu button on small screens.
- After building the home page, report its JavaScript size and its Lighthouse mobile performance score.

I will supply the logo files, fonts, colour codes, the hero photo and the product photos.

## Stack (do not substitute without asking me)

- Next.js (App Router) with TypeScript, deployed to Cloudflare Workers through the OpenNext adapter (@opennextjs/cloudflare)
- Neon PostgreSQL with Drizzle ORM. Use the Neon WebSocket driver (drizzle-orm/neon-serverless) wherever a transaction is needed, because the HTTP driver does not support multi-statement transactions.
- Auth.js with Google login (and optionally email magic link). No passwords.
- Cloudflare R2 for product images, uploaded from the browser with short-lived signed URLs issued by the server
- Tailwind CSS. shadcn/ui components for the admin panel.
- Lenis (smooth scrolling) and GSAP with ScrollTrigger (scroll animations), shop pages only
- Resend for order emails
- Cloudflare Web Analytics and Workers Logs. No server-side Sentry.

## Hard constraints

- The site runs on the Cloudflare Workers free plan: 10 ms of CPU time per request and 100,000 requests a day. Keep server work light.
- Pre-render the home and product pages (text, photos, prices). Load stock availability on those pages with a small uncached request, because stock and expiry change more often than the pages. Revalidate a page when an admin edits its product. Cart, checkout and admin pages render per request.
- Never hash passwords or do heavy computation inside a request.
- Keep dependencies few and small. Tell me before adding any package that is not listed above.
- Do not use Vercel-specific features. The app must stay portable to a normal Node server running the Next.js standalone build.
- All config comes from environment variables. Never write files to local disk.

## Roles

- Two roles: admin and customer, stored in a role column on the users table.
- Customers can check out as guests (name, phone, and delivery address when delivering). Customer accounts are [OPTIONAL / NOT NEEDED] at launch.
- Admin routes live under /admin. Protect them twice: Next.js middleware redirects non-admins, and every admin server action checks the role again before reading or writing.
- No one can sign up as admin. The first admin is set by hand in the database; admins can promote other users from the panel.

## Stock rules (the most important part)

Stock lives in batches. The database is the only source of truth.

- Products (flavours) have variants (sizes). Each variant has batches: batch code, made-on date, best-before date, quantity received, quantity remaining.
- Sellable stock of a variant = the sum of quantity remaining across its batches whose best-before date is more than [MIN DAYS] days away. Never sell a batch closer to expiry than that.
- Orders take stock first-expiry-first-out. Inside one transaction, for each line item: select that variant's sellable batches ordered by best-before date with SELECT ... FOR UPDATE, take the quantity from the earliest batches first, and record which batch each unit came from in order_item_batches. If there is not enough sellable stock for any line, roll back the whole order and tell the customer which item and size ran out.
- Order statuses: pending, confirmed, out for delivery / ready for pickup, completed, cancelled. Stock is taken when the order is placed. Cancelling (including refused at the door) returns the quantities to the same batches they came from. Other status changes do not touch stock.
- Admin stock actions: receive a new batch, adjust a batch with a required reason, record an offline sale (also first-expiry-first-out), and write off a batch as expired or damaged.
- Every stock change writes a row to inventory_movements: variant, batch, change amount, type (batch_in, order, cancel, manual, offline_sale, write_off), reason, user, timestamp.
- The admin dashboard shows batches expiring within [ALERT DAYS] days, expired batches with stock left (to write off), and variants with low sellable stock.

## Delivery and pickup

- At checkout the customer chooses pickup from Lazimpat or delivery.
- Delivery: the customer picks an area from a list the admin manages (area name, delivery fee, active or not). Only Kathmandu areas go on this list. Addresses outside it cannot be selected. Fee: [DELIVERY FEE RULES].
- Pickup: no fee; the confirmation page and email show the Lazimpat address and pickup hours ([PICKUP HOURS]).
- The orders table stores fulfilment_type (pickup or delivery), delivery_area and delivery_fee.

## Payments

- Cash on delivery, or cash at pickup, only at launch.
- The orders table has payment_method (starting with only "cash") and payment_status (unpaid, paid, refunded).
- Put payment handling behind one small interface with cash as the first implementation, so Khalti or eSewa can be added later as new implementations with a server-side verification callback. Do not build any gateway now.

## Database tables

users, products, product_images, product_variants, batches, orders, order_items, order_item_batches, inventory_movements, delivery_areas. Add indexes on product slug, batch best-before date, and order status.

## Build order

Stop after each step, summarise what you built, and list anything you had to assume.

Phase A is a clickable prototype for client sign-off. It is the real frontend, not a throwaway. Pages must get all data through a data layer module (lib/data.ts) and must never import mock data directly, so Phase B can swap the data source without touching any page.

Phase A: prototype on mock data

1. Scaffold the Next.js app configured for Cloudflare Workers with OpenNext. Deploy an empty page and report the Worker size.
2. Write TypeScript types for Product, Variant, Batch, Order, OrderItem, OrderItemBatch, InventoryMovement and DeliveryArea, matching the tables listed above. Create a mock-data file from the products I give you, with a few batches per variant including one near expiry.
3. Write lib/data.ts with functions such as getProducts, getProduct(slug), getAvailability(variantIds), getDeliveryAreas, getOrders and getExpiringBatches, all returning mock data for now.
4. Shop screens at phone width, following the brand look and landing page sections above: home, product page with size picker, cart stored in the browser, checkout with the pickup or delivery choice and area list, confirmation page. Checkout goes to the confirmation page but saves nothing.
5. Admin screens under /admin on mock data: dashboard (expiring batches, expired stock, low stock), product and variant form, receive-batch form, batch list with adjust and write-off, offline sale form, movement history, order list and detail, delivery area list. Save buttons show a "prototype, not saved" notice. No login yet.
6. Stop. I will show the prototype to the client and bring back a list of changes. Make those changes before Phase B.

Phase B: backend behind the same screens

7. Add Drizzle and Neon. Build the schema from the Phase A types, write the first migration, and a seed script that loads the mock data.
8. Add a GitHub Actions workflow that runs lint and tests, then deploys on push to main.
9. Login with Auth.js and Google, the role column, middleware protection for /admin, and a role check helper for server actions.
10. Product and variant server actions (create, edit, hide) and signed R2 upload URLs. Switch the product functions in lib/data.ts to real queries. Pre-render home and product pages and revalidate them on product changes.
11. Batch and stock server actions (receive, adjust, write off, offline sale), each writing to inventory_movements, with unit tests for the sellable-stock rule and first-expiry-first-out allocation. Connect the admin stock screens and the availability request.
12. Delivery area actions and the admin screen for them.
13. Checkout server action with the stock rules above. Write tests first, including: two orders for the last sellable unit at once, where exactly one succeeds; an order spanning two batches; an order that must skip a near-expiry batch. Connect the checkout form and the sold-out message.
14. Order status changes with the stock effects above (cancel returns to the same batches), admin order screens on real data, and order emails to the customer and the admin.
15. Final pass: remove all mock data and prototype notices, check every page at phone width, list the pages most likely to exceed 10 ms of CPU, and write a short README covering setup, environment variables, deployment and how to make someone an admin.

## How to work

- Ask me when something in this brief is unclear or conflicts with itself. Do not guess on anything that touches stock, batches, orders or roles.
- Keep code simple and readable. I will maintain it and hand it over to the client.
- Do not add features that are not in this brief.
