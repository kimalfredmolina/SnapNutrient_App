import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";

export default function Account() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleSignOut = () => {
    router.replace("/authentication/signin");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingTop: 32,
          paddingBottom: 16,
        }}
      >
        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                borderWidth: 2,
                borderColor: colors.primary,
              }}
            />
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text }}>
                Grow A. Garden Jr.
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Text style={{ color: colors.text, fontWeight: "500" }}>Streak</Text>
                <Text style={{ marginLeft: 8, color: colors.accent, fontWeight: "bold" }}>
                  2 Days
                </Text>
              </View>
            </View>
          </View>

          {/* Menu */}
          <View style={{ gap: 16, marginLeft: 8 }}>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="settings-outline" size={26} color={colors.text} />
              <Text style={{ marginLeft: 16, fontSize: 16, color: colors.text, fontWeight: "500" }}>
                Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="help-circle-outline" size={26} color={colors.text} />
              <Text style={{ marginLeft: 16, fontSize: 16, color: colors.text, fontWeight: "500" }}>
                Help
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="privacy-tip" size={26} color={colors.text} />
              <Text style={{ marginLeft: 16, fontSize: 16, color: colors.text, fontWeight: "500" }}>
                Privacy
              </Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={{ height: 24 }} />

        </ScrollView>

        {/* Log Out Button */}
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              borderColor: colors.accent,
              borderWidth: 1,
              borderRadius: 12,
              paddingVertical: 12,
              marginTop: 16,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: colors.accent,
                fontSize: 18,
                fontWeight: "600",
              }}
            >
              Log Out
            </Text>
          </TouchableOpacity>

        {/* Footer Fixed at Bottom */}
        <View style={{ alignItems: "center", marginTop: 16 }}>
          <Text style={{ fontSize: 12, color: colors.text + "99" }}>SnapNutrients v1.0</Text>
          <Text style={{ fontSize: 12, color: colors.text + "66" }}>
            © 2025 SnapNutrients. All rights reserved.
          </Text>
        </View>

        {/* Spacer */}
          <View style={{ height: 90 }} />
      </View>
    </SafeAreaView>
  );
}
