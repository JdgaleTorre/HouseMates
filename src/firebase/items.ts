import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

import { db } from './config';

export function addItem(houseId: string, name: string, createdBy: string, createdByName: string) {
  return addDoc(collection(db, 'houses', houseId, 'items'), {
    name,
    createdBy,
    createdByName,
    createdAt: serverTimestamp(),
  });
}

export function markItemBought(houseId: string, itemId: string) {
  return deleteDoc(doc(db, 'houses', houseId, 'items', itemId));
}
