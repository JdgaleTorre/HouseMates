import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../firebase/config';

export function useUnreadMessages(houseId: string | null, lastReadAt: number) {
  const [latestMessageAt, setLatestMessageAt] = useState(0);

  useEffect(() => {
    if (!houseId) {
      setLatestMessageAt(0);
      return;
    }
    const latestQuery = query(collection(db, 'houses', houseId, 'messages'), orderBy('createdAt', 'desc'), limit(1));
    const unsubscribe = onSnapshot(latestQuery, (snapshot) => {
      setLatestMessageAt(snapshot.docs[0]?.data().createdAt?.toMillis?.() ?? 0);
    });
    return unsubscribe;
  }, [houseId]);

  return latestMessageAt > lastReadAt;
}
