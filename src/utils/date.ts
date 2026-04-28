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

const DAY_NAMES: Record<DayKey, string> = {
  mo: 'Montag',
  di: 'Dienstag',
  mi: 'Mittwoch',
  do: 'Donnerstag',
  fr: 'Freitag',
  sa: 'Samstag',
  so: 'Sonntag',
};

export function dayName(d: DayKey): string {
  return DAY_NAMES[d];
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mär',
  'Apr',
  'Mai',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Okt',
  'Nov',
  'Dez',
];

const DAY_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return `${DAY_SHORT[d.getDay()]}, ${d.getDate()}. ${MONTH_NAMES[d.getMonth()]}`;
}

export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Guten Morgen';
  if (hour < 17) return 'Guten Tag';
  return 'Guten Abend';
}

const STRENGTH_DAYS: Partial<Record<DayKey, string>> = {
  mo: 'Beine + Core',
  mi: 'Oberkörper + Core',
};

export function strengthForDay(day: DayKey): string | null {
  return STRENGTH_DAYS[day] ?? null;
}

const DAY_ORDER: DayKey[] = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'];

export function dayIndex(day: DayKey): number {
  return DAY_ORDER.indexOf(day);
}

export function dayAfter(day: DayKey, offset: number): DayKey {
  const idx = (dayIndex(day) + offset + 7) % 7;
  return DAY_ORDER[idx];
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
