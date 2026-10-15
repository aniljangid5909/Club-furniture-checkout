# Design deviations — what couldn't match the design exactly, and why

Per build brief deliverable #4. This lists everywhere the Checkout UI extension runtime
can't reproduce the Claude Design frames 1:1, with the reason and the proposed closest option.
Nothing here was a silent design change.

> Verification status: the code uses only APIs/targets/icons confirmed against shopify.dev.
> Rendering still needs `shopify app dev` on the draft profile to confirm visually, and the
> `@shopify/ui-extensions` TypeScript types validate API usage at `shopify app build`.

## 1. Accent-coloured icons (ALL accent icons) — RESOLVED
The design tints icons with the brand accent **#D4732A**. `<s-icon>` can't be tinted (its `tone`
has no accent value). **Solution (same as the stars):** every accent icon now renders as an
**`<s-image>` SVG stroked #D4732A**, using the exact SVG paths from the design files. Covers:
- **Trust strip §3.1** + **Trust row §3.5** — lock / truck / return (from `TrustStrip.dc.html`)
- **White-Glove card §3.3** — clock / marker / order-box / truck (from `WhiteGloveCard.dc.html`)
- **Payment Affirm line §3.4** — credit-card (from `CheckoutMain.dc.html`)

Default source is an **inline data-URI SVG** (no upload). If the sandbox blocks data URIs, upload
the `assets/*.svg` files (in trust-strip/trust-actions) to Shopify Files and paste URLs into the
`icon_lock_url` / `icon_truck_url` / `icon_return_url` settings — no redeploy required.
- The **green** payment lock stays matched via `s-icon tone="success"` (#55AA33).
- Gold review stars (#FFCD3C) use the same `<s-image>` SVG approach — see §5.

## 1b. Header trust strip NOT full-bleed (edge-to-edge) — CONFIRMED PLATFORM LIMIT
The design shows the header strip as a full-viewport-width band. **Verified against shopify.dev:**
checkout UI extensions run in an isolated sandbox and **cannot** render edge-to-edge/full-bleed —
the widest an extension can go is **100% of the content container** the host gives it (`s-box
inlineSize="100%"`), which still has the checkout's side gutters on wide screens. No `inlineSize`
value, layout prop, or Checkout Branding setting breaks an extension out to the viewport edge.
True full-width would require Shopify's native header, not an extension. The strip now fills the
full content width; the warm-beige colour (#F5F1EB) + divider come from the **branding** subdued
scheme (default grey until the branding mutation runs). (Also: `s-box` has no per-side border, so
the bottom rule is an `<s-divider>`, not a `borderBlockEnd`; `inlineSize="fill"` is invalid — use `%`.)

## 2. Mobile auto-rotating sliders — trust strip (§3.1) and trust row (§3.5) — RESOLVED
The design rotates one item at a time on mobile and shows all three on desktop. **Implemented:**
verified on shopify.dev that the `display` attribute accepts the container-query value syntax
(`@container (inline-size > Npx) auto, none`) and that `setInterval`+Preact hooks work in the
worker sandbox. So each extension renders BOTH layouts and toggles by width via `display`:
- **WIDE** (desktop): all three items, centred (trust strip one row; trust row wraps 2+1).
- **NARROW** (mobile): one item at a time, auto-rotating every 3.5s (`setInterval`, 3500ms).
Breakpoints: trust strip 600px (full-width band), trust row 420px (narrow main column vs mobile).
The rotation timer keeps running while hidden on desktop (harmless — no JS width signal to gate it).

## 3. Pixel-exact Branding values (native side)
Primary button **72px** height and **20px/700** label, and the **14/16/20px** font sizes, are
**enum-bucketed** in the Branding API (spacing/size enums), not free pixels. We map to the
closest enum and report the rendered result. Detailed in `checkout-native-settings.md` §1.

## 4. Trust Guard banner placement (§3.6) — MATCHES DESIGN
The approved design places the Trust Guard banner **below the native policy links and above the
"Questions? Call Us" help line**. That is exactly `footer.render-after`, so the banner is the
first child of the footer extension (banner → help line → tagline). Rendered at the design's
intended position.

## 5. Gold stars in "Why Buy From Us" (§3.9) — RESOLVED
Checkout icons can't be gold, so stars render as **`<s-image>` SVGs** (#FFCD3C), using the exact
star path from `OrderSummary.dc.html`. Default source is an **inline data-URI SVG** (4 full + 1
half, no upload needed). Optional hosted override via `star_full_url` / `star_half_url` settings
if the sandbox blocks data URIs.

## 6. Custom SVG icon shapes
The design uses bespoke stroke SVGs. Extensions can't render arbitrary SVG, so icons map to the
nearest Shopify `s-icon` names: `marker → location`, `order-box → order`; `lock/truck/return/
clock/credit-card/info/mobile/chevron-left/chevron-right/star-filled/star-half` map directly.
Glyph shapes differ slightly from the design's custom drawings.

## 7. Help line link styling (§3.7)
The phone number should be **bold + dark** and "Contact Us" **accent**. `<s-link>` colour/weight
isn't freely controllable, so both render in the theme's link style. Minor.

## 8. Info trigger + modals
The info glyph is an `<s-clickable>` wrapping `<s-icon type="info">` that opens an `<s-modal>` via
`command="--show"` — s-clickable (not s-button) so it renders as a **plain tappable icon with no
button box**. **Limitation (verified shopify.dev):** a TRUE inline glyph flowing right after the
last word (e.g. "…finalized. ⓘ") is NOT possible — checkout components are flex/block-level, not
inline, can't be nested inside `s-text`, and custom CSS is blocked. Closest achievable: the icon
is a trailing item at the end/side of the text (swatch: grid `1fr auto`, `alignItems="end"` so it
sits by the last line; payment: after the text in the reassurance line). Modals have a Close button.

## 9. Review slider buttons — 44px tap target (§3.9)
`<s-button>` size isn't pixel-settable; prev/next render at the component's default size.
Accessible labels ("Previous review" / "Next review") and the "1 of 5" counter are implemented;
the slider wraps at both ends; no autoplay.

## 10. Items that are native, not extensions (see checkout-native-settings.md)
"Ship To Address", "Shipping Method", the pay-button label "Place Your Order Now!", the express
divider copy, every "Free" → "FREE", and the order-summary shipping label are **checkout
content/language** changes (not extensions). The "TOTAL SAVINGS" line and the price-tag icon are
**native** and can't be removed.
