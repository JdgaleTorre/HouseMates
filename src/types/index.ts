export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: number;
}

export interface MemberProfile {
  displayName: string | null;
  photoURL: string | null;
}

export interface House {
  id: string;
  name: string;
  inviteCode: string;
  createdBy: string;
  memberIds: string[];
  memberProfiles: Record<string, MemberProfile>;
  createdAt: number;
  lastReadMessagesAt: Record<string, number>;
}

export interface NeedsItem {
  id: string;
  name: string;
  createdBy: string;
  createdByName: string;
  createdAt: number;
  bought: boolean;
  urgent: boolean;
}

export interface Message {
  id: string;
  text: string;
  createdBy: string;
  createdByName: string;
  createdAt: number;
}

export type CleaningFrequency = 'weekly' | 'biweekly' | 'monthly' | 'custom';

export interface CleaningSchedule {
  assignedMemberIds: string[];
  frequency: CleaningFrequency;
  customDays?: number;
  anchorAt: number;
  turnIndex?: number;
  lastCompletedAt?: number | null;
  lastCompletedBy?: string | null;
}

export interface Section {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
  cleaning: CleaningSchedule | null;
}
