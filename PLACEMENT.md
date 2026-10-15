# Placement steps — draft profile only (§5)

Do this on the **"Redesign v1 (draft)"** profile only, never the live one. Record every step so
it can be repeated. Prerequisite: the app's extension drafts are available (via `shopify app dev`,
or after `shopify app deploy` once Anil approves).

## 1. Open the draft profile's checkout editor
Admin → **Settings → Checkout** → select **"Redesign v1 (draft)"** → **Customize**.

## 2. Static-target extensions (auto-placed at their target)
These render automatically at their target — just confirm each is present/enabled and ordered:

| Extension (merchant name) | Renders at |
|---|---|
| Header trust strip | below the header |
| Swatch kit opt-in | after the Contact section |
| White-Glove delivery card | after the shipping options |
| Payment reassurance + Affirm | between the Payment heading and the payment methods |
| Trust row (above pay button) | just before the pay button |
| Checkout footer (Trust Guard + help) | below the footer / policy links |

## 3. Order-summary blocks (add + position manually)
In the **order summary** column:
1. **Add app block → "Order summary: Affirm line"** → drag **directly under the Totals**.
2. **Add app block → "Order summary: Why Buy From Us"** → place **directly under the Affirm line**.

> The exact "directly under the totals" position must be confirmed in the editor — block
> placement granularity is limited to the available slots.

## 4. Configure each extension's settings (in the editor)
- **Swatch kit opt-in** → `swatch_mode` = `native_link` (default) until Anil confirms switching to `extension`.
- **Payment reassurance + Affirm** → `financing_months` 36, `financing_apr` 0, `affirm_min_total` 50, `affirm_legal_text` (paste compliance-approved text).
- **Order summary: Affirm line** → same months/apr/min as above.
- **Checkout footer** → `show_tagline` on.
- **Why Buy From Us** → `rating` 4.7, `customer_count` 30,000+, `star_full_url` / `star_half_url` (Shopify Files URLs after uploading the SVGs in `extensions/why-buy-from-us/assets/`).

## 5. Remove the old blocks (DRAFT profile only)
Remove the legacy **`image`** (header banner), **`reviews`**, and **`trust-guard`** blocks from the
**draft** profile. **Never remove them from the live profile.**

## 6. Save
Save the draft profile. Do **not** publish. Then take desktop (1440) and mobile (390) screenshots
and diff against the Clean Desktop / Clean Mobile frames (brief §6).
