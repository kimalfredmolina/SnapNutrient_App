import { isSameDay, isBeforeMidnight } from "../utils/dateUtils";

describe("dateUtils", () => {
  it("isSameDay returns true for identical dates", () => {
    const a = new Date(2025, 0, 1, 10, 0, 0);
    const b = new Date(2025, 0, 1, 23, 59, 59);
    expect(isSameDay(a, b)).toBe(true);
  });

  it("isSameDay returns false for different days", () => {
    const a = new Date(2025, 0, 1);
    const b = new Date(2025, 0, 2);
    expect(isSameDay(a, b)).toBe(false);
  });

  it("isBeforeMidnight returns true for times before 23:59:59.999", () => {
    const d = new Date(2025, 5, 15, 12, 0, 0);
    expect(isBeforeMidnight(d)).toBe(true);
  });

  it("isBeforeMidnight returns false when date is at or past the constructed midnight boundary", () => {
    const d = new Date(2025, 5, 15);
    // Set hours to exactly 23:59:59.999 to push at the boundary
    d.setHours(23, 59, 59, 999);
    expect(isBeforeMidnight(d)).toBe(false);
  });
});
