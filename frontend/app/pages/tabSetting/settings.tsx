import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../../contexts/ThemeContext"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Settings() {
  const router = useRouter()
  const { colors, isDark, toggle: toggleTheme } = useTheme()

  return (
    <SafeAreaView style={{ 
      backgroundColor: colors.background,
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24,
    }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderBottomColor: colors.surface }}>
        <TouchableOpacity onPress={() => router.push("..\\account")} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          Settings hahahahahaha
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Account Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Account
          </Text>

          <TouchableOpacity
            className="flex-row items-center py-4 border-b"
            style={{ borderBottomColor: colors.surface }}
          >
            <Ionicons name="person-outline" size={24} color={colors.text} />
            <Text className="ml-4 text-base flex-1" style={{ color: colors.text }}>
              Edit Profile
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.5 }} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-4 border-b"
            style={{ borderBottomColor: colors.surface }}
          >
            <Ionicons name="key-outline" size={24} color={colors.text} />
            <Text className="ml-4 text-base flex-1" style={{ color: colors.text }}>
              Change Password
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.5 }} />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Preferences
          </Text>

          <View className="flex-row items-center py-4 border-b" style={{ borderBottomColor: colors.surface }}>
            <Ionicons name={isDark ? "moon" : "moon-outline"} size={24} color={colors.text} />
            <Text className="ml-4 text-base flex-1" style={{ color: colors.text }}>
              Dark Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              thumbColor={isDark ? "#f4f3f4" : "#f4f3f4"}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
          </View>

          <TouchableOpacity
            className="flex-row items-center py-4 border-b"
            style={{ borderBottomColor: colors.surface }}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <Text className="ml-4 text-base flex-1" style={{ color: colors.text }}>
              Notifications
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.5 }} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-4 border-b"
            style={{ borderBottomColor: colors.surface }}
          >
            <Ionicons name="language-outline" size={24} color={colors.text} />
            <Text className="ml-4 text-base flex-1" style={{ color: colors.text }}>
              Language
            </Text>
            <Text className="mr-2 text-base" style={{ color: colors.text, opacity: 0.5 }}>
              English
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.5 }} />
          </TouchableOpacity>
        </View>

        {/* Data Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Data & Storage
          </Text>

          <TouchableOpacity
            className="flex-row items-center py-4 border-b"
            style={{ borderBottomColor: colors.surface }}
          >
            <Ionicons name="download-outline" size={24} color={colors.text} />
            <Text className="ml-4 text-base flex-1" style={{ color: colors.text }}>
              Export Data
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.5 }} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-4 border-b"
            style={{ borderBottomColor: colors.surface }}
          >
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
            <Text className="ml-4 text-base flex-1" style={{ color: "#EF4444" }}>
              Clear All Data
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" style={{ opacity: 0.5 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}