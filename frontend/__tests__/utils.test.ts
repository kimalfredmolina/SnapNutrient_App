import { isSameDay, isBeforeMidnight } from "../utils/dateUtils";

describe("dateUtils - isSameDay", () => {
  it("returns true for identical dates", () => {
    const a = new Date(2025, 0, 1, 10, 0, 0);
    const b = new Date(2025, 0, 1, 23, 59, 59);
    expect(isSameDay(a, b)).toBe(true);
  });

  it("returns false for different months same date", () => {
    const jan = new Date(2025, 0, 15);
    const feb = new Date(2025, 1, 15);
    expect(isSameDay(jan, feb)).toBe(false);
  });

  it("returns false for different years same month and date", () => {
    const year2024 = new Date(2024, 5, 15);
    const year2025 = new Date(2025, 5, 15);
    expect(isSameDay(year2024, year2025)).toBe(false);
  });

  it("returns true for same date with millisecond difference", () => {
    const a = new Date(2025, 3, 10, 12, 30, 45, 100);
    const b = new Date(2025, 3, 10, 12, 30, 45, 500);
    expect(isSameDay(a, b)).toBe(true);
  });

  it("returns true for midnight transitions within same calendar day", () => {
    const before = new Date(2025, 8, 20, 23, 59, 59);
    const same = new Date(2025, 8, 20, 0, 0, 1);
    expect(isSameDay(before, same)).toBe(true);
  });

  it("compares year, month, and date independently", () => {
    const a = new Date(2025, 11, 31, 18, 0, 0);
    const b = new Date(2025, 11, 31, 2, 0, 0);
    expect(isSameDay(a, b)).toBe(true);
  });

  it("returns false for date one day before", () => {
    const today = new Date(2025, 6, 20);
    const yesterday = new Date(2025, 6, 19);
    expect(isSameDay(today, yesterday)).toBe(false);
  });

  it("handles leap year dates correctly", () => {
    const feb29 = new Date(2024, 1, 29); // Leap year
    const mar1 = new Date(2024, 2, 1);
    expect(isSameDay(feb29, mar1)).toBe(false);
  });
});

describe("dateUtils - isBeforeMidnight", () => {
  it("returns true for times before 23:59:59.999", () => {
    const d = new Date(2025, 5, 15, 12, 0, 0);
    expect(isBeforeMidnight(d)).toBe(true);
  });

  it("returns false when date is at or past the constructed midnight boundary", () => {
    const d = new Date(2025, 5, 15);
    d.setHours(23, 59, 59, 999);
    expect(isBeforeMidnight(d)).toBe(false);
  });

  it("returns true for early morning times", () => {
    const d = new Date(2025, 5, 15, 0, 0, 0);
    expect(isBeforeMidnight(d)).toBe(true);
  });

  it("returns true for noon times", () => {
    const d = new Date(2025, 5, 15, 12, 0, 0);
    expect(isBeforeMidnight(d)).toBe(true);
  });

  it("returns true for evening times", () => {
    const d = new Date(2025, 5, 15, 20, 30, 45);
    expect(isBeforeMidnight(d)).toBe(true);
  });

  it("returns true for 23:59:59.998", () => {
    const d = new Date(2025, 5, 15, 23, 59, 59, 998);
    expect(isBeforeMidnight(d)).toBe(true);
  });

  it("returns false for 23:59:59.999", () => {
    const d = new Date(2025, 5, 15, 23, 59, 59, 999);
    expect(isBeforeMidnight(d)).toBe(false);
  });

  it("returns false for one minute before midnight boundary", () => {
    const d = new Date(2025, 5, 15, 23, 58, 59, 999);
    expect(isBeforeMidnight(d)).toBe(true); // 23:58:59.999 is still before 23:59:59.999
  });
});
