# Swatch kit opt-in (§3.2)

**Target:** `purchase.checkout.contact.render-after`

- `swatch_mode` setting (default **native_link**): `extension` = checked-by-default checkbox +
  "FREE Swatch Kit" modal that records order attribute **`Swatch Kit Requested` = Yes/No**
  (writes `Yes` on first render); `native_link` = only a "FREE Swatch Kit details" link → same modal.
- Turning off the native email-marketing checkbox and switching fulfilment to read the attribute
  are **business decisions — not done here**.
- Verbatim label and modal copy. See `../../DEVIATIONS.md` for the info-trigger/modal note.
