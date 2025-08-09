// src/firebase.ts
// Firebase initialization for the app. In tests, the service layer can avoid using this by
// falling back to mock APIs, keeping tests hermetic and fast.
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

// NOTE: For production security, consider moving these to Vite env vars (VITE_FIREBASE_*)
// and not committing them. Keeping inline as requested to make the app fully functional now.
const firebaseConfig = {
  apiKey: 'AIzaSyA2nxJ5ryTehwy7NL5exOIgwzkggEn4NHc',
  authDomain: 'everythingapp-92526.firebaseapp.com',
  projectId: 'everythingapp-92526',
  storageBucket: 'everythingapp-92526.firebasestorage.app',
  messagingSenderId: '365721620352',
  appId: '1:365721620352:web:f02fbac61f18638c587b65',
  measurementId: 'G-9M0X18C23E',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}

// Initialize analytics only in browser and when supported (avoids SSR/test issues)
export async function getAppAnalytics(): Promise<Analytics | null> {
  if (analytics) return analytics;
  if (typeof window === 'undefined') return null;
  try {
    const supported = await isSupported();
    if (supported) {
      analytics = getAnalytics(getFirebaseApp());
      return analytics;
    }
  } catch (e) {
    // ignore analytics failures
    console.warn('[firebase] Analytics not supported or failed to init', e);
  }
  return null;
}

export function getAuthInstance(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export { app, db, analytics, auth };
