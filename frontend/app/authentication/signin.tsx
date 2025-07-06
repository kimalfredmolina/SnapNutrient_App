import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      onLogin();
    } else {
      alert("Enter your email and password.");
    }
  };

  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View className="flex-1 bg-white">
      {/* Header Card with Image */}
      <View className="items-center bg-[#6C63FF] rounded-b-3xl pb-6 pt-12">
        <View className="bg-white p-4 rounded-2xl mb-3">
          <Image
            source={require("../../assets/images/bannerlogo.jpg")}
            style={{ width: 60, height: 60, resizeMode: "contain" }}
          />
        </View>
      </View>

      {/* Form Section */}
      <View className="px-8 mt-6 space-y-4">
        <Text className="text-4xl font-semibold text-center mt-16 mb-2">
          Sign In
        </Text>
        <Text className="text-center text-gray-500 mb-2">
          Enter your Email and Password to Sign in for this app
        </Text>

        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3"
          placeholder="Email@domain.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 mt-2"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Links */}
        <View className="flex-row justify-between items-center mt-2 mb-4">
          <Pressable
            className="flex-row items-center"
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              className={`w-5 h-5 mr-2 rounded border border-gray-400 items-center justify-center ${
                rememberMe ? "bg-[#6C63FF]" : "bg-white"
              }`}
            >
              {rememberMe && (
                <Ionicons name="checkmark" size={14} color="white" />
              )}
            </View>
            <Text className="text-sm text-gray-500">Remember me</Text>
          </Pressable>

          <Pressable>
            <Text className="text-sm text-[#6C63FF] font-medium">
              Forgot password?
            </Text>
          </Pressable>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-black py-5 rounded-lg items-center mt-2"
        >
          <Text className="text-white font-semibold">Sign In</Text>
        </TouchableOpacity>

        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-3 text-gray-500">or</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Social Logins */}
        <TouchableOpacity className="flex-row items-center justify-center border py-3 rounded-lg mt-2">
          <Image
            source={{ uri: "https://img.icons8.com/color/48/google-logo.png" }}
            className="w-6 h-6 mr-3"
          />
          <Text className="font-medium">Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center border py-3 rounded-lg mt-2">
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/50/mac-os.png" }}
            className="w-6 h-6 mr-3"
          />
          <Text className="font-medium">Continue with Apple</Text>
        </TouchableOpacity>

        <Text className="text-xs text-center text-gray-400 mt-32">
          By clicking continue, you agree to our{" "}
          <Text className="text-blue-600">Terms of Service</Text> and{" "}
          <Text className="text-blue-600">Privacy Policy</Text>.
        </Text>
      </View>
    </View>
  );
}
