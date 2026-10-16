export const LUT_PIXEL_ID = "1027345556416894";
export const LUT_CHECKOUT = "https://pay.cakto.com.br/6tNxcGs";
export const MARKETING_CONSENT_KEY = "henriq-marketing-v1";

/** Only campaign attribution parameters cross into the checkout. */
export function lutCheckoutUrl(search: string, allowIdentifiers = false): string {
  const source = new URLSearchParams(search);
  const target = new URL(LUT_CHECKOUT);
  const allowed = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  if (allowIdentifiers) allowed.push("fbclid");
  for (const key of allowed) {
    const value = source.get(key);
    if (value && value.length <= 500) target.searchParams.set(key, value);
  }
  return target.toString();
}
