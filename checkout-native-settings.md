# Checkout native settings — PREPARE ONLY (do not apply to live)

> **Status: DRAFT for Anil's review.**
> Nothing in this file has been applied anywhere. Per the build spec §0 and §4:
> - **Nothing is applied to the live profile.** Ever, without Anil's explicit approval, every time.
> - Where the API allows, these are applied to the **draft profile only** ("Redesign v1 (draft)"), and **only after Anil approves** each item.
> - Store: `club-furniture-2017.myshopify.com` (Shopify Plus).
> - GraphQL field paths and enum values below are marked **⚠ verify** where they must be checked against the live Admin GraphQL schema and the actual store before use. I have not guessed values I couldn't confirm; I've named the type and linked the doc to verify against.

**Target API version for mutations below:** use the current stable Admin GraphQL version (e.g. `2025-07` — confirm the latest stable at apply time).

---

## 0. Prerequisites before applying anything

1. **Create the draft profile first** (spec §0) — ask Anil before creating. Duplicate the live **"One-page checkout test"** profile, name it **"Redesign v1 (draft)"**.
   - Admin path: **Settings → Checkout → Customize** → profile dropdown (top) → **Duplicate** the chosen profile → rename.
   - Record the draft profile's `CheckoutProfile` id — every branding mutation below needs `checkoutProfileId`.
   - Get the id via GraphQL:
     ```graphql
     query {
       checkoutProfiles(first: 25) {
         nodes { id name isPublished }
       }
     }
     ```
   - Confirm `isPublished: false` for the draft before touching it.

2. All branding changes go through **`checkoutBrandingUpsert`** scoped to that draft `checkoutProfileId`. Because it is scoped per profile, it does **not** affect the live profile. ✅ This is the main reason branding is safe to apply to the draft.

3. **Content / language** and **shipping / notification** settings are the ones to watch — several are **store-wide**, not per-profile. Those are flagged **STORE-WIDE — list only, do not change** below.

---

## 1. Branding — `checkoutBrandingUpsert` on the DRAFT profile

**Mutation shape:**
```graphql
mutation SetBranding($id: ID!, $input: CheckoutBrandingInput!) {
  checkoutBrandingUpsert(checkoutProfileId: $id, checkoutBrandingInput: $input) {
    checkoutBranding { # read back to confirm
      designSystem { colors { global { accent brand } } }
    }
    userErrors { field message }
  }
}
```

Docs to verify every field/enum below (the WebFetch summarizer could not extract the deep nested enums, so **verify these pages directly before applying**):
- Mutation: https://shopify.dev/docs/api/admin-graphql/latest/mutations/checkoutBrandingUpsert
- Input: https://shopify.dev/docs/api/admin-graphql/latest/input-objects/CheckoutBrandingInput
- Design system / colors / typography and customizations input objects linked from the input page above.

### 1.1 Design tokens (`designSystem`)

| Design spec | GraphQL path | Value |
|---|---|---|
| Font Open Sans (headings + body) | `designSystem.typography.primary` and `.secondary` | `shopifyFontGroup { name: "Open Sans", base: { weight: 400 }, bold: { weight: 700 } }` ⚠ verify `CheckoutBrandingShopifyFontGroupInput` shape; Open Sans is a Google font available in the Shopify font library |
| Body text 14px | `designSystem.typography.size.base` | `14` ⚠ verify it accepts a point/px float |
| Type scale | `designSystem.typography.size.ratio` | leave default unless the design needs a specific ratio (spec gives 12/14/16/20 — see headings in §1.2) |
| Accent #D4732A | `designSystem.colors.global.accent` | `"#D4732A"` — used for icons, links, checkbox (spec: icon colour must come from accent/success tones, not hardcoded hex in extensions) |
| Success/primary green #55AA33 | `designSystem.colors.global.success` | `"#55AA33"` — also the lock icon tone the extensions reference |
| Brand | `designSystem.colors.global.brand` | set to accent `#D4732A` unless Anil wants brand distinct ⚠ confirm which role the primary button should read from |

**Color scheme roles** (the checkout uses `scheme1` for the main body, `scheme2` for alternate surfaces — ⚠ verify which scheme maps to which region on this profile):

| Design spec | GraphQL path (scheme1 shown) | Value |
|---|---|---|
| Base surface #FFFFFF | `designSystem.colors.schemes.scheme1.base.background` | `"#FFFFFF"` |
| Text #1F1C18 | `...scheme1.base.text` | `"#1F1C18"` |
| Border #DDD6CC | `...scheme1.base.border` | `"#DDD6CC"` |
| Accent (links) #D4732A | `...scheme1.base.accent` | `"#D4732A"` |
| Subdued surface #F5F1EB | `designSystem.colors.schemes.scheme2.base.background` | `"#F5F1EB"` ⚠ confirm scheme2 is the subdued/alt surface on this profile |
| **Primary button** bg #55AA33, white label | `...scheme1.primaryButton.background` / `.text` | `background: "#55AA33"`, `text: "#FFFFFF"` ⚠ verify `CheckoutBrandingButtonColorRolesInput` field names (`background`, `text`, `border`, `hover`) |
| **Selected option fill** #FDF5EE with accent border | `...scheme1.control.selected` (background/border) | `background: "#FDF5EE"`, `border: "#D4732A"` ⚠ verify `control.selected` path exists; spec §4 "Selected option fill #FDF5EE with accent border" |

**Corner radius 6px:** `designSystem.cornerRadius` variables — ⚠ the branding model exposes corner radius as named sizes (e.g. `base`, `small`, `large`) and components reference one via an enum (`NONE`/`SMALL`/`BASE`/`LARGE`). Set the `base` variable to 6px and map cards/buttons to it. **Verify** the exact `CheckoutBrandingCornerRadiusVariablesInput` field and whether it takes pixels.

### 1.2 Customizations (`customizations`)

| Design spec | GraphQL path | Value / note |
|---|---|---|
| Primary button: tallest block padding (~72px target), white text, green | `customizations.primaryButton.blockPadding` | ⚠ `blockPadding` is a **spacing enum** (e.g. `NONE`/`TIGHT`/`BASE`/`LOOSE`/`EXTRA_LOOSE`), **not a pixel value** — you cannot set exactly 72px. Choose the largest available (likely `EXTRA_LOOSE`) and **report the actual rendered height** vs the 72px target. (This is a design-match gap — see §6 note.) |
| Primary button label 20px/700 if available | `customizations.primaryButton.typography.size` / `.weight` | size enum ⚠ (e.g. `LARGE`/`EXTRA_LARGE`) — 20px may not be exactly expressible; pick closest and report |
| Button corner radius 6px | `customizations.primaryButton.cornerRadius` | enum referencing the `base` radius (`BASE`) ⚠ |
| 6px radius globally | `customizations.global.cornerRadius` | `BASE` ⚠ verify `CheckoutBrandingGlobalCornerRadius` enum values (likely `NONE`/`BASE`) |
| Header logo: left on desktop, centred on mobile | `customizations.header.alignment` / `.position` | ⚠ **One alignment value applies across breakpoints** in the branding API — there is generally **no separate desktop/mobile logo alignment**. Expect to pick one (left) and report that mobile-centred may not be independently settable. Verify `CheckoutBrandingHeaderInput.alignment` (`START`/`CENTER`/`END`) + `.position`. Logo image is set via `customizations.header.logo.image.mediaImageId` + `.maxWidth`. |
| Order summary background #F5F1EB | `customizations.orderSummary.colorScheme` | point order summary at the subdued scheme (scheme2) rather than a raw hex ⚠ confirm `colorScheme` enum (`COLOR_SCHEME1`/`COLOR_SCHEME2`) |
| Card headings 16/700, section headings 20/700 | `customizations.headingLevel1` / `headingLevel2` typography | size + weight enums ⚠ map 20px→section heading level, 16px→card heading level; exact px may not be expressible, pick closest and report |

> **Known branding limitations to report to Anil (collected in §6):** pixel-exact button height (72px) and font sizes (14/16/20px) are enum-bucketed, and header logo alignment is likely single-value across breakpoints. These are the most probable "couldn't match exactly" items from the branding side.

---

## 2. Checkout content / language (DRAFT only — verify where each string lives)

Checkout text lives in **two** different places depending on the string — **verify on the store which applies to each**:
- **Checkout editor settings** (per-profile, in **Settings → Checkout → Customize** → section settings) for some labels, and
- **Checkout & customer accounts language** editor (**Settings → Checkout → "Checkout language"** / Content → Localization) which is **often store-wide across profiles, not per-profile** — ⚠ **flag:** editing a language string here may affect the live profile too. Confirm per-string before applying.

| Design spec (final copy, verbatim) | Where it likely lives | Action | Risk |
|---|---|---|---|
| Delivery heading → **"Ship To Address"** | Checkout language / content | Rename | ⚠ confirm it's overridable and per-profile |
| Shipping heading → **"Shipping Method"** | Checkout language / content | Rename | ⚠ |
| Pay button → **"Place Your Order Now!"** | Checkout language / content (checkout action button label) | Rename | ⚠ |
| Express divider → **"Or checkout using Visa, MasterCard, American Express or Discover"** | Checkout language / content (express checkout divider) | Rename | ⚠ confirm this specific string is editable |
| Native payment subtitle **"All transactions are secure and encrypted."** → remove/blank | Checkout language / content | Blank it if the field allows empty; our extension (§3.4) shows the full line | ⚠ **report if it cannot be removed/blanked** (spec §4 explicitly asks to report this) |
| Every **"Free" → "FREE"** (capitalised) | Checkout language / content — multiple keys (shipping method, etc.) | Find each "Free" string and capitalise | ⚠ there may be several keys; enumerate them on the store |
| Order-summary shipping label → **"FREE Shipping + FREE In-Home Delivery"** | Derived from the **shipping rate name** (see §3) — ⚠ **client request; verify it's even possible** to override the summary label independently of the rate name | Likely **not** a free-text content string — the order summary shows the rate's name | ⚠ **report:** may require renaming the shipping rate (store-wide, §3) |

> **Important:** the language editor scope must be confirmed. If it is store-wide, changing strings there changes them for the **live** profile as well — which violates §0. In that case, **do not apply**; list them and wait for Anil. Prefer per-profile checkout-editor settings wherever a string is available there.

---

## 3. Other settings (DRAFT only — several are STORE-WIDE, list only)

| Spec item | Scope | Action |
|---|---|---|
| Shipping rate name → **"FREE Shipping + FREE In-Home Delivery Included"** | **STORE-WIDE** (Settings → Shipping and delivery) | **LIST ONLY — do not change.** Shipping rates are not per-checkout-profile; renaming affects all checkouts. List for Anil. |
| Turn **off** the SMS "Text me with news and offers" checkbox | ⚠ verify scope — checkout settings (Settings → Checkout → "Marketing options" / Customer contact) — may be store-wide | Prepare; **apply to draft only if the toggle is per-profile.** If store-wide, list and wait. |
| Email-marketing checkbox | — | **Leave as is** until the swatch decision (spec §3.2). Do not touch. |
| **"Contact" policy link** in the footer | STORE-WIDE | **KEEP IT.** The updated design (Oct 2026) keeps "Contact" in the native policy links (Refund policy · Shipping · Privacy policy · Terms of service · Contact). Do NOT remove it. (The extension help line no longer has a "Contact Us" mailto — the native Contact link covers it.) |
| **Billing address open by default** | ⚠ verify | Report what Shopify allows: billing-address display is governed by Settings → Payments / checkout rules; "always show billing fields" is **not generally a merchant-exposed toggle** in the new checkout. **Report the constraint;** do not change. |

---

## 4. Apply order (after Anil approves each item, draft profile only)

1. Create & identify the draft profile (§0). — **needs Anil approval to create.**
2. Branding (§1) via `checkoutBrandingUpsert` on the draft `checkoutProfileId`. Read back `checkoutBranding` to confirm, screenshot the draft preview.
3. Per-profile content strings available in the checkout editor (§2) — the ones confirmed per-profile only.
4. Store-wide / uncertain-scope items (§2 language editor if store-wide, §3 shipping rate, SMS toggle, Contact policy, billing) — **do not apply;** hand the list to Anil with the scope caveat.
5. Re-screenshot draft desktop (1440) + mobile (390) and diff against the Clean Desktop / Clean Mobile frames (spec §6).

---

## 5. Open items to confirm with Anil / verify on store

- [ ] Approve creating the **"Redesign v1 (draft)"** profile.
- [ ] Confirm which color scheme (`scheme1`/`scheme2`) the main body vs subdued surfaces map to on this profile.
- [ ] Confirm the primary button should read its background from `success` (#55AA33) vs a dedicated button color.
- [ ] Verify the checkout **language editor scope** (store-wide vs per-profile) for each content string in §2 before applying any.
- [ ] Confirm whether the order-summary shipping label can be set independently of the shipping rate name.
- [ ] Decide on the SMS checkbox once its scope is confirmed.
- [ ] Billing-address-open-by-default: confirm the Shopify constraint and whether to pursue it at all.

---

*This document will be updated once the draft profile exists and the exact branding field paths/enums are verified against the live schema on `club-furniture-2017`.*
