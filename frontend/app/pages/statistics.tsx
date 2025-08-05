import React from "react";
import { View, Text, Dimensions } from "react-native";
import Svg, { Rect } from "react-native-svg";

export default function Statistics() {
  const screenWidth = Dimensions.get("window").width;
  const chartHeight = 250;
  const barWidth = 20;
  const spacing = 30;

  const data = [
    { day: "M", protein: 500, carbs: 300, fats: 200 },
    { day: "T", protein: 450, carbs: 350, fats: 150 },
    { day: "W", protein: 600, carbs: 250, fats: 180 },
    { day: "T", protein: 550, carbs: 400, fats: 160 },
    { day: "F", protein: 700, carbs: 300, fats: 190 },
    { day: "S", protein: 500, carbs: 280, fats: 170 },
    { day: "S", protein: 650, carbs: 320, fats: 210 },
  ];

  const maxTotal = Math.max(...data.map((d) => d.protein + d.carbs + d.fats));

  const colors = {
    protein: "#FF6B6B",
    carbs: "#FFA600",
    fats: "#4D96FF",
  };

  return (
    <View className="flex-1 bg-white pt-10">
      <Text className="text-2xl font-bold text-center">
        Nutrition Analytics
      </Text>
      <Text className="text-center text-gray-500 mb-6">
        Weekly Macro Intake
      </Text>

      <Svg width={screenWidth} height={chartHeight + 50}>
        {data.map((item, index) => {
          const total = item.protein + item.carbs + item.fats;
          const x = spacing + index * (barWidth + spacing);
          const proteinHeight = (item.protein / maxTotal) * chartHeight;
          const carbsHeight = (item.carbs / maxTotal) * chartHeight;
          const fatsHeight = (item.fats / maxTotal) * chartHeight;

          const proteinY = chartHeight - proteinHeight;
          const carbsY = proteinY - carbsHeight;
          const fatsY = carbsY - fatsHeight;

          return (
            <React.Fragment key={index}>
              <Rect
                x={x}
                y={proteinY}
                width={barWidth}
                height={proteinHeight}
                fill={colors.protein}
              />
              <Rect
                x={x}
                y={carbsY}
                width={barWidth}
                height={carbsHeight}
                fill={colors.carbs}
              />
              <Rect
                x={x}
                y={fatsY}
                width={barWidth}
                height={fatsHeight}
                fill={colors.fats}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
