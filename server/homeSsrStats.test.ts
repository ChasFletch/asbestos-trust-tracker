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
});
