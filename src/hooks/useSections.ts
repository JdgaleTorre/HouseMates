import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../firebase/config';
import { Section } from '../types';

export function useSections(houseId: string | null) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!houseId) {
      setSections([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const sectionsQuery = query(collection(db, 'houses', houseId, 'sections'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(sectionsQuery, (snapshot) => {
      setSections(
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            name: data.name,
            createdBy: data.createdBy,
            createdAt: data.createdAt?.toMillis?.() ?? 0,
          };
        })
      );
      setLoading(false);
    });
    return unsubscribe;
  }, [houseId]);

  return { sections, loading };
}
