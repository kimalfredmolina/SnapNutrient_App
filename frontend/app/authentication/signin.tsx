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
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { colors, isDark } = useTheme();

  const handleLogin = () => {
    if (email && password) {
      onLogin();
    } else {
      alert("Enter your email and password.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.primary}
      />

      {/* Background Header */}
      <View
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          zIndex: 0,
        }}
      >
        <SafeAreaView>
          <View
            style={{ alignItems: "center", paddingTop: 32, paddingBottom: 80 }}
          >
            {/* Logo Container */}
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
                style={{
                  width: 290,
                  height: 100,
                  resizeMode: "cover",
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* Form Container */}
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 32,
            paddingTop: 32,
            paddingBottom: 0,
            flex: 1,
            marginTop: 224,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.text,
                fontSize: 24,
                fontWeight: "600",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Sign In
            </Text>
            <Text
              style={{
                color: colors.text,
                opacity: 0.6,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Enter your Email and Password to Sign in for this app
            </Text>

            {/* Email Input */}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 16,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
              placeholder="Email@domain.com"
              placeholderTextColor={colors.text + "80"}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password Input */}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginBottom: 16,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
              placeholder="Password"
              placeholderTextColor={colors.text + "80"}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Remember Me & Forgot Password */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Pressable
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 8,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: rememberMe
                      ? colors.primary
                      : colors.background,
                  }}
                >
                  {rememberMe && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={isDark ? "#000" : "#fff"}
                    />
                  )}
                </View>
                <Text
                  style={{ color: colors.text, opacity: 0.6, fontSize: 14 }}
                >
                  Remember me
                </Text>
              </Pressable>
              <Pressable>
                <Text
                  style={{
                    color: colors.secondary,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                backgroundColor: colors.accent,
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
                marginBottom: 16,
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  color: "#FFFFFF",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 16,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: colors.border }}
              />
              <Text
                style={{
                  marginHorizontal: 12,
                  color: colors.text,
                  opacity: 0.6,
                }}
              >
                or
              </Text>
              <View
                style={{ flex: 1, height: 1, backgroundColor: colors.border }}
              />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
                paddingVertical: 12,
                borderRadius: 8,
                marginBottom: 12,
                backgroundColor: colors.surface,
                shadowColor: isDark ? "#fff" : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/color/48/google-logo.png",
                }}
                style={{ width: 24, height: 24, marginRight: 12 }}
              />
              <Text style={{ color: colors.text, fontWeight: "500" }}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
                paddingVertical: 12,
                borderRadius: 8,
                marginBottom: 24,
                backgroundColor: colors.surface,
                shadowColor: isDark ? "#fff" : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Image
                source={{
                  uri: "https://img.icons8.com/ios-filled/50/mac-os.png",
                }}
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 12,
                  tintColor: colors.text,
                }}
              />
              <Text style={{ color: colors.text, fontWeight: "500" }}>
                Continue with Apple
              </Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            {/* Terms and Privacy */}
            <View style={{ paddingBottom: 32 }}>
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  color: colors.text,
                  opacity: 0.6,
                }}
              >
                By clicking continue, you agree to our{" "}
                <Text style={{ color: colors.secondary }}>
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text style={{ color: colors.secondary }}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
