import React, { useState } from "react";
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

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { colors, isDark } = useTheme();

  const handleLogin = () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    onLogin();
  };
  const handleSignUp = async () => {
    try {
      if (!username || !email || !password || !confirmPassword) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }

      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      // Navigate to signin
      router.replace("/(auth)/signin");
      Alert.alert("Success", "Account created successfully. Please sign in.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
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

          {/* Username */}
          <TextInput
            className="border rounded-md px-4 py-3 mb-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.text,
            }}
            placeholder="Username"
            placeholderTextColor={colors.text + "80"}
            value={username}
            onChangeText={setUsername}
          />

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
          <TextInput
            className="border rounded-md px-4 py-3 mb-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.text,
            }}
            placeholder="Password"
            placeholderTextColor={colors.text + "80"}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Confirm Password */}
          <TextInput
            className="border rounded-md px-4 py-3 mb-4"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.text,
            }}
            placeholder="Confirm Password"
            placeholderTextColor={colors.text + "80"}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
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
            <Text className="text-white font-semibold text-base">Sign Up</Text>
          </TouchableOpacity>

          {/* Terms & Privacy */}
          <View className="pb-4 mt-4">
            <Text
              className="text-xs text-center"
              style={{ color: colors.text, opacity: 0.6 }}
            >
              By clicking continue, you agree to our{" "}
              <Text style={{ color: colors.secondary }}>Terms of Service</Text>{" "}
              and{" "}
              <Text style={{ color: colors.secondary }}>Privacy Policy</Text>.
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
    </View>
  );
}
