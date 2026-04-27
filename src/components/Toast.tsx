import { create } from 'zustand';
import { useEffect } from 'react';

interface ToastState {
  message: string | null;
  show: (msg: string) => void;
  hide: () => void;
}

const useToast = create<ToastState>((set) => ({
  message: null,
  show: (msg) => set({ message: msg }),
  hide: () => set({ message: null }),
}));

export function showToast(msg: string) {
  useToast.getState().show(msg);
}

export function ToastHost() {
  const { message, hide } = useToast();
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(hide, 2200);
    return () => clearTimeout(t);
  }, [message, hide]);

  if (!message) return null;
  return (
    <div
      className="fixed left-1/2 z-[300] -translate-x-1/2 rounded-full bg-ink px-[18px] py-[10px] text-[13px] font-medium text-bg shadow-soft"
      style={{
        bottom: 'calc(96px + env(safe-area-inset-bottom))',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {message}
    </div>
  );
}
