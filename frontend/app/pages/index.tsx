import React, { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";
import { Redirect, router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import MacroCalculatorModal from "./tabIndex/MacroCalculatorModal";

// Constants
const SIZE = 64;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const currentDate = new Date();
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const dates = [14, 15, 16, 17, 18, 19, 20]; // mock dates
const streak = [14, 15]; // days with streak

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
  const { colors } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [macroGoals, setMacroGoals] = useState({
    carbs: 200,
    protein: 150,
    fat: 80,
    calories: 2000,
  });

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/signin" />;
  }

  const handleSaveMacros = (newMacros: any) => {
    setMacroGoals(newMacros);
    // You can also save to AsyncStorage or send to your backend here
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        className="flex-row items-center justify-between px-5 py-4"
        style={{ backgroundColor: colors.primary }}
      >
        {/* Welcome */}
        <View className="flex-row items-center space-x-3">
          <Image
            source={require("../../assets/images/icon.png")}
            style={{ width: 40, height: 40, borderRadius: 999 }}
          />
          <Text
            className="text-2xl font-bold pl-4"
            style={{ color: colors.text }}
          >
            {user?.name ? `${user.name}` : "Welcome"}
          </Text>
        </View>

        {/* Notification Icon */}
        <TouchableOpacity>
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
        {/* Card */}
        <View
          className="rounded-2xl p-6 my-3 mb-6"
          style={{
            backgroundColor: colors.surface,
            shadowColor: colors.text === "#FFFFFF" ? "#fff" : "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          {/* Date + Streak */}
          <Text className="text-xl font-semibold mb-2 text-green-500 dark:text-green-500">
            {formatDate(currentDate)}
          </Text>
          <Text className="text-sm font-medium text-red-500 mb-3">
            Streak <Text className="font-bold">2 Days</Text>
          </Text>

          {/* Streak Days */}
          <View className="flex-row justify-between items-center mb-2">
            {dates.map((date) => {
              const isStreak = streak.includes(date);
              const day = weekdays[new Date(2025, 6, date).getDay()];
              return (
                <View key={date} className="items-center mx-1">
                  {/* Circle */}
                  <View
                    style={{
                      backgroundColor: isStreak ? colors.accent : colors.bgray,
                      borderWidth: isStreak ? 2 : 0,
                      borderColor: isStreak ? colors.accent : "transparent",
                    }}
                    className="w-10 h-10 rounded-full items-center justify-center"
                  >
                    {isStreak ? (
                      <Text style={{ color: colors.text, fontSize: 18 }}>
                        ⚡
                      </Text>
                    ) : (
                      <Text className="text-sm" style={{ color: colors.text }}>
                        {day}
                      </Text>
                    )}
                  </View>
                  {/* Date under circle */}
                  <Text
                    className="text-xs mt-1 font-semibold"
                    style={{ color: colors.text }}
                  >
                    {date}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Footer */}
          <Text
            onPress={() => router.push("/pages/statistics")}
            className="text-sm text-blue-500 text-right font-medium mt-4"
          >
            Check Analytic &gt;
          </Text>
        </View>

        {/* Macros */}
        <View
          className="rounded-2xl p-6 my-3 mb-6"
          style={{
            backgroundColor: colors.surface,
            shadowColor: colors.text === "#FFFFFF" ? "#fff" : "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <View className="flex-row justify-between items-center mb-8">
            <Text
              className="text-base font-bold"
              style={{ color: colors.text }}
            >
              Macros
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Ionicons name="create-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between">
            <MacroCircle
              label="Carbs"
              value={142}
              total={macroGoals.carbs}
              color="#ff6b6b"
            />
            <MacroCircle
              label="Protein"
              value={87}
              total={macroGoals.protein}
              color="#4ecdc4"
            />
            <MacroCircle
              label="Fat"
              value={45}
              total={macroGoals.fat}
              color="#45b7d1"
            />
            <MacroCircle
              label="Calories"
              value={1250}
              total={macroGoals.calories}
              color="#f9ca24"
              unit="cal"
            />
          </View>
        </View>

        {/* Recent Scan Foods */}
        <View className="mb-6">
          <Text
            className="text-base font-bold mb-4"
            style={{ color: colors.text }}
          >
            Recent Scan Foods
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

      <MacroCalculatorModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveMacros}
        currentMacros={macroGoals}
      />
    </SafeAreaView>
  );
}
