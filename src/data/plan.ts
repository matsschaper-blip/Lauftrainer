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
// 50-WOCHEN-PLAN · HALBMARATHON HANNOVER SO 11.04.2027 · ZIEL 1:40 (ab W23, Plan v3)
// ===========================================================================
// Periodisierung: Pyramidal → Polarized (Filipas 2022, Nature 2025)
// Phase 1 (W1-10): Wiederaufbau-Basis · Z2-dominant
// Phase 2 (W11-30): Pyramidal Aufbau · Threshold + Long-Run-Wachstum
// Phase 3 (W31-46): Polarized Spezifik · VO2max + HM-Pace
// Phase 4 (W47-50): Race + Taper
//
// PACE-ZIELE (Plan v3, nach TEST B 10K 47:23 am 26.09.2026; nach Re-Test W26 neu setzen):
//  - Easy:        5:50-6:20/km, HR ≤150 · Long Run A: 6:00-6:15/km, HR ≤155
//  - Threshold T: 4:45/km → ~4:38 nach Re-Test
//  - HM-Pace:     4:44/km (Ziel 1:40)
//  - VO2max I:    ~4:15/km
//  (Weeks 1-22 unverändert = historischer Plan mit Z2 134-147 / HFmax 198)
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
  // -------------------------------------------------------------------------
  // PLAN v3 AB W23 (29.09.2026): Ziel 1:40 (4:44/km) nach Test B (10K 47:23)
  // Long Run im Wechsel: A = locker (HF ≤155), B = strukturiert (Steigerung/HM-Pace)
  // Checkpoints: Re-Test 10K W26 (≤45:45), Test C W34, Test D 10K W45 (≤45:15)
  // -------------------------------------------------------------------------
  {
    week: 23, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker (HF ≤150)' },
      { day: 'do', label: 'Threshold', minutes: 70, zone: 'T', desc: '15 Min W/U + 2×20 Min T-Pace 4:45/km, 3 Min Trab + 10 Min C/D · HF am Ende <172 → nächstes Mal 5 s/km schneller', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run A', minutes: 130, zone: 'Z2', desc: '130 Min locker · HF ≤155 (~6:00–6:15/km)' },
    ],
  },
  {
    week: 24, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'Cruise Intervals', minutes: 70, zone: 'T', desc: '12 Min W/U + 4×10 Min T-Pace 4:45/km, 2 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run B · Progressiv', minutes: 140, zone: 'Z2', desc: '140 Min · 115 Min locker, letzte 25 Min steigern bis HM-Pace 4:44/km' },
    ],
  },
  {
    week: 25, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'Threshold', minutes: 70, zone: 'T', desc: '12 Min W/U + 3×12 Min T-Pace, 2 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run A', minutes: 150, zone: 'Z2', desc: '150 Min locker · HF ≤155' },
    ],
  },
  {
    week: 26, phase: 2, deload: true, test: 'B', workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min locker · Entlastung' },
      { day: 'do', label: 'Pre-Test Pickups', minutes: 35, zone: 'Z2', desc: '30 Min locker + 4×100m Strides', type: 'strides' },
      { day: 'sa', label: 'RE-TEST · 10K Time Trial', minutes: 75, zone: 'TEST', desc: '15 Min W/U + 4×100m Strides + 10 km flach & ausgeruht (km 1–3 in 4:35, dann halten) + 10 Min C/D · ≤45:45 → Ziel 1:40 bleibt · 45:45–46:45 → 1:42 · >46:45 → 1:44–1:45', type: 'test' },
      { day: 'so', label: 'Easy Long', minutes: 75, zone: 'Z2', desc: '75 Min sehr locker nach Test' },
    ],
  },
  {
    week: 27, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'VO2max Intro', minutes: 60, zone: 'I', desc: '15 Min W/U + 5×3 Min I-Pace (~4:15/km), 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run B · HM-Pace', minutes: 130, zone: 'HM', desc: '130 Min · 2. Hälfte 3×3 km @ HM-Pace 4:44, 2 Min Trab, Rest locker' },
    ],
  },
  {
    week: 28, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'Threshold', minutes: 70, zone: 'T', desc: '15 Min W/U + 2×20 Min T-Pace (neu nach Re-Test), 3 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run A', minutes: 150, zone: 'Z2', desc: '150 Min locker · HF ≤155' },
    ],
  },
  {
    week: 29, phase: 2, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'VO2max', minutes: 65, zone: 'I', desc: '15 Min W/U + 5×4 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min locker' },
      { day: 'so', label: 'Long Run B · HM-Pace', minutes: 140, zone: 'HM', desc: '140 Min · 2×5 km @ HM-Pace 4:44, 3 Min Trab, Rest locker' },
    ],
  },
  {
    week: 30, phase: 2, deload: true, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min locker · Entlastung' },
      { day: 'do', label: 'Light Threshold', minutes: 50, zone: 'T', desc: '10 Min W/U + 3×8 Min T-Pace + C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min locker' },
      { day: 'so', label: 'Long Run', minutes: 100, zone: 'Z2', desc: '100 Min locker · Entlastung' },
    ],
  },

  // -------------------------------------------------------------------------
  // PHASE 3 · RENNSPEZIFISCH (W31-46)
  // -------------------------------------------------------------------------
  {
    week: 31, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'VO2max', minutes: 65, zone: 'I', desc: '15 Min W/U + 6×3 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run A', minutes: 150, zone: 'Z2', desc: '150 Min locker · HF ≤155' },
    ],
  },
  {
    week: 32, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 65, zone: 'Z2', desc: '65 Min locker' },
      { day: 'do', label: 'Threshold', minutes: 70, zone: 'T', desc: '12 Min W/U + 3×12 Min T-Pace, 2 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min locker' },
      { day: 'so', label: 'Long Run B · HM-Pace', minutes: 145, zone: 'HM', desc: '60 Min locker + 8 km @ HM-Pace 4:44 + Rest locker' },
    ],
  },
  {
    week: 33, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'VO2max', minutes: 70, zone: 'I', desc: '15 Min W/U + 5×4 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run A', minutes: 150, zone: 'Z2', desc: '150 Min locker · HF ≤155' },
    ],
  },
  {
    week: 34, phase: 3, deload: true, test: 'C', workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min locker · vor Test' },
      { day: 'do', label: 'Pre-Test Pickups', minutes: 35, zone: 'Z2', desc: '30 Min locker + 4×100m Strides', type: 'strides' },
      { day: 'sa', label: 'TEST C · 16K @ HM-Pace', minutes: 100, zone: 'TEST', desc: '15 Min W/U + 16 km @ 4:44/km + 10 Min C/D · HF-Drift letzte vs. erste 4 km <5 bpm → 1:40 on track', type: 'test' },
      { day: 'so', label: 'Easy Long', minutes: 90, zone: 'Z2', desc: '90 Min sehr locker nach Test' },
    ],
  },
  {
    week: 35, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker · Weihnachtswoche, Tage flexibel' },
      { day: 'do', label: 'Cruise Intervals', minutes: 70, zone: 'T', desc: '12 Min W/U + 4×10 Min T-Pace, 2 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run A', minutes: 140, zone: 'Z2', desc: '140 Min locker · HF ≤155' },
    ],
  },
  {
    week: 36, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 65, zone: 'Z2', desc: '65 Min locker' },
      { day: 'do', label: 'VO2max', minutes: 70, zone: 'I', desc: '15 Min W/U + 6×4 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min locker' },
      { day: 'so', label: 'Long Run B · HM-Pace', minutes: 150, zone: 'HM', desc: '150 Min · 12 km @ HM-Pace 4:44 am Stück, Rest locker' },
    ],
  },
  {
    week: 37, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 65, zone: 'Z2', desc: '65 Min locker' },
      { day: 'do', label: 'Mixed Quality', minutes: 70, zone: 'I', desc: '15 Min W/U + 3×4 Min I-Pace, 3 Min Trab + 2 km @ HM-Pace + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run A', minutes: 160, zone: 'Z2', desc: '160 Min locker · längster Lauf · HF ≤155' },
    ],
  },
  {
    week: 38, phase: 3, deload: true, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min locker · Entlastung' },
      { day: 'do', label: 'Light VO2max', minutes: 50, zone: 'I', desc: '12 Min W/U + 4×3 Min I-Pace + C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min locker' },
      { day: 'so', label: 'Long Run', minutes: 110, zone: 'Z2', desc: '110 Min locker · Entlastung' },
    ],
  },
  {
    week: 39, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'HM-Specific', minutes: 70, zone: 'HM', desc: '15 Min W/U + 3×3 km @ HM-Pace 4:44, 3 Min Trab + 10 Min C/D' },
      { day: 'sa', label: 'Easy + Strides', minutes: 55, zone: 'Z2', desc: '50 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run B · HM-Pace', minutes: 150, zone: 'HM', desc: '150 Min · 14 km @ HM-Pace 4:44, Rest locker' },
    ],
  },
  {
    week: 40, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'Threshold', minutes: 70, zone: 'T', desc: '15 Min W/U + 2×20 Min T-Pace, 3 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min locker' },
      { day: 'so', label: 'Long Run A', minutes: 150, zone: 'Z2', desc: '150 Min locker · HF ≤155' },
    ],
  },
  {
    week: 41, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'VO2max', minutes: 70, zone: 'I', desc: '15 Min W/U + 5×4 Min I-Pace, 3 Min Trab + 10 Min C/D', type: 'vo2' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'HM Dress Rehearsal', minutes: 130, zone: 'HM', desc: '20 Min W/U + 16 km @ HM-Pace 4:44 + 10 Min C/D · Generalprobe Schuhe, Gels, Frühstück' },
    ],
  },
  {
    week: 42, phase: 3, deload: true, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min locker · Entlastung' },
      { day: 'do', label: 'Sharpening Light', minutes: 50, zone: 'HM', desc: '15 Min W/U + 4×1 km @ HM-Pace, 90s Trab + 10 Min C/D' },
      { day: 'sa', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min locker' },
      { day: 'so', label: 'Long Run', minutes: 110, zone: 'Z2', desc: '110 Min locker · Entlastung' },
    ],
  },
  {
    week: 43, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 60, zone: 'Z2', desc: '60 Min locker' },
      { day: 'do', label: 'HM-Specific', minutes: 65, zone: 'HM', desc: '15 Min W/U + 2×4 km @ HM-Pace, 3 Min Trab + 10 Min C/D' },
      { day: 'sa', label: 'Easy + Strides', minutes: 50, zone: 'Z2', desc: '45 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run B · HM-Pace', minutes: 140, zone: 'HM', desc: '15 Min W/U + 18 km @ HM-Pace 4:44 + 10 Min C/D · Schlüsseleinheit' },
    ],
  },
  {
    week: 44, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 55, zone: 'Z2', desc: '55 Min locker' },
      { day: 'do', label: 'Threshold', minutes: 60, zone: 'T', desc: '15 Min W/U + 2×15 Min T-Pace, 3 Min Trab + 10 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min locker' },
      { day: 'so', label: 'Long Run A', minutes: 140, zone: 'Z2', desc: '140 Min locker · HF ≤155' },
    ],
  },
  {
    week: 45, phase: 3, deload: true, test: 'D', workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min locker · vor Test' },
      { day: 'do', label: 'Pre-Test Pickups', minutes: 35, zone: 'Z2', desc: '30 Min locker + 4×100m Strides', type: 'strides' },
      { day: 'sa', label: 'TEST D · 10K', minutes: 75, zone: 'TEST', desc: '10 km, am besten echter Wettkampf · ≤45:15 → 1:40 · ≤46:00 → 1:42 · >46:00 → Renntempo anpassen', type: 'test' },
      { day: 'so', label: 'Easy Long', minutes: 90, zone: 'Z2', desc: '90 Min sehr locker nach Test' },
    ],
  },
  {
    week: 46, phase: 3, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 50, zone: 'Z2', desc: '50 Min locker' },
      { day: 'do', label: 'HM-Specific', minutes: 65, zone: 'HM', desc: '15 Min W/U + 3×3 km @ HM-Pace, 3 Min Trab + 10 Min C/D' },
      { day: 'sa', label: 'Easy + Strides', minutes: 45, zone: 'Z2', desc: '40 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run B · HM-Pace', minutes: 120, zone: 'HM', desc: '120 Min · 12 km @ HM-Pace 4:44, Rest locker' },
    ],
  },

  // -------------------------------------------------------------------------
  // PHASE 4 · RACE + TAPER (W47-50)
  // -------------------------------------------------------------------------
  {
    week: 47, phase: 4, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 45, zone: 'Z2', desc: '45 Min locker · Taper W1' },
      { day: 'do', label: 'HM-Pace Tune-up', minutes: 50, zone: 'HM', desc: '15 Min W/U + 3×2 km @ HM-Pace, 2 Min Trab + 10 Min C/D · Intensität bleibt' },
      { day: 'sa', label: 'Easy + Strides', minutes: 40, zone: 'Z2', desc: '35 Min locker + 4×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run', minutes: 90, zone: 'Z2', desc: '90 Min locker' },
    ],
  },
  {
    week: 48, phase: 4, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 40, zone: 'Z2', desc: '40 Min locker · Taper W2' },
      { day: 'do', label: 'Final Tune-up', minutes: 40, zone: 'HM', desc: '12 Min W/U + 2 km @ HM-Pace + 5×1 Min @ I-Pace, 1 Min Trab + 8 Min C/D', type: 'threshold' },
      { day: 'sa', label: 'Easy + Strides', minutes: 35, zone: 'Z2', desc: '30 Min locker + 6×20s Strides', type: 'strides' },
      { day: 'so', label: 'Long Run Light', minutes: 70, zone: 'Z2', desc: '70 Min locker · letzter längerer Lauf' },
    ],
  },
  {
    week: 49, phase: 4, workouts: [
      { day: 'di', label: 'Easy Run', minutes: 35, zone: 'Z2', desc: '35 Min locker' },
      { day: 'do', label: 'Shake-out Pace', minutes: 30, zone: 'HM', desc: '10 Min W/U + 2 km @ HM-Pace + 3×30s schnell + 8 Min C/D' },
      { day: 'sa', label: 'Easy Run', minutes: 30, zone: 'Z2', desc: '30 Min sehr locker' },
      { day: 'so', label: 'Easy + Strides', minutes: 40, zone: 'Z2', desc: '35 Min locker + 4×20s Strides', type: 'strides' },
    ],
  },
  {
    week: 50, phase: 4, race: true, workouts: [
      { day: 'mo', label: 'Pause oder 20 Min Walk', minutes: 0, zone: 'REST', desc: 'Komplett locker, nur Hund-Spaziergang' },
      { day: 'di', label: 'Shake-out', minutes: 25, zone: 'Z2', desc: '20 Min sehr locker + 4×100m Strides', type: 'strides' },
      { day: 'mi', label: 'Pause', minutes: 0, zone: 'REST', desc: 'Pause · Carb-Loading-Start' },
      { day: 'do', label: 'Sharpening', minutes: 25, zone: 'HM', desc: '10 Min W/U + 3×1 Min @ HM-Pace + 8 Min C/D · Beine wach machen' },
      { day: 'fr', label: 'Pause', minutes: 0, zone: 'REST', desc: 'Pause · Beine hoch · früh ins Bett' },
      { day: 'sa', label: 'Pre-Race Shake-out', minutes: 20, zone: 'Z2', desc: '15 Min sehr locker + 4×100m Strides · Beine spüren' },
      { day: 'so', label: 'HALBMARATHON HANNOVER', minutes: 100, zone: 'RACE', desc: 'So 11.04.2027 · 21,1 km · Ziel 1:40 = 4:44/km · km 1–5 in 4:46–4:48 kontrolliert · km 5–16 in 4:44 · ab km 16 zulegen, wenn die Beine es hergeben', type: 'race' },
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
