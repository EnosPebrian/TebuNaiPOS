import { describe, expect, it } from "vitest";
import { orderQueryParams, parseOrderQuery } from "@/domain/order/query";

describe("staff order filters", () => {
  it("keeps defaults compatible and normalizes reference prefixes", () => {
    expect(parseOrderQuery(new URLSearchParams())).toEqual({ page: 1, view: "orders", filters: {} });
    expect(parseOrderQuery(new URLSearchParams("reference=ABCDEF12&payment=paid&source=counter&method=pickup&page=2"))).toMatchObject({ page: 2, filters: { reference: "abcdef12", payment: "paid", source: "counter", method: "pickup" } });
  });
  it("rejects wildcard/operator searches and short references", () => {
    for (const reference of ["abc", ".*", "12345678.*", "$ne", "12345678".repeat(5)]) expect(() => parseOrderQuery(new URLSearchParams({ reference }))).toThrow();
  });
  it("validates every enum and duplicate filter", () => {
    for (const query of ["payment=refunded", "source=other", "method=post", "status=invalid", "view=other", "payment=paid&payment=unpaid", "view=kitchen&status=completed"]) expect(() => parseOrderQuery(new URLSearchParams(query))).toThrow();
  });
  it("requires paired valid WIB dates and bounded pagination", () => {
    for (const query of ["from=2026-10-28", "from=2026-02-30&to=2026-03-01", "from=2026-01-01&to=2026-02-01", "page=0", "page=1001", "page=1e2", "page=1.2"]) expect(() => parseOrderQuery(new URLSearchParams(query))).toThrow();
    expect(parseOrderQuery(new URLSearchParams("from=2026-10-28&to=2026-10-28")).filters.from).toBe("2026-10-28");
  });
  it("round-trips applied filters without including empty values", () => {
    const params = orderQueryParams(3, "kitchen", { status: "ready", payment: "unpaid", reference: "12345678", from: "2026-10-28", to: "2026-10-28" });
    expect(parseOrderQuery(params)).toMatchObject({ page: 3, view: "kitchen", filters: { status: "ready", payment: "unpaid", reference: "12345678" } });
    expect(orderQueryParams(1, "orders", {}).has("reference")).toBe(false);
  });
});
