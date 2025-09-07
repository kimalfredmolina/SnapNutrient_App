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
import { useTheme } from "../../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { sendEmail } from "@/services/emailService";
import Constants from "expo-constants";
import { Platform } from "react-native";

export default function Report() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const reportTypes = [
    { id: "bug", label: "Bug Report", icon: "bug-outline" },
    { id: "crash", label: "App Crash", icon: "warning-outline" },
    { id: "content", label: "Incorrect Food Data", icon: "nutrition-outline" },
    { id: "other", label: "Other", icon: "help-circle-outline" },
  ];

  const handleSubmit = async () => {
    if (!selectedType || !description.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all fields including your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      const reportTypeLabel = reportTypes.find(
        (type) => type.id === selectedType
      )?.label;

      const formattedMessage = `
      Report Type: ${reportTypeLabel}
      Description:
      ${description}

      Device Information:
      App Version: ${Constants.expoConfig?.version}
      Platform: ${Platform.OS}
      OS Version: ${Platform.Version}
      `;

      await sendEmail(
        email.split("@")[0], // Use first part of email as name
        email, // Use provided email
        "Problem Report",
        formattedMessage
      );

      Alert.alert(
        "Report Submitted",
        "Thank you for your feedback! We'll investigate this issue and get back to you if needed.",
        [{ text: "OK", onPress: () => router.push("..\\account") }]
      );

      // Clear form
      setSelectedType("");
      setDescription("");
      setEmail("");
    } catch (error) {
      Alert.alert("Error", "Failed to submit report. Please try again later.");
      console.error("Report submission error:", error);
    }
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
          onPress={() => router.push("..\\account")}
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

        {/* Email Input */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Your Email
          </Text>
          <Text
            className="text-sm mb-3"
            style={{ color: colors.text, opacity: 0.7 }}
          >
            We may need to contact you for additional information
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email address"
            placeholderTextColor={colors.text + "60"}
            keyboardType="email-address"
            autoCapitalize="none"
            className="border rounded-lg px-4 py-3 text-base"
            style={{
              borderColor: colors.surface,
              backgroundColor: colors.surface,
              color: colors.text,
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
            {"\n"}• We may contact you for additional details if needed
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="rounded-lg py-4 mb-4"
          style={{
            backgroundColor:
              selectedType && description.trim() && email.trim()
                ? colors.primary
                : colors.text + "40",
          }}
          disabled={!selectedType || !description.trim() || !email.trim()}
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
          <TouchableOpacity
            onPress={() => router.push("..\\tabSetting//contact")}
          >
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
