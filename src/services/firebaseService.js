import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Firebase configuration
// Prioritizes environment variables for production security (VITE_ prefix required for Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy...", 
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lifebridge-alert.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lifebridge-alert",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lifebridge-alert.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

let db = null;

export const initFirebase = (customConfig) => {
  try {
    const app = initializeApp(customConfig || firebaseConfig);
    db = getFirestore(app);
    return true;
  } catch {
    console.warn("Firebase initialization skipped (No config found). Scoring remains functional.");
    return false;
  }
};

/**
 * Logs a resolved emergency event to the Global disaster feed.
 */
export async function logEmergencyEvent(eventData) {
  if (!db) return;

  try {
    await addDoc(collection(db, "emergency_events"), {
      ...eventData,
      timestamp: serverTimestamp(),
      resolved: true
    });
  } catch (e) {
    console.error("Failed to log disaster event:", e);
  }
}
