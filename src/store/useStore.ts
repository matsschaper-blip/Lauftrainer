import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  AppState,
  DailyLog,
  Settings,
  Theme,
  WorkoutLog,
  DayKey,
} from '@/types';
import { todayISO } from '@/utils/date';
import {
  deleteDailyLog as remoteDeleteLog,
  fetchDailyLogs,
  fetchSettings,
  fetchWorkoutLogs,
  upsertDailyLog as remoteUpsertLog,
  upsertWorkoutLog as remoteUpsertWorkout,
} from '@/lib/sync';

const initialSettings: Settings = {
  name: 'Mats',
  startDate: todayISO(),
  weekOffset: 0,
  hfMax: 198,
  rhrBaseline: 57,
  weight: 80,
  height: 198,
  goalPace: '5:40',
  weeklyVolumeTarget: 200,
};

const initialState: AppState = {
  settings: initialSettings,
  logs: {},
  trainings: {},
  shopping: { selected: {}, custom: [], checked: {} },
  theme:
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
};

interface Actions {
  setSettings: (patch: Partial<Settings>) => void;
  upsertLog: (date: string, patch: Partial<DailyLog>) => void;
  deleteLog: (date: string) => void;
  setWorkout: (week: number, day: DayKey, patch: Partial<WorkoutLog>) => void;
  toggleWorkoutDone: (week: number, day: DayKey) => void;
  setRecipeQty: (recipeId: string, qty: number) => void;
  toggleShoppingItem: (key: string) => void;
  addCustomShopping: (item: string) => void;
  clearShopping: () => void;
  setTheme: (theme: Theme) => void;
  resetAll: () => void;
  setUserId: (id: string | null) => void;
  bootstrap: (userId: string) => Promise<void>;
}

export type Store = AppState & Actions & {
  userId: string | null;
  bootstrapped: boolean;
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,
      userId: null,
      bootstrapped: false,

      setUserId: (id) => set({ userId: id, bootstrapped: false }),

      bootstrap: async (userId) => {
        const fallbackSettings = get().settings;
        const [settings, logs, trainings] = await Promise.all([
          fetchSettings(userId, fallbackSettings),
          fetchDailyLogs(userId),
          fetchWorkoutLogs(userId),
        ]);
        set({
          userId,
          settings: settings ?? fallbackSettings,
          logs,
          trainings,
          bootstrapped: true,
        });
      },

      setSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      upsertLog: (date, patch) => {
        set((s) => ({
          logs: {
            ...s.logs,
            [date]: { ...(s.logs[date] ?? { date }), ...patch },
          },
        }));
        const userId = get().userId;
        if (userId) {
          remoteUpsertLog(userId, date, patch).catch((err) => {
            console.error('Daily log sync failed', err);
          });
        }
      },

      deleteLog: (date) => {
        set((s) => {
          const next = { ...s.logs };
          delete next[date];
          return { logs: next };
        });
        const userId = get().userId;
        if (userId) {
          remoteDeleteLog(userId, date).catch((err) => {
            console.error('Daily log delete sync failed', err);
          });
        }
      },

      setWorkout: (week, day, patch) => {
        set((s) => {
          const weekData = s.trainings[week] ?? {};
          const existing: WorkoutLog = weekData[day] ?? { completed: false };
          return {
            trainings: {
              ...s.trainings,
              [week]: { ...weekData, [day]: { ...existing, ...patch } },
            },
          };
        });
        const userId = get().userId;
        if (userId) {
          remoteUpsertWorkout(userId, week, day, patch).catch((err) =>
            console.error('Workout sync failed', err),
          );
        }
      },

      toggleWorkoutDone: (week, day) => {
        const weekData = get().trainings[week] ?? {};
        const existing: WorkoutLog = weekData[day] ?? { completed: false };
        const next = !existing.completed;
        set((s) => ({
          trainings: {
            ...s.trainings,
            [week]: {
              ...weekData,
              [day]: { ...existing, completed: next },
            },
          },
        }));
        const userId = get().userId;
        if (userId) {
          remoteUpsertWorkout(userId, week, day, { completed: next }).catch((err) =>
            console.error('Workout toggle sync failed', err),
          );
        }
      },

      setRecipeQty: (recipeId, qty) =>
        set((s) => {
          const next = { ...s.shopping.selected };
          if (qty <= 0) {
            delete next[recipeId];
          } else {
            next[recipeId] = qty;
          }
          return { shopping: { ...s.shopping, selected: next } };
        }),

      toggleShoppingItem: (key) =>
        set((s) => ({
          shopping: {
            ...s.shopping,
            checked: { ...s.shopping.checked, [key]: !s.shopping.checked[key] },
          },
        })),

      addCustomShopping: (item) =>
        set((s) => ({
          shopping: { ...s.shopping, custom: [...s.shopping.custom, item] },
        })),

      clearShopping: () =>
        set(() => ({
          shopping: { selected: {}, custom: [], checked: {} },
        })),

      setTheme: (theme) => set({ theme }),

      resetAll: () => set(initialState),
    }),
    {
      name: 'lauftrainer-v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({
        settings: s.settings,
        logs: s.logs,
        trainings: s.trainings,
        shopping: s.shopping,
        theme: s.theme,
      }),
    },
  ),
);
