import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from './config';

export function addItem(
  houseId: string,
  name: string,
  createdBy: string,
  createdByName: string,
  urgent: boolean
) {
  return addDoc(collection(db, 'houses', houseId, 'items'), {
    name,
    createdBy,
    createdByName,
    createdAt: serverTimestamp(),
    bought: false,
    urgent,
  });
}

export function setItemBought(houseId: string, itemId: string, bought: boolean) {
  return updateDoc(doc(db, 'houses', houseId, 'items', itemId), { bought });
}

export function toggleItemUrgent(houseId: string, itemId: string, urgent: boolean) {
  return updateDoc(doc(db, 'houses', houseId, 'items', itemId), { urgent });
}

export function deleteItem(houseId: string, itemId: string) {
  return deleteDoc(doc(db, 'houses', houseId, 'items', itemId));
}
