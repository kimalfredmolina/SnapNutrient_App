module.exports = {
  expo: {
    name: "SnapNutrient",
    slug: "snapnutrient",
    version: "1.0.0",
    userInterfaceStyle: "automatic", // Add this line
    android: {
      package: "com.snapnutrient.app",
      versionCode: 1,
      googleServicesFile: "./google-services.json",
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    ios: {
      bundleIdentifier: "com.yourcompany.snapnutrient",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        NSCameraUsageDescription:
          "This app uses the camera to scan food items and analyze nutrition",
      },
    },
    plugins: [
      "@react-native-firebase/app",
      [
        "expo-camera",
        {
          "cameraPermission": "Allow SnapNutrient to access your camera",
          "microphonePermission": "Allow SnapNutrient to access your microphone"
        }
      ]
    ],
    scheme: "com.snapnutrient.app",
    extra: { 
      eas: {

        projectId:  "7506c756-aa5e-4912-925f-420f262d9581" 
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,

      EXPO_PUBLIC_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
      EXPO_PUBLIC_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      EXPO_PUBLIC_GOOGLE_CLIENT_SECRET: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET,
    },
  },
};