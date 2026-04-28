import { useEffect, useState } from 'react';
import { fetchWeather, type CurrentWeather } from '@/lib/weather';

const STORAGE_KEY = 'lauftrainer-weather-v1';
const CACHE_MS = 30 * 60 * 1000;

interface Cache {
  weather: CurrentWeather;
  lat: number;
  lon: number;
}

interface State {
  weather: CurrentWeather | null;
  error: string | null;
  loading: boolean;
}

let inflight: Promise<void> | null = null;

export function useWeather(): State {
  const [state, setState] = useState<State>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Cache;
        if (Date.now() - parsed.weather.fetchedAt < CACHE_MS) {
          return { weather: parsed.weather, error: null, loading: false };
        }
      }
    } catch {
      /* ignore */
    }
    return { weather: null, error: null, loading: true };
  });

  useEffect(() => {
    // Always background-refresh if cache stale or missing
    const cached = readCache();
    if (cached && Date.now() - cached.weather.fetchedAt < CACHE_MS) return;
    if (inflight) return;

    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Geolocation nicht verfügbar', loading: false }));
      return;
    }

    inflight = new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const w = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
            writeCache({ weather: w, lat: pos.coords.latitude, lon: pos.coords.longitude });
            setState({ weather: w, error: null, loading: false });
          } catch (e) {
            setState((s) => ({
              ...s,
              error: e instanceof Error ? e.message : 'unbekannt',
              loading: false,
            }));
          } finally {
            inflight = null;
            resolve();
          }
        },
        (err) => {
          setState((s) => ({ ...s, error: err.message, loading: false }));
          inflight = null;
          resolve();
        },
        { timeout: 10000, maximumAge: 60 * 60 * 1000, enableHighAccuracy: false },
      );
    });
  }, []);

  return state;
}

function readCache(): Cache | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Cache;
  } catch {
    return null;
  }
}

function writeCache(c: Cache) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}
