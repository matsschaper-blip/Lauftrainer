import type { ZoneDistribution } from '@/types';

/**
 * HF-Zonen nach Mats' Briefing-Definition (HFmax 198):
 * Z1 <134 (~<68%) · Z2 134–147 (~68–74%) · Z3 148–160 (~75–81%)
 * Z4 161–173 (~82–87%) · Z5 174+ (~88%+)
 *
 * Skaliert prozentual auf User-spezifische HFmax.
 */
export function zoneOf(hr: number, hfMax: number): 1 | 2 | 3 | 4 | 5 {
  const pct = hr / hfMax;
  if (pct < 0.68) return 1;
  if (pct < 0.75) return 2;
  if (pct < 0.82) return 3;
  if (pct < 0.88) return 4;
  return 5;
}

/**
 * Aggregiert Sekunden pro Zone aus dem Strava-HR-Stream.
 * time-array kommt typischerweise als kumulative Sekunden-since-start.
 */
export function computeZones(
  heartrate: number[] | undefined,
  time: number[] | undefined,
  hfMax: number,
): ZoneDistribution {
  const z: ZoneDistribution = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 };
  if (!heartrate || !time || heartrate.length === 0 || hfMax <= 0) return z;

  const n = Math.min(heartrate.length, time.length);
  for (let i = 0; i < n - 1; i++) {
    const dt = time[i + 1] - time[i];
    if (dt <= 0 || dt > 60) continue; // Sample-Lücken überspringen
    const zone = zoneOf(heartrate[i], hfMax);
    z[`z${zone}` as keyof ZoneDistribution] += dt;
  }
  return z;
}

export function totalSeconds(z: ZoneDistribution): number {
  return z.z1 + z.z2 + z.z3 + z.z4 + z.z5;
}

export function formatMmSs(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
