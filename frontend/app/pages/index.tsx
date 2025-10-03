import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";
import { Redirect, router } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import MacroCalculatorModal from "./tabIndex/MacroCalculatorModal";
import { MacroGoals } from "../../types/macros";
import { db, auth } from "../../config/firebase";
import { ref, onValue, off, set } from "firebase/database";
import { isSameDay, isBeforeMidnight } from "../../utils/dateUtils";

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
        {value}
        {unit} ({percentage}%)
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

// Update the getWeekDates function
const getWeekDates = () => {
  const curr = new Date();
  // Start from Monday of previous week to show a full week
  const monday = new Date(curr);
  monday.setDate(curr.getDate() - curr.getDay() + 1);

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const week = Array(7)
    .fill(0)
    .map((_, i) => {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      return {
        date: day.getDate(),
        weekday: weekDays[i],
        fullDate: day.toISOString(),
        isToday:
          new Date().getDate() === day.getDate() &&
          new Date().getMonth() === day.getMonth(),
      };
    });

  return week;
};

// Function to calculate streak based on food logs
const calculateStreak = (foodLogs: any[]): number => {
  if (!foodLogs || foodLogs.length === 0) return 0;

  // Sort logs by date
  const sortedLogs = [...foodLogs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Get the last log date
  let lastLogDate = new Date(sortedLogs[0].createdAt);
  lastLogDate.setHours(0, 0, 0, 0);

  // If the last log is not from today or yesterday, streak is broken
  const daysDiff = Math.floor(
    (currentDate.getTime() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysDiff > 1) return 0;

  // Calculate streak
  let checkDate = new Date(currentDate);
  for (let i = 0; i < sortedLogs.length; i++) {
    const logDate = new Date(sortedLogs[i].createdAt);
    logDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === logDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (checkDate.getTime() > logDate.getTime()) {
      break;
    }
  }

  return streak;
};

export default function HomePage() {
  const { colors } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [macroGoals, setMacroGoals] = useState<MacroGoals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    consumedCalories: 0,
    consumedProtein: 0,
    consumedCarbs: 0,
    consumedFat: 0,
  });
  const [dailyMacros, setDailyMacros] = useState<MacroGoals>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    consumedCalories: 0,
    consumedProtein: 0,
    consumedCarbs: 0,
    consumedFat: 0,
  });
  const [weekDates, setWeekDates] = useState(getWeekDates());
  const [foodLogs, setFoodLogs] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  // For debugging who's currently authenticated/signin by UID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user?.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const macroRef = ref(db, `users/${userId}/macroGoals`);

    onValue(macroRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMacroGoals(data);
        console.log("Loaded macro goals:", data);
      }
    });

    return () => {
      off(macroRef);
    };
  }, []);

  // Fetch today's consumed macros and set up midnight reset
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const fetchTodaysMacros = async () => {
      const today = new Date();
      const foodLogsRef = ref(db, `foodLogs/${userId}`);

      onValue(foodLogsRef, (snapshot) => {
        const logs = snapshot.val();
        if (!logs) return;

        // Reset consumed values
        let consumed = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };

        // Calculate today's consumed macros
        Object.values(logs).forEach((log: any) => {
          const logDate = new Date(log.createdAt);
          if (isSameDay(today, logDate)) {
            consumed.calories += Number(log.calories) || 0;
            consumed.protein += Number(log.protein) || 0;
            consumed.carbs += Number(log.carbs) || 0;
            consumed.fat += Number(log.fats) || 0;
          }
        });

        // Update daily macros
        setDailyMacros((prev) => ({
          ...prev,
          consumedCalories: consumed.calories,
          consumedProtein: consumed.protein,
          consumedCarbs: consumed.carbs,
          consumedFat: consumed.fat,
        }));
      });
    };

    fetchTodaysMacros();

    // Set up midnight reset
    const setupMidnightReset = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const timeUntilMidnight = midnight.getTime() - now.getTime();

      const resetTimer = setTimeout(() => {
        // Reset consumed values at midnight
        setDailyMacros((prev) => ({
          ...prev,
          consumedCalories: 0,
          consumedProtein: 0,
          consumedCarbs: 0,
          consumedFat: 0,
        }));

        // Set up next day's timer
        setupMidnightReset();
      }, timeUntilMidnight);

      return () => clearTimeout(resetTimer);
    };

    const cleanup = setupMidnightReset();
    return () => {
      cleanup();
    };
  }, []);

  const handleSaveMacros = (newMacros: MacroGoals) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    // Save to Firebase
    set(ref(db, `users/${userId}/macroGoals`), {
      ...newMacros,
      updatedAt: new Date().toISOString(),
    })
      .then(() => {
        setMacroGoals(newMacros);
        console.log("Saved new macros:", newMacros);
      })
      .catch((error) => {
        console.error("Error saving macros:", error);
        Alert.alert("Error", "Failed to save macro goals");
      });
  };

  // Fetch food logs and calculate streak
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const foodLogsRef = ref(db, `foodLogs/${userId}`);

    onValue(foodLogsRef, (snapshot) => {
      const logs = snapshot.val();
      if (logs) {
        // Convert object to array and sort by date
        const logsArray = Object.values(logs).sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFoodLogs(logsArray);

        // Calculate streak
        const currentStreak = calculateStreak(logsArray);
        setStreak(currentStreak);

        // Update weekDates to reflect current data
        setWeekDates(getWeekDates());
      }
    });

    return () => off(foodLogsRef);
  }, []);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/signin" />;
  }

  // Function to check if there's activity on a given date
  const hasActivity = (fullDate: string, foodLogs: any[]) => {
    if (!foodLogs || foodLogs.length === 0) return false;

    const checkDate = new Date(fullDate);
    checkDate.setHours(0, 0, 0, 0);

    return foodLogs.some((log) => {
      const logDate = new Date(log.createdAt);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === checkDate.getTime();
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.primary}
        translucent={false}
      />
      <View
        className="flex-row items-center justify-between px-5 py-4"
        style={{ backgroundColor: colors.primary }}
      >
        {/* Welcome */}
        <View className="flex-row items-center space-x-3">
          <Image
            source={
              user?.photoURL
                ? { uri: user.photoURL }
                : require("../../assets/images/icon.png")
            }
            style={{
              width: 45,
              height: 45,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: colors.primary,
            }}
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
            Streak <Text className="font-bold">{streak} Days</Text>
          </Text>

          {/* Streak Days */}
          <View className="flex-row justify-between items-center mb-2">
            {weekDates.map((day) => {
              const hasStreak = hasActivity(day.fullDate, foodLogs);
              const isActive = hasStreak || day.isToday;

              return (
                <View key={day.fullDate} className="items-center mx-1">
                  <View
                    style={{
                      backgroundColor: hasStreak
                        ? "#FF4B4B"
                        : day.isToday
                          ? colors.primary
                          : colors.bgray,
                      borderWidth: 2,
                      borderColor: hasStreak
                        ? "#FF4B4B"
                        : day.isToday
                          ? colors.primary
                          : "transparent",
                    }}
                    className="w-10 h-10 rounded-full items-center justify-center"
                  >
                    {hasStreak ? (
                      <Text style={{ color: "#FFFFFF", fontSize: 18 }}>⚡</Text>
                    ) : (
                      <Text
                        className="text-sm"
                        style={{
                          color: day.isToday ? "#FFFFFF" : colors.text,
                          fontWeight: "bold",
                        }}
                      >
                        {day.weekday}
                      </Text>
                    )}
                  </View>
                  <Text
                    className="text-xs mt-1 font-semibold"
                    style={{
                      color: hasStreak
                        ? "#FF4B4B"
                        : day.isToday
                          ? colors.primary
                          : colors.text,
                    }}
                  >
                    {day.date}
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
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              Your Daily Macro Goal
            </Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Ionicons name="create-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between">
            <MacroCircle
              label="Calories"
              value={dailyMacros.consumedCalories}
              total={macroGoals.calories}
              color="#EF4444"
              unit="cal"
            />
            <MacroCircle
              label="Protein"
              value={dailyMacros.consumedProtein}
              total={macroGoals.protein}
              color="#10B981"
            />
            <MacroCircle
              label="Fat"
              value={dailyMacros.consumedFat}
              total={macroGoals.fat}
              color="#F97316"
            />
            <MacroCircle
              label="Carbs"
              value={dailyMacros.consumedCarbs}
              total={macroGoals.carbs}
              color="#3B82F6"
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
              You've consumed {dailyMacros.consumedCalories} calories today.
              Your protein intake is
              {dailyMacros.consumedProtein >= macroGoals.protein
                ? " excellent"
                : " below target"}
              . Consider adding more protein-rich foods if needed.
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
