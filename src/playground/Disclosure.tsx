import { useState } from 'react';

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
}

export function Disclosure({ title, children }: DisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="disclosure-content"
        className="flex items-center gap-2 font-bold"
      >
        <span>{isExpanded ? '▼' : '▶'}</span>
        {title}
      </button>

      {isExpanded && (
        <div id="disclosure-content" className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}