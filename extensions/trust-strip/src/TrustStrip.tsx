import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useState, useEffect} from 'preact/hooks';

// §3.1 Header trust strip — purchase.checkout.header.render-after
//
// VERBATIM copy and icons. Orange (#D4732A) icons via <s-image> SVG (s-icon can't
// be tinted). Default source = inline data-URI SVG; optional hosted override via
// settings icon_*_url.
//
// Responsive (verified on shopify.dev): the `display` attribute accepts the
// container-query value syntax `@container (inline-size > Npx) a, b`. So we render
// BOTH layouts and let one show per width:
//   • WIDE (desktop, full-width band > 600px): all three items in a centred row.
//   • NARROW (mobile, < 600px): ONE item at a time, auto-rotating every 3.5s —
//     the design's mobile slider. The timer keeps running when hidden (harmless;
//     no JS width signal exists to gate it).
// The warm-beige band colour (#F5F1EB) comes from the BRANDING subdued scheme
// (Header → Color scheme = Scheme 2); default grey until that's set.

const ACCENT = '%23D4732A';
const svg = (inner: string) =>
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${ACCENT}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${inner}</svg>`;

const ICON_DATA: Record<string, string> = {
  lock: svg(`<rect x='4' y='11' width='16' height='10' rx='2'/><path d='M8 11V7a4 4 0 0 1 8 0v4'/>`),
  truck: svg(`<path d='M1 5h14v11H1zM15 9h4l4 4v3h-8z'/><circle cx='5.5' cy='18.5' r='2'/><circle cx='18.5' cy='18.5' r='2'/>`),
  return: svg(`<path d='M3 7v6h6'/><path d='M21 17a9 9 0 0 0-15-6.7L3 13'/>`),
};

const ITEMS = [
  {icon: 'lock', text: 'SSL Secure Checkout'},
  {icon: 'truck', text: 'FREE Shipping + FREE In-Home Delivery'},
  {icon: 'return', text: '"Buy-It-Back" Guarantee'},
];

// Full-width band: desktop content ≫ 600px, mobile content < 600px.
const BP = 600; // px

function TrustStrip() {
  const settings = shopify.settings.value as {
    icon_lock_url?: string;
    icon_truck_url?: string;
    icon_return_url?: string;
  };
  const srcFor = (key: string) =>
    (settings?.[`icon_${key}_url` as keyof typeof settings] as string) || ICON_DATA[key];

  // Mobile slider index — rotates every 3.5s (only visible on narrow widths).
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % ITEMS.length), 3500);
    return () => clearInterval(id);
  }, []);

  const item = (it: {icon: string; text: string}) => (
    <s-stack key={it.text} direction="inline" gap="small-200" alignItems="center">
      <s-image src={srcFor(it.icon)} alt="" inlineSize="auto" aspectRatio="1/1" />
      <s-text type="strong">{it.text}</s-text>
    </s-stack>
  );

  return (
    <s-box background="subdued" padding="base" inlineSize="100%">
      <s-query-container>
        {/* NARROW (mobile): one rotating item, centred */}
        <s-stack
          display={`@container (inline-size > ${BP}px) none, auto`}
          direction="inline"
          alignItems="center"
          justifyContent="center"
        >
          {item(ITEMS[i])}
        </s-stack>

        {/* WIDE (desktop): all three, centred, wrapping if needed */}
        <s-stack
          display={`@container (inline-size > ${BP}px) auto, none`}
          direction="inline"
          gap="base small-300"
          alignItems="center"
          justifyContent="center"
        >
          {ITEMS.map((it) => item(it))}
        </s-stack>
      </s-query-container>
    </s-box>
  );
}

export default function () {
  render(<TrustStrip />, document.body);
}
