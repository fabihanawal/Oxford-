/**
 * Oxford Model School - Firebase Configuration & Helper Module
 * Location: Badalgachhi Dak Bungalow North Side, Badalgachhi, Naogaon
 * Slogan: "আদর্শ শিক্ষা, সুন্দর আগামীর প্রত্যয়।"
 * Authorized Super Admin: rstsbd@gmail.com
 *
 * This configuration is automatically synchronized with the project's
 * Firestore database and Google Authentication provider.
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  projectId: "gen-lang-client-0468355094",
  appId: "1:363426934066:web:d5a0b1ea1579550e09fb2b",
  apiKey: "AIzaSyDJAIFqvkon0sbH9n_lpnSAMYsGOjFu44E",
  authDomain: "gen-lang-client-0468355094.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-9223a23a-9f42-4a14-8ea7-92d06d2bea18",
  storageBucket: "gen-lang-client-0468355094.firebasestorage.app",
  messagingSenderId: "363426934066",
  oAuthClientId: "363426934066-ch39bihfj9lvfk32rccmvfuuniqevjev.apps.googleusercontent.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Authentication with Google Auth Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Designated Super Admin Email
export const SUPER_ADMIN_EMAIL = "rstsbd@gmail.com";
