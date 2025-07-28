import { useState, useEffect } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import "../global.css";
import Introduction from ".";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";

function RootContent() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="pages" />
      </Stack>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootContent />
    </ThemeProvider>
  );
}
