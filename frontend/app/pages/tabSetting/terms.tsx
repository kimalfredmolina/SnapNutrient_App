import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

interface TermsProps {
  isModal?: boolean;
}

export default function Terms({ isModal }: TermsProps) {
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
            Terms & Conditions
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
            Welcome to SnapNutrients! These Terms and Conditions govern your use
            of our mobile app. By downloading, accessing, or using SnapNutrients
            from Google Play, you agree to comply with these Terms and with the
            Google Play Terms of Service.
          </Text>
        </View>

        {/* Acceptance of Terms */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Acceptance of Terms
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            By installing or using this app, you confirm that you have read,
            understood, and agree to these Terms and Google Play policies. If
            you do not agree, please uninstall and do not use SnapNutrients.
          </Text>
        </View>

        {/* User Accounts */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            User Accounts
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            • Provide accurate and updated information when creating an account
            {"\n"}• Keep your login credentials secure and confidential{"\n"}•
            Notify us immediately if you suspect unauthorized use{"\n"}• We may
            suspend or terminate accounts that violate these Terms
          </Text>
        </View>

        {/* App Use & License */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            License to Use
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            We grant you a limited, personal, non-commercial, non-transferable
            license to use SnapNutrients in accordance with these Terms and
            Google Play’s Developer Distribution Agreement.
          </Text>
        </View>

        {/* Prohibited Activities */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Prohibited Activities
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            You agree not to:{"\n"}• Violate Google Play policies or local laws
            {"\n"}• Attempt to hack, reverse engineer, or disrupt the app{"\n"}•
            Upload viruses, malicious code, or harmful content{"\n"}• Use the
            app to harass, abuse, or harm others{"\n"}• Copy, redistribute, or
            sell the app’s code or content
          </Text>
        </View>

        {/* Content & Intellectual Property */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Content and Intellectual Property
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            All content within SnapNutrients is protected by copyright and other
            intellectual property laws. You may not use our branding, logos, or
            content without written permission.
          </Text>
        </View>

        {/* Data Privacy */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Privacy & Data
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            Your data is handled according to our Privacy Policy and Google Play
            User Data policies. We do not sell your personal information. You
            may request data deletion by contacting us.
          </Text>
        </View>

        {/* Disclaimer */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Disclaimer
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            SnapNutrients is provided “as is.” We do not guarantee complete
            accuracy of nutritional data. Always consult a qualified healthcare
            professional before making health-related decisions.
          </Text>
        </View>

        {/* Termination */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.text }}
          >
            Suspension or Termination
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            We reserve the right to suspend or terminate your access at any time
            if you violate these Terms or Google Play’s policies.
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
            For questions or concerns about these Terms and Conditions, contact
            us:
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
