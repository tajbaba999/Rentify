import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
// import { getReactNativePersistence } from "firebase/auth/react-native";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { inMemoryPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDc4bWUmpwvOdMiws0jp4xnkX-UZ65IDXo",
  authDomain: "rentify-my-shop.firebaseapp.com",
  projectId: "rentify-my-shop",
  storageBucket: "rentify-my-shop.appspot.com",
  messagingSenderId: "181989145015",
  appId: "1:181989145015:web:21e4f89907ebc4be0f1032",
};

const app = initializeApp(firebaseConfig);

// Initialize auth with React Native persistence using AsyncStorage.
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
// });
const auth = initializeAuth(app, { persistence: inMemoryPersistence });

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
