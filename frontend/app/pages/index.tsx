import React, { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../contexts/ThemeContext";

// Constants
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
            stroke={colors.border}
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
  calories,
  onPress,
}: {
  name: string;
  calories: string;
  onPress: () => void;
}) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      className="mb-3 p-4 rounded-2xl flex-row items-center"
      style={{
        backgroundColor: colors.surface,
        shadowColor: isDark ? "#fff" : "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
      onPress={onPress}
    >
      <View
        className="w-12 h-12 rounded-full justify-center items-center mr-3"
        style={{ backgroundColor: colors.background }}
      >
        <Ionicons name="nutrition-outline" size={24} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="font-bold mb-1" style={{ color: colors.text }}>
          {name}
        </Text>
        <Text
          className="text-sm text-opacity-60"
          style={{ color: colors.text }}
        >
          {calories}
        </Text>
      </View>
      <TouchableOpacity
        className="px-4 py-2 rounded-full border"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.text,
        }}
      >
        <Text className="text-xs font-bold" style={{ color: colors.text }}>
          View
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function HomePage() {
  const [user] = useState<{ name?: string } | null>(null);
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        className="flex-row items-center justify-between px-5 py-4"
        style={{ backgroundColor: colors.primary }}
      >
        {/* Left: Welcome Text */}
        <View className="flex-1">
          <Text
            className="text-base font-semibold"
            style={{ color: colors.text }}
          >
            {user?.name ? `Welcome back, ${user.name}` : "Welcome, Guest"}
          </Text>
        </View>

        {/* Center: SnapNutrients */}
        <View className="absolute left-0 right-0 items-center">
          <Text className="text-3xl font-bold" style={{ color: colors.text }}>
            SnapNutrients
          </Text>
        </View>

        {/* Right: Notification */}
        <TouchableOpacity className="flex-1 items-end">
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
        }}
      >
        {/* Scan Card */}
        <View
          className="rounded-2xl p-6 flex-row items-center mb-5"
          style={{
            backgroundColor: colors.secondary + "50",
            shadowColor: colors.secondary + "50",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <View className="flex-1">
            <Text
              className="text-lg font-bold mb-2"
              style={{ color: colors.text }}
            >
              Scan & Discover
            </Text>
            <Text
              className="text-sm text-opacity-60 mb-3"
              style={{ color: colors.text }}
            >
              Scan food items to get detailed nutritional information
            </Text>
            <TouchableOpacity
              className="px-5 py-3 rounded-full"
              style={{ backgroundColor: colors.accent }}
            >
              <Text className="text-white font-bold">Start Scanning</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="qr-code-outline" size={64} color={colors.accent} />
        </View>

        {/* Macros */}
        <View
          className="rounded-2xl p-6 mb-6"
          style={{ backgroundColor: colors.surface }}
        >
          <Text
            className="text-base font-bold mb-4"
            style={{ color: colors.text }}
          >
            Macros
          </Text>
          <View className="flex-row justify-between">
            <MacroCircle
              label="Carbs"
              value={142}
              total={200}
              color="#ff6b6b"
            />
            <MacroCircle
              label="Protein"
              value={87}
              total={150}
              color="#4ecdc4"
            />
            <MacroCircle label="Fat" value={45} total={80} color="#45b7d1" />
            <MacroCircle
              label="Calories"
              value={1250}
              total={2000}
              color="#f9ca24"
              unit="cal"
            />
          </View>
        </View>

        {/* Food Items */}
        <View className="mb-6">
          <Text
            className="text-base font-bold mb-4"
            style={{ color: colors.text }}
          >
            Food Items
          </Text>
          <FoodItem
            name="Banana (Latundan)"
            calories="105 cal (Sweet)"
            onPress={() => {}}
          />
          <FoodItem name="Yogurt" calories="150 cal" onPress={() => {}} />
          <FoodItem name="Honey" calories="64 cal (Sweet)" onPress={() => {}} />
        </View>

        {/* Today's Nutrition */}
        <View>
          <Text
            className="text-base font-bold mb-4"
            style={{ color: colors.text }}
          >
            Today's Nutrition
          </Text>
          <View
            className="rounded-xl p-4"
            style={{
              backgroundColor: colors.secondary + "20",
              borderColor: colors.secondary + "30",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: colors.text, lineHeight: 20 }}>
              You've consumed 1,250 calories today. Keep up the good work!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
