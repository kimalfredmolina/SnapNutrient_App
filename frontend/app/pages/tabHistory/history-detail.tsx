import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { db, auth } from "../../../config/firebase";
import { ref, get } from "firebase/database";

// Constants for macro circles
const SIZE = 64;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const calculatePercentage = (consumed: number, total: number): number => {
  if (total <= 0) return 0;
  const percentage = (consumed / total) * 100;
  return Math.min(Math.round(percentage), 100); // Cap at 100%
};

const MacroCircle = ({
  label,
  value,
  total,
  color,
  unit = "g",
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  unit?: string;
}) => {
  const { colors } = useTheme();
  const percentage = calculatePercentage(value, total);
  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * percentage) / 100;

  return (
    <View className="items-center">
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          {/* Background circle */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.bgray}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* Progress circle */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
        {/* Center text showing goal */}
        <View className="absolute inset-0 justify-center items-center">
          <Text className="text-xs font-black" style={{ color: colors.text }}>
            {total}
            {unit}
          </Text>
        </View>
      </View>
      {/* Label */}
      <Text className="text-xs font-bold mt-2" style={{ color: colors.text }}>
        {label}
      </Text>
      {/* Consumed percentage */}
      <Text className="text-xs" style={{ color }}>
        {Number(value).toFixed(2)}
        {unit} ({percentage}%)
      </Text>
    </View>
  );
};

const FoodItem = ({
  name,
  time,
  image,
  calories,
  onPress,
}: {
  name: string;
  time: string;
  image: any;
  calories: string;
  onPress: () => void;
}) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center mb-4 p-4 rounded-2xl"
      style={{
        backgroundColor: colors.surface,
        shadowColor: isDark ? "#fff" : "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
    >
      <Image
        source={image}
        className="w-16 h-16 rounded-xl mr-4"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="font-bold text-lg mb-1" style={{ color: colors.text }}>
          {name}
        </Text>
        <Text
          className="text-sm text-opacity-60"
          style={{ color: colors.text }}
        >
          {time}
        </Text>
        <Text className="text-sm font-medium" style={{ color: colors.primary }}>
          {calories}
        </Text>
      </View>
      <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
    </TouchableOpacity>
  );
};

export default function HistoryDetail() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const foodLogs = JSON.parse(params.logs as string);
  const [targets, setTargets] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Parse the date from params - use timestamp if available, fallback to date string
  const getSelectedDate = () => {
    if (params.timestamp) {
      return new Date(Number(params.timestamp));
    }
    // Fallback to parsing the date string
    if (params.date) {
      return new Date(params.date as string);
    }
    return new Date();
  };

  const selectedDate = getSelectedDate();

  // Fetch user's macro goals when component mounts
  useEffect(() => {
    const fetchMacroGoals = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const macroRef = ref(db, `users/${userId}/macroGoals`);
      const snapshot = await get(macroRef);
      const data = snapshot.val();

      if (data) {
        setTargets({
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
        });
      }
    };

    fetchMacroGoals();
  }, []);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const navigateToFoodDetails = (foodName: string) => {
    // Navigate to the detailed food log screen
    router.push("../tabHistory/history-foodlog-card");
  };

  // Format the date for display in large header
  const formatDisplayDate = () => {
    const month = selectedDate.toLocaleString("default", { month: "long" });
    const day = selectedDate.getDate();
    const year = selectedDate.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  // Format the date for the top header (same format as history list)
  const formatHeaderDate = () => {
    return selectedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        className="flex-row items-center px-5 py-4"
        style={{ backgroundColor: colors.primary }}
      >
        <TouchableOpacity
          onPress={() => router.push("..\\history")}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          {formatHeaderDate()}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
        }}
      >
        {/* Date Header */}
        <View className="items-center mb-6">
          <Text
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            {formatDisplayDate()}
          </Text>
          <Text
            className="text-lg text-opacity-60"
            style={{ color: colors.text }}
          >
            Your nutrition summary for this day
          </Text>
        </View>

        {/* Macros Summary with fetched targets */}
        <View
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: colors.surface,
            shadowColor: colors.text === "#FFFFFF" ? "#fff" : "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
          }}
        >
          <View className="flex-row justify-between">
            <MacroCircle
              label="Calories"
              value={Number(params.calories)}
              total={targets.calories}
              color="#EF4444"
              unit="cal"
            />
            <MacroCircle
              label="Protein"
              value={Number(params.protein)}
              total={targets.protein}
              color="#10B981"
            />
            <MacroCircle
              label="Fat"
              value={Number(params.fat)}
              total={targets.fat}
              color="#F97316"
            />
            <MacroCircle
              label="Carbs"
              value={Number(params.carbs)}
              total={targets.carbs}
              color="#3B82F6"
            />
          </View>
        </View>

        {/* Food Log */}
        <View className="mb-6">
          <Text
            className="text-xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Food Log
          </Text>
          {foodLogs.map((food: any, index: number) => (
            <FoodItem
              key={index}
              name={food.foodName}
              time={formatTime(food.createdAt)}
              image={require("../../../assets/images/icon.png")}
              calories={`${food.calories} cal`}
              onPress={() => navigateToFoodDetails(food.foodName)} // Pass the onPress handler
            />
          ))}
        </View>

        {/* Summary Card */}
        <View
          className="rounded-2xl p-6 mb-6"
          style={{
            backgroundColor: colors.secondary + "20",
            borderColor: colors.secondary + "30",
            borderWidth: 1,
          }}
        >
          <Text
            className="text-lg font-bold mb-3"
            style={{ color: colors.text }}
          >
            Daily Summary
          </Text>
          <Text style={{ color: colors.text, lineHeight: 22 }}>
            You've consumed {params.calories} calories this day. Your protein
            intake is
            {Number(params.protein) >= targets.protein
              ? " excellent"
              : " below target"}
            . Consider adding more protein-rich foods if needed.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
