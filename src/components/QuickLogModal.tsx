import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { ScaleInput } from './ScaleInput';
import { showToast } from './Toast';
import { useStore } from '@/store/useStore';
import { todayISO } from '@/utils/date';

export type LoggerType =
  | 'sleep'
  | 'rhr'
  | 'energy'
  | 'strength'
  | 'blackroll'
  | 'nutrition';

interface Props {
  type: LoggerType | null;
  onClose: () => void;
}

const BLACKROLL_OPTIONS = [
  'Slot 1 · 5 Min nach Lauf',
  'Slot 1 + Knie-Spezial · 10 Min',
  'Slot 2 · Mi/Fr · 10 Min',
  'Massageball Spot-Treatment',
];

export function QuickLogModal({ type, onClose }: Props) {
  const log = useStore((s) => s.logs[todayISO()]);
  const upsertLog = useStore((s) => s.upsertLog);

  const [sleep, setSleep] = useState('');
  const [rhr, setRhr] = useState('');
  const [energy, setEnergy] = useState<number | undefined>(undefined);
  const [strength, setStrength] = useState('');
  const [nutrition, setNutrition] = useState('');

  useEffect(() => {
    if (!type) return;
    setSleep(log?.sleep ? String(log.sleep) : '');
    setRhr(log?.rhr ? String(log.rhr) : '');
    setEnergy(log?.energy);
    setStrength(log?.strength ?? '');
    setNutrition(log?.nutrition ?? '');
  }, [type, log]);

  function save<K extends keyof NonNullable<typeof log>>(
    field: K,
    value: NonNullable<typeof log>[K],
  ) {
    upsertLog(todayISO(), { [field]: value } as Partial<typeof log>);
    showToast('Gespeichert');
    onClose();
  }

  return (
    <Modal open={type !== null} onClose={onClose}>
      {type === 'sleep' && (
        <Form
          title="Schlaf letzte Nacht"
          subtitle="Stunden Schlaf"
          onCancel={onClose}
          onSubmit={() => {
            const n = parseFloat(sleep);
            if (!Number.isFinite(n)) return;
            save('sleep', n);
          }}
        >
          <Field label="Stunden">
            <input
              type="number"
              step={0.5}
              min={0}
              max={14}
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              placeholder="6.5"
              autoFocus
              className={inputCls}
            />
          </Field>
        </Form>
      )}

      {type === 'rhr' && (
        <Form
          title="Ruhepuls heute morgen"
          subtitle="In bpm. Direkt nach dem Aufwachen, BEVOR du aufstehst — der Wert sagt am ehesten, wie erholt du bist."
          onCancel={onClose}
          onSubmit={() => {
            const n = parseInt(rhr, 10);
            if (!Number.isFinite(n)) return;
            save('rhr', n);
          }}
        >
          <Field label="Ruhepuls">
            <input
              type="number"
              min={30}
              max={100}
              value={rhr}
              onChange={(e) => setRhr(e.target.value)}
              placeholder="57"
              autoFocus
              className={inputCls}
            />
          </Field>
          <div className="rounded-card bg-bg-soft px-[14px] py-[12px] text-[12px] leading-[1.5] text-ink-soft">
            <p className="mb-1 font-semibold text-ink">Wo finde ich den Wert?</p>
            <p>
              <strong>Apple Health-App</strong> → Durchsuchen → Herz → Ruhepuls.
              Dort steht der Tageswert (Apple Watch misst automatisch).
            </p>
            <p className="mt-2">
              <strong>Oder selbst messen:</strong> Im Bett liegend, Zeigefinger an
              Halsschlagader oder Handgelenk → 60 Sekunden zählen → Wert eintragen.
            </p>
            <p className="mt-2">
              Werte 5+ über deinem Schnitt = übermüdet, krank oder gestresst →
              an dem Tag eher Easy oder Pause statt Quality.
            </p>
          </div>
        </Form>
      )}

      {type === 'energy' && (
        <Form
          title="Energie heute"
          subtitle="1 = total k.o. · 10 = top fit"
          onCancel={onClose}
          onSubmit={() => {
            if (energy === undefined) return;
            save('energy', energy);
          }}
        >
          <Field label="Skala 1–10">
            <ScaleInput value={energy} onChange={setEnergy} />
          </Field>
        </Form>
      )}

      {type === 'strength' && (
        <Form
          title="Krafttraining"
          subtitle="Was hast du gemacht?"
          onCancel={onClose}
          onSubmit={() => save('strength', strength.trim() || undefined)}
        >
          <Field label="Beschreibung">
            <input
              type="text"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              placeholder="z.B. Beine + Core, 30 Min"
              autoFocus
              className={inputCls}
            />
          </Field>
        </Form>
      )}

      {type === 'blackroll' && (
        <div>
          <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
            Blackroll heute
          </h2>
          <p className="mb-[18px] mt-1 text-[13px] text-ink-muted">
            Welche Routine hast du gemacht?
          </p>
          <div className="space-y-2">
            {BLACKROLL_OPTIONS.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => save('blackroll', opt)}
                className={`w-full rounded-full py-3 text-[14px] font-semibold transition active:scale-[0.97] ${
                  i === 0
                    ? 'bg-accent text-white'
                    : 'border border-accent text-accent'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-full border border-line py-3 text-[14px] font-semibold text-ink-soft"
          >
            Abbrechen
          </button>
        </div>
      )}

      {type === 'nutrition' && (
        <Form
          title="Ernährung / Notiz"
          subtitle="Was du gegessen hast, oder andere Notizen"
          onCancel={onClose}
          onSubmit={() => save('nutrition', nutrition.trim() || undefined)}
        >
          <Field label="Notiz">
            <textarea
              value={nutrition}
              onChange={(e) => setNutrition(e.target.value)}
              placeholder="z.B. Curry mittags, Quark abends, müde aber gut"
              autoFocus
              className={`${inputCls} min-h-[90px] resize-y`}
            />
          </Field>
        </Form>
      )}
    </Modal>
  );
}

const inputCls =
  'w-full rounded-card border border-line bg-bg px-[14px] py-[12px] text-[16px] outline-none transition focus:border-accent focus:bg-bg-card';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="mb-[6px] block text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function Form({
  title,
  subtitle,
  onCancel,
  onSubmit,
  children,
}: {
  title: string;
  subtitle: string;
  onCancel: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
        {title}
      </h2>
      <p className="mb-[18px] mt-1 text-[13px] text-ink-muted">{subtitle}</p>
      {children}
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-line px-[22px] py-3 text-[14px] font-semibold text-ink-soft transition active:scale-95"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="flex-1 rounded-full bg-accent px-[22px] py-3 text-[14px] font-semibold text-white transition active:scale-95"
        >
          Speichern
        </button>
      </div>
    </form>
  );
}
