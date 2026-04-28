import { supabase } from './supabase';
import type { DailyLog, Settings, WorkoutLog, WorkoutType, KmSplit, ZoneDistribution } from '@/types';

interface ProfileRow {
  id: string;
  name: string;
  start_date: string;
  week_offset: number;
  hf_max: number;
  rhr_baseline: number;
  weight: number | null;
  height: number | null;
  goal_pace: string | null;
  weekly_volume_target: number | null;
  theme: 'light' | 'dark';
}

interface DailyLogRow {
  id: string;
  user_id: string;
  date: string;
  sleep: number | null;
  rhr: number | null;
  energy: number | null;
  stress: number | null;
  mood: number | null;
  weight: number | null;
  strength: string | null;
  blackroll: string | null;
  nutrition: string | null;
  notes: string | null;
  hund: number | null;
}

function profileToSettings(row: ProfileRow, fallback: Settings): Settings {
  return {
    name: row.name,
    startDate: row.start_date,
    weekOffset: row.week_offset,
    hfMax: row.hf_max,
    rhrBaseline: row.rhr_baseline,
    weight: row.weight ?? fallback.weight,
    height: row.height ?? fallback.height,
    goalPace: row.goal_pace ?? fallback.goalPace,
    weeklyVolumeTarget: row.weekly_volume_target ?? fallback.weeklyVolumeTarget,
  };
}

function rowToLog(row: DailyLogRow): DailyLog {
  const log: DailyLog = { date: row.date };
  if (row.sleep !== null) log.sleep = row.sleep;
  if (row.rhr !== null) log.rhr = row.rhr;
  if (row.energy !== null) log.energy = row.energy;
  if (row.stress !== null) log.stress = row.stress;
  if (row.mood !== null) log.mood = row.mood;
  if (row.weight !== null) log.weight = row.weight;
  if (row.strength !== null) log.strength = row.strength;
  if (row.blackroll !== null) log.blackroll = row.blackroll;
  if (row.nutrition !== null) log.nutrition = row.nutrition;
  if (row.notes !== null) log.notes = row.notes;
  if (row.hund !== null) log.hund = row.hund;
  return log;
}

const PROFILE_FIELD_MAP: Array<[keyof Settings, string]> = [
  ['name', 'name'],
  ['startDate', 'start_date'],
  ['weekOffset', 'week_offset'],
  ['hfMax', 'hf_max'],
  ['rhrBaseline', 'rhr_baseline'],
  ['weight', 'weight'],
  ['height', 'height'],
  ['goalPace', 'goal_pace'],
  ['weeklyVolumeTarget', 'weekly_volume_target'],
];

export async function upsertProfile(
  userId: string,
  patch: Partial<Settings>,
): Promise<void> {
  const payload: Record<string, unknown> = { id: userId };
  for (const [tsKey, dbKey] of PROFILE_FIELD_MAP) {
    if (tsKey in patch) {
      payload[dbKey] = patch[tsKey] ?? null;
    }
  }
  const { error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' });
  if (error) {
    console.error('upsertProfile', error);
    throw error;
  }
}

export async function fetchSettings(
  userId: string,
  fallback: Settings,
): Promise<Settings | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('fetchSettings', error);
    return null;
  }
  if (!data) return null;
  return profileToSettings(data as ProfileRow, fallback);
}

export async function fetchDailyLogs(
  userId: string,
): Promise<Record<string, DailyLog>> {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(365);
  if (error) {
    console.error('fetchDailyLogs', error);
    return {};
  }
  const map: Record<string, DailyLog> = {};
  for (const row of data as DailyLogRow[]) {
    map[row.date] = rowToLog(row);
  }
  return map;
}

const DAILY_LOG_FIELDS = [
  'sleep',
  'rhr',
  'energy',
  'stress',
  'mood',
  'weight',
  'strength',
  'blackroll',
  'nutrition',
  'notes',
  'hund',
] as const;

export async function upsertDailyLog(
  userId: string,
  date: string,
  patch: Partial<DailyLog>,
): Promise<void> {
  const payload: Record<string, unknown> = { user_id: userId, date };
  for (const field of DAILY_LOG_FIELDS) {
    if (field in patch) {
      payload[field] = patch[field] ?? null;
    }
  }
  const { error } = await supabase
    .from('daily_logs')
    .upsert(payload, { onConflict: 'user_id,date' });
  if (error) {
    console.error('upsertDailyLog', error);
    throw error;
  }
}

export async function deleteDailyLog(userId: string, date: string): Promise<void> {
  const { error } = await supabase
    .from('daily_logs')
    .delete()
    .eq('user_id', userId)
    .eq('date', date);
  if (error) {
    console.error('deleteDailyLog', error);
    throw error;
  }
}

// ============= Workout Logs =============

interface WorkoutLogRow {
  id: string;
  user_id: string;
  week: number;
  day: string;
  type: WorkoutType | null;
  completed: boolean;
  date: string | null;
  distance: number | null;
  duration: number | null;
  avg_hr: number | null;
  max_hr: number | null;
  rpe: number | null;
  weather: string | null;
  youtube: string | null;
  blackroll: string | null;
  strava_id: string | null;
  notes: string | null;
  splits: KmSplit[] | null;
  zones: ZoneDistribution | null;
}

function rowToWorkoutLog(row: WorkoutLogRow): WorkoutLog {
  const log: WorkoutLog = { completed: row.completed };
  if (row.type) log.type = row.type;
  if (row.distance !== null) log.distance = row.distance;
  if (row.duration !== null) log.duration = row.duration;
  if (row.avg_hr !== null) log.avgHr = row.avg_hr;
  if (row.max_hr !== null) log.maxHr = row.max_hr;
  if (row.rpe !== null) log.rpe = row.rpe;
  if (row.weather !== null) log.weather = row.weather;
  if (row.youtube !== null) log.youtube = row.youtube;
  if (row.blackroll !== null) log.blackroll = row.blackroll;
  if (row.strava_id !== null) log.stravaId = row.strava_id;
  if (row.notes !== null) log.notes = row.notes;
  if (row.splits !== null) log.splits = row.splits;
  if (row.zones !== null) log.zones = row.zones;
  return log;
}

export async function fetchWorkoutLogs(
  userId: string,
): Promise<Record<number, Record<string, WorkoutLog>>> {
  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    console.error('fetchWorkoutLogs', error);
    return {};
  }
  const map: Record<number, Record<string, WorkoutLog>> = {};
  for (const row of data as WorkoutLogRow[]) {
    if (!map[row.week]) map[row.week] = {};
    map[row.week][row.day] = rowToWorkoutLog(row);
  }
  return map;
}

const WORKOUT_FIELD_MAP: Array<[keyof WorkoutLog, string]> = [
  ['type', 'type'],
  ['completed', 'completed'],
  ['distance', 'distance'],
  ['duration', 'duration'],
  ['avgHr', 'avg_hr'],
  ['maxHr', 'max_hr'],
  ['rpe', 'rpe'],
  ['weather', 'weather'],
  ['youtube', 'youtube'],
  ['blackroll', 'blackroll'],
  ['stravaId', 'strava_id'],
  ['notes', 'notes'],
  ['splits', 'splits'],
  ['zones', 'zones'],
];

export async function upsertWorkoutLog(
  userId: string,
  week: number,
  day: string,
  patch: Partial<WorkoutLog>,
): Promise<void> {
  const payload: Record<string, unknown> = { user_id: userId, week, day };
  for (const [tsKey, dbKey] of WORKOUT_FIELD_MAP) {
    if (tsKey in patch) {
      payload[dbKey] = patch[tsKey] ?? null;
    }
  }
  const { error } = await supabase
    .from('workout_logs')
    .upsert(payload, { onConflict: 'user_id,week,day' });
  if (error) {
    console.error('upsertWorkoutLog', error);
    throw error;
  }
}
