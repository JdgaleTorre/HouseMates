import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../firebase/config';
import { NeedsItem } from '../types';

export function useNeedsList(houseId: string | null) {
  const [items, setItems] = useState<NeedsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!houseId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const itemsQuery = query(collection(db, 'houses', houseId, 'items'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      setItems(
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            name: data.name,
            createdBy: data.createdBy,
            createdByName: data.createdByName,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          };
        })
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [houseId]);

  return { items, loading };
}
