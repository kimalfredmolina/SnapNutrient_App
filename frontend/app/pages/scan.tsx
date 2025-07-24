import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";

export default function Scan() {
  const cameraRef = useRef<Camera | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flash, setFlash] = useState<FlashMode | null>(null);
  const [cameraType, setCameraType] = useState<CameraType | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await MediaLibrary.requestPermissionsAsync();
      const granted = cameraStatus === "granted" && mediaStatus === "granted";
      setHasPermission(granted);

      if (granted && Camera?.Constants) {
        setFlash(Camera.Constants.FlashMode.off as FlashMode);
        setCameraType(Camera.Constants.Type.back as CameraType);
      }
    })();
  }, []);

  const toggleFlash = () => {
    if (!Camera?.Constants || flash === null) return;

    setFlash(
      flash === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  const openGallery = async () => {
    try {
      const result = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: "photo",
      });
      if (result.assets.length > 0) {
        setCapturedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error opening gallery", error);
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No access to camera</Text>;
  if (!Camera?.Constants || !flash || !cameraType)
    return <Text>Loading camera...</Text>;

  return (
    <View className="flex-1 bg-black">
      <Camera
        className="flex-1"
        type={cameraType}
        flashMode={flash}
        ref={(ref) => (cameraRef.current = ref)}
        ratio="16:9"
      >
        <View className="flex-row justify-end p-4">
          <TouchableOpacity
            onPress={toggleFlash}
            className="bg-black/40 p-2 rounded-full"
          >
            <Ionicons
              name={
                flash === Camera.Constants.FlashMode.torch
                  ? "flash"
                  : "flash-off"
              }
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>

        <View className="absolute bottom-8 w-full flex-row justify-center items-center space-x-6">
          <TouchableOpacity
            onPress={openGallery}
            className="bg-black/40 p-3 rounded-full"
          >
            <Ionicons name="images" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>

      {capturedPhoto && (
        <Image
          source={{ uri: capturedPhoto }}
          className="absolute bottom-28 w-full h-52"
          resizeMode="contain"
        />
      )}
    </View>
  );
}
