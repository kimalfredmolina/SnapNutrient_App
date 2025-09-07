import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import axios from "axios";
import { sendEmail } from "@/services/emailService";

export default function Contact() {
  const router = useRouter();
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !subject || !message) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await sendEmail(name, email, subject, message);
      Alert.alert(
        "Message Sent",
        "Thank you for contacting us! We'll get back to you soon.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Please try again later.");
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 60,
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
          Contact Us
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Contact Info */}
        <View className="mb-8">
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Get in Touch
          </Text>
          <Text
            className="text-base mb-6 leading-6"
            style={{ color: colors.text, opacity: 0.8 }}
          >
            We'd love to hear from you! Send us a message and we'll respond as
            soon as possible.
          </Text>
        </View>

        {/* Contact Form */}
        <View className="mb-8">
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Send us a Message
          </Text>

          {/* Name */}
          <View className="mb-4">
            <Text
              className="text-base font-medium mb-2"
              style={{ color: colors.text }}
            >
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor={colors.text + "80"}
              className="border rounded-lg px-4 py-3 text-base"
              style={{
                borderColor: colors.surface,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
            />
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text
              className="text-base font-medium mb-2"
              style={{ color: colors.text }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.text + "80"}
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

          {/* Subject */}
          <View className="mb-4">
            <Text
              className="text-base font-medium mb-2"
              style={{ color: colors.text }}
            >
              Subject
            </Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="What's this about?"
              placeholderTextColor={colors.text + "80"}
              className="border rounded-lg px-4 py-3 text-base"
              style={{
                borderColor: colors.surface,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
            />
          </View>

          {/* Message */}
          <View className="mb-6">
            <Text
              className="text-base font-medium mb-2"
              style={{ color: colors.text }}
            >
              Message
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Tell us more about your inquiry..."
              placeholderTextColor={colors.text + "80"}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="border rounded-lg px-4 py-3 text-base"
              style={{
                borderColor: colors.surface,
                backgroundColor: colors.surface,
                color: colors.text,
                minHeight: 120,
              }}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="rounded-lg py-4"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-center text-lg font-semibold text-white">
              Send Message
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
