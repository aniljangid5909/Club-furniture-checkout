import '@shopify/ui-extensions/preact';
import {render} from 'preact';

// Demo shipping radio — purchase.checkout.shipping-option-list.render-before
//
// ⚠️ VISUAL DEMO ONLY (per client request to "show" the design radio).
// This does NOT control the real shipping selection — the native shipping-option
// row still renders below it. Shopify does not let an extension replace or hide
// the native selector, so this is a static, always-"selected" look-alike.
//
// The orange selected radio can't be a tinted s-icon, so it renders as an
// <s-image> SVG (ring + filled dot, #D4732A), matching the approved design.

const ACCENT = '%23D4732A';
const RADIO_SELECTED =
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'><circle cx='12' cy='12' r='9' fill='none' stroke='${ACCENT}' stroke-width='2'/><circle cx='12' cy='12' r='4.5' fill='${ACCENT}'/></svg>`;

const DEFAULT_LABEL = 'FREE Shipping + FREE In-Home Delivery Included';
const DEFAULT_PRICE = 'FREE';

function ShippingRadio() {
  const settings = shopify.settings.value as {
    enabled?: boolean;
    radio_label?: string;
    radio_price?: string;
  };
  // Hidden unless explicitly enabled — it's a demo element.
  if (settings?.enabled !== true) return null;

  const label = settings?.radio_label || DEFAULT_LABEL;
  const price = settings?.radio_price || DEFAULT_PRICE;

  return (
    <s-box background="subdued" border="base" borderRadius="large" padding="base">
      <s-grid gridTemplateColumns="auto 1fr auto" gap="small-300" alignItems="center">
        <s-image src={RADIO_SELECTED} alt="" inlineSize="auto" aspectRatio="1/1" />
        <s-text type="strong">{label}</s-text>
        <s-text type="strong">{price}</s-text>
      </s-grid>
    </s-box>
  );
}

export default function () {
  render(<ShippingRadio />, document.body);
}
