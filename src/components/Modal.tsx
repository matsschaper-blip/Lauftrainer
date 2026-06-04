import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  fullscreen?: boolean;
}

export function Modal({ open, onClose, children, fullscreen }: Props) {
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.dataset.modal = 'open';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    const stateMarker = { lauftrainerModal: true };
    history.pushState(stateMarker, '');
    const onPop = () => onClose();
    window.addEventListener('popstate', onPop);

    return () => {
      document.body.style.overflow = prev;
      delete document.body.dataset.modal;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
      if (history.state && (history.state as { lauftrainerModal?: boolean }).lauftrainerModal) {
        history.back();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const CloseButton = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Schließen"
      className="fixed right-3 z-[210] flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg-card/95 text-ink-soft shadow-sm backdrop-blur active:scale-95"
      style={{ top: 'calc(env(safe-area-inset-top) + 12px)' }}
    >
      <X size={20} />
    </button>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-[200] flex flex-col bg-bg"
        style={{ animation: 'fadeIn 0.2s ease' }}
      >
        {CloseButton}
        <div
          className="flex-1 overflow-y-auto"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      {CloseButton}
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
