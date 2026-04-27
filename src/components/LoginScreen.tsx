import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function LoginScreen() {
  const [email, setEmail] = useState('mats.schaper@t-online.de');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function send() {
    setStatus('sending');
    setError('');
    const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (err) {
      setStatus('error');
      setError(err.message);
    } else {
      setStatus('sent');
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-normal leading-tight tracking-tight">
          Mats&rsquo; <em className="text-accent">Lauftrainer</em>
        </h1>
        <p className="mb-10 mt-2 text-[15px] text-ink-soft">
          Privater Bereich. Login per Magic Link &mdash; Mail kommt, Link klicken, fertig.
        </p>

        {status === 'sent' ? (
          <div className="rounded-card border border-success bg-success-bg p-4">
            <p className="font-medium text-success">Mail gesendet.</p>
            <p className="mt-1 text-sm text-ink-soft">
              Schau in <strong>{email}</strong>, klick den Link &mdash; du landest hier zur&uuml;ck eingeloggt.
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="mt-3 text-sm text-accent underline"
            >
              Andere Adresse
            </button>
          </div>
        ) : (
          <>
            <label
              htmlFor="email"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
              className="w-full rounded-card border border-line bg-bg-card px-4 py-3 text-base outline-none transition focus:border-accent"
            />
            <button
              type="button"
              onClick={send}
              disabled={status === 'sending' || !email.includes('@')}
              className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-white transition active:scale-95 disabled:opacity-50"
            >
              {status === 'sending' ? 'Sende\u2026' : 'Magic Link senden'}
            </button>
            {error && (
              <p className="mt-3 text-sm text-warn">{error}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
