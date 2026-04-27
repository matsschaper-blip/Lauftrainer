import { CalendarDays, ListChecks, ChefHat, TrendingUp, MoreHorizontal } from 'lucide-react';
import type { ScreenKey } from '@/types';

const TABS: { key: ScreenKey; label: string; Icon: typeof CalendarDays }[] = [
  { key: 'heute', label: 'Heute', Icon: CalendarDays },
  { key: 'plan', label: 'Plan', Icon: ListChecks },
  { key: 'rezepte', label: 'Rezepte', Icon: ChefHat },
  { key: 'verlauf', label: 'Verlauf', Icon: TrendingUp },
  { key: 'mehr', label: 'Mehr', Icon: MoreHorizontal },
];

interface Props {
  active: ScreenKey;
  onChange: (s: ScreenKey) => void;
}

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-bg-card/95 backdrop-blur"
      style={{ paddingBottom: 'calc(8px + env(safe-area-inset-bottom))', paddingTop: '8px' }}
    >
      {TABS.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex max-w-[80px] flex-1 flex-col items-center gap-[3px] py-[6px] transition active:scale-90 ${
              isActive ? 'text-accent' : 'text-ink-muted'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.05em]">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
