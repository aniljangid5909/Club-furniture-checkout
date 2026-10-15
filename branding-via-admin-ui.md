# Branding via Admin UI — NO GraphiQL needed

The font + colors + button come from Shopify's **Checkout Editor** (visual UI), not from
extension code. Set them here on the **DRAFT profile only**. This is the same thing the
`checkoutBrandingUpsert` mutation does — just done visually.

## How to open (DRAFT profile only — never the live/published one)
1. Shopify Admin → **Settings → Checkout**
2. Under **Checkout profiles**, open the **DRAFT** profile (e.g. "Redesign v1 (draft)" — the one that is NOT published/live).
3. Click **Customize** → the checkout editor opens.
4. In the editor, open the **global style settings** — look for **Typography**, **Color schemes / Colors**, and **Corner radius** (usually a settings/gear or a "Branding"/"Style" panel). On Shopify Plus all of these are editable here.

## What to set (exact design values)

### Typography (font) — fixes the font
- **Font: Open Sans** for BOTH headings and body.
  - Open Sans is in Shopify's font library (search "Open Sans" in the font picker).
- Base body size ~14px; headings bold (700).

### Colors — fixes the gray→beige + links + borders
Set the main color scheme (the one the checkout body uses):
| Role | Value |
|---|---|
| Background (base surface) | `#FFFFFF` |
| Text | `#1F1C18` |
| Accent / links | `#D4732A` |
| Border / lines | `#DDD6CC` |
| **Secondary / subdued surface** (this is the trust strip band + order summary) | `#F5F1EB` |

### ⭐ Make the TRUST STRIP beige too (header color scheme)
The trust strip is in the **header** zone, which by default uses **Scheme 1** (white) — that's why
it renders **gray** while the order summary (Scheme 2) is beige. Verified on shopify.dev: an
extension cannot pick its scheme in code; only branding `customizations.header.colorScheme` controls it.

**Fix (one setting):** In the Checkout editor, select the **Header** section → set its
**Color scheme = Scheme 2** (the same beige scheme the order summary uses).
- The extension uses `background="base"`, so it renders that scheme's base background **exactly #F5F1EB**.
- ⚠ **Side effect:** the whole header shares one scheme, so the **logo bar also becomes beige**
  (the design had a white logo bar). This is the ONLY way to get a beige strip — a small, clean
  trade-off. If you prefer a white logo bar, the strip must stay non-beige (white/gray).

Equivalent via GraphQL: `customizations: { header: { colorScheme: COLOR_SCHEME2 } }`.

### ⭐ Remove the GAP / make the strip touch the border (header padding)
Verified on shopify.dev: the white space ABOVE and BELOW the trust strip band is the **header
container's padding** — host-controlled, NOT removable from extension code (extension layout
components have no margin/negative-margin). The ONE lever is the branding **header padding**:
set **Header padding = None** (`CheckoutBrandingHeaderInput.padding = NONE`). This zeroes the
header padding — the maximum gap reduction available. Keep **`divided: true`** for the bottom line.
- In the Checkout editor: **Header** section → look for a **Padding / Spacing** control → set to **None**.
- Via GraphQL: `customizations: { header: { padding: NONE, divided: true } }`.
- Honest note: Shopify documents `padding` as the whole-header padding; a guaranteed pixel-flush
  "touch the divider" isn't a separately documented control, so `NONE` is the closest achievable —
  it removes the controllable space; any tiny residual host spacing can't be removed by any means.

### Primary button — fixes the green "Place Your Order Now!" button
| Role | Value |
|---|---|
| Button background | `#55AA33` |
| Button text | `#FFFFFF` |
| Button size / padding | largest available (tall button) |

### Corner radius
- Global / buttons / cards: **6px** (or the closest option, e.g. "Small/Base").

## After setting
- Save. Re-open the checkout preview on the DRAFT profile.
- The trust strip should now be **beige** and **connected**, font should be **Open Sans**, button **green**.
- Screenshot and compare to the design.

## Still can't find a control?
Some of these (exact per-scheme hex, button padding) are easiest in the editor's "Colors/Color
schemes" and "Typography" sections. If a specific value isn't exposed in the UI, that one field
would need the GraphQL mutation ([branding-mutation.graphql](branding-mutation.graphql)) — but
font + the main scheme colors + button are all available in the UI.
