import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { RECIPES } from '@/data/recipes';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';
import { ShoppingListModal } from '@/components/ShoppingListModal';
import type { Recipe } from '@/types';

export function Rezepte() {
  const shopping = useStore((s) => s.shopping);
  const setQty = useStore((s) => s.setRecipeQty);

  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const [openList, setOpenList] = useState(false);

  const totalSelected = Object.values(shopping.selected).reduce((a, b) => a + b, 0);

  return (
    <section>
      <div className="mb-6 border-b border-line pb-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Meal Prep · Sonntag 2 h
        </p>
        <h1 className="font-display text-[clamp(28px,7vw,38px)] font-normal leading-tight tracking-tight">
          Rezepte &amp; <em className="font-light text-accent">Einkauf</em>.
        </h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          Wähle Rezepte aus — ich mache deine Einkaufsliste, direkt in Apple Notes
          teilbar.
        </p>
      </div>

      <h3 className="mb-[10px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
        Verfügbare Rezepte
      </h3>

      <div className="overflow-hidden rounded-card border border-line bg-bg-card">
        {RECIPES.map((recipe, i) => {
          const qty = shopping.selected[recipe.id] ?? 0;
          return (
            <div
              key={recipe.id}
              className={`grid grid-cols-[1fr_auto] items-center gap-[10px] px-[14px] py-[14px] ${
                i < RECIPES.length - 1 ? 'border-b border-line-soft' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenRecipe(recipe)}
                className="text-left transition active:opacity-70"
              >
                <p className="font-display text-[16px] font-medium">{recipe.name}</p>
                <p className="mt-[2px] font-mono text-[11px] text-ink-muted">
                  {recipe.portions}P · {recipe.time}min · ~{recipe.macros.kcal} kcal
                </p>
              </button>
              <div className="flex items-center gap-[6px] rounded-full border border-line bg-bg p-1">
                <button
                  type="button"
                  onClick={() => setQty(recipe.id, Math.max(0, qty - 1))}
                  disabled={qty === 0}
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-bg-card text-accent transition active:bg-accent active:text-white disabled:opacity-30"
                  aria-label="Menge verringern"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="min-w-[18px] text-center font-mono text-[13px] font-semibold">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(recipe.id, qty + 1)}
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-bg-card text-accent transition active:bg-accent active:text-white"
                  aria-label="Menge erhöhen"
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {totalSelected > 0 && (
        <button
          type="button"
          data-bottom-nav
          onClick={() => setOpenList(true)}
          className="fixed right-[18px] z-30 flex items-center gap-2 rounded-full bg-accent px-[22px] py-[14px] font-semibold text-white shadow-[0_4px_16px_rgba(43,74,63,0.3)] transition active:scale-95"
          style={{ bottom: 'calc(82px + env(safe-area-inset-bottom))' }}
        >
          <ShoppingBag size={18} />
          <span className="text-[14px]">Einkaufsliste</span>
          <span className="rounded-full bg-white px-[7px] py-[2px] font-mono text-[11px] text-accent">
            {totalSelected}
          </span>
        </button>
      )}

      <RecipeDetailModal
        open={openRecipe !== null}
        onClose={() => setOpenRecipe(null)}
        recipe={openRecipe}
      />

      <ShoppingListModal open={openList} onClose={() => setOpenList(false)} />
    </section>
  );
}
