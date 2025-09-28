import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "react-native-heroicons/outline";
import { useTheme } from "../../contexts/ThemeContext";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, query, orderByChild, get } from "firebase/database";

// First, let's define our interfaces
interface FoodLog {
  createdAt: string;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  foodName: string;
}

interface HistoryItem {
  day: string;
  date: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  logs: FoodLog[];
}

// Update the component with proper types
export default function History() {
  const [historyData, setHistoryData] = React.useState<HistoryItem[]>([]);
  const { colors, isDark } = useTheme();
  const router = useRouter();

  // Fetch food logs and group them by date
  React.useEffect(() => {
    const fetchFoodLogs = async () => {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.log("No user ID found");
          return;
        }

        const db = getDatabase();
        const foodLogsRef = ref(db, `foodLogs/${userId}`);
        const foodLogsQuery = query(foodLogsRef);

        const snapshot = await get(foodLogsQuery);
        console.log("Firebase response:", snapshot.val());

        if (!snapshot.exists()) {
          console.log("No data available");
          return;
        }

        const logs = snapshot.val();
        const groupedLogs: { [key: string]: HistoryItem } = {};

        // Process each log entry with modified date key
        Object.entries(logs).forEach(([key, value]: [string, any]) => {
          const foodLog = value as FoodLog;
          const date = new Date(foodLog.createdAt);

          // Create a date key that includes day, month, and year
          const dateKey = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          const day = date.getDate().toString();

          if (!groupedLogs[dateKey]) {
            groupedLogs[dateKey] = {
              day,
              date: dateKey,
              calories: 0,
              protein: 0,
              fat: 0,
              carbs: 0,
              logs: [],
            };
          }

          // Add values to the grouped logs
          groupedLogs[dateKey].calories += Number(foodLog.calories) || 0;
          groupedLogs[dateKey].protein += Number(foodLog.protein) || 0;
          groupedLogs[dateKey].fat += Number(foodLog.fats) || 0;
          groupedLogs[dateKey].carbs += Number(foodLog.carbs) || 0;
          groupedLogs[dateKey].logs.push(foodLog);
        });

        console.log("Grouped logs:", groupedLogs);

        // Convert to array and sort by date
        const historyArray = Object.values(groupedLogs).sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        console.log("History array:", historyArray);
        setHistoryData(historyArray);
      } catch (error) {
        console.error("Error fetching food logs:", error);
      }
    };

    fetchFoodLogs();
  }, []);

  const handleHistoryCardPress = (item: HistoryItem) => {
    router.push({
      pathname: "/pages/tabHistory/history-detail",
      params: {
        ...item,
        logs: JSON.stringify(item.logs), // Pass the food logs for this day
      },
    });
  };

  return (
    <View
      className="flex-1 px-4 pt-4"
      style={{ backgroundColor: colors.background }}
    >
      <Text
        className="text-3xl font-bold mb-2 mt-2 text-center"
        style={{ color: colors.text }}
      >
        History
      </Text>

      {/* Filter and Sort Buttons aligned to right */}
      <View className="flex-row justify-end space-x-3 mb-4 mt-2">
        {["Filter", "Sort"].map((label, i) => (
          <TouchableOpacity
            key={i}
            className="flex-row items-center rounded-xl ml-2 px-4 py-2 shadow-md"
            style={{ backgroundColor: colors.surface }}
          >
            <Text
              className="font-semibold text-sm mr-1"
              style={{ color: colors.text }}
            >
              {label}
            </Text>
            <ChevronDownIcon size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
          </TouchableOpacity>
        ))}
      </View>

      {/* History Cards */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {historyData.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleHistoryCardPress(item)}
            activeOpacity={0.7}
          >
            <View
              className="flex-row items-center justify-between mb-4 rounded-2xl p-4 border"
              style={{
                backgroundColor: colors.surface,
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
              }}
            >
              {/* Date */}
              <View
                className="rounded-xl p-2 w-16 items-center mr-4 border shadow-sm"
                style={{
                  backgroundColor: isDark ? "#374151" : colors.surface,
                  borderColor: isDark ? "#4B5563" : "#E5E7EB",
                }}
              >
                <Text
                  className="text-xl font-extrabold"
                  style={{ color: colors.primary }}
                >
                  {item.day}
                </Text>
                {/* Split month and year */}
                {item.date.split(",").map((part, i) => (
                  <Text
                    key={i}
                    className="text-[10px] text-center"
                    style={{ color: isDark ? "#9CA3AF" : "#6B7280" }}
                  >
                    {part.trim()}
                  </Text>
                ))}
              </View>

              {/* Nutrients */}
              <View className="flex-row flex-1 justify-between items-center space-x-2">
                {[
                  {
                    value: item.calories,
                    label: "Calories",
                    color: "#EF4444",
                  },
                  {
                    value: item.protein,
                    label: "Protein",
                    color: "#10B981",
                  },
                  {
                    value: item.fat,
                    label: "Fat",
                    color: "#F97316",
                  },
                  {
                    value: item.carbs,
                    label: "Carbs",
                    color: "#3B82F6",
                  },
                ].map((nutrient, idx) => (
                  <View
                    key={idx}
                    className="items-center px-2 py-4 min-w-[50px] min-h-[65px] rounded-xl"
                    style={{
                      backgroundColor: nutrient.color,
                    }}
                  >
                    <Text className="text-white font-bold text-sm">
                      {nutrient.value}
                    </Text>
                    <Text className="text-white text-[11px]">
                      {nutrient.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Options */}
              <TouchableOpacity className="ml-2 p-1">
                <EllipsisVerticalIcon
                  size={22}
                  color={isDark ? "#9CA3AF" : "#6B7280"}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
