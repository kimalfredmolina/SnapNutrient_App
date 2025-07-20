module.exports = {
  expo: {
    name: "SnapNutrient",
    slug: "snapnutrient",
    version: "1.0.0",
    android: {
      package: "com.snapnutrient.app",
      versionCode: 1,
      googleServicesFile: "./google-services.json"
    },
    ios: {
      bundleIdentifier: "com.yourcompany.snapnutrient",
      googleServicesFile: "./GoogleService-Info.plist"
    },
    plugins: [
      "@react-native-firebase/app"
    ],
    scheme: 'com.snapnutrient.app',
    extra: {
      eas: {
        projectId: "7506c756-aa5e-4912-925f-420f262d9581"
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID
    }
  }
};