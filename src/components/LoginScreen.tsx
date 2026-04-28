import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Step = 'email' | 'code';
type Status = 'idle' | 'sending' | 'verifying' | 'error';

export function LoginScreen() {
  const [email, setEmail] = useState('mats.schaper@t-online.de');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<Step>('email');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function sendCode() {
    setStatus('sending');
    setError('');
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (err) {
      setStatus('error');
      setError(translateError(err.message));
      return;
    }
    setStatus('idle');
    setStep('code');
  }

  async function verifyCode(token: string) {
    if (token.length !== 6) return;
    setStatus('verifying');
    setError('');
    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (err) {
      setStatus('error');
      setError(translateError(err.message));
      return;
    }
    // Auf Erfolg übernimmt AuthGate (onAuthStateChange) den Render-Switch.
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-normal leading-tight tracking-tight">
          Mats&rsquo; <em className="text-accent">Lauftrainer</em>
        </h1>

        {step === 'email' ? (
          <>
            <p className="mb-10 mt-2 text-[15px] text-ink-soft">
              Privater Bereich. Code per Mail, dann hier eingeben.
            </p>
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
              onClick={sendCode}
              disabled={status === 'sending' || !email.includes('@')}
              className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-white transition active:scale-95 disabled:opacity-50"
            >
              {status === 'sending' ? 'Sende\u2026' : 'Code senden'}
            </button>
          </>
        ) : (
          <>
            <p className="mb-10 mt-2 text-[15px] text-ink-soft">
              6-stelliger Code aus deiner Mail an <strong>{email}</strong>. Kann
              30&ndash;60 Sekunden dauern, ggf. Spam-Ordner checken.
            </p>
            <label
              htmlFor="code"
              className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted"
            >
              Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(next);
                if (next.length === 6) void verifyCode(next);
              }}
              autoFocus
              placeholder="123456"
              className="w-full rounded-card border border-line bg-bg-card px-4 py-3 text-center font-mono text-2xl tracking-[0.4em] outline-none transition focus:border-accent"
            />
            <button
              type="button"
              onClick={() => verifyCode(code)}
              disabled={status === 'verifying' || code.length !== 6}
              className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-white transition active:scale-95 disabled:opacity-50"
            >
              {status === 'verifying' ? 'Pr\u00fcfe\u2026' : 'Anmelden'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
                setError('');
              }}
              className="mt-3 block w-full text-center text-sm text-ink-muted underline"
            >
              &larr; Andere Adresse / Code neu senden
            </button>
          </>
        )}

        {error && <p className="mt-3 text-sm text-warn">{error}</p>}
      </div>
    </div>
  );
}

function translateError(msg: string): string {
  if (/rate.?limit|too many/i.test(msg)) {
    return 'Zu viele Versuche. ~1 Stunde warten oder Rate-Limit im Supabase-Dashboard erhöhen.';
  }
  if (/invalid.*token|invalid.*otp|expired/i.test(msg)) {
    return 'Code falsch oder abgelaufen. Neu senden.';
  }
  if (/email.*not.*allowed|signups.*disabled/i.test(msg)) {
    return 'Diese Email ist nicht freigeschaltet.';
  }
  return msg;
}
