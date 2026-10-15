import '@shopify/ui-extensions/preact';
import {render} from 'preact';

// §3.4 Payment reassurance + Affirm box — purchase.checkout.payment-method-list.render-before
// Sits under the native "Payment" heading. No second heading.
//
// 1) Reassurance line: green (success) lock + text + info button → "Secure Payment" modal.
// 2) Affirm box: subdued bg, ORANGE (#D4732A) credit-card icon + estimate + compliance text.
//    Hidden below affirm_min_total. Estimate recalculates with the total (reactive signal).
//
// The green lock uses s-icon tone="success" (#55AA33, matches design). The orange
// credit-card icon can't be a tinted s-icon, so it renders as an <s-image> SVG
// (design path from CheckoutMain.dc.html). The info glyph stays a default s-icon.

const CARD_ICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23D4732A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='5' width='20' height='14' rx='2'/><path d='M2 10h20'/></svg>";

const DEFAULT_LEGAL =
  'Rates from 0–36% APR. Payment options through Affirm are subject to eligibility, may not be available in all states, and require a down payment. Affirm Loan Services, LLC, NMLS ID 1883174. affirm.com/licenses';

const SECURE_PAYMENT_BODY =
  'Rest assured, your credit card and personal information are 100% encrypted and SSL secure. Your credit card will not be charged until your order has been confirmed over the phone after you receive your swatch kit in the mail (we only "authorize" your credit card when you checkout today).';

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
  const r = (apr || 0) / 1200;
  const pmt = r === 0 ? total / n : (total * r) / (1 - Math.pow(1 + r, -n));
  return Math.round(pmt);
}

function PaymentReassurance() {
  const settings = shopify.settings.value as {
    financing_months?: number;
    financing_apr?: number;
    affirm_min_total?: number;
    affirm_legal_text?: string;
  };
  const total = shopify.cost.totalAmount.value;
  const min = settings?.affirm_min_total ?? 50;
  const showAffirm = !!total && total.amount >= min;
  const legal = settings?.affirm_legal_text || DEFAULT_LEGAL;

  return (
    <s-stack gap="base">
      {/* Reassurance line — green (success) lock PINNED at the start via s-grid
          (auto 1fr), so it doesn't drop to its own line; the text wraps in the 1fr
          column and the info button follows the text (connected), matching the
          design. s-text is inline-level and would otherwise take the full width and
          push the icon onto a separate line. */}
      {/* Green (success) lock at the start, text in the middle, and a clean info
          icon (s-icon type="info", like Shopify's native field help icons) on the
          right — wrapped in s-clickable to open the "Secure Payment" modal on tap.
          A crisp icon can't flow inline within the text, so it sits on the right. */}
      <s-grid gridTemplateColumns="auto 1fr auto" gap="small-200" alignItems="start">
        <s-icon type="lock" tone="success" />
        <s-text>
          All transactions are SSL secure and encrypted. Your credit card is not charged today,
          it's only "authorized" when you checkout.
        </s-text>
        <s-clickable
          command="--show"
          commandFor="secure-payment-modal"
          accessibilityLabel="About payment security"
        >
          <s-icon type="info" />
        </s-clickable>
      </s-grid>

      {/* Affirm box */}
      {showAffirm ? (
        <s-stack background="subdued" borderRadius="base" padding="base" gap="small-200">
          <s-stack direction="inline" gap="small-200" alignItems="start">
            <s-image src={CARD_ICON} alt="" inlineSize="auto" aspectRatio="1/1" />
            <s-text>
              Or pay as low as{' '}
              <s-text type="strong">{money(monthlyPayment(total!.amount, settings?.financing_months ?? 36, settings?.financing_apr ?? 0), total!.currencyCode)}/mo</s-text>{' '}
              with Affirm. Choose Affirm below.
            </s-text>
          </s-stack>
          <s-text type="small" color="subdued">
            {legal}
          </s-text>
        </s-stack>
      ) : null}

      {/* Secure Payment modal — close via the built-in X (top-right), no Close button */}
      <s-modal id="secure-payment-modal" heading="Secure Payment">
        <s-paragraph>{SECURE_PAYMENT_BODY}</s-paragraph>
      </s-modal>
    </s-stack>
  );
}

export default function () {
  render(<PaymentReassurance />, document.body);
}
