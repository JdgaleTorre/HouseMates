import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut as firebaseSignOut, type User } from 'firebase/auth';

import { auth } from './config';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// TODO: Apple Sign-In is required before App Store submission (App Store
// Review Guideline 4.8, since Google Sign-In is offered) -- not built yet.
export async function signInWithGoogle() {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  if (response.type !== 'success' || !response.data.idToken) {
    throw new Error('Google sign-in was cancelled.');
  }
  const credential = GoogleAuthProvider.credential(response.data.idToken);
  await signInWithCredential(auth, credential);
}

export async function signOut() {
  await GoogleSignin.signOut();
  await firebaseSignOut(auth);
}
