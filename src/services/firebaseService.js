import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Firebase configuration placeholder
// This allows the app to be future-proof for Real-time Disaster Feed.
const firebaseConfig = {
  apiKey: "AIzaSy...", // Will be overridden by user or proxy
  authDomain: "lifebridge-alert.firebaseapp.com",
  projectId: "lifebridge-alert",
  storageBucket: "lifebridge-alert.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let db = null;

export const initFirebase = (customConfig) => {
  try {
    const app = initializeApp(customConfig || firebaseConfig);
    db = getFirestore(app);
    return true;
  } catch (e) {
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
