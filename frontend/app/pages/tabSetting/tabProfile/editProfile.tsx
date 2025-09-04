import React from "react";
import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Alert } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../../../contexts/ThemeContext";
import { useAuth } from "../../../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context"

export default function EditProfile() {
  const router = useRouter()
  const { colors } = useTheme()
  const { user } = useAuth()

  const [name, setName] = useState(user?.name || "Loading...")
  const [email, setEmail] = useState(user?.email || "Loading...")
  const [phone, setPhone] = useState("Loading...")
  const [bio, setBio] = useState("Health enthusiast and nutrition tracker")
  const [height, setHeight] = useState("Loading...")
  const [weight, setWeight] = useState("Loading...")
  const [age, setAge] = useState("Loading...")
  const [gender, setGender] = useState("Loading...")

  const handleSave = () => {
    Alert.alert("Profile Updated", "Your profile has been successfully updated!", [
      { text: "OK", onPress: () => router.back() },
    ])
  }

  const handleChangePhoto = () => {
    Alert.alert("Change Photo", "Choose an option", [
      { text: "Camera", onPress: () => console.log("Camera selected") },
      { text: "Gallery", onPress: () => console.log("Gallery selected") },
      { text: "Cancel", style: "cancel" },
    ])
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flexGrow: 1,
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 24,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderBottomColor: colors.surface }}>
        <TouchableOpacity onPress={() => router.push("..\\settings")} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1" style={{ color: colors.text }}>
          Edit Profile
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text className="text-base font-semibold" style={{ color: colors.primary }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 py-6 " showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View className="items-center mb-8">
            <View className="relative">
            <Image
              source={
              user?.photoURL
                ? { uri: user.photoURL }
                : require("../../../../assets/images/icon.png")
              }
              className="w-24 h-24 rounded-full"
              style={{ borderWidth: 3, borderColor: colors.primary }}
            />
            <TouchableOpacity
              onPress={handleChangePhoto}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
            </View>
          <TouchableOpacity onPress={handleChangePhoto} className="mt-3">
            <Text className="text-base font-medium" style={{ color: colors.primary }}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Personal Information
          </Text>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
              Full Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.text + "60"}
              className="border rounded-lg px-4 py-3 text-base"
              style={{
                borderColor: colors.surface,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.text + "60"}
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

          <View className="mb-4">
            <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
              Phone Number
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.text + "60"}
              keyboardType="phone-pad"
              className="border rounded-lg px-4 py-3 text-base"
              style={{
                borderColor: colors.surface,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
            />
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
              Bio
            </Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              placeholderTextColor={colors.text + "60"}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="border rounded-lg px-4 py-3 text-base"
              style={{
                borderColor: colors.surface,
                backgroundColor: colors.surface,
                color: colors.text,
                minHeight: 80,
              }}
            />
          </View>
        </View>

        {/* Health Information */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Health Information
          </Text>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
                Height (cm)
              </Text>
              <TextInput
                value={height}
                onChangeText={setHeight}
                placeholder="175"
                placeholderTextColor={colors.text + "60"}
                keyboardType="numeric"
                className="border rounded-lg px-4 py-3 text-base"
                style={{
                  borderColor: colors.surface,
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
                Weight (kg)
              </Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                placeholder="70"
                placeholderTextColor={colors.text + "60"}
                keyboardType="numeric"
                className="border rounded-lg px-4 py-3 text-base"
                style={{
                  borderColor: colors.surface,
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              />
            </View>
          </View>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
                Age
              </Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                placeholder="28"
                placeholderTextColor={colors.text + "60"}
                keyboardType="numeric"
                className="border rounded-lg px-4 py-3 text-base"
                style={{
                  borderColor: colors.surface,
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
                Gender
              </Text>
              <TouchableOpacity
                className="border rounded-lg px-4 py-3 flex-row items-center justify-between"
                style={{
                  borderColor: colors.surface,
                  backgroundColor: colors.surface,
                }}
                onPress={() => {
                  Alert.alert("Select Gender", "", [
                    { text: "Male", onPress: () => setGender("Male") },
                    { text: "Female", onPress: () => setGender("Female") },
                    { text: "Other", onPress: () => setGender("Other") },
                    { text: "Cancel", style: "cancel" },
                  ])
                }}
              >
                <Text className="text-base" style={{ color: colors.text }}>
                  {gender}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="rounded-lg py-4 mb-8"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-center text-lg font-semibold text-white">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
