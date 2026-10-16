import { describe, expect, it } from "vitest";
import { LUT_CHECKOUT, lutCheckoutUrl } from "./lut-tracking";

describe("LUT checkout attribution", () => {
  it("preserves campaign attribution without forwarding customer data or arbitrary destinations", () => {
    const url = new URL(lutCheckoutUrl("?utm_source=instagram&utm_content=antes%2Fdepois&email=private%40example.com&redirect=https://evil.example&fbclid=click-id"));
    expect(url.origin + url.pathname).toBe(LUT_CHECKOUT);
    expect([...url.searchParams]).toEqual([["utm_source", "instagram"], ["utm_content", "antes/depois"]]);
  });
  it("forwards the click identifier only after acceptance", () => {
    expect(new URL(lutCheckoutUrl("?fbclid=click-id", true)).searchParams.get("fbclid")).toBe("click-id");
    expect(lutCheckoutUrl("?fbclid=click-id", false)).toBe(LUT_CHECKOUT);
  });
  it("ignores oversized tracking values and leaves checkout working without parameters", () => {
    expect(lutCheckoutUrl("?utm_source=" + "x".repeat(501))).toBe(LUT_CHECKOUT);
    expect(lutCheckoutUrl("")).toBe(LUT_CHECKOUT);
  });
});
