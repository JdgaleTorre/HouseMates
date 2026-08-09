import type { User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from 'react';

import {
  resetPassword,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
  subscribeToAuthChanges,
} from '../firebase/auth';
import { ensureUserProfile } from '../firebase/users';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  signInError: string | null;
  resetEmailSent: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearSignInError: () => void;
  signOut: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signingIn: false,
  signInError: null,
  resetEmailSent: false,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  resetPassword: async () => {},
  clearSignInError: () => {},
  signOut: async () => {},
  refreshUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [, bumpUser] = useReducer((c) => c + 1, 0);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (nextUser) => {
      if (nextUser) {
        await ensureUserProfile(nextUser);
      }
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function runAuthAction(action: () => Promise<void>) {
    setSigningIn(true);
    setSignInError(null);
    setResetEmailSent(false);
    try {
      await action();
    } catch (err) {
      setSignInError(err instanceof Error ? err.message : 'Could not sign in, please try again.');
    } finally {
      setSigningIn(false);
    }
  }

  function handleSignInWithGoogle() {
    return runAuthAction(signInWithGoogle);
  }

  function handleSignInWithEmail(email: string, password: string) {
    return runAuthAction(() => signInWithEmail(email, password));
  }

  function handleSignUpWithEmail(email: string, password: string, displayName: string) {
    return runAuthAction(() => signUpWithEmail(email, password, displayName));
  }

  async function handleResetPassword(email: string) {
    setSigningIn(true);
    setSignInError(null);
    setResetEmailSent(false);
    try {
      await resetPassword(email);
      setResetEmailSent(true);
    } catch (err) {
      setSignInError(err instanceof Error ? err.message : 'Could not send reset email, please try again.');
    } finally {
      setSigningIn(false);
    }
  }

  function clearSignInError() {
    setSignInError(null);
    setResetEmailSent(false);
  }

  function refreshUser() {
    bumpUser();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signingIn,
        signInError,
        resetEmailSent,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithEmail: handleSignInWithEmail,
        signUpWithEmail: handleSignUpWithEmail,
        resetPassword: handleResetPassword,
        clearSignInError,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
