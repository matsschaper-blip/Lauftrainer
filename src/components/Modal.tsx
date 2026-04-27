import { useEffect, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      <div
        className="max-h-[90dvh] w-full max-w-[700px] overflow-y-auto rounded-t-[20px] bg-bg-card"
        style={{
          padding: '22px 20px calc(20px + env(safe-area-inset-bottom))',
          animation: 'slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        <div className="-mt-2 mx-auto mb-4 h-1 w-9 rounded bg-line" />
        {children}
      </div>
    </div>
  );
}
