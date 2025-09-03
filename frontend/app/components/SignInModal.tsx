import React from "react";
import { Modal, View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";

interface PolicyModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function PolicyModal({
  visible,
  onClose,
  children,
}: PolicyModalProps) {
  const { colors } = useTheme();

  // for terms and privacy modals in signin/signup page
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>

        <ScrollView className="flex-1 px-4 pt-12">{children}</ScrollView>
      </View>
    </Modal>
  );
}
