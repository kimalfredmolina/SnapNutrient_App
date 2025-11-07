import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { db, auth } from "../../../config/firebase";
import { ref, get, update } from "firebase/database";
import { computeDishMacros } from "../../macros/compute_dish";
// import { dishMacros } from "../../macros/dish-level-macros";
import { ingredientMacros } from "../../macros/ingredient-level-macros";
import { FIRESTORE_DB } from "../../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

interface FoodLogData {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  foodName: string;
  weight: number;
  createdAt: string;
  ingredients?: { [key: string]: number };
  logId: string;
}

export default function HistoryFoodLogCard() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();

  // Always go back to History list
  const HISTORY_ROUTE = "/pages/history";
  const goToHistory = () => router.replace(HISTORY_ROUTE);

  const [foodLog, setFoodLog] = useState<FoodLogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Force a remount of this page (fresh fetch runs again)
    router.replace({
      pathname: "/pages/tabHistory/history-foodlog-card",
      params: { ...params, _ts: Date.now().toString() },
    });
    setRefreshing(false);
  }, [router, params]);

  // Editable states
  const [weight, setWeight] = useState<number>(Number(params.weight) || 100);
  const [editedMacros, setEditedMacros] = useState({
    calories: 0,
    protein: 0,
    fats: 0,
    carbs: 0,
  });
  const [editedIngredients, setEditedIngredients] = useState<{
    [key: string]: number;
  }>({
    // Default ingredient weights (grams)
    // These can be overridden by the user in edit mode
    Ingredient_1: 100,
    Ingredient_2: 100,
  });

  // Fetch food log data from database
  useEffect(() => {
    const fetchFoodLog = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          Alert.alert("Error", "User not authenticated");
          return;
        }

        const logId = params.logId as string;
        if (!logId) {
          Alert.alert("Error", "Missing log ID");
          return;
        }

        const logRef = ref(db, `foodLogs/${userId}/${logId}`);
        const snapshot = await get(logRef);

        if (!snapshot.exists()) {
          Alert.alert("Error", "Food log not found");
          return;
        }

        const data = snapshot.val() as FoodLogData;

        setFoodLog(data);
        setWeight(data.weight || 100); // ✅ use database weight
        setEditedMacros({
          calories: data.calories,
          protein: data.protein,
          fats: data.fats,
          carbs: data.carbs,
        });
        setEditedIngredients(data.ingredients || {});
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food log:", error);
        Alert.alert("Error", "Failed to load food log");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodLog();
  }, [params.logId]);

  const handleSaveChanges = async () => {
    if (!foodLog) return;

    setIsSaving(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const logId = params.logId as string; // ✅ Use params.logId, not foodLog.logId
      const logRef = ref(db, `foodLogs/${userId}/${logId}`);

      await update(logRef, {
        weight: weight,
        calories: editedMacros.calories,
        protein: editedMacros.protein,
        fats: editedMacros.fats,
        carbs: editedMacros.carbs,
        ingredients: editedIngredients,
      });

      Alert.alert("Success", "Food log updated successfully!");
      setEditMode(false);

      // Update local state
      setFoodLog({
        ...foodLog,
        weight,
        calories: editedMacros.calories,
        protein: editedMacros.protein,
        fats: editedMacros.fats,
        carbs: editedMacros.carbs,
        ingredients: editedIngredients,
      });
    } catch (error) {
      console.error("Error updating food log:", error);
      Alert.alert("Error", "Failed to update food log");
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Derived classification from saved food name
  const name = (foodLog?.foodName || "").trim();
  // Note: isDish and isIngredient are now checked inside useEffect
  const autoCalc = true; // Always auto-calc from Firestore if available

  // Recompute macros when weight or ingredient weights change
  useEffect(() => {
    if (!name) return;

    const fetchAndComputeMacros = async () => {
      // Check if it's a dish in Firestore
      const dishDoc = await getDoc(doc(FIRESTORE_DB, "dishes", name));
      const isDish = dishDoc.exists();

      if (isDish) {
        // Fetch dish macros from Firestore
        const computed = await computeDishMacros(
          name,
          Object.keys(editedIngredients).length ? editedIngredients : undefined
        );
        if (computed) {
          setEditedMacros({
            calories: Number(computed.calories.toFixed(1)),
            protein: Number(computed.protein.toFixed(1)),
            fats: Number(computed.fats.toFixed(1)),
            carbs: Number(computed.carbs.toFixed(1)),
          });
        }
        return;
      }

      // Check if it's a single ingredient in Firestore
      const ingDoc = await getDoc(doc(FIRESTORE_DB, "ingredients", name));
      const isIngredient = ingDoc.exists();

      if (isIngredient) {
        const m = ingDoc.data();
        const w = Math.max(0, weight || 0);
        setEditedMacros({
          calories: Number((m.calories * w).toFixed(1)),
          protein: Number((m.protein * w).toFixed(1)),
          fats: Number((m.fats * w).toFixed(1)),
          carbs: Number((m.carbs * w).toFixed(1)),
        });
        return;
      }

      // Unknown item: keep manual values from database
    };

    fetchAndComputeMacros();
  }, [name, weight, editedIngredients]);

  // When entering edit mode for a known dish and no stored ingredients, preload defaults
  // useEffect(() => {
  //   if (editMode && isDish && Object.keys(editedIngredients).length === 0) {
  //     const defaults = dishMacros[name as keyof typeof dishMacros] as
  //       | { [key: string]: number }
  //       | undefined;
  //     if (defaults) setEditedIngredients(defaults);
  //   }
  // }, [editMode, isDish, name]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 16 }}>
            Loading food log...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!foodLog) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: colors.text, fontSize: 16 }}>
            Food log not found
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              marginTop: 20,
              backgroundColor: colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.surface,
        }}
      >
        <TouchableOpacity onPress={goToHistory} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}>
          Edit Food Log Details
        </Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={{ flex: 1, padding: 16 }}>
          <Image
            source={require("../../../assets/images/icon.png")}
            style={{
              width: "100%",
              height: 250,
              borderRadius: 12,
              marginBottom: 20,
            }}
            resizeMode="cover"
          />

          {/* Food Name */}
          <Text
            style={{
              color: colors.text,
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            🍽️ {foodLog.foodName.replace(/_/g, " ")}
          </Text>

          {/* Date and Time */}
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              textAlign: "center",
              opacity: 0.7,
              marginBottom: 20,
            }}
          >
            {formatDate(foodLog.createdAt)} at {formatTime(foodLog.createdAt)}
          </Text>

          {/* Macros Section */}
          <View className="p-1 mb-5">
            <View className="flex-row justify-between items-center mb-3">
              <Text
                className="text-xl font-bold ml-4"
                style={{ color: colors.text }}
              >
                Macros
              </Text>
              {!editMode && (
                <TouchableOpacity
                  onPress={() => setEditMode(true)}
                  className="mr-4"
                >
                  <Text className="font-bold" style={{ color: colors.primary }}>
                    Edit
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row flex-wrap justify-between">
              {/* Calories */}
              <View
                className="w-[48%] rounded-xl p-3 mb-3"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.text + "40",
                  borderWidth: 1,
                }}
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons name="flame" size={20} color="#ef4444" />
                  <Text
                    className="text-base ml-2 font-semibold"
                    style={{ color: colors.text }}
                  >
                    Calories
                  </Text>
                </View>
                {editMode ? (
                  <TextInput
                    value={String(editedMacros.calories)}
                    onChangeText={(text) =>
                      setEditedMacros((prev) => ({
                        ...prev,
                        calories: Number(text) || 0,
                      }))
                    }
                    keyboardType="numeric"
                    editable={editMode && !autoCalc}
                    selectTextOnFocus={editMode && !autoCalc}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.primary,
                      borderRadius: 6,
                      padding: 8,
                      color: colors.text,
                      fontSize: 16,
                      opacity: autoCalc ? 0.6 : 1,
                    }}
                  />
                ) : (
                  <Text
                    className="text-lg font-bold text-red-500"
                    style={{ marginLeft: 28 }}
                  >
                    {editedMacros.calories.toFixed(1)} kcal
                  </Text>
                )}
              </View>

              {/* Protein */}
              <View
                className="w-[48%] rounded-xl p-3 mb-3"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.text + "40",
                  borderWidth: 1,
                }}
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="restaurant-outline"
                    size={20}
                    color="#10b981"
                  />
                  <Text
                    className="text-base ml-2 font-semibold"
                    style={{ color: colors.text }}
                  >
                    Protein
                  </Text>
                </View>
                {editMode ? (
                  <TextInput
                    value={String(editedMacros.protein)}
                    onChangeText={(text) =>
                      setEditedMacros((prev) => ({
                        ...prev,
                        protein: Number(text) || 0,
                      }))
                    }
                    keyboardType="numeric"
                    editable={editMode && !autoCalc}
                    selectTextOnFocus={editMode && !autoCalc}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.primary,
                      borderRadius: 6,
                      padding: 8,
                      color: colors.text,
                      fontSize: 16,
                      opacity: autoCalc ? 0.6 : 1,
                    }}
                  />
                ) : (
                  <Text
                    className="text-lg font-bold text-green-500"
                    style={{ marginLeft: 28 }}
                  >
                    {editedMacros.protein.toFixed(1)} g
                  </Text>
                )}
              </View>

              {/* Fat */}
              <View
                className="w-[48%] rounded-xl p-3 mb-3"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.text + "40",
                  borderWidth: 1,
                }}
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons name="cube-outline" size={20} color="#f97316" />
                  <Text
                    className="text-base ml-2 font-semibold"
                    style={{ color: colors.text }}
                  >
                    Fat
                  </Text>
                </View>
                {editMode ? (
                  <TextInput
                    value={String(editedMacros.fats)}
                    onChangeText={(text) =>
                      setEditedMacros((prev) => ({
                        ...prev,
                        fats: Number(text) || 0,
                      }))
                    }
                    keyboardType="numeric"
                    editable={editMode && !autoCalc}
                    selectTextOnFocus={editMode && !autoCalc}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.primary,
                      borderRadius: 6,
                      padding: 8,
                      color: colors.text,
                      fontSize: 16,
                      opacity: autoCalc ? 0.6 : 1,
                    }}
                  />
                ) : (
                  <Text
                    className="text-lg font-bold text-orange-500"
                    style={{ marginLeft: 28 }}
                  >
                    {editedMacros.fats.toFixed(1)} g
                  </Text>
                )}
              </View>

              {/* Carbs */}
              <View
                className="w-[48%] rounded-xl p-3 mb-3"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.text + "40",
                  borderWidth: 1,
                }}
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons name="leaf-outline" size={20} color="#3b82f6" />
                  <Text
                    className="text-base ml-2 font-semibold"
                    style={{ color: colors.text }}
                  >
                    Carbs
                  </Text>
                </View>
                {editMode ? (
                  <TextInput
                    value={String(editedMacros.carbs)}
                    onChangeText={(text) =>
                      setEditedMacros((prev) => ({
                        ...prev,
                        carbs: Number(text) || 0,
                      }))
                    }
                    keyboardType="numeric"
                    editable={editMode && !autoCalc}
                    selectTextOnFocus={editMode && !autoCalc}
                    style={{
                      borderWidth: 1,
                      borderColor: colors.primary,
                      borderRadius: 6,
                      padding: 8,
                      color: colors.text,
                      fontSize: 16,
                      opacity: autoCalc ? 0.6 : 1,
                    }}
                  />
                ) : (
                  <Text
                    className="text-lg font-bold text-blue-500"
                    style={{ marginLeft: 28 }}
                  >
                    {editedMacros.carbs.toFixed(1)} g
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Weight Input */}
          <Text style={{ color: colors.text, fontSize: 16, marginBottom: 12 }}>
            Weight (grams):
          </Text>
          <TextInput
            value={String(weight)}
            onChangeText={(text) => setWeight(Math.max(0, Number(text) || 0))}
            keyboardType="numeric"
            editable={editMode}
            style={{
              borderWidth: 1,
              borderColor: editMode ? colors.primary : colors.text + "40",
              borderRadius: 8,
              padding: 12,
              color: colors.text,
              marginBottom: 20,
              backgroundColor: editMode ? colors.background : colors.surface,
            }}
          />

          {/* Ingredients Section */}
          {Object.keys(editedIngredients).length > 0 && (
            <View
              style={{
                backgroundColor: colors.surface,
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
                maxHeight: 250,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 12,
                }}
              >
                🥘 Ingredients
              </Text>

              <ScrollView nestedScrollEnabled={true}>
                {Object.entries(editedIngredients).map(
                  ([ingredient, ingredientWeight], index) => {
                    const currentValue =
                      editedIngredients[ingredient] ?? ingredientWeight;

                    return editMode ? (
                      <View
                        key={`${ingredient}-${index}`}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 6,
                        }}
                      >
                        <Text
                          style={{ color: colors.text, fontSize: 15, flex: 1 }}
                        >
                          {ingredient.replace(/_/g, " ")}
                        </Text>
                        <TextInput
                          value={String(currentValue)}
                          keyboardType="numeric"
                          onChangeText={(text) => {
                            const newWeight = Math.max(0, Number(text) || 0);
                            setEditedIngredients((prev) => ({
                              ...prev,
                              [ingredient]: newWeight,
                            }));
                          }}
                          style={{
                            borderWidth: 1,
                            borderColor: colors.primary,
                            borderRadius: 6,
                            paddingHorizontal: 8,
                            width: 60,
                            textAlign: "center",
                            color: colors.text,
                          }}
                        />
                        <Text style={{ color: colors.text, marginLeft: 4 }}>
                          g
                        </Text>
                      </View>
                    ) : (
                      <Text
                        key={`${ingredient}-${index}`}
                        style={{
                          color: colors.text,
                          fontSize: 15,
                          marginBottom: 6,
                        }}
                      >
                        {ingredient.replace(/_/g, " ")} – {currentValue} g
                      </Text>
                    );
                  }
                )}
              </ScrollView>
            </View>
          )}

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            {editMode ? (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setEditMode(false);
                    // Reset to original values
                    setEditedMacros({
                      calories: foodLog.calories,
                      protein: foodLog.protein,
                      fats: foodLog.fats,
                      carbs: foodLog.carbs,
                    });
                    setWeight(foodLog.weight);
                    if (foodLog.ingredients) {
                      setEditedIngredients(foodLog.ingredients);
                    }
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: colors.surface,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveChanges}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    backgroundColor: isSaving ? "gray" : colors.primary,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={goToHistory}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                >
                  Back to History
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}