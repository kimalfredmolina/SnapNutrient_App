import { View, TouchableOpacity, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import SvgComponent from "./foodscanner"

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, isDark } = useTheme()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  // Get current route name
  const currentRoute = state.routes[state.index]
  const currentRouteName = currentRoute?.name

  // Hide bottom navigation on these pages
  const hiddenRoutes = ["tabSetting/settings", "tabSetting/about", "tabSetting/privacy", "tabSetting/contact", "tabSetting/help", "tabSetting/report" , "tabHistory/history-detail"]

  // Hide the entire tab bar when on scan page
  if (currentRouteName === "scan") {
    return null
  }

  if (hiddenRoutes.includes(currentRouteName)) {
    return null
  }

  return (
    <SafeAreaView
      edges={["bottom"]}
      className="absolute left-0 right-0 bottom-0"
      style={{ backgroundColor: colors.background }}
    >
      <View
        className="flex-row items-center justify-between w-full h-[70px] rounded-t-3xl"
        style={{
          backgroundColor: colors.background,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        {state.routes
          .filter((route) => !hiddenRoutes.includes(route.name))
          .map((route, index) => {
            const { options } = descriptors[route.key]
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name

            const isFocused = state.index === index

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              })

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }

            if (index === 2) {
              return (
                <View key={route.key} className="flex-1 items-center justify-end">
                  <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.85}
                    className="w-16 h-16 rounded-full items-center justify-center mt-[-28px]"
                    style={{
                      backgroundColor: colors.primary,
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
                    className="text-xs font-extrabold mt-1"
                    style={{
                      color: isFocused ? colors.primary : colors.text + "80",
                    }}
                  >
                    {typeof label === "string" ? label : route.name}
                  </Text>
                </View>
              )
            }

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
                  color: isFocused ? colors.primary : colors.text + "88",
                  size: 24,
                })}
                <Text
                  className="text-xs font-extrabold mt-1"
                  style={{
                    color: isFocused ? colors.primary : colors.text + "80",
                  }}
                >
                  {typeof label === "string" ? label : route.name}
                </Text>
              </TouchableOpacity>
            )
          })}
      </View>
    </SafeAreaView>
  )
}