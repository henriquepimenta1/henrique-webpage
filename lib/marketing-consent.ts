import { MARKETING_CONSENT_KEY } from "./lut-tracking";

export type MarketingConsent = "accepted" | "declined" | null;
export type MetaWindow = Window & { fbq?: (...args: unknown[]) => void };
let memoryConsent: MarketingConsent = null;
let memoryOnly = false;
const changed = "henriq-marketing-change";

export function readMarketingConsent(): MarketingConsent {
  if (memoryOnly) return memoryConsent;
  try {
    const stored = localStorage.getItem(MARKETING_CONSENT_KEY);
    return stored === "accepted" || stored === "declined" ? stored : null;
  } catch { return memoryConsent; }
}

export function subscribeMarketingConsent(callback: () => void) {
  const update = () => {
    // Revoke in every tab even while Meta's SDK is downloading.
    (window as MetaWindow).fbq?.("consent", readMarketingConsent() === "accepted" ? "grant" : "revoke");
    callback();
  };
  window.addEventListener(changed, update);
  window.addEventListener("storage", update);
  return () => {
    window.removeEventListener(changed, update);
    window.removeEventListener("storage", update);
  };
}

export function chooseMarketingConsent(value: Exclude<MarketingConsent, null>) {
  memoryConsent = value;
  try {
    localStorage.setItem(MARKETING_CONSENT_KEY, value);
    memoryOnly = false;
  } catch { memoryOnly = true; }
  (window as MetaWindow).fbq?.("consent", value === "accepted" ? "grant" : "revoke");
  window.dispatchEvent(new Event(changed));
}
