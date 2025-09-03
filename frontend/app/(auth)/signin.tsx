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
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PolicyModal from "../components/SignInModal";
import Terms from "../pages/tabSetting/terms";
import Privacy from "../pages/tabSetting/privacy";

WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { colors, isDark } = useTheme();
  const { login } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
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

  const redirectUri = AuthSession.makeRedirectUri({
    native: "com.snapnutrient.app://",
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    redirectUri,
  });

  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();

      if (result?.type === "success" && result.params?.code) {
        console.log("Authorization code received, exchanging for tokens...");
        const { code } = result.params;

        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID!,
            redirectUri,
            code,
            extraParams: {
              code_verifier: request?.codeVerifier || "",
            },
          },
          {
            tokenEndpoint: "https://oauth2.googleapis.com/token",
          }
        );

        if (tokenResponse.idToken) {
          const credential = GoogleAuthProvider.credential(
            tokenResponse.idToken,
            tokenResponse.accessToken
          );
          const userCredential = await signInWithCredential(auth, credential);
          const firebaseUser = userCredential.user;

          // Extract user information
          const userData = {
            name: firebaseUser.displayName || undefined,
            email: firebaseUser.email || undefined,
            photoURL: firebaseUser.photoURL || undefined,
          };

          await login(userData);

          setTimeout(() => {
            try {
              router.push("/pages");
            } catch (error) {}
          }, 500);
        } else {
          Alert.alert(
            "Error",
            "Failed to get ID token from Google. Please check your Google Cloud Console configuration."
          );
        }
      } else {
        console.error("Google sign-in failed or was cancelled:", result);
        Alert.alert("Error", "Google Sign-In was cancelled or failed");
      }
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });

      let errorMessage = "Google Sign-In failed";
      if (error.message?.includes("invalid_grant")) {
        errorMessage = "Authorization failed. Please try again.";
      } else if (error.message?.includes("redirect_uri_mismatch")) {
        errorMessage = "Configuration error. Please contact support.";
      } else if (error.message?.includes("client_id")) {
        errorMessage =
          "Invalid client configuration. Please check your Google Cloud Console settings.";
      } else if (error.message?.includes("unauthorized_client")) {
        errorMessage =
          "Client not authorized. Please check your Google Cloud Console OAuth settings.";
      }

      Alert.alert("Error", errorMessage);
    }
  };

  const handleLogin = async () => {
    try {
      if (email && password) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const firebaseUser = userCredential.user;

        // Extract user information
        const userData = {
          name: firebaseUser.displayName || email.split("@")[0],
          email: firebaseUser.email || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        };

        login(userData);
        router.replace("/pages");
      } else {
        Alert.alert(
          "Missing Information",
          "Please enter both email and password to sign in."
        );
      }
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.code === "auth/invalid-credential") {
        errorMessage =
          "The email or password you entered is incorrect. Please check and try again.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage =
          "No account found with this email. Please check your email or sign up.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage =
          "The password you entered is incorrect. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage =
          "This account has been disabled. Please contact support.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Too many failed attempts. Please wait a moment and try again.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      Alert.alert("Sign In Failed", errorMessage);
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
            Sign In
          </Text>
          <Text
            className="text-center mb-6"
            style={{ color: colors.text, opacity: 0.6 }}
          >
            Enter your Email and Password to Sign in for this app
          </Text>

          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Remember Me & Forgot Password */}
          <View className="flex-row justify-between items-center mb-6">
            <Pressable
              className="flex-row items-center"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                className="w-5 h-5 mr-2 rounded border items-center justify-center"
                style={{
                  borderColor: colors.border,
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
                className="text-sm"
                style={{ color: colors.text, opacity: 0.6 }}
              >
                Remember me
              </Text>
            </Pressable>
            <Link href="/(auth)/forgot_pass" asChild>
              <Pressable>
                <Text
                  className="text-sm font-medium"
                  style={{ color: colors.secondary }}
                >
                  Forgot password?
                </Text>
              </Pressable>
            </Link>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={!agreed}
            className="py-4 rounded-lg items-center"
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
            <Text className="text-white font-semibold text-base">Sign In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View
              className="flex-1 h-[1px]"
              style={{ backgroundColor: colors.border }}
            />
            <Text className="mx-3" style={{ color: colors.text, opacity: 0.6 }}>
              or
            </Text>
            <View
              className="flex-1 h-[1px]"
              style={{ backgroundColor: colors.border }}
            />
          </View>

          {/* Google SignIn */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={!agreed}
            className="flex-row items-center justify-center rounded-lg py-3 mb-4"
            style={{
              backgroundColor: colors.surface,
              opacity: agreed ? 1 : 0.5,
              shadowColor: colors.text === "#FFFFFF" ? "#fff" : "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 1,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/google-logo.png",
              }}
              className="w-6 h-6 mr-3"
            />
            <Text style={{ color: colors.text, fontWeight: "500" }}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Apple SignIn */}
          <TouchableOpacity
            disabled={!agreed}
            className="flex-row items-center justify-center rounded-lg py-3 mb-2"
            style={{
              backgroundColor: colors.surface,
              opacity: agreed ? 1 : 0.5,
              shadowColor: colors.text === "#FFFFFF" ? "#fff" : "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 1,
              shadowRadius: 5,
              elevation: 5,
            }}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/50/mac-os.png",
              }}
              className="w-6 h-6 mr-3"
              style={{ tintColor: colors.text }}
            />
            <Text style={{ color: colors.text, fontWeight: "500" }}>
              Continue with Apple
            </Text>
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

          {/* Add this new section */}
          <View className="flex-row justify-center items-center">
            <Text style={{ color: colors.text }}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={{ color: colors.secondary, fontWeight: "600" }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Modals for Terms and Privacy Policy */}
          <PolicyModal visible={showTerms} onClose={() => setShowTerms(false)}>
            <Terms isModal />
          </PolicyModal>

          <PolicyModal
            visible={showPrivacy}
            onClose={() => setShowPrivacy(false)}
          >
            <Privacy isModal />
          </PolicyModal>
        </View>
      </View>
    </View>
  );
}
