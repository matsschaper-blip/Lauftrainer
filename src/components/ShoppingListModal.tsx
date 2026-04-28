import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from './Modal';
import { showToast } from './Toast';
import { useStore } from '@/store/useStore';
import { recipeById } from '@/data/recipes';
import type { ShoppingCategory } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface AggItem {
  name: string;
  unit: string;
  amount: number;
  category: ShoppingCategory;
}

const CAT_ORDER: ShoppingCategory[] = [
  'Obst & Gemüse',
  'Kühlware',
  'Tiefkühl',
  'Trockenwaren',
  'Konserven',
  'Vorrat',
  'Sonstiges',
];

export function ShoppingListModal({ open, onClose }: Props) {
  const shopping = useStore((s) => s.shopping);
  const toggle = useStore((s) => s.toggleShoppingItem);
  const addCustom = useStore((s) => s.addCustomShopping);
  const clear = useStore((s) => s.clearShopping);

  const [customInput, setCustomInput] = useState('');

  const grouped = useMemo(() => {
    const aggMap = new Map<string, AggItem>();
    for (const [recipeId, qty] of Object.entries(shopping.selected)) {
      const recipe = recipeById(recipeId);
      if (!recipe) continue;
      for (const ing of recipe.ingredients) {
        const key = `${ing.name}|${ing.unit}`;
        const prev = aggMap.get(key);
        if (prev) {
          prev.amount += ing.amount * qty;
        } else {
          aggMap.set(key, {
            name: ing.name,
            unit: ing.unit,
            amount: ing.amount * qty,
            category: ing.category,
          });
        }
      }
    }
    const byCat = new Map<ShoppingCategory, AggItem[]>();
    for (const item of aggMap.values()) {
      const arr = byCat.get(item.category) ?? [];
      arr.push(item);
      byCat.set(item.category, arr);
    }
    if (shopping.custom.length > 0) {
      byCat.set(
        'Sonstiges',
        [
          ...(byCat.get('Sonstiges') ?? []),
          ...shopping.custom.map<AggItem>((name) => ({
            name,
            unit: '',
            amount: 0,
            category: 'Sonstiges',
          })),
        ],
      );
    }
    return byCat;
  }, [shopping]);

  const totalRecipes = Object.values(shopping.selected).reduce((a, b) => a + b, 0);

  function handleAddCustom() {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    addCustom(trimmed);
    setCustomInput('');
  }

  function buildText(): string {
    let text = 'EINKAUFSLISTE\n\n';
    for (const cat of CAT_ORDER) {
      const items = grouped.get(cat);
      if (!items || items.length === 0) continue;
      text += `${cat.toUpperCase()}\n`;
      for (const item of items) {
        const amt = item.amount > 0 ? `${item.amount} ${item.unit} ` : '';
        text += `– ${amt}${item.name}\n`;
      }
      text += '\n';
    }
    text += '\n--- AUSGEWÄHLTE REZEPTE ---\n';
    for (const [recipeId, qty] of Object.entries(shopping.selected)) {
      const r = recipeById(recipeId);
      if (r) text += `${qty}× ${r.name} (${r.portions * qty} Portionen)\n`;
    }
    return text;
  }

  async function share() {
    const text = buildText();
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Einkaufsliste', text });
        return;
      } catch {
        /* fallthrough to clipboard */
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      showToast('In Zwischenablage kopiert');
    }
  }

  function handleClear() {
    if (!confirm('Einkaufsliste komplett leeren?')) return;
    clear();
    showToast('Liste geleert');
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
        Einkaufsliste
      </h2>
      <p className="mb-4 mt-1 text-[13px] text-ink-muted">
        {totalRecipes} {totalRecipes === 1 ? 'Rezept' : 'Rezepte'} ausgewählt
      </p>

      {Array.from(grouped).length === 0 ? (
        <p className="py-8 text-center text-[13px] text-ink-muted">
          Noch nichts ausgewählt.
        </p>
      ) : (
        CAT_ORDER.map((cat) => {
          const items = grouped.get(cat);
          if (!items || items.length === 0) return null;
          return (
            <div key={cat} className="mb-4">
              <p className="mb-2 border-b border-line pb-[6px] font-sans text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
                {cat}
              </p>
              {items.map((item, i) => {
                const ckKey = `${cat}-${item.name}`;
                const checked = shopping.checked[ckKey];
                return (
                  <button
                    key={`${item.name}-${i}`}
                    type="button"
                    onClick={() => toggle(ckKey)}
                    className="grid w-full grid-cols-[24px_1fr_auto] items-center gap-[10px] py-[10px] text-left transition active:bg-bg-soft"
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                        checked
                          ? 'border-success bg-success text-white'
                          : 'border-line bg-bg-card'
                      }`}
                    >
                      {checked && <Check size={14} strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-[14px] ${
                        checked ? 'text-ink-muted line-through' : 'text-ink'
                      }`}
                    >
                      {item.name}
                    </span>
                    <span className="whitespace-nowrap font-mono text-[12px] text-ink-muted">
                      {item.amount > 0 ? `${item.amount} ${item.unit}` : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })
      )}

      <h3 className="mb-2 mt-6 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Eigene Items
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddCustom();
          }}
          placeholder="z.B. Brot, Milch…"
          className="flex-1 rounded-card border border-line bg-bg-card px-[14px] py-[10px] text-[14px] outline-none transition focus:border-accent"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          className="rounded-full border border-accent px-[18px] py-[10px] text-[13px] font-semibold text-accent transition active:scale-95"
        >
          +
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-line px-[22px] py-3 text-[14px] font-semibold text-ink-soft transition active:scale-95"
        >
          Schließen
        </button>
        <button
          type="button"
          onClick={share}
          disabled={Array.from(grouped).length === 0}
          className="flex-1 rounded-full bg-accent px-[22px] py-3 text-[14px] font-semibold text-white transition active:scale-95 disabled:opacity-50"
        >
          In Notes / teilen
        </button>
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="mt-2 w-full rounded-full border border-warn py-3 text-[14px] font-semibold text-warn transition active:scale-95"
      >
        Liste leeren
      </button>
    </Modal>
  );
}
