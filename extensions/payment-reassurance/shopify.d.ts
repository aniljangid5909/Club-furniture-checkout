import '@shopify/ui-extensions';

//@ts-ignore
declare module './src/PaymentReassurance.tsx' {
  const shopify: import('@shopify/ui-extensions/purchase.checkout.payment-method-list.render-before').Api;
  const globalThis: { shopify: typeof shopify };
}
