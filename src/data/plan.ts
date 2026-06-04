import type { PlanWeek, WorkoutType, DayKey } from '@/types';

interface RawWorkout {
  day: DayKey;
  label: string;
  minutes: number;
  zone: string;
  desc: string;
  type?: WorkoutType;
}

interface RawWeek {
  week: number;
  phase: 1 | 2 | 3 | 4;
  workouts: RawWorkout[];
  deload?: boolean;
  test?: 'A' | 'B' | 'C' | 'D';
  race?: boolean;
}

// ===========================================================================
// 50-WOCHEN-PLAN · HALBMARATHON HANNOVER 12.04.2027 · ZIEL SUB 1:45 / 1:42
// ===========================================================================
// Periodisierung: Pyramidal → Polarized (Filipas 2022, Nature 2025)
// Phase 1 (W1-10): Wiederaufbau-Basis · Z2-dominant
// Phase 2 (W11-30): Pyramidal Aufbau · Threshold + Long-Run-Wachstum
// Phase 3 (W31-46): Polarized Spezifik · VO2max + HM-Pace
// Phase 4 (W47-50): Race + Taper
//
// PACE-ZIELE (Start, kalibriert nach TEST A in W14):
//  - Easy/Long Z2: HR 134-147 (Mats HFmax 198)
//  - Threshold T: ~5:00/km (lactate threshold)
//  - HM-Pace:     4:58/km (sub 1:45 Hard Target)
//  - VO2max I:    ~4:25/km
//  - Recovery:    HR <140
// ===========================================================================

const RAW: RawWeek[] = [
  // -------------------------------------------------------------------------
  // PHASE 1 · WIEDERAUFBAU-BASIS (W1-10)
  // -------------------------------------------------------------------------
  // W1-6: bereits absolviert (Realdaten in Supabase) — Layout unverändert
  {
    week: 1, phase: 1, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min locker in Z2 (134–147 bpm)' },
      { day: 'do', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min locker in Z2' },
      { day: 'so', label: 'Long Run', minutes: 40, zone: 'Z2', desc: '40 Min Long Run, locker in Z2' },
    ],
  },
  {
    week: 2, phase: 1, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 45, zone: 'Z2', desc: '45 Min Long Run Z2' },
    ],
  },
  {
    week: 3, phase: 1, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'sa', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 50, zone: 'Z2', desc: '50 Min Long Run Z2' },
    ],
  },
  {
    week: 4, phase: 1, deload: true, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2 · Entlastungswoche' },
      { day: 'do', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2 · Entlastung' },
      { day: 'so', label: 'Long Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2 · Entlastung' },
    ],
  },
  {
    week: 5, phase: 1, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'sa', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 55, zone: 'Z2', desc: '55 Min Long Run Z2' },
    ],
  },
  {
    week: 6, phase: 1, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'do', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'sa', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 65, zone: 'Z2', desc: '65 Min Long Run Z2' },
    ],
  },
  // W7-10: Bridge zur neuen Plan-Logik (Volumen +10%/Wo, Strides als neuromusk. Stimulus)
  {
    week: 7, phase: 1, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2 (134–147 bpm)' },
      { day: 'do', label: 'Easy + Strides', minutes: 45, zone: 'Z2', desc: '40 Min Z2 + 4×20s Strides am Ende, je 1 Min Trab', type: 'strides' },
      { day: 'sa', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 75, zone: 'Z2', desc: '75 Min Long Run Z2' },
    ],
  },
  {
    week: 8, phase: 1, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2' },
      { day: 'do', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'sa', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 85, zone: 'Z2', desc: '85 Min Long Run Z2' },
    ],
  },
  {
    week: 9, phase: 1, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2' },
      { day: 'do', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'sa', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 95, zone: 'Z2', desc: '95 Min Long Run Z2' },
    ],
  },
  {
    week: 10, phase: 1, deload: true, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2 · Deload' },
      { day: 'do', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2 · Deload' },
      { day: 'so', label: 'Long Run', minutes: 70, zone: 'Z2', desc: '70 Min Long Run Z2 · Deload' },
    ],
  },

  // -------------------------------------------------------------------------
  // PHASE 2 · PYRAMIDAL AUFBAU (W11-30)
  // -------------------------------------------------------------------------
  // Block A: Threshold-Einführung (W11-14, mit TEST A in W14)
  {
    week: 11, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'do', label: 'Threshold', minutes: 50, zone: 'T', desc: '12 Min W/U + 3×6 Min @ T-Pace (~5:00/km, RPE 7), 90s Trab + 8 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 40, zone: 'Z2', desc: '35 Min Z2 + 4×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 100, zone: 'Z2', desc: '100 Min Long Run Z2' },
    ],
  },
  {
    week: 12, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'do', label: 'Threshold', minutes: 55, zone: 'T', desc: '12 Min W/U + 4×6 Min T-Pace, 90s Trab + 8 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 110, zone: 'Z2', desc: '110 Min Long Run Z2' },
    ],
  },
  {
    week: 13, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'do', label: 'Threshold', minutes: 55, zone: 'T', desc: '12 Min W/U + 2×15 Min T-Pace, 3 Min Trab + 8 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 45, zone: 'Z2', desc: '40 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 115, zone: 'Z2', desc: '115 Min Long Run Z2' },
    ],
  },
  {
    week: 14, phase: 2, deload: true, test: 'A', workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2 · vor Test' },
      { day: 'do', label: 'Pre-Test Pickups', minutes: 35, zone: 'Z2', desc: '25 Min Z2 + 4×100m Strides', type: 'strides' },
      { day: 'sa', label: 'TEST A · 5K Time Trial', minutes: 45, zone: 'TEST', desc: '15 Min W/U + 4×100m Strides + 5 km All-Out (flacher Kurs) + 10 Min C/D · liefert VDOT-Baseline', type: 'test' },
      { day: 'so', label: 'Easy Long', minutes: 75, zone: 'Z2', desc: '75 Min sehr locker nach Test' },
    ],
  },
  // Block B: Threshold-Volumen-Wachstum (W15-18)
  {
    week: 15, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'do', label: 'Threshold', minutes: 60, zone: 'T', desc: '12 Min W/U + 4×8 Min T-Pace (kalibriert nach Test A), 2 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 120, zone: 'Z2', desc: '120 Min Long Run Z2' },
    ],
  },
  {
    week: 16, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'do', label: 'Threshold', minutes: 60, zone: 'T', desc: '12 Min W/U + 3×10 Min T-Pace, 2 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 125, zone: 'Z2', desc: '125 Min Long Run Z2 · erste 90 Min Z2, letzte 35 Min Z2-obere Grenze' },
    ],
  },
  {
    week: 17, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'Threshold', minutes: 65, zone: 'T', desc: '12 Min W/U + 2×20 Min T-Pace, 3 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 130, zone: 'Z2', desc: '130 Min Long Run Z2' },
    ],
  },
  {
    week: 18, phase: 2, deload: true, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2 · Deload' },
      { day: 'do', label: 'Light Threshold', minutes: 45, zone: 'T', desc: '10 Min W/U + 3×6 Min T-Pace + C/D', type: 'threshold' },
      { day: 'so', label: 'Long Run', minutes: 90, zone: 'Z2', desc: '90 Min Z2 · Deload' },
    ],
  },
  // Block C: Mixed Threshold + Cruise Intervals (W19-22, TEST B 10K in W22)
  {
    week: 19, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'do', label: 'Cruise Intervals', minutes: 65, zone: 'T', desc: '12 Min W/U + 5×8 Min T-Pace, 90s Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 130, zone: 'Z2', desc: '130 Min Long Run Z2' },
    ],
  },
  {
    week: 20, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'Tempo Continuous', minutes: 70, zone: 'T', desc: '15 Min W/U + 30 Min Tempodauerlauf T-Pace + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 135, zone: 'Z2', desc: '135 Min · letzte 30 Min progressiv steigernd' },
    ],
  },
  {
    week: 21, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'do', label: 'Threshold Pyramide', minutes: 65, zone: 'T', desc: '12 Min W/U + 6+8+10+8+6 Min T-Pace, 90s Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 130, zone: 'Z2', desc: '130 Min Long Run Z2' },
    ],
  },
  {
    week: 22, phase: 2, deload: true, test: 'B', workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2 · vor Test' },
      { day: 'do', label: 'Pre-Test Pickups', minutes: 35, zone: 'Z2', desc: '25 Min Z2 + 4×100m Strides', type: 'strides' },
      { day: 'sa', label: 'TEST B · 10K Time Trial', minutes: 75, zone: 'TEST', desc: '15 Min W/U + 4×100m Strides + 10 km Race-Effort + 10 Min C/D · HM-Prognose-Update + neue T-Pace', type: 'test' },
      { day: 'so', label: 'Easy Long', minutes: 90, zone: 'Z2', desc: '90 Min sehr locker nach Test' },
    ],
  },
  // Block D: Volumen-Peak Pyramidal (W23-26)
  {
    week: 23, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'Threshold', minutes: 70, zone: 'T', desc: '15 Min W/U + 2×20 Min T-Pace (neu kalibriert), 3 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 140, zone: 'Z2', desc: '140 Min Long Run Z2' },
    ],
  },
  {
    week: 24, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 65, zone: 'Z2', desc: '65 Min Z2' },
      { day: 'do', label: 'Cruise Intervals', minutes: 70, zone: 'T', desc: '12 Min W/U + 4×10 Min T-Pace, 2 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'so', label: 'Long Run progressiv', minutes: 145, zone: 'Z2', desc: '145 Min · letzte 40 Min steigernd Richtung T-Pace minus 30s' },
    ],
  },
  {
    week: 25, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'Threshold', minutes: 70, zone: 'T', desc: '12 Min W/U + 3×12 Min T-Pace, 2 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min Z2 + 8×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 150, zone: 'Z2', desc: '150 Min Long Run Z2 · längster bisher' },
    ],
  },
  {
    week: 26, phase: 2, deload: true, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2 · Deload' },
      { day: 'do', label: 'Light Threshold', minutes: 50, zone: 'T', desc: '10 Min W/U + 3×8 Min T-Pace + C/D', type: 'threshold' },
      { day: 'so', label: 'Long Run', minutes: 100, zone: 'Z2', desc: '100 Min Z2 · Deload' },
    ],
  },
  // Block E: Übergang zu Polarized (W27-30) — VO2max wird eingeführt, Threshold reduziert
  {
    week: 27, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'VO2max Intro', minutes: 60, zone: 'I', desc: '15 Min W/U + 5×3 Min @ I-Pace (~4:25/km, RPE 8.5), 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 140, zone: 'Z2', desc: '140 Min Long Run Z2' },
    ],
  },
  {
    week: 28, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'VO2max', minutes: 65, zone: 'I', desc: '15 Min W/U + 6×3 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 145, zone: 'Z2', desc: '145 Min Long Run Z2' },
    ],
  },
  {
    week: 29, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'VO2max', minutes: 65, zone: 'I', desc: '15 Min W/U + 5×4 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 150, zone: 'Z2', desc: '150 Min Long Run Z2' },
    ],
  },
  {
    week: 30, phase: 2, deload: true, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2 · Deload' },
      { day: 'do', label: 'Light VO2max', minutes: 50, zone: 'I', desc: '12 Min W/U + 4×2 Min I-Pace + C/D', type: 'vo2' },
      { day: 'so', label: 'Long Run', minutes: 100, zone: 'Z2', desc: '100 Min Z2 · Deload' },
    ],
  },

  // -------------------------------------------------------------------------
  // PHASE 3 · POLARIZED SPEZIFIK (W31-46)
  // -------------------------------------------------------------------------
  // Block F: VO2max + HM-Pace Long (W31-34, TEST C 16K @ HM-Pace in W34)
  {
    week: 31, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'VO2max', minutes: 65, zone: 'I', desc: '15 Min W/U + 6×3 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'HM-Pace Long', minutes: 140, zone: 'HM', desc: '20 Min Z2 W/U + 60 Min Z2 + 4 km @ HM-Pace (4:58/km) eingestreut + 20 Min C/D' },
    ],
  },
  {
    week: 32, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 65, zone: 'Z2', desc: '65 Min Z2' },
      { day: 'do', label: 'VO2max', minutes: 65, zone: 'I', desc: '15 Min W/U + 4×4 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'HM-Pace Long', minutes: 145, zone: 'HM', desc: '20 Min W/U + 80 Min Z2 + 6 km @ HM-Pace + 15 Min C/D' },
    ],
  },
  {
    week: 33, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'VO2max', minutes: 70, zone: 'I', desc: '15 Min W/U + 5×4 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'so', label: 'HM-Pace Long', minutes: 150, zone: 'HM', desc: '20 Min W/U + 70 Min Z2 + 10 km @ HM-Pace + 10 Min C/D' },
    ],
  },
  {
    week: 34, phase: 3, deload: true, test: 'C', workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2 · vor Test' },
      { day: 'do', label: 'Pre-Test Pickups', minutes: 40, zone: 'Z2', desc: '30 Min Z2 + 4×100m Strides', type: 'strides' },
      { day: 'sa', label: 'TEST C · 16K @ HM-Pace', minutes: 100, zone: 'TEST', desc: '15 Min W/U + 16 km @ HM-Pace (4:58/km) + 10 Min C/D · tracke HF-Drift (Ziel <5 bpm letzte vs erste 4 km)', type: 'test' },
      { day: 'so', label: 'Easy Long', minutes: 90, zone: 'Z2', desc: '90 Min sehr locker nach Test' },
    ],
  },
  // Block G: Peak Polarized (W35-38) — Spitze des Trainingsstresses
  {
    week: 35, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'VO2max', minutes: 70, zone: 'I', desc: '15 Min W/U + 6×4 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min Z2 + 8×20s Strides', type: 'strides' },
      { day: 'so', label: 'HM-Pace Long', minutes: 150, zone: 'HM', desc: '20 Min W/U + 50 Min Z2 + 12 km @ HM-Pace + 10 Min C/D' },
    ],
  },
  {
    week: 36, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 65, zone: 'Z2', desc: '65 Min Z2' },
      { day: 'do', label: 'VO2max', minutes: 70, zone: 'I', desc: '15 Min W/U + 5×5 Min I-Pace, 4 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'so', label: 'HM-Pace Long', minutes: 155, zone: 'HM', desc: '20 Min W/U + 30 Min Z2 + 14 km @ HM-Pace + 10 Min C/D · längster HM-Pace-Block bisher' },
    ],
  },
  {
    week: 37, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 65, zone: 'Z2', desc: '65 Min Z2' },
      { day: 'do', label: 'Mixed Quality', minutes: 70, zone: 'I', desc: '15 Min W/U + 3×4 Min I-Pace, 3 Min Trab + 2 km @ HM-Pace + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run Volume', minutes: 160, zone: 'Z2', desc: '160 Min Long Run Z2 · längster reiner Z2-Lauf · 18-20 km' },
    ],
  },
  {
    week: 38, phase: 3, deload: true, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2 · Deload' },
      { day: 'do', label: 'Light VO2max', minutes: 50, zone: 'I', desc: '12 Min W/U + 4×3 Min I-Pace + C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 110, zone: 'Z2', desc: '110 Min Z2 · Deload' },
    ],
  },
  // Block H: HM-Spezifik Peak (W39-42) — Race-Pace dominiert
  {
    week: 39, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'HM-Specific', minutes: 70, zone: 'HM', desc: '15 Min W/U + 3×3 km @ HM-Pace (4:58/km), 3 Min Trab + 10 Min C/D' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'HM-Pace Long', minutes: 150, zone: 'HM', desc: '15 Min W/U + 30 Min Z2 + 16 km @ HM-Pace + 10 Min C/D · 76% Race-Distanz @ Race-Pace' },
    ],
  },
  {
    week: 40, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'HM-Specific', minutes: 70, zone: 'HM', desc: '15 Min W/U + 4×2 km @ HM-Pace, 90s Trab + 10 Min C/D' },
      { day: 'sa', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'so', label: 'HM Dress Rehearsal', minutes: 155, zone: 'HM', desc: '15 Min W/U + 18 km @ HM-Pace + 10 Min C/D · Generalprobe Verpflegung/Schuhe' },
    ],
  },
  {
    week: 41, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'Sharpening', minutes: 60, zone: 'I', desc: '15 Min W/U + 3×4 Min I-Pace + 2 km @ HM-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min Z2 + 8×20s Strides', type: 'strides' },
      { day: 'so', label: 'HM-Pace Long', minutes: 130, zone: 'HM', desc: '15 Min W/U + 12 km @ HM-Pace + 15 Min Z2 + 10 Min C/D' },
    ],
  },
  {
    week: 42, phase: 3, deload: true, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2 · Mini-Deload' },
      { day: 'do', label: 'Sharpening Light', minutes: 50, zone: 'HM', desc: '15 Min W/U + 4×1 km @ HM-Pace, 90s Trab + 10 Min C/D' },
      { day: 'sa', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2' },
      { day: 'so', label: 'Long Run', minutes: 110, zone: 'Z2', desc: '110 Min Z2 · längere Z2-Phase zur Recovery' },
    ],
  },
  // Block I: Final Sharpening (W43-46)
  {
    week: 43, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min Z2' },
      { day: 'do', label: 'HM-Specific', minutes: 65, zone: 'HM', desc: '15 Min W/U + 2×4 km @ HM-Pace, 3 Min Trab + 10 Min C/D' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'HM-Pace Long', minutes: 145, zone: 'HM', desc: '15 Min W/U + 16 km @ HM-Pace + 10 Min C/D' },
    ],
  },
  {
    week: 44, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min Z2' },
      { day: 'do', label: 'Threshold', minutes: 60, zone: 'T', desc: '15 Min W/U + 2×15 Min T-Pace, 3 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2' },
      { day: 'so', label: 'HM-Pace Long', minutes: 140, zone: 'HM', desc: '15 Min W/U + 14 km @ HM-Pace + 10 Min C/D' },
    ],
  },
  {
    week: 45, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min Z2' },
      { day: 'do', label: 'Race-Pace Cuts', minutes: 55, zone: 'HM', desc: '15 Min W/U + 6×3 Min @ HM-Pace, 2 Min Trab + 10 Min C/D' },
      { day: 'sa', label: 'Easy + Strides', minutes: 45, zone: 'Z2', desc: '40 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 110, zone: 'Z2', desc: '110 Min Z2 · Volumen-Reduktion startet' },
    ],
  },
  {
    week: 46, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2' },
      { day: 'do', label: 'Sharpening', minutes: 50, zone: 'HM', desc: '15 Min W/U + 3×2 km @ HM-Pace, 2 Min Trab + 10 Min C/D' },
      { day: 'sa', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2' },
      { day: 'so', label: 'Long Run Light', minutes: 90, zone: 'Z2', desc: '90 Min Z2 · Übergang zu Taper' },
    ],
  },

  // -------------------------------------------------------------------------
  // PHASE 4 · RACE + TAPER (W47-50)
  // -------------------------------------------------------------------------
  // Taper-Logik: Volumen runter, Intensität bleibt (Mujika 2003)
  {
    week: 47, phase: 4, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min Z2 · Taper W1 (~70% Volumen)' },
      { day: 'do', label: 'HM-Pace Tune-up', minutes: 50, zone: 'HM', desc: '15 Min W/U + 3×2 km @ HM-Pace, 2 Min Trab + 10 Min C/D · Intensität bleibt' },
      { day: 'sa', label: 'Easy + Strides', minutes: 40, zone: 'Z2', desc: '35 Min Z2 + 4×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 80, zone: 'Z2', desc: '80 Min Z2' },
    ],
  },
  {
    week: 48, phase: 4, test: 'D', workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min Z2 · Taper W2 (~50% Volumen)' },
      { day: 'do', label: 'Final Tune-up', minutes: 40, zone: 'HM', desc: '12 Min W/U + 2 km @ HM-Pace + 5×1 Min @ I-Pace, 1 Min Trab + 8 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 35, zone: 'Z2', desc: '30 Min Z2 + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run Light', minutes: 60, zone: 'Z2', desc: '60 Min Z2 · letzter längerer Lauf' },
    ],
  },
  {
    week: 49, phase: 4, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min Z2 · Race-Woche-Vorlauf' },
      { day: 'do', label: 'Shake-out Pace', minutes: 30, zone: 'HM', desc: '10 Min W/U + 2 km @ HM-Pace + 3×30s @ I-Pace + 8 Min C/D · letzte Schärfe' },
      { day: 'sa', label: 'Easy Run', minutes: 25, zone: 'Z2', desc: '25 Min Z2 sehr locker' },
      { day: 'so', label: 'Easy + Strides', minutes: 30, zone: 'Z2', desc: '25 Min Z2 + 4×20s Strides · Beine aktivieren', type: 'strides' },
    ],
  },
  {
    week: 50, phase: 4, race: true, workouts: [
      { day: 'mo', label: 'Pause oder 20 Min Walk', minutes: 0, zone: 'REST', desc: 'Komplett locker, nur Hund-Spaziergang' },
      { day: 'di', label: 'Shake-out', minutes: 25, zone: 'Z2', desc: '20 Min Z1/Z2 sehr locker + 4×100m Strides', type: 'strides' },
      { day: 'mi', label: 'Pause', minutes: 0, zone: 'REST', desc: 'Pause · Carb-Loading-Start' },
      { day: 'do', label: 'Sharpening', minutes: 25, zone: 'HM', desc: '10 Min W/U + 3×1 Min @ HM-Pace + 8 Min C/D · Beine wach machen' },
      { day: 'fr', label: 'Pause', minutes: 0, zone: 'REST', desc: 'Pause · Beine hoch · früh ins Bett' },
      { day: 'sa', label: 'Pre-Race Shake-out', minutes: 20, zone: 'Z2', desc: '15 Min Z2 sehr locker + 4×100m Strides · Beine spüren' },
      { day: 'so', label: 'HALBMARATHON HANNOVER', minutes: 105, zone: 'RACE', desc: '21,1 km @ 4:58/km · Ziel sub 1:45 (Stretch 1:42 = 4:50/km) · Erste 5 km bewusst kontrolliert · Mitte Pace halten · letzte 5 km Negativ-Split anpeilen', type: 'race' },
    ],
  },
];

function inferType(week: RawWeek, w: RawWorkout): WorkoutType {
  if (w.type) return w.type;
  const label = w.label.toLowerCase();
  if (week.race || w.zone === 'RACE') return 'race';
  if (week.test || w.zone === 'TEST') return 'test';
  if (label.includes('long')) return 'long';
  if (label.includes('threshold') || label.includes('cruise') || label.includes('tempo')) return 'threshold';
  if (label.includes('vo2') || label.includes('vo2max')) return 'vo2';
  if (label.includes('strides') || label.includes('pickups')) return 'strides';
  if (
    label.includes('hm-pace') ||
    label.includes('hm-specific') ||
    label.includes('hm dress') ||
    label.includes('race-pace') ||
    label.includes('tune-up') ||
    label.includes('sharpening') ||
    label.includes('sharpen')
  ) {
    return 'tempo';
  }
  if (label.includes('quality') || w.zone === 'Z4' || w.zone === 'Z3-4' || w.zone === 'T' || w.zone === 'I' || w.zone === 'HM') {
    return 'tempo';
  }
  return 'easy';
}

export const PHASE_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: 'Wiederaufbau-Basis',
  2: 'Pyramidal Aufbau',
  3: 'Polarized Spezifik',
  4: 'Race + Taper',
};

export const TOTAL_WEEKS = 50;

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
