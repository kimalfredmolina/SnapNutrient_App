import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Link, router } from "expo-router";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import PolicyModal from "../components/SignInModal";
import Terms from "../pages/tabSetting/terms";
import Privacy from "../pages/tabSetting/privacy";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { colors, isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    checkAgreementStatus();
  }, []);

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const allRequirementsMet =
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  const checkAgreementStatus = async () => {
    try {
      const hasAgreed = await AsyncStorage.getItem("hasAgreedToTerms");
      if (hasAgreed === "true") {
        setAgreed(true);
      }
    } catch (error) {
      console.error("Error checking agreement status:", error);
    }
  };

  const handleAgreementChange = async (value: boolean) => {
    try {
      setAgreed(value);
      await AsyncStorage.setItem("hasAgreedToTerms", value.toString());
    } catch (error) {
      console.error("Error saving agreement status:", error);
    }
  };

  const handleSignUp = async () => {
    try {
      if (!email || !password || !confirmPassword) {
        Alert.alert("Missing Information", "Please fill in all fields.", [{ text: "OK" }]);
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Password Mismatch", "Passwords do not match.", [{ text: "OK" }]);
        return;
      }

      if (!allRequirementsMet) {
        Alert.alert("Weak Password", "Password does not meet all requirements.", [{ text: "OK" }]);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.", [{ text: "OK" }]);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential?.user) {
        Alert.alert("Account Created", "Your account has been created successfully!", [
          { text: "OK", onPress: () => router.replace("/(auth)/signin") },
        ]);
      }
    } catch (error: any) {
      let errorMessage = "An error occurred during signup.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Please choose a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is not valid.";
      }

      Alert.alert("Sign Up Error", errorMessage, [{ text: "OK" }]);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.primary }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.primary}
      />

      {/* Background Header */}
      <View className="absolute top-10 left-0 right-0 z-0">
        <SafeAreaView>
          <View className="items-center pt-8 pb-20">
            <Image
              source={require("../../assets/images/snp.png")}
              className="w-[290px] h-[100px]"
              resizeMode="cover"
            />
          </View>
        </SafeAreaView>
      </View>

      {/* Form Container */}
      <View className="flex-1 justify-end mt-[180px]">
        <View
          className="rounded-t-3xl px-8 pt-8 pb-4 flex-1"
          style={{ backgroundColor: colors.background }}
        >
          <Text className="text-2xl font-semibold text-center mb-2" style={{ color: colors.text }}>
            Sign Up
          </Text>
          <Text className="text-center mb-6" style={{ color: colors.text, opacity: 0.6 }}>
            Enter your credentials to Sign Up
          </Text>

          {/* Email */}
          <TextInput
            className="border rounded-md px-4 py-3 mb-4"
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

          {/* Password */}
          <View
            className="border rounded-md px-4 py-0 mb-4 flex-row items-center"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <TextInput
              className="flex-1 pr-2"
              placeholder="Password"
              placeholderTextColor={colors.text + "80"}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={{ color: colors.text }}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={colors.text} />
            </Pressable>
          </View>

          {/* Confirm Password */}
          <View
            className="border rounded-md px-4 py-0 mb-4 flex-row items-center"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <TextInput
              className="flex-1 py-3 pr-2"
              placeholder="Confirm Password"
              placeholderTextColor={colors.text + "80"}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={{ color: colors.text }}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color={colors.text}
              />
            </Pressable>
          </View>

          {/* ✅ Password Requirements */}
          <View className="mb-6">
            <Text className="text-base font-medium mb-3" style={{ color: colors.text }}>
              Password Requirements:
            </Text>
            {[
              { label: "At least 8 characters long", valid: hasMinLength },
              { label: "Contains uppercase and lowercase letters", valid: hasUppercase && hasLowercase },
              { label: "Contains at least one number", valid: hasNumber },
              { label: "Contains at least one special character", valid: hasSpecialChar },
            ].map((req, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <Ionicons
                  name={req.valid ? "checkmark-circle" : "ellipse-outline"}
                  size={16}
                  color={req.valid ? "#10B981" : colors.text + "60"}
                />
                <Text
                  className="ml-2 text-sm"
                  style={{
                    color: req.valid ? "#10B981" : colors.text + "80",
                  }}
                >
                  {req.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={!agreed || !allRequirementsMet}
            className="py-4 rounded-lg items-center mb-4"
            style={{
              backgroundColor: colors.accent,
              opacity: agreed && allRequirementsMet ? 1 : 0.5,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text className="text-white font-semibold text-base">Sign Up</Text>
          </TouchableOpacity>

          {/* Terms & Privacy with Checkbox */}
          <View className="pb-4 mt-1 mx-auto flex-row items-center">
            <Pressable onPress={() => handleAgreementChange(!agreed)} className="flex-row items-center mr-2">
              <View
                className="w-5 h-5 mr-2 rounded border items-center justify-center"
                style={{
                  borderColor: colors.border,
                  backgroundColor: agreed ? colors.primary : colors.background,
                }}
              >
                {agreed && <Ionicons name="checkmark" size={14} color={isDark ? "#000" : "#fff"} />}
              </View>
            </Pressable>
            <Text style={{ color: colors.text, fontSize: 12 }}>
              I agree to the{" "}
              <Text style={{ color: colors.secondary }} onPress={() => setShowTerms(true)}>
                Terms
              </Text>{" "}
              and{" "}
              <Text style={{ color: colors.secondary }} onPress={() => setShowPrivacy(true)}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Already have an account */}
          <View className="flex-row justify-center items-center mt-1">
            <Text style={{ color: colors.text }}>Already have an account? </Text>
            <Link href="/(auth)/signin" asChild>
              <TouchableOpacity>
                <Text style={{ color: colors.secondary, fontWeight: "600" }}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      <PolicyModal visible={showTerms} onClose={() => setShowTerms(false)}>
        <Terms isModal />
      </PolicyModal>
      <PolicyModal visible={showPrivacy} onClose={() => setShowPrivacy(false)}>
        <Privacy isModal />
      </PolicyModal>
    </View>
  );
}
