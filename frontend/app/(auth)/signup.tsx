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
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Link, router } from "expo-router";
import { auth, db } from "../../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PolicyModal from "../components/SignInModal";
import Terms from "../pages/tabSetting/terms";
import Privacy from "../pages/tabSetting/privacy";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { colors, isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    checkAgreementStatus();
  }, []);

  // Function for checking agreement status
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

  // Function for handling agreement changes
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
        Alert.alert(
          "Missing Information",
          "Please fill in all fields to create your account.",
          [{ text: "OK" }]
        );
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert(
          "Password Mismatch",
          "The passwords you entered do not match. Please try again.",
          [{ text: "OK" }]
        );
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email address.", [
          { text: "OK" },
        ]);
        return;
      }

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential?.user) {
        Alert.alert(
          "Account Created",
          "Your account has been created successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/(auth)/signin");
              },
            },
          ]
        );
      }
    } catch (error: any) {
      let errorMessage = "An error occurred during signup.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please use a different email or sign in.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Please choose a stronger password (at least 6 characters).";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "The email address is not valid.";
      }

      console.error("Signup Error:", error);
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
            <View
              style={{
                backgroundColor: "transparent",
                marginBottom: 16,
                shadowColor: isDark ? "#fff" : "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 15,
              }}
            >
              <Image
                source={require("../../assets/images/snp.png")}
                className="w-[290px] h-[100px]"
                resizeMode="cover"
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Form Container */}
      <View className="flex-1 justify-end mt-[224px]">
        <View
          className="rounded-t-3xl px-8 pt-8 pb-4 flex-1"
          style={{ backgroundColor: colors.background }}
        >
          <Text
            className="text-2xl font-semibold text-center mb-2"
            style={{ color: colors.text }}
          >
            Sign Up
          </Text>
          <Text
            className="text-center mb-6"
            style={{ color: colors.text, opacity: 0.6 }}
          >
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
            <Pressable onPress={togglePasswordVisibility}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={colors.text}
              />
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
            <Pressable onPress={toggleConfirmPasswordVisibility}>
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color={colors.text}
              />
            </Pressable>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={!agreed}
            className="py-4 rounded-lg items-center mb-4"
            style={{
              backgroundColor: colors.accent,
              opacity: agreed ? 1 : 0.5,
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
          <View className="pb-4 mt-4 mx-auto flex-row items-center">
            {/* Checkbox */}
            <Pressable
              onPress={() => handleAgreementChange(!agreed)}
              className="flex-row items-center mr-2"
            >
              <View
                className="w-5 h-5 mr-2 rounded border items-center justify-center"
                style={{
                  borderColor: colors.border,
                  backgroundColor: agreed ? colors.primary : colors.background,
                }}
              >
                {agreed && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={isDark ? "#000" : "#fff"}
                  />
                )}
              </View>
            </Pressable>

            {/* Text with links */}
            <Text style={{ color: colors.text, fontSize: 12 }}>
              I agree to the{" "}
              <Text
                style={{ color: colors.secondary }}
                onPress={() => setShowTerms(true)}
              >
                Terms
              </Text>{" "}
              and{" "}
              <Text
                style={{ color: colors.secondary }}
                onPress={() => setShowPrivacy(true)}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Already have an account */}
          <View className="flex-row justify-center items-center mt-4">
            <Text style={{ color: colors.text }}>
              Already have an account?{" "}
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

      <PolicyModal visible={showTerms} onClose={() => setShowTerms(false)}>
        <Terms isModal />
      </PolicyModal>

      <PolicyModal visible={showPrivacy} onClose={() => setShowPrivacy(false)}>
        <Privacy isModal />
      </PolicyModal>
    </View>
  );
}
