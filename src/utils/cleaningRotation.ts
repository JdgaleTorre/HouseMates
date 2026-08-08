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

export function getAssigneeForPeriod(
  schedule: CleaningSchedule,
  periodOffset = 0,
  now: number = Date.now()
): string | null {
  const n = schedule.assignedMemberIds.length;
  if (n === 0) return null;

  const periodLengthMs = FREQUENCY_DAYS[schedule.frequency] * 24 * 60 * 60 * 1000;
  const periodsElapsed = Math.floor((now - schedule.anchorAt) / periodLengthMs) + periodOffset;
  const turnIndex = ((periodsElapsed % n) + n) % n;

  return schedule.assignedMemberIds[turnIndex];
}
