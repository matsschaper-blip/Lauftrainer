import { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { planWeek } from '@/data/plan';
import {
  computeCurrentWeek,
  dayIndex,
  dayName,
  formatDate,
  greeting,
  strengthForDay,
  todayDayKey,
  todayISO,
  tomorrowDayKey,
} from '@/utils/date';
import { PLAN } from '@/data/plan';
import type { DayKey } from '@/types';
import { QuickLogModal, type LoggerType } from '@/components/QuickLogModal';
import { WorkoutDetailModal } from '@/components/WorkoutDetailModal';
import { WorkoutLogger } from '@/components/WorkoutLogger';
import { useWeather } from '@/hooks/useWeather';
import { formatWeatherLong, weatherAdvice } from '@/lib/weather';
import {
  fetchActivities,
  isRun,
  todayStartEpochSeconds,
  type StravaActivity,
} from '@/lib/strava';
import type { PlannedWorkout } from '@/types';

interface NextRun {
  workout: PlannedWorkout;
  week: number;
  daysAway: number; // 1 = morgen, 2 = übermorgen, 7 = in 1 Woche, etc.
}

function findNextRun(
  currentWeek: number,
  today: DayKey,
): NextRun | null {
  // Aktuelle Woche, alle Tage nach heute
  const week = PLAN.find((w) => w.week === currentWeek);
  if (week) {
    const todayIdx = dayIndex(today);
    const future = week.workouts
      .map((w) => ({ ...w, idx: dayIndex(w.day) }))
      .filter((w) => w.idx > todayIdx)
      .sort((a, b) => a.idx - b.idx);
    if (future.length > 0) {
      const w = future[0];
      return {
        workout: w as PlannedWorkout,
        week: currentWeek,
        daysAway: w.idx - todayIdx,
      };
    }
  }
  // Nächste Woche
  const next = PLAN.find((w) => w.week === currentWeek + 1);
  if (next && next.workouts.length > 0) {
    const first = [...next.workouts].sort(
      (a, b) => dayIndex(a.day) - dayIndex(b.day),
    )[0];
    const offsetWithinWeek = dayIndex(first.day);
    const daysToSunday = 6 - dayIndex(today);
    return {
      workout: first,
      week: currentWeek + 1,
      daysAway: daysToSunday + 1 + offsetWithinWeek,
    };
  }
  return null;
}

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
  const todayStrength = strengthForDay(today);
  const nextRun = useMemo(() => findNextRun(currentWeek, today), [currentWeek, today]);

  const [logger, setLogger] = useState<LoggerType | null>(null);
  const [workoutDetail, setWorkoutDetail] = useState<PlannedWorkout | null>(null);
  const [stravaMatch, setStravaMatch] = useState<StravaActivity | null>(null);
  const [autoLoggerOpen, setAutoLoggerOpen] = useState(false);
  const { weather } = useWeather();
  const stravaAthleteId = useStore((s) => s.stravaAthleteId);

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

  // Strava Auto-Match: heutige Activity finden, falls verbunden + Workout heute + noch nicht abgehakt
  const todayWorkoutDone = !!trainings[currentWeek]?.[today]?.completed;
  const todayWorkoutHasStrava = !!trainings[currentWeek]?.[today]?.stravaId;
  useEffect(() => {
    if (!stravaAthleteId || !todayWorkout || todayWorkoutDone || todayWorkoutHasStrava) {
      setStravaMatch(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const acts = await fetchActivities(todayStartEpochSeconds());
        const runs = acts.filter(isRun);
        if (!cancelled && runs.length > 0) {
          setStravaMatch(runs[0]);
        }
      } catch {
        /* silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stravaAthleteId, todayWorkout, todayWorkoutDone, todayWorkoutHasStrava, today]);

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

      {weather && (todayWorkout || tomorrowWorkout) && (
        <WeatherStrip weather={weather} />
      )}

      {stravaMatch && todayWorkout && (
        <StravaMatchBanner
          activity={stravaMatch}
          onAccept={() => {
            setAutoLoggerOpen(true);
            setStravaMatch(null);
          }}
          onDismiss={() => setStravaMatch(null)}
        />
      )}

      {todayWorkout ? (
        <WorkoutCard workout={todayWorkout} onClick={() => setWorkoutDetail(todayWorkout)} />
      ) : today === 'fr' ? (
        <RestCard
          title="Pausentag"
          subtitle="Nur Hund-Spaziergang · echter Erholungstag"
        />
      ) : !todayStrength ? (
        <RestCard
          title="Kein Lauf heute"
          subtitle="Erholungstag laut Plan"
        />
      ) : null}

      {todayStrength && (
        <StrengthCard label={todayStrength} />
      )}

      {tomorrowWorkout ? (
        <TomorrowCard workout={tomorrowWorkout} label="Morgen" />
      ) : nextRun ? (
        <NextRunCard nextRun={nextRun} />
      ) : null}

      <WorkoutDetailModal
        open={workoutDetail !== null}
        onClose={() => setWorkoutDetail(null)}
        week={currentWeek}
        workout={workoutDetail}
      />

      {todayWorkout && (
        <WorkoutLogger
          open={autoLoggerOpen}
          onClose={() => setAutoLoggerOpen(false)}
          week={currentWeek}
          day={today}
          planned={todayWorkout}
          autoImport
        />
      )}

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

function TomorrowCard({ workout, label }: { workout: PlannedWorkout; label: string }) {
  const isLong = workout.type === 'long';
  const isHard = workout.type === 'tempo' || workout.type === 'test' || workout.type === 'race';
  return (
    <div className="rounded-card border border-line bg-bg-soft px-4 py-[14px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        {label} · {dayName(workout.day)}
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

function NextRunCard({ nextRun }: { nextRun: NextRun }) {
  const inDays = nextRun.daysAway;
  const label =
    inDays === 1 ? 'Morgen' :
    inDays === 2 ? 'Übermorgen' :
    `In ${inDays} Tagen`;
  return (
    <div className="rounded-card border border-line bg-bg-soft px-4 py-[14px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Nächster Lauf · {label} · {dayName(nextRun.workout.day)}
      </p>
      <p className="mt-1 font-display text-[16px] font-medium">
        {nextRun.workout.label} · {nextRun.workout.minutes} Min
        {nextRun.week !== nextRun.week && ` · W ${nextRun.week}`}
      </p>
      <p className="mt-[2px] font-mono text-[11px] text-ink-muted">
        Zone {nextRun.workout.zone}
      </p>
    </div>
  );
}

function StrengthCard({ label }: { label: string }) {
  return (
    <div className="mb-[18px] rounded-card border border-highlight bg-highlight-bg px-[18px] py-[14px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-highlight">
        Heute · Krafttraining
      </p>
      <p className="mt-1 font-display text-[18px] font-medium">{label}</p>
      <p className="mt-[4px] text-[12px] text-ink-soft">
        Abends · 25–30 Min · Übungen siehe Mehr → Krafttraining
      </p>
    </div>
  );
}

function StravaMatchBanner({
  activity,
  onAccept,
  onDismiss,
}: {
  activity: StravaActivity;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  const km = (activity.distance / 1000).toFixed(2);
  const min = Math.round(activity.moving_time / 60);
  return (
    <div className="mb-3 rounded-card border border-accent bg-accent-bg p-[14px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        Strava-Lauf gefunden
      </p>
      <p className="mt-1 font-mono text-[13px] text-ink">
        {km} km · {min} Min
        {activity.average_heartrate
          ? ` · ø ${Math.round(activity.average_heartrate)} bpm`
          : ''}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="flex-1 rounded-full bg-accent py-[10px] text-[13px] font-semibold text-white transition active:scale-95"
        >
          Übernehmen
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full border border-line px-[18px] py-[10px] text-[13px] font-semibold text-ink-soft transition active:scale-95"
        >
          Später
        </button>
      </div>
    </div>
  );
}

function WeatherStrip({ weather }: { weather: NonNullable<ReturnType<typeof useWeather>['weather']> }) {
  const advice = weatherAdvice(weather);
  return (
    <div className="mb-3 rounded-card border border-line bg-bg-soft px-[14px] py-[10px]">
      <p className="font-mono text-[12px] text-ink-soft">
        {formatWeatherLong(weather)}
      </p>
      {advice && (
        <p className="mt-[6px] text-[12px] font-medium text-warn">⚠ {advice}</p>
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
