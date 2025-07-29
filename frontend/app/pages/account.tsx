import { View, Text, TouchableOpacity, Image, ScrollView, Switch, } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

export default function Account() {
  const router = useRouter();
  const { colors, isDark, toggle: toggleTheme } = useTheme(); 
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.replace("/(auth)/signin");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View
        className="flex-1"
        style={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 24,
        }}
      >
        {/* Profile Card */}
        <View
          className="flex-row items-center rounded-2xl p-4 mb-8 shadow-md mt-4"
          style={{ backgroundColor: colors.surface }}
        >
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            className="w-16 h-16 rounded-full border-2"
            style={{ borderColor: colors.primary }}
          />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold" style={{ color: colors.text }}>
              Grok A. Garden Jr.
            </Text>
            <View className="flex-row items-center mt-1">
              <Text
                className="font-medium"
                style={{ color: isDark ? "#A1A1AA" : "#374151" }}
              >
                Streak
              </Text>
              <Text className="ml-2 font-bold" style={{ color: colors.accent }}>
                2 Days
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View className="gap-y-2 mb-8 ml-4">
          {/* Settings */}
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="settings-outline" size={24} color={colors.text} />
            <Text
              className="ml-4 text-base font-medium flex-1"
              style={{ color: colors.text }}
            >
              Settings
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text}
              style={{ opacity: 0.5 }}
            />
          </TouchableOpacity>

          {/* Help */}
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={colors.text}
            />
            <Text
              className="ml-4 text-base font-medium flex-1"
              style={{ color: colors.text }}
            >
              Help
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text}
              style={{ opacity: 0.5 }}
            />
          </TouchableOpacity>

          {/* Privacy */}
          <TouchableOpacity className="flex-row items-center py-3">
            <MaterialIcons name="security" size={24} color={colors.text} />
            <Text
              className="ml-4 text-base font-medium flex-1"
              style={{ color: colors.text }}
            >
              Privacy
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text}
              style={{ opacity: 0.5 }}
            />
          </TouchableOpacity>

          {/* Contact */}
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="mail-outline" size={24} color={colors.text} />
            <Text
              className="ml-4 text-base font-medium flex-1"
              style={{ color: colors.text }}
            >
              Contact Us
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text}
              style={{ opacity: 0.5 }}
            />
          </TouchableOpacity>

          {/* Report */}
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons
              name="alert-circle-outline"
              size={24}
              color={colors.text}
            />
            <Text
              className="ml-4 text-base font-medium flex-1"
              style={{ color: colors.text }}
            >
              Report a Problem
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text}
              style={{ opacity: 0.5 }}
            />
          </TouchableOpacity>

          {/* Appearance (Dark/Light) */}
          <View className="flex-row items-center py-3">
            <Ionicons
              name={isDark ? "moon" : "moon-outline"}
              size={24}
              color={colors.text}
            />
            <Text
              className="ml-4 text-base font-medium flex-1"
              style={{ color: colors.text }}
            >
              Appearance
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? "#f4f3f4" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </View>

          {/* About */}
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.text}
            />
            <Text
              className="ml-4 text-base font-medium flex-1"
              style={{ color: colors.text }}
            >
              About Us
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text}
              style={{ opacity: 0.5 }}
            />
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Logout */}
        <View className="mt-16 mb-4">
          <TouchableOpacity
            className="rounded-xl py-3 border"
            style={{ borderColor: colors.accent }}
            onPress={handleSignOut}
          >
            <Text
              className="text-center text-lg font-semibold"
              style={{ color: colors.accent }}
            >
              Log Out
            </Text>
          </TouchableOpacity>

          <View className="items-center mb-40 mt-4">
            <Text
              className="text-xs"
              style={{ color: isDark ? "#71717A" : "#6B7280" }}
            >
              SnapNutrients v1.0
            </Text>
            <Text
              className="text-xs"
              style={{ color: isDark ? "#52525B" : "#9CA3AF" }}
            >
              © 2025 SnapNutrients. All rights reserved.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
