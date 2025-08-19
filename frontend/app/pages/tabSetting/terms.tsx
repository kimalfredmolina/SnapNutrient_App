import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../../contexts/ThemeContext"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Terms() {
  const router = useRouter()
  const { colors } = useTheme()

  return (
    <SafeAreaView style={{ 
      backgroundColor: colors.background,
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 60, 
    }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderBottomColor: colors.surface }}>
        <TouchableOpacity onPress={() => router.push("..\\account")} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          Terms & Conditions
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-sm mb-4" style={{ color: colors.text, opacity: 0.7 }}>
          Last updated: August 1, 2025
        </Text>

        {/* Introduction */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
            Introduction
          </Text>
          <Text className="text-base leading-6" style={{ color: colors.text, opacity: 0.8 }}>
            Please read these Terms and Conditions carefully before using the SnapNutrients mobile application. By accessing or using the app, you agree to be bound by these terms.
          </Text>
        </View>

        {/* Acceptance of Terms */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
            Acceptance of Terms
          </Text>
          <Text className="text-base leading-6" style={{ color: colors.text, opacity: 0.8 }}>
            By accessing or using SnapNutrients, you acknowledge that you have read, understood, and agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our application.
          </Text>
        </View>

        {/* User Account */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
            User Account
          </Text>
          <Text className="text-base leading-6" style={{ color: colors.text, opacity: 0.8 }}>
            • You must provide accurate and complete information when creating an account{"\n"}
            • You are responsible for maintaining the security of your account{"\n"}
            • You must notify us immediately of any unauthorized access{"\n"}
            • We reserve the right to terminate accounts at our discretion
          </Text>
        </View>

        {/* Use License */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
            Use License
          </Text>
          <Text className="text-base leading-6" style={{ color: colors.text, opacity: 0.8 }}>
            We grant you a limited, non-exclusive, non-transferable license to use SnapNutrients for personal, non-commercial purposes. This license is subject to these Terms and Conditions.
          </Text>
        </View>

        {/* Prohibited Activities */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
            Prohibited Activities
          </Text>
          <Text className="text-base leading-6" style={{ color: colors.text, opacity: 0.8 }}>
            You agree not to:{"\n"}
            • Use the app for any illegal purpose{"\n"}
            • Attempt to gain unauthorized access{"\n"}
            • Upload malicious code{"\n"}
            • Interfere with the app's functionality{"\n"}
            • Copy or modify the app's software
          </Text>
        </View>

        {/* Privacy Policy */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
            Privacy Policy
          </Text>
          <Text className="text-base leading-6 mb-3" style={{ color: colors.text, opacity: 0.8 }}>
            Your use of SnapNutrients is also governed by our Privacy Policy. Please review our Privacy Policy at:
          </Text>
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={() => router.push("/pages/tabSetting/privacy")}
          >
            <Text className="text-base" style={{ color: colors.primary }}>
              View Privacy Policy
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
            Disclaimer
          </Text>
          <Text className="text-base leading-6" style={{ color: colors.text, opacity: 0.8 }}>
            SnapNutrients is provided "as is" without any warranties. We do not guarantee the accuracy of nutrition information. Consult healthcare professionals for medical advice.
          </Text>
        </View>

        {/* Contact */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-3" style={{ color: colors.text }}>
            Contact Us
          </Text>
          <Text className="text-base leading-6 mb-4" style={{ color: colors.text, opacity: 0.8 }}>
            For questions about these Terms and Conditions, please contact us:
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text className="ml-2 text-base" style={{ color: colors.primary }}>
              snapnutrientapp@gmail.com
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}