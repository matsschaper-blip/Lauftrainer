import { useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from './Modal';
import { WorkoutDetailModal } from './WorkoutDetailModal';
import { showToast } from './Toast';
import { useStore } from '@/store/useStore';
import { planWeek } from '@/data/plan';
import { computeCurrentWeek } from '@/utils/date';
import type { PlannedWorkout } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  week: number | null;
}

const PHASE_NAME = { 1: 'Basis', 2: 'Aufbau', 3: 'HM-Spezifik' } as const;

export function WeekDetailModal({ open, onClose, week }: Props) {
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);
  const trainings = useStore((s) => s.trainings);
  const toggleDone = useStore((s) => s.toggleWorkoutDone);

  const [detailWorkout, setDetailWorkout] = useState<PlannedWorkout | null>(null);

  if (week === null) return null;
  const data = planWeek(week);
  if (!data) return null;

  const currentWeek = computeCurrentWeek(settings.startDate, settings.weekOffset);
  const isCurrent = week === currentWeek;

  const suffix = data.deload
    ? ' · Entlastung'
    : data.test
      ? ` · TEST ${data.test}`
      : data.race
        ? ' · RACE'
        : '';

  function setAsCurrent() {
    if (!data) return;
    const offset = data.week - computeCurrentWeek(settings.startDate, 0);
    setSettings({ weekOffset: offset });
    showToast(`Aktuelle Woche: ${data.week}`);
    onClose();
  }

  return (
    <>
      <Modal open={open && detailWorkout === null} onClose={onClose}>
        <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
          Woche {week}
          {suffix}
        </h2>
        <p className="mb-4 mt-1 text-[13px] text-ink-muted">
          Phase {data.phase} · {PHASE_NAME[data.phase]}
        </p>

        <div className="mb-4">
          {data.workouts.map((w) => {
            const done = trainings[week]?.[w.day]?.completed ?? false;
            return (
              <div
                key={w.day}
                className="grid grid-cols-[40px_1fr_auto] items-center gap-3 border-b border-line-soft py-[14px] last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setDetailWorkout(w)}
                  className="text-left"
                >
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-muted">
                    {w.day}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setDetailWorkout(w)}
                  className="text-left"
                >
                  <p className="text-[14px]">
                    <strong className="font-medium">{w.label}</strong> · {w.minutes} Min
                  </p>
                  <p className="mt-[2px] text-[12px] text-ink-muted">{w.description}</p>
                </button>
                <button
                  type="button"
                  onClick={() => toggleDone(week, w.day)}
                  className={`flex h-6 w-6 items-center justify-center rounded-full border transition active:scale-90 ${
                    done
                      ? 'border-success bg-success text-white'
                      : 'border-line bg-bg-card'
                  }`}
                  aria-label={done ? 'erledigt' : 'noch offen'}
                >
                  {done && <Check size={14} strokeWidth={3} />}
                </button>
              </div>
            );
          })}
        </div>

        {data.test && (
          <div className="mb-4 rounded-card border border-accent bg-accent-bg p-[18px]">
            <p className="font-display text-[16px] font-medium">Test {data.test}</p>
            <p className="mt-1 text-[13px] text-ink-soft">
              {data.test === 'A'
                ? '30-Min Steady State Test · Pace bei 142 bpm'
                : data.test === 'B'
                  ? '10K Time Trial · liefert HM-Prognose'
                  : '16 km bei HM-Pace · misst Konstanz und HF-Drift'}
            </p>
          </div>
        )}

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-[22px] py-3 text-[14px] font-semibold text-ink-soft transition active:scale-95"
          >
            Schließen
          </button>
          {!isCurrent && (
            <button
              type="button"
              onClick={setAsCurrent}
              className="flex-1 rounded-full bg-accent px-[22px] py-3 text-[14px] font-semibold text-white transition active:scale-95"
            >
              Als aktuelle Woche
            </button>
          )}
        </div>
      </Modal>

      <WorkoutDetailModal
        open={detailWorkout !== null}
        onClose={() => setDetailWorkout(null)}
        week={week}
        workout={detailWorkout}
      />
    </>
  );
}
