import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  inMemoryPersistence,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDc4bWUmpwvOdMiws0jp4xnkX-UZ65IDXo",
  authDomain: "rentify-my-shop.firebaseapp.com",
  projectId: "rentify-my-shop",
  storageBucket: "rentify-my-shop.appspot.com",
  messagingSenderId: "181989145015",
  appId: "1:181989145015:web:21e4f89907ebc4be0f1032",
};

const app = initializeApp(firebaseConfig);

// Use either `inMemoryPersistence` or AsyncStorage-based persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
