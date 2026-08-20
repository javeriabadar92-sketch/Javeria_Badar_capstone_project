import { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements?.[0]?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
        else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out"
          onClick={onClose}
          role="presentation"
        />
      )}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby={`modal-title-${title}`}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto mx-4 w-full max-w-md transform rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl shadow-slate-900/10 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2
                id={`modal-title-${title}`}
                className="text-xl font-semibold tracking-tight text-cyan-700"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="focus-ring flex size-8 items-center justify-center rounded-lg text-2xl text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto px-6 py-6 leading-relaxed text-slate-700">
              {children}
            </div>

            {/* Footer */}
            <div className="flex gap-3 rounded-b-xl border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                onClick={onClose}
                className="focus-ring flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Close
              </button>
              <button
                className="focus-ring flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/85"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
