import React from "react";
import { View, Text, Switch } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsScreen() {
  const { isDark, theme, setTheme, colors } = useTheme();

  return (
    <View className="flex-1 px-6 py-4" style={{ backgroundColor: colors.background }}>
      <View className="flex-row justify-between items-center py-3 border-b border-gray-300">
        <Text style={{ color: colors.text }}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={() => setTheme(isDark ? "light" : "dark")}
        />
      </View>

    </View>
  );
}