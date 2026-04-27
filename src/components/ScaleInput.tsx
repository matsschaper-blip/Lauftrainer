interface Props {
  value: number | undefined;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

export function ScaleInput({ value, onChange, min = 1, max = 10 }: Props) {
  const items = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  return (
    <div className="grid grid-cols-10 gap-[4px]">
      {items.map((n) => {
        const active = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`rounded-lg border py-[10px] text-[13px] font-semibold transition active:scale-95 ${
              active
                ? 'border-accent bg-accent text-white'
                : 'border-line bg-bg text-ink-soft'
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
