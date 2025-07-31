// frontend/app/pages/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Image, Animated } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const router = useRouter();
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

        if (seenIntro === "true") {
          router.replace("/(auth)/signin");
        } else {
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
