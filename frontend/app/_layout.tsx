import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import "../global.css";

const { width: screenWidth } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // Filter out unwanted routes
  const filteredRoutes = state.routes.filter(route => 
    !['sitemap', '+not-found', '_sitemap', 'not-found'].includes(route.name)
  );
  
  const tabWidth = screenWidth / filteredRoutes.length;
  
  return (
    <View style={{ position: 'relative', height: 80 }}>
      {/* Base tab bar background */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1a1a1a',
        height: 80,
      }} />

      {/* Tab buttons */}
      <View style={{
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10,
        position: 'relative',
        zIndex: 10,
      }}>
        {filteredRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : options.title !== undefined 
            ? options.title 
            : route.name;

          const isFocused = state.index === state.routes.findIndex(r => r.key === route.key);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
                position: 'relative',
              }}
            >
              {/* Active tab with floating green circle */}
              {isFocused ? (
                <View style={{
                  position: 'absolute',
                  backgroundColor: '#4ade80',
                  borderRadius: 35,
                  width: 70,
                  height: 70,
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: -25,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  borderWidth: 3,
                  borderColor: '#1a1a1a',
                }}>
                  {options.tabBarIcon?.({
                    focused: isFocused,
                    color: '#ffffff',
                    size: 28,
                  })}
                </View>
              ) : (
                // Regular tab icon
                options.tabBarIcon?.({
                  focused: isFocused,
                  color: '#888888',
                  size: 24,
                })
              )}

              {/* Tab label */}
              <Text style={{
                color: isFocused ? '#ffffff' : '#888888',
                fontSize: 12,
                fontWeight: '500',
                marginTop: isFocused ? 30 : 4,
              }}>
                {typeof label === 'string' ? label : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "search",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "search" : "search-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "scan",
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons 
              name="qr-code-scanner" 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "history",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "time" : "time-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      
      {/* This hides it from the tab bar */}
      <Tabs.Screen
        name="sitemap"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="+not-found"
        options={{
          href: null, 
        }}
      />
    </Tabs>
  );
}