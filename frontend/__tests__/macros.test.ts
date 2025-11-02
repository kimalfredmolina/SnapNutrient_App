import { computeDishMacros } from "../app/macros/compute_dish";

describe("computeDishMacros", () => {
  it("returns null for unknown dish", () => {
    expect(computeDishMacros("nonexistent_dish" as any)).toBeNull();
  });

  it("computes macros for chicken_inasal correctly", () => {
    const res = computeDishMacros("chicken_inasal", 1);
    // chicken_inasal uses chicken_thigh = 113g
    // ingredientMacros.chicken_thigh: protein 0.25, fats 0.08, calories 2.09
    expect(res).toBeTruthy();
    expect(res).toEqual({
      carbs: 0,
      protein: 28.3, // 0.25 * 113 = 28.25 -> 28.3
      fats: 9.0, // 0.08 * 113 = 9.04 -> 9.0
      calories: 236.2, // 2.09 * 113 = 236.17 -> 236.2
    });
  });

  /*it("respects grams multiplier", () => {
    const half = computeDishMacros("chicken_inasal", 0.5);
    expect(half).toEqual({
      carbs: 0,
      protein: 14.2, // approx half of 28.3 -> 14.15 -> 14.2
      fats: 4.5,
      calories: 118.1,
    });
  });*/
});
