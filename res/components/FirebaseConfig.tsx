// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1qw_yeVNbGFhkJvVrHdJv2ASj9G8J6bo",
  authDomain: "ecommpos-36c03.firebaseapp.com",
  projectId: "ecommpos-36c03",
  storageBucket: "ecommpos-36c03.appspot.com",
  messagingSenderId: "667014035138",
  appId: "1:667014035138:web:1e717b58a1a1048d766d5b",
  measurementId: "G-VDG68Q9CX4"
};

// Initialize Firebase

export const firebase_app = initializeApp(firebaseConfig);
// export const firebase_app_auth = getAuth(firebase_app);
export const firebase_app_auth = initializeAuth(firebase_app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
// export const firebase_app_auth = getAuth(firebase_app);
export const firebase_db = getFirestore(firebase_app);