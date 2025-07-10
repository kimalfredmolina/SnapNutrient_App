import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../contexts/ThemeContext";

// Constants
const SIZE = 64;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Macro Circle Component
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
  const { isDark, colors } = useTheme();
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * percentage) / 100;

  return (
    <View className="items-center">
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.border}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
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
          <Text className="text-xs font-black" style={{ color: colors.text }}>
            {value}
            {unit}
          </Text>
        </View>
      </View>
      <Text className="text-xs font-bold mt-2" style={{ color: colors.text }}>
        {label}
      </Text>
      <Text className="text-xs" style={{ color: colors.accent }}>
        {percentage}%
      </Text>
    </View>
  );
};

// Food Item Component
const FoodItem = ({
  name,
  calories,
  onPress,
}: {
  name: string;
  calories: string;
  onPress: () => void;
}) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        shadowColor: isDark ? "#fff" : "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name="nutrition-outline" size={24} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: "bold", marginBottom: 4 }}>
          {name}
        </Text>
        <Text style={{ color: colors.text, opacity: 0.6 }}>{calories}</Text>
      </View>
      <TouchableOpacity
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.text,
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 12, fontWeight: "bold" }}>
          View
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Home Page
export default function HomePage() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: colors.primary,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text }}>
          {user?.name ? `Welcome back, ${user.name}` : "Welcome, Guest"}
        </Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 60, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Scan Card */}
        <View
          style={{
            backgroundColor: colors.secondary + "100",
            borderRadius: 20,
            padding: 24,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            shadowColor: colors.secondary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text, marginBottom: 8 }}>
              Scan & Discover
            </Text>
            <Text style={{ color: colors.text, opacity: 0.6, marginBottom: 12 }}>
              Scan food items to get detailed nutritional information
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 24,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Start Scanning</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="qr-code-outline" size={64} color={colors.accent} />
        </View>

        {/* Macros */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text, marginBottom: 16 }}>
            Macros
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <MacroCircle label="Carbs" value={142} total={200} color="#ff6b6b" />
            <MacroCircle label="Protein" value={87} total={150} color="#4ecdc4" />
            <MacroCircle label="Fat" value={45} total={80} color="#45b7d1" />
            <MacroCircle label="Calories" value={1250} total={2000} color="#f9ca24" unit="cal" />
          </View>
        </View>

        {/* Food Items */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text, marginBottom: 16 }}>
            Food Items
          </Text>
          <FoodItem name="Banana (Latundan)" calories="105 cal (Sweet)" onPress={() => {}} />
          <FoodItem name="Yogurt" calories="150 cal" onPress={() => {}} />
          <FoodItem name="Honey" calories="64 cal (Sweet)" onPress={() => {}} />
        </View>

        {/* Today’s Nutrition */}
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text, marginBottom: 16 }}>
            Today's Nutrition
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary + "20",
              borderRadius: 12,
              padding: 16,
              borderColor: colors.secondary + "30",
              borderWidth: 1,
            }}
          >
            <Text style={{ color: colors.text, lineHeight: 20 }}>
              You've consumed 1,250 calories today. Keep up the good work!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
