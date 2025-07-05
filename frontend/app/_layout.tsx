import { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import "../global.css";
import Introduction from "./components/introduction";
import LoginPage from "./authentication/login";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  //for filtering out specific routes from the bottom navbar
  const filteredRoutes = state.routes.filter(
    (route) =>
      ![
        "components/introduction",
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
      className="bg-white"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: 0,
        backgroundColor: "white",
      }}
    >
      <View
        className="flex-row items-center justify-between w-full bg-white"
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 70,
        }}
      >
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

          // Center (Scan) tab
          if (index === centerIndex) {
            return (
              <View
                key={route.key}
                className="flex-1 items-center"
                style={{ alignItems: "center", justifyContent: "flex-end" }}
              >
                <TouchableOpacity
                  onPress={onPress}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: "#a259ff",
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -28,
                  }}
                >
                  {options.tabBarIcon?.({
                    focused: true,
                    color: "#fff",
                    size: 28,
                  })}
                </TouchableOpacity>
                <Text
                  className={`text-xs mt-1 ${
                    isFocused ? "text-[#a259ff]" : "text-gray-500"
                  } font-medium`}
                  style={{
                    fontWeight: "900",
                  }}
                >
                  {typeof label === "string" ? label : route.name}
                </Text>
              </View>
            );
          }

          // Other tabs
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
                className={`text-xs mt-1 ${
                  isFocused ? "text-[#a259ff]" : "text-gray-500"
                } font-medium`}
                style={{
                  fontWeight: "900",
                }}
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

//change this if you want to change the initial screen
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
