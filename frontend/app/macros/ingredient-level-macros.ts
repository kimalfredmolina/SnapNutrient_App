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

  all_purpose_flour: {
    carbs: 0.754,
    protein: 0.129,
    fats: 0.012,
    calories: 3.62,
  },
  ampalaya: { carbs: 0.029, protein: 0.011, fats: 0.001, calories: 0.17 }, // bitter gourd, raw
  annatto_oil: { carbs: 0.0, protein: 0.0, fats: 1.0, calories: 9.0 }, // approximate (oil = ~9 kcal/g)
  annatto_powder: { carbs: 0.3, protein: 0.1, fats: 0.15, calories: 3.5 }, // seed-derived spice (approx)
  annatto_seeds: { carbs: 0.3, protein: 0.12, fats: 0.15, calories: 3.6 },
  bagoong: { carbs: 0.05, protein: 0.12, fats: 0.02, calories: 0.9 }, // fermented shrimp/paste — varies by brand
  bagoong_alamang: { carbs: 0.05, protein: 0.12, fats: 0.02, calories: 0.9 },
  banana_flower_bud: {
    carbs: 0.04,
    protein: 0.015,
    fats: 0.001,
    calories: 0.23,
  },
  barbecue_skewers: { carbs: 0.0, protein: 0.0, fats: 0.0, calories: 0.0 }, // inedible wooden/skewer utensil
  bay_leaves: { carbs: 0.7, protein: 0.07, fats: 0.12, calories: 3.0 }, // dried bay leaf (small use amounts)
  beef_generic_raw: { carbs: 0.0, protein: 0.26, fats: 0.2, calories: 3.8 }, // generic raw beef per g (cut-dependent)
  beef_bouillon_cube: { carbs: 0.05, protein: 0.08, fats: 0.04, calories: 0.9 }, // approx brand average
  beef_shank_raw: { carbs: 0.0, protein: 0.2, fats: 0.12, calories: 2.52 },
  birds_eye_chilies: { carbs: 0.043, protein: 0.02, fats: 0.01, calories: 0.4 }, // Thai chilis
  boiled_egg: { carbs: 0.007, protein: 0.125, fats: 0.105, calories: 1.58 }, // boiled whole egg
  boiled_kidney_beans: {
    carbs: 0.209,
    protein: 0.085,
    fats: 0.005,
    calories: 1.24,
  }, // cooked
  bok_choy: { carbs: 0.036, protein: 0.014, fats: 0.001, calories: 0.13 },
  brown_sugar: { carbs: 0.977, protein: 0.0, fats: 0.0, calories: 3.89 },
  burnt_coconut: { carbs: 0.15, protein: 0.08, fats: 0.4, calories: 3.8 }, // depends on char and oil content
  burnt_coconut_meat_powder: {
    carbs: 0.15,
    protein: 0.08,
    fats: 0.4,
    calories: 3.8,
  },
  calamansi_lemon_juice: {
    carbs: 0.027,
    protein: 0.001,
    fats: 0.0,
    calories: 0.15,
  }, // juice, raw
  canola_oil: { carbs: 0.0, protein: 0.0, fats: 1.0, calories: 9.0 },
  cayenne_pepper_powder: {
    carbs: 0.5,
    protein: 0.15,
    fats: 0.05,
    calories: 3.0,
  },
  celery_leaves: { carbs: 0.14, protein: 0.02, fats: 0.01, calories: 0.69 },
  chicken_generic_raw: {
    carbs: 0.0,
    protein: 0.23,
    fats: 0.02,
    calories: 1.06,
  }, // skinless breast baseline
  chicken_bouillon_cubes: {
    carbs: 0.04,
    protein: 0.09,
    fats: 0.05,
    calories: 1.0,
  },
  chicken_broth: { carbs: 0.01, protein: 0.02, fats: 0.005, calories: 0.12 },
  chicken_powder: { carbs: 0.3, protein: 0.55, fats: 0.09, calories: 3.9 },
  chicken_wings_raw: { carbs: 0.0, protein: 0.18, fats: 0.23, calories: 2.61 },
  chinese_eggplant: {
    carbs: 0.06,
    protein: 0.008,
    fats: 0.002,
    calories: 0.25,
  },
  cilantro_stems: { carbs: 0.095, protein: 0.027, fats: 0.007, calories: 0.49 },
  cocoa_powder: { carbs: 0.4, protein: 0.2, fats: 0.22, calories: 2.4 },
  coconut_cream: { carbs: 0.035, protein: 0.02, fats: 0.31, calories: 2.9 },
  coconut_gel: { carbs: 0.095, protein: 0.005, fats: 0.0, calories: 0.38 },
  condensed_milk: { carbs: 0.545, protein: 0.085, fats: 0.08, calories: 3.45 },
  cooking_oil: { carbs: 0.0, protein: 0.0, fats: 1.0, calories: 9.0 },
  corn: { carbs: 0.19, protein: 0.03, fats: 0.02, calories: 0.96 },
  cornstarch: { carbs: 0.91, protein: 0.005, fats: 0.0, calories: 3.64 },
  coarse_sea_salt: { carbs: 0.0, protein: 0.0, fats: 0.0, calories: 0.0 },
  cow_trotters_raw: { carbs: 0.0, protein: 0.18, fats: 0.125, calories: 2.45 },
  cracked_peppercorn: {
    carbs: 0.64,
    protein: 0.11,
    fats: 0.03,
    calories: 2.85,
  },
  curry_powder: { carbs: 0.5, protein: 0.15, fats: 0.05, calories: 3.0 },
  daikon_radish: { carbs: 0.04, protein: 0.01, fats: 0.0, calories: 0.18 },
  dried_oregano: { carbs: 0.69, protein: 0.14, fats: 0.04, calories: 3.5 },
  eggplant: { carbs: 0.06, protein: 0.01, fats: 0.002, calories: 0.25 },
  finger_chilies: { carbs: 0.055, protein: 0.02, fats: 0.003, calories: 0.26 },
  fish_sauce: { carbs: 0.01, protein: 0.1, fats: 0.005, calories: 0.5 },
  garlic_powder: { carbs: 0.72, protein: 0.13, fats: 0.0, calories: 3.5 },
  ginger: { carbs: 0.18, protein: 0.02, fats: 0.02, calories: 0.86 },
  green_onion: { carbs: 0.072, protein: 0.02, fats: 0.001, calories: 0.32 },
  green_onions: { carbs: 0.072, protein: 0.02, fats: 0.001, calories: 0.32 },
  ground_black_pepper: {
    carbs: 0.64,
    protein: 0.1,
    fats: 0.02,
    calories: 2.85,
  },
  ground_peanuts: { carbs: 0.16, protein: 0.26, fats: 0.49, calories: 5.8 },
  hot_pepper_leaves: { carbs: 0.06, protein: 0.02, fats: 0.003, calories: 0.3 },
  hot_red_chili: { carbs: 0.06, protein: 0.02, fats: 0.002, calories: 0.27 },
  jasmine_rice_raw: {
    carbs: 0.798,
    protein: 0.071,
    fats: 0.014,
    calories: 3.51,
  },
  japanese_taro: { carbs: 0.26, protein: 0.009, fats: 0.002, calories: 1.16 },
  jalapeño_pepper: { carbs: 0.066, protein: 0.02, fats: 0.015, calories: 0.34 },
  kamote: { carbs: 0.205, protein: 0.017, fats: 0.001, calories: 0.86 },
  kangkong_leaves: { carbs: 0.025, protein: 0.03, fats: 0.003, calories: 0.2 },
  kalabasa: { carbs: 0.07, protein: 0.01, fats: 0.001, calories: 0.33 },
  lechon_kawali: { carbs: 0.0, protein: 0.15, fats: 0.45, calories: 5.4 },
  lemongrass: { carbs: 0.19, protein: 0.02, fats: 0.01, calories: 0.96 },
  long_green_chili: { carbs: 0.06, protein: 0.02, fats: 0.003, calories: 0.25 },
  long_green_pepper: {
    carbs: 0.06,
    protein: 0.02,
    fats: 0.003,
    calories: 0.25,
  },
  lumpia_wrapper: { carbs: 0.6, protein: 0.06, fats: 0.02, calories: 2.8 },
  turmeric: { carbs: 0.15, protein: 0.02, fats: 0.04, calories: 0.9 },
  water: { carbs: 0.0, protein: 0.0, fats: 0.0, calories: 0.0 },
  macapuno: { carbs: 0.18, protein: 0.02, fats: 0.02, calories: 0.9 },
  malunggay_leaves: {
    carbs: 0.083,
    protein: 0.086,
    fats: 0.036,
    calories: 0.64,
  },
  miki_noodles: { carbs: 0.79, protein: 0.08, fats: 0.02, calories: 3.6 },
  milkfish_raw: { carbs: 0.0, protein: 0.18, fats: 0.1, calories: 2.26 },
  onion_powder: { carbs: 0.75, protein: 0.1, fats: 0.03, calories: 3.4 },
  pork_ears: { carbs: 0.0, protein: 0.262, fats: 0.138, calories: 2.36 },
  soy_sauce: { carbs: 0.0493, protein: 0.0814, fats: 0.0057, calories: 0.53 },
  pork_blood: { carbs: 0.02, protein: 0.07, fats: 0.0, calories: 0.35 },
  plum_tomato_whole: {
    carbs: 0.038,
    protein: 0.01,
    fats: 0.001,
    calories: 0.18,
  },
};
