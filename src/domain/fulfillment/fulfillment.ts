export type Fulfillment =
  | { readonly method: "pickup" }
  | { readonly method: "delivery"; readonly address: string };
