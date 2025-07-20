module.exports = {
  expo: {
    name: "SnapNutrient",
    slug: "snapnutrient",
    version: "1.0.0",
    android: {
      package: "com.yourcompany.snapnutrient",
      googleServicesFile: "./google-services.json"
    },
    ios: {
      bundleIdentifier: "com.yourcompany.snapnutrient",
      googleServicesFile: "./GoogleService-Info.plist"
    },
    plugins: [
      "@react-native-firebase/app"
    ],
    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      eas: {
        projectId: "snap-nutrient-app"
      }
    }
  }
};