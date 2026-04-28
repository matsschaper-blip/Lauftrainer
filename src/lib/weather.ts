/**
 * Open-Meteo Wetter-Client. Kein API-Key, kein Account, kein Rate-Limit
 * für unseren Use-Case. Endpoint: https://open-meteo.com
 */

const ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  description: string;
  isDay: boolean;
  windKmh: number;
  weatherCode: number;
  fetchedAt: number; // ms epoch
}

export async function fetchWeather(
  lat: number,
  lon: number,
): Promise<CurrentWeather> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      'temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
    timezone: 'auto',
    wind_speed_unit: 'kmh',
  });
  const res = await fetch(`${ENDPOINT}?${params}`);
  if (!res.ok) throw new Error(`Weather API ${res.status}`);
  const data = (await res.json()) as {
    current: {
      temperature_2m: number;
      apparent_temperature: number;
      is_day: 0 | 1;
      weather_code: number;
      wind_speed_10m: number;
    };
  };
  const c = data.current;
  return {
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(c.apparent_temperature),
    description: weatherCodeToText(c.weather_code),
    isDay: c.is_day === 1,
    windKmh: Math.round(c.wind_speed_10m),
    weatherCode: c.weather_code,
    fetchedAt: Date.now(),
  };
}

const WMO_TEXT: Record<number, string> = {
  0: 'klar',
  1: 'überwiegend klar',
  2: 'teils bewölkt',
  3: 'bewölkt',
  45: 'Nebel',
  48: 'gefrierender Nebel',
  51: 'leichter Nieselregen',
  53: 'Nieselregen',
  55: 'starker Nieselregen',
  56: 'gefrierender Nieselregen',
  57: 'gefrierender Nieselregen',
  61: 'leichter Regen',
  63: 'Regen',
  65: 'starker Regen',
  66: 'gefrierender Regen',
  67: 'gefrierender Regen',
  71: 'leichter Schneefall',
  73: 'Schneefall',
  75: 'starker Schneefall',
  77: 'Schneegriesel',
  80: 'leichte Regenschauer',
  81: 'Regenschauer',
  82: 'starke Regenschauer',
  85: 'Schneeschauer',
  86: 'starke Schneeschauer',
  95: 'Gewitter',
  96: 'Gewitter mit Hagel',
  99: 'starkes Gewitter mit Hagel',
};

export function weatherCodeToText(code: number): string {
  return WMO_TEXT[code] ?? 'unbekannt';
}

export function formatWeatherShort(w: CurrentWeather): string {
  return `${w.temp}°C ${w.description}`;
}

export function formatWeatherLong(w: CurrentWeather): string {
  let s = `${w.temp}°C ${w.description}`;
  if (Math.abs(w.feelsLike - w.temp) >= 2) {
    s += ` · gefühlt ${w.feelsLike}°C`;
  }
  if (w.windKmh >= 15) {
    s += ` · ${w.windKmh} km/h Wind`;
  }
  return s;
}

/**
 * Liefert eine kurze Lauf-spezifische Warnung — oder null wenn alles passt.
 */
export function weatherAdvice(w: CurrentWeather): string | null {
  if (w.temp >= 28) {
    return 'Hitze. Früh starten, Pace 20–30s/km langsamer, mehr trinken.';
  }
  if (w.temp >= 24) {
    return 'Warm. Trinken nicht vergessen, ggf. Pace minimal zurücknehmen.';
  }
  if (w.temp <= -2) {
    return 'Frost. Lange aufwärmen, Mütze + Handschuhe, vorsichtig auf Glätte.';
  }
  if (w.temp <= 5) {
    return 'Kalt. Lange Aufwärmphase, Mütze + Handschuhe.';
  }
  if ([95, 96, 99].includes(w.weatherCode)) {
    return 'Gewitter. Lauf verschieben oder Indoor.';
  }
  if (w.windKmh >= 35) {
    return 'Stark windig. Kürzere Strecke, Wind im Hinweg planen.';
  }
  if ([65, 67, 75, 82, 86].includes(w.weatherCode)) {
    return 'Stark Niederschlag. Vorsichtig laufen oder verschieben.';
  }
  return null;
}
