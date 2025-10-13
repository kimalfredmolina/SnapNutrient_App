import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { MacroGoals } from "../../../types/macros";
import { db, auth } from "../../../config/firebase";
import { ref, set, get, update, onValue, off } from "firebase/database";

interface MacroCalculatorModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (macros: MacroGoals) => void;
  currentMacros?: MacroGoals;
}

export default function MacroCalculatorModal({
  visible,
  onClose,
  onSave,
  currentMacros,
}: MacroCalculatorModalProps) {
  const { colors } = useTheme();

  type ActivityLevel =
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very_active";

  const [personalInfo, setPersonalInfo] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "" as ActivityLevel,
    goal: "",
  });
  const [hasExisting, setHasExisting] = useState(false);
  const [loading, setLoading] = useState(false);

  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  // Subscribe to user's data so it persists and updates live across app reloads.
  useEffect(() => {
    let userId = auth.currentUser?.uid;
    if (!userId) {
      // If not logged in now, also listen for auth changes (fallback)
      const unsubscribeAuth = auth.onAuthStateChanged((user) => {
        if (user) {
          userId = user.uid;
          attachListener(user.uid);
        }
      });
      return () => unsubscribeAuth();
    } else {
      attachListener(userId);
      return () => detachListener(userId);
    }

    function attachListener(uid: string) {
      setLoading(true);
      const userRef = ref(db, `users/${uid}`);
      // onValue will fetch initial data and fire on updates (keeps UI in sync)
      onValue(
        userRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Load healthInfo first (preferred)
            const health = data.healthInfo;
            const mg = data.macroGoals;
            if (health) {
              setPersonalInfo((prev) => ({
                age: health.age ?? prev.age,
                gender: health.gender ?? prev.gender,
                height: health.height ?? prev.height,
                weight: health.weight ?? prev.weight,
                activityLevel:
                  (health.activityLevel as ActivityLevel) ?? prev.activityLevel,
                goal: health.goal ?? prev.goal,
              }));
            } else if (mg?.personalInfo) {
              // fallback to macroGoals.personalInfo
              const p = mg.personalInfo;
              setPersonalInfo({
                age: p.age ?? "",
                gender: p.gender ?? "",
                height: p.height ?? "",
                weight: p.weight ?? "",
                activityLevel: (p.activityLevel as ActivityLevel) ?? "",
                goal: p.goal ?? "",
              });
            }
            setHasExisting(!!(mg || health));
          } else {
            setHasExisting(false);
          }
          setLoading(false);
        },
        (error) => {
          console.error("onValue error fetching user data:", error);
          setLoading(false);
        }
      );
    }

    function detachListener(uid?: string) {
      if (!uid) return;
      const userRef = ref(db, `users/${uid}`);
      try {
        off(userRef);
      } catch {}
    }
  }, [visible]); // keep visible so modal open triggers attach if needed

  const calculateMacros = (): MacroGoals => {
    const age = parseInt(personalInfo.age);
    const height = parseFloat(personalInfo.height);
    const weight = parseFloat(personalInfo.weight);

    if (
      !age ||
      !height ||
      !weight ||
      !personalInfo.gender ||
      !personalInfo.activityLevel ||
      !personalInfo.goal
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        consumedCalories: 0,
        consumedProtein: 0,
        consumedCarbs: 0,
        consumedFat: 0,
      };
    }

    let bmr: number;
    if (personalInfo.gender === "male") {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }

    const tdee = bmr * activityMultipliers[personalInfo.activityLevel];
    let targetCalories: number;
    switch (personalInfo.goal) {
      case "lose":
        targetCalories = tdee - 500;
        break;
      case "gain":
        targetCalories = tdee + 500;
        break;
      default:
        targetCalories = tdee;
    }

    const protein = Math.round(weight * 2);
    const proteinCalories = protein * 4;
    const fat = Math.round(weight * 1);
    const fatCalories = fat * 9;
    const carbCalories = targetCalories - (proteinCalories + fatCalories);
    const carbs = Math.round(carbCalories / 4);

    return {
      calories: Math.round(targetCalories),
      protein,
      carbs,
      fat,
      consumedCalories: 0,
      consumedProtein: 0,
      consumedCarbs: 0,
      consumedFat: 0,
    };
  };

  // Save/update macroGoals + healthInfo. This uses update() so it merges instead of wiping unrelated nodes.
  const handleCalculate = async () => {
    const macros = calculateMacros();
    if (macros.calories <= 0) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "You must be logged in to save macro goals");
        return;
      }
      setLoading(true);
      const uid = user.uid;
      const userRef = ref(db, `users/${uid}`);

      const dataToSave = {
        macroGoals: {
          ...macros,
          personalInfo: { ...personalInfo },
          updatedAt: new Date().toISOString(),
        },
        healthInfo: {
          ...personalInfo,
        },
      };

      await update(userRef, dataToSave);
      setHasExisting(true);
      onSave(macros);
      Alert.alert("Success", hasExisting ? "Macros updated" : "Macros saved");
      onClose();
    } catch (error: any) {
      console.error("Error saving macros:", error);
      Alert.alert(
        "Error Saving Data",
        error.message || "Failed to save macro goals"
      );
    } finally {
      setLoading(false);
    }
  };

  const DropdownField = ({
    label,
    value,
    options,
    onSelect,
  }: {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onSelect: (value: string) => void;
  }) => {
    const { colors } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
      <View className="mb-4 relative">
        <TouchableOpacity
          className="border rounded-lg p-3 flex-row justify-between items-center"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.surface,
          }}
          onPress={() => setIsOpen(!isOpen)}
        >
          <Text style={{ color: value ? colors.text : colors.text + "60" }}>
            {value ? options.find((opt) => opt.value === value)?.label : label}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>

        {isOpen && (
          <View
            className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <ScrollView className="max-h-48">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className="p-3 border-b"
                  style={{ borderBottomColor: colors.border }}
                  onPress={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Text style={{ color: colors.text }}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const RadioButton = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity className="flex-row items-center mb-3" onPress={onPress}>
      <View
        className="w-5 h-5 rounded-full border-2 mr-3 items-center justify-center"
        style={{ borderColor: colors.primary }}
      >
        {selected && (
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.primary }}
          />
        )}
      </View>
      <Text style={{ color: colors.text }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          className="flex-row items-center justify-between p-4 border-b"
          style={{ borderBottomColor: colors.border }}
        >
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-lg font-bold" style={{ color: colors.text }}>
            Calculate Your Macro Nutrient Goals
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView className="flex-1 p-4">
          <View
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.primary }}
            >
              Personal Information
            </Text>

            <View className="flex-row gap-3 mb-1 ">
              <View className="flex-1">
                <TextInput
                  className="border rounded-lg p-3"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.text,
                  }}
                  placeholder="Age"
                  placeholderTextColor={colors.text + "60"}
                  value={personalInfo.age}
                  onChangeText={(text) =>
                    setPersonalInfo({ ...personalInfo, age: text })
                  }
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <DropdownField
                  label="Gender"
                  value={personalInfo.gender}
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                  ]}
                  onSelect={(value) =>
                    setPersonalInfo({
                      ...personalInfo,
                      gender: value as "male" | "female",
                    })
                  }
                />
              </View>
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <TextInput
                  className="border rounded-lg p-3"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.text,
                  }}
                  placeholder="Height (cm)"
                  placeholderTextColor={colors.text + "60"}
                  value={personalInfo.height}
                  onChangeText={(text) =>
                    setPersonalInfo({ ...personalInfo, height: text })
                  }
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  className="border rounded-lg p-3"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                    color: colors.text,
                  }}
                  placeholder="Weight (kg)"
                  placeholderTextColor={colors.text + "60"}
                  value={personalInfo.weight}
                  onChangeText={(text) =>
                    setPersonalInfo({ ...personalInfo, weight: text })
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>

            <DropdownField
              label="Activity Level"
              value={personalInfo.activityLevel}
              options={[
                { label: "Sedentary (little/no exercise)", value: "sedentary" },
                {
                  label: "Light (light exercise 1-3 days/week)",
                  value: "light",
                },
                {
                  label: "Moderate (moderate exercise 3-5 days/week)",
                  value: "moderate",
                },
                {
                  label: "Active (hard exercise 6-7 days/week)",
                  value: "active",
                },
                {
                  label: "Very Active (very hard exercise, physical job)",
                  value: "very_active",
                },
              ]}
              onSelect={(value) =>
                setPersonalInfo({
                  ...personalInfo,
                  activityLevel: value as any,
                })
              }
            />
          </View>

          <View
            className="rounded-xl p-4 mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.primary }}
            >
              Select Your Goal
            </Text>

            <RadioButton
              label="Lose Weight"
              selected={personalInfo.goal === "lose"}
              onPress={() => setPersonalInfo({ ...personalInfo, goal: "lose" })}
            />
            <RadioButton
              label="Maintain Weight"
              selected={personalInfo.goal === "maintain"}
              onPress={() =>
                setPersonalInfo({ ...personalInfo, goal: "maintain" })
              }
            />
            <RadioButton
              label="Gain Weight"
              selected={personalInfo.goal === "gain"}
              onPress={() => setPersonalInfo({ ...personalInfo, goal: "gain" })}
            />
          </View>

          <TouchableOpacity
            className="rounded-xl p-4 items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleCalculate}
            disabled={loading}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="calculator"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-bold text-lg">
                {hasExisting ? "Update Macros" : "Calculate Macros"}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
