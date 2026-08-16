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
            className="pointer-events-auto bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <h2
                id={`modal-title-${title}`}
                className="font-roboto text-xl font-semibold text-slate-900 tracking-tight"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="font-inter text-2xl text-slate-500 hover:text-slate-700 transition-colors duration-200 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 max-h-96 overflow-y-auto font-openSans text-slate-700 leading-relaxed">
              {children}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl">
              <button
                onClick={onClose}
                className="font-roboto flex-1 px-4 py-2 bg-slate-200 text-slate-900 rounded-lg font-medium hover:bg-slate-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
              >
                Close
              </button>
              <button
                className="font-roboto flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
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
