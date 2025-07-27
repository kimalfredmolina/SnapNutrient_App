import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

export default function Scan() {
  const cameraRef = useRef<Camera>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
    }
  };

  const toggleFlash = () => {
    setIsFlashOn((prev) => !prev);
  };

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        type={type}
        flashMode={isFlashOn ? "on" : "off"}
      />

      {/* Flash Toggle */}
      <View style={styles.flashButtonContainer}>
        <TouchableOpacity onPress={toggleFlash} style={styles.flashButton}>
          <Ionicons
            name={isFlashOn ? "flash" : "flash-off"}
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Capture Button */}
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity onPress={takePhoto} style={styles.captureButton} />
      </View>

      {capturedPhoto && (
        <Image
          source={{ uri: capturedPhoto }}
          style={styles.capturedImage}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  flashButtonContainer: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  flashButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 50,
  },
  captureButtonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 5,
    borderColor: "gray",
  },
  capturedImage: {
    position: "absolute",
    bottom: 120,
    width: "100%",
    height: 200,
  },
});
