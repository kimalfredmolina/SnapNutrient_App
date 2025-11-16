import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useAuth } from "../../../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { auth } from "../../../../config/firebase";

export default function ViewProfile() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  // Health info (fetched from Firebase)
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    let listenerRef: ReturnType<typeof ref> | null = null;
    let unsubscribeAuth: (() => void) | null = null;

    const attach = (uid: string) => {
      const db = getDatabase();
      listenerRef = ref(db, `users/${uid}/healthInfo`);
      // realtime listener - updates automatically when DB changes
      onValue(
        listenerRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setHeight(data.height != null ? String(data.height) : "");
            setWeight(data.weight != null ? String(data.weight) : "");
            setAge(data.age != null ? String(data.age) : "");
            setGender(data.gender ?? "");
          } else {
            // clear if no data
            setHeight("");
            setWeight("");
            setAge("");
            setGender("");
          }
        },
        (error) => {
          console.error("onValue error fetching healthInfo:", error);
          setHeight("");
          setWeight("");
          setAge("");
          setGender("");
        }
      );
    };

    if (user?.uid) {
      attach(user.uid);
    } else {
      // fallback: wait for firebase auth state
      unsubscribeAuth = auth.onAuthStateChanged((u) => {
        if (u?.uid) attach(u.uid);
      });
    }

    return () => {
      // detach DB listener
      if (listenerRef) {
        try {
          off(listenerRef);
        } catch {}
      }
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [user]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.background,
        flexGrow: 1,
        paddingHorizontal: 8,
        paddingTop: 12,
        paddingBottom: 24,
      }}
    >
      {/* Header */}
      <View
        className="flex-row items-center px-4 py-3 border-b"
        style={{ borderBottomColor: colors.surface }}
      >
        <TouchableOpacity
          onPress={() => router.push("..\\settings")}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text
          className="text-xl font-bold flex-1"
          style={{ color: colors.text }}
        >
          Profile
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo */}
        <View className="items-center mb-8">
          <Image
            source={
              user?.photoURL
                ? { uri: user.photoURL }
                : require("../../../../assets/images/icon.png")
            }
            className="w-24 h-24 rounded-full"
            style={{ borderWidth: 3, borderColor: colors.primary }}
          />
        </View>

        {/* Personal Information */}
        <View className="mb-8">
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Personal Information
          </Text>

          <View className="mb-4">
            <Text
              className="text-base font-medium mb-2"
              style={{ color: colors.text }}
            >
              Full Name
            </Text>
            <TextInput
              value={name}
              editable={false}
              placeholder=""
              className="border rounded-lg px-4 py-3 text-base"
              style={{
                borderColor: colors.surface,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
            />
          </View>

          <View className="mb-4">
            <Text
              className="text-base font-medium mb-2"
              style={{ color: colors.text }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              editable={false}
              keyboardType="email-address"
              placeholder=""
              className="border rounded-lg px-4 py-3 text-base"
              style={{
                borderColor: colors.surface,
                backgroundColor: colors.surface,
                color: colors.text,
              }}
            />
          </View>
        </View>

        {/* Health Information */}
        <View className="mb-8">
          <Text
            className="text-lg font-semibold mb-4"
            style={{ color: colors.text }}
          >
            Health Information
          </Text>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text
                className="text-base font-medium mb-2"
                style={{ color: colors.text }}
              >
                Height (cm)
              </Text>
              <TextInput
                value={height}
                editable={false}
                placeholder="Not set"
                placeholderTextColor={colors.text + "60"}
                className="border rounded-lg px-4 py-3 text-base"
                style={{
                  borderColor: colors.surface,
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-base font-medium mb-2"
                style={{ color: colors.text }}
              >
                Weight (kg)
              </Text>
              <TextInput
                value={weight}
                editable={false}
                placeholder="Not set"
                placeholderTextColor={colors.text + "60"}
                className="border rounded-lg px-4 py-3 text-base"
                style={{
                  borderColor: colors.surface,
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              />
            </View>
          </View>

          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text
                className="text-base font-medium mb-2"
                style={{ color: colors.text }}
              >
                Age
              </Text>
              <TextInput
                value={age}
                editable={false}
                placeholder="Not set"
                placeholderTextColor={colors.text + "60"}
                className="border rounded-lg px-4 py-3 text-base"
                style={{
                  borderColor: colors.surface,
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              />
            </View>
            <View className="flex-1">
              <Text
                className="text-base font-medium mb-2"
                style={{ color: colors.text }}
              >
                Gender
              </Text>
              <TextInput
                value={
                  gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : ""
                }
                editable={false}
                placeholder="Not set"
                placeholderTextColor={colors.text + "60"}
                className="border rounded-lg px-4 py-3 text-base"
                style={{
                  borderColor: colors.surface,
                  backgroundColor: colors.surface,
                  color: colors.text,
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}