import '@shopify/ui-extensions/preact';
import {render} from 'preact';

// §3.3 White-Glove card — purchase.checkout.shipping-option-list.render-after
//
// Renders only when the checkout has a shipping option list (shipping required).
//
// Verbatim heading and rows. Icons are the design's ORANGE (#D4732A) SVGs —
// <s-icon> can't be tinted, so (like the trust strip + stars) they render as
// <s-image> SVGs using the exact paths from WhiteGloveCard.dc.html:
//   clock  → "A convenient delivery appointment"
//   marker → "Furniture placed in the room of your choice"
//   box    → "Full setup and packaging removal"
//   truck  → "Small items ship FREE via FedEx or UPS"
// Default source = inline data-URI SVG (no upload). If the sandbox blocks data
// URIs, see the trust-strip extension's icon_*_url settings pattern.

const ACCENT = '%23D4732A';
const svg = (inner: string) =>
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${ACCENT}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${inner}</svg>`;

const ICONS: Record<string, string> = {
  clock: svg(`<circle cx='12' cy='12' r='10'/><path d='M12 6v6l4 2'/>`),
  marker: svg(`<path d='M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z'/><circle cx='12' cy='10' r='2.5'/>`),
  box: svg(`<path d='M21 8 12 3 3 8v8l9 5 9-5z'/><path d='m3 8 9 5 9-5M12 13v8'/>`),
  truck: svg(`<path d='M1 5h14v11H1zM15 9h4l4 4v3h-8z'/><circle cx='5.5' cy='18.5' r='2'/><circle cx='18.5' cy='18.5' r='2'/>`),
};

const ROWS: {icon: string; text: string}[] = [
  {icon: 'clock', text: 'A convenient delivery appointment'},
  {icon: 'marker', text: 'Furniture placed in the room of your choice'},
  {icon: 'box', text: 'Full setup and packaging removal'},
  {icon: 'truck', text: 'Small items ship FREE via FedEx or UPS'},
];

function WhiteGloveCard() {
  return (
    <s-stack
      background="base"
      border="base"
      borderRadius="base"
      padding="base"
      gap="base"
    >
      <s-heading>FREE "White-Glove" In-Home Delivery Includes...</s-heading>
      <s-stack gap="small-200">
        {ROWS.map((row) => (
          <s-stack key={row.text} direction="inline" gap="base" alignItems="center">
            <s-image src={ICONS[row.icon]} alt="" inlineSize="auto" aspectRatio="1/1" />
            <s-text>{row.text}</s-text>
          </s-stack>
        ))}
      </s-stack>
    </s-stack>
  );
}

export default function () {
  render(<WhiteGloveCard />, document.body);
}
