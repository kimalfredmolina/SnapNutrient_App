import { ingredientMacros } from "./ingredient-level-macros";

export type dishMacro = keyof typeof ingredientMacros;

export const dishMacros: Record<string, Partial<Record<dishMacro, number>>> = {
  chicken_adobo: {
    chicken_breast: 50,
    chicken_thigh: 50,
    chicken_wing: 50,
    chicken_drumstick: 50,
  },
  chicken_inasal: {
    chicken_thigh: 50,
  },
  chicken_tinola: {
    chicken_breast: 30,
    chicken_thigh: 50,
    chicken_wing: 30,
    chicken_drumstick: 50,
  },
};
