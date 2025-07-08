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
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      onLogin();
    } else {
      alert("Enter your email and password.");
    }
  };

  return (
    <View className="flex-1 bg-[#04afbb]">
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Background Header - stays behind the form */}
      <View className="absolute top-10 left-0 right-0 z-0">
        <SafeAreaView>
          <View className="items-center pt-8 pb-20">
            {/* Logo Container - Transparent with much larger image */}
            <View className="bg-transparent mb-4">
              <Image
                source={require("../../assets/images/snp.png")} // Fixed file extension
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

      {/* Form Container - fills bottom with rounded top */}
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-3xl px-8 pt-8 pb-0 flex-1 mt-56">
          <View className="flex-1">
            <Text className="text-3xl font-semibold text-center mb-2">
              Sign In
            </Text>
            <Text className="text-center text-gray-500 mb-6">
              Enter your Email and Password to Sign in for this app
            </Text>
            {/* Email Input */}
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password Input */}
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Remember Me & Forgot Password */}
            <View className="flex-row justify-between items-center mb-6">
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

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              className="bg-black py-4 rounded-lg items-center mb-4"
            >
              <Text className="text-white font-semibold text-lg">Sign In</Text>
            </TouchableOpacity>


            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-3 text-gray-500">or</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity className="flex-row items-center justify-center border border-gray-300 py-3 rounded-lg mb-3">
              <Image
                source={{
                  uri: "https://img.icons8.com/color/48/google-logo.png",
                }}
                className="w-6 h-6 mr-3"
              />
              <Text className="font-medium">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-center border border-gray-300 py-3 rounded-lg mb-6">
              <Image
                source={{
                  uri: "https://img.icons8.com/ios-filled/50/mac-os.png",
                }}
                className="w-6 h-6 mr-3"
              />
              <Text className="font-medium">Continue with Apple</Text>
            </TouchableOpacity>

            <View className="flex-1" />

            <View className="pb-8">
              <Text className="text-xs text-center text-gray-400">
                By clicking continue, you agree to our{" "}
                <Text className="text-blue-600">Terms of Service</Text> and{" "}
                <Text className="text-blue-600">Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
