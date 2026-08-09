import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
// @ts-expect-error -- getReactNativePersistence is only declared in @firebase/auth's
// "react-native" export condition types, which its flat top-level "types" field
// shadows for tsc; Metro resolves the real RN build correctly at runtime regardless.
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// The RN persistence layer (AsyncStorage-backed) doesn't apply on web, and
// initializeAuth() may only be called once per app -- use the browser SDK's
// own default (IndexedDB-backed) persistence there instead.
const auth: Auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });

const db = getFirestore(app);

export { app, auth, db };
