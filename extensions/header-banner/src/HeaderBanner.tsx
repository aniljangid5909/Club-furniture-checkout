import '@shopify/ui-extensions/preact';
import {render} from 'preact';

// 30-day header banner — purchase.checkout.header.render-after
//
// One image holding all four blocks, as on the old three-page checkout (Jeff, 2 Nov 2026):
// a single row on desktop, a 2×2 box on mobile. Replaces the old app's "image" block, which
// spreads four separate images across the wide header. Same container-query pattern as the
// trust strip.

const BP = 600; // px

// Sharper artwork from Anil (3 Nov 2026). width= asks Shopify's CDN for a smaller copy, about 2× display size.
const DESKTOP_IMAGE =
  'https://cdn.shopify.com/s/files/1/1971/0317/files/ChatGPT_Image_Oct_1_2026_08_25_48_AM.png?v=1790823448&width=1200';
const MOBILE_IMAGE =
  'https://cdn.shopify.com/s/files/1/1971/0317/files/ChatGPT_Image_Oct_1_2026_08_33_16_AM.png?v=1790823866&width=800';

// Same artwork the old block opened on tap: the full guarantee and terms the FREE* points to.
const POPUP_IMAGE = 'https://cdn.shopify.com/s/files/1/1971/0317/files/cf-30day-guarantee-popup.jpg';

const POPUP_ALT =
  'Club Furniture exclusive Comfort, Quality and Satisfaction guarantee and 30-day in-home trial terms and conditions. Questions? Call toll free 1-888-378-8383.';

const ALT =
  "Try it in your own home for 30 days. Like it? Keep it and enjoy! Don't like it? Return it for free. Mistake-free ordering.";

function HeaderBanner() {
  return (
    <s-stack>
      <s-clickable
        command="--show"
        commandFor="guarantee-modal"
        accessibilityLabel="View our 30-day guarantee and terms"
      >
        <s-query-container>
          <s-stack display={`@container (inline-size > ${BP}px) none, auto`} alignItems="center">
            <s-image src={MOBILE_IMAGE} alt={ALT} inlineSize="auto" />
          </s-stack>
          {/* Capped so it stays close to the old banner's size instead of filling the header. */}
          <s-stack display={`@container (inline-size > ${BP}px) auto, none`} maxInlineSize="600px">
            <s-image src={DESKTOP_IMAGE} alt={ALT} inlineSize="auto" />
          </s-stack>
        </s-query-container>
      </s-clickable>

      {/* Close via the modal's built-in X (top-right) — no separate Close button. */}
      <s-modal id="guarantee-modal" accessibilityLabel="30-day guarantee and terms">
        <s-image src={POPUP_IMAGE} alt={POPUP_ALT} inlineSize="fill" />
      </s-modal>
    </s-stack>
  );
}

export default function () {
  render(<HeaderBanner />, document.body);
}
