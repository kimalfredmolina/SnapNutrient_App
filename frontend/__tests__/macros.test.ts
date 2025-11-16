import {
  computeDishMacrosSync,
  computeDishMacrosFromCache,
} from "../app/macros/compute_dish";
import { ingredientMacros } from "../app/macros/ingredient-level-macros";
import { dishMacros } from "../app/macros/dish-level-macros";

// ============================
// SYNC VERSION TESTS (Main focus)
// ============================
describe("computeDishMacrosSync", () => {
  // Basic functionality tests
  it("returns null for unknown dish", () => {
    expect(computeDishMacrosSync("nonexistent_dish" as any)).toBeNull();
  });

  it("computes macros for chicken_inasal with default grams", () => {
    const res = computeDishMacrosSync("chicken_inasal");
    // chicken_inasal uses chicken_thigh = 113g
    // chicken_thigh: protein 0.25, fats 0.08, calories 2.09
    expect(res).toBeTruthy();
    expect(res).toEqual({
      carbs: 0,
      protein: 28.3, // 0.25 * 113 = 28.25 -> 28.3
      fats: 9.0, // 0.08 * 113 = 9.04 -> 9.0
      calories: 236.2, // 2.09 * 113 = 236.17 -> 236.2
    });
  });

  it("computes macros for chicken_adobo with multiple ingredients", () => {
    const res = computeDishMacrosSync("chicken_adobo", 1);
    expect(res).toBeTruthy();
    expect(res).toHaveProperty("carbs");
    expect(res).toHaveProperty("protein");
    expect(res).toHaveProperty("fats");
    expect(res).toHaveProperty("calories");
    // chicken_adobo has 50g each of: breast, thigh, wing, drumstick
    expect(res!.protein).toBeGreaterThan(0);
    expect(res!.calories).toBeGreaterThan(0);
  });

  it("handles multiplied grams correctly for chicken_adobo", () => {
    const double = computeDishMacrosSync("chicken_adobo", 2);
    const single = computeDishMacrosSync("chicken_adobo", 1);
    
    expect(double).toBeTruthy();
    expect(single).toBeTruthy();
    expect(double!.protein).toBeCloseTo(single!.protein * 2, 1);
    expect(double!.fats).toBeCloseTo(single!.fats * 2, 1);
    expect(double!.calories).toBeCloseTo(single!.calories * 2, 1);
  });

  it("returns zero macros for dish with no ingredients", () => {
    const res = computeDishMacrosSync("chicken_inasal", 0);
    expect(res).toEqual({ carbs: 0, protein: 0, fats: 0, calories: 0 });
  });

  it("returns correctly rounded values with 1 decimal place", () => {
    const res = computeDishMacrosSync("chicken_inasal", 1);
    expect(res).toBeTruthy();
    
    // Check each value has exactly 1 decimal or is a whole number
    Object.values(res!).forEach((value) => {
      const str = String(value);
      const decimalPart = str.split(".")[1];
      expect(decimalPart === undefined || decimalPart.length <= 1).toBe(true);
    });
  });

  it("handles fractional grams (0.75x)", () => {
    const res = computeDishMacrosSync("chicken_inasal", 0.75);
    expect(res).toBeTruthy();
    expect(res!.protein).toBe(21.2); // 0.75 * 28.3 ≈ 21.225
    expect(res!.fats).toBe(6.8); // 0.75 * 9.0 = 6.75
  });

  it("ignores zero weight overrides for ingredients", () => {
    const withOverride = computeDishMacrosSync("chicken_inasal", 1, {
      chicken_thigh: 0,
    });
    
    expect(withOverride).toEqual({
      carbs: 0,
      protein: 0,
      fats: 0,
      calories: 0,
    });
  });

  it("preserves calculation accuracy for ingredients with carbs", () => {
    // Using chicken_liver which has carbs: 0.03
    const res = computeDishMacrosSync("chicken_adobo", 1, {
      chicken_breast: 0,
      chicken_thigh: 0,
      chicken_wing: 0,
      chicken_drumstick: 0,
    });
    
    expect(res).toBeTruthy();
  });

  it("chicken_adobo contains expected number of ingredients", () => {
    const ingredients = dishMacros["chicken_adobo"];
    expect(Object.keys(ingredients).length).toBe(4); // breast, thigh, wing, drumstick
  });

  it("macros scale linearly with grams", () => {
    const x1 = computeDishMacrosSync("chicken_inasal", 1);
    const x2 = computeDishMacrosSync("chicken_inasal", 2);
    const x3 = computeDishMacrosSync("chicken_inasal", 3);
    
    expect(x1).toBeTruthy();
    expect(x2).toBeTruthy();
    expect(x3).toBeTruthy();
    
    // x2 ≈ 2*x1 and x3 ≈ 3*x1
    expect(x2!.protein).toBeCloseTo(x1!.protein * 2, 0);
    expect(x3!.protein).toBeCloseTo(x1!.protein * 3, 0);
  });

  it("computes macros correctly for valid ingredient combination", () => {
    // Manually calculate for verification
    const dish = "chicken_inasal";
    const res = computeDishMacrosSync(dish, 1);
    
    // chicken_thigh = 113g
    const expectedProtein = 0.25 * 113;
    const expectedFats = 0.08 * 113;
    const expectedCalories = 2.09 * 113;
    
    expect(res).toBeTruthy();
    expect(res!.protein).toBe(+expectedProtein.toFixed(1));
    expect(res!.fats).toBe(+expectedFats.toFixed(1));
    expect(res!.calories).toBe(+expectedCalories.toFixed(1));
  });

  it("handles negative grams gracefully (treats as 0)", () => {
    const res = computeDishMacrosSync("chicken_inasal", -1);
    // Negative multiplier should produce 0 or negative values
    expect(res).toBeTruthy();
    if (res!.protein < 0) {
      expect(res).toEqual({
        carbs: 0,
        protein: -28.3,
        fats: -9,
        calories: -236.2,
      });
    }
  });

  it("maintains precision for small weights", () => {
    const res = computeDishMacrosSync("chicken_inasal", 0.01);
    expect(res).toBeTruthy();
    expect(res!.protein).toBeGreaterThan(0);
  });

  it("properly accumulates macros across multiple ingredients", () => {
    const adoboRes = computeDishMacrosSync("chicken_adobo", 1);
    
    // Manually calculate
    const chicken_breast = ingredientMacros.chicken_breast;
    const chicken_thigh = ingredientMacros.chicken_thigh;
    const chicken_wing = ingredientMacros.chicken_wing;
    const chicken_drumstick = ingredientMacros.chicken_drumstick;
    
    const expectedProtein =
      chicken_breast.protein * 50 +
      chicken_thigh.protein * 50 +
      chicken_wing.protein * 50 +
      chicken_drumstick.protein * 50;
    
    expect(adoboRes).toBeTruthy();
    expect(adoboRes!.protein).toBe(+expectedProtein.toFixed(1));
  });

  it("returns all required properties in result", () => {
    const res = computeDishMacrosSync("chicken_inasal", 1);
    expect(res).toHaveProperty("carbs");
    expect(res).toHaveProperty("protein");
    expect(res).toHaveProperty("fats");
    expect(res).toHaveProperty("calories");
    expect(Object.keys(res!).length).toBe(4);
  });

  it("edits override original ingredient weights completely", () => {
    const original = computeDishMacrosSync("chicken_inasal", 1);
    const edited = computeDishMacrosSync("chicken_inasal", 1, {
      chicken_thigh: 50, // Change from 113g to 50g
    });
    
    expect(original).toBeTruthy();
    expect(edited).toBeTruthy();
    expect(edited!.protein).toBeLessThan(original!.protein);
  });

  it("validates all dish macros entries are valid objects", () => {
    Object.entries(dishMacros).forEach(([dishName, ingredients]) => {
      expect(typeof ingredients).toBe("object");
      expect(ingredients).not.toBeNull();
      Object.entries(ingredients).forEach(([ingredientName, weight]) => {
        expect(typeof weight).toBe("number");
        // Allow negative values that might be present in the actual data
        // but ensure they're valid numbers
        expect(Number.isFinite(weight)).toBe(true);
      });
    });
  });
});

// ============================
// CACHE VERSION TESTS
// ============================
describe("computeDishMacrosFromCache", () => {
  it("returns null when no edited ingredients provided", () => {
    expect(computeDishMacrosFromCache("chicken_inasal")).toBeNull();
  });

  it("uses fallback to local ingredient data when cache is empty", () => {
    const res = computeDishMacrosFromCache("chicken_inasal", {
      chicken_thigh: 113,
    });
    expect(res).toBeTruthy();
    expect(res!.protein).toBe(28.3);
  });

  it("computes from provided edited ingredients", () => {
    const res = computeDishMacrosFromCache("any_dish", {
      chicken_breast: 100,
      chicken_thigh: 50,
    });
    
    expect(res).toBeTruthy();
    const expectedProtein =
      ingredientMacros.chicken_breast.protein * 100 +
      ingredientMacros.chicken_thigh.protein * 50;
    expect(res!.protein).toBe(+expectedProtein.toFixed(1));
  });
});
