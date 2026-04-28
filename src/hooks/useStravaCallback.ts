import { useEffect, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import { exchangeCode } from '@/lib/strava';
import { showToast } from '@/components/Toast';
import { useStore } from '@/store/useStore';

/**
 * Wenn Strava nach Authorize zurück-redirected ist, hat die URL ?code=... ?scope=...
 * Wir tauschen den Code gegen Tokens (über Edge Function), aktualisieren den Store
 * und säubern die URL.
 */
export function useStravaCallback(session: Session | null | undefined) {
  const setStravaAthleteId = useStore((s) => s.setStravaAthleteId);
  const ranRef = useRef(false);

  useEffect(() => {
    if (!session || ranRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (!code && !error) return;
    ranRef.current = true;

    function cleanUrl() {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url);
    }

    if (error) {
      showToast(`Strava abgebrochen: ${error}`);
      cleanUrl();
      return;
    }

    void (async () => {
      try {
        const result = await exchangeCode(code!);
        if (result.ok && result.athlete) {
          setStravaAthleteId(result.athlete.id);
          showToast('Mit Strava verbunden');
        } else {
          showToast('Strava-Verbindung fehlgeschlagen');
        }
      } catch (e) {
        console.error('Strava exchange', e);
        showToast('Strava-Verbindung fehlgeschlagen');
      } finally {
        cleanUrl();
      }
    })();
  }, [session, setStravaAthleteId]);
}
