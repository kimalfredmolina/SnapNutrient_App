import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";  // You are already using useRouter
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
  const router = useRouter();
  const { colors } = useTheme();

  const [predictions, setPredictions] = useState<any[]>([]);
  const [macros, setMacros] = useState<{ carbs: number, protein: number, fats: number, calories: number } | null>(null);
  const [ingredients, setIngredients] = useState<{ [key: string]: number } | null>(null);
  const [weight, setWeight] = useState<number>(0);
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedIngredients, setEditedIngredients] = useState<{ [key: string]: number }>({});

  const handleLogFood = () => {
    if (weight <= 0) {
      alert("Please enter a valid weight.");
      return;
    }
    setIsLogging(true);
    // Simulate logging food
    setTimeout(() => {
      setIsLogging(false);
      alert("Food log saved successfully!");
    }, 1500); // Simulate delay
  };

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
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}>
          Food Log Details
        </Text>
      </View>

      <ScrollView>
        <View style={{ flex: 1, padding: 16 }}>
          <Image
            source={require("../../../assets/images/snp.png")}
            style={{
              width: "100%",
              height: 250,
              borderRadius: 12,
              marginBottom: 20,
            }}
            resizeMode="cover"
          />
          {predictions.length > 0 && (
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "600",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              🍽️ Food: {predictions[0].class.replace(/_/g, " ")}
            </Text>
          )}

          {macros ? (
            <View
              style={{
                backgroundColor: colors.surface,
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
                🍚 Carbs: {macros?.carbs} g
              </Text>
              <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
                🍗 Protein: {macros?.protein} g
              </Text>
              <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>
                🧈 Fat: {macros?.fats} g
              </Text>
              <Text style={{ color: colors.text, fontSize: 16 }}>
                🔥 Calories: {macros?.calories} kcal
              </Text>
            </View>
          ) : (
            <Text style={{ color: colors.text, textAlign: "center" }}>
              No macros found for this food.
            </Text>
          )}

          {ingredients ? (
            <View
              style={{
                backgroundColor: colors.surface,
                padding: 20,
                borderRadius: 12,
                marginBottom: 20,
                maxHeight: 200,
              }}
            >
              <TouchableOpacity
                onPress={() => setEditMode(!editMode)}
                style={{ alignSelf: "flex-end", marginBottom: 10 }}
              >
                <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                  {editMode ? "Done" : "Edit"}
                </Text>
              </TouchableOpacity>

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
                {Object.entries(ingredients).map(([ingredient, weight], index) => {
                  const currentValue = editedIngredients[ingredient] ?? weight;

                  return editMode ? (
                    <View
                      key={`${ingredient}-${index}`}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <Text style={{ color: colors.text, fontSize: 15, flex: 1 }}>
                        {ingredient.replace(/_/g, " ")}
                      </Text>
                      <TextInput
                        value={String(currentValue)}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                          const newWeight = Math.max(0, Number(text) || 0); // Prevent negative or zero values
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
                      <Text style={{ color: colors.text, marginLeft: 4 }}>g</Text>
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
                })}
              </ScrollView>
            </View>
          ) : (
            <Text style={{ color: colors.text, textAlign: "center" }}>
              No ingredients found for this dish.
            </Text>
          )}

          <Text style={{ color: colors.text, fontSize: 16, marginBottom: 12 }}>
            Weight (grams):
          </Text>
          <TextInput
            value={String(weight)}
            onChangeText={(text) => setWeight(Math.max(0, Number(text) || 0))} // Prevent negative or zero values
            keyboardType="numeric"
            style={{
              borderWidth: 1,
              borderColor: colors.primary,
              borderRadius: 8,
              padding: 8,
              color: colors.text,
              marginBottom: 20,
            }}
          />

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={handleLogFood}
              disabled={isLogging}
              style={{
                flex: 1,
                backgroundColor: isLogging ? "gray" : colors.primary,
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                {isLogging ? "Saving..." : "Save Logs"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
