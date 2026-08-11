import { CleaningFrequency, CleaningSchedule } from '../types';

export const FREQUENCY_DAYS: Record<CleaningFrequency, number> = {
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

export const FREQUENCY_LABELS: Record<CleaningFrequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Biweekly',
  monthly: 'Monthly',
};

function normalizeTurnIndex(n: number, turnIndex: number | undefined) {
  if (n <= 0) return 0;
  return (((turnIndex ?? 0) % n) + n) % n;
}

export function getCurrentAssignee(schedule: CleaningSchedule): string | null {
  const n = schedule.assignedMemberIds.length;
  if (n === 0) return null;
  return schedule.assignedMemberIds[normalizeTurnIndex(n, schedule.turnIndex)];
}

export function getNextAssignee(schedule: CleaningSchedule): string | null {
  const n = schedule.assignedMemberIds.length;
  if (n === 0) return null;
  return schedule.assignedMemberIds[normalizeTurnIndex(n, (schedule.turnIndex ?? 0) + 1)];
}

export function getDueAt(schedule: CleaningSchedule): number {
  const periodLengthMs = FREQUENCY_DAYS[schedule.frequency] * 24 * 60 * 60 * 1000;
  return (schedule.lastCompletedAt ?? schedule.anchorAt) + periodLengthMs;
}

export function isOverdue(schedule: CleaningSchedule, now: number = Date.now()): boolean {
  return now > getDueAt(schedule);
}

export function getProgress(schedule: CleaningSchedule, now: number = Date.now()): number {
  const start = schedule.lastCompletedAt ?? schedule.anchorAt;
  const dueAt = getDueAt(schedule);
  if (dueAt <= start) return 1;
  return Math.max(0, Math.min(1, (now - start) / (dueAt - start)));
}
