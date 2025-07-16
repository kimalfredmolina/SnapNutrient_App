import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
} from "react-native-heroicons/outline";
import { useTheme } from "../../contexts/ThemeContext";

export default function History() {
  const { colors, isDark } = useTheme();
  const historyData = [
    {
      day: "1",
      date: "July, 2025",
      calories: 1144,
      protein: 130,
      fat: 21,
      carbs: 104,
    },
    {
      day: "1",
      date: "July, 2025",
      calories: 1144,
      protein: 130,
      fat: 21,
      carbs: 104,
    },
    {
      day: "1",
      date: "July, 2025",
      calories: 1144,
      protein: 130,
      fat: 21,
      carbs: 104,
    },
    {
      day: "1",
      date: "July, 2025",
      calories: 1144,
      protein: 130,
      fat: 21,
      carbs: 104,
    },
  ];

  return (
    <View
      className="flex-1 px-4 pt-4"
      style={{ backgroundColor: colors.background }}
    >
      {/* Filter and Sort Buttons aligned to right */}
      <View className="flex-row justify-end space-x-3 mb-4 mt-12">
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
          <View
            key={index}
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
        ))}
      </ScrollView>
    </View>
  );
}
