import {
  View,
  Text,
  TouchableOpacity,
  Image,

  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../config/firebase";

export default function Account() {
  const router = useRouter();
  const { colors, isDark, toggle: toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("Firebase sign out successful");
      await logout();
      router.replace("/(auth)/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      await logout();
      router.replace("/(auth)/signin");
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View
        className="flex-1"
        style={{
          flexGrow: 1,
          paddingHorizontal: 8,
          paddingTop: 12,
          paddingBottom: 24,
        }}
      >
        {/* Profile Card */}
        <View
          className="flex-row items-center rounded-2xl p-4 mb-8 mx-4 shadow-md mt-4"
          style={{
            backgroundColor: colors.surface,
            shadowColor: colors.text === "#FFFFFF" ? "#fff" : "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          <Image
            source={
              user?.photoURL
                ? { uri: user.photoURL }
                : require("../../assets/images/icon.png")
            }
            className="w-16 h-16 rounded-full border-2"
            style={{
              backgroundColor: colors.surface,
            }}
          />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold" style={{ color: colors.text }}>
              {user?.name || "User"}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text
                className="font-medium"
                style={{ color: isDark ? "#A1A1AA" : "#374151" }}
              >
                {user?.email || "email@email.com"}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View className="gap-y-2 mb-8 ml-4">
          {/* Settings */}
          <TouchableOpacity            testID="btn-settings"
            className="flex-row items-center py-3"
            onPress={() => router.push("/pages/tabSetting/settings")}
          >
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
          <TouchableOpacity
            testID="btn-help"
            className="flex-row items-center py-3"
            onPress={() => router.push("/pages/tabSetting/help")}
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={colors.text}
            />
            <Text
              testID="btn-help-text"
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
          <TouchableOpacity
            testID="btn-privacy"
            className="flex-row items-center py-3"
            onPress={() => router.push("/pages/tabSetting/privacy")}
          >
            <Ionicons name="shield-half-outline" size={24} color={colors.text} />
            <Text
              testID="btn-privacy-text"
              className="ml-4 text-base font-medium flex-1"
              style={{ color: colors.text }}
            >
              Privacy Policy
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text}
              style={{ opacity: 0.5 }}
            />
          </TouchableOpacity>

          {/* Terms & Conditions */}
          <TouchableOpacity
            testID="btn-terms"
            className="flex-row items-center py-3"
            onPress={() => router.push("/pages/tabSetting/terms")}
          >
            <Ionicons name="document-text-outline" size={24} color={colors.text} />
            <Text
              testID="btn-terms-text"
              className="ml-4 text-base font-medium flex-1"
              style={{ color: colors.text }}
            >
              Terms & Conditions
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text}
              style={{ opacity: 0.5 }}
            />
          </TouchableOpacity>

          {/* Contact */}
          <TouchableOpacity
            testID="btn-contact"
            className="flex-row items-center py-3"
            onPress={() => router.push("/pages/tabSetting/contact")}
          >
            <Ionicons name="mail-outline" size={24} color={colors.text} />
            <Text
              testID="btn-contact-text"
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
          <TouchableOpacity
            testID="btn-report"
            className="flex-row items-center py-3"
            onPress={() => router.push("/pages/tabSetting/report")}
          >
            <Ionicons
              name="alert-circle-outline"
              size={24}
              color={colors.text}
            />
            <Text
              testID="btn-report-text"
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
              testID="theme-switch"
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? "#f4f3f4" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </View>

          {/* About */}
          <TouchableOpacity
            testID="btn-about"
            className="flex-row items-center py-3"
            onPress={() => router.push("/pages/tabSetting/about")}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.text}
            />
            <Text
              testID="btn-about-text"
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
        <View className="mt-4 mb-4">
          <TouchableOpacity
            testID="btn-logout"
            className="rounded-xl py-3 border"
            style={{ borderColor: colors.accent }}
            onPress={handleSignOut}
          >
            <Text
              testID="btn-logout-text"
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
              SnapNutrients v1.0.0
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
