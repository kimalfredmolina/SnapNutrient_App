import { ingredientMacros } from "./ingredient-level-macros";
import { dishMacros as dishLevelMacros, dishMacro } from "./dish-level-macros";
export function computeDishMacros(
  dish: string,
  grams = 1
): { carbs: number; protein: number; fats: number; calories: number } | null {
  const ingredients = dishLevelMacros[dish];
  if (!ingredients) return null;

  const totals = { carbs: 0, protein: 0, fats: 0, calories: 0 };

  for (const [ingredient, weight] of Object.entries(ingredients)) {
    const macros = ingredientMacros[ingredient as dishMacro];
    if (!macros || !weight) continue;

    totals.carbs += macros.carbs * weight;
    totals.protein += macros.protein * weight;
    totals.fats += macros.fats * weight;
    totals.calories += macros.calories * weight;
  }

  // scale the whole dish by grams (e.g. if weight = 0.5, it’s half a recipe)
  return {
    carbs: +(totals.carbs * grams).toFixed(1),
    protein: +(totals.protein * grams).toFixed(1),
    fats: +(totals.fats * grams).toFixed(1),
    calories: +(totals.calories * grams).toFixed(1),
  };
}
