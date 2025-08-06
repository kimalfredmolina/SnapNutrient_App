import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 24,
      }}
    >
      {/* Header */}
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
          About Us
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* App Logo and Name */}
        <View className="items-center mb-8">
          <Image
            source={require("../../../assets/images/snp.png")}
            style={{ width: 100, height: 100, marginBottom: 16 }}
            resizeMode="contain"
          />
          <Text
            className="text-2xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            SnapNutrient
          </Text>
          <Text
            className="text-base"
            style={{ color: colors.text, opacity: 0.7 }}
          >
            Version 1.0.0
          </Text>
        </View>

        {/* Description */}
        <View className="mb-8">
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Our Mission
          </Text>
          <Text
            className="text-base leading-6 mb-4"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            SnapNutrients is designed to make nutrition tracking simple and
            accessible for everyone. Our mission is to help you make informed
            decisions about your food choices through advanced AI-powered food
            recognition and comprehensive nutritional analysis.
          </Text>
          <Text
            className="text-base leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            We believe that understanding what you eat is the first step towards
            a healthier lifestyle. With just a snap of your camera, you can
            instantly get detailed nutritional information about your meals.
          </Text>
        </View>

        {/* Features */}
        <View className="mb-8">
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Key Features
          </Text>
          {[
            "Instant food recognition using AI",
            "Comprehensive nutritional analysis",
            "Daily nutrition tracking",
            "Personalized recommendations",
            "Progress monitoring and statistics",
            "Dark/Light mode support",
          ].map((feature, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <View
                className="w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: colors.primary }}
              />
              <Text className="text-base flex-1" style={{ color: colors.text }}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Contact Info */}
        <View className="mb-8">
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Get in Touch
          </Text>
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="mail-outline" size={24} color={colors.primary} />
            <Text className="ml-4 text-base" style={{ color: colors.primary }}>
              snapnutrientapp@gmail.com
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons name="globe-outline" size={24} color={colors.primary} />
            <Text className="ml-4 text-base" style={{ color: colors.primary }}>
              www.snapnutrient.com
            </Text>
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View
          className="items-center py-8 border-t"
          style={{ borderTopColor: colors.surface }}
        >
          <Text
            className="text-sm text-center"
            style={{ color: colors.text, opacity: 0.6 }}
          >
            © 2025 SnapNutrient. All rights reserved.
          </Text>
          <Text
            className="text-sm text-center mt-2"
            style={{ color: colors.text, opacity: 0.6 }}
          >
            Made with ❤️ for healthier living
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
