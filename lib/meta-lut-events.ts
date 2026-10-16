import { LUT_PIXEL_ID } from "./lut-tracking";
import { readMarketingConsent, type MetaWindow } from "./marketing-consent";

export function scheduleLutView(sent: { current: boolean }) {
  // Next calls an inline Script's onReady before appending/executing the script.
  // The microtask runs after the bootstrap has installed fbq's queue.
  queueMicrotask(() => {
    if (sent.current || readMarketingConsent() !== "accepted") return;
    const fbq = (window as MetaWindow).fbq;
    if (!fbq) return;
    sent.current = true;
    fbq("consent", "grant");
    fbq("trackSingle", LUT_PIXEL_ID, "PageView");
    fbq("trackSingle", LUT_PIXEL_ID, "ViewContent", {
      content_ids: ["01c60a70-4520-4ea9-83c9-e6cccdca9544"],
      content_name: "Outdoor Cinematic - Pack 3D LUTs", content_type: "product",
      value: 37.9, currency: "BRL",
    });
  });
}
