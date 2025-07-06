import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Svg, { Circle } from "react-native-svg";

const SIZE = 64;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * percentage) / 100;

  return (
    <View className="items-center">
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          {/* background circle */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#e5e7eb"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          {/* progress circle */}
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
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
          <Text className="text-xs font-black text-gray-800">
            {value}
            {unit}
          </Text>
        </View>
      </View>
      <Text className="text-xs font-bold text-gray-700 mt-2">{label}</Text>
      <Text className="text-xs text-blue-500">{percentage}%</Text>
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
}) => (
  <TouchableOpacity
    className="bg-white rounded-xl p-4 flex-row items-center mb-3 shadow-sm"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View className="w-12 h-12 rounded-full bg-gray-100 justify-center items-center mr-4">
      {/* food item icon dito lagay yung mga image code nalang na same id = image */}
      <Ionicons name="nutrition-outline" size={24} color="#a259ff" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-bold text-gray-800 mb-1">{name}</Text>
      <Text className="text-sm text-gray-500 font-medium">{calories}</Text>
    </View>
    <TouchableOpacity className="bg-white px-4 py-2 rounded-2xl border border-black">
      <Text className="text-black text-xs font-bold">View</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

export default function HomePage() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-16 pb-6">
        <Text className="text-xl font-bold text-gray-800">
          Welcome back / Guest
        </Text>
        <TouchableOpacity className="p-2">
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Scan & Discover Card */}
      <View className="bg-green-100 mx-5 rounded-2xl p-6 flex-row items-center mb-8 shadow-md">
        <View className="flex-1">
          <Text className="text-2xl font-black text-gray-800 mb-2">
            Scan & Discover
          </Text>
          <Text className="text-sm text-gray-600 mb-4 leading-5 font-medium">
            Scan food items to get detailed nutritional information
          </Text>
          <TouchableOpacity className="bg-[#a259ff] px-6 py-3 rounded-full self-start shadow-md">
            <Text className="text-white font-black text-sm">
              Start Scanning
            </Text>
          </TouchableOpacity>
        </View>
        <View className="ml-6">
          <Ionicons name="qr-code-outline" size={64} color="#a259ff" />
        </View>
      </View>

      {/* Daily Macros */}
      <View className="px-5 mx-5 bg-white rounded-2xl p-6 shadow-sm">
        <Text className="text-xl font-black text-gray-800 mb-6">Macros</Text>
        <View className="flex-row justify-between px-2">
          <MacroCircle label="Carbs" value={142} total={200} color="#ff6b6b" />
          <MacroCircle label="Protein" value={87} total={150} color="#4ecdc4" />
          <MacroCircle label="Fat" value={45} total={80} color="#45b7d1" />
          <MacroCircle
            label="Calories"
            value={1250}
            total={2000}
            color="#f9ca24"
            unit="cal"
          />
        </View>
      </View>

      {/* Food Items */}
      <View className="px-5 mb-8 mt-6">
        <Text className="text-xl font-black text-gray-800 mb-6">
          Food Items
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
      <View className="px-5 mb-28">
        <Text className="text-xl font-black text-gray-800 mb-6">
          Today's Nutrition
        </Text>
        <View className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <Text className="text-sm text-gray-800 leading-6 font-medium">
            You've consumed 1,250 calories today. Keep up the good work!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
