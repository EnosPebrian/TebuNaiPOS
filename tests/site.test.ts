import { describe, expect, it } from "vitest";
import { parseSiteUrl } from "@/config/site-url";

describe("site origin configuration", () => {
  it("does not invent an origin when missing or malformed", () => {
    for (const value of [undefined, "", "example.com", "javascript:alert(1)", "https://name:secret@example.com"]) {
      expect(parseSiteUrl(value)).toBeNull();
    }
  });
  it("normalizes an explicitly configured origin", () => {
    expect(parseSiteUrl(" https://example.com/menu ")).toBe("https://example.com");
  });
});
