export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  currentHouseId: string | null;
  createdAt: number;
}

export interface House {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  memberIds: string[];
  createdAt: number;
}

export interface NeedsItem {
  id: string;
  name: string;
  createdBy: string;
  createdByName: string;
  createdAt: number;
}
