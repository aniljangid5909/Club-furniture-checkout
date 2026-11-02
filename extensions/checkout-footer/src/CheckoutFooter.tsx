import '@shopify/ui-extensions/preact';
import {render} from 'preact';

// §3.7 footer — Target: purchase.checkout.footer.render-after
//
// Matches the UPDATED approved design's bottom section, in order:
//   (native policy links, incl. "Contact")  →  help line
// The Trust Guard banner moved to the order summary (Jeff, 3 Nov 2026).
//
// New design (Oct 2026 revision): help line has NO "· Contact Us" mailto link
// (just phone + hours), the tagline is REMOVED (show_tagline now defaults OFF),
// and the native "Contact" policy link is KEPT (that's native, not this extension).

// §3.7 help-line phone icon — the design's subdued (#6B665E) phone glyph, as an
// <s-image> SVG at the START of the help line (a flex row: icon + text).
const PHONE_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B665E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='6' y='2' width='12' height='20' rx='2'/><path d='M11 18h2'/></svg>";

function CheckoutFooter() {
  // show_tagline now defaults to FALSE — the updated design dropped the tagline.
  // Set the setting to true to bring it back.
  const settings = shopify.settings.value as {show_tagline?: boolean};
  const showTagline = settings?.show_tagline === true;

  return (
    <s-stack gap="base">
      {/* §3.7.1 Help line — s-grid (auto 1fr) keeps the phone icon pinned at the
          start of the FIRST line while the text wraps within the 1fr column.
          New design: phone + number + hours only (no "Contact Us" mailto). */}
      <s-grid gridTemplateColumns="auto 1fr" gap="small-300" alignItems="start">
        <s-image src={PHONE_ICON} alt="" inlineSize="auto" aspectRatio="1/1" />
        {/* type="small" (≈12-13px, the design's help-line size) — fits one line on
            desktop and bigger phones; on narrow phones the text is too long to fit
            one line and wraps (the spec allows wrapping on mobile). */}
        <s-text type="small" color="subdued">
          Questions? Call Us, Toll Free: 1-888-378-8383 · M-F 9AM - 5PM EST
        </s-text>
      </s-grid>

      {/* §3.7.2 Tagline — removed in the new design; off unless show_tagline=true */}
      {showTagline ? (
        <s-text type="small" color="subdued">
          Club Furniture... Luxurious Home Furnishings For Less!
        </s-text>
      ) : null}
    </s-stack>
  );
}

export default function () {
  render(<CheckoutFooter />, document.body);
}
