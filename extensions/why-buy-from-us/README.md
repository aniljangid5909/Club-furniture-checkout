# Order summary: Why Buy From Us (§3.9)

**Target:** `purchase.checkout.block.render` — place under the Affirm one-liner (§3.8).

- Rating row: 4 full + 1 half **yellow** star via `<s-image>` from `star_full_url` / `star_half_url`.
  Upload the provided `assets/full-star.svg` + `assets/half-star.svg` (#FFCD3C) to **Shopify Files**
  and paste the URLs into settings. Until then it falls back to theme star icons (not yellow).
- Rating + `customer_count` ("… Satisfied Customers").
- Manual review slider (no autoplay): verbatim 5 reviews, prev/next (accessible labels) + "1 of 5"
  counter, wraps both ends, **no dates**.
- Divider + subdued lock + "Secured and scanned daily by Trust Guard".
- Settings: `rating` (4.7), `customer_count` (30,000+), `star_full_url`, `star_half_url`.
- Reviews are **verbatim — never edit**.
