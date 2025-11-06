// compute_dish.ts
import { ingredientMacros } from "./ingredient-level-macros";
import { dishMacros as dishLevelMacros, dishMacro } from "./dish-level-macros";

export function computeDishMacros(
  dish: string,
  editedIngredients?: Record<string, number> // ✅ add this param
): { carbs: number; protein: number; fats: number; calories: number } | null {
  const ingredients = dishLevelMacros[dish];
  if (!ingredients) return null;

  const totals = { carbs: 0, protein: 0, fats: 0, calories: 0 };

  for (const [ingredient, defaultWeight] of Object.entries(ingredients)) {
    const weight = editedIngredients?.[ingredient] ?? defaultWeight;
    const macros = ingredientMacros[ingredient as dishMacro];
    if (!macros || !weight) continue;

    // ingredientMacros are per gram, so multiply by weight in grams
    totals.carbs += macros.carbs * weight;
    totals.protein += macros.protein * weight;
    totals.fats += macros.fats * weight;
    totals.calories += macros.calories * weight;
  }

  return {
    carbs: +totals.carbs.toFixed(1),
    protein: +totals.protein.toFixed(1),
    fats: +totals.fats.toFixed(1),
    calories: +totals.calories.toFixed(1),
  };
}
