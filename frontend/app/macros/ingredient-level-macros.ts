export const ingredientMacros: Record<
  string,
  { carbs: number; protein: number; fats: number; calories: number }
> = {
  chicken_breast: { carbs: 0, protein: 0.31, fats: 0.03, calories: 1.65 },
  chicken_thigh: { carbs: 0, protein: 0.25, fats: 0.08, calories: 2.09 },
  chicken_wing: { carbs: 0, protein: 0.3, fats: 0.08, calories: 2.03 },
  chicken_drumstick: { carbs: 0, protein: 0.28, fats: 0.06, calories: 1.95 },
  chicken_skin: { carbs: 0, protein: 0.09, fats: 0.4, calories: 4.5 },
  chicken_liver: { carbs: 0.03, protein: 0.17, fats: 0.05, calories: 1.19 },
  chicken_gizzard: { carbs: 0, protein: 0.18, fats: 0.04, calories: 1.05 },
  chicken_heart: { carbs: 0, protein: 0.17, fats: 0.07, calories: 1.53 },
  chicken_ground_lean: { carbs: 0, protein: 0.23, fats: 0.08, calories: 1.95 }, // mostly breast
  chicken_ground_regular: {
    carbs: 0,
    protein: 0.2,
    fats: 0.13,
    calories: 2.25,
  },

  pork_loin: { carbs: 0, protein: 0.27, fats: 0.07, calories: 1.97 },
  pork_tenderloin: { carbs: 0, protein: 0.24, fats: 0.04, calories: 1.43 },
  pork_belly: { carbs: 0, protein: 0.09, fats: 0.53, calories: 5.2 },
  pork_shoulder: { carbs: 0, protein: 0.23, fats: 0.14, calories: 2.52 },
  pork_ribs: { carbs: 0, protein: 0.21, fats: 0.2, calories: 2.95 },
  pork_ham: { carbs: 0, protein: 0.2, fats: 0.09, calories: 1.96 },
  pork_chop: { carbs: 0, protein: 0.26, fats: 0.09, calories: 2.06 },
  pork_leg: { carbs: 0, protein: 0.22, fats: 0.08, calories: 1.86 },
  pork_liver: { carbs: 0.04, protein: 0.2, fats: 0.04, calories: 1.65 },
  pork_ground_lean: { carbs: 0, protein: 0.25, fats: 0.17, calories: 2.7 }, // ~85/15
  pork_ground_regular: { carbs: 0, protein: 0.24, fats: 0.21, calories: 3.05 }, // ~80/20

  beef_sirloin: { carbs: 0, protein: 0.26, fats: 0.08, calories: 2.09 },
  beef_tenderloin: { carbs: 0, protein: 0.2, fats: 0.17, calories: 2.5 },
  beef_ribeye: { carbs: 0, protein: 0.21, fats: 0.21, calories: 2.91 },
  beef_brisket: { carbs: 0, protein: 0.21, fats: 0.18, calories: 2.75 },
  beef_chuck: { carbs: 0, protein: 0.2, fats: 0.2, calories: 2.82 },
  beef_shank: { carbs: 0, protein: 0.22, fats: 0.08, calories: 2.0 },
  beef_liver: { carbs: 0.05, protein: 0.2, fats: 0.04, calories: 1.35 },
  beef_short_ribs: { carbs: 0, protein: 0.19, fats: 0.28, calories: 3.19 },
  beef_ground_lean: { carbs: 0, protein: 0.26, fats: 0.15, calories: 2.5 },
  beef_ground_regular: { carbs: 0, protein: 0.25, fats: 0.2, calories: 2.9 },

  egg_whole: { carbs: 0.01, protein: 0.13, fats: 0.1, calories: 1.43 },
  egg_white: { carbs: 0.0, protein: 0.11, fats: 0.0, calories: 0.52 },
  egg_yolk: { carbs: 0.03, protein: 0.16, fats: 0.27, calories: 3.17 },

  white_rice: { carbs: 0.804, protein: 0.0713, fats: 0.0066, calories: 3.65 },
  brown_rice: { carbs: 0.7617, protein: 0.0754, fats: 0.0268, calories: 3.62 },
  jasmine_rice: { carbs: 0.8, protein: 0.07, fats: 0.007, calories: 3.65 },
  basmati_rice: { carbs: 0.8, protein: 0.07, fats: 0.007, calories: 3.65 },
  glutinous_rice: { carbs: 0.8, protein: 0.07, fats: 0.007, calories: 3.65 },
  red_rice: { carbs: 0.76, protein: 0.07, fats: 0.02, calories: 3.6 },
  black_rice: { carbs: 0.76, protein: 0.07, fats: 0.02, calories: 3.6 },

  onion: { carbs: 0.09, protein: 0.01, fats: 0.0, calories: 0.4 },
  garlic: { carbs: 0.33, protein: 0.06, fats: 0.0, calories: 1.49 },
  tomato: { carbs: 0.04, protein: 0.01, fats: 0.0, calories: 0.18 },
  potato: { carbs: 0.17, protein: 0.02, fats: 0.0, calories: 0.77 },
  carrot: { carbs: 0.1, protein: 0.01, fats: 0.0, calories: 0.41 },
  green_peas: { carbs: 0.14, protein: 0.05, fats: 0.0, calories: 0.81 },
  bell_pepper: { carbs: 0.06, protein: 0.01, fats: 0.0, calories: 0.26 },
  cabbage: { carbs: 0.06, protein: 0.01, fats: 0.0, calories: 0.25 },
};
