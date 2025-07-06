import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function Account() {
  const router = useRouter();

  const handleSignOut = () => {
    router.replace("/authentication/signin");
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 32,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View className="flex-row items-center bg-gray-200 rounded-2xl p-4 mb-8 shadow-md mt-10">
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            className="w-16 h-16 rounded-full border-2 border-blue-400"
          />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold">Grow A. Garden Jr.</Text>
            <View className="flex-row items-center mt-1">
              <Text className="font-medium text-gray-700">Streak</Text>
              <Text className="ml-2 text-red-600 font-bold">2 Days</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View className="gap-y-6 mb-8 ml-4">
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="settings-outline" size={26} color="#222" />
            <Text className="ml-4 text-base font-medium">Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="help-circle-outline" size={26} color="#222" />
            <Text className="ml-4 text-base font-medium">Help</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center">
            <MaterialIcons name="privacy-tip" size={26} color="#222" />
            <Text className="ml-4 text-base font-medium">Privacy</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Log Out Button at the very bottom */}
        <View className="mb-0">
          <TouchableOpacity
            className="border border-red-500 rounded-xl py-3"
            onPress={handleSignOut}
          >
            <Text className="text-center text-red-500 text-lg font-semibold">
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="items-center mb-40">
        <Text className="text-xs text-gray-500">SnapNutrients v1.0</Text>
        <Text className="text-xs text-gray-400">
          © 2025 SnapNutrients. All rights reserved.
        </Text>
      </View>
    </View>
  );
}
