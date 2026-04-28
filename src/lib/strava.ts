import { supabase } from './supabase';

const STRAVA_CLIENT_ID = '232378';
const FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/strava`;

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  sport_type?: string;
  start_date_local: string;
  start_date: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number;
  total_elevation_gain: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_speed: number;
  has_heartrate: boolean;
  splits_metric?: StravaSplit[];
}

export interface StravaSplit {
  distance: number;
  elapsed_time: number;
  moving_time: number;
  average_speed: number;
  average_heartrate?: number;
  pace_zone?: number;
  split: number;
}

export interface StravaStream {
  time?: { data: number[] };
  heartrate?: { data: number[] };
  distance?: { data: number[] };
}

function redirectUri(): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}`;
}

export function startConnect(): void {
  const url = new URL('https://www.strava.com/oauth/authorize');
  url.searchParams.set('client_id', STRAVA_CLIENT_ID);
  url.searchParams.set('redirect_uri', redirectUri());
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'read,activity:read_all');
  url.searchParams.set('approval_prompt', 'auto');
  window.location.href = url.toString();
}

async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Not authenticated');
  return { authorization: `Bearer ${token}` };
}

export async function exchangeCode(
  code: string,
): Promise<{ ok: boolean; athlete?: { id: number; firstname?: string; lastname?: string } }> {
  const res = await fetch(`${FN_BASE}/exchange`, {
    method: 'POST',
    headers: { ...(await authHeaders()), 'content-type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`exchange failed: ${body}`);
  }
  return await res.json();
}

export async function disconnect(): Promise<void> {
  const res = await fetch(`${FN_BASE}/disconnect`, {
    method: 'POST',
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error('disconnect failed');
}

export async function fetchActivities(after?: number): Promise<StravaActivity[]> {
  const url = new URL(`${FN_BASE}/activities`);
  if (after) url.searchParams.set('after', String(after));
  const res = await fetch(url, { headers: await authHeaders() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`activities ${res.status}: ${body.slice(0, 200)}`);
  }
  return await res.json();
}

export async function fetchStream(activityId: number): Promise<StravaStream> {
  const res = await fetch(`${FN_BASE}/stream?id=${activityId}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`stream ${res.status}: ${body.slice(0, 200)}`);
  }
  return await res.json();
}

export function isRun(a: StravaActivity): boolean {
  const t = (a.sport_type ?? a.type ?? '').toLowerCase();
  return t.includes('run');
}

export function todayStartEpochSeconds(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
}
