import { describe, expect, it } from "vitest";
import { formatFileSize, formatNpr, formatPercent, initials, rangeToDates } from "./format";

describe("format helpers", () => {
  it("formats NPR with two decimals", () => {
    const formatted = formatNpr(134.5);
    expect(formatted).toMatch(/134/);
    expect(formatted).toMatch(/50/);
    expect(formatNpr(null)).toBe("—");
  });

  it("formats percentages with a sign", () => {
    expect(formatPercent(1.25)).toBe("+1.25%");
    expect(formatPercent(-0.4)).toBe("-0.40%");
    expect(formatPercent("2")).toBe("+2.00%");
  });

  it("formats file sizes", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(1048576)).toBe("1.0 MB");
  });

  it("builds initials from a full name", () => {
    expect(initials("Rajendra Adhikari")).toBe("RA");
    expect(initials("Meera")).toBe("M");
  });

  it("maps named ranges to ISO dates", () => {
    const { from, to } = rangeToDates("today");
    expect(from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(from <= to).toBe(true);
  });
});
