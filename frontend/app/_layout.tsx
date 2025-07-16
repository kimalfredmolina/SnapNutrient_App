import { useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import "../global.css";
import Introduction from "./components/introduction";
import LoginPage from "./authentication/signin";
import SvgComponent from "./components/foodscanner";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  // Filter out specific routes from the bottom navbar
  const filteredRoutes = state.routes.filter(
    (route) =>
      ![
        "components/introduction",
        "components/foodscanner",
        "authentication/signin",
        "contexts/ThemeContext",
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
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        paddingBottom: 0,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          backgroundColor: colors.background,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: 70,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
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

          // Center (Scan) tab with elevated design
          if (index === centerIndex) {
            return (
              <View
                key={route.key}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={onPress}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: colors.primary,
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -28,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <SvgComponent size={35} color={isDark ? "#000" : "#fff"} />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 12,
                    marginTop: 4,
                    fontWeight: "800",
                    color: isFocused ? colors.primary : colors.text + "80",
                  }}
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
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 8,
              }}
              activeOpacity={0.8}
            >
              {options.tabBarIcon?.({
                focused: isFocused,
                color: isFocused ? colors.primary : colors.text + "88",
                size: 24,
              })}
              <Text
                style={{
                  fontSize: 12,
                  marginTop: 4,
                  fontWeight: "800",
                  color: isFocused ? colors.primary : colors.text + "80",
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

function TabsLayout() {
  const { isAuthenticated, login, logout } = useAuth();
  const [step, setStep] = useState<"intro" | "login" | "main">("intro");

  if (step === "intro") {
    return <Introduction onGetStarted={() => setStep("login")} />;
  }

  if (step === "login") {
    return (
      <LoginPage
        onLogin={() => {
          login();
          setStep("main");
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={() => {
          login();
          setStep("main");
        }}
      />
    );
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
        name="pages/progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TabsLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
