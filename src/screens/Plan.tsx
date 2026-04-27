import { useMemo, useState } from 'react';
import { useStore } from '@/store/useStore';
import { PLAN } from '@/data/plan';
import { computeCurrentWeek } from '@/utils/date';
import { WeekDetailModal } from '@/components/WeekDetailModal';
import type { PlanWeek } from '@/types';

const PHASE_INFO: Record<1 | 2 | 3, { name: string; range: string; meta: string }> = {
  1: { name: 'Basis', range: 'Woche 1–8', meta: 'Aerobe Basis · alles in Z2' },
  2: { name: 'Aufbau', range: 'Woche 9–14', meta: 'Quality am Samstag dazu' },
  3: { name: 'HM-Spezifik', range: 'Woche 15–22', meta: '5:40er Pace stabilisieren' },
};

export function Plan() {
  const settings = useStore((s) => s.settings);
  const trainings = useStore((s) => s.trainings);
  const currentWeek = computeCurrentWeek(settings.startDate, settings.weekOffset);
  const [openWeek, setOpenWeek] = useState<number | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<1 | 2 | 3, PlanWeek[]>();
    for (const w of PLAN) {
      const arr = map.get(w.phase) ?? [];
      arr.push(w);
      map.set(w.phase, arr);
    }
    return map;
  }, []);

  return (
    <section>
      <div className="mb-6 border-b border-line pb-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          22 Wochen · 3 Phasen
        </p>
        <h1 className="font-display text-[clamp(28px,7vw,38px)] font-normal leading-tight tracking-tight">
          Der <em className="font-light text-accent">Plan</em>.
        </h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          Tippe eine Woche an, um Workouts zu sehen und abzuhaken.
        </p>
      </div>

      {([1, 2, 3] as const).map((phase) => {
        const info = PHASE_INFO[phase];
        const weeks = grouped.get(phase) ?? [];
        return (
          <div
            key={phase}
            className="mb-[14px] overflow-hidden rounded-card border border-line bg-bg-card"
          >
            <div className="flex items-baseline gap-[14px] border-b border-line bg-bg-soft px-[18px] py-4">
              <span className="font-display text-[36px] font-light italic leading-none text-accent">
                {phase}
              </span>
              <div className="flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
                  {info.range}
                </p>
                <p className="font-display text-[18px] font-medium">{info.name}</p>
                <p className="mt-[2px] text-[12px] text-ink-muted">{info.meta}</p>
              </div>
            </div>
            {weeks.map((w) => (
              <WeekRow
                key={w.week}
                week={w}
                isCurrent={w.week === currentWeek}
                done={countDone(trainings, w)}
                total={w.workouts.length}
                onClick={() => setOpenWeek(w.week)}
              />
            ))}
          </div>
        );
      })}

      <WeekDetailModal
        open={openWeek !== null}
        onClose={() => setOpenWeek(null)}
        week={openWeek}
      />
    </section>
  );
}

function countDone(
  trainings: Record<number, Record<string, { completed: boolean }>>,
  w: PlanWeek,
): number {
  const wk = trainings[w.week] ?? {};
  return w.workouts.filter((wo) => wk[wo.day]?.completed).length;
}

function WeekRow({
  week,
  isCurrent,
  done,
  total,
  onClick,
}: {
  week: PlanWeek;
  isCurrent: boolean;
  done: number;
  total: number;
  onClick: () => void;
}) {
  let suffix = '';
  let numTone = '';
  if (week.deload) {
    suffix = ' ↓';
    numTone = 'text-highlight';
  } else if (week.test) {
    suffix = ` ◆ Test ${week.test}`;
    numTone = 'text-accent font-bold';
  } else if (week.race) {
    suffix = ' ★';
    numTone = 'text-warn font-bold';
  }

  const summary = week.workouts.map((w) => `${w.day}:${w.minutes}`).join(' · ');
  const isComplete = done === total && total > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid w-full grid-cols-[60px_1fr_auto] items-center gap-[10px] px-[16px] py-[12px] text-left transition active:bg-bg-soft ${
        isCurrent
          ? 'border-l-[3px] border-accent bg-accent-bg pl-[13px]'
          : 'border-b border-line-soft last:border-b-0'
      }`}
    >
      <span className={`font-mono text-[13px] font-medium ${numTone}`}>
        W {week.week}
        {suffix}
      </span>
      <span className="text-[13px] text-ink-soft">
        <strong className="font-medium text-ink">{week.workouts.length} Läufe</strong>
        <span className="block font-mono text-[11px] text-ink-muted">{summary}</span>
      </span>
      <span
        className={`whitespace-nowrap font-mono text-[11px] ${
          isComplete ? 'text-success' : 'text-ink-muted'
        }`}
      >
        {done}/{total}
        {isComplete && ' ✓'}
      </span>
    </button>
  );
}
