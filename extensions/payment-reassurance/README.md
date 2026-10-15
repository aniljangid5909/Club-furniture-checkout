# Payment reassurance + Affirm box (§3.4)

**Target:** `purchase.checkout.payment-method-list.render-before` (under the native Payment heading,
no second heading).

- Reassurance line: **green (success) lock** + verbatim text + info button → "Secure Payment" modal.
- Affirm box (subdued bg): accent credit-card icon + estimate + compliance legal text.
- Estimate = `total ÷ months` at 0% APR (else standard amortisation), rounded, in store currency,
  from `shopify.cost.totalAmount` (recalculates on total change). Hidden below `affirm_min_total`.
- Settings: `financing_months` (36), `financing_apr` (0), `affirm_min_total` (50), `affirm_legal_text`.
  Legal text still needs Affirm compliance sign-off.
