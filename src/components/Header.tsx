import { Moon, Sun } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { computeCurrentWeek } from '@/utils/date';

export function Header() {
  const { theme, setTheme, settings } = useStore();
  const currentWeek = computeCurrentWeek(settings.startDate, settings.weekOffset);
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-[700px] items-center justify-between px-[18px] py-[14px]">
        <div className="flex items-baseline gap-[6px]">
          <span className="font-display text-[18px] font-medium tracking-tight">
            Mats&rsquo; <em className="font-normal text-accent">Lauftrainer</em>
          </span>
          <span className="rounded bg-accent-bg px-[7px] py-[3px] font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-accent">
            W {currentWeek}
          </span>
        </div>
        <button
          type="button"
          aria-label="Theme umschalten"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line text-ink-soft transition active:scale-95"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
