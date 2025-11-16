import React, { useState, memo } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../../../config/firebase";
import { 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from "firebase/auth";

const PasswordInput = memo(
  ({
    label,
    value,
    onChangeText,
    placeholder,
    showPassword,
    toggleShowPassword,
    colors,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    showPassword: boolean;
    toggleShowPassword: () => void;
    colors: any;
  }) => (
    <View className="mb-4">
      <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
        {label}
      </Text>
      <View className="relative">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text + "60"}
          secureTextEntry={!showPassword}
          className="border rounded-lg px-4 py-3 pr-12 text-base"
          style={{
            borderColor: colors.surface,
            backgroundColor: colors.surface,
            color: colors.text,
          }}
        />
        <TouchableOpacity 
          onPress={toggleShowPassword} 
          className="absolute right-4 top-3"
          activeOpacity={0.7}
        >
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color={colors.text + "80"} />
        </TouchableOpacity>
      </View>
    </View>
  )
);

export default function ChangePassword() {
  const router = useRouter();
  const { colors } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      Alert.alert("Error", "Password does not meet all requirements");
      return;
    }

    setIsLoading(true);

    try {
      const user = auth.currentUser;
      
      if (!user || !user.email) {
        Alert.alert("Error", "No user is currently signed in");
        setIsLoading(false);
        return;
      }

      // Create credential with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      Alert.alert(
        "Password Changed",
        "Your password has been successfully updated!",
        [{ text: "OK", onPress: () => router.push("..\\settings") }]
      );
    } catch (error: any) {
      let errorMessage = "Failed to change password.";
      
      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "The new password is too weak.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please sign out and sign in again before changing your password.";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Current password is incorrect.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }
      
      Alert.alert("Error", errorMessage);
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ 
        backgroundColor: colors.background,
        flexGrow: 1,
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 24,
     }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderBottomColor: colors.surface }}>
        <TouchableOpacity onPress={() => router.push("..\\settings")} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          Change Password
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Security Info */}
        <View className="mb-6 p-4 rounded-lg flex-row" style={{ backgroundColor: colors.primary + "15" }}>
          <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
          <View className="ml-3 flex-1">
            <Text className="text-base font-medium mb-1" style={{ color: colors.text }}>
              Keep your account secure
            </Text>
            <Text className="text-sm" style={{ color: colors.text, opacity: 0.7 }}>
              Use a strong password with at least 8 characters, including letters, numbers, and symbols.
            </Text>
          </View>
        </View>

        {/* Password Fields */}
        <PasswordInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Enter your current password"
          showPassword={showCurrentPassword}
          toggleShowPassword={() => setShowCurrentPassword(!showCurrentPassword)}
          colors={colors}
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter your new password"
          showPassword={showNewPassword}
          toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
          colors={colors}
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your new password"
          showPassword={showConfirmPassword}
          toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          colors={colors}
        />

        {/* Password Requirements */}
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

        {/* Change Password Button */}
        <TouchableOpacity
          onPress={handleChangePassword}
          className="rounded-lg py-4 mb-4"
          style={{
            backgroundColor: 
              currentPassword && newPassword && confirmPassword && !isLoading
                ? colors.primary 
                : colors.text + "40",
          }}
          disabled={!currentPassword || !newPassword || !confirmPassword || isLoading}
        >
          <Text className="text-center text-lg font-semibold text-white">
            {isLoading ? "Changing Password..." : "Change Password"}
          </Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity 
          className="items-center py-4"
          onPress={() => router.push("/(auth)/forgotpassword")}
        >
          <Text className="text-base" style={{ color: colors.primary }}>
            Forgot your current password?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}