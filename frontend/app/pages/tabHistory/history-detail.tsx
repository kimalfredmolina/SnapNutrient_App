import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

// Constants for macro circles
const SIZE = 64;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * percentage) / 100;

  return (
    <View className="items-center">
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.bgray}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
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
        <View className="absolute inset-0 justify-center items-center">
          <Text className="text-xs font-black" style={{ color: colors.text }}>
            {value}
            {unit}
          </Text>
        </View>
      </View>
      <Text className="text-xs font-bold mt-2" style={{ color: colors.text }}>
        {label}
      </Text>
      <Text className="text-xs" style={{ color }}>
        {percentage}%
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

  // Calculate total targets (you might want to fetch these from user preferences)
  const targets = {
    calories: 2500,
    protein: 130,
    carbs: 300,
    fat: 50,
  };

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
          {params.date}
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
            {new Date().toLocaleString("default", { month: "long" })}{" "}
            {params.day}, 2025
          </Text>
          <Text
            className="text-lg text-opacity-60"
            style={{ color: colors.text }}
          >
            Your nutrition summary for this today
          </Text>
        </View>

        {/* Macros Summary */}
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
            You've consumed {params.calories} calories today. Your protein
            intake is
            {Number(params.protein) >= targets.protein
              ? " excellent"
              : " below target"}. Consider adding more protein-rich foods if needed.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
