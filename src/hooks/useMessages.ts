import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../firebase/config';
import { Message } from '../types';

export function useMessages(houseId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!houseId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const messagesQuery = query(collection(db, 'houses', houseId, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const next = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          text: data.text,
          createdBy: data.createdBy,
          createdByName: data.createdByName,
          createdAt: data.createdAt?.toMillis?.() ?? 0,
        };
      });
      setMessages(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [houseId]);

  return { messages, loading };
}
