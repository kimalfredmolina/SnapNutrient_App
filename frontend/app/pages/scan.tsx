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
  ActivityIndicator,
} from "react-native";
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CONFIG from "../../server";
// import { ingredientMacros } from "../macros/ingredient-level-macros";
// import { dishMacros } from "../macros/dish-level-macros";
import { computeDishMacros } from "../macros/compute_dish";
import { logFoodForUser } from "../macros/foodLogs";
import { getAuth } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import Svg, { Circle } from "react-native-svg";
import { ref as dbRef, onValue, off } from "firebase/database";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../config/firebase";

const SIZE = 64;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const calculatePercentage = (consumed: number, total: number): number => {
  if (total <= 0) return 0;
  const percentage = (consumed / total) * 100;
  return Math.min(Math.round(percentage), 100);
};

const MacroCircle = ({
  label,
  value,
  total,
  color,
  unit = "g",
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  unit?: string;
}) => {
  const { colors } = useTheme();
  const percentage = calculatePercentage(value, total);
  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * percentage) / 100;

  return (
    <View className="items-center">
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.bgray}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
        <View className="absolute inset-0 justify-center items-center">
          <Text className="text-xs font-black" style={{ color: colors.text }}>
            {value.toFixed(0)}
            {unit}
          </Text>
        </View>
      </View>
      <Text className="text-xs font-bold mt-2" style={{ color: colors.text }}>
        {label}
      </Text>
    </View>
  );
};

export default function Scan() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const { colors } = useTheme();
  const router = useRouter();
  const [state, setState] = useState<"preview" | "loading" | "result">(
    "preview"
  );
  const [predictions, setPredictions] = useState<any[]>([]);

  const dishname = predictions.length > 0 ? predictions[0].class : null;
  // const ingredients = dishMacros[dishname];
  const [editMode, setEditMode] = useState(false);
  const [editedIngredients, setEditedIngredients] = useState<
    Record<string, number>
  >({});
  const [weight, setweight] = useState<number>(100);
  const detected = predictions.length > 0 ? predictions[0].class : null;

  // Track the base ingredient weights from dishMacros
  const [baseIngredients, setBaseIngredients] = useState<
    Record<string, number>
  >({});

  const [isLogging, setIsLogging] = useState(false);
  const [macroGoals, setMacroGoals] = useState({
    calories: 2000,
    protein: 150,
    fat: 65,
    carbs: 250,
  });

  const [dailyConsumed, setDailyConsumed] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  // State for macros (computed asynchronously from Firestore)
  const [macros, setMacros] = useState<{
    carbs: number;
    protein: number;
    fats: number;
    calories: number;
  } | null>(null);

  // Compute macros when ingredients change
  useEffect(() => {
    if (!detected || !editedIngredients) {
      setMacros(null);
      return;
    }

    // Import the function at the top if not already
    const { computeDishMacros } = require("../macros/compute_dish");

    computeDishMacros(detected, editedIngredients).then(
      (
        result: {
          carbs: number;
          protein: number;
          fats: number;
          calories: number;
        } | null
      ) => {
        if (result) {
          setMacros(result);
        }
      }
    );
  }, [detected, editedIngredients]);

  // Fetch user's daily macro goals
  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const macroRef = dbRef(db, `users/${userId}/macroGoals`);

    onValue(macroRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMacroGoals(data);
        console.log("Loaded macro goals:", data);
      }
    });

    return () => {
      off(macroRef);
    };
  }, []);

  // Fetch today's consumed macros
  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const foodLogsRef = dbRef(db, `foodLogs/${userId}`);

    const isSameDay = (d1: Date, d2: Date) => {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    onValue(foodLogsRef, (snapshot) => {
      const logs = snapshot.val();
      if (!logs) {
        setDailyConsumed({ calories: 0, protein: 0, fat: 0, carbs: 0 });
        return;
      }

      const today = new Date();
      let consumed = { calories: 0, protein: 0, fat: 0, carbs: 0 };

      Object.values(logs).forEach((log: any) => {
        const logDate = new Date(log.createdAt);
        if (isSameDay(today, logDate)) {
          consumed.calories += Number(log.calories) || 0;
          consumed.protein += Number(log.protein) || 0;
          consumed.fat += Number(log.fats) || 0;
          consumed.carbs += Number(log.carbs) || 0;
        }
      });

      setDailyConsumed(consumed);
    });

    return () => {
      off(foodLogsRef);
    };
  }, []);

  // Calculate smart recommendations for all 3 macros
  const getRecommendations = () => {
    if (!macros || weight === 0) return null;

    // IMPORTANT: macros are for TOTAL weight, convert to per 100g
    const macrosPer100g = {
      calories: (macros.calories / weight) * 100,
      protein: (macros.protein / weight) * 100,
      carbs: (macros.carbs / weight) * 100,
      fats: (macros.fats / weight) * 100,
    };

    // Calculate remaining goals for today
    const remaining = {
      calories: Math.max(0, macroGoals.calories - dailyConsumed.calories),
      protein: Math.max(0, macroGoals.protein - dailyConsumed.protein),
      fat: Math.max(0, macroGoals.fat - dailyConsumed.fat),
      carbs: Math.max(0, macroGoals.carbs - dailyConsumed.carbs),
    };

    // Calculate what CURRENT portion provides
    const currentPortionProvides = {
      protein: macros.protein,
      carbs: macros.carbs,
      fats: macros.fats,
    };

    // Calculate TOTAL grams of THIS food needed to fill REMAINING gap
    const totalGramsToFillGap = {
      protein:
        macrosPer100g.protein > 0 && remaining.protein > 0
          ? (remaining.protein / macrosPer100g.protein) * 100
          : 0,
      carbs:
        macrosPer100g.carbs > 0 && remaining.carbs > 0
          ? (remaining.carbs / macrosPer100g.carbs) * 100
          : 0,
      fat:
        macrosPer100g.fats > 0 && remaining.fat > 0
          ? (remaining.fat / macrosPer100g.fats) * 100
          : 0,
    };

    // Calculate additional grams needed (total to fill gap - current weight)
    const additionalGrams = {
      protein: Math.max(0, totalGramsToFillGap.protein - weight),
      carbs: Math.max(0, totalGramsToFillGap.carbs - weight),
      fat: Math.max(0, totalGramsToFillGap.fat - weight),
    };

    // Determine dominant macro (highest percentage)
    const total =
      macrosPer100g.protein + macrosPer100g.carbs + macrosPer100g.fats;
    const percentages = {
      protein: (macrosPer100g.protein / total) * 100,
      carbs: (macrosPer100g.carbs / total) * 100,
      fat: (macrosPer100g.fats / total) * 100,
    };

    let dominant: "protein" | "carbs" | "fat" = "protein";
    let maxPercent = percentages.protein;

    if (percentages.carbs > maxPercent) {
      dominant = "carbs";
      maxPercent = percentages.carbs;
    }
    if (percentages.fat > maxPercent) {
      dominant = "fat";
      maxPercent = percentages.fat;
    }

    // Helper to determine if recommendation is realistic
    const getRecommendationStatus = (grams: number) => {
      if (grams === 0) return "met";
      if (grams <= 500) return "realistic";
      if (grams <= 1000) return "high";
      return "unrealistic";
    };

    // Debug logging
    console.log("=== RECOMMENDATION DEBUG ===");
    console.log("Current weight:", weight);
    console.log("Macros (total for current weight):", macros);
    console.log("Macros per 100g:", macrosPer100g);
    console.log("Remaining goals:", remaining);
    console.log("Current portion provides:", currentPortionProvides);
    console.log("Total grams to fill gap:", totalGramsToFillGap);
    console.log("Additional needed:", additionalGrams);
    console.log("============================");

    return {
      protein: {
        remaining: remaining.protein,
        totalNeeded: Math.round(totalGramsToFillGap.protein),
        additionalNeeded: Math.round(additionalGrams.protein),
        isDominant: dominant === "protein",
        goalMet:
          remaining.protein === 0 ||
          currentPortionProvides.protein >= remaining.protein,
        status: getRecommendationStatus(totalGramsToFillGap.protein),
      },
      carbs: {
        remaining: remaining.carbs,
        totalNeeded: Math.round(totalGramsToFillGap.carbs),
        additionalNeeded: Math.round(additionalGrams.carbs),
        isDominant: dominant === "carbs",
        goalMet:
          remaining.carbs === 0 ||
          currentPortionProvides.carbs >= remaining.carbs,
        status: getRecommendationStatus(totalGramsToFillGap.carbs),
      },
      fat: {
        remaining: remaining.fat,
        totalNeeded: Math.round(totalGramsToFillGap.fat),
        additionalNeeded: Math.round(additionalGrams.fat),
        isDominant: dominant === "fat",
        goalMet:
          remaining.fat === 0 || currentPortionProvides.fats >= remaining.fat,
        status: getRecommendationStatus(totalGramsToFillGap.fat),
      },
    };
  };

  const recommendations = getRecommendations();

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

  // // When a dish is detected, sum ingredient grams and set as initial Weight
  // useEffect(() => {
  //   if (!detected) return;
  //   const recipe = dishMacros[detected as keyof typeof dishMacros];
  //   if (!recipe) return;

  //   const total = Object.values(recipe as Record<string, number>).reduce(
  //     (sum, g) => sum + g,
  //     0
  //   );
  //   setBaseIngredients(recipe as Record<string, number>);
  //   setEditedIngredients(recipe as Record<string, number>); // init to base
  //   setweight(total);
  // }, [detected]);

  // When Weight changes, scale all ingredients proportionally (min 1g unless Weight=0)
  const handleWeightChange = (newWeight: number) => {
    setweight(newWeight);

    if (!detected || Object.keys(baseIngredients).length === 0) return;

    const baseTotal = Object.values(baseIngredients).reduce((s, g) => s + g, 0);
    if (baseTotal === 0) return;

    const scaleFactor = newWeight / baseTotal;

    const scaled: Record<string, number> = {};
    Object.entries(baseIngredients).forEach(([ing, baseGrams]) => {
      let newVal = baseGrams * scaleFactor;

      // Min 1g unless Weight=0
      if (newWeight === 0) {
        newVal = 0;
      } else if (newVal < 1 && newVal > 0) {
        newVal = 1;
      }

      scaled[ing] = Math.round(newVal * 10) / 10; // 1 decimal
    });

    setEditedIngredients(scaled);
  };

  // // Compute macros when ingredients or weight change
  // useEffect(() => {
  //   if (!detected) return;

  //   const newMacros = computeDishMacros(detected, weight, editedIngredients);
  //   if (newMacros) {
  //     // Only update macros if the computation was successful
  //     setMacros(newMacros);
  //   }
  // }, [editedIngredients, weight]);

  useFocusEffect(
    React.useCallback(() => {
      setCapturedPhoto(null);
      setPredictions([]);
      setState("preview");
      setEditMode(false);
      setEditedIngredients({});
      setBaseIngredients({});
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

    setState("loading");

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
        setPredictions(data.predictions);

        const className = data.predictions[0].class;

        // Fetch dish data from Firestore
        await fetchDishFromFirestore(className);

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
      // const isDish = !!dishMacros[name as keyof typeof dishMacros];
      // const ingredientPayload =
      //   isDish && dishMacros[name as keyof typeof dishMacros]
      //     ? Object.entries(
      //         dishMacros[name as keyof typeof dishMacros] as Record<
      //           string,
      //           number
      //         >
      //       ).reduce(
      //         (acc, [ing, defaultGrams]) => {
      //           acc[ing] =
      //             editedIngredients[ing] !== undefined
      //               ? editedIngredients[ing]
      //               : defaultGrams;
      //           return acc;
      //         },
      //         {} as Record<string, number>
      //       )
      //     : undefined;
      // Use edited ingredients if available (user may have adjusted them)
      const ingredientPayload =
        Object.keys(editedIngredients).length > 0
          ? editedIngredients
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

  // Add this function after your useState declarations
  const fetchDishFromFirestore = async (className: string) => {
    try {
      console.log(` Fetching dish: ${className}`);

      // Get dish ingredients from Firestore
      const dishDoc = await getDoc(doc(FIRESTORE_DB, "dishes", className));

      if (!dishDoc.exists()) {
        Alert.alert("Not Found", "This dish is not in our database yet.");
        return;
      }

      const ingredientWeights = dishDoc.data().ingredients as Record<
        string,
        number
      >;

      // Calculate total weight
      const totalWeight = Object.values(ingredientWeights).reduce(
        (sum, g) => sum + g,
        0
      );

      // Set the ingredients and weight
      setBaseIngredients(ingredientWeights);
      setEditedIngredients(ingredientWeights);
      setweight(totalWeight);

      console.log(` Loaded ${className}:`, ingredientWeights);
    } catch (error) {
      console.error(" Firestore fetch error:", error);
      Alert.alert("Error", "Failed to load dish data from database.");
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

    if (state === "loading") {
      return (
        <SafeAreaView
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: colors.background }}
        >
          <View className="items-center">
            <View
              className="w-24 h-24 rounded-full justify-center items-center mb-6"
              style={{ backgroundColor: colors.primary + "20" }}
            >
              <ActivityIndicator size="large" color={colors.primary} />
            </View>

            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              Analyzing your food...
            </Text>

            <Text className="text-sm opacity-70" style={{ color: colors.text }}>
              Our AI is working its magic ✨
            </Text>
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
                <View
                  className="rounded-2xl p-6 mb-5"
                  style={{
                    backgroundColor: colors.surface,
                    shadowColor: colors.text === "#FFFFFF" ? "#fff" : "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 1,
                    shadowRadius: 5,
                    elevation: 5,
                  }}
                >
                  <Text
                    className="text-xl font-bold mb-4"
                    style={{ color: colors.text }}
                  >
                    Nutrition Facts
                  </Text>

                  <View className="flex-row justify-between">
                    <MacroCircle
                      label="Calories"
                      value={macros.calories}
                      total={macroGoals.calories}
                      color="#EF4444"
                      unit="cal"
                    />
                    <MacroCircle
                      label="Protein"
                      value={macros.protein}
                      total={macroGoals.protein}
                      color="#10B981"
                    />
                    <MacroCircle
                      label="Fat"
                      value={macros.fats}
                      total={macroGoals.fat}
                      color="#F97316"
                    />
                    <MacroCircle
                      label="Carbs"
                      value={macros.carbs}
                      total={macroGoals.carbs}
                      color="#3B82F6"
                    />
                  </View>

                  {/* Daily Progress
                  <View
                    className="mt-4 pt-4 border-t"
                    style={{ borderTopColor: colors.text + "20" }}
                  >
                    <Text
                      className="text-sm font-semibold mb-2"
                      style={{ color: colors.text }}
                    >
                      📊 Today's Progress
                    </Text>
                    <Text
                      className="text-xs mb-1"
                      style={{ color: colors.text, opacity: 0.8 }}
                    >
                      Calories: {dailyConsumed.calories.toFixed(0)} /{" "}
                      {macroGoals.calories} cal
                    </Text>
                    <Text
                      className="text-xs mb-1"
                      style={{ color: colors.text, opacity: 0.8 }}
                    >
                      Protein: {dailyConsumed.protein.toFixed(0)} /{" "}
                      {macroGoals.protein} g
                    </Text>
                    <Text
                      className="text-xs mb-1"
                      style={{ color: colors.text, opacity: 0.8 }}
                    >
                      Fat: {dailyConsumed.fat.toFixed(0)} / {macroGoals.fat} g
                    </Text>
                    <Text
                      className="text-xs"
                      style={{ color: colors.text, opacity: 0.8 }}
                    >
                      Carbs: {dailyConsumed.carbs.toFixed(0)} /{" "}
                      {macroGoals.carbs} g
                    </Text>
                  </View> */}

                  {/* Recommendation */}
                  {recommendations && (
                    <View
                      className="rounded-2xl p-5 mt-6 mb-5"
                      style={{
                        backgroundColor: colors.surface,
                        shadowColor:
                          colors.text === "#FFFFFF" ? "#fff" : "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 1,
                        shadowRadius: 5,
                        elevation: 5,
                      }}
                    >
                      <Text
                        className="text-lg font-bold mb-4"
                        style={{ color: colors.text }}
                      >
                        📊 Smart Recommendations
                      </Text>

                      {/* Protein Recommendation */}
                      <View
                        className="mb-4 p-4 rounded-xl"
                        style={{
                          backgroundColor: recommendations.protein.isDominant
                            ? "#10B98120"
                            : colors.background,
                          borderWidth: recommendations.protein.isDominant
                            ? 2
                            : 1,
                          borderColor: recommendations.protein.isDominant
                            ? "#10B981"
                            : colors.text + "20",
                        }}
                      >
                        <View className="flex-row items-center justify-between mb-2">
                          <Text
                            className="text-base font-bold"
                            style={{ color: "#10B981" }}
                          >
                            💪 PROTEIN
                            {recommendations.protein.isDominant && " ⭐"}
                          </Text>
                          {recommendations.protein.goalMet && (
                            <Text className="text-sm font-semibold text-green-500">
                              ✅ Goal Met!
                            </Text>
                          )}
                        </View>

                        <Text
                          className="text-xs mb-2"
                          style={{ color: colors.text, opacity: 0.8 }}
                        >
                          Daily Goal: {macroGoals.protein}g | Consumed:{" "}
                          {dailyConsumed.protein.toFixed(0)}g | Remaining:{" "}
                          {recommendations.protein.remaining.toFixed(0)}g
                        </Text>

                        {!recommendations.protein.goalMet && (
                          <View
                            className="p-2 rounded-lg"
                            style={{
                              backgroundColor:
                                recommendations.protein.status === "unrealistic"
                                  ? "#EF444420"
                                  : "#10B98110",
                            }}
                          >
                            {recommendations.protein.status === "realistic" && (
                              <Text
                                className="text-sm font-semibold"
                                style={{ color: "#10B981" }}
                              >
                                You need{" "}
                                {recommendations.protein.additionalNeeded}g more
                                for a total of{" "}
                                {recommendations.protein.totalNeeded}g of this
                                food to reach your protein goal
                              </Text>
                            )}
                            {recommendations.protein.status === "high" && (
                              <Text
                                className="text-sm font-semibold"
                                style={{ color: "#F97316" }}
                              >
                                You need{" "}
                                {recommendations.protein.additionalNeeded}g more
                                for a total of{" "}
                                {recommendations.protein.totalNeeded}g ⚠️{"\n"}
                                (That's a large portion - consider splitting
                                across meals)
                              </Text>
                            )}
                            {recommendations.protein.status ===
                              "unrealistic" && (
                              <Text
                                className="text-sm font-semibold"
                                style={{ color: "#EF4444" }}
                              >
                                ⚠️ This food is very low in protein{"\n"}Would
                                need {recommendations.protein.totalNeeded}g
                                total (unrealistic!){"\n"}
                                Consider protein-rich foods instead
                              </Text>
                            )}
                          </View>
                        )}
                      </View>

                      {/* Carbs Recommendation */}
                      <View
                        className="mb-4 p-4 rounded-xl"
                        style={{
                          backgroundColor: recommendations.carbs.isDominant
                            ? "#3B82F620"
                            : colors.background,
                          borderWidth: recommendations.carbs.isDominant ? 2 : 1,
                          borderColor: recommendations.carbs.isDominant
                            ? "#3B82F6"
                            : colors.text + "20",
                        }}
                      >
                        <View className="flex-row items-center justify-between mb-2">
                          <Text
                            className="text-base font-bold"
                            style={{ color: "#3B82F6" }}
                          >
                            🍚 CARBS
                            {recommendations.carbs.isDominant && " ⭐"}
                          </Text>
                          {recommendations.carbs.goalMet && (
                            <Text className="text-sm font-semibold text-green-500">
                              ✅ Goal Met!
                            </Text>
                          )}
                        </View>

                        <Text
                          className="text-xs mb-2"
                          style={{ color: colors.text, opacity: 0.8 }}
                        >
                          Daily Goal: {macroGoals.carbs}g | Consumed:{" "}
                          {dailyConsumed.carbs.toFixed(0)}g | Remaining:{" "}
                          {recommendations.carbs.remaining.toFixed(0)}g
                        </Text>

                        {!recommendations.carbs.goalMet && (
                          <View
                            className="p-2 rounded-lg"
                            style={{
                              backgroundColor:
                                recommendations.carbs.status === "unrealistic"
                                  ? "#EF444420"
                                  : "#3B82F610",
                            }}
                          >
                            {recommendations.carbs.status === "realistic" && (
                              <Text
                                className="text-sm font-semibold"
                                style={{ color: "#3B82F6" }}
                              >
                                You need{" "}
                                {recommendations.carbs.additionalNeeded}g more
                                for a total of{" "}
                                {recommendations.carbs.totalNeeded}g of this
                                food to reach your carb goal
                              </Text>
                            )}
                            {recommendations.carbs.status === "high" && (
                              <Text
                                className="text-sm font-semibold"
                                style={{ color: "#F97316" }}
                              >
                                You need{" "}
                                {recommendations.carbs.additionalNeeded}g more
                                for a total of{" "}
                                {recommendations.carbs.totalNeeded}g ⚠️{"\n"}
                                (That's a large portion - consider splitting
                                across meals)
                              </Text>
                            )}
                            {recommendations.carbs.status === "unrealistic" && (
                              <Text
                                className="text-sm font-semibold"
                                style={{ color: "#EF4444" }}
                              >
                                ⚠️ This food is very low in carbs{"\n"}Would
                                need {recommendations.carbs.totalNeeded}g total
                                (unrealistic!){"\n"}
                                Consider carb-rich foods like rice, bread, or
                                pasta
                              </Text>
                            )}
                          </View>
                        )}
                      </View>

                      {/* Fat Recommendation */}
                      <View
                        className="p-4 rounded-xl"
                        style={{
                          backgroundColor: recommendations.fat.isDominant
                            ? "#F9731620"
                            : colors.background,
                          borderWidth: recommendations.fat.isDominant ? 2 : 1,
                          borderColor: recommendations.fat.isDominant
                            ? "#F97316"
                            : colors.text + "20",
                        }}
                      >
                        <View className="flex-row items-center justify-between mb-2">
                          <Text
                            className="text-base font-bold"
                            style={{ color: "#F97316" }}
                          >
                            🥑 FAT
                            {recommendations.fat.isDominant && " ⭐"}
                          </Text>
                          {recommendations.fat.goalMet && (
                            <Text className="text-sm font-semibold text-green-500">
                              ✅ Goal Met!
                            </Text>
                          )}
                        </View>

                        <Text
                          className="text-xs mb-2"
                          style={{ color: colors.text, opacity: 0.8 }}
                        >
                          Daily Goal: {macroGoals.fat}g | Consumed:{" "}
                          {dailyConsumed.fat.toFixed(0)}g | Remaining:{" "}
                          {recommendations.fat.remaining.toFixed(0)}g
                        </Text>

                        {!recommendations.fat.goalMet && (
                          <View
                            className="p-2 rounded-lg"
                            style={{
                              backgroundColor:
                                recommendations.fat.status === "unrealistic"
                                  ? "#EF444420"
                                  : "#F9731610",
                            }}
                          >
                            {recommendations.fat.status === "realistic" && (
                              <Text
                                className="text-sm font-semibold"
                                style={{ color: "#F97316" }}
                              >
                                You need {recommendations.fat.additionalNeeded}g
                                more for a total of{" "}
                                {recommendations.fat.totalNeeded}g of this food
                                to reach your fat goal
                              </Text>
                            )}
                            {recommendations.fat.status === "high" && (
                              <Text
                                className="text-sm font-semibold"
                                style={{ color: "#F97316" }}
                              >
                                You need {recommendations.fat.additionalNeeded}g
                                more for a total of{" "}
                                {recommendations.fat.totalNeeded}g ⚠️{"\n"}
                                (That's a large portion - consider splitting
                                across meals)
                              </Text>
                            )}
                            {recommendations.fat.status === "unrealistic" && (
                              <Text
                                className="text-sm font-semibold"
                                style={{ color: "#EF4444" }}
                              >
                                ⚠️ This food is very low in fat{"\n"}Would need{" "}
                                {recommendations.fat.totalNeeded}g total
                                (unrealistic!){"\n"}
                                Consider healthy fats like avocado, nuts, or
                                olive oil
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <Text className="text-center" style={{ color: colors.text }}>
                  No macros found for this food.
                </Text>
              )}

              {Object.keys(editedIngredients).length > 0 ? (
                <View
                  className="rounded-xl p-5 mb-5 max-h-[200px]"
                  style={{ backgroundColor: colors.surface }}
                >
                  <TouchableOpacity
                    onPress={() => {
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
                    {Object.entries(editedIngredients).map(
                      ([ingredient, weight], index) => {
                        const currentValue = weight;
                        return editMode ? (
                          <View
                            key={`${ingredient}-${index}`}
                            className="flex-row items-center mb-1.5"
                          >
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
                                const newWeight = Math.max(
                                  0,
                                  Number(text) || 0
                                );
                                setEditedIngredients((prev) => {
                                  const updated = {
                                    ...prev,
                                    [ingredient]: newWeight,
                                  };

                                  // Recalc total Weight from all edited ingredients
                                  const newTotal = Object.values(
                                    updated
                                  ).reduce((sum, g) => sum + g, 0);
                                  setweight(newTotal);

                                  // Update base so future scaling uses edited values
                                  setBaseIngredients(updated);

                                  return updated;
                                });
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
                onChangeText={(text) =>
                  handleWeightChange(Math.max(0, Number(text) || 0))
                }
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