// frontend/app/pages/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Image, Animated } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../contexts/AuthContext";

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity is 1 (fully visible)

  useEffect(() => {
    const navigateAfterDelay = async () => {
      // Wait for 1.5 seconds before fading out
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Fade out duration
        useNativeDriver: true,
      }).start(async () => {
        const seenIntro = await AsyncStorage.getItem("seenIntro");

        if (isAuthenticated) {
          console.log("SplashScreen: User is authenticated, going to pages");
          router.replace("/pages");
        } else if (seenIntro === "true") {
          console.log("SplashScreen: User not authenticated, going to signin");
          router.replace("/(auth)/signin");
        } else {
          console.log("SplashScreen: First time user, going to intro");
          router.replace("/index");
        }
      });
    };

    navigateAfterDelay();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Animated.Image
        source={require("../assets/images/snp.png")}
        style={{
          width: 300,
          height: 300,
          opacity: fadeAnim,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
