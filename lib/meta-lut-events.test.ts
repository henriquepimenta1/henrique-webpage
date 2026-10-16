import { afterEach, expect, it, vi } from "vitest";
import { LUT_PIXEL_ID } from "./lut-tracking";
import { scheduleLutView } from "./meta-lut-events";

afterEach(() => vi.unstubAllGlobals());

it("sends the first view after bootstrap and avoids duplicates on remount", async () => {
  const target: { fbq?: ReturnType<typeof vi.fn> } = {};
  vi.stubGlobal("window", target);
  vi.stubGlobal("localStorage", { getItem: () => "accepted" });
  const sent = { current: false };
  scheduleLutView(sent); // onReady runs before Next appends the inline script.
  expect(sent.current).toBe(false);
  target.fbq = vi.fn(); // inline bootstrap executes synchronously after onReady.
  await Promise.resolve();
  expect(target.fbq).toHaveBeenCalledWith("trackSingle", LUT_PIXEL_ID, "PageView");
  expect(target.fbq).toHaveBeenCalledWith("trackSingle", LUT_PIXEL_ID, "ViewContent", expect.objectContaining({value:37.9,currency:"BRL"}));
  scheduleLutView(sent);
  await Promise.resolve();
  expect(target.fbq).toHaveBeenCalledTimes(3);
});

it("does not send if consent is withdrawn before deferred execution", async () => {
  let consent = "accepted";
  const fbq = vi.fn();
  vi.stubGlobal("window", { fbq });
  vi.stubGlobal("localStorage", { getItem: () => consent });
  scheduleLutView({ current: false });
  consent = "declined";
  await Promise.resolve();
  expect(fbq).not.toHaveBeenCalled();
});
