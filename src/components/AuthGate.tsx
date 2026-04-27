import type { ReactNode } from 'react';
import { useSession } from '@/hooks/useSession';
import { useBootstrap } from '@/hooks/useBootstrap';
import { LoginScreen } from './LoginScreen';

interface Props {
  children: ReactNode;
}

export function AuthGate({ children }: Props) {
  const session = useSession();
  useBootstrap(session);

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
