import '@shopify/ui-extensions';

//@ts-ignore
declare module './src/SwatchOptIn.tsx' {
  const shopify: import('@shopify/ui-extensions/purchase.checkout.contact.render-after').Api;
  const globalThis: { shopify: typeof shopify };
}
