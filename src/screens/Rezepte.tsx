import { useMemo, useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CATEGORY_LABEL, RECIPES } from '@/data/recipes';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';
import { ShoppingListModal } from '@/components/ShoppingListModal';
import type { Recipe, RecipeCategory } from '@/types';

const CATEGORY_BG: Record<RecipeCategory, string> = {
  breakfast: 'bg-[#F5EDD9]', // warmes Gelb
  smoothie: 'bg-[#E0EDE2]', // sanftes Grün
  snack: 'bg-[#F5E5DD]', // warmes Pfirsich
  during: 'bg-[#E8EDE8]', // dezent Grün-Grau
};

export function Rezepte() {
  const shopping = useStore((s) => s.shopping);
  const setQty = useStore((s) => s.setRecipeQty);

  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);
  const [openList, setOpenList] = useState(false);

  const totalSelected = Object.values(shopping.selected).reduce((a, b) => a + b, 0);

  const grouped = useMemo(() => {
    const map = new Map<RecipeCategory, Recipe[]>();
    for (const r of RECIPES) {
      const arr = map.get(r.category) ?? [];
      arr.push(r);
      map.set(r.category, arr);
    }
    return map;
  }, []);

  const order: RecipeCategory[] = ['breakfast', 'smoothie', 'snack', 'during'];

  return (
    <section>
      <div className="mb-6 border-b border-line pb-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Schnell & lauftauglich
        </p>
        <h1 className="font-display text-[clamp(28px,7vw,38px)] font-normal leading-tight tracking-tight">
          Rezepte &amp; <em className="font-light text-accent">Einkauf</em>.
        </h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          Frühstück, Smoothies, Snacks — alles in unter 15 Min. Auswählen, Liste in
          Apple Notes teilen.
        </p>
      </div>

      {order.map((cat) => {
        const items = grouped.get(cat);
        if (!items || items.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <h3 className="mb-[10px] font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
              {CATEGORY_LABEL[cat]}
            </h3>
            <div className="space-y-[8px]">
              {items.map((recipe) => {
                const qty = shopping.selected[recipe.id] ?? 0;
                return (
                  <div
                    key={recipe.id}
                    className="flex items-stretch overflow-hidden rounded-card border border-line bg-bg-card"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenRecipe(recipe)}
                      className={`flex w-[72px] flex-shrink-0 items-center justify-center text-[36px] transition active:opacity-70 ${CATEGORY_BG[cat]}`}
                      aria-label={`${recipe.name} öffnen`}
                    >
                      {recipe.icon}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenRecipe(recipe)}
                      className="flex-1 px-[14px] py-[12px] text-left transition active:bg-bg-soft"
                    >
                      <p className="font-display text-[16px] font-medium leading-tight">
                        {recipe.name}
                      </p>
                      <p className="mt-[4px] font-mono text-[11px] text-ink-muted">
                        {recipe.portions}P · {recipe.time}min · ~{recipe.macros.kcal} kcal
                      </p>
                    </button>
                    <div className="flex items-center gap-[6px] pr-[10px]">
                      <div className="flex items-center gap-[4px] rounded-full border border-line bg-bg p-1">
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
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

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
