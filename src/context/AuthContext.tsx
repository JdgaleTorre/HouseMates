import type { User } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { signInWithGoogle, signOut, subscribeToAuthChanges } from '../firebase/auth';
import { ensureUserProfile } from '../firebase/users';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  signInError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signingIn: false,
  signInError: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

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

  async function handleSignIn() {
    setSigningIn(true);
    setSignInError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setSignInError(err instanceof Error ? err.message : 'Could not sign in, please try again.');
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signingIn, signInError, signInWithGoogle: handleSignIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
