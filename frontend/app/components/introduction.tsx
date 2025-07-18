import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import LottieView from "lottie-react-native";
import { useRef, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";

type IntroductionProps = {
  onGetStarted: () => Promise<void>;
};

const { width, height } = Dimensions.get("window");

export default function Introduction({ onGetStarted }: IntroductionProps) {
  const { colors, isDark } = useTheme();
  const animationRef = useRef<LottieView>(null);
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const playWithInterval = () => {
      animationRef.current?.play();
      setTimeout(() => {
        animationRef.current?.reset();
        playWithInterval();
      }, 10000);
    };

    playWithInterval();

    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 13000,
        useNativeDriver: true,
      })
    ).start();

    return () => {
      animationRef.current?.reset();
    };
  }, []);

  const rotateStyle = {
    transform: [
      {
        rotate: rotateValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        }),
      },
    ],
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Rotating Background */}
      <Animated.Image
        source={{
          uri: "https://healthyfitnessmeals.com/wp-content/uploads/2022/09/Chicken-adobo-recipe-5.jpg",
        }}
        style={[
          {
            position: "absolute",
            width: width * 2.5,
            height: height * 2.5,
            left: -width * 0.75,
            top: -height * 0.75,
            opacity: isDark ? 0.3 : 0.8,
          },
          rotateStyle,
        ]}
        resizeMode="cover"
      />

      {/* Overlay */}
      <View
        style={{
          flex: 1,
          backgroundColor: isDark
            ? "rgba(0, 0, 0, 0.7)"
            : "rgba(255, 255, 255, 0.7)",
        }}
      >
        <View className="flex-1 justify-center items-center px-8">
          {/* Lottie Animation */}
          <View className="mb-8 w-[300px] h-[300px] overflow-hidden">
            <LottieView
              ref={animationRef}
              source={{
                uri: "https://cdn.lottielab.com/l/4Y3j1JUd8888CJ.json",
              }}
              autoPlay={false}
              loop={false}
              speed={0.9}
              style={{
                width: 200,
                height: 200,
                transform: [{ scale: 3.5 }],
                marginLeft: 40,
                marginTop: 100,
              }}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Message */}
          <View className="items-center mb-12 flex-1">
            <Text
              className="text-4xl font-bold text-center mb-8"
              style={{ color: colors.text }}
            >
              Welcome to{"\n"}
              <Text style={{ color: colors.primary }}>SnapNutrient!</Text>
            </Text>

            <Text
              className="text-lg text-center leading-6 px-4 opacity-80"
              style={{ color: colors.text }}
            >
              Track your food easily with smart nutrition insights. Start your
              healthy journey today.
            </Text>
          </View>

          {/* Feature Highlights */}
          <View className="mb-3 space-y-3">
            {[
              "Instant food recognition",
              "Detailed nutrition analysis",
              "Personalized recommendations",
            ].map((feature, index) => (
              <View key={index} className="flex-row items-center">
                <View className="w-2 h-2 bg-[#a259ff] rounded-full mr-3" />
                <Text className="text-base" style={{ color: colors.text }}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Section */}
        <View className="px-8 pt-12 pb-12">
          <TouchableOpacity
            className="bg-[#a259ff] rounded-2xl px-8 py-4 shadow-lg active:scale-95"
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg text-center">
              Get Started
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-500 text-sm text-center mt-4 pb-10">
            2025 copyright SnapNutrient
          </Text>
        </View>
      </View>
    </View>
  );
}
