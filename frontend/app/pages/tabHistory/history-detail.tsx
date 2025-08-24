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
}: {
  name: string;
  time: string;
  image: any;
  calories: string;
}) => {
  const { colors, isDark } = useTheme();

  return (
    <View
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
        <Text
          className="text-sm font-medium"
          style={{ color: colors.primary }}
        >
          {calories}
        </Text>
      </View>
      <TouchableOpacity className="p-2">
        <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

export default function HistoryDetail() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Mock food data for the selected day
  const foodLog = [
    {
      name: "Salmon",
      time: "11:45",
      image: require("../../../assets/images/icon.png"),
      calories: "280 cal",
    },
    {
      name: "Donut",
      time: "11:48",
      image: require("../../../assets/images/icon.png"),
      calories: "320 cal",
    },
    {
      name: "Burger and Fries",
      time: "11:50",
      image: require("../../../assets/images/icon.png"),
      calories: "450 cal",
    },
    {
      name: "Fried Rice",
      time: "11:53",
      image: require("../../../assets/images/icon.png"),
      calories: "220 cal",
    },
    {
      name: "Yogurt",
      time: "11:59",
      image: require("../../../assets/images/icon.png"),
      calories: "150 cal",
    },
  ];

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
        <Text
          className="text-xl font-bold"
          style={{ color: colors.text }}
        >
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
            July {params.day}, 2025
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
            shadowOpacity: 1,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text
              className="text-xl font-bold"
              style={{ color: colors.text }}
            >
              Macros
            </Text>
            <TouchableOpacity>
              <Ionicons name="create-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between">
            <MacroCircle
              label="Calories"
              value={Number(params.calories)}
              total={3000}
              color="#EF4444"
              unit="cal"
            />
            <MacroCircle
              label="Protein"
              value={Number(params.protein)}
              total={130}
              color="#10B981"
            />
            <MacroCircle
              label="Carbs"
              value={Number(params.carbs)}
              total={300}
              color="#3B82F6"
            />
            <MacroCircle
              label="Fat"
              value={Number(params.fat)}
              total={50}
              color="#F97316"
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
          {foodLog.map((food, index) => (
            <FoodItem
              key={index}
              name={food.name}
              time={food.time}
              image={food.image}
              calories={food.calories}
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
            You've consumed {params.calories} calories today. Your protein intake is 
            {Number(params.protein) >= 130 ? " excellent" : " below target"}. 
            Consider adding more protein-rich foods if needed.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}