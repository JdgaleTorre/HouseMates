import { addDoc, collection, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

import { db } from './config';

export function addSection(houseId: string, name: string, createdBy: string) {
  return addDoc(collection(db, 'houses', houseId, 'sections'), {
    name,
    createdBy,
    createdAt: serverTimestamp(),
  });
}

export function deleteSection(houseId: string, sectionId: string) {
  return deleteDoc(doc(db, 'houses', houseId, 'sections', sectionId));
}
