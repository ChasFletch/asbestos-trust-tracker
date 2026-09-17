import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const debtClockSource = readFileSync(
  resolve(process.cwd(), "client/src/components/DebtClock.tsx"),
  "utf8"
);

describe("DebtClock cumulative payout modal", () => {
  it("marks older filed rows as documented historical floors", () => {
    expect(debtClockSource).toContain("Historical floor");
    expect(debtClockSource).toContain("documented minimum through");
    expect(debtClockSource).toContain("later payments are not included");
  });

  it("uses live payout values instead of the retired $24B copy", () => {
    expect(debtClockSource).toContain("How ${(payouts / 1e9).toFixed(2)}B Is Calculated");
    expect(debtClockSource).not.toContain("How $24B Is Calculated");
    expect(debtClockSource).toContain("trustsWithCumulativePaidFiled");
  });
});
