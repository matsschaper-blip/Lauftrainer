import { supabase } from './supabase';
import type { DailyLog, Settings } from '@/types';

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
