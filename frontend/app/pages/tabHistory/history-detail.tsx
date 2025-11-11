import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import { db, auth } from "../../../config/firebase";
import { ref, get, remove } from "firebase/database";
import { XMarkIcon, TrashIcon } from "react-native-heroicons/outline";

// Constants for macro circles
const SIZE = 64;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface FoodLog {
  createdAt: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  foodName: string;
  logId?: string;
}

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
  onDelete,
}: {
  name: string;
  time: string;
  image: any;
  calories: string;
  onPress: () => void;
  onDelete: () => void;
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
      <TouchableOpacity onPress={onDelete} className="ml-2 p-1">
        <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function HistoryDetail() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);

  // useEffect(() => {
  //   if (!params.logs) return;
  //   try {
  //     const parsed: FoodLog[] = JSON.parse(params.logs as string);

  //     // Determine selectedDate again (reuse your getSelectedDate logic)
  //     const selDate = getSelectedDate();
  //     // keep only logs that match the selected date (compare date only)
  //     const filtered = parsed.filter((log) => {
  //       const d = new Date(log.createdAt);
  //       return d.toDateString() === selDate.toDateString();
  //     });

  //     // Ensure each log has a logId
  //     const logsWithIds = filtered.map((log, index) => ({
  //       ...log,
  //       logId: log.logId || `log_${Date.now()}_${index}`,
  //     }));

  //     setFoodLogs(logsWithIds);
  //   } catch (err) {
  //     console.error("Failed to parse logs param:", err);
  //     setFoodLogs([]);
  //   }
  // }, [params.logs, params.timestamp, params.date]);

  useEffect(() => {
    const fetchLogsForDate = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setFoodLogs([]);
        return;
      }

      const foodLogsRef = ref(db, `foodLogs/${userId}`);
      const snapshot = await get(foodLogsRef);

      if (!snapshot.exists()) {
        setFoodLogs([]);
        return;
      }

      const logs = snapshot.val();
      const selDate = getSelectedDate();

      const filtered: FoodLog[] = [];
      Object.entries(logs).forEach(([key, value]: [string, any]) => {
        const log = value as FoodLog;
        const d = new Date(log.createdAt);
        if (d.toDateString() === selDate.toDateString()) {
          filtered.push({ ...log, logId: key }); // ✅ Use real Firebase key
        }
      });

      setFoodLogs(filtered);
    };

    fetchLogsForDate();
  }, [params.timestamp, params.date]);

  const [targets, setTargets] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodLog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      // Re-fetch food logs
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setFoodLogs([]);
        return;
      }

      const foodLogsRef = ref(db, `foodLogs/${userId}`);
      const snapshot = await get(foodLogsRef);

      if (!snapshot.exists()) {
        setFoodLogs([]);
        return;
      }

      const logs = snapshot.val();
      const selDate = getSelectedDate();

      const filtered: FoodLog[] = [];
      Object.entries(logs).forEach(([key, value]: [string, any]) => {
        const log = value as FoodLog;
        const d = new Date(log.createdAt);
        if (d.toDateString() === selDate.toDateString()) {
          filtered.push({ ...log, logId: key });
        }
      });

      setFoodLogs(filtered);

      // Re-fetch macro goals
      const macroRef = ref(db, `users/${userId}/macroGoals`);
      const macroSnapshot = await get(macroRef);
      const macroData = macroSnapshot.val();

      if (macroData) {
        setTargets({
          calories: macroData.calories,
          protein: macroData.protein,
          carbs: macroData.carbs,
          fat: macroData.fat,
        });
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

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

  const navigateToFoodDetails = (food: FoodLog) => {
    // Navigate with all the food data as params
    router.push({
      pathname: "/pages/tabHistory/history-foodlog-card",
      params: {
        logId: food.logId || `log_${Date.now()}`,
        foodName: food.foodName,
        calories: food.calories.toString(),
        protein: food.protein.toString(),
        fats: food.fats.toString(),
        carbs: food.carbs.toString(),
        createdAt: food.createdAt,
      },
    });
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

  const handleDeleteFood = (food: FoodLog) => {
    setSelectedFood(food);
    setShowDeleteModal(true);
  };

  const confirmDeleteFood = async () => {
    if (!selectedFood) return;

    setIsDeleting(true);
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      // Find the log ID by matching the food data
      const foodLogsRef = ref(db, `foodLogs/${userId}`);
      const snapshot = await get(foodLogsRef);

      if (snapshot.exists()) {
        const logs = snapshot.val();
        let logIdToDelete: string | null = null;

        // Find the matching log entry
        Object.entries(logs).forEach(([key, value]: [string, any]) => {
          const log = value as FoodLog;
          // compare timestamps as numbers to avoid ms/format mismatch
          if (
            new Date(log.createdAt).getTime() ===
              new Date(selectedFood.createdAt).getTime() &&
            log.foodName === selectedFood.foodName &&
            Number(log.calories) === Number(selectedFood.calories)
          ) {
            logIdToDelete = key;
          }
        });

        if (logIdToDelete) {
          // Delete the specific log
          const logRef = ref(db, `foodLogs/${userId}/${logIdToDelete}`);
          await remove(logRef);

          // Update local state
          const updatedLogs = foodLogs.filter(
            (log) =>
              !(
                log.createdAt === selectedFood.createdAt &&
                log.foodName === selectedFood.foodName &&
                log.calories === selectedFood.calories
              )
          );

          setFoodLogs(updatedLogs);

          // If no more logs, go back to history
          if (updatedLogs.length === 0) {
            router.push("..\\history");
          }

          console.log(
            `Successfully deleted food log: ${selectedFood.foodName}`
          );
        } else {
          console.error("Could not find log ID to delete");
        }
      }

      setShowDeleteModal(false);
      setSelectedFood(null);
    } catch (error) {
      console.error("Error deleting food log:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate current totals from displayed logs
  const currentTotals = foodLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + (Number(log.calories) || 0),
      protein: acc.protein + (Number(log.protein) || 0),
      fat: acc.fat + (Number(log.fats) || 0),
      carbs: acc.carbs + (Number(log.carbs) || 0),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]} // Android
            tintColor={colors.primary} // iOS
          />
        }
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
              value={currentTotals.calories}
              total={targets.calories}
              color="#EF4444"
              unit="cal"
            />
            <MacroCircle
              label="Protein"
              value={currentTotals.protein}
              total={targets.protein}
              color="#10B981"
            />
            <MacroCircle
              label="Fat"
              value={currentTotals.fat}
              total={targets.fat}
              color="#F97316"
            />
            <MacroCircle
              label="Carbs"
              value={currentTotals.carbs}
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
          {foodLogs.length === 0 ? (
            <Text
              className="text-center text-lg"
              style={{ color: colors.text, opacity: 0.6 }}
            >
              No food logs for this day
            </Text>
          ) : (
            foodLogs.map((food: FoodLog, index: number) => (
              <FoodItem
                key={food.logId ?? food.createdAt}
                name={food.foodName}
                time={formatTime(food.createdAt)}
                image={require("../../../assets/images/icon.png")}
                calories={`${food.calories} cal`}
                onPress={() => navigateToFoodDetails(food)}
                onDelete={() => handleDeleteFood(food)}
              />
            ))
          )}
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
            You've consumed {currentTotals.calories.toFixed(1)} calories this
            day. Your protein intake is
            {currentTotals.protein >= targets.protein
              ? " excellent"
              : " below target"}
            . Consider adding more protein-rich foods if needed.
          </Text>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View
            className="w-11/12 max-w-md rounded-2xl p-6"
            style={{ backgroundColor: colors.surface }}
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-xl font-bold"
                style={{ color: colors.text }}
              >
                Delete Food Log
              </Text>
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                className="p-1"
              >
                <XMarkIcon size={24} color={isDark ? "#9CA3AF" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="mb-6">
              <Text className="text-base mb-4" style={{ color: colors.text }}>
                Are you sure you want to delete{" "}
                <Text className="font-bold">{selectedFood?.foodName}</Text>?
              </Text>
              <Text
                className="text-sm"
                style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}
              >
                This will remove {selectedFood?.calories} calories from your
                daily total. This action cannot be undone.
              </Text>
            </View>

            {/* Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl border mr-2"
                style={{
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                }}
                disabled={isDeleting}
              >
                <Text
                  className="text-center font-semibold"
                  style={{ color: colors.text }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmDeleteFood}
                className="flex-1 py-3 rounded-xl flex-row justify-center items-center"
                style={{ backgroundColor: "#EF4444" }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Text className="text-center font-semibold text-white">
                    Deleting...
                  </Text>
                ) : (
                  <>
                    <TrashIcon size={18} color="white" />
                    <Text className="text-center font-semibold text-white ml-2">
                      Delete
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
