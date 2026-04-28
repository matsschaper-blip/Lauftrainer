// Strava OAuth + API Proxy
// Endpoints (alle POST oder GET, immer mit Authorization: Bearer <supabase-jwt>):
//   POST /strava/exchange      body { code: string }
//   POST /strava/disconnect
//   GET  /strava/activities?after=<epoch_s>&per_page=30
//   GET  /strava/activity?id=<strava_id>
//   GET  /strava/stream?id=<strava_id>

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const STRAVA_BASE = 'https://www.strava.com';
const STRAVA_API = 'https://www.strava.com/api/v3';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const stravaClientId = Deno.env.get('STRAVA_CLIENT_ID')!;
const stravaClientSecret = Deno.env.get('STRAVA_CLIENT_SECRET')!;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-client-info, apikey',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'content-type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const authHeader = req.headers.get('authorization');
  if (!authHeader) return json({ error: 'Unauthorized' }, 401);

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: userData, error: authErr } = await supabase.auth.getUser(
    authHeader.replace(/^Bearer\s+/i, ''),
  );
  if (authErr || !userData.user) return json({ error: 'Invalid token' }, 401);
  const userId = userData.user.id;

  const url = new URL(req.url);
  const action = url.pathname.split('/').pop() ?? '';

  try {
    if (action === 'exchange' && req.method === 'POST') {
      const { code } = await req.json();
      return await handleExchange(supabase, userId, code);
    }
    if (action === 'disconnect' && req.method === 'POST') {
      return await handleDisconnect(supabase, userId);
    }
    if (action === 'activities' && req.method === 'GET') {
      return await handleActivities(supabase, userId, url.searchParams);
    }
    if (action === 'activity' && req.method === 'GET') {
      return await handleActivity(supabase, userId, url.searchParams);
    }
    if (action === 'stream' && req.method === 'GET') {
      return await handleStream(supabase, userId, url.searchParams);
    }
    return json({ error: 'Unknown action', action }, 404);
  } catch (e) {
    console.error('strava error', e);
    return json({ error: e instanceof Error ? e.message : 'unknown' }, 500);
  }
});

interface ProfileRow {
  strava_athlete_id: number | null;
  strava_access_token: string | null;
  strava_refresh_token: string | null;
  strava_expires_at: string | null;
}

async function getProfile(supabase: SupabaseClient, userId: string): Promise<ProfileRow | null> {
  const { data } = await supabase
    .from('profiles')
    .select('strava_athlete_id, strava_access_token, strava_refresh_token, strava_expires_at')
    .eq('id', userId)
    .maybeSingle();
  return data as ProfileRow | null;
}

async function handleExchange(supabase: SupabaseClient, userId: string, code: string) {
  const res = await fetch(`${STRAVA_BASE}/api/v3/oauth/token`, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: stravaClientId,
      client_secret: stravaClientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return json({ error: 'Strava exchange failed', details: text }, 400);
  }
  const data = await res.json();
  await supabase
    .from('profiles')
    .update({
      strava_athlete_id: data.athlete?.id ?? null,
      strava_access_token: data.access_token,
      strava_refresh_token: data.refresh_token,
      strava_expires_at: new Date(data.expires_at * 1000).toISOString(),
    })
    .eq('id', userId);
  return json({ ok: true, athlete: data.athlete });
}

async function handleDisconnect(supabase: SupabaseClient, userId: string) {
  const profile = await getProfile(supabase, userId);
  if (profile?.strava_access_token) {
    fetch(`${STRAVA_BASE}/oauth/deauthorize`, {
      method: 'POST',
      headers: { authorization: `Bearer ${profile.strava_access_token}` },
    }).catch(() => {});
  }
  await supabase
    .from('profiles')
    .update({
      strava_athlete_id: null,
      strava_access_token: null,
      strava_refresh_token: null,
      strava_expires_at: null,
    })
    .eq('id', userId);
  return json({ ok: true });
}

async function getValidAccessToken(supabase: SupabaseClient, userId: string): Promise<string | null> {
  const profile = await getProfile(supabase, userId);
  if (!profile?.strava_access_token || !profile.strava_refresh_token) return null;
  const expiresAt = profile.strava_expires_at ? new Date(profile.strava_expires_at).getTime() : 0;
  if (expiresAt - Date.now() > 5 * 60 * 1000) return profile.strava_access_token;

  const res = await fetch(`${STRAVA_BASE}/api/v3/oauth/token`, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: stravaClientId,
      client_secret: stravaClientSecret,
      refresh_token: profile.strava_refresh_token,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  await supabase
    .from('profiles')
    .update({
      strava_access_token: data.access_token,
      strava_refresh_token: data.refresh_token,
      strava_expires_at: new Date(data.expires_at * 1000).toISOString(),
    })
    .eq('id', userId);
  return data.access_token;
}

async function handleActivities(supabase: SupabaseClient, userId: string, params: URLSearchParams) {
  const token = await getValidAccessToken(supabase, userId);
  if (!token) return json({ error: 'Not connected' }, 400);
  const after = params.get('after') ?? String(Math.floor((Date.now() - 30 * 86_400_000) / 1000));
  const perPage = params.get('per_page') ?? '30';
  const res = await fetch(
    `${STRAVA_API}/athlete/activities?after=${after}&per_page=${perPage}`,
    { headers: { authorization: `Bearer ${token}` } },
  );
  if (!res.ok) return json({ error: 'Strava error', status: res.status }, 502);
  return json(await res.json());
}

async function handleActivity(supabase: SupabaseClient, userId: string, params: URLSearchParams) {
  const id = params.get('id');
  if (!id) return json({ error: 'Missing id' }, 400);
  const token = await getValidAccessToken(supabase, userId);
  if (!token) return json({ error: 'Not connected' }, 400);
  const res = await fetch(`${STRAVA_API}/activities/${id}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) return json({ error: 'Strava error', status: res.status }, 502);
  return json(await res.json());
}

async function handleStream(supabase: SupabaseClient, userId: string, params: URLSearchParams) {
  const id = params.get('id');
  if (!id) return json({ error: 'Missing id' }, 400);
  const token = await getValidAccessToken(supabase, userId);
  if (!token) return json({ error: 'Not connected' }, 400);
  const res = await fetch(
    `${STRAVA_API}/activities/${id}/streams?keys=heartrate,time,distance&key_by_type=true`,
    { headers: { authorization: `Bearer ${token}` } },
  );
  if (!res.ok) return json({ error: 'Strava error', status: res.status }, 502);
  return json(await res.json());
}
