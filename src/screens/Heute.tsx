import { useStore } from '@/store/useStore';
import { computeCurrentWeek } from '@/utils/date';

export function Heute() {
  const settings = useStore((s) => s.settings);
  const currentWeek = computeCurrentWeek(settings.startDate, settings.weekOffset);

  return (
    <section>
      <h1 className="font-display text-[28px] font-normal leading-tight tracking-tight">
        Guten Tag, <em className="text-accent">{settings.name}</em>.
      </h1>
      <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-muted">
        Woche {currentWeek} &middot; Start {settings.startDate}
      </p>
      <p className="mt-6 text-ink-soft">
        Heute-Screen kommt in WE&nbsp;2 (Workout-Card, Quick-Log, Wochen-Stats).
      </p>
    </section>
  );
}
