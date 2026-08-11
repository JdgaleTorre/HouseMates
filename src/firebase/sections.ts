import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { db } from './config';
import { CleaningSchedule } from '../types';

export function addSection(houseId: string, name: string, createdBy: string) {
  return addDoc(collection(db, 'houses', houseId, 'sections'), {
    name,
    createdBy,
    createdAt: serverTimestamp(),
    cleaning: null,
  });
}

export function deleteSection(houseId: string, sectionId: string) {
  return deleteDoc(doc(db, 'houses', houseId, 'sections', sectionId));
}

export function setCleaningSchedule(houseId: string, sectionId: string, schedule: CleaningSchedule | null) {
  return updateDoc(doc(db, 'houses', houseId, 'sections', sectionId), { cleaning: schedule });
}

export function markSectionCleaned(
  houseId: string,
  sectionId: string,
  schedule: CleaningSchedule,
  completedBy: string
) {
  const n = schedule.assignedMemberIds.length;
  const nextTurnIndex = n > 0 ? ((schedule.turnIndex ?? 0) + 1) % n : 0;
  return updateDoc(doc(db, 'houses', houseId, 'sections', sectionId), {
    'cleaning.turnIndex': nextTurnIndex,
    'cleaning.lastCompletedAt': Date.now(),
    'cleaning.lastCompletedBy': completedBy,
  });
}
