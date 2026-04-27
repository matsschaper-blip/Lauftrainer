import type { PlanWeek, WorkoutType, DayKey } from '@/types';

interface RawWorkout {
  day: DayKey;
  label: string;
  minutes: number;
  zone: string;
  desc: string;
}

interface RawWeek {
  week: number;
  phase: 1 | 2 | 3;
  workouts: RawWorkout[];
  deload?: boolean;
  test?: 'A' | 'B' | 'C';
  race?: boolean;
}

const RAW: RawWeek[] = [
  // Phase 1 · Basis
  {
    week: 1,
    phase: 1,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min locker in Z2 (134–147 bpm)' },
      { day: 'do', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min locker in Z2' },
      { day: 'so', label: 'Long Run', minutes: 40, zone: 'Z2', desc: '40 Min Long Run, locker in Z2' },
    ],
  },
  {
    week: 2,
    phase: 1,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 45, zone: 'Z2', desc: '45 Min Long Run Z2' },
    ],
  },
  {
    week: 3,
    phase: 1,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'sa', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 50, zone: 'Z2', desc: '50 Min Long Run Z2' },
    ],
  },
  {
    week: 4,
    phase: 1,
    deload: true,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2 · Entlastungswoche' },
      { day: 'do', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2 · Entlastung' },
      { day: 'so', label: 'Long Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2 · Entlastung' },
    ],
  },
  {
    week: 5,
    phase: 1,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'sa', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 55, zone: 'Z2', desc: '55 Min Long Run Z2' },
    ],
  },
  {
    week: 6,
    phase: 1,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'sa', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 65, zone: 'Z2', desc: '65 Min Long Run Z2' },
    ],
  },
  {
    week: 7,
    phase: 1,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2' },
      { day: 'sa', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 75, zone: 'Z2', desc: '75 Min Long Run Z2' },
    ],
  },
  {
    week: 8,
    phase: 1,
    test: 'A',
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      {
        day: 'so',
        label: 'TEST A',
        minutes: 45,
        zone: 'TEST',
        desc: '8 Min W/U + 30 Min konstant Z2 (142 bpm) + 5 Min C/D · Track: Pace bei dieser HF',
      },
    ],
  },
  // Phase 2 · Aufbau
  {
    week: 9,
    phase: 2,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'sa', label: 'Quality', minutes: 50, zone: 'Z4', desc: '8 Min W/U + 6×2 Min Z4 (2 Min Trab) + 5 Min C/D' },
      { day: 'so', label: 'Long Run', minutes: 75, zone: 'Z2', desc: '75 Min Long Run Z2' },
    ],
  },
  {
    week: 10,
    phase: 2,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2' },
      { day: 'do', label: 'Easy + Strides', minutes: 40, zone: 'Z2', desc: '40 Min Z2 + 4×100m Strides' },
      { day: 'sa', label: 'Quality', minutes: 55, zone: 'Z4', desc: '8 Min W/U + 4×4 Min Z4 (2 Min Trab) + 5 Min C/D' },
      { day: 'so', label: 'Long Run', minutes: 85, zone: 'Z2', desc: '85 Min Long Run Z2' },
    ],
  },
  {
    week: 11,
    phase: 2,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'sa', label: 'Tempo', minutes: 50, zone: 'Z4', desc: '10 Min W/U + 20 Min Tempodauerlauf Z4 + 5 Min C/D' },
      { day: 'so', label: 'Long Run', minutes: 95, zone: 'Z2', desc: '95 Min Long Run Z2' },
    ],
  },
  {
    week: 12,
    phase: 2,
    deload: true,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2 · Entlastung' },
      { day: 'do', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2 · Entlastung' },
      { day: 'sa', label: 'Light Quality', minutes: 40, zone: 'Z4', desc: '8 Min W/U + 4×3 Min Z4 + C/D' },
      { day: 'so', label: 'Long Run', minutes: 70, zone: 'Z2', desc: '70 Min Z2 · Entlastung' },
    ],
  },
  {
    week: 13,
    phase: 2,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'do', label: 'Easy + Strides', minutes: 45, zone: 'Z2', desc: '45 Min Z2 + 4×100m Strides' },
      { day: 'sa', label: 'Tempo', minutes: 60, zone: 'Z4', desc: '10 Min W/U + 2×15 Min Z4 (3 Min Trab) + 5 Min C/D' },
      { day: 'so', label: 'Long Run', minutes: 105, zone: 'Z2', desc: '105 Min Long Run Z2' },
    ],
  },
  {
    week: 14,
    phase: 2,
    test: 'B',
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2' },
      {
        day: 'sa',
        label: 'TEST B: 10K',
        minutes: 65,
        zone: 'TEST',
        desc: '10 Min W/U + 4×100m Strides + 10 km Race-Effort + C/D · HM-Prognose',
      },
      { day: 'so', label: 'Easy Long', minutes: 75, zone: 'Z2', desc: '75 Min easy nach Test' },
    ],
  },
  // Phase 3 · HM-Spezifik
  {
    week: 15,
    phase: 3,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2' },
      { day: 'sa', label: 'HM-Pace', minutes: 55, zone: 'Z3-4', desc: '10 Min W/U + 3×8 Min HM-Pace (5:40, 3 Min Trab) + C/D' },
      { day: 'so', label: 'Long Run', minutes: 110, zone: 'Z2', desc: '110 Min Long Run Z2' },
    ],
  },
  {
    week: 16,
    phase: 3,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'do', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '50 Min Z2 + Strides' },
      { day: 'sa', label: 'HM-Pace', minutes: 65, zone: 'Z3-4', desc: '10 Min W/U + 2×20 Min HM-Pace (3 Min Trab) + C/D' },
      { day: 'so', label: 'Long Run', minutes: 120, zone: 'Z2', desc: '120 Min Long Run Z2' },
    ],
  },
  {
    week: 17,
    phase: 3,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'sa', label: 'HM-Pace Block', minutes: 50, zone: 'Z3-4', desc: '10 Min W/U + 30 Min HM-Pace + C/D' },
      { day: 'so', label: 'Long Run', minutes: 130, zone: 'Z2', desc: '130 Min Long Run Z2' },
    ],
  },
  {
    week: 18,
    phase: 3,
    deload: true,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2 · Entlastung' },
      { day: 'do', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2 · Entlastung' },
      { day: 'sa', label: 'Light HM-Pace', minutes: 45, zone: 'Z3-4', desc: '8 Min W/U + 4×5 Min HM-Pace + C/D' },
      { day: 'so', label: 'Long Run', minutes: 90, zone: 'Z2', desc: '90 Min Z2 · Entlastung' },
    ],
  },
  {
    week: 19,
    phase: 3,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'sa', label: 'HM-Pace', minutes: 75, zone: 'Z3-4', desc: '10 Min W/U + 2×25 Min HM-Pace (3 Min Trab) + C/D' },
      { day: 'so', label: 'Long Run', minutes: 140, zone: 'Z2', desc: '140 Min Long Run Z2 · längster Lauf' },
    ],
  },
  {
    week: 20,
    phase: 3,
    test: 'C',
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      {
        day: 'sa',
        label: 'TEST C: 16K',
        minutes: 90,
        zone: 'TEST',
        desc: '16 km bei HM-Pace (5:40) · misst Konstanz und HF-Drift',
      },
      { day: 'so', label: 'Easy Long', minutes: 90, zone: 'Z2', desc: '90 Min easy nach Test' },
    ],
  },
  {
    week: 21,
    phase: 3,
    deload: true,
    workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2 · Taper' },
      { day: 'do', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2 · Taper' },
      { day: 'sa', label: 'Sharpen', minutes: 35, zone: 'Z3-4', desc: '8 Min W/U + 3×5 Min HM-Pace + C/D' },
      { day: 'so', label: 'Long Run', minutes: 70, zone: 'Z2', desc: '70 Min Z2 · Taper' },
    ],
  },
  {
    week: 22,
    phase: 3,
    race: true,
    workouts: [
      { day: 'di', label: 'Shake-out', minutes: 30, zone: 'Z2', desc: '30 Min sehr locker' },
      { day: 'do', label: 'Sharpen', minutes: 20, zone: 'Z3-4', desc: '20 Min mit kurzen Pickups' },
      { day: 'sa', label: 'Pre-Race', minutes: 20, zone: 'Z2', desc: '20 Min sehr locker + 3×100m Strides' },
      { day: 'so', label: 'HALBMARATHON', minutes: 120, zone: 'RACE', desc: 'Wettkampf · 21.1 km in <2:00 h · ~5:40er Pace' },
    ],
  },
];

function inferType(week: RawWeek, w: RawWorkout): WorkoutType {
  const label = w.label.toLowerCase();
  if (week.race || w.zone === 'RACE') return 'race';
  if (week.test || w.zone === 'TEST') return 'test';
  if (label.includes('long')) return 'long';
  if (
    label.includes('tempo') ||
    label.includes('quality') ||
    label.includes('pace') ||
    label.includes('sharpen') ||
    label.includes('shake') ||
    label.includes('pre-race') ||
    w.zone === 'Z4' ||
    w.zone === 'Z3-4'
  ) {
    return 'tempo';
  }
  return 'easy';
}

export const PLAN: PlanWeek[] = RAW.map((week) => ({
  week: week.week,
  phase: week.phase,
  deload: week.deload,
  test: week.test,
  race: week.race,
  workouts: week.workouts.map((w) => ({
    day: w.day,
    label: w.label,
    minutes: w.minutes,
    zone: w.zone,
    description: w.desc,
    type: inferType(week, w),
  })),
}));

export function planWeek(week: number) {
  return PLAN.find((w) => w.week === week);
}
