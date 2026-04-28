import { planWeek } from '@/data/plan';
import { computeCurrentWeek, todayDayKey, todayISO } from './date';
import type { AppState } from '@/types';

type TemplateState = Pick<AppState, 'settings' | 'logs' | 'trainings'>;

export function generatePreRun(state: TemplateState): string {
  const week = computeCurrentWeek(state.settings.startDate, state.settings.weekOffset);
  const log = state.logs[todayISO()];
  const w = planWeek(week);
  const workout = w?.workouts.find((wo) => wo.day === todayDayKey());
  const planText = workout
    ? `${workout.label} · ${workout.minutes} Min · ${workout.description}`
    : 'Heute kein Lauf laut Plan';

  return `Pre-Run Check (Woche ${week})

Schlaf: ${log?.sleep ?? '__'} h
Energie: ${log?.energy ?? '__'}/10
Ruhepuls heute: ${log?.rhr ?? '__'} bpm
Plan: ${planText}
Sonst: __

Soll ich loslaufen wie geplant?`;
}

export function generateWeekReview(state: TemplateState): string {
  const wk = computeCurrentWeek(state.settings.startDate, state.settings.weekOffset);
  const week = planWeek(wk);
  let plannedCount = week?.workouts.length ?? 0;
  let doneCount = 0;
  let totalMinPlanned = 0;
  let totalMinActual = 0;
  if (week) {
    for (const w of week.workouts) {
      totalMinPlanned += w.minutes;
      const t = state.trainings[wk]?.[w.day];
      if (t?.completed) {
        doneCount += 1;
        totalMinActual += Number(t.duration ?? w.minutes);
      }
    }
  }

  const today = new Date();
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  const pickAvg = (key: 'sleep' | 'rhr' | 'energy') => {
    const vals = dates.map((d) => state.logs[d]?.[key]).filter((v): v is number => Boolean(v));
    if (vals.length === 0) return '__';
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return key === 'sleep' || key === 'energy' ? avg.toFixed(1) : String(Math.round(avg));
  };

  return `WOCHENRÜCKBLICK · Woche ${wk}

Trainings geplant vs. tatsächlich: ${doneCount}/${plannedCount} (${totalMinActual} von ${totalMinPlanned} Min)
Schlaf-Ø: ${pickAvg('sleep')} h
Ruhepuls morgens-Ø: ${pickAvg('rhr')} bpm
Energie-Ø: ${pickAvg('energy')}/10

Stress-Level diese Woche: __/10
Gefühl im Schnitt: __/10
Termine kommende Woche: __
Sonstiges (Schmerzen? Verletzungen? Auffälligkeiten?): __

Wie soll die nächste Woche aussehen?`;
}
