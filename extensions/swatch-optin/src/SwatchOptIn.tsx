import '@shopify/ui-extensions/preact';
import {render} from 'preact';
import {useEffect} from 'preact/hooks';

// §3.2 Swatch-kit opt-in — purchase.checkout.contact.render-after
//
// Two modes via the `swatch_mode` setting (default native_link):
//   • extension   : checkbox checked by default + "FREE Swatch Kit" modal, and it
//                   records the choice as order attribute
//                   "Swatch Kit Requested" = Yes / No (writes Yes on first render).
//   • native_link : only a "FREE Swatch Kit details" link that opens the same modal,
//                   no checkbox, no attribute (used while the native email-marketing
//                   checkbox is still the live opt-in).
//
// Turning off the native marketing checkbox and switching swatch fulfilment to read
// the attribute are business decisions and are NOT done here.

const ATTR_KEY = 'Swatch Kit Requested';

const CHECKBOX_LABEL =
  'Yes, please Priority Mail me an entire kit of FREE fabric and/or leather swatches before my order is finalized.';

const MODAL_BODY =
  "Once you checkout online, we'll automatically Priority Mail you a complete kit of fabric and/or leather swatches that are available on the furniture item(s) you've ordered. Once you receive your swatch kit you can easily confirm, edit, totally change or even cancel your order with no penalty.";

function SwatchOptIn() {
  const settings = shopify.settings.value as {
    swatch_mode?: string;
    checkbox_label?: string;
    modal_body?: string;
  };
  const mode = settings?.swatch_mode === 'extension' ? 'extension' : 'native_link';
  // Editable in the extension settings; fall back to the design's wording.
  const label = settings?.checkbox_label || CHECKBOX_LABEL;
  const modalBody = settings?.modal_body || MODAL_BODY;

  const attrs = shopify.attributes.value as {key: string; value: string}[] | undefined;
  const current = attrs?.find((a) => a.key === ATTR_KEY)?.value;
  const checked = current !== 'No'; // Yes or unset → checked by default

  // Record the default (Yes) on first render when the attribute is missing.
  useEffect(() => {
    if (mode === 'extension' && current === undefined) {
      shopify.applyAttributeChange({type: 'updateAttribute', key: ATTR_KEY, value: 'Yes'});
    }
  }, [mode, current]);

  const onToggle = (event: Event) => {
    const next = (event.target as HTMLInputElement).checked ? 'Yes' : 'No';
    shopify.applyAttributeChange({type: 'updateAttribute', key: ATTR_KEY, value: next});
  };

  return (
    <s-stack gap="small-200">
      {mode === 'extension' ? (
        // Checkbox with its visible label (toggles) + a clean info icon on the right
        // that opens the FREE Swatch Kit modal on tap. Known-working layout.
        <s-grid gridTemplateColumns="1fr auto" gap="small-200" alignItems="start">
          <s-checkbox checked={checked} onChange={onToggle} label={label} />
          <s-clickable
            command="--show"
            commandFor="swatch-modal"
            accessibilityLabel="About the swatch kit"
          >
            <s-icon type="info" />
          </s-clickable>
        </s-grid>
      ) : (
        // native_link mode (Option B): the native (relabelled) marketing checkbox
        // carries the swatch opt-in; this extension shows only a clean info (i) icon
        // that opens the FREE Swatch Kit details modal.
        <s-clickable
          command="--show"
          commandFor="swatch-modal"
          accessibilityLabel="FREE Swatch Kit details"
        >
          <s-icon type="info" />
        </s-clickable>
      )}

      {/* Close via the modal's built-in X (top-right) — no separate Close button. */}
      <s-modal id="swatch-modal" heading="FREE Swatch Kit">
        <s-paragraph>{modalBody}</s-paragraph>
      </s-modal>
    </s-stack>
  );
}

export default function () {
  render(<SwatchOptIn />, document.body);
}
