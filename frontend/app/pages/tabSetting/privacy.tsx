import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

interface PrivacyProps {
  isModal?: boolean;
}

export default function Privacy({ isModal }: PrivacyProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const Container = isModal ? View : SafeAreaView;

  return (
    <Container
      style={{
        backgroundColor: colors.background,
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: isModal ? 0 : 12,
        paddingBottom: 60,
      }}
    >
      {/* Only show header when not in modal */}
      {!isModal && (
        <View
          className="flex-row items-center px-4 py-3 border-b"
          style={{ borderBottomColor: colors.surface }}
        >
          <TouchableOpacity
            onPress={() => router.push("..\\account")}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-xl font-bold" style={{ color: colors.text }}>
            Privacy Policy
          </Text>
        </View>
      )}

      <ScrollView className="flex-1 px-4 py-6">
        <Text
          className="text-sm mb-4"
          style={{ color: colors.text, opacity: 0.7 }}
        >
          Last updated: August 1, 2025
        </Text>

        {/* Introduction */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Introduction
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            SnapNutrients ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our mobile application.
          </Text>
        </View>

        {/* Information We Collect */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Information We Collect
          </Text>
          <Text
            className="text-base leading-6 mb-3"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            We may collect information about you in a variety of ways:
          </Text>

          <View className="ml-4">
            <Text
              className="text-base font-medium mb-2"
              style={{ color: colors.text }}
            >
              Personal Data
            </Text>
            <Text
              className="text-base leading-6 mb-4"
              style={{ color: colors.text, opacity: 0.8 }}
            >
              • Name and email address when you create an account{"\n"}• Profile
              information you choose to provide{"\n"}• Food preferences and
              dietary restrictions
            </Text>

            <Text
              className="text-base font-medium mb-2"
              style={{ color: colors.text }}
            >
              Usage Data
            </Text>
            <Text
              className="text-base leading-6 mb-4"
              style={{ color: colors.text, opacity: 0.8 }}
            >
              • Photos of food you scan{"\n"}• Nutrition tracking data{"\n"}•
              App usage patterns and preferences{"\n"}• Device information and
              identifiers
            </Text>
          </View>
        </View>

        {/* How We Use Information */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            How We Use Your Information
          </Text>
          <Text
            className="text-base leading-6 mb-3"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            We use the information we collect to:
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            • Provide and maintain our service{"\n"}• Process food recognition
            and nutrition analysis{"\n"}• Personalize your experience{"\n"}•
            Send you updates and notifications{"\n"}• Improve our app and
            services{"\n"}• Ensure security and prevent fraud
          </Text>
        </View>

        {/* Data Security */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Data Security
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the internet is
            100% secure.
          </Text>
        </View>

        {/* Your Rights */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Your Rights
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            You have the right to:{"\n"}• Access your personal data{"\n"}•
            Correct inaccurate data{"\n"}• Delete your account and data{"\n"}•
            Export your data{"\n"}• Opt-out of certain communications
          </Text>
        </View>

        {/* Contact */}
        <View className="mb-8">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Contact Us
          </Text>
          <Text
            className="text-base leading-6 mb-4"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            If you have questions about this Privacy Policy, please contact us:
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text className="ml-2 text-base" style={{ color: colors.primary }}>
              privacy@snapnutrients.com
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}
