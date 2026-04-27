import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { planWeek } from '@/data/plan';
import {
  computeCurrentWeek,
  dayName,
  formatDate,
  greeting,
  todayDayKey,
  todayISO,
  tomorrowDayKey,
} from '@/utils/date';
import { QuickLogModal, type LoggerType } from '@/components/QuickLogModal';
import { WorkoutDetailModal } from '@/components/WorkoutDetailModal';
import type { PlannedWorkout } from '@/types';

export function Heute() {
  const settings = useStore((s) => s.settings);
  const log = useStore((s) => s.logs[todayISO()]);
  const trainings = useStore((s) => s.trainings);

  const currentWeek = useMemo(
    () => computeCurrentWeek(settings.startDate, settings.weekOffset),
    [settings.startDate, settings.weekOffset],
  );

  const week = useMemo(() => planWeek(currentWeek), [currentWeek]);
  const today = todayDayKey();
  const tomorrow = tomorrowDayKey();

  const todayWorkout = week?.workouts.find((w) => w.day === today);
  const tomorrowWorkout = week?.workouts.find((w) => w.day === tomorrow);

  const [logger, setLogger] = useState<LoggerType | null>(null);
  const [workoutDetail, setWorkoutDetail] = useState<PlannedWorkout | null>(null);

  // Wochen-Stats
  const weekStats = useMemo(() => {
    if (!week) return { done: 0, total: 0, minutes: 0 };
    const total = week.workouts.length;
    let done = 0;
    let minutes = 0;
    for (const w of week.workouts) {
      const t = trainings[currentWeek]?.[w.day];
      if (t?.completed) {
        done += 1;
        minutes += t.duration ? Number(t.duration) : w.minutes;
      }
    }
    return { done, total, minutes };
  }, [week, trainings, currentWeek]);

  // Ø RHR letzte 7 Tage
  const rhrAvg = useMemo(() => {
    const logs = useStore.getState().logs;
    const sorted = Object.keys(logs).sort();
    const last7 = sorted.slice(-7);
    const values = last7.map((d) => logs[d]?.rhr).filter((v): v is number => Boolean(v));
    if (values.length === 0) return '—';
    return String(Math.round(values.reduce((a, b) => a + b, 0) / values.length));
  }, [trainings, log]);

  return (
    <section>
      <h1 className="font-display text-[28px] font-normal leading-tight tracking-tight">
        {greeting()}, <em className="text-accent">{settings.name}</em>.
      </h1>
      <p className="mb-[22px] mt-1 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted">
        {formatDate(todayISO())} · Woche {currentWeek}
      </p>

      {todayWorkout ? (
        <WorkoutCard workout={todayWorkout} onClick={() => setWorkoutDetail(todayWorkout)} />
      ) : today === 'fr' ? (
        <RestCard
          title="Pausentag"
          subtitle="Nur Hund-Spaziergang · echter Erholungstag"
        />
      ) : (
        <RestCard
          title="Kein Lauf heute"
          subtitle="Kraft oder Erholung laut Plan"
        />
      )}

      {tomorrowWorkout && (
        <TomorrowCard workout={tomorrowWorkout} />
      )}

      <WorkoutDetailModal
        open={workoutDetail !== null}
        onClose={() => setWorkoutDetail(null)}
        week={currentWeek}
        workout={workoutDetail}
      />

      <h3 className="mb-[10px] mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Heute loggen
      </h3>

      <div className="overflow-hidden rounded-card border border-line bg-bg-card p-2">
        <QuickRow
          label="Schlaf letzte Nacht"
          value={log?.sleep ? `${log.sleep} h` : null}
          placeholder="— h"
          onClick={() => setLogger('sleep')}
        />
        <QuickRow
          label="Ruhepuls morgens"
          value={log?.rhr ? `${log.rhr} bpm` : null}
          placeholder="— bpm"
          onClick={() => setLogger('rhr')}
        />
        <QuickRow
          label="Energie"
          value={log?.energy ? `${log.energy}/10` : null}
          placeholder="— /10"
          onClick={() => setLogger('energy')}
        />
        <QuickRow
          label="Krafttraining"
          value={log?.strength ?? null}
          placeholder="—"
          onClick={() => setLogger('strength')}
        />
        <QuickRow
          label="Blackroll"
          value={log?.blackroll ?? null}
          placeholder="—"
          onClick={() => setLogger('blackroll')}
        />
        <QuickRow
          label="Ernährung / Notiz"
          value={log?.nutrition ? truncate(log.nutrition, 40) : null}
          placeholder="—"
          onClick={() => setLogger('nutrition')}
          last
        />
      </div>

      <h3 className="mb-[10px] mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Diese Woche
      </h3>

      <div className="grid grid-cols-3 overflow-hidden rounded-card border border-line">
        <StatMini value={`${weekStats.done}/${weekStats.total}`} label="Trainings" />
        <StatMini value={String(weekStats.minutes)} label="Min Lauf" />
        <StatMini value={rhrAvg} label="Ø RHR" />
      </div>

      <QuickLogModal type={logger} onClose={() => setLogger(null)} />
    </section>
  );
}

function WorkoutCard({
  workout,
  onClick,
}: {
  workout: PlannedWorkout;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative mb-[18px] block w-full overflow-hidden rounded-2xl p-[22px] text-left text-white transition active:scale-[0.99]"
      style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%)',
      }}
    >
      <div
        className="absolute -right-[30px] -top-[30px] h-[120px] w-[120px] rounded-full"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] opacity-80">
        Heute · {workout.label} ›
      </p>
      <p className="mt-1 font-display text-[24px] font-medium leading-tight tracking-tight">
        {workout.description.split('·')[0].trim()}
      </p>
      <p className="mt-1 font-mono text-[12px] opacity-85">
        {workout.minutes} Min · Zone {workout.zone}
      </p>
    </button>
  );
}

function TomorrowCard({ workout }: { workout: PlannedWorkout }) {
  const isLong = workout.type === 'long';
  const isHard = workout.type === 'tempo' || workout.type === 'test' || workout.type === 'race';
  return (
    <div className="rounded-card border border-line bg-bg-soft px-4 py-[14px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Morgen · {dayName(workout.day)}
      </p>
      <p className="mt-1 font-display text-[16px] font-medium">
        {workout.label} · {workout.minutes} Min
      </p>
      {isLong && (
        <p className="mt-[10px] rounded-md bg-accent-bg px-[10px] py-[6px] text-[12px] text-accent">
          Heute Abend Frühstück vorbereiten + früh ins Bett
        </p>
      )}
      {isHard && (
        <p className="mt-[10px] rounded-md bg-accent-bg px-[10px] py-[6px] text-[12px] text-accent">
          Intensive Einheit · gut essen + ausreichend Schlaf
        </p>
      )}
    </div>
  );
}

function RestCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-[18px] rounded-card border border-dashed border-line bg-bg-soft px-[22px] py-[28px] text-center">
      <p className="font-display text-[20px] font-medium italic">{title}</p>
      <p className="mt-1 text-[13px] text-ink-muted">{subtitle}</p>
    </div>
  );
}

function QuickRow({
  label,
  value,
  placeholder,
  onClick,
  last,
}: {
  label: string;
  value: string | null;
  placeholder: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid w-full grid-cols-[1fr_auto] items-center gap-2 px-[14px] py-[12px] text-left transition active:bg-bg-soft ${
        last ? '' : 'border-b border-line-soft'
      }`}
    >
      <span className="text-[14px] text-ink-soft">{label}</span>
      <span className="flex items-center gap-[6px] font-mono text-[14px]">
        <span className={value ? 'font-medium text-ink' : 'text-ink-muted'}>
          {value ?? placeholder}
        </span>
        <ChevronRight size={14} className="text-ink-muted" />
      </span>
    </button>
  );
}

function StatMini({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-bg-card px-[10px] py-[14px] text-center [&:not(:last-child)]:border-r [&:not(:last-child)]:border-line">
      <p className="font-display text-[22px] font-medium leading-none text-accent">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </p>
    </div>
  );
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}
