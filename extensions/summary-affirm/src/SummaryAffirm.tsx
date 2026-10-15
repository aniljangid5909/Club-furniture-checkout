import '@shopify/ui-extensions/preact';
import {render} from 'preact';

// §3.8 Order-summary Affirm one-liner — purchase.checkout.block.render
// Place UNDER THE TOTALS in the checkout editor (desktop: below total). On 1-page
// mobile, block.render under totals renders below the pay button.
//
// "Or as low as $X/mo with Affirm."  Same calculation + settings as §3.4.
// Icon is the design's ORANGE (#D4732A) credit-card as an <s-image> SVG.

const CARD_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23D4732A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='5' width='20' height='14' rx='2'/><path d='M2 10h20'/></svg>";

function money(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return '$' + Math.round(amount);
  }
}

function monthlyPayment(total: number, months: number, apr: number): number {
  const n = months > 0 ? months : 36;
  const r = (apr || 0) / 1200; // monthly rate from an annual percentage
  const pmt = r === 0 ? total / n : (total * r) / (1 - Math.pow(1 + r, -n));
  return Math.round(pmt);
}

function SummaryAffirm() {
  const settings = shopify.settings.value as {
    financing_months?: number;
    financing_apr?: number;
    affirm_min_total?: number;
  };
  const total = shopify.cost.totalAmount.value;
  const min = settings?.affirm_min_total ?? 50;

  if (!total || total.amount < min) return null;

  const pmt = monthlyPayment(
    total.amount,
    settings?.financing_months ?? 36,
    settings?.financing_apr ?? 0,
  );

  return (
    <s-stack direction="inline" gap="base" alignItems="center">
      <s-image src={CARD_ICON} alt="" inlineSize="auto" aspectRatio="1/1" />
      <s-text>
        Or as low as <s-text type="strong">{money(pmt, total.currencyCode)}/mo</s-text> with Affirm.
      </s-text>
    </s-stack>
  );
}

export default function () {
  render(<SummaryAffirm />, document.body);
}
