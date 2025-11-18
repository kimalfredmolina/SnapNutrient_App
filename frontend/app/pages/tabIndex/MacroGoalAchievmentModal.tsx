import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface MacroGoalModalProps {
  visible: boolean;
  onClose: () => void;
  achievedMacros: {
    calories: boolean;
    protein: boolean;
    carbs: boolean;
    fat: boolean;
  };
  colors: any;
}

const MacroGoalAchievementModal = ({
  visible,
  onClose,
  achievedMacros,
  colors,
}: MacroGoalModalProps) => {
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const allGoalsAchieved =
    achievedMacros.calories &&
    achievedMacros.protein &&
    achievedMacros.carbs &&
    achievedMacros.fat;

  const getAchievementCount = () => {
    return Object.values(achievedMacros).filter(Boolean).length;
  };

  const achievementCount = getAchievementCount();

  const getMotivationalMessage = () => {
    if (allGoalsAchieved) {
      return "Perfect! You've hit all your macro goals today! 🎯";
    } else if (achievementCount === 3) {
      return "Excellent work! Almost there - just one more to go! 💪";
    } else if (achievementCount === 2) {
      return "Great progress! You're halfway to your daily goals! 🌟";
    } else if (achievementCount === 1) {
      return "Nice start! Keep going to reach all your goals! 🚀";
    }
    return "Let's work on hitting those macro goals today! 💚";
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
            width: width - 48,
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Header with Trophy Icon */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: allGoalsAchieved
                  ? "#10B981"
                  : colors.primary + "20",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 40 }}>
                {allGoalsAchieved ? "🏆" : "🎯"}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: colors.text,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              {allGoalsAchieved ? "Amazing Work!" : "Macro Update"}
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: colors.text + "99",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              {getMotivationalMessage()}
            </Text>
          </View>

          {/* Macro Achievement Status */}
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: colors.text + "99",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              Today's Progress
            </Text>

            {[
              { key: "calories", label: "Calories", icon: "🔥", color: "#EF4444" },
              { key: "protein", label: "Protein", icon: "💪", color: "#10B981" },
              { key: "fat", label: "Fat", icon: "🥑", color: "#F97316" },
              { key: "carbs", label: "Carbs", icon: "🌾", color: "#3B82F6" },
            ].map((macro) => (
              <View
                key={macro.key}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 8,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 20, marginRight: 8 }}>
                    {macro.icon}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.text,
                      fontWeight: "500",
                    }}
                  >
                    {macro.label}
                  </Text>
                </View>

                {achievedMacros[macro.key as keyof typeof achievedMacros] ? (
                  <View
                    style={{
                      backgroundColor: macro.color + "20",
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={macro.color}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        color: macro.color,
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      Achieved
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: colors.bgray + "40",
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text + "60",
                        fontSize: 12,
                        fontWeight: "500",
                      }}
                    >
                      In Progress
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: allGoalsAchieved ? "#10B981" : colors.primary,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {allGoalsAchieved ? "Awesome! 🎉" : "Keep Going! 💪"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default MacroGoalAchievementModal;
