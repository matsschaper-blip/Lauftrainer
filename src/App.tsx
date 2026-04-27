import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AuthGate } from '@/components/AuthGate';
import { ToastHost } from '@/components/Toast';
import { Heute } from '@/screens/Heute';
import { Plan } from '@/screens/Plan';
import { Rezepte } from '@/screens/Rezepte';
import { Verlauf } from '@/screens/Verlauf';
import { Mehr } from '@/screens/Mehr';
import { useStore } from '@/store/useStore';
import type { ScreenKey } from '@/types';

const SCREENS: Record<ScreenKey, () => JSX.Element> = {
  heute: Heute,
  plan: Plan,
  rezepte: Rezepte,
  verlauf: Verlauf,
  mehr: Mehr,
};

const THEME_COLOR: Record<'light' | 'dark', string> = {
  light: '#2B4A3F',
  dark: '#0F1714',
};

export default function App() {
  const [active, setActive] = useState<ScreenKey>('heute');
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLOR[theme]);
  }, [theme]);

  const Screen = SCREENS[active];

  return (
    <AuthGate>
      <Header />
      <main className="relative z-[2] mx-auto max-w-[700px] px-[18px] py-[20px]">
        <Screen />
      </main>
      <BottomNav active={active} onChange={setActive} />
      <ToastHost />
    </AuthGate>
  );
}
