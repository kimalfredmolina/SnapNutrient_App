import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import Constants from "expo-constants";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey:
    Constants.expoConfig?.extra?.firebaseApiKey ?? process.env.FIREBASE_API_KEY,
  authDomain:
    Constants.expoConfig?.extra?.firebaseAuthDomain ??
    process.env.FIREBASE_AUTH_DOMAIN,
  projectId:
    Constants.expoConfig?.extra?.firebaseProjectId ??
    process.env.FIREBASE_PROJECT_ID,
  storageBucket:
    Constants.expoConfig?.extra?.firebaseStorageBucket ??
    process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    Constants.expoConfig?.extra?.firebaseMessagingSenderId ??
    process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId:
    Constants.expoConfig?.extra?.firebaseAppId ?? process.env.FIREBASE_APP_ID,
  measurementId:
    Constants.expoConfig?.extra?.firebaseMeasurementId ??
    process.env.FIREBASE_MEASUREMENT_ID,
  databaseURL:
    "https://snap-nutrient-app-default-rtdb.asia-southeast1.firebasedatabase.app", // Make sure this is correct
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const FIRESTORE_DB = getFirestore(app);
