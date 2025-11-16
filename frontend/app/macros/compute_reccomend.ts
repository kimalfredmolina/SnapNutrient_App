// compute_reccomend.ts
// Calculates smart recommendations for macronutrients based on current portion and daily goals

export type MacroGoals = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type DailyConsumed = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export type CurrentMacros = {
  carbs: number;
  protein: number;
  fats: number;
  calories: number;
};

export type MacroRecommendation = {
  remaining: number;
  totalNeeded: number;
  additionalNeeded: number;
  isDominant: boolean;
  goalMet: boolean;
  status: "met" | "realistic" | "high" | "unrealistic";
  isOvercap: boolean;
  excessAmount: number;
  recommendedWeight: number;
};

export type RecommendationResult = {
  protein: MacroRecommendation;
  carbs: MacroRecommendation;
  fat: MacroRecommendation;
};

export function computeRecommendations(
  macros: CurrentMacros,
  weight: number,
  macroGoals: MacroGoals,
  dailyConsumed: DailyConsumed
): RecommendationResult | null {
  if (!macros || weight === 0) return null;

  // IMPORTANT: macros are for TOTAL weight, convert to per 100g
  const macrosPer100g = {
    calories: (macros.calories / weight) * 100,
    protein: (macros.protein / weight) * 100,
    carbs: (macros.carbs / weight) * 100,
    fats: (macros.fats / weight) * 100,
  };

  // Calculate remaining goals for today
  const remaining = {
    calories: Math.max(0, macroGoals.calories - dailyConsumed.calories),
    protein: Math.max(0, macroGoals.protein - dailyConsumed.protein),
    fat: Math.max(0, macroGoals.fat - dailyConsumed.fat),
    carbs: Math.max(0, macroGoals.carbs - dailyConsumed.carbs),
  };

  // Calculate what CURRENT portion provides
  const currentPortionProvides = {
    protein: macros.protein,
    carbs: macros.carbs,
    fats: macros.fats,
  };

  // Check for overcap (current portion exceeds remaining goals)
  const overcap = {
    protein:
      currentPortionProvides.protein > remaining.protein &&
      remaining.protein > 0,
    carbs:
      currentPortionProvides.carbs > remaining.carbs && remaining.carbs > 0,
    fat: currentPortionProvides.fats > remaining.fat && remaining.fat > 0,
  };

  // Calculate how much over the goal (excess amount)
  const excessAmount = {
    protein: overcap.protein
      ? currentPortionProvides.protein - remaining.protein
      : 0,
    carbs: overcap.carbs ? currentPortionProvides.carbs - remaining.carbs : 0,
    fat: overcap.fat ? currentPortionProvides.fats - remaining.fat : 0,
  };

  // Calculate recommended weight to NOT exceed goals
  const recommendedWeightToFitGoal = {
    protein:
      overcap.protein && macrosPer100g.protein > 0
        ? (remaining.protein / macrosPer100g.protein) * 100
        : weight,
    carbs:
      overcap.carbs && macrosPer100g.carbs > 0
        ? (remaining.carbs / macrosPer100g.carbs) * 100
        : weight,
    fat:
      overcap.fat && macrosPer100g.fats > 0
        ? (remaining.fat / macrosPer100g.fats) * 100
        : weight,
  };

  // Calculate TOTAL grams of THIS food needed to fill REMAINING gap
  const totalGramsToFillGap = {
    protein:
      macrosPer100g.protein > 0 && remaining.protein > 0
        ? (remaining.protein / macrosPer100g.protein) * 100
        : 0,
    carbs:
      macrosPer100g.carbs > 0 && remaining.carbs > 0
        ? (remaining.carbs / macrosPer100g.carbs) * 100
        : 0,
    fat:
      macrosPer100g.fats > 0 && remaining.fat > 0
        ? (remaining.fat / macrosPer100g.fats) * 100
        : 0,
  };

  // Calculate additional grams needed (total to fill gap - current weight)
  const additionalGrams = {
    protein: Math.max(0, totalGramsToFillGap.protein - weight),
    carbs: Math.max(0, totalGramsToFillGap.carbs - weight),
    fat: Math.max(0, totalGramsToFillGap.fat - weight),
  };

  // Determine dominant macro (highest percentage)
  const total =
    macrosPer100g.protein + macrosPer100g.carbs + macrosPer100g.fats;
  const percentages = {
    protein: (macrosPer100g.protein / total) * 100,
    carbs: (macrosPer100g.carbs / total) * 100,
    fat: (macrosPer100g.fats / total) * 100,
  };

  let dominant: "protein" | "carbs" | "fat" = "protein";
  let maxPercent = percentages.protein;

  if (percentages.carbs > maxPercent) {
    dominant = "carbs";
    maxPercent = percentages.carbs;
  }
  if (percentages.fat > maxPercent) {
    dominant = "fat";
    maxPercent = percentages.fat;
  }

  // Helper to determine if recommendation is realistic
  const getRecommendationStatus = (
    grams: number
  ): "met" | "realistic" | "high" | "unrealistic" => {
    if (grams === 0) return "met";
    if (grams <= 500) return "realistic";
    if (grams <= 1000) return "high";
    return "unrealistic";
  };

  // Debug logging
  console.log("=== RECOMMENDATION DEBUG ===");
  console.log("Current weight:", weight);
  console.log("Macros (total for current weight):", macros);
  console.log("Macros per 100g:", macrosPer100g);
  console.log("Remaining goals:", remaining);
  console.log("Current portion provides:", currentPortionProvides);
  console.log("Overcap:", overcap);
  console.log("Excess amount:", excessAmount);
  console.log("Total grams to fill gap:", totalGramsToFillGap);
  console.log("Additional needed:", additionalGrams);
  console.log("============================");

  return {
    protein: {
      remaining: remaining.protein,
      totalNeeded: Math.round(totalGramsToFillGap.protein),
      additionalNeeded: Math.round(additionalGrams.protein),
      isDominant: dominant === "protein",
      goalMet:
        remaining.protein === 0 ||
        currentPortionProvides.protein >= remaining.protein,
      status: getRecommendationStatus(totalGramsToFillGap.protein),
      isOvercap: overcap.protein,
      excessAmount: Math.round(excessAmount.protein * 10) / 10,
      recommendedWeight: Math.round(recommendedWeightToFitGoal.protein),
    },
    carbs: {
      remaining: remaining.carbs,
      totalNeeded: Math.round(totalGramsToFillGap.carbs),
      additionalNeeded: Math.round(additionalGrams.carbs),
      isDominant: dominant === "carbs",
      goalMet:
        remaining.carbs === 0 ||
        currentPortionProvides.carbs >= remaining.carbs,
      status: getRecommendationStatus(totalGramsToFillGap.carbs),
      isOvercap: overcap.carbs,
      excessAmount: Math.round(excessAmount.carbs * 10) / 10,
      recommendedWeight: Math.round(recommendedWeightToFitGoal.carbs),
    },
    fat: {
      remaining: remaining.fat,
      totalNeeded: Math.round(totalGramsToFillGap.fat),
      additionalNeeded: Math.round(additionalGrams.fat),
      isDominant: dominant === "fat",
      goalMet:
        remaining.fat === 0 || currentPortionProvides.fats >= remaining.fat,
      status: getRecommendationStatus(totalGramsToFillGap.fat),
      isOvercap: overcap.fat,
      excessAmount: Math.round(excessAmount.fat * 10) / 10,
      recommendedWeight: Math.round(recommendedWeightToFitGoal.fat),
    },
  };
}
