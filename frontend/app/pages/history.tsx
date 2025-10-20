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

// Define types for food log and history item
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
  timestamp?: number;
}

export default function History() {
  const [historyData, setHistoryData] = React.useState<HistoryItem[]>([]);
  const [sortOrder, setSortOrder] = React.useState<"newest" | "oldest">(
    "newest"
  );
  const [filterBy, setFilterBy] = React.useState<
    "calories" | "protein" | "fat" | "carbs" | null
  >(null);
  const [filterOrder, setFilterOrder] = React.useState<"highest" | "lowest">(
    "highest"
  );
  const [showSortDropdown, setShowSortDropdown] = React.useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);
  const { colors, isDark } = useTheme();
  const router = useRouter();

  // Fetch food logs and group them by date (use ISO date key + timestamp for reliable sorting)
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
        const groupedLogs: { [isoDate: string]: HistoryItem } = {};

        Object.entries(logs).forEach(([key, value]: [string, any]) => {
          const foodLog = value as FoodLog;
          const dateObj = new Date(foodLog.createdAt);

          // Display string for UI
          const dateDisplay = dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          // ISO date key (reliable grouping) and start-of-day timestamp
          const isoKey = dateObj.toISOString().split("T")[0]; // "2025-09-28"
          const dayStart = new Date(
            dateObj.getFullYear(),
            dateObj.getMonth(),
            dateObj.getDate()
          ).getTime();

          const day = dateObj.getDate().toString();

          if (!groupedLogs[isoKey]) {
            groupedLogs[isoKey] = {
              day,
              date: dateDisplay,
              calories: 0,
              protein: 0,
              fat: 0,
              carbs: 0,
              logs: [],
              timestamp: dayStart,
            };
          }

          groupedLogs[isoKey].calories += Number(foodLog.calories) || 0;
          groupedLogs[isoKey].protein += Number(foodLog.protein) || 0;
          groupedLogs[isoKey].fat += Number(foodLog.fats) || 0;
          groupedLogs[isoKey].carbs += Number(foodLog.carbs) || 0;
          groupedLogs[isoKey].logs.push(foodLog);
        });

        // Convert to array and sort by timestamp (newest first by default)
        const historyArray = Object.values(groupedLogs).sort((a, b) => {
          const ta = a.timestamp ?? new Date(a.date).getTime();
          const tb = b.timestamp ?? new Date(b.date).getTime();
          return tb - ta;
        });

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
        logs: JSON.stringify(item.logs),
      },
    });
  };

  // Sort by timestamp (newest | oldest)
  const sortData = (data: HistoryItem[]) => {
    return [...data].sort((a, b) => {
      const ta = (a as any).timestamp ?? new Date(a.date).getTime();
      const tb = (b as any).timestamp ?? new Date(b.date).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });
  };

  // Filter by nutrient (highest | lowest)
  const filterData = (data: HistoryItem[]) => {
    if (!filterBy) return data;
    return [...data].sort((a, b) => {
      const valueA = Number((a as any)[filterBy]) || 0;
      const valueB = Number((b as any)[filterBy]) || 0;
      return filterOrder === "highest" ? valueB - valueA : valueA - valueB;
    });
  };

  const handleFilter = (
    nutrient: "calories" | "protein" | "fat" | "carbs" | null
  ) => {
    if (nutrient === null) {
      setFilterBy(null);
      return;
    }

    if (filterBy === nutrient) {
      setFilterOrder((prev) => (prev === "highest" ? "lowest" : "highest"));
    } else {
      setFilterBy(nutrient);
      setFilterOrder("highest");
    }
    setShowFilterDropdown(false);
  };

  // Close dropdowns when clicking outside (guard for non-web env)
  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const handleClickOutside = () => {
      setShowSortDropdown(false);
      setShowFilterDropdown(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Use displayedData so we apply either date sort or nutrient filter (filter keeps working)
  const displayedData = filterBy
    ? filterData(historyData)
    : sortData(historyData);

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
        {/* Sort Dropdown */}
        <View>
          <TouchableOpacity
            onPress={() => setShowSortDropdown(!showSortDropdown)}
            className="flex-row items-center rounded-xl px-4 py-2 shadow-md"
            style={{ backgroundColor: colors.surface }}
          >
            <Text
              className="font-semibold text-sm mr-1"
              style={{ color: colors.text }}
            >
              {`Sort: ${sortOrder}`}
            </Text>
            <ChevronDownIcon size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
          </TouchableOpacity>

          {showSortDropdown && (
            <View
              className="absolute top-12 right-0 rounded-xl shadow-lg z-50 w-32"
              style={{ backgroundColor: colors.surface }}
            >
              <TouchableOpacity
                onPress={() => {
                  setSortOrder("newest");
                  setShowSortDropdown(false);
                }}
                className="p-3 border-b"
                style={{ borderColor: isDark ? "#4B5563" : "#E5E7EB" }}
              >
                <Text style={{ color: colors.text }}>Newest</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSortOrder("oldest");
                  setShowSortDropdown(false);
                }}
                className="p-3"
              >
                <Text style={{ color: colors.text }}>Oldest</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Filter Dropdown */}
        <View>
          <TouchableOpacity
            onPress={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex-row items-center rounded-xl px-4 py-2 shadow-md"
            style={{ backgroundColor: colors.surface }}
          >
            <Text
              className="font-semibold text-sm mr-1"
              style={{ color: colors.text }}
            >
              {filterBy ? `${filterBy} (${filterOrder})` : "Filter"}
            </Text>
            <ChevronDownIcon size={18} color={isDark ? "#9CA3AF" : "#6B7280"} />
          </TouchableOpacity>

          {showFilterDropdown && (
            <View
              className="absolute top-12 right-0 rounded-xl shadow-lg z-50 w-36"
              style={{ backgroundColor: colors.surface }}
            >
              <TouchableOpacity
                className="p-3 border-b"
                style={{ borderColor: isDark ? "#4B5563" : "#E5E7EB" }}
                onPress={() => {
                  handleFilter(null); // clear filter
                }}
              >
                <Text style={{ color: colors.text }}>Clear Filter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="p-3 border-b"
                onPress={() => handleFilter("calories")}
              >
                <Text style={{ color: colors.text }}>Calories</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="p-3 border-b"
                onPress={() => handleFilter("protein")}
              >
                <Text style={{ color: colors.text }}>Protein</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="p-3 border-b"
                onPress={() => handleFilter("fat")}
              >
                <Text style={{ color: colors.text }}>Fat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="p-3"
                onPress={() => handleFilter("carbs")}
              >
                <Text style={{ color: colors.text }}>Carbs</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* History Cards */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {displayedData.map((item, index) => (
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
