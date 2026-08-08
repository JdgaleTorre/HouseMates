import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useAuth } from './AuthContext';
import { subscribeToUserProfile } from '../firebase/users';

interface HouseContextValue {
  currentHouseId: string | null;
  loading: boolean;
}

const HouseContext = createContext<HouseContextValue>({ currentHouseId: null, loading: true });

export function HouseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentHouseId, setCurrentHouseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCurrentHouseId(null);
      setLoading(true);
      return;
    }
    const unsubscribe = subscribeToUserProfile(user.uid, (profile) => {
      setCurrentHouseId(profile?.currentHouseId ?? null);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  return <HouseContext.Provider value={{ currentHouseId, loading }}>{children}</HouseContext.Provider>;
}

export function useHouseContext() {
  return useContext(HouseContext);
}
