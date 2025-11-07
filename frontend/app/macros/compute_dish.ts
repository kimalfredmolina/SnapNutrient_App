// compute_dish.ts
import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/firebase";
import { ingredientMacros } from "./ingredient-level-macros";
import { dishMacros as dishLevelMacros, dishMacro } from "./dish-level-macros";

// In-memory cache to avoid re-fetching the same ingredients
const ingredientCache = new Map<string, any>();

// ✅ ASYNC: For Firestore fetching (used in scan page)
export async function computeDishMacros(
  dish: string,
  editedIngredients?: Record<string, number>
): Promise<{
  carbs: number;
  protein: number;
  fats: number;
  calories: number;
} | null> {
  const totals = { carbs: 0, protein: 0, fats: 0, calories: 0 };

  if (!editedIngredients) return null;

  try {
    // Loop through each ingredient
    for (const [ingredientName, weight] of Object.entries(editedIngredients)) {
      if (!weight || weight === 0) continue;

      // ✅ Check cache first
      let macros = ingredientCache.get(ingredientName);

      if (!macros) {
        // Only fetch from Firestore if not cached
        console.log(`📥 Fetching ingredient from Firestore: ${ingredientName}`);
        const ingDoc = await getDoc(
          doc(FIRESTORE_DB, "ingredients", ingredientName)
        );

        if (!ingDoc.exists()) {
          console.warn(
            `⚠️ Ingredient not found in Firestore: ${ingredientName}`
          );
          continue;
        }

        macros = ingDoc.data();

        // ✅ Store in cache for future use
        ingredientCache.set(ingredientName, macros);
        console.log(`💾 Cached: ${ingredientName}`);
      } else {
        console.log(`⚡ Using cached data for: ${ingredientName}`);
      }

      // Add to totals (macros per gram × weight in grams)
      totals.carbs += (macros.carbs || 0) * weight;
      totals.protein += (macros.protein || 0) * weight;
      totals.fats += (macros.fats || 0) * weight;
      totals.calories += (macros.calories || 0) * weight;
    }

    // Return rounded totals
    return {
      carbs: +totals.carbs.toFixed(1),
      protein: +totals.protein.toFixed(1),
      fats: +totals.fats.toFixed(1),
      calories: +totals.calories.toFixed(1),
    };
  } catch (error) {
    console.error("❌ Error computing macros from Firestore:", error);
    return null;
  }
}

// ✅ SYNC: Synchronous version using local data (for history-detail.tsx)
export function computeDishMacrosSync(
  dish: string,
  grams = 1,
  editedIngredients?: Partial<Record<string, number>>
): { carbs: number; protein: number; fats: number; calories: number } | null {
  const ingredients = dishLevelMacros[dish];
  if (!ingredients) return null;

  const totals = { carbs: 0, protein: 0, fats: 0, calories: 0 };

  for (const [ingredient, defaultWeight] of Object.entries(ingredients)) {
    const weight = editedIngredients?.[ingredient] ?? defaultWeight;
    const macros = ingredientMacros[ingredient as dishMacro];
    if (!macros || !weight) continue;

    totals.carbs += macros.carbs * weight;
    totals.protein += macros.protein * weight;
    totals.fats += macros.fats * weight;
    totals.calories += macros.calories * weight;
  }

  return {
    carbs: +(totals.carbs * grams).toFixed(1),
    protein: +(totals.protein * grams).toFixed(1),
    fats: +(totals.fats * grams).toFixed(1),
    calories: +(totals.calories * grams).toFixed(1),
  };
}

// ✅ BONUS: Synchronous version that uses cache (for meal suggestions)
export function computeDishMacrosFromCache(
  dish: string,
  editedIngredients?: Record<string, number>
): { carbs: number; protein: number; fats: number; calories: number } | null {
  const totals = { carbs: 0, protein: 0, fats: 0, calories: 0 };

  if (!editedIngredients) return null;

  try {
    for (const [ingredientName, weight] of Object.entries(editedIngredients)) {
      if (!weight || weight === 0) continue;

      // ✅ Only use cached data
      const macros = ingredientCache.get(ingredientName);
      
      if (!macros) {
        // Fallback to local data if available
        const localMacros = ingredientMacros[ingredientName as dishMacro];
        if (!localMacros) {
          console.warn(`⚠️ Ingredient not in cache or local data: ${ingredientName}`);
          continue;
        }
        totals.carbs += (localMacros.carbs || 0) * weight;
        totals.protein += (localMacros.protein || 0) * weight;
        totals.fats += (localMacros.fats || 0) * weight;
        totals.calories += (localMacros.calories || 0) * weight;
        continue;
      }

      totals.carbs += (macros.carbs || 0) * weight;
      totals.protein += (macros.protein || 0) * weight;
      totals.fats += (macros.fats || 0) * weight;
      totals.calories += (macros.calories || 0) * weight;
    }

    return {
      carbs: +totals.carbs.toFixed(1),
      protein: +totals.protein.toFixed(1),
      fats: +totals.fats.toFixed(1),
      calories: +totals.calories.toFixed(1),
    };
  } catch (error) {
    console.error("❌ Error computing macros from cache:", error);
    return null;
  }
}