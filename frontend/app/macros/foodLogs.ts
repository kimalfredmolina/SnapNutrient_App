import { getDatabase, ref, set, push } from "firebase/database";

export type FoodLog = {
  foodName: string;
  weight: number;
  weightUnit: "g" | "kg" | "lb" | "oz";
  carbs: number;
  protein: number;
  fats: number;
  calories: number;
  createdAt: string;
};

export async function logFoodForUser(
  userId: string,
  data: Omit<FoodLog, "createdAt">
) {
  const db = getDatabase();
  const logsRef = ref(db, `foodLogs/${userId}`);
  const newLogRef = push(logsRef);

  await set(newLogRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
}
