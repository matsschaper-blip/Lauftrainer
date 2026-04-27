import { useState } from 'react';
import { Modal } from './Modal';
import { WorkoutLogger } from './WorkoutLogger';
import { useStore } from '@/store/useStore';
import { WORKOUT_TYPES } from '@/data/workoutTypes';
import { dayName, todayDayKey } from '@/utils/date';
import { computeCurrentWeek } from '@/utils/date';
import type { DayKey, PlannedWorkout } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  week: number;
  workout: PlannedWorkout | null;
}

export function WorkoutDetailModal({ open, onClose, week, workout }: Props) {
  const settings = useStore((s) => s.settings);
  const completed = useStore((s) => s.trainings[week]?.[workout?.day ?? ('mo' as DayKey)]?.completed ?? false);
  const toggleDone = useStore((s) => s.toggleWorkoutDone);
  const [loggerOpen, setLoggerOpen] = useState(false);

  if (!workout) return null;

  const isToday =
    workout.day === todayDayKey() &&
    week === computeCurrentWeek(settings.startDate, settings.weekOffset);

  const detail = WORKOUT_TYPES[workout.type];

  return (
    <>
      <Modal open={open && !loggerOpen} onClose={onClose}>
        <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
          {workout.label}
        </h2>
        <p className="mb-4 mt-1 text-[13px] text-ink-muted">
          {dayName(workout.day)} · Woche {week} · {workout.minutes} Min · {workout.zone}
        </p>

        <Section label="Was tun">
          <p className="mb-2 font-mono text-[11px] text-ink-muted">
            {workout.description}
          </p>
          {detail.flow.map((p) => (
            <div
              key={p.phase}
              className="mb-2 rounded-md border-l-2 border-accent bg-bg-soft px-[14px] py-[12px]"
            >
              <div className="mb-1 flex items-baseline justify-between">
                <span className="font-display text-[15px] font-medium">
                  {p.phase}
                </span>
                <span className="font-mono text-[11px] text-ink-muted">
                  {p.duration}
                </span>
              </div>
              <p className="text-[13px] leading-[1.55] text-ink-soft">{p.desc}</p>
            </div>
          ))}
        </Section>

        <Section label={`Vor dem Lauf · ${detail.pre.time}`}>
          <Bullets items={detail.pre.options} />
        </Section>

        {detail.during && (
          <Section label={`Während · ${detail.during.time}`}>
            <Bullets items={detail.during.options} />
          </Section>
        )}

        <Section label={`Nach dem Lauf · ${detail.post.time}`}>
          <Bullets items={detail.post.options} />
        </Section>

        <Section label="Blackroll danach">
          <Bullets items={[detail.blackroll]} />
        </Section>

        <Section label="Wichtig zu wissen">
          <p className="rounded-md bg-accent-bg px-[12px] py-[10px] text-[13px] leading-[1.6] text-ink-soft">
            {detail.notes}
          </p>
        </Section>

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-[22px] py-3 text-[14px] font-semibold text-ink-soft transition active:scale-95"
          >
            Schließen
          </button>
          {isToday ? (
            <button
              type="button"
              onClick={() => setLoggerOpen(true)}
              className="flex-1 rounded-full bg-accent px-[22px] py-3 text-[14px] font-semibold text-white transition active:scale-95"
            >
              {completed ? '✓ Erledigt · ändern' : '+ Lauf loggen'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                toggleDone(week, workout.day);
                onClose();
              }}
              className={`flex-1 rounded-full px-[22px] py-3 text-[14px] font-semibold transition active:scale-95 ${
                completed
                  ? 'border border-accent text-accent'
                  : 'bg-accent text-white'
              }`}
            >
              {completed ? '✓ erledigt' : 'Abhaken'}
            </button>
          )}
        </div>
      </Modal>

      <WorkoutLogger
        open={loggerOpen}
        onClose={() => {
          setLoggerOpen(false);
          onClose();
        }}
        week={week}
        day={workout.day}
        planned={workout}
      />
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-[18px] border-b border-line-soft pb-[18px] last:border-b-0 last:pb-0">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
        {label}
      </p>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="m-0 list-none p-0">
      {items.map((item, i) => (
        <li
          key={i}
          className="mb-1 rounded-md bg-bg-soft px-[12px] py-[8px] text-[13px] leading-[1.5]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
