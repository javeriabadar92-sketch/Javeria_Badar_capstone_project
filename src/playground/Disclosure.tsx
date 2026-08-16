import { useState } from 'react';

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
}

export function Disclosure({ title, children }: DisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="disclosure-content"
        className="font-roboto w-full px-6 py-4 flex items-center gap-3 font-semibold text-slate-900 hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
      >
        <span
          className={`flex-shrink-0 text-indigo-600 transition-transform duration-300 ${
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
          className="px-6 py-4 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100 font-openSans text-slate-700 leading-relaxed animate-in fade-in duration-300"
        >
          {children}
        </div>
      )}
    </div>
  );
}