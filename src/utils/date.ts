import type { DayKey } from '@/types';

const DAY_KEYS: DayKey[] = ['so', 'mo', 'di', 'mi', 'do', 'fr', 'sa'];

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function dayOf(date: Date): DayKey {
  return DAY_KEYS[date.getDay()];
}

export function todayDayKey(): DayKey {
  return dayOf(new Date());
}

export function tomorrowDayKey(): DayKey {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return dayOf(t);
}

const PLAN_TOTAL_WEEKS = 22;

/**
 * Berechnet die aktuelle Trainingswoche aus startDate + manuellem Offset.
 * Clamp auf 1..22.
 */
export function computeCurrentWeek(startDate: string, weekOffset: number): number {
  const start = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
  const week = Math.floor(diffDays / 7) + 1 + weekOffset;
  return Math.max(1, Math.min(PLAN_TOTAL_WEEKS, week));
}
