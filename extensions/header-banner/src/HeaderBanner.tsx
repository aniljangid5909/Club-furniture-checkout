import '@shopify/ui-extensions/preact';
import {render} from 'preact';

// 30-day header banner — purchase.checkout.header.render-after
//
// One image holding all four blocks, as on the old three-page checkout (Jeff, 2 Nov 2026):
// a single row on desktop, a 2×2 box on mobile. Replaces the old app's "image" block, which
// spreads four separate images across the wide header. Same container-query pattern as the
// trust strip.

const BP = 600; // px

const DESKTOP_IMAGE = 'https://cdn.shopify.com/s/files/1/1971/0317/files/cf-30day-banner-desktop.png';
const MOBILE_IMAGE = 'https://cdn.shopify.com/s/files/1/1971/0317/files/cf-30day-banner-mobile.png';

const ALT =
  "Try it in your own home for 30 days. Like it? Keep it and enjoy! Don't like it? Return it for free. Mistake-free ordering.";

function HeaderBanner() {
  return (
    <s-query-container>
      <s-stack display={`@container (inline-size > ${BP}px) none, auto`} alignItems="center">
        <s-image src={MOBILE_IMAGE} alt={ALT} inlineSize="auto" />
      </s-stack>
      <s-stack display={`@container (inline-size > ${BP}px) auto, none`}>
        <s-image src={DESKTOP_IMAGE} alt={ALT} inlineSize="auto" />
      </s-stack>
    </s-query-container>
  );
}

export default function () {
  render(<HeaderBanner />, document.body);
}
