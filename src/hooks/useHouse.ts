import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../firebase/config';
import { House } from '../types';

export function useHouse(houseId: string | null) {
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!houseId) {
      setHouse(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = onSnapshot(doc(db, 'houses', houseId), (snapshot) => {
      if (!snapshot.exists()) {
        setHouse(null);
        setLoading(false);
        return;
      }
      const data = snapshot.data();
      setHouse({
        id: snapshot.id,
        name: data.name,
        inviteCode: data.inviteCode,
        createdBy: data.createdBy,
        memberIds: data.memberIds ?? [],
        createdAt: data.createdAt?.toMillis?.() ?? 0,
      });
      setLoading(false);
    });
    return unsubscribe;
  }, [houseId]);

  return { house, loading };
}
