import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { Platform } from 'react-native';

import { auth } from './config';
import { ensureUserProfile } from './users';

// The native Google Sign-In SDK has no web implementation; only configure/use
// it off-web and use Firebase's browser-based popup flow on web instead.
if (Platform.OS !== 'web') {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
}

export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// TODO: Apple Sign-In is required before App Store submission (App Store
// Review Guideline 4.8, since Google Sign-In is offered) -- not built yet.
export async function signInWithGoogle() {
  if (Platform.OS === 'web') {
    await signInWithPopup(auth, new GoogleAuthProvider());
    return;
  }
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  if (response.type !== 'success' || !response.data.idToken) {
    throw new Error('Google sign-in was cancelled.');
  }
  const credential = GoogleAuthProvider.credential(response.data.idToken);
  await signInWithCredential(auth, credential);
}

function friendlyAuthErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/invalid-email':
      return "That email address doesn't look right.";
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return err instanceof Error ? err.message : 'Something went wrong, please try again.';
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    throw new Error(friendlyAuthErrorMessage(err));
  }
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // updateProfile mutates credential.user.displayName in place once it resolves,
    // so the explicit ensureUserProfile call below is guaranteed to see the real
    // name regardless of whether onAuthStateChanged's own auto-triggered
    // ensureUserProfile call (fired by createUserWithEmailAndPassword) already
    // ran with displayName still null.
    await updateProfile(credential.user, { displayName });
    await ensureUserProfile(credential.user);
  } catch (err) {
    throw new Error(friendlyAuthErrorMessage(err));
  }
}

export async function updateUserDisplayInfo(
  user: User,
  updates: { displayName?: string | null; photoURL?: string | null }
) {
  try {
    await updateProfile(user, updates);
  } catch (err) {
    throw new Error(friendlyAuthErrorMessage(err));
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    throw new Error(friendlyAuthErrorMessage(err));
  }
}

export async function signOut() {
  // Best-effort: clears the native Google session cache if there was one.
  // Must not block the Firebase sign-out below for users who never signed
  // in with Google in the first place (e.g. email/password users).
  if (Platform.OS !== 'web') {
    try {
      await GoogleSignin.signOut();
    } catch {
      // ignore -- no Google session to clear
    }
  }
  await firebaseSignOut(auth);
}
