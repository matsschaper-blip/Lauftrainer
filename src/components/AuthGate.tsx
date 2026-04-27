import type { ReactNode } from 'react';
import { useSession } from '@/hooks/useSession';
import { LoginScreen } from './LoginScreen';

interface Props {
  children: ReactNode;
}

export function AuthGate({ children }: Props) {
  const session = useSession();

  if (session === undefined) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-ink-muted">
        L&auml;dt&hellip;
      </div>
    );
  }

  if (session === null) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
