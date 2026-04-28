import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { Modal } from '@/components/Modal';
import type { DailyLog } from '@/types';

export function Verlauf() {
  const logs = useStore((s) => s.logs);
  const trainings = useStore((s) => s.trainings);

  const last7 = useMemo(() => buildLast7Stats(logs, trainings), [logs, trainings]);
  const chart14 = useMemo(() => build14DayData(logs, trainings), [logs, trainings]);
  const history = useMemo(() => buildHistory(logs), [logs]);

  const [openLog, setOpenLog] = useState<DailyLog | null>(null);

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
          {history.map(({ date, log }) => (
            <HistoryRow key={date} date={date} log={log} onClick={() => setOpenLog(log)} />
          ))}
        </div>
      )}

      <Modal open={openLog !== null} onClose={() => setOpenLog(null)}>
        {openLog && <LogDetail log={openLog} onClose={() => setOpenLog(null)} />}
      </Modal>
    </section>
  );
}

interface ChartPoint {
  date: string;
  day: number;
  rhr: number | null;
  minutes: number;
}

function build14DayData(
  logs: Record<string, DailyLog>,
  trainings: Record<number, Record<string, { duration?: number }>>,
): ChartPoint[] {
  const today = new Date();
  const data: ChartPoint[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    const log = logs[key];
    let minutes = 0;
    if (log?.training?.duration) minutes = Number(log.training.duration);
    if (minutes === 0) {
      // fallback: scan trainings (workout sync writes there, not into log.training)
      for (const wk of Object.values(trainings)) {
        for (const t of Object.values(wk)) {
          if (t.duration) {
            // No date column in our trainings shape; skip.
          }
        }
      }
    }
    data.push({
      date: key,
      day: d.getDate(),
      rhr: log?.rhr ?? null,
      minutes,
    });
  }
  return data;
}

function buildLast7Stats(
  logs: Record<string, DailyLog>,
  trainings: Record<number, Record<string, { duration?: number; date?: string }>>,
) {
  const today = new Date();
  let sleepSum = 0;
  let sleepCount = 0;
  let rhrSum = 0;
  let rhrCount = 0;
  let minutes = 0;
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dates.push(key);
    const log = logs[key];
    if (log?.sleep) {
      sleepSum += log.sleep;
      sleepCount += 1;
    }
    if (log?.rhr) {
      rhrSum += log.rhr;
      rhrCount += 1;
    }
    if (log?.training?.duration) minutes += Number(log.training.duration);
  }
  // Workout-Logs ohne daily-log-mirror dazuzählen
  for (const wk of Object.values(trainings)) {
    for (const t of Object.values(wk)) {
      if (t.duration && t.date && dates.includes(t.date)) {
        // already counted via log.training? avoid double-count: only add if log.training missing
        const log = logs[t.date];
        if (!log?.training?.duration) minutes += Number(t.duration);
      }
    }
  }
  return {
    sleep: sleepCount > 0 ? (sleepSum / sleepCount).toFixed(1) : null,
    rhr: rhrCount > 0 ? Math.round(rhrSum / rhrCount) : null,
    minutes,
  };
}

function buildHistory(logs: Record<string, DailyLog>) {
  return Object.keys(logs)
    .sort()
    .reverse()
    .slice(0, 30)
    .map((date) => ({ date, log: logs[date]! }));
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

function HistoryRow({
  date,
  log,
  onClick,
}: {
  date: string;
  log: DailyLog;
  onClick: () => void;
}) {
  const dt = new Date(`${date}T00:00:00`);
  const dayShort = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][dt.getDay()];
  const monthShort = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'][dt.getMonth()];

  const parts: string[] = [];
  if (log.training?.duration) parts.push(`${log.training.duration} Min Lauf`);
  if (log.sleep) parts.push(`${log.sleep}h Schlaf`);
  if (log.rhr) parts.push(`RHR ${log.rhr}`);
  if (log.energy) parts.push(`E ${log.energy}/10`);
  if (log.strength) parts.push(log.strength);

  let tag = '';
  if (log.training?.duration) tag = 'Lauf';
  else if (log.strength) tag = 'Kraft';

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

function LogDetail({ log, onClose }: { log: DailyLog; onClose: () => void }) {
  const deleteLog = useStore((s) => s.deleteLog);
  const dt = new Date(`${log.date}T00:00:00`);
  const dayShort = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][dt.getDay()];
  const monthShort = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'][dt.getMonth()];

  function remove() {
    if (!confirm('Eintrag wirklich löschen?')) return;
    deleteLog(log.date);
    onClose();
  }

  return (
    <>
      <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
        {dayShort}, {dt.getDate()}. {monthShort}
      </h2>
      <p className="mb-4 mt-1 text-[13px] text-ink-muted">Eintrag bearbeiten</p>

      {log.training?.duration && (
        <div className="mb-3 rounded-card border border-accent bg-accent-bg p-4">
          <p className="font-display text-[16px] font-medium">Lauf</p>
          <p className="mt-1 font-mono text-[13px]">
            {log.training.distance ? `${log.training.distance} km · ` : ''}
            {log.training.duration} Min
            {log.training.avgHr ? ` · ø ${log.training.avgHr} bpm` : ''}
            {log.training.maxHr ? ` · max ${log.training.maxHr}` : ''}
          </p>
          {log.training.rpe && (
            <p className="mt-1 text-[13px] text-ink-soft">RPE: {log.training.rpe}/10</p>
          )}
          {log.training.weather && (
            <p className="text-[13px] text-ink-soft">Wetter: {log.training.weather}</p>
          )}
          {log.training.notes && (
            <p className="mt-2 text-[13px] text-ink-soft">{log.training.notes}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        {log.sleep && <KeyVal label="Schlaf" value={`${log.sleep} h`} />}
        {log.rhr && <KeyVal label="Ruhepuls" value={`${log.rhr} bpm`} />}
        {log.energy && <KeyVal label="Energie" value={`${log.energy}/10`} />}
        {log.strength && <KeyVal label="Krafttraining" value={log.strength} />}
        {log.blackroll && <KeyVal label="Blackroll" value={log.blackroll} />}
        {log.nutrition && <KeyVal label="Notiz" value={log.nutrition} />}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-line px-[22px] py-3 text-[14px] font-semibold text-ink-soft transition active:scale-95"
        >
          Schließen
        </button>
        <button
          type="button"
          onClick={remove}
          className="flex-1 rounded-full bg-warn px-[22px] py-3 text-[14px] font-semibold text-white transition active:scale-95"
        >
          Eintrag löschen
        </button>
      </div>
    </>
  );
}

function KeyVal({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-card border border-line bg-bg-card px-[14px] py-[10px]">
      <span className="text-[14px] text-ink-soft">{label}</span>
      <span className="font-mono text-[14px] font-medium">{value}</span>
    </div>
  );
}
