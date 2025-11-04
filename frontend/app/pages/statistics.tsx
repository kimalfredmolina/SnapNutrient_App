import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { db, auth } from "../../config/firebase";
import {
  ref,
  onValue,
  off,
  set,
  query,
  getDatabase,
  get,
} from "firebase/database";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { getAuth } from "firebase/auth";

export default function Statistics() {
  const { colors, isDark } = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState("1 Week");
  const [selectedNutritionRange, setSelectedNutritionRange] =
    useState("1 Week");
  const [selectedMacro, setSelectedMacro] = useState("Calories");
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [selectedWeightData, setSelectedWeightData] = useState<{
    date: string;
    weight: number;
    change: number;
  } | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<{
    date: string;
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
  } | null>(null);

  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 200;

  const [weightData, setWeightData] = useState<
    Array<{ date: string; weight: number }>
  >([]);

  const [nutritionData, setNutritionData] = useState<
    Array<{
      day: string;
      protein: number;
      carbs: number;
      fats: number;
      timestamp: number;
    }>
  >([]);

  // Get the start date based on selected nutrition range
  const getNutritionRangeStartDate = (range: string) => {
    const today = new Date();
    switch (range) {
      case "1 Week":
        return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "2 Weeks":
        return new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
      case "1 Month":
        return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      case "All time":
        return new Date(0);
      default:
        return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  };

  // Fetch nutrition data
  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        const db = getDatabase();
        const foodLogsRef = ref(db, `foodLogs/${userId}`);
        const foodLogsQuery = query(foodLogsRef);

        const snapshot = await get(foodLogsQuery);
        if (!snapshot.exists()) return;

        const logs = snapshot.val();
        const groupedLogs: {
          [date: string]: {
            protein: number;
            carbs: number;
            fats: number;
            timestamp: number;
          };
        } = {};

        // Process and group the logs by date
        Object.values(logs).forEach((log: any) => {
          const dateObj = new Date(log.createdAt);
          const dateStr = dateObj.toISOString().split("T")[0];
          const dayOfWeek = dateObj
            .toLocaleDateString("en-US", { weekday: "short" })
            .charAt(0);

          if (!groupedLogs[dateStr]) {
            groupedLogs[dateStr] = {
              protein: 0,
              carbs: 0,
              fats: 0,
              timestamp: dateObj.getTime(),
            };
          }

          groupedLogs[dateStr].protein += Number(log.protein) || 0;
          groupedLogs[dateStr].carbs += Number(log.carbs) || 0;
          groupedLogs[dateStr].fats += Number(log.fats) || 0;
        });

        // Filter data based on selected time range
        const startDate = getNutritionRangeStartDate(selectedNutritionRange);
        const filteredData = Object.entries(groupedLogs)
          .filter(([date]) => new Date(date) >= startDate)
          .map(([date, data]) => ({
            day: new Date(date)
              .toLocaleDateString("en-US", { weekday: "short" })
              .charAt(0),
            ...data,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setNutritionData(filteredData);
      } catch (error) {
        console.error("Error fetching nutrition data:", error);
      }
    };

    fetchNutritionData();
  }, [selectedNutritionRange]);

  const timeRanges = ["1 Week", "2 Weeks", "1 Month", "All time"];
  const nutritionRanges = ["1 Week", "2 Weeks", "1 Month", "All time"];
  const macros = ["Calories", "Protein", "Fats", "Carbs"];

  const parseWeightHistory = (obj: any) => {
    if (!obj) return [] as Array<{ date: string; weight: number }>;
    const entries = Object.keys(obj).map((k) => ({
      date: k,
      weight: Number(obj[k]),
    }));
    entries.sort((a, b) => (a.date < b.date ? -1 : 1));
    return entries;
  };

  const getRangeStartDate = (range: string) => {
    const today = new Date();
    switch (range) {
      case "1 Week":
        return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "2 Weeks":
        return new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
      case "1 Month":
        return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      default:
        return new Date(0);
    }
  };

  useEffect(() => {
    let unsubscribeUserRef: (() => void) | null = null;
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;
      const uid = user.uid;
      const userRef = ref(db, `users/${uid}`);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        const history = parseWeightHistory(data?.weightHistory);
        if (history.length) {
          setWeightData(history);
        }

        const healthWeight = data?.healthInfo?.weight;
        if (healthWeight) {
          const today = new Date().toISOString().slice(0, 10);
          const last =
            (history.length ? history[history.length - 1] : null) ||
            weightData[weightData.length - 1];
          const lastWeight = last ? Number(last.weight) : null;
          const parsedHW = Number(healthWeight);
          const hasToday = history.some((h) => h.date === today);
          if (!hasToday) {
            const newEntry = { date: today, weight: parsedHW };
            const newHistory = [...history, newEntry];
            setWeightData(newHistory);
            try {
              set(ref(db, `users/${uid}/weightHistory/${today}`), parsedHW);
            } catch (e) {}
          } else if (hasToday && lastWeight !== parsedHW) {
            const newHistory = history.map((h) =>
              h.date === today ? { ...h, weight: parsedHW } : h
            );
            setWeightData(newHistory);
            try {
              set(ref(db, `users/${uid}/weightHistory/${today}`), parsedHW);
            } catch (e) {}
          }
        }
      });
      unsubscribeUserRef = () => off(userRef);
    });

    return () => {
      try {
        unsubscribeAuth();
      } catch {}
      if (unsubscribeUserRef) unsubscribeUserRef();
    };
  }, []);

  const filteredWeightData = useMemo(() => {
    if (!weightData || weightData.length === 0) return [];
    const start = getRangeStartDate(selectedTimeRange);
    return weightData.filter((w) => new Date(w.date) >= start);
  }, [weightData, selectedTimeRange]);

  const chartData = useMemo(() => {
    if (!filteredWeightData || filteredWeightData.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }
    const labels = filteredWeightData.map((w) =>
      new Date(w.date).getDate().toString()
    );
    const data = filteredWeightData.map((w) => Number(w.weight));
    return {
      labels,
      datasets: [{ data }],
    };
  }, [filteredWeightData]);

  const allWeights = weightData.map((w) => w.weight);
  const maxWeight = Math.max(...allWeights, 0);
  const minWeight = Math.min(...allWeights, Infinity);
  const yRange = Math.ceil(maxWeight - minWeight) || 1;

  const yAxisLabels = useMemo(() => {
    const labels: number[] = [];
    const step = Math.max(1, Math.ceil(yRange / 5));
    for (let i = Math.floor(minWeight); i <= Math.ceil(maxWeight); i += step) {
      labels.push(i);
    }
    return labels;
  }, [minWeight, maxWeight, yRange]);

  function hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    const bigint = parseInt(
      h.length === 3
        ? h
            .split("")
            .map((c) => c + c)
            .join("")
        : h,
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  }

  const getMacroColor = (macro: string) => {
    switch (macro) {
      case "Calories":
        return "#ef4444";
      case "Protein":
        return "#22c55e";
      case "Fats":
        return "#f97316";
      case "Carbs":
        return "#3b82f6";
      default:
        return "#FFA600";
    }
  };

  // Handle bar press to show modal with details for Bar Chart
  const handleBarPress = (index: number) => {
    if (index !== undefined && nutritionData[index]) {
      const dayData = nutritionData[index];
      const calories =
        dayData.protein * 4 + dayData.carbs * 4 + dayData.fats * 9;
      setSelectedDayData({
        date: new Date(dayData.timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        protein: dayData.protein,
        carbs: dayData.carbs,
        fats: dayData.fats,
        calories: calories,
      });
      setModalVisible(true);
    }
  };

  const textColor = isDark ? "#ffffff" : "#1a1a1a";
  const labelColor = isDark ? "#a0a0a0" : "#666666";

  // Handle weight point press to show modal with details for Line Chart
  const handleWeightPointPress = (index: number) => {
    if (index !== undefined && filteredWeightData[index]) {
      const currentData = filteredWeightData[index];
      const previousData = index > 0 ? filteredWeightData[index - 1] : null;
      const weightChange = previousData
        ? Number((currentData.weight - previousData.weight).toFixed(1))
        : 0;

      setSelectedWeightData({
        date: new Date(currentData.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        weight: currentData.weight,
        change: weightChange,
      });
      setWeightModalVisible(true);
    }
  };

  const chartConfigLine = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${hexToRgb(colors.primary)}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${hexToRgb(labelColor)}, ${opacity})`,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: colors.primary,
      fill: colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: "5",
      stroke: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      strokeWidth: 0.8,
    },
    fillShadowGradient: colors.primary,
    fillShadowGradientOpacity: 0.15,
    style: {
      borderRadius: 12,
    },
  };

  const chartConfigBar = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) =>
      `rgba(${hexToRgb(getMacroColor(selectedMacro))}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${hexToRgb(labelColor)}, ${opacity})`,
    propsForBackgroundLines: {
      strokeDasharray: "5",
      stroke: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      strokeWidth: 0.8,
    },
    barPercentage: 0.7,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
        }}
        style={{ backgroundColor: colors.background }}
      >
        <View style={{ paddingHorizontal: 4, paddingVertical: 6 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: "700",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Statistic Overview
          </Text>

          {/* Calendar Section */}
          <View
            style={{ marginBottom: 24, borderRadius: 8, overflow: "hidden" }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              Streak Tracker
            </Text>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: colors.primary,
                },
              }}
              theme={{
                backgroundColor: colors.surface,
                calendarBackground: colors.surface,
                dayTextColor: colors.text,
                monthTextColor: colors.text,
                arrowColor: colors.primary,
              }}
            />
          </View>

          {/* Weight Progress Section */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              Weight Progress
            </Text>

            {/* Time Range Selectors */}
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => setSelectedTimeRange(range)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor:
                      selectedTimeRange === range
                        ? colors.primary
                        : colors.surface,
                  }}
                >
                  <Text
                    style={{
                      color: selectedTimeRange === range ? "#fff" : colors.text,
                      fontWeight: "600",
                    }}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Line Chart */}
            <View
              style={{
                padding: 16,
                borderRadius: 16,
                backgroundColor: colors.surface,
                marginBottom: 4,
              }}
            >
              {chartData.datasets[0].data.length === 0 ? (
                <View style={{ paddingVertical: 40, alignItems: "center" }}>
                  <Text style={{ color: colors.text }}>
                    No weight data yet.
                  </Text>
                </View>
              ) : (
                <LineChart
                  data={{
                    labels: filteredWeightData.map((w) => {
                      const date = new Date(w.date);
                      return `${date.getDate()}`;
                    }),
                    datasets: [
                      {
                        data: filteredWeightData.map((w) => w.weight),
                        color: (opacity = 1) =>
                          `rgba(${hexToRgb(colors.primary)}, ${opacity})`,
                        strokeWidth: 3,
                      },
                    ],
                  }}
                  width={screenWidth - 90}
                  height={280}
                  chartConfig={chartConfigLine}
                  bezier
                  fromZero={false}
                  withDots
                  withInnerLines
                  withOuterLines
                  withVerticalLines
                  withHorizontalLines
                  segments={5}
                  formatYLabel={(y) => `${Math.round(parseFloat(y))}kg`}
                  yLabelsOffset={30}
                  xLabelsOffset={-5}
                  getDotColor={() => colors.primary}
                  style={{ borderRadius: 16 }}
                  onDataPointClick={({ index }) =>
                    handleWeightPointPress(index)
                  }
                />
              )}
            </View>
          </View>

          {/* Nutrition Section */}
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  Macro Nutrient Intake
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
              {nutritionRanges.map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => setSelectedNutritionRange(range)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor:
                      selectedNutritionRange === range
                        ? colors.primary
                        : colors.surface,
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedNutritionRange === range ? "#fff" : colors.text,
                      fontWeight: "600",
                    }}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 20,
                    fontWeight: "700",
                  }}
                >
                  {nutritionData
                    .reduce(
                      (sum, day) =>
                        sum + (day.protein * 4 + day.carbs * 4 + day.fats * 9),
                      0
                    )
                    .toFixed(2)}{" "}
                  cal
                </Text>
                <Text style={{ color: labelColor, fontSize: 12 }}>
                  Total calories ({selectedNutritionRange})
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 20,
                    fontWeight: "700",
                  }}
                >
                  {nutritionData.length > 0
                    ? (
                        nutritionData.reduce(
                          (sum, day) =>
                            sum +
                            (day.protein * 4 + day.carbs * 4 + day.fats * 9),
                          0
                        ) / nutritionData.length
                      ).toFixed(2)
                    : "0.00"}{" "}
                  cal
                </Text>
                <Text style={{ color: labelColor, fontSize: 12 }}>
                  Daily avg.
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              {macros.map((macro) => (
                <TouchableOpacity
                  key={macro}
                  onPress={() => setSelectedMacro(macro)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    marginHorizontal: 8,
                    borderRadius: 999,
                    backgroundColor:
                      selectedMacro === macro
                        ? getMacroColor(macro)
                        : colors.surface,
                  }}
                >
                  <Text
                    style={{
                      color: selectedMacro === macro ? "#fff" : colors.text,
                      fontWeight: "600",
                    }}
                  >
                    {macro}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Bar Chart */}
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View
                style={{
                  padding: 24,
                  borderRadius: 16,
                  backgroundColor: colors.surface,
                }}
              >
                <View>
                  <BarChart
                    data={{
                      labels: nutritionData.map((d) => {
                        const date = new Date(d.timestamp);
                        const day = String(date.getDate());
                        const month = String(date.getMonth() + 1);
                        return `${day}/${month}`;
                      }),
                      datasets: [
                        {
                          data: nutritionData.map((d) => {
                            const value = (() => {
                              switch (selectedMacro) {
                                case "Calories":
                                  return (
                                    d.protein * 4 +
                                    d.carbs * 4 +
                                    d.fats * 9
                                  ).toFixed(2);
                                case "Protein":
                                  return d.protein.toFixed(2);
                                case "Carbs":
                                  return d.carbs.toFixed(2);
                                case "Fats":
                                  return d.fats.toFixed(2);
                                default:
                                  return (
                                    d.protein * 4 +
                                    d.carbs * 4 +
                                    d.fats * 9
                                  ).toFixed(2);
                              }
                            })();
                            return Number(value);
                          }),
                        },
                      ],
                    }}
                    width={Math.max(
                      screenWidth - 90,
                      nutritionData.length * 37
                    )}
                    height={300}
                    yAxisLabel=""
                    yAxisSuffix={selectedMacro === "Calories" ? "cal" : "g"}
                    chartConfig={{
                      ...chartConfigBar,
                      barPercentage: nutritionData.length > 15 ? 0.5 : 0.7,
                    }}
                    style={{ borderRadius: 16 }}
                    showValuesOnTopOfBars={false}
                    fromZero
                    verticalLabelRotation={90}
                    xLabelsOffset={-15}
                    yLabelsOffset={20}
                  />
                  {/* Invisible touchable overlay for bar clicks */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 50,
                      right: 0,
                      bottom: 50,
                      flexDirection: "row",
                    }}
                  >
                    {nutritionData.map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleBarPress(index)}
                        style={{
                          flex: 1,
                          height: "100%",
                        }}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Modal for Weight Details */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={weightModalVisible}
          onRequestClose={() => setWeightModalVisible(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setWeightModalVisible(false)}
          >
            <Pressable
              style={{
                width: "85%",
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: colors.text,
                    marginBottom: 8,
                  }}
                >
                  Weight Details
                </Text>
                <Text style={{ fontSize: 16, color: colors.text }}>
                  {selectedWeightData?.date}
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: colors.primary + "20",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 36,
                    fontWeight: "bold",
                    color: colors.primary,
                    textAlign: "center",
                  }}
                >
                  {selectedWeightData?.weight} kg
                </Text>
              </View>

              {selectedWeightData?.change !== 0 && (
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color:
                        selectedWeightData?.change &&
                        selectedWeightData.change > 0
                          ? "#22c55e"
                          : "#ef4444",
                    }}
                  >
                    {selectedWeightData?.change && selectedWeightData.change > 0
                      ? "+"
                      : ""}
                    {selectedWeightData?.change} kg
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: colors.text, opacity: 0.7 }}
                  >
                    from previous record
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  padding: 12,
                  alignItems: "center",
                  marginTop: 20,
                }}
                onPress={() => setWeightModalVisible(false)}
              >
                <Text style={{ color: "white", fontWeight: "600" }}>Close</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Modal for Detailed Nutrition Data */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setModalVisible(false)}
          >
            <Pressable
              style={{
                width: "85%",
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              onPress={(e) => e.stopPropagation()}
            >
              {selectedDayData && (
                <>
                  <View
                    style={{
                      alignItems: "center",
                      marginBottom: 24,
                      paddingBottom: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: colors.text,
                        marginBottom: 4,
                      }}
                    >
                      Nutrition Details
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: labelColor,
                        fontWeight: "500",
                      }}
                    >
                      {selectedDayData.date}
                    </Text>
                  </View>

                  {/* Total Calories Card */}
                  <View
                    style={{
                      backgroundColor: isDark
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(239, 68, 68, 0.05)",
                      padding: 16,
                      borderRadius: 12,
                      marginBottom: 20,
                      borderWidth: 1,
                      borderColor: "#ef4444",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: labelColor,
                        marginBottom: 4,
                      }}
                    >
                      Total Calories
                    </Text>
                    <Text
                      style={{
                        fontSize: 32,
                        fontWeight: "700",
                        color: "#ef4444",
                      }}
                    >
                      {selectedDayData.calories.toFixed(0)}{" "}
                      <Text style={{ fontSize: 18 }}>cal</Text>
                    </Text>
                  </View>

                  {/* Macronutrients Breakdown */}
                  <View style={{ gap: 12 }}>
                    {/* Protein */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: isDark
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(34, 197, 94, 0.05)",
                        padding: 16,
                        borderRadius: 12,
                        borderLeftWidth: 4,
                        borderLeftColor: "#22c55e",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: colors.text,
                            marginBottom: 4,
                          }}
                        >
                          Protein
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: labelColor,
                          }}
                        >
                          {(selectedDayData.protein * 4).toFixed(0)} Calories
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: "700",
                          color: "#22c55e",
                        }}
                      >
                        {selectedDayData.protein.toFixed(1)}
                        <Text style={{ fontSize: 14 }}> g</Text>
                      </Text>
                    </View>

                    {/* Fats */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: isDark
                          ? "rgba(249, 115, 22, 0.1)"
                          : "rgba(249, 115, 22, 0.05)",
                        padding: 16,
                        borderRadius: 12,
                        borderLeftWidth: 4,
                        borderLeftColor: "#f97316",
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "600",
                            color: colors.text,
                            marginBottom: 4,
                          }}
                        >
                          Fats
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: labelColor,
                          }}
                        >
                          {(selectedDayData.fats * 9).toFixed(0)} Calories
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: "700",
                          color: "#f97316",
                        }}
                      >
                        {selectedDayData.fats.toFixed(1)}
                        <Text style={{ fontSize: 14 }}> g</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Carbs */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: isDark
                        ? "rgba(59, 130, 246, 0.1)"
                        : "rgba(59, 130, 246, 0.05)",
                      padding: 16,
                      borderRadius: 12,
                      borderLeftWidth: 4,
                      borderLeftColor: "#3b82f6",
                      marginTop: 12,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: colors.text,
                          marginBottom: 4,
                        }}
                      >
                        Carbohydrates
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: labelColor,
                        }}
                      >
                        {(selectedDayData.carbs * 4).toFixed(0)} Calories
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "700",
                        color: "#3b82f6",
                      }}
                    >
                      {selectedDayData.carbs.toFixed(1)}
                      <Text style={{ fontSize: 14 }}> g</Text>
                    </Text>
                  </View>

                  {/* Close Button */}
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      backgroundColor: colors.primary,
                      padding: 14,
                      borderRadius: 12,
                      alignItems: "center",
                      marginTop: 24,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      Close
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Pressable>
          </Pressable>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
