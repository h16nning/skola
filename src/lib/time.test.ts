import { describe, expect, it } from "vitest";
import { milliSecondsToDays } from "./time";

describe("milliSecondsToDays", () => {
  it("converts whole days", () => {
    expect(milliSecondsToDays(86400000)).toBe(1);
    expect(milliSecondsToDays(3 * 86400000)).toBe(3);
  });

  it("rounds partial days up", () => {
    expect(milliSecondsToDays(1)).toBe(1);
    expect(milliSecondsToDays(86400001)).toBe(2);
  });

  it("returns zero for zero", () => {
    expect(milliSecondsToDays(0)).toBe(0);
  });
});
