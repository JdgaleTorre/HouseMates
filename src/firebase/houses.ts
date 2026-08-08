import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import { db } from './config';
import { generateInviteCode } from '../utils/inviteCode';

const MAX_CODE_ATTEMPTS = 5;

class InviteCodeCollisionError extends Error {}

export async function createHouse(name: string, uid: string): Promise<{ houseId: string; inviteCode: string }> {
  for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
    const inviteCode = generateInviteCode();
    try {
      const houseId = await runTransaction(db, async (tx) => {
        const inviteCodeRef = doc(db, 'inviteCodes', inviteCode);
        const existing = await tx.get(inviteCodeRef);
        if (existing.exists()) {
          throw new InviteCodeCollisionError();
        }

        const houseRef = doc(collection(db, 'houses'));
        tx.set(houseRef, {
          name,
          inviteCode,
          createdBy: uid,
          memberIds: [uid],
          createdAt: serverTimestamp(),
        });
        tx.set(inviteCodeRef, { houseId: houseRef.id });
        return houseRef.id;
      });

      await setDoc(doc(db, 'users', uid), { currentHouseId: houseId }, { merge: true });
      return { houseId, inviteCode };
    } catch (error) {
      if (error instanceof InviteCodeCollisionError) {
        continue;
      }
      throw error;
    }
  }
  throw new Error('Could not generate a unique invite code, please try again.');
}

export async function joinHouseByCode(code: string, uid: string): Promise<string> {
  const inviteCodeSnap = await getDoc(doc(db, 'inviteCodes', code.trim().toUpperCase()));
  if (!inviteCodeSnap.exists()) {
    throw new Error('That invite code was not found.');
  }

  const { houseId } = inviteCodeSnap.data() as { houseId: string };
  await updateDoc(doc(db, 'houses', houseId), { memberIds: arrayUnion(uid) });
  await setDoc(doc(db, 'users', uid), { currentHouseId: houseId }, { merge: true });
  return houseId;
}
