import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const homeSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/Home.tsx"),
  "utf8"
);

describe("Homepage statistic SSR", () => {
  it("renders statistic targets in the initial SSR-compatible state", () => {
    expect(homeSource).toContain("const [value, setValue] = useState(target);");
    expect(homeSource).toContain("setValue(0);");
    expect(homeSource).toContain("{displayed}");
    expect(homeSource).not.toContain("{inView ? displayed : 0}");
  });

  it("includes the source-qualified Manville trust update with usable reader links", () => {
    expect(homeSource).toContain("Recent Trust Updates");
    expect(homeSource).toContain("Payment percentage increased from");
    expect(homeSource).toContain("5.1%");
    expect(homeSource).toContain("5.6%");
    expect(homeSource).toContain("/news/manville-payment-percentage-increase-september-2026");
    expect(homeSource).toContain("https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/");
    expect(homeSource).toContain("rel=\"noopener noreferrer\"");
  });
});
