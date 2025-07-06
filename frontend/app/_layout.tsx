import { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import "../global.css";
import Introduction from "./components/introduction";
import LoginPage from "./authentication/login";
import SvgComponent from "./components/foodscanner";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Filter out specific routes from the bottom navbar
  const filteredRoutes = state.routes.filter(
    (route) =>
      ![
        "components/introduction",
        "components/foodscanner", 
        "authentication/login",
        "sitemap",
        "+not-found",
        "_sitemap",
        "not-found",
        "Not Found",
      ].includes(route.name)
  );

  const centerIndex = 2;

  return (
    <SafeAreaView
      edges={["bottom"]}
      className="bg-white absolute left-0 right-0 bottom-0"
      style={{ paddingBottom: 0 }}
    >
      <View className="flex-row items-center justify-between w-full bg-white rounded-t-3xl h-[70px] shadow-lg">
        {filteredRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Center (Scan) tab with elevated design
          if (index === centerIndex) {
            return (
              <View
                key={route.key}
                className="flex-1 items-center justify-end"
              >
                <TouchableOpacity
                  onPress={onPress}
                  activeOpacity={0.85}
                  className="bg-[#a259ff] w-16 h-16 rounded-full items-center justify-center -mt-7"
                  style={{
                    shadowColor: "#a259ff",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <SvgComponent size={35} color="#fff" />
                </TouchableOpacity>
                <Text
                  className={`text-xs mt-1 font-black ${
                    isFocused ? "text-[#a259ff]" : "text-gray-500"
                  }`}
                >
                  {typeof label === "string" ? label : route.name}
                </Text>
              </View>
            );
          }

          // Regular tabs
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              className="flex-1 items-center justify-center py-2"
              activeOpacity={0.8}
            >
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? "#a259ff" : "#888",
                size: 24,
              })}
              <Text
                className={`text-xs mt-1 font-black ${
                  isFocused ? "text-[#a259ff]" : "text-gray-500"
                }`}
              >
                {typeof label === "string" ? label : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const [step, setStep] = useState<"intro" | "login" | "main">("intro");

  if (step === "intro") {
    return <Introduction onGetStarted={() => setStep("login")} />;
  }

  if (step === "login") {
    return <LoginPage onLogin={() => setStep("main")} />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="pages/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pages/search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pages/scan"
        options={{
          title: "Scan Food",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="qr-code-scanner" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pages/history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pages/account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}