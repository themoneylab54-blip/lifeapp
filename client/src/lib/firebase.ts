import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
// Note: These are public API keys and are safe to expose in client-side code
const firebaseConfig = {
  apiKey: "AIzaSyB8TGskWNo3zSZv7Ubtax_1v_W-9nFvkIs",
  authDomain: "mylifeapp-6b2fd.firebaseapp.com",
  projectId: "mylifeapp-6b2fd",
  storageBucket: "mylifeapp-6b2fd.firebasestorage.app",
  messagingSenderId: "11401344110",
  appId: "1:11401344110:web:85d2475ce9105e72d8227f",
  measurementId: "G-XQNTLT5GKC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
