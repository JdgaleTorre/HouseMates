import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { db } from './config';

export function addMessage(houseId: string, text: string, createdBy: string, createdByName: string) {
  return addDoc(collection(db, 'houses', houseId, 'messages'), {
    text,
    createdBy,
    createdByName,
    createdAt: serverTimestamp(),
  });
}
