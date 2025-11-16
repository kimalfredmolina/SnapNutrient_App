// compute_dish.ts
import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/firebase";

// In-memory cache to avoid re-fetching the same ingredients
const ingredientCache = new Map<string, any>();

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
      } else {
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
