import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../firebase/config';
import { House } from '../types';

export function useUserHouses(uid: string | null) {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setHouses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const housesQuery = query(collection(db, 'houses'), where('memberIds', 'array-contains', uid));
    const unsubscribe = onSnapshot(housesQuery, (snapshot) => {
      const next = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          name: data.name,
          inviteCode: data.inviteCode,
          createdBy: data.createdBy,
          memberIds: data.memberIds ?? [],
          createdAt: data.createdAt?.toMillis?.() ?? 0,
        };
      });
      next.sort((a, b) => a.createdAt - b.createdAt);
      setHouses(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [uid]);

  return { houses, loading };
}
