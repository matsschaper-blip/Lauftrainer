-- Strava-OAuth-Tokens in Profile speichern
-- access_token rotiert alle 6h, refresh_token bleibt bis zum disconnect.

alter table public.profiles
  add column if not exists strava_athlete_id bigint,
  add column if not exists strava_access_token text,
  add column if not exists strava_refresh_token text,
  add column if not exists strava_expires_at timestamptz;
