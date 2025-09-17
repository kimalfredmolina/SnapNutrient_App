import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CONFIG from "../../server";
import { ingredientMacros } from "../macros/ingredient-level-macros";
import { dishMacros } from "../macros/dish-level-macros";
import { computeDishMacros } from "../macros/compute_dish";

export default function Scan() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const { colors } = useTheme();
  const router = useRouter();
  const [state, setState] = useState<"preview" | "result">("preview");
  const [predictions, setPredictions] = useState<any[]>([]);
  const dishname = predictions.length > 0 ? predictions[0].class : null;
  const ingredients = dishMacros[dishname];
  const [editMode, setEditMode] = useState(false);
  const [editedIngredients, setEditedIngredients] = useState<
    Record<string, number>
  >({});

  const [weight, setweight] = useState<number>(100);
  const detected = predictions.length > 0 ? predictions[0].class : null;
  // const macros = detected ? ingredientMacros[detected] : null;

  const macros =
    detected && computeDishMacros(detected, weight / 100, editedIngredients)
      ? computeDishMacros(detected, weight / 100, editedIngredients)
      : detected && ingredientMacros[detected]
        ? {
            carbs: +(ingredientMacros[detected].carbs * weight).toFixed(1),
            protein: +(ingredientMacros[detected].protein * weight).toFixed(1),
            fats: +(ingredientMacros[detected].fats * weight).toFixed(1),
            calories: +(ingredientMacros[detected].calories * weight).toFixed(
              1
            ),
          }
        : null;
  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

        // if (photo) {
        //   setCapturedPhoto(photo.uri);
        //   console.log("Photo taken:", photo.uri);

        //   Alert.alert("Photo Captured!", "Photo taken successfully.", [
        //     { text: "Take Another", onPress: () => setCapturedPhoto(null) },
        //     { text: "OK" },
        //   ]);
        // }
        if (photo) {
          setCapturedPhoto(photo.uri);
          console.log("Photo taken:", photo.uri);
          setState("preview");
        }
      } catch (error) {
        console.error("Error taking photo:", error);
        Alert.alert("Error", "Failed to take photo");
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    console.log("ImagePicker result:", result);

    if (!result.canceled) {
      setCapturedPhoto(result.assets[0].uri);
      setState("preview"); // <-- important!
    }
  };

  const processWithAI = async () => {
    if (!capturedPhoto) return;

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: capturedPhoto,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const startTime = Date.now();

      const res = await fetch(`${CONFIG.API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      const data = await res.json();
      console.log("AI Predictions:", data);

      // if (data.predictions?.length > 0) {
      //   Alert.alert(
      //     "AI Results",
      //     `Analysis Time: ${duration}s\n\n${JSON.stringify(
      //       data.predictions,
      //       null,
      //       2
      //     )}`
      //   );
      // } else {
      //   Alert.alert(
      //     "No detections",
      //     `Analysis Time: ${duration}s\n\nThe AI model found nothing.`
      //   );
      // }

      if (data.predictions?.length > 0) {
        setPredictions(data.predictions); // save the AI output
        setState("result");
      } else {
        setPredictions([]); // no results
        setState("result");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to process with AI");
    }
  };

  const toggleFlash = () => {
    setIsFlashOn((prev) => !prev);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: colors.text, fontSize: 16 }}>
            Loading camera...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Ionicons
            name="camera-outline"
            size={64}
            color={colors.text}
            style={{ marginBottom: 20 }}
          />
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
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              Grant Camera Permission
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingHorizontal: 32, paddingVertical: 16 }}
          >
            <Text style={{ color: colors.text, fontSize: 16, opacity: 0.7 }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // if (capturedPhoto) {
  //   return (
  //     <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           alignItems: "center",
  //           padding: 16,
  //           borderBottomWidth: 1,
  //           borderBottomColor: colors.surface,
  //         }}
  //       >
  //         <TouchableOpacity onPress={retakePhoto} style={{ marginRight: 16 }}>
  //           <Ionicons name="arrow-back" size={24} color={colors.text} />
  //         </TouchableOpacity>
  //         <Text style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}>
  //           Photo Preview
  //         </Text>
  //       </View>

  //       <View style={{ flex: 1, padding: 16 }}>
  //         <Image
  //           source={{ uri: capturedPhoto }}
  //           style={{
  //             width: "100%",
  //             height: 300,
  //             borderRadius: 12,
  //             marginBottom: 20,
  //           }}
  //           resizeMode="cover"
  //         />

  //         <View
  //           style={{
  //             backgroundColor: colors.surface,
  //             padding: 20,
  //             borderRadius: 12,
  //             marginBottom: 20,
  //           }}
  //         >
  //           <Text
  //             style={{
  //               color: colors.text,
  //               fontSize: 18,
  //               fontWeight: "600",
  //               marginBottom: 12,
  //               textAlign: "center",
  //             }}
  //           >
  //             🚀 Ready to be analyzed by AI
  //           </Text>
  //           <Text
  //             style={{
  //               color: colors.text,
  //               fontSize: 14,
  //               opacity: 0.7,
  //               textAlign: "center",
  //               lineHeight: 20,
  //             }}
  //           >
  //             Camera is working perfectly!
  //           </Text>
  //         </View>

  //         <View style={{ flexDirection: "row", gap: 12 }}>
  //           <TouchableOpacity
  //             onPress={retakePhoto}
  //             style={{
  //               flex: 1,
  //               backgroundColor: colors.surface,
  //               padding: 16,
  //               borderRadius: 12,
  //               alignItems: "center",
  //             }}
  //           >
  //             <Text
  //               style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}
  //             >
  //               Retake Photo
  //             </Text>
  //           </TouchableOpacity>

  //           <TouchableOpacity
  //             onPress={processWithAI}
  //             style={{
  //               flex: 1,
  //               backgroundColor: colors.primary,
  //               padding: 16,
  //               borderRadius: 12,
  //               alignItems: "center",
  //             }}
  //           >
  //             <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
  //               Process with AI
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  if (capturedPhoto) {
    if (state === "preview") {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
            <Text
              style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}
            >
              Photo Preview
            </Text>
          </View>

          <View style={{ flex: 1, padding: 16 }}>
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
                🚀 Ready to be analyzed by AI
              </Text>
            </View>

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
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  Retake Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={processWithAI}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                >
                  Process with AI
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    }

    if (state === "result") {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
            <Text
              style={{ color: colors.text, fontSize: 18, fontWeight: "600" }}
            >
              Result
            </Text>
          </View>

          <ScrollView>
            <View style={{ flex: 1, padding: 16 }}>
              <Image
                source={{ uri: capturedPhoto }}
                style={{
                  width: "100%",
                  height: 250,
                  borderRadius: 12,
                  marginBottom: 20,
                }}
                resizeMode="cover"
              />
              {predictions.length > 0 && (
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: 16,
                  }}
                >
                  🍽️ Food: {predictions[0].class.replace(/_/g, " ")}
                </Text>
              )}

              {macros ? (
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
                      fontSize: 16,
                      marginBottom: 8,
                    }}
                  >
                    🍚 Carbs: {macros?.carbs} g
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      marginBottom: 8,
                    }}
                  >
                    🍗 Protein: {macros?.protein} g
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      marginBottom: 8,
                    }}
                  >
                    🧈 Fat: {macros?.fats} g
                  </Text>
                  <Text style={{ color: colors.text, fontSize: 16 }}>
                    🔥 Calories: {macros?.calories} kcal
                  </Text>
                </View>
              ) : (
                <Text style={{ color: colors.text, textAlign: "center" }}>
                  No macros found for this food.
                </Text>
              )}

              {ingredients ? (
                <View
                  style={{
                    backgroundColor: colors.surface,
                    padding: 20,
                    borderRadius: 12,
                    marginBottom: 20,
                    maxHeight: 200, // prevents it from taking entire screen
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (editMode) {
                        console.log("Recomputing with:", editedIngredients);
                      }
                      setEditMode(!editMode);
                    }}
                    style={{ alignSelf: "flex-end", marginBottom: 10 }}
                  >
                    <Text style={{ color: colors.primary, fontWeight: "bold" }}>
                      {editMode ? "Done" : "Edit"}
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "600",
                      marginBottom: 12,
                    }}
                  >
                    🥘 Ingredients
                  </Text>

                  <ScrollView nestedScrollEnabled={true}>
                    {Object.entries(ingredients).map(
                      ([ingredient, weight], index) => {
                        const currentValue =
                          editedIngredients[ingredient] ?? weight;

                        return editMode ? (
                          // EDIT MODE → Show TextInput
                          <View
                            key={`${ingredient}-${index}`}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginBottom: 6,
                            }}
                          >
                            <Text
                              style={{
                                color: colors.text,
                                fontSize: 15,
                                flex: 1,
                              }}
                            >
                              {ingredient.replace(/_/g, " ")}
                            </Text>
                            <TextInput
                              value={String(currentValue)}
                              keyboardType="numeric"
                              onChangeText={(text) => {
                                const newWeight = Number(text) || 0;
                                setEditedIngredients((prev) => ({
                                  ...prev,
                                  [ingredient]: newWeight,
                                }));
                              }}
                              style={{
                                borderWidth: 1,
                                borderColor: colors.primary,
                                borderRadius: 6,
                                paddingHorizontal: 8,
                                width: 60,
                                textAlign: "center",
                                color: colors.text,
                              }}
                            />
                            <Text style={{ color: colors.text, marginLeft: 4 }}>
                              g
                            </Text>
                          </View>
                        ) : (
                          // VIEW MODE → Show plain text
                          <Text
                            key={`${ingredient}-${index}`}
                            style={{
                              color: colors.text,
                              fontSize: 15,
                              marginBottom: 6,
                            }}
                          >
                            {ingredient.replace(/_/g, " ")} – {currentValue} g
                          </Text>
                        );
                      }
                    )}
                  </ScrollView>
                </View>
              ) : (
                <Text style={{ color: colors.text, textAlign: "center" }}>
                  No ingredients found for this dish.
                </Text>
              )}

              <Text
                style={{ color: colors.text, fontSize: 16, marginBottom: 12 }}
              >
                Weight (grams):
              </Text>
              <TextInput
                value={String(weight)}
                onChangeText={(text) => setweight(Number(text) || 0)}
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: colors.primary,
                  borderRadius: 8,
                  padding: 8,
                  color: colors.text,
                  marginBottom: 20,
                }}
              />

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
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "600",
                    }}
                  >
                    Retake Photo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => console.log("Log Food pressed")}
                  style={{
                    flex: 1,
                    backgroundColor: colors.primary,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                  >
                    Log Food
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        flash={isFlashOn ? "on" : "off"}
      >
        <SafeAreaView
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 16,
            }}
          >
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

            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                Food Scanner
              </Text>
            </View>

            <TouchableOpacity
              onPress={toggleFlash}
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                padding: 12,
                borderRadius: 25,
              }}
            >
              <Ionicons
                name={isFlashOn ? "flash" : "flash-off"}
                size={24}
                color={isFlashOn ? "#FFD700" : "white"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View
          className="absolute w-[240px] h-[240px] border-4 rounded-2xl"
          style={{
            top: "50%",
            left: "50%",
            borderColor: colors.primary,
            transform: [{ translateX: -120 }, { translateY: -120 }],
          }}
        >
          <View
            className="absolute w-[30px] h-[30px] border-t-[6px] border-l-[6px] rounded-tl-[20px]"
            style={{ top: -3, left: -3, borderColor: colors.primary }}
          />
          <View
            className="absolute w-[30px] h-[30px] border-t-[6px] border-r-[6px] rounded-tr-[20px]"
            style={{ top: -3, right: -3, borderColor: colors.primary }}
          />
          <View
            className="absolute w-[30px] h-[30px] border-b-[6px] border-l-[6px] rounded-bl-[20px]"
            style={{ bottom: -3, left: -3, borderColor: colors.primary }}
          />
          <View
            className="absolute w-[30px] h-[30px] border-b-[6px] border-r-[6px] rounded-br-[20px]"
            style={{ bottom: -3, right: -3, borderColor: colors.primary }}
          />
        </View>

        <View
          className="absolute w-[200px] px-5 py-2 rounded-full bg-black/70"
          style={{
            top: "50%",
            left: "50%",
            transform: [{ translateX: -100 }, { translateY: -180 }],
          }}
        >
          <Text className="text-white text-sm font-medium text-center">
            Point camera at food
          </Text>
          <Text className="text-white text-xs opacity-80 text-center mt-1">
            You're ready to detect food!
          </Text>
        </View>

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
            <TouchableOpacity
              onPress={pickImage}
              className="w-[50px] h-[50px] rounded-full justify-center items-center border-2"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Ionicons name="images" size={24} color="white" />
            </TouchableOpacity>

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
              <View
                className="w-[60px] h-[60px] rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="w-[50px] h-[50px] rounded-full justify-center items-center border-2"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>

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
  );
}
