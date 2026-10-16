import { afterEach, describe, expect, it, vi } from "vitest";
import { MARKETING_CONSENT_KEY } from "./lut-tracking";
import { readMarketingConsent, subscribeMarketingConsent } from "./marketing-consent";

afterEach(() => vi.unstubAllGlobals());

describe("withdrawal in another tab", () => {
  it("queues revocation before rendering changes when the SDK is still loading", () => {
    let preference: string | null = "accepted";
    const queue: unknown[][] = [["consent", "grant"], ["trackSingle", "pixel", "ViewContent"]];
    const target = new EventTarget();
    Object.assign(target, { fbq: (...args: unknown[]) => queue.push(args) });
    vi.stubGlobal("window", target);
    vi.stubGlobal("localStorage", { getItem: (key: string) => key === MARKETING_CONSENT_KEY ? preference : null });
    const render = vi.fn(() => expect(queue.at(-1)).toEqual(["consent", "revoke"]));
    const unsubscribe = subscribeMarketingConsent(render);
    preference = "declined";
    target.dispatchEvent(new Event("storage"));
    expect(render).toHaveBeenCalledOnce();
    expect(readMarketingConsent()).toBe("declined");
    unsubscribe();
    target.dispatchEvent(new Event("storage"));
    expect(render).toHaveBeenCalledOnce();
  });
  it("treats cleared or invalid preferences as no consent", () => {
    vi.stubGlobal("localStorage", { getItem: () => null });
    expect(readMarketingConsent()).toBeNull();
    vi.stubGlobal("localStorage", { getItem: () => "unexpected" });
    expect(readMarketingConsent()).toBeNull();
  });
});
