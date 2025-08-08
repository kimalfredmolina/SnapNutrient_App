import React from "react"
import { useRef, useState } from "react"
import { View, Text, TouchableOpacity, Image, Alert } from "react-native"
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useTheme } from "../../contexts/ThemeContext"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Scan() {
  const cameraRef = useRef<CameraView>(null)
  const [permission, requestPermission] = useCameraPermissions()
  const [isFlashOn, setIsFlashOn] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [facing, setFacing] = useState<CameraType>("back")
  const { colors } = useTheme()
  const router = useRouter()

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        })

        if (photo) {
          setCapturedPhoto(photo.uri)
          console.log("Photo taken:", photo.uri)

          // Mock: Show success message
          Alert.alert("Photo Captured!", "Photo taken successfully. Ai integration coming soon!", [
            { text: "Take Another", onPress: () => setCapturedPhoto(null) },
            { text: "OK" },
          ])
        }
      } catch (error) {
        console.error("Error taking photo:", error)
        Alert.alert("Error", "Failed to take photo")
      }
    }
  }

  const toggleFlash = () => {
    setIsFlashOn((prev) => !prev)
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"))
  }

  const retakePhoto = () => {
    setCapturedPhoto(null)
  }

  // Loading state while checking permissions
  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: colors.text, fontSize: 16 }}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Permission denied state
  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Ionicons name="camera-outline" size={64} color={colors.text} style={{ marginBottom: 20 }} />
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              textAlign: "center",
              marginBottom: 20,
              fontWeight: "600",
            }}
          >
            Camera Permission Required
          </Text>
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              textAlign: "center",
              marginBottom: 30,
              opacity: 0.7,
            }}
          >
            We need camera access to scan and analyze your food items
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>Grant Camera Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              paddingHorizontal: 32,
              paddingVertical: 16,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 16, opacity: 0.7 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Photo preview state
  if (capturedPhoto) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.surface,
          }}
        >
          <TouchableOpacity onPress={retakePhoto} style={{ marginRight: 16 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}>Photo Preview</Text>
        </View>

        <View style={{ flex: 1, padding: 16 }}>
          {/* Captured Image */}
          <Image
            source={{ uri: capturedPhoto }}
            style={{
              width: "100%",
              height: 300,
              borderRadius: 12,
              marginBottom: 20,
            }}
            resizeMode="cover"
          />

          {/* Mock Analysis Info */}
          <View
            style={{
              backgroundColor: colors.surface,
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              🚀 Ready for Ai Integration
            </Text>
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
                opacity: 0.7,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Camera is working perfectly! Your Ai model will analyze this image to detect and classify food items.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={retakePhoto}
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>Retake Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Success", "Photo ready for Scanning processing!", [
                  { text: "OK", onPress: () => router.back() },
                ])
              }}
              style={{
                flex: 1,
                backgroundColor: colors.primary,
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>Process with AI</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  //camera view
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} flash={isFlashOn ? "on" : "off"}>
        {/* Header Controls */}
        <SafeAreaView style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 16,
            }}
          >
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: 12,
                borderRadius: 25,
              }}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            {/* Title */}
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>Food Scanner</Text>
            </View>

            {/* Flash Toggle */}
            <TouchableOpacity
              onPress={toggleFlash}
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: 12,
                borderRadius: 25,
              }}
            >
              <Ionicons name={isFlashOn ? "flash" : "flash-off"} size={24} color={isFlashOn ? "#FFD700" : "white"} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Scanning Frame Overlay */}
        <View
          className="absolute w-[240px] h-[240px] border-4 rounded-2xl"
          style={{
            top: "50%",
            left: "50%",
            borderColor: colors.primary,
            transform: [{ translateX: -120 }, { translateY: -120 }],
          }}
          >
          {/* Corner indicators */}
          <View className="absolute w-[30px] h-[30px] border-t-[6px] border-l-[6px] rounded-tl-[20px]" style={{ top: -3, left: -3, borderColor: colors.primary }} />
          <View className="absolute w-[30px] h-[30px] border-t-[6px] border-r-[6px] rounded-tr-[20px]" style={{ top: -3, right: -3, borderColor: colors.primary }} />
          <View className="absolute w-[30px] h-[30px] border-b-[6px] border-l-[6px] rounded-bl-[20px]" style={{ bottom: -3, left: -3, borderColor: colors.primary }} />
          <View className="absolute w-[30px] h-[30px] border-b-[6px] border-r-[6px] rounded-br-[20px]" style={{ bottom: -3, right: -3, borderColor: colors.primary }} />
        </View>

        {/* Scan Instructions */}
        <View
          className="absolute w-[200px] px-5 py-2 rounded-full bg-black/70"
          style={{ top: "50%", left: "50%", transform: [{ translateX: -100 }, { translateY: -180 }] }}
        >
          <Text className="text-white text-sm font-medium text-center">Point camera at food</Text>
          <Text className="text-white text-xs opacity-80 text-center mt-1">You're ready to detect food!</Text>
        </View>

        {/* Bottom Controls */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: 50,
            paddingHorizontal: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Gallery Button (placeholder) */}
            <TouchableOpacity
              onPress={() => Alert.alert("Gallery", "Gallery feature coming soon!")}
              className="w-[50px] h-[50px] rounded-full justify-center items-center border-2"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.3)" }}
            >
              <Ionicons name="images" size={24} color="white" />
            </TouchableOpacity>

            {/* Capture Button */}
            <TouchableOpacity
              onPress={takePhoto}
              className="w-[80px] h-[80px] rounded-full justify-center items-center"
              style={{
                backgroundColor: "white",
                borderColor: "rgba(255,255,255,0.3)",
                borderWidth: 6,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
            >
              <View className="w-[60px] h-[60px] rounded-full" style={{ backgroundColor: colors.primary }} />
            </TouchableOpacity>

            {/* Flip Camera Button */}
            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="w-[50px] h-[50px] rounded-full justify-center items-center border-2"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", borderColor: "rgba(255,255,255,0.3)" }}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Bottom instruction */}
          <Text
            style={{
              color: "white",
              fontSize: 12,
              textAlign: "center",
              marginTop: 16,
              opacity: 0.8,
            }}
          >
            Tap the capture button to take a photo
          </Text>
        </View>
      </CameraView>
    </View>
  )
}
