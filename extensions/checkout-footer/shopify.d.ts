import '@shopify/ui-extensions';

//@ts-ignore
declare module './src/CheckoutFooter.tsx' {
  const shopify: import('@shopify/ui-extensions/purchase.checkout.footer.render-after').Api;
  const globalThis: { shopify: typeof shopify };
}
