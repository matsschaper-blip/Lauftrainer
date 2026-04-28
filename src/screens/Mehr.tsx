import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { showToast } from '@/components/Toast';
import { useStore } from '@/store/useStore';
import { REFS, type RefKey } from '@/data/refs';
import { generatePreRun, generateWeekReview } from '@/utils/templates';
import { todayISO } from '@/utils/date';

const REFS_LIST: { key: RefKey; sub: string }[] = [
  { key: 'zones', sub: 'Z2 134–147 · Long-Run-Zone' },
  { key: 'warmup', sub: '8 Min dynamisch' },
  { key: 'strength', sub: 'Mo Beine · Mi Oberkörper' },
  { key: 'supplements', sub: '~20 €/Mt · D3 + B12 + Omega + Mg' },
  { key: 'blood', sub: 'Ferritin · D3 · B12' },
  { key: 'blackroll', sub: '3 Slots · nach Lauf 5 Min' },
  { key: 'knee', sub: 'Wann sofort pausieren' },
];

export function Mehr() {
  const [openRef, setOpenRef] = useState<RefKey | null>(null);
  const [openTemplate, setOpenTemplate] = useState<'preRun' | 'weekReview' | null>(null);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <section>
      <div className="mb-6 border-b border-line pb-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Referenz & Settings
        </p>
        <h1 className="font-display text-[clamp(28px,7vw,38px)] font-normal leading-tight tracking-tight">
          <em className="font-light text-accent">Mehr</em>.
        </h1>
      </div>

      <h3 className="mb-[10px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Coaching-Templates · zum Kopieren
      </h3>

      <Card>
        <h2 className="mb-3 font-display text-[20px] font-medium tracking-tight">
          Pre-Run Quick-Check
        </h2>
        <p className="mb-3 text-[13px] text-ink-soft">
          Wenn etwas auffällig ist — schlecht geschlafen, krank, gestresst. Mit deinen
          heutigen Daten automatisch ausgefüllt.
        </p>
        <button
          type="button"
          onClick={() => setOpenTemplate('preRun')}
          className="w-full rounded-full bg-accent py-3 text-[14px] font-semibold text-white transition active:scale-95"
        >
          Pre-Run-Check generieren →
        </button>
      </Card>

      <Card>
        <h2 className="mb-3 font-display text-[20px] font-medium tracking-tight">
          Sonntags-Wochenrückblick
        </h2>
        <p className="mb-3 text-[13px] text-ink-soft">
          5 Min · Anker für die nächste Woche. Deine Daten sind eingefügt — du
          ergänzt nur das Subjektive.
        </p>
        <button
          type="button"
          onClick={() => setOpenTemplate('weekReview')}
          className="w-full rounded-full bg-accent py-3 text-[14px] font-semibold text-white transition active:scale-95"
        >
          Wochenrückblick generieren →
        </button>
      </Card>

      <h3 className="mb-[10px] mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Quick-Refs
      </h3>

      <div className="mb-[14px] overflow-hidden rounded-card border border-line">
        {REFS_LIST.map((r, i) => (
          <MenuRow
            key={r.key}
            label={REFS[r.key].title}
            sub={r.sub}
            onClick={() => setOpenRef(r.key)}
            last={i === REFS_LIST.length - 1}
          />
        ))}
      </div>

      <h3 className="mb-[10px] mt-[24px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Settings
      </h3>

      <div className="mb-[14px] overflow-hidden rounded-card border border-line">
        <MenuRow
          label="Einstellungen"
          sub="Name, Start-Datum, aktuelle Woche"
          onClick={() => setOpenSettings(true)}
        />
        <MenuRow
          label="Daten exportieren"
          sub="JSON-Backup deiner Logs"
          onClick={exportData}
        />
        <MenuRow
          label="Abmelden"
          sub="Session beenden"
          onClick={signOut}
          last
        />
      </div>

      <p className="mt-8 text-center text-[11px] leading-[1.6] text-ink-muted">
        Mats&rsquo; Lauftrainer · v0.1<br />
        Daten in deinem privaten Supabase-Projekt
      </p>

      <Modal open={openRef !== null} onClose={() => setOpenRef(null)}>
        {openRef && <RefView refKey={openRef} onClose={() => setOpenRef(null)} />}
      </Modal>

      <Modal open={openTemplate !== null} onClose={() => setOpenTemplate(null)}>
        {openTemplate && (
          <TemplateView
            type={openTemplate}
            onClose={() => setOpenTemplate(null)}
          />
        )}
      </Modal>

      <Modal open={openSettings} onClose={() => setOpenSettings(false)}>
        {openSettings && <SettingsForm onClose={() => setOpenSettings(false)} />}
      </Modal>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[14px] rounded-card border border-line bg-bg-card p-[18px]">
      {children}
    </div>
  );
}

function MenuRow({
  label,
  sub,
  onClick,
  last,
}: {
  label: string;
  sub: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid w-full grid-cols-[1fr_auto] items-center gap-3 bg-bg-card px-[16px] py-[14px] text-left transition active:bg-bg-soft ${
        last ? '' : 'border-b border-line-soft'
      }`}
    >
      <div>
        <p className="text-[14px]">{label}</p>
        <p className="mt-[2px] text-[11px] text-ink-muted">{sub}</p>
      </div>
      <ChevronRight size={14} className="text-ink-muted" />
    </button>
  );
}

function RefView({ refKey, onClose }: { refKey: RefKey; onClose: () => void }) {
  const ref = REFS[refKey];
  return (
    <>
      <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
        {ref.title}
      </h2>
      <div
        className="mt-3 leading-relaxed [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-[11px] [&_h3]:font-semibold [&_h3]:uppercase [&_h3]:tracking-[0.12em] [&_h3]:text-ink-muted [&_li]:mb-1 [&_li]:text-[14px] [&_li]:text-ink-soft [&_table]:w-full [&_td]:py-2 [&_td]:text-[13px] [&_ul.bullets]:list-none [&_ul.bullets]:p-0 [&_ul.bullets_li]:relative [&_ul.bullets_li]:pl-4 [&_ul]:list-none"
        dangerouslySetInnerHTML={{ __html: ref.body }}
      />
      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-full bg-accent py-3 text-[14px] font-semibold text-white transition active:scale-95"
      >
        Schließen
      </button>
    </>
  );
}

function TemplateView({
  type,
  onClose,
}: {
  type: 'preRun' | 'weekReview';
  onClose: () => void;
}) {
  const settings = useStore((s) => s.settings);
  const logs = useStore((s) => s.logs);
  const trainings = useStore((s) => s.trainings);

  const text =
    type === 'preRun'
      ? generatePreRun({ settings, logs, trainings })
      : generateWeekReview({ settings, logs, trainings });

  const [draft, setDraft] = useState(text);

  function copyOnly() {
    void copyToClipboard(draft);
    showToast('In Zwischenablage kopiert');
  }

  function copyAndOpen() {
    void copyToClipboard(draft);
    showToast('Kopiert · öffne Claude');
    setTimeout(() => window.open('https://claude.ai/new', '_blank'), 600);
  }

  return (
    <>
      <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
        {type === 'preRun' ? 'Pre-Run Check' : 'Wochenrückblick'}
      </h2>
      <p className="mb-3 mt-1 text-[13px] text-ink-muted">
        Mit deinen Daten gefüllt. Ergänze die `__`-Stellen, kopier und sende an Claude.
      </p>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="min-h-[280px] w-full resize-y rounded-card border border-line bg-bg-card px-[14px] py-[12px] font-mono text-[13px] leading-[1.7] outline-none focus:border-accent"
      />
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-line px-[22px] py-3 text-[14px] font-semibold text-ink-soft transition active:scale-95"
        >
          Schließen
        </button>
        <button
          type="button"
          onClick={copyAndOpen}
          className="flex-1 rounded-full bg-accent px-[22px] py-3 text-[14px] font-semibold text-white transition active:scale-95"
        >
          Kopieren + Claude öffnen
        </button>
      </div>
      <button
        type="button"
        onClick={copyOnly}
        className="mt-2 w-full rounded-full border border-line py-3 text-[14px] font-semibold text-ink-soft transition active:scale-95"
      >
        Nur kopieren
      </button>
    </>
  );
}

function SettingsForm({ onClose }: { onClose: () => void }) {
  const settings = useStore((s) => s.settings);
  const setSettings = useStore((s) => s.setSettings);

  const [name, setName] = useState(settings.name);
  const [startDate, setStartDate] = useState(settings.startDate);
  const [weekOffset, setWeekOffset] = useState(String(settings.weekOffset));
  const [hfMax, setHfMax] = useState(String(settings.hfMax));
  const [rhrBaseline, setRhrBaseline] = useState(String(settings.rhrBaseline));

  function save() {
    setSettings({
      name: name.trim() || 'Mats',
      startDate,
      weekOffset: parseInt(weekOffset, 10) || 0,
      hfMax: parseInt(hfMax, 10) || 198,
      rhrBaseline: parseInt(rhrBaseline, 10) || 57,
    });
    showToast('Gespeichert');
    onClose();
  }

  return (
    <>
      <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
        Einstellungen
      </h2>
      <p className="mb-4 mt-1 text-[13px] text-ink-muted">Persönliche Daten</p>

      <Field label="Name">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Start-Datum (Woche 1)">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputCls}
        />
      </Field>

      <Field label="Wochen-Offset (Plan vor/zurück)">
        <input
          type="number"
          value={weekOffset}
          onChange={(e) => setWeekOffset(e.target.value)}
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-[10px]">
        <Field label="HF max">
          <input
            type="number"
            value={hfMax}
            onChange={(e) => setHfMax(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="RHR-Baseline">
          <input
            type="number"
            value={rhrBaseline}
            onChange={(e) => setRhrBaseline(e.target.value)}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-line px-[22px] py-3 text-[14px] font-semibold text-ink-soft transition active:scale-95"
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={save}
          className="flex-1 rounded-full bg-accent px-[22px] py-3 text-[14px] font-semibold text-white transition active:scale-95"
        >
          Speichern
        </button>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="mb-[6px] block text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full rounded-card border border-line bg-bg px-[14px] py-[12px] text-[16px] outline-none transition focus:border-accent focus:bg-bg-card';

async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

function exportData() {
  const state = useStore.getState();
  const data = {
    exportedAt: new Date().toISOString(),
    settings: state.settings,
    logs: state.logs,
    trainings: state.trainings,
    shopping: state.shopping,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lauftrainer-backup-${todayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup heruntergeladen');
}

async function signOut() {
  if (!confirm('Wirklich abmelden? Du musst dich neu einloggen.')) return;
  const { supabase } = await import('@/lib/supabase');
  await supabase.auth.signOut();
}
