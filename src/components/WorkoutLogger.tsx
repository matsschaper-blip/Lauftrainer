import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { ScaleInput } from './ScaleInput';
import { showToast } from './Toast';
import { useStore } from '@/store/useStore';
import { useWeather } from '@/hooks/useWeather';
import { formatWeatherLong } from '@/lib/weather';
import { todayISO } from '@/utils/date';
import {
  fetchActivities,
  fetchStream,
  isRun,
  todayStartEpochSeconds,
} from '@/lib/strava';
import { computeZones } from '@/utils/zones';
import type {
  DayKey,
  PlannedWorkout,
  WorkoutLog,
  ZoneDistribution,
  KmSplit,
} from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  week: number;
  day: DayKey;
  planned: PlannedWorkout;
}

const BLACKROLL_OPTIONS = [
  { value: '', label: 'Nichts gemacht' },
  { value: 'slot1', label: 'Slot 1 · 5 Min Standard' },
  { value: 'spezial', label: 'Slot 1 + Knie-Spezial · 10 Min' },
  { value: 'ball', label: 'Slot 1 + Massageball Spots' },
];

export function WorkoutLogger({ open, onClose, week, day, planned }: Props) {
  const existing = useStore((s) => s.trainings[week]?.[day]);
  const setWorkout = useStore((s) => s.setWorkout);
  const stravaAthleteId = useStore((s) => s.stravaAthleteId);
  const hfMax = useStore((s) => s.settings.hfMax);
  const { weather: liveWeather } = useWeather();

  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [avgHr, setAvgHr] = useState('');
  const [maxHr, setMaxHr] = useState('');
  const [rpe, setRpe] = useState<number | undefined>(undefined);
  const [weather, setWeather] = useState('');
  const [youtube, setYoutube] = useState('');
  const [blackroll, setBlackroll] = useState('');
  const [notes, setNotes] = useState('');
  const [stravaId, setStravaId] = useState<string | undefined>(undefined);
  const [zones, setZones] = useState<ZoneDistribution | undefined>(undefined);
  const [splits, setSplits] = useState<KmSplit[] | undefined>(undefined);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDistance(existing?.distance ? String(existing.distance) : '');
    setDuration(
      existing?.duration ? String(existing.duration) : String(planned.minutes),
    );
    setAvgHr(existing?.avgHr ? String(existing.avgHr) : '');
    setMaxHr(existing?.maxHr ? String(existing.maxHr) : '');
    setRpe(existing?.rpe);
    const fallbackWeather = liveWeather ? formatWeatherLong(liveWeather) : '';
    setWeather(existing?.weather ?? fallbackWeather);
    setYoutube(existing?.youtube ?? '');
    setBlackroll(existing?.blackroll ?? '');
    setNotes(existing?.notes ?? '');
    setStravaId(existing?.stravaId);
    setZones(existing?.zones);
    setSplits(existing?.splits);
  }, [open, existing, planned.minutes, liveWeather]);

  async function handleImportFromStrava() {
    setImporting(true);
    try {
      const acts = await fetchActivities(todayStartEpochSeconds());
      const runs = acts.filter(isRun);
      if (runs.length === 0) {
        showToast('Kein Strava-Lauf für heute gefunden');
        return;
      }
      const a = runs[0];
      setDistance((a.distance / 1000).toFixed(2));
      setDuration(String(Math.round(a.moving_time / 60)));
      if (a.average_heartrate) setAvgHr(String(Math.round(a.average_heartrate)));
      if (a.max_heartrate) setMaxHr(String(a.max_heartrate));
      setStravaId(String(a.id));

      if (a.has_heartrate) {
        try {
          const stream = await fetchStream(a.id);
          const z = computeZones(stream.heartrate?.data, stream.time?.data, hfMax);
          setZones(z);
        } catch (e) {
          console.error('stream fetch failed', e);
        }
      }

      if (a.splits_metric && a.splits_metric.length > 0) {
        const ks: KmSplit[] = a.splits_metric.map((s) => ({
          km: s.split,
          time: s.elapsed_time,
          pace: paceFromMps(s.average_speed),
          hr: s.average_heartrate ? Math.round(s.average_heartrate) : undefined,
        }));
        setSplits(ks);
      }

      showToast('Strava-Daten übernommen');
    } catch (e) {
      console.error('import failed', e);
      showToast('Strava-Import fehlgeschlagen');
    } finally {
      setImporting(false);
    }
  }

  function save() {
    const patch: Partial<WorkoutLog> = {
      completed: true,
      type: planned.type,
      date: existing?.date ?? todayISO(),
    };
    if (distance) patch.distance = parseFloat(distance);
    if (duration) patch.duration = parseInt(duration, 10);
    if (avgHr) patch.avgHr = parseInt(avgHr, 10);
    if (maxHr) patch.maxHr = parseInt(maxHr, 10);
    if (rpe !== undefined) patch.rpe = rpe;
    if (weather.trim()) patch.weather = weather.trim();
    if (youtube.trim()) patch.youtube = youtube.trim();
    if (blackroll) patch.blackroll = blackroll;
    if (notes.trim()) patch.notes = notes.trim();
    if (stravaId) patch.stravaId = stravaId;
    if (zones) patch.zones = zones;
    if (splits) patch.splits = splits;

    setWorkout(week, day, patch);
    showToast('Lauf geloggt');
    onClose();
  }

  function paceFromMps(mps: number): string {
    if (mps <= 0) return '—';
    const secPerKm = 1000 / mps;
    const m = Math.floor(secPerKm / 60);
    const s = Math.round(secPerKm % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
        {planned.label}
      </h2>
      <p className="mb-[14px] mt-1 text-[13px] text-ink-muted">{planned.description}</p>

      {stravaAthleteId && (
        <button
          type="button"
          onClick={handleImportFromStrava}
          disabled={importing}
          className="mb-[18px] w-full rounded-full border border-accent bg-accent-bg px-[18px] py-[12px] text-[13px] font-semibold text-accent transition active:scale-95 disabled:opacity-50"
        >
          {importing ? 'Importiere…' : '↓ Aus Strava importieren'}
        </button>
      )}

      {zones && (
        <div className="mb-[14px] rounded-card border border-line bg-bg-soft p-[10px]">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
            HF-Zonen aus Strava
          </p>
          <p className="font-mono text-[12px] text-ink">
            Z1 {fmtZ(zones.z1)} · Z2 {fmtZ(zones.z2)} · Z3 {fmtZ(zones.z3)} · Z4 {fmtZ(zones.z4)} · Z5 {fmtZ(zones.z5)}
          </p>
        </div>
      )}

      <Row>
        <Field label="Distanz (km)">
          <input
            type="number"
            step={0.1}
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="5"
            className={inputCls}
          />
        </Field>
        <Field label="Dauer (Min)">
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder={String(planned.minutes)}
            className={inputCls}
          />
        </Field>
      </Row>

      <Row>
        <Field label="Ø Puls">
          <input
            type="number"
            value={avgHr}
            onChange={(e) => setAvgHr(e.target.value)}
            placeholder="142"
            className={inputCls}
          />
        </Field>
        <Field label="Max Puls">
          <input
            type="number"
            value={maxHr}
            onChange={(e) => setMaxHr(e.target.value)}
            placeholder="160"
            className={inputCls}
          />
        </Field>
      </Row>

      <Field label="RPE (Anstrengung 1–10)">
        <ScaleInput value={rpe} onChange={setRpe} />
      </Field>

      <Field label="Wetter">
        <input
          type="text"
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          placeholder="z.B. 12°C bewölkt"
          className={inputCls}
        />
      </Field>

      <Field label="YouTube-Link (optional)">
        <input
          type="url"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          placeholder="https://..."
          className={inputCls}
        />
      </Field>

      <Field label="Blackroll nach Lauf">
        <select
          value={blackroll}
          onChange={(e) => setBlackroll(e.target.value)}
          className={`${inputCls} appearance-none`}
        >
          {BLACKROLL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Notizen">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Wie war's? Auffälligkeiten?"
          className={`${inputCls} min-h-[80px] resize-y`}
        />
      </Field>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-line px-[22px] py-3 text-[14px] font-semibold text-ink-soft transition active:scale-95"
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={save}
          className="flex-1 rounded-full bg-accent px-[22px] py-3 text-[14px] font-semibold text-white transition active:scale-95"
        >
          Speichern + Abhaken
        </button>
      </div>
    </Modal>
  );
}

const inputCls =
  'w-full rounded-card border border-line bg-bg px-[14px] py-[12px] text-[16px] outline-none transition focus:border-accent focus:bg-bg-card';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-[6px] block text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-[10px]">{children}</div>;
}

function fmtZ(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}
