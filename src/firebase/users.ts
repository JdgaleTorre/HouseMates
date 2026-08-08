import { doc, DocumentData, onSnapshot, serverTimestamp, setDoc, Unsubscribe } from 'firebase/firestore';
import type { User } from 'firebase/auth';

import { db } from './config';
import { UserProfile } from '../types';

export async function ensureUserProfile(user: User) {
  await setDoc(
    doc(db, 'users', user.uid),
    {
      displayName: user.displayName ?? null,
      email: user.email ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function subscribeToUserProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void
): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    const data = snapshot.data() as DocumentData;
    callback({
      uid: snapshot.id,
      displayName: data.displayName ?? null,
      email: data.email ?? null,
      photoURL: data.photoURL ?? null,
      currentHouseId: data.currentHouseId ?? null,
      createdAt: data.createdAt?.toMillis?.() ?? 0,
    });
  });
}
