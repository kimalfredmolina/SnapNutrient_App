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
          Last updated: September 1, 2025
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
            privacy. This Privacy Policy explains how we collect, use, and
            safeguard your personal data when you use our mobile application
            downloaded from Google Play.
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
            We may collect the following types of information to provide a
            personalized nutrition experience:
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
              • Name, email address, and login credentials{"\n"}• Age, gender,
              height, weight, and activity level{"\n"}• Profile photo (if you
              choose to upload one){"\n"}• Food preferences and dietary
              restrictions
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
              • Photos of food you scan{"\n"}• Macro and calorie intake history
              {"\n"}• Your daily goals and progress{"\n"}• Device and app
              analytics for performance improvement
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
            Your data helps us calculate your personalized nutrition plan and
            improve your experience. Specifically, we use your information to:
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            • Calculate your daily macro and calorie needs{"\n"}• Track your
            nutrition progress over time{"\n"}• Personalize recommendations and
            insights{"\n"}• Send reminders and notifications you enable{"\n"}•
            Improve the performance and features of the app{"\n"}• Ensure
            security and prevent misuse
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
            We use encryption and secure storage methods to protect your data.
            Your login credentials and personal health information are stored
            safely and are not shared with third parties except as required by
            law or with your explicit consent.
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
            You can request to:{"\n"}• View the data we store about you{"\n"}•
            Update incorrect profile information{"\n"}• Delete your account and
            personal data permanently{"\n"}• Export your nutrition history{"\n"}
            • Opt-out of email or push notifications
          </Text>
        </View>

        {/* Google Play Compliance */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Google Play Privacy Compliance
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            Our data practices comply with Google Play's User Data policy.
            SnapNutrients does not sell or share your personal information with
            advertisers. We only use your data to provide core functionality and
            improve your health tracking experience.
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
            If you have questions about this Privacy Policy or want to manage
            your data, contact us:
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="mail-outline" size={20} color={colors.primary} />
            <Text className="ml-2 text-base" style={{ color: colors.primary }}>
              snapnutrientapp@gmail.com
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  );
}
