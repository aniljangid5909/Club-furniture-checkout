# Club Furniture — checkout UI extensions

Custom Checkout UI extensions for Club Furniture's redesigned Shopify Plus one-page checkout.
Store: `club-furniture-2017.myshopify.com`. Built as **Polaris web components**
(`@shopify/ui-extensions/preact` + `preact`), `api_version = "2026-07"`.

> **Guardrails (from the brief):** nothing goes live without Anil's explicit approval. Do **not**
> run `shopify app deploy` / release a version / publish a profile / change live checkout settings
> without asking Anil, every time. Preview against a **draft** profile only.

## Extensions (§3)

| Extension (handle) | Target | Spec | Settings |
|---|---|---|---|
| `trust-strip` | `header.render-after` | §3.1 | — |
| `swatch-optin` | `contact.render-after` | §3.2 | `swatch_mode` |
| `white-glove` | `shipping-option-list.render-after` | §3.3 | — |
| `payment-reassurance` | `payment-method-list.render-before` | §3.4 | `financing_months`, `financing_apr`, `affirm_min_total`, `affirm_legal_text` |
| `trust-actions` | `actions.render-before` | §3.5 | — |
| `checkout-footer` | `footer.render-after` | §3.6 + §3.7 | `show_tagline` |
| `summary-affirm` | `block.render` | §3.8 | `financing_months`, `financing_apr`, `affirm_min_total` |
| `why-buy-from-us` | `block.render` | §3.9 | `rating`, `customer_count`, `star_full_url`, `star_half_url` |

Each has its own `shopify.extension.toml`, settings schema, source in `src/`, and README.

Docs: [`DEVIATIONS.md`](DEVIATIONS.md) (what can't match the design 1:1 + why),
[`PLACEMENT.md`](PLACEMENT.md) (§5 editor steps), [`checkout-native-settings.md`](checkout-native-settings.md) (§4 native settings, prepare-only).

## Connect & preview in checkout (run in YOUR terminal)

Requires Shopify Partners browser login — can't run from the AI session. These preview **draft**
extension versions; they do **not** publish to the live checkout.

```bash
npm install
npm run config:link   # shopify app config link → pick the club-furniture app (client_id db857c00ef2a3bef13c0a7046a277dad)
npm run dev           # shopify app dev → draft preview URL + checkout-editor link
```

## Rollout checklist (run ONLY after Anil's approval, in order)

- [ ] Approve creating **"Redesign v1 (draft)"** profile (duplicate of "One-page checkout test").
- [ ] Upload `extensions/why-buy-from-us/assets/full-star.svg` + `half-star.svg` to Shopify Files; paste URLs into the Why-Buy settings.
- [ ] Get Affirm legal text signed off by compliance; paste into `affirm_legal_text`.
- [ ] `npm install` → `shopify app config link` (club-furniture app) → `shopify app dev` → preview on the draft profile.
- [ ] Apply Branding to the **draft** profile (`checkout-native-settings.md` §1).
- [ ] Apply per-profile content strings to the **draft** (§2) — only those confirmed per-profile.
- [ ] Place the two order-summary blocks + remove old `image`/`reviews`/`trust-guard` blocks on the **draft** (`PLACEMENT.md`).
- [ ] Screenshots: desktop 1440 + mobile 390; diff vs Clean Desktop / Clean Mobile frames (§6).
- [ ] Final review with Anil.
- [ ] `shopify app deploy` — release the app version. **Only after approval.**
- [ ] Publish the draft profile. The old profile stays as a one-click rollback.

## Notes
- `shopify.app.toml` holds only the public `client_id` + placeholders — **no secrets** in this repo.
  A `SHOPIFY_API_SECRET`, if ever needed, goes in a local git-ignored `.env`, never in chat.
- The design source is in `design/` (exported from Claude Design). Reference only.
- If dep versions give trouble, let the CLI scaffold (`shopify app generate extension --template ui_extension`) and drop in the `src/` + `shopify.extension.toml` from each folder here.
