import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
} from "react-native-heroicons/outline";

export default function History() {
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
      day: "2",
      date: "July, 2025",
      calories: 99,
      protein: 117,
      fat: 14,
      carbs: 110,
    },
    {
      day: "3",
      date: "July, 2025",
      calories: 97,
      protein: 137,
      fat: 17,
      carbs: 140,
    },
    {
      day: "4",
      date: "July, 2025",
      calories: 1144,
      protein: 130,
      fat: 21,
      carbs: 104,
    },
    {
      day: "4",
      date: "July, 2025",
      calories: 1144,
      protein: 130,
      fat: 21,
      carbs: 104,
    },
    {
      day: "4",
      date: "July, 2025",
      calories: 1144,
      protein: 130,
      fat: 21,
      carbs: 104,
    },
    {
      day: "4",
      date: "July, 2025",
      calories: 1144,
      protein: 130,
      fat: 21,
      carbs: 104,
    },
  ];

  return (
    <View className="flex-1 bg-[#F7F8FA] dark:bg-black px-4 pt-4">
      {/* Filter and Sort Buttons aligned to right */}
      <View className="flex-row justify-end space-x-3 mb-4 mt-12">
        {["Filter", "Sort"].map((label, i) => (
          <TouchableOpacity
            key={i}
            className="flex-row items-center bg-white dark:bg-[#1f2937] 
                       rounded-xl ml-2 px-4 py-2 shadow-md dark:shadow-none"
          >
            <Text className="text-gray-800 dark:text-gray-100 font-semibold text-sm mr-1">
              {label}
            </Text>
            <ChevronDownIcon size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* History Cards */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {historyData.map((item, index) => (
          <View
            key={index}
            className="bg-white dark:bg-[#1f2937] 
                       rounded-3xl px-5 py-4 mb-4 
                       flex-row items-center shadow-lg dark:shadow-none"
          >
            {/* Date */}
            <View
              className="bg-white dark:bg-[#374151] 
                            rounded-xl p-3 w-16 items-center mr-4 
                            border border-gray-200 dark:border-gray-600 shadow-sm"
            >
              <Text className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400">
                {item.day}
              </Text>
              <Text className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
                {item.date}
              </Text>
            </View>

            {/* Nutrients */}
            <View className="flex-1 flex-wrap flex-row gap-2">
              {[
                {
                  value: item.calories,
                  label: "Calories",
                  color: "bg-red-500/90",
                },
                {
                  value: item.protein,
                  label: "Protein",
                  color: "bg-green-500/90",
                },
                { value: item.fat, label: "Fat", color: "bg-orange-400/90" },
                { value: item.carbs, label: "Carbs", color: "bg-blue-600/90" },
              ].map((nutrient, idx) => (
                <View
                  key={idx}
                  className={`${nutrient.color} rounded-lg px-3 py-1 min-w-[78px]`}
                >
                  <Text className="text-white font-semibold text-base leading-4">
                    {nutrient.value}
                  </Text>
                  <Text className="text-white text-[11px]">
                    {nutrient.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Options */}
            <TouchableOpacity className="ml-3 p-1">
              <EllipsisVerticalIcon size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
