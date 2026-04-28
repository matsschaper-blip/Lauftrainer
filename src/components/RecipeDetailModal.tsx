import { Modal } from './Modal';
import { useStore } from '@/store/useStore';
import type { Recipe, RecipeCategory } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  recipe: Recipe | null;
}

const CATEGORY_BG: Record<RecipeCategory, string> = {
  breakfast: 'bg-[#F5EDD9]',
  smoothie: 'bg-[#E0EDE2]',
  snack: 'bg-[#F5E5DD]',
  during: 'bg-[#E8EDE8]',
};

export function RecipeDetailModal({ open, onClose, recipe }: Props) {
  const qty = useStore((s) => (recipe ? s.shopping.selected[recipe.id] ?? 0 : 0));
  const setQty = useStore((s) => s.setRecipeQty);

  if (!recipe) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className={`mb-4 flex items-center justify-center rounded-card py-[28px] text-[72px] ${CATEGORY_BG[recipe.category]}`}
      >
        {recipe.icon}
      </div>
      <h2 className="font-display text-[22px] font-medium leading-tight tracking-tight">
        {recipe.name}
      </h2>
      <p className="mb-4 mt-1 text-[13px] text-ink-muted">
        {recipe.portions} Portionen · {recipe.time} Min{recipe.note && ` · ${recipe.note}`}
      </p>

      <h3 className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Zutaten
      </h3>
      <ul className="m-0 mb-5 list-none p-0">
        {recipe.ingredients.map((ing, i) => (
          <li
            key={i}
            className="relative pl-4 text-[14px] leading-[1.6] text-ink-soft before:absolute before:left-0 before:top-[12px] before:h-px before:w-[6px] before:bg-accent"
          >
            <strong className="font-medium">
              {ing.amount} {ing.unit}
            </strong>{' '}
            {ing.name}
          </li>
        ))}
      </ul>

      <h3 className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Makros pro Portion
      </h3>
      <div className="grid grid-cols-3 overflow-hidden rounded-card border border-line">
        <Mini value={String(recipe.macros.kcal)} label="kcal" />
        <Mini value={String(recipe.macros.protein)} label="P (g)" />
        <Mini value={String(recipe.macros.carbs)} label="C (g)" />
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-line px-[22px] py-3 text-[14px] font-semibold text-ink-soft transition active:scale-95"
        >
          Schließen
        </button>
        {qty === 0 ? (
          <button
            type="button"
            onClick={() => {
              setQty(recipe.id, 1);
              onClose();
            }}
            className="flex-1 rounded-full bg-accent px-[22px] py-3 text-[14px] font-semibold text-white transition active:scale-95"
          >
            + Zur Liste
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setQty(recipe.id, 0);
              onClose();
            }}
            className="flex-1 rounded-full border border-warn px-[22px] py-3 text-[14px] font-semibold text-warn transition active:scale-95"
          >
            – Aus Liste
          </button>
        )}
      </div>
    </Modal>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-bg-card px-[10px] py-[14px] text-center [&:not(:last-child)]:border-r [&:not(:last-child)]:border-line">
      <p className="font-display text-[22px] font-medium leading-none text-accent">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
        {label}
      </p>
    </div>
  );
}
