import React, { useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import Svg, { Rect, Line, Text as SvgText, Circle } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Statistics() {
  const { colors, isDark } = useTheme();
  const [selectedTimeRange, setSelectedTimeRange] = useState("90 Days");
  const [selectedNutritionRange, setSelectedNutritionRange] = useState("1 Week");
  const [selectedMacro, setSelectedMacro] = useState("Carbs");

  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 200;
  const barWidth = 25;
  const spacing = 35;

  // Weight tracking data
  const weightData = [
    { day: 1, weight: 65 },
    { day: 7, weight: 66 },
    { day: 14, weight: 67 },
    { day: 21, weight: 68 },
    { day: 28, weight: 67 },
    { day: 31, weight: 67 },
  ];

  // Nutrition data
  const nutritionData = [
    { day: "M", protein: 500, carbs: 300, fats: 200 },
    { day: "T", protein: 450, carbs: 350, fats: 150 },
    { day: "W", protein: 600, carbs: 250, fats: 180 },
    { day: "T", protein: 550, carbs: 400, fats: 160 },
    { day: "F", protein: 700, carbs: 300, fats: 190 },
    { day: "S", protein: 500, carbs: 280, fats: 170 },
    { day: "S", protein: 650, carbs: 320, fats: 210 },
  ];

  const maxTotal = Math.max(...nutritionData.map((d) => d.protein + d.carbs + d.fats));

  const chartColors = {
    protein: "#FF6B6B",
    carbs: "#FFA600",
    fats: "#4D96FF",
  };

  const timeRanges = ["90 Days", "6 Months", "1 Year", "All time"];
  const nutritionRanges = ["1 Week", "2 Week", "3 Week", "1 Month"];
  const macros = ["Carbs", "Protein", "Fats"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
        }}
        className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="px-4 py-6">
          {/* Goal Progress Section */}
          <View className="mb-8">
            <Text className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
              Goal Progress
            </Text>
            
            {/* Time Range Selectors */}
            <View className="flex-row space-x-2 mb-4">
              {timeRanges.map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => setSelectedTimeRange(range)}
                  className={`px-4 py-2 rounded-full`}
                  style={{
                    backgroundColor: selectedTimeRange === range ? colors.primary : colors.surface,
                  }}
                >
                  <Text
                    className="font-medium"
                    style={{
                      color: selectedTimeRange === range ? colors.text : colors.text,
                    }}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Weight Tracking Graph */}
            <View 
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Svg width={screenWidth - 80} height={150}>
                {/* Y-axis labels */}
                <SvgText x={10} y={20} fontSize="12" fill={colors.text}>80Kg</SvgText>
                <SvgText x={10} y={50} fontSize="12" fill={colors.text}>70Kg</SvgText>
                <SvgText x={10} y={80} fontSize="12" fill={colors.text}>65Kg</SvgText>
                <SvgText x={10} y={110} fontSize="12" fill={colors.text}>60Kg</SvgText>
                
                {/* X-axis labels */}
                {weightData.map((item, index) => (
                  <SvgText
                    key={index}
                    x={60 + index * 50}
                    y={140}
                    fontSize="12"
                    fill={colors.text}
                    textAnchor="middle"
                  >
                    {item.day}
                  </SvgText>
                ))}

                {/* Weight line */}
                <Line
                  x1={60}
                  y1={110}
                  x2={60 + (weightData.length - 1) * 50}
                  y2={110}
                  stroke={colors.bgray}
                  strokeWidth="1"
                />

                {/* Current weight marker */}
                <Circle
                  cx={60 + 4 * 50}
                  cy={110}
                  r="8"
                  fill={colors.text}
                />
                <SvgText
                  x={60 + 4 * 50}
                  y={95}
                  fontSize="10"
                  fill={colors.text}
                  textAnchor="middle"
                >
                  67Kg
                </SvgText>
              </Svg>
            </View>
          </View>

          {/* Nutrition Section */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-xl font-bold" style={{ color: colors.text }}>
                  Nutritions
                </Text>
                <Text className="text-green-500 font-semibold">90%</Text>
              </View>
              <Text className="text-sm" style={{ color: colors.text }}>
                This week vs last week
              </Text>
            </View>

            {/* Nutrition Time Range Selectors */}
            <View className="flex-row space-x-2 mb-4">
              {nutritionRanges.map((range) => (
                <TouchableOpacity
                  key={range}
                  onPress={() => setSelectedNutritionRange(range)}
                  className={`px-4 py-2 rounded-full`}
                  style={{
                    backgroundColor: selectedNutritionRange === range ? colors.primary : colors.surface,
                  }}
                >
                  <Text
                    className="font-medium"
                    style={{
                      color: selectedNutritionRange === range ? colors.text : colors.text,
                    }}
                  >
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Summary Statistics */}
            <View className="flex-row justify-between mb-4">
              <View className="items-center">
                <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                  12780
                </Text>
                <Text className="text-sm" style={{ color: colors.text }}>
                  Total calories
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                  1952
                </Text>
                <Text className="text-sm" style={{ color: colors.text }}>
                  Daily avg.
                </Text>
              </View>
            </View>

            {/* Macro Selector */}
            <View className="flex-row justify-center mb-4">
              {macros.map((macro) => (
                <TouchableOpacity
                  key={macro}
                  onPress={() => setSelectedMacro(macro)}
                  className={`px-6 py-3 rounded-full mx-2`}
                  style={{
                    backgroundColor: selectedMacro === macro ? "#FFA600" : colors.surface,
                  }}
                >
                  <Text
                    className="font-medium"
                    style={{
                      color: selectedMacro === macro ? "#FFFFFF" : colors.text,
                    }}
                  >
                    {macro}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Enhanced Nutrition Chart */}
            <View 
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Svg width={screenWidth - 80} height={chartHeight + 60}>
                {/* Y-axis labels */}
                <SvgText x={10} y={20} fontSize="12" fill={colors.text}>2k</SvgText>
                <SvgText x={10} y={50} fontSize="12" fill={colors.text}>1k</SvgText>
                <SvgText x={10} y={80} fontSize="12" fill={colors.text}>500</SvgText>
                <SvgText x={10} y={110} fontSize="12" fill={colors.text}>0</SvgText>

                {/* X-axis labels */}
                {nutritionData.map((item, index) => (
                  <SvgText
                    key={index}
                    x={60 + index * spacing}
                    y={chartHeight + 40}
                    fontSize="12"
                    fill={colors.text}
                    textAnchor="middle"
                  >
                    {item.day}
                  </SvgText>
                ))}

                {/* Chart bars */}
                {nutritionData.map((item, index) => {
                  const total = item.protein + item.carbs + item.fats;
                  const x = 60 + index * spacing;
                  const proteinHeight = (item.protein / maxTotal) * chartHeight;
                  const carbsHeight = (item.carbs / maxTotal) * chartHeight;
                  const fatsHeight = (item.fats / maxTotal) * chartHeight;

                  const proteinY = chartHeight - proteinHeight;
                  const carbsY = proteinY - carbsHeight;
                  const fatsY = carbsY - fatsHeight;

                  return (
                    <React.Fragment key={index}>
                      {/* Fats (Blue) */}
                      <Rect
                        x={x}
                        y={fatsY}
                        width={barWidth}
                        height={fatsHeight}
                        fill={chartColors.fats}
                      />
                      {/* Carbs (Orange) */}
                      <Rect
                        x={x}
                        y={carbsY}
                        width={barWidth}
                        height={carbsHeight}
                        fill={chartColors.carbs}
                      />
                      {/* Protein (Red) */}
                      <Rect
                        x={x}
                        y={proteinY}
                        width={barWidth}
                        height={proteinHeight}
                        fill={chartColors.protein}
                      />

                      {/* Highlight Thursday's data point */}
                      {index === 3 && (
                        <Circle
                          cx={x + barWidth / 2}
                          cy={proteinY - 10}
                          r="6"
                          fill={colors.text}
                        />
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Legend */}
                <SvgText x={screenWidth - 120} y={20} fontSize="12" fill={chartColors.protein}>
                  Protein
                </SvgText>
                <SvgText x={screenWidth - 120} y={40} fontSize="12" fill={chartColors.carbs}>
                  Carbs
                </SvgText>
                <SvgText x={screenWidth - 120} y={60} fontSize="12" fill={chartColors.fats}>
                  Fats
                </SvgText>

                {/* Thursday's total calories */}
                <SvgText
                  x={60 + 3 * spacing + barWidth / 2}
                  y={chartHeight - 20}
                  fontSize="10"
                  fill={colors.text}
                  textAnchor="middle"
                >
                  1937
                </SvgText>
              </Svg>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
