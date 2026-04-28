import { useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Modal } from '@/components/Modal';
import type { DailyLog, DayKey, KmSplit, WorkoutLog, ZoneDistribution } from '@/types';

interface DayRow {
  date: string;
  log?: DailyLog;
  workout?: WorkoutLog;
}

export function Verlauf() {
  const logs = useStore((s) => s.logs);
  const trainings = useStore((s) => s.trainings);
  const startDate = useStore((s) => s.settings.startDate);

  const workoutsByDate = useMemo(
    () => indexWorkoutsByDate(trainings, startDate),
    [trainings, startDate],
  );
  const last7 = useMemo(
    () => buildLast7Stats(logs, workoutsByDate),
    [logs, workoutsByDate],
  );
  const chart14 = useMemo(
    () => build14DayData(logs, workoutsByDate),
    [logs, workoutsByDate],
  );
  const history = useMemo(
    () => buildHistory(logs, workoutsByDate),
    [logs, workoutsByDate],
  );

  const [openRow, setOpenRow] = useState<DayRow | null>(null);

  return (
    <section>
      <div className="mb-6 border-b border-line pb-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Verlauf · Trends
        </p>
        <h1 className="font-display text-[clamp(28px,7vw,38px)] font-normal leading-tight tracking-tight">
          Dein <em className="font-light text-accent">Verlauf</em>.
        </h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          Was du getrackt hast, was sich verändert.
        </p>
      </div>

      <h3 className="mb-[10px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Letzte 7 Tage
      </h3>
      <div className="mb-5 grid grid-cols-3 gap-[10px]">
        <BigStat value={last7.sleep ?? '—'} label="Ø Schlaf" suffix={last7.sleep ? ' h' : ''} />
        <BigStat value={last7.rhr ?? '—'} label="Ø RHR" />
        <BigStat value={String(last7.minutes)} label="Lauf-Min" />
      </div>

      <BarChart
        title="Ruhepuls · 14 Tage"
        data={chart14}
        valueKey="rhr"
        unit="bpm"
        emptyHint="Noch keine RHR-Daten"
      />
      <BarChart
        title="Lauf-Minuten · 14 Tage"
        data={chart14}
        valueKey="minutes"
        unit="min"
        emptyHint="Noch keine Lauf-Daten"
      />

      <h3 className="mb-[10px] mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Historie
      </h3>

      {history.length === 0 ? (
        <div className="py-10 text-center text-ink-muted">
          <p className="font-display text-[18px] font-medium italic text-ink-soft">
            Noch keine Einträge
          </p>
          <p className="mt-1 text-[13px]">Logge im Heute-Tab</p>
        </div>
      ) : (
        <div className="space-y-[6px]">
          {history.map((row) => (
            <HistoryRow key={row.date} row={row} onClick={() => setOpenRow(row)} />
          ))}
        </div>
      )}

      <Modal
        open={openRow !== null}
        onClose={() => setOpenRow(null)}
        fullscreen
      >
        {openRow && <DayDetail row={openRow} onClose={() => setOpenRow(null)} />}
      </Modal>
    </section>
  );
}

function indexWorkoutsByDate(
  trainings: Record<number, Record<string, WorkoutLog>>,
  startDate: string,
): Record<string, WorkoutLog> {
  const byDate: Record<string, WorkoutLog> = {};
  for (const [weekStr, week] of Object.entries(trainings)) {
    const weekNum = Number(weekStr);
    for (const [day, w] of Object.entries(week)) {
      const date = w.date ?? computeDate(startDate, weekNum, day as DayKey);
      if (date) byDate[date] = w;
    }
  }
  return byDate;
}

const DAY_OFFSET: Record<DayKey, number> = {
  mo: 0, di: 1, mi: 2, do: 3, fr: 4, sa: 5, so: 6,
};

function computeDate(startDate: string, week: number, day: DayKey): string | null {
  const start = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;
  const offset = (week - 1) * 7 + DAY_OFFSET[day];
  start.setDate(start.getDate() + offset);
  return start.toISOString().slice(0, 10);
}

interface ChartPoint {
  date: string;
  day: number;
  rhr: number | null;
  minutes: number;
}

function build14DayData(
  logs: Record<string, DailyLog>,
  workoutsByDate: Record<string, WorkoutLog>,
): ChartPoint[] {
  const today = new Date();
  const data: ChartPoint[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    const log = logs[key];
    const w = workoutsByDate[key];
    data.push({
      date: key,
      day: d.getDate(),
      rhr: log?.rhr ?? null,
      minutes: w?.duration ? Number(w.duration) : 0,
    });
  }
  return data;
}

function buildLast7Stats(
  logs: Record<string, DailyLog>,
  workoutsByDate: Record<string, WorkoutLog>,
) {
  const today = new Date();
  let sleepSum = 0;
  let sleepCount = 0;
  let rhrSum = 0;
  let rhrCount = 0;
  let minutes = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const log = logs[key];
    if (log?.sleep) {
      sleepSum += log.sleep;
      sleepCount += 1;
    }
    if (log?.rhr) {
      rhrSum += log.rhr;
      rhrCount += 1;
    }
    const w = workoutsByDate[key];
    if (w?.duration) minutes += Number(w.duration);
  }
  return {
    sleep: sleepCount > 0 ? (sleepSum / sleepCount).toFixed(1) : null,
    rhr: rhrCount > 0 ? Math.round(rhrSum / rhrCount) : null,
    minutes,
  };
}

function buildHistory(
  logs: Record<string, DailyLog>,
  workoutsByDate: Record<string, WorkoutLog>,
): DayRow[] {
  const allDates = new Set<string>([...Object.keys(logs), ...Object.keys(workoutsByDate)]);
  return Array.from(allDates)
    .sort()
    .reverse()
    .slice(0, 30)
    .map((date) => ({
      date,
      log: logs[date],
      workout: workoutsByDate[date],
    }));
}

function BigStat({
  value,
  label,
  suffix,
}: {
  value: string | number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-card border border-line bg-bg-card p-[14px]">
      <p className="font-display text-[26px] font-medium leading-none text-accent">
        {value}
        {suffix}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </p>
    </div>
  );
}

function BarChart({
  title,
  data,
  valueKey,
  unit,
  emptyHint,
}: {
  title: string;
  data: ChartPoint[];
  valueKey: 'rhr' | 'minutes';
  unit: string;
  emptyHint: string;
}) {
  const values = data.map((d) => (valueKey === 'rhr' ? d.rhr : d.minutes));
  const valid = values.filter((v): v is number => v !== null && v > 0);
  const hasData = valid.length > 0;

  let min = valueKey === 'rhr' ? Math.min(...valid) - 2 : 0;
  let max = Math.max(...valid, valueKey === 'rhr' ? 70 : 90);
  if (!hasData) {
    min = 0;
    max = 1;
  }
  const range = max - min || 1;

  return (
    <div className="mb-[14px] rounded-card border border-line bg-bg-card p-4">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-soft">
        {title}
      </p>
      {!hasData ? (
        <p className="py-5 text-[12px] text-ink-muted">{emptyHint}</p>
      ) : (
        <>
          <div className="flex h-[80px] items-end gap-[3px]">
            {data.map((d, i) => {
              const v = valueKey === 'rhr' ? d.rhr : d.minutes;
              const has = v !== null && v > 0;
              const h = has ? Math.max(2, ((v - min) / range) * 70) : 2;
              return (
                <div
                  key={i}
                  title={has ? `${d.day}.: ${v} ${unit}` : `${d.day}.: —`}
                  className={`flex-1 rounded-t-[3px] transition ${
                    has ? 'bg-accent' : 'bg-accent-bg'
                  }`}
                  style={{ height: `${h}px`, minHeight: '2px' }}
                />
              );
            })}
          </div>
          <div className="mt-1 flex gap-[3px]">
            {data.map((d, i) => (
              <div
                key={i}
                className="flex-1 text-center font-mono text-[9px] text-ink-muted"
              >
                {i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2)
                  ? `${d.day}.`
                  : ''}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function HistoryRow({ row, onClick }: { row: DayRow; onClick: () => void }) {
  const { date, log, workout } = row;
  const dt = new Date(`${date}T00:00:00`);
  const dayShort = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][dt.getDay()];
  const monthShort = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'][dt.getMonth()];

  const parts: string[] = [];
  if (workout?.duration) {
    const km = workout.distance ? `${workout.distance} km · ` : '';
    parts.push(`${km}${workout.duration} Min`);
  }
  if (workout?.avgHr) parts.push(`ø ${workout.avgHr} bpm`);
  if (log?.sleep) parts.push(`${log.sleep}h Schlaf`);
  if (log?.rhr) parts.push(`RHR ${log.rhr}`);
  if (log?.energy) parts.push(`E ${log.energy}/10`);
  if (log?.strength) parts.push(log.strength);

  let tag = '';
  if (workout?.duration) tag = 'Lauf';
  else if (log?.strength) tag = 'Kraft';

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full grid-cols-[60px_1fr_auto] items-center gap-[10px] rounded-card border border-line bg-bg-card px-[14px] py-[12px] text-left transition active:bg-bg-soft"
    >
      <span className="font-mono text-[11px] uppercase leading-tight text-ink-muted">
        {dayShort}
        <strong className="block text-[14px] text-ink">
          {dt.getDate()}. {monthShort}
        </strong>
      </span>
      <span className="text-[13px] text-ink-soft">
        {parts.length ? parts.join(' · ') : <em className="text-ink-muted">nur Notiz</em>}
      </span>
      {tag && (
        <span className="rounded bg-accent-bg px-[7px] py-[3px] font-mono text-[10px] font-medium text-accent">
          {tag}
        </span>
      )}
    </button>
  );
}

function DayDetail({ row, onClose }: { row: DayRow; onClose: () => void }) {
  const deleteLog = useStore((s) => s.deleteLog);
  const { date, log, workout } = row;
  const dt = new Date(`${date}T00:00:00`);
  const dayLong = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'][dt.getDay()];
  const monthLong = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'][dt.getMonth()];

  function remove() {
    if (!confirm('Daily-Log-Eintrag wirklich löschen? (Lauf bleibt erhalten)')) return;
    if (log) deleteLog(date);
    onClose();
  }

  const hasRun = !!workout?.duration;
  const pace = hasRun && workout.distance && workout.duration
    ? formatPace(workout.duration, workout.distance)
    : null;

  return (
    <div className="mx-auto max-w-[700px] px-[18px] pb-[40px] pt-3">
      <button
        type="button"
        onClick={onClose}
        className="mb-4 -ml-2 flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium text-ink-soft transition active:bg-bg-soft"
      >
        <ArrowLeft size={18} /> zurück
      </button>

      <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted">
        {dayLong}
      </p>
      <h1 className="font-display text-[clamp(28px,7vw,38px)] font-normal leading-tight tracking-tight">
        {dt.getDate()}. <em className="text-accent">{monthLong}</em>
      </h1>

      {hasRun && (
        <>
          <h3 className="mb-[10px] mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Lauf
          </h3>

          <div className="mb-[14px] grid grid-cols-2 gap-[1px] overflow-hidden rounded-card border border-line bg-line">
            <RunStat label="Distanz" value={workout.distance ? `${workout.distance}` : '—'} unit="km" />
            <RunStat label="Dauer" value={`${workout.duration}`} unit="min" />
            <RunStat label="Ø Pace" value={pace ?? '—'} unit="/km" />
            <RunStat label="Ø HF" value={workout.avgHr ? `${workout.avgHr}` : '—'} unit="bpm" />
            {workout.maxHr && (
              <RunStat label="Max HF" value={`${workout.maxHr}`} unit="bpm" />
            )}
            {workout.rpe && (
              <RunStat label="RPE" value={`${workout.rpe}`} unit="/10" />
            )}
          </div>

          {workout.zones && totalZoneSeconds(workout.zones) > 0 && (
            <>
              <h3 className="mb-[10px] mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                HF-Zonen-Verteilung
              </h3>
              <ZoneBar zones={workout.zones} />
              <ZoneTable zones={workout.zones} />
            </>
          )}

          {workout.splits && workout.splits.length > 0 && (
            <>
              <h3 className="mb-[10px] mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Splits
              </h3>
              <SplitsList splits={workout.splits} />
            </>
          )}

          {(workout.weather || workout.notes || workout.stravaId) && (
            <>
              <h3 className="mb-[10px] mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                Details
              </h3>
              <div className="space-y-2">
                {workout.weather && <KeyVal label="Wetter" value={workout.weather} />}
                {workout.blackroll && <KeyVal label="Blackroll" value={blackrollLabel(workout.blackroll)} />}
                {workout.notes && (
                  <div className="rounded-card border border-line bg-bg-card px-[14px] py-[10px]">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                      Notiz
                    </p>
                    <p className="mt-1 text-[14px] text-ink-soft">{workout.notes}</p>
                  </div>
                )}
                {workout.stravaId && (
                  <p className="font-mono text-[11px] text-ink-muted">
                    Strava #{workout.stravaId}
                  </p>
                )}
              </div>
            </>
          )}
        </>
      )}

      {log && (Object.keys(log).filter((k) => k !== 'date').length > 0) && (
        <>
          <h3 className="mb-[10px] mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Daily Log
          </h3>
          <div className="space-y-2">
            {log.sleep && <KeyVal label="Schlaf" value={`${log.sleep} h`} />}
            {log.rhr && <KeyVal label="Ruhepuls" value={`${log.rhr} bpm`} />}
            {log.energy && <KeyVal label="Energie" value={`${log.energy}/10`} />}
            {log.strength && <KeyVal label="Krafttraining" value={log.strength} />}
            {log.blackroll && <KeyVal label="Blackroll" value={log.blackroll} />}
            {log.nutrition && <KeyVal label="Notiz" value={log.nutrition} />}
          </div>
        </>
      )}

      {log && (
        <button
          type="button"
          onClick={remove}
          className="mt-[32px] w-full rounded-full border border-warn py-3 text-[13px] font-semibold text-warn transition active:scale-95"
        >
          Daily-Log löschen
        </button>
      )}
    </div>
  );
}

function RunStat({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="bg-bg-card px-[14px] py-[14px]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-[26px] font-medium leading-none text-ink">
        {value}
        <span className="ml-1 font-sans text-[12px] font-normal text-ink-muted">
          {unit}
        </span>
      </p>
    </div>
  );
}

const ZONE_COLORS = [
  '#A8C4B0', // Z1 hellgrün
  '#7BA388', // Z2 mittelgrün — Mats' Master-Zone
  '#D4A04A', // Z3 gelb-orange
  '#C8552B', // Z4 orange
  '#8B2A1A', // Z5 dunkelrot
];

function ZoneBar({ zones }: { zones: ZoneDistribution }) {
  const total = totalZoneSeconds(zones);
  if (total === 0) return null;
  const segs = [zones.z1, zones.z2, zones.z3, zones.z4, zones.z5];
  return (
    <div className="mb-2 flex h-[28px] w-full overflow-hidden rounded-full border border-line">
      {segs.map((sec, i) => {
        const pct = (sec / total) * 100;
        if (pct < 0.5) return null;
        return (
          <div
            key={i}
            style={{ width: `${pct}%`, background: ZONE_COLORS[i] }}
            title={`Z${i + 1}: ${fmtZone(sec)}`}
          />
        );
      })}
    </div>
  );
}

function ZoneTable({ zones }: { zones: ZoneDistribution }) {
  const total = totalZoneSeconds(zones);
  const rows: Array<[string, number]> = [
    ['Z1', zones.z1],
    ['Z2', zones.z2],
    ['Z3', zones.z3],
    ['Z4', zones.z4],
    ['Z5', zones.z5],
  ];
  return (
    <div className="mt-2 grid grid-cols-5 gap-[1px] overflow-hidden rounded-card border border-line bg-line">
      {rows.map(([label, sec], i) => {
        const pct = total > 0 ? Math.round((sec / total) * 100) : 0;
        return (
          <div key={label} className="bg-bg-card px-[8px] py-[10px] text-center">
            <div
              className="mx-auto h-[3px] w-[20px] rounded"
              style={{ background: ZONE_COLORS[i] }}
            />
            <p className="mt-1 font-mono text-[11px] font-semibold">{label}</p>
            <p className="mt-[2px] font-mono text-[12px] text-ink">{fmtZone(sec)}</p>
            <p className="font-mono text-[10px] text-ink-muted">{pct}%</p>
          </div>
        );
      })}
    </div>
  );
}

function SplitsList({ splits }: { splits: KmSplit[] }) {
  // Pace range für relative Bar-Visualisierung
  const paces = splits.map(splitPaceSeconds).filter((p): p is number => p !== null);
  const minPace = paces.length > 0 ? Math.min(...paces) : 0;
  const maxPace = paces.length > 0 ? Math.max(...paces) : 1;
  const range = maxPace - minPace || 1;

  return (
    <div className="space-y-[3px]">
      {splits.map((s) => {
        const ps = splitPaceSeconds(s);
        const norm = ps !== null ? (ps - minPace) / range : 0;
        return (
          <div
            key={s.km}
            className="grid grid-cols-[36px_1fr_60px_60px] items-center gap-[10px] rounded-md border border-line bg-bg-card px-[12px] py-[8px]"
          >
            <span className="font-mono text-[12px] font-semibold text-ink-muted">
              km {s.km}
            </span>
            <div className="relative h-[6px] overflow-hidden rounded-full bg-bg-soft">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${(1 - norm) * 80 + 20}%` }}
              />
            </div>
            <span className="font-mono text-[13px]">{s.pace ?? '—'}/km</span>
            <span className="font-mono text-[12px] text-ink-soft">
              {s.hr ? `${s.hr} bpm` : '—'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function splitPaceSeconds(s: KmSplit): number | null {
  if (!s.pace || !s.pace.includes(':')) return null;
  const [m, sec] = s.pace.split(':').map((x) => parseInt(x, 10));
  if (Number.isNaN(m) || Number.isNaN(sec)) return null;
  return m * 60 + sec;
}

function totalZoneSeconds(z: ZoneDistribution): number {
  return z.z1 + z.z2 + z.z3 + z.z4 + z.z5;
}

function formatPace(durationMin: number, distanceKm: number): string {
  const totalSeconds = durationMin * 60;
  const sPerKm = totalSeconds / distanceKm;
  const m = Math.floor(sPerKm / 60);
  const s = Math.round(sPerKm % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function blackrollLabel(value: string): string {
  switch (value) {
    case 'slot1': return 'Slot 1 · 5 Min';
    case 'spezial': return 'Slot 1 + Knie-Spezial';
    case 'ball': return 'Slot 1 + Massageball';
    default: return value;
  }
}

function fmtZone(seconds: number): string {
  if (!seconds || seconds < 1) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function KeyVal({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-card border border-line bg-bg-card px-[14px] py-[10px]">
      <span className="text-[14px] text-ink-soft">{label}</span>
      <span className="font-mono text-[14px] font-medium">{value}</span>
    </div>
  );
}
