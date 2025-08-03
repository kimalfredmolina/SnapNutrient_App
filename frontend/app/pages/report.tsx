import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function Report() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");

  const reportTypes = [
    { id: "bug", label: "Bug Report", icon: "bug-outline" },
    { id: "crash", label: "App Crash", icon: "warning-outline" },
    { id: "feature", label: "Feature Request", icon: "bulb-outline" },
    { id: "content", label: "Incorrect Food Data", icon: "nutrition-outline" },
    { id: "other", label: "Other", icon: "help-circle-outline" },
  ];

  const handleSubmit = () => {
    if (!selectedType || !description.trim()) {
      Alert.alert(
        "Error",
        "Please select a report type and provide a description"
      );
      return;
    }

    Alert.alert(
      "Report Submitted",
      "Thank you for your feedback! We'll investigate this issue and get back to you if needed.",
      [{ text: "OK", onPress: () => router.push("../pages/account") }]
    );
  };

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
          onPress={() => router.push("../pages/account")}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          Report a Problem
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <Text
          className="text-base mb-6 leading-6"
          style={{ color: colors.text, opacity: 0.8 }}
        >
          Help us improve SnapNutrients by reporting any issues you encounter.
          Your feedback is valuable to us!
        </Text>

        {/* Report Type Selection */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            What type of issue are you reporting?
          </Text>

          {reportTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              onPress={() => setSelectedType(type.id)}
              className="flex-row items-center py-4 border-b"
              style={{ borderBottomColor: colors.surface }}
            >
              <View
                className="w-6 h-6 rounded-full border-2 mr-4 items-center justify-center"
                style={{
                  borderColor:
                    selectedType === type.id
                      ? colors.primary
                      : colors.text + "40",
                  backgroundColor:
                    selectedType === type.id ? colors.primary : "transparent",
                }}
              >
                {selectedType === type.id && (
                  <View className="w-3 h-3 rounded-full bg-white" />
                )}
              </View>
              <Ionicons
                name={type.icon as any}
                size={24}
                color={selectedType === type.id ? colors.primary : colors.text}
              />
              <Text
                className="ml-4 text-base flex-1"
                style={{
                  color:
                    selectedType === type.id ? colors.primary : colors.text,
                  fontWeight: selectedType === type.id ? "600" : "400",
                }}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Describe the issue
          </Text>
          <Text
            className="text-sm mb-3"
            style={{ color: colors.text, opacity: 0.7 }}
          >
            Please provide as much detail as possible, including steps to
            reproduce the issue.
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what happened, when it occurred, and any steps that led to the issue..."
            placeholderTextColor={colors.text + "60"}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
            className="border rounded-lg px-4 py-3 text-base"
            style={{
              borderColor: colors.surface,
              backgroundColor: colors.surface,
              color: colors.text,
              minHeight: 150,
            }}
          />
        </View>

        {/* Additional Info */}
        <View
          className="mb-8 p-4 rounded-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <Text
            className="text-base font-medium mb-2"
            style={{ color: colors.text }}
          >
            Additional Information
          </Text>
          <Text
            className="text-sm leading-5"
            style={{ color: colors.text, opacity: 0.7 }}
          >
            • Device information and app version will be automatically included
            {"\n"}• Screenshots can help us understand the issue better{"\n"}•
            We may contact you for additional details if needed
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="rounded-lg py-4 mb-4"
          style={{
            backgroundColor:
              selectedType && description.trim()
                ? colors.primary
                : colors.text + "40",
          }}
          disabled={!selectedType || !description.trim()}
        >
          <Text className="text-center text-lg font-semibold text-white">
            Submit Report
          </Text>
        </TouchableOpacity>

        {/* Contact Alternative */}
        <View className="items-center py-4">
          <Text
            className="text-sm text-center mb-2"
            style={{ color: colors.text, opacity: 0.7 }}
          >
            Need immediate assistance?
          </Text>
          <TouchableOpacity onPress={() => router.push("/account/contact")}>
            <Text
              className="text-base font-medium mb-8"
              style={{ color: colors.primary }}
            >
              Contact Support Directly
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
