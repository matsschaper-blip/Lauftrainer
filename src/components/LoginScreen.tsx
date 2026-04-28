import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Status = 'idle' | 'pending' | 'error';

export function LoginScreen() {
  const [email, setEmail] = useState('mats.schaper@t-online.de');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function login() {
    setStatus('pending');
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (err) {
      setStatus('error');
      setError(translateError(err.message));
      return;
    }
    // AuthGate übernimmt Render-Switch via onAuthStateChange.
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void login();
        }}
        className="w-full max-w-sm"
      >
        <h1 className="font-display text-3xl font-normal leading-tight tracking-tight">
          Mats&rsquo; <em className="text-accent">Lauftrainer</em>
        </h1>
        <p className="mb-10 mt-2 text-[15px] text-ink-soft">
          Privater Bereich.
        </p>

        <label
          htmlFor="email"
          className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted"
        >
          Email
        </label>
        <input
          id="email"
          name="username"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username email"
          className="w-full rounded-card border border-line bg-bg-card px-4 py-3 text-base outline-none transition focus:border-accent"
        />

        <label
          htmlFor="password"
          className="mb-2 mt-4 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted"
        >
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          autoFocus
          className="w-full rounded-card border border-line bg-bg-card px-4 py-3 text-base outline-none transition focus:border-accent"
        />

        <button
          type="submit"
          disabled={status === 'pending' || !email.includes('@') || !password}
          className="mt-6 w-full rounded-full bg-accent py-3 font-semibold text-white transition active:scale-95 disabled:opacity-50"
        >
          {status === 'pending' ? 'Anmelde\u2026' : 'Anmelden'}
        </button>

        {error && <p className="mt-3 text-sm text-warn">{error}</p>}
      </form>
    </div>
  );
}

function translateError(msg: string): string {
  if (/invalid.*credentials|invalid.*login/i.test(msg)) {
    return 'Email oder Passwort falsch.';
  }
  if (/email.*not.*confirmed/i.test(msg)) {
    return 'Email noch nicht bestätigt — im Supabase Dashboard auto-confirm setzen.';
  }
  return msg;
}
