import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useState} from 'preact/hooks';

// §3.9 "Why Buy From Us" card — purchase.checkout.block.render
// Place UNDER the Affirm one-liner (§3.8), under the totals, in the checkout editor.
// On 1-page mobile, block.render under totals renders below the pay button.
//
// Rating row: 4 full + 1 half yellow star (image assets — checkout icons can't be
// yellow), rating, customer count. Manual review slider (no autoplay), prev/next
// with a "1 of 5" counter, wraps at both ends. Divider + Trust Guard line.
//
// Reviews are VERBATIM. Never edit them. No dates.

const REVIEWS: {text: string; name: string}[] = [
  {
    text:
      "I am thrilled with my custom sofa and loveseat, comfortable and beautifully made. The price was so reasonable, my two sofas cost a little more than my sister's recent Pottery Barn single sofa purchase. Delivery was earlier than I even expected, and delivery guys were great. I cannot tell you how happy I am with my purchase. Thank you so much!",
    name: 'L. Hogans, MD',
  },
  {
    text:
      "Club Furniture's reps were very responsive to my calls and questions. The finished piece is beautiful, comfortable and well made. I am very happy with my experience!",
    name: 'S. Adams, MI',
  },
  {
    text:
      'First time purchaser of Club Furniture and a lifelong customer of high end, brand names. Bought the Newport sofa bed and recliner set. Completely amazed at the quality. Better built than most all of our other high-end furniture. The set is gorgeous!',
    name: 'S. Galloway, MA',
  },
  {
    text:
      'So happy with my purchase. Able to choose upholstery easily. Color on screen very accurate. Delivery was fantastic. Right on time. Many thanks. Would recommend to everyone!',
    name: 'P. Taggart, NJ',
  },
  {
    text:
      "I ordered a tufted sofa, it has got to be one of the most beautiful pieces of furniture I've ever seen. The quality could not be higher, the leather in both feel and color is magnificent. American made furniture cannot be beat. I strongly recommend Club Furniture without hesitation.",
    name: 'C. Morgenstern, NC',
  },
];

// Gold stars (#FFCD3C) from the design (OrderSummary.dc.html). <s-icon> can't be
// tinted, so stars render as <s-image> SVGs. Default: inline data-URI SVG (no
// upload). Optionally override with hosted URLs via settings (star_full_url /
// star_half_url) if the sandbox blocks data URIs.
const STAR_PATH = 'm12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z';
const STAR_FULL =
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='%23FFCD3C'><path d='${STAR_PATH}'/></svg>`;
const STAR_HALF =
  `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'><defs><clipPath id='h'><rect x='0' y='0' width='12' height='24'/></clipPath></defs><path d='${STAR_PATH}' fill='%23FFFFFF' stroke='%23CFC6B9' stroke-width='1.5' stroke-linejoin='round'/><path d='${STAR_PATH}' fill='%23FFCD3C' clip-path='url(%23h)'/></svg>`;

function Stars({fullUrl, halfUrl}: {fullUrl?: string; halfUrl?: string}) {
  const full = fullUrl || STAR_FULL;
  const half = halfUrl || STAR_HALF;
  return (
    <s-stack direction="inline" gap="none">
      {[0, 1, 2, 3].map((k) => (
        <s-image key={k} src={full} alt="" inlineSize="auto" aspectRatio="1/1" />
      ))}
      <s-image src={half} alt="" inlineSize="auto" aspectRatio="1/1" />
    </s-stack>
  );
}

function WhyBuyFromUs() {
  const settings = shopify.settings.value as {
    rating?: string;
    customer_count?: string;
    star_full_url?: string;
    star_half_url?: string;
  };
  const rating = settings?.rating || '4.7';
  const customerCount = settings?.customer_count || '30,000+';

  const n = REVIEWS.length;
  const [i, setI] = useState(0);
  const review = REVIEWS[i];
  const prev = () => setI((i + n - 1) % n);
  const next = () => setI((i + 1) % n);

  return (
    <s-stack background="base" border="base" borderRadius="base" padding="base" gap="base">
      <s-heading>Why Buy From Us</s-heading>

      {/* Rating row */}
      <s-stack direction="inline" gap="small-200" alignItems="center">
        <Stars fullUrl={settings?.star_full_url} halfUrl={settings?.star_half_url} />
        <s-text type="strong">{rating}</s-text>
        <s-text color="subdued">· {customerCount} Satisfied Customers</s-text>
      </s-stack>

      {/* Review slider (manual, no autoplay) */}
      <s-stack gap="small-200">
        <s-text>"{review.text}"</s-text>
        <s-text type="small">
          <s-text type="strong">{review.name}</s-text>
        </s-text>
      </s-stack>

      <s-stack direction="inline" gap="base" alignItems="center">
        <s-button accessibilityLabel="Previous review" onClick={prev}>
          <s-icon type="chevron-left" />
        </s-button>
        <s-text type="small" color="subdued">
          {i + 1} of {n}
        </s-text>
        <s-button accessibilityLabel="Next review" onClick={next}>
          <s-icon type="chevron-right" />
        </s-button>
      </s-stack>

      <s-divider />

      {/* Trust Guard line */}
      <s-stack direction="inline" gap="small-200" alignItems="center">
        <s-icon type="lock" />
        <s-text type="small" color="subdued">
          Secured and scanned daily by Trust Guard
        </s-text>
      </s-stack>
    </s-stack>
  );
}

export default function () {
  render(<WhyBuyFromUs />, document.body);
}

