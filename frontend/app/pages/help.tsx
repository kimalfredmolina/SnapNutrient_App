import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Help() {
  const router = useRouter()
  const { colors } = useTheme()

  const faqData = [
    {
      question: "How do I scan food?",
      answer:
        "Simply tap the 'Scan Food' tab at the bottom of the screen, point your camera at the food, and tap the capture button. Our AI will automatically recognize the food and provide nutritional information.",
    },
    {
      question: "How accurate is the nutrition data?",
      answer:
        "Our AI-powered food recognition system provides highly accurate nutritional estimates based on visual analysis. However, actual values may vary depending on preparation methods and portion sizes.",
    },
    {
      question: "Can I track multiple meals per day?",
      answer:
        "Yes! You can scan and track as many meals and snacks as you want throughout the day. All your nutrition data will be automatically compiled in your daily summary.",
    },
    {
      question: "How do I set my nutrition goals?",
      answer:
        "Go to Settings > Nutrition Goals to set your daily calorie, protein, carb, and fat targets based on your personal health objectives.",
    },
    {
      question: "Can I export my nutrition data?",
      answer:
        "Yes, you can export your nutrition history from Settings > Data & Storage > Export Data. This will generate a CSV file with all your tracked meals and nutrition information.",
    },
    {
      question: "What if the app doesn't recognize my food?",
      answer:
        "If our AI doesn't recognize a food item, you can manually search our database or add custom foods with their nutritional information.",
    },
  ]

  return (
    <SafeAreaView style={{ 
      backgroundColor: colors.background,
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 24, 
    }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b" style={{ borderBottomColor: colors.surface }}>
        <TouchableOpacity onPress={() => router.push("../pages/account")} className="mr-4">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: colors.text }}>
          Help & Support
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Quick Actions
          </Text>

          <TouchableOpacity
            className="flex-row items-center py-4 border-b"
            style={{ borderBottomColor: colors.surface }}
            onPress={() => router.push("/account/contact")}
          >
            <Ionicons name="mail-outline" size={24} color={colors.primary} />
            <Text className="ml-4 text-base flex-1" style={{ color: colors.text }}>
              Contact Support
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.5 }} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-4 border-b"
            style={{ borderBottomColor: colors.surface }}
            onPress={() => router.push("/account/report")}
          >
            <Ionicons name="bug-outline" size={24} color={colors.primary} />
            <Text className="ml-4 text-base flex-1" style={{ color: colors.text }}>
              Report a Bug
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.5 }} />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-4">
            <Ionicons name="star-outline" size={24} color={colors.primary} />
            <Text className="ml-4 text-base flex-1" style={{ color: colors.text }}>
              Rate Our App
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ opacity: 0.5 }} />
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Frequently Asked Questions
          </Text>

          {faqData.map((faq, index) => (
            <View
              key={index}
              className="mb-4 p-4 rounded-lg border"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.surface,
              }}
            >
              <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
                {faq.question}
              </Text>
              <Text className="text-sm leading-5" style={{ color: colors.text, opacity: 0.8 }}>
                {faq.answer}
              </Text>
            </View>
          ))}
        </View>

        {/* Getting Started */}
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Getting Started
          </Text>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
              1. Create Your Profile
            </Text>
            <Text className="text-sm leading-5 mb-4" style={{ color: colors.text, opacity: 0.8 }}>
              Set up your account with basic information and nutrition goals to get personalized recommendations.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
              2. Start Scanning
            </Text>
            <Text className="text-sm leading-5 mb-4" style={{ color: colors.text, opacity: 0.8 }}>
              Use the camera to scan your meals. Our AI will identify the food and provide detailed nutrition
              information.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-base font-medium mb-2" style={{ color: colors.text }}>
              3. Track Your Progress
            </Text>
            <Text className="text-sm leading-5" style={{ color: colors.text, opacity: 0.8 }}>
              Monitor your daily nutrition intake and view your progress over time in the Statistics tab.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
