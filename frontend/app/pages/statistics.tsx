import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { db, auth } from "../../config/firebase";
import { ref, onValue, off, set } from "firebase/database";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";

export default function Statistics() {
  const { colors, isDark } = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState("1 Week");
  const [selectedNutritionRange, setSelectedNutritionRange] =
    useState("1 Week");
  const [selectedMacro, setSelectedMacro] = useState("Carbs");
  const [selectedDate, setSelectedDate] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 200;

  const [weightData, setWeightData] = useState<
    Array<{ date: string; weight: number }>
  >([
    {
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      weight: 65,
    },
    {
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      weight: 66,
    },
    {
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      weight: 67,
    },
    {
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      weight: 68,
    },
    {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      weight: 67,
    },
    { date: new Date().toISOString().slice(0, 10), weight: 67 },
  ]);

  const nutritionData = [
    { day: "M", protein: 500, carbs: 300, fats: 200 },
    { day: "T", protein: 450, carbs: 350, fats: 150 },
    { day: "W", protein: 600, carbs: 250, fats: 180 },
    { day: "T", protein: 550, carbs: 400, fats: 160 },
    { day: "F", protein: 700, carbs: 300, fats: 190 },
    { day: "S", protein: 500, carbs: 280, fats: 170 },
    { day: "S", protein: 650, carbs: 320, fats: 210 },
  ];

  const timeRanges = ["1 Week", "2 Weeks", "1 Month", "All time"];
  const nutritionRanges = ["1 Week", "2 Week", "3 Week", "1 Month"];
  const macros = ["Carbs", "Protein", "Fats"];

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

  // Create array of unique Y-axis labels
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

  const textColor = isDark ? "#ffffff" : "#1a1a1a";
  const labelColor = isDark ? "#a0a0a0" : "#666666";

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
    color: (opacity = 1) => `rgba(${hexToRgb("#FFA600")}, ${opacity})`,
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
                  Nutritions
                </Text>
                <Text style={{ color: "#22c55e", fontWeight: "600" }}>90%</Text>
              </View>
              <Text style={{ color: labelColor, fontSize: 12 }}>
                This week vs last week
              </Text>
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
                marginBottom: 12,
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
                  12780
                </Text>
                <Text style={{ color: labelColor, fontSize: 12 }}>
                  Total calories
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
                  1952
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
                      selectedMacro === macro ? "#FFA600" : colors.surface,
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
            <View
              style={{
                padding: 16,
                borderRadius: 16,
                backgroundColor: colors.surface,
              }}
            >
              <BarChart
                data={{
                  labels: nutritionData.map((d) => d.day),
                  datasets: [
                    {
                      data: nutritionData.map(
                        (d) => d.protein + d.carbs + d.fats
                      ),
                    },
                  ],
                }}
                width={screenWidth - 90}
                height={280}
                yAxisLabel=""
                yAxisSuffix="cal"
                chartConfig={chartConfigBar}
                style={{ borderRadius: 16 }}
                showValuesOnTopOfBars={false}
                fromZero
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
