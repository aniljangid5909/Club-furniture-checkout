# Header trust strip

**Target:** `purchase.checkout.header.render-after` (renders below the checkout header).
**Spec:** build prompt §3.1.

Three items — `lock` "SSL Secure Checkout", `truck` "FREE Shipping + FREE In-Home Delivery",
`return` '"Buy-It-Back" Guarantee' — as icon + **bold** (`type="strong"`) text on a subdued
(#F5F1EB) bar with a bottom divider, centered.

## Status: v0 (content-accurate, verified APIs only)

Built with the current Checkout UI extensions API: Polaris web components via
`@shopify/ui-extensions/preact` + `preact`, `api_version = "2026-07"`. Every component
(`s-query-container`, `s-stack`, `s-icon`, `s-text`, `s-divider`), target, and icon name used
here was verified against shopify.dev before use (no guessed names).

## Open items (need design + confirmation before final)

1. **Accent icons.** The new `<s-icon>` `tone` attribute has no `accent` value
   (`auto | neutral | info | success | warning | critical | custom`). §3.1 wants accent
   (#D4732A) icons. Currently rendering default tone. Need to confirm how to accent-tint
   standalone icons in the web-component API (the `shopify-polaris-checkout-extensions` skill
   would settle this) before locking.
2. **Mobile auto-rotating slider (every 3.5s).** v0 uses the spec's sanctioned fallback:
   on narrow widths the three items stack onto lines (`direction` container query), on desktop
   they're a single centered row. A `setInterval`-driven single-item rotator is feasible
   (timers run in the extension sandbox), but cleanly showing *all three on desktop* vs
   *one rotating on mobile* needs a container-query visibility toggle I want to verify
   on-device first. Will add once the preview pipeline is confirmed.
3. **Exact spacing / sizes** await the Claude Design frames (not yet received).
4. Per spec §3.1, also need to **report where this target renders on mobile relative to the
   "Show order summary" bar** — to be checked in the draft preview.
