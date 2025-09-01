import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Link, router } from "expo-router";
import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { colors, isDark } = useTheme();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return;
    }

    try {
      const actionCodeSettings = {
        // Redirect URL after password reset
        url: "https://snap-nutrient-app.firebaseapp.com/reset-success",
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);

      Alert.alert(
        "Reset Link Sent",
        "Please check your email (including your Spam or Junk folder) to reset your password.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/signin") }]
      );
    } catch (error: any) {
      let errorMessage = "Failed to send reset link.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.primary }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.primary}
      />

      {/* Header Logo */}
      <View className="absolute top-10 left-0 right-0 z-0">
        <SafeAreaView>
          <View className="items-center pt-8 pb-20">
            <Image
              source={require("../../assets/images/snp.png")}
              className="w-[290px] h-[100px]"
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </View>

      {/* Form */}
      <View className="flex-1 justify-end mt-[224px]">
        <View
          className="rounded-t-3xl px-8 pt-8 pb-4 flex-1"
          style={{ backgroundColor: colors.background }}
        >
          <Text
            className="text-2xl font-semibold text-center mb-2"
            style={{ color: colors.text }}
          >
            Forgot Password
          </Text>
          <Text
            className="text-center mb-6"
            style={{ color: colors.text, opacity: 0.6 }}
          >
            Enter your email to receive a reset link
          </Text>

          {/* Email Input */}
          <TextInput
            className="border rounded-md px-4 py-3 mb-6"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.text,
            }}
            placeholder="Email@domain.com"
            placeholderTextColor={colors.text + "80"}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleResetPassword}
            className="py-4 rounded-lg items-center mb-4"
            style={{
              backgroundColor: colors.accent,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="font-semibold text-base" style={{ color: "#fff" }}>
              Send Reset Link
            </Text>
          </TouchableOpacity>

          {/* Back to Sign In */}
          <View className="flex-row justify-center items-center mt-4">
            <Text style={{ color: colors.text }}>
              Remembered your password?{" "}
            </Text>
            <Link href="/(auth)/signin" asChild>
              <TouchableOpacity>
                <Text style={{ color: colors.secondary, fontWeight: "600" }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}
