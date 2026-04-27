import { useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { useStore } from '@/store/useStore';

/**
 * Lädt nach Login Profile + Logs aus Supabase und merged sie in den Store.
 * Bei Logout wird userId zurückgesetzt; lokale Daten bleiben (offline-fallback).
 */
export function useBootstrap(session: Session | null | undefined) {
  const userId = useStore((s) => s.userId);
  const bootstrap = useStore((s) => s.bootstrap);
  const setUserId = useStore((s) => s.setUserId);

  useEffect(() => {
    if (session === undefined) return; // still loading
    if (session === null) {
      if (userId !== null) setUserId(null);
      return;
    }
    if (userId === session.user.id) return; // already bootstrapped for this user
    void bootstrap(session.user.id);
  }, [session, userId, bootstrap, setUserId]);
}
