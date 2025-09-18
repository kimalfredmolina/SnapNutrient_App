import { useEffect } from "react";
import { BackHandler, Alert } from "react-native";
import { router, usePathname } from "expo-router";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import "../global.css";
import Introduction from ".";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
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
  const currentPath = usePathname();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // If on an auth screen, exit the app
        if (currentPath.includes("/(auth)")) {
          if (currentPath === "/(auth)/signin") {
            Alert.alert("Exit App", "Are you sure you want to exit?", [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel",
              },
              { text: "YES", onPress: () => BackHandler.exitApp() },
            ]);
            return true;
          }
          return false;
        }

        if (
          currentPath === "/" ||
          currentPath === "/pages" ||
          currentPath === "/pages/index"
        ) {
          Alert.alert("Exit App", "Are you sure you want to exit?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "YES", onPress: () => BackHandler.exitApp() },
          ]);
          return true;
        }

        // For all other screens, go back
        if (router.canGoBack()) {
          router.back();
          return true;
        }

        return false;
      }
    );

    return () => backHandler.remove();
  }, [currentPath]);

  return (
    <ThemeProvider>
      <RootContent />
    </ThemeProvider>
  );
}
