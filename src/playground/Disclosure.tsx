import { useState } from 'react';

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
}

export function Disclosure({ title, children }: DisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="surface-card w-full overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="disclosure-content"
        className="focus-ring flex w-full items-center gap-3 px-5 py-4 text-left font-semibold text-slate-800 transition-colors hover:bg-slate-50"
      >
        <span
          className={`flex-shrink-0 text-cyan-600 transition-transform duration-300 ${
            isExpanded ? 'rotate-90' : 'rotate-0'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
        <span className="text-left">{title}</span>
      </button>

      {isExpanded && (
        <div
          id="disclosure-content"
          className="border-t border-slate-200 bg-slate-50 px-5 py-4 leading-relaxed text-slate-700 animate-in fade-in duration-300"
        >
          {children}
        </div>
      )}
    </div>
  );
}