import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CONFIG from "../../server";
import { ingredientMacros } from "../macros/ingredient-level-macros";
import { dishMacros } from "../macros/dish-level-macros";
import { computeDishMacros } from "../macros/compute_dish";
import { logFoodForUser } from "../macros/foodLogs";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

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

  const [isLogging, setIsLogging] = useState(false);

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

  useFocusEffect(
    React.useCallback(() => {
      setCapturedPhoto(null);
      setPredictions([]);
      setState("preview");
      setEditMode(false);
      setEditedIngredients({});
      setweight(100);
      setIsLogging(false);
    }, [])
  );

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
      //     Analysis Time: ${duration}s\n\nThe AI model found nothing.
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

  const handleLogFood = async () => {
    if (!macros) {
      Alert.alert("Error", "No macros available to log.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be logged in to log food.");
      return;
    }

    setIsLogging(true);

    try {
      const name = predictions[0]?.class || "Unknown";

      // If this is a known dish, persist base ingredient grams with user edits applied.
      // Do NOT scale by Weight here to avoid double-scaling in History.
      const isDish = !!dishMacros[name as keyof typeof dishMacros];
      const ingredientPayload =
        isDish && dishMacros[name as keyof typeof dishMacros]
          ? Object.entries(
              dishMacros[name as keyof typeof dishMacros] as Record<
                string,
                number
              >
            ).reduce(
              (acc, [ing, defaultGrams]) => {
                acc[ing] =
                  editedIngredients[ing] !== undefined
                    ? editedIngredients[ing]
                    : defaultGrams;
                return acc;
              },
              {} as Record<string, number>
            )
          : undefined;

      await logFoodForUser(user.uid, {
        foodName: name,
        weight,
        carbs: macros.carbs,
        protein: macros.protein,
        fats: macros.fats,
        calories: macros.calories,
        // Only attach for dishes
        ...(ingredientPayload ? { ingredients: ingredientPayload } : {}),
      });

      Alert.alert("Success", "Food logged successfully!", [
        { text: "OK", onPress: () => router.push("/pages") },
      ]);
    } catch (error) {
      console.error("Error logging food:", error);
      Alert.alert("Error", "Failed to log food. Please try again.");
    } finally {
      setIsLogging(false);
    }
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
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <View className="flex-1 justify-center items-center p-5">
          <Ionicons
            name="camera-outline"
            size={64}
            color={colors.text}
            style={{ marginBottom: 20 }}
          />

          <Text
            className="text-lg font-semibold text-center mb-5"
            style={{ color: colors.text }}
          >
            Camera Permission Required
          </Text>

          <Text
            className="text-sm text-center mb-8"
            style={{ color: colors.text, opacity: 0.7 }}
          >
            We need camera access to scan and analyze your food items
          </Text>

          {/* Grant Permission Button */}
          <TouchableOpacity
            onPress={requestPermission}
            className="rounded-xl px-8 py-4 mb-4"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white text-base font-semibold">
              Grant Camera Permission
            </Text>
          </TouchableOpacity>

          {/* Go Back Button */}
          <TouchableOpacity onPress={() => router.back()} className="px-8 py-4">
            <Text
              className="text-base"
              style={{ color: colors.text, opacity: 0.7 }}
            >
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
        <SafeAreaView
          className="flex-1"
          style={{ backgroundColor: colors.background }}
        >
          <View
            className="flex-row items-center px-4 py-4 border-b"
            style={{ borderBottomColor: colors.surface }}
          >
            <TouchableOpacity onPress={retakePhoto} className="mr-4">
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text
              className="text-lg font-semibold"
              style={{ color: colors.text }}
            >
              Photo Preview
            </Text>
          </View>

          <View className="flex-1 p-4">
            <Image
              source={{ uri: capturedPhoto }}
              className="w-full h-72 rounded-xl mb-5"
              resizeMode="cover"
            />

            <View
              className="rounded-xl p-5 mb-5"
              style={{ backgroundColor: colors.surface }}
            >
              <Text
                className="text-lg font-semibold text-center"
                style={{ color: colors.text }}
              >
                🚀 Ready to be analyzed by AI
              </Text>
            </View>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={retakePhoto}
                className="flex-1 rounded-xl p-4 items-center"
                style={{ backgroundColor: colors.surface }}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: colors.text }}
                >
                  Retake Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={processWithAI}
                className="flex-1 rounded-xl p-4 items-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Text className="text-base font-semibold text-white">
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
                  className="text-lg font-semibold text-center mb-2"
                  style={{ color: colors.text }}
                >
                  🍽️ Food: {predictions[0].class.replace(/_/g, " ")}
                </Text>
              )}

              {macros ? (
                <View className="p-1 mb-1">
                  <Text
                    className="text-xl font-bold text-left mb-2 ml-4"
                    style={{ color: colors.text }}
                  >
                    Macros
                  </Text>

                  <View className="flex-row flex-wrap justify-between">
                    {/* Calories */}
                    <View
                      className="w-[48%] rounded-xl p-3 mb-3 flex-row items-center"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.text + "40",
                        borderWidth: 1,
                      }}
                    >
                      <Ionicons name="flame" size={20} color="#ef4444" />
                      <Text
                        className="text-base ml-2"
                        style={{ color: colors.text }}
                      >
                        Calories:{" "}
                        <Text className="font-semibold text-red-500">
                          {macros?.calories} kcal
                        </Text>
                      </Text>
                    </View>

                    {/* Fat */}
                    <View
                      className="w-[48%] rounded-xl p-3 mb-3 flex-row items-center"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.text + "40",
                        borderWidth: 1,
                      }}
                    >
                      <Ionicons name="cube-outline" size={20} color="#f97316" />
                      <Text
                        className="text-base ml-2"
                        style={{ color: colors.text }}
                      >
                        Fat:{" "}
                        <Text className="font-semibold text-red-500">
                          {macros?.fats} g
                        </Text>
                      </Text>
                    </View>

                    {/* Protein */}
                    <View
                      className="w-[48%] rounded-xl p-3 mb-3 flex-row items-center"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.text + "40",
                        borderWidth: 1,
                      }}
                    >
                      <Ionicons
                        name="restaurant-outline"
                        size={20}
                        color="#10b981"
                      />
                      <Text
                        className="text-base ml-2"
                        style={{ color: colors.text }}
                      >
                        Protein:{" "}
                        <Text className="font-semibold text-red-500">
                          {macros?.protein} g
                        </Text>
                      </Text>
                    </View>

                    {/* Carbs */}
                    <View
                      className="w-[48%] rounded-xl p-3 mb-3 flex-row items-center"
                      style={{
                        backgroundColor: colors.background,
                        borderColor: colors.text + "40",
                        borderWidth: 1,
                      }}
                    >
                      <Ionicons name="leaf-outline" size={20} color="#3b82f6" />
                      <Text
                        className="text-base ml-2"
                        style={{ color: colors.text }}
                      >
                        Carbs:{" "}
                        <Text className="font-semibold text-red-500">
                          {macros?.carbs} g
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <Text className="text-center" style={{ color: colors.text }}>
                  No macros found for this food.
                </Text>
              )}

              {ingredients ? (
                <View
                  className="rounded-xl p-5 mb-5 max-h-[200px]"
                  style={{ backgroundColor: colors.surface }}
                >
                  {/* Edit Button */}
                  <TouchableOpacity
                    onPress={() => {
                      if (editMode)
                        console.log("Recomputing with:", editedIngredients);
                      setEditMode(!editMode);
                    }}
                    className="self-end mb-2.5"
                  >
                    <Text
                      className="font-bold"
                      style={{ color: colors.primary }}
                    >
                      {editMode ? "Done" : "Edit"}
                    </Text>
                  </TouchableOpacity>

                  <Text
                    className="text-base font-semibold mb-3"
                    style={{ color: colors.text }}
                  >
                    🥘 Ingredients
                  </Text>

                  <ScrollView nestedScrollEnabled className="pr-1">
                    {Object.entries(ingredients).map(
                      ([ingredient, weight], index) => {
                        const currentValue =
                          editedIngredients[ingredient] ?? weight;

                        return editMode ? (
                          // EDIT MODE → Show TextInput
                          <View
                            key={`${ingredient}-${index}`}
                            className="flex-row items-center mb-1.5"
                          >
                            {/* Ingredient Name */}
                            <Text
                              className="flex-1 text-[15px]"
                              style={{ color: colors.text }}
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
                              className="border rounded-md px-2 text-center w-[60px]"
                              style={{
                                borderColor: colors.primary,
                                color: colors.text,
                              }}
                            />
                            <Text
                              className="ml-1"
                              style={{ color: colors.text }}
                            >
                              g
                            </Text>
                          </View>
                        ) : (
                          <Text
                            key={`${ingredient}-${index}`}
                            className="text-[15px] mb-1.5"
                            style={{ color: colors.text }}
                          >
                            {ingredient.replace(/_/g, " ")} – {currentValue} g
                          </Text>
                        );
                      }
                    )}
                  </ScrollView>
                </View>
              ) : (
                <Text className="text-center" style={{ color: colors.text }}>
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
                  onPress={handleLogFood}
                  disabled={isLogging}
                  style={{
                    flex: 1,
                    backgroundColor: isLogging ? "gray" : colors.primary,
                    padding: 16,
                    borderRadius: 12,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "600" }}
                  >
                    {isLogging ? "Logging..." : "Log Food"}
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
          <View className="flex-row justify-between items-center">
            {/* Gallery Button */}
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

            {/* Capture Button */}
            <TouchableOpacity
              onPress={takePhoto}
              className="w-[80px] h-[80px] rounded-full justify-center items-center border-[6]"
              style={{
                backgroundColor: "white",
                borderColor: "rgba(255,255,255,0.3)",
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

            {/* Switch Camera Button */}
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
