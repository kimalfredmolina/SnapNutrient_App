import { View, Text, TouchableOpacity } from "react-native";

type IntroductionProps = {
  onGetStarted: () => void;
};

export default function Introduction({ onGetStarted }: IntroductionProps) {
  return (
    <View className="flex-1 bg-white justify-center items-center px-8">
      <Text className="text-3xl font-bold mb-8">Welcome to SnapNutrient!</Text>
      <Text className="text-lg text-center mb-8">
        Track your food easily. Get started to continue.
      </Text>
      <TouchableOpacity
        className="bg-[#a259ff] rounded-lg px-8 py-3"
        onPress={onGetStarted}
      >
        <Text className="text-white font-medium text-lg">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}
