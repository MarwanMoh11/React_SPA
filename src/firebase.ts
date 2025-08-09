// src/firebase.ts
// Firebase initialization for the app. In tests, the service layer can avoid using this by
// falling back to mock APIs, keeping tests hermetic and fast.
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';

// Read Firebase config from Vite environment variables. Never commit secrets.
// In test environment, allow dummy placeholders to avoid failing tests that import auth context.
const isTest = typeof process !== 'undefined' && (process as any)?.env?.NODE_ENV === 'test';

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

const dummyTestConfig = {
  apiKey: 'test-api-key',
  authDomain: 'test-app.firebaseapp.com',
  projectId: 'test-project',
  storageBucket: 'test-project.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:0000000000000000000000',
  measurementId: 'G-TEST000000',
};

function resolveFirebaseConfig() {
  const cfg = isTest ? { ...dummyTestConfig, ...envConfig } : envConfig;
  // In non-test env, ensure required fields exist
  const requiredKeys: (keyof typeof cfg)[] = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];
  if (!isTest) {
    const missing = requiredKeys.filter((k) => !cfg[k]);
    if (missing.length) {
      throw new Error(
        `Missing Firebase environment variables: ${missing
          .map((k) => `VITE_FIREBASE_${k.toUpperCase()}`)
          .join(', ')}. Please create a .env file (see .env.example).`
      );
    }
  }
  return cfg as {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
}

const firebaseConfig = resolveFirebaseConfig();

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
