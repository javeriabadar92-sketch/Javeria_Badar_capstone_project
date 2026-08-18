import { useState, useRef, type KeyboardEvent } from 'react';
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    let newIndex: number;

    if (e.key === 'ArrowRight') {
      newIndex = (activeIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    setActiveIndex(newIndex);
    tabRefs.current[newIndex]?.focus();
  };

  return (
    <div className="surface-card w-full overflow-hidden">
      {/* Tab List */}
      <div
        role="tablist"
        aria-label="Content tabs"
        className="flex flex-wrap border-b border-white/10 bg-slate-950/25"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeIndex === index}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeIndex === index ? 0 : -1}
            onClick={() => setActiveIndex(index)}
            onKeyDown={handleKeyDown}
            className={`focus-ring border-b-2 px-5 py-3 text-sm font-medium transition-all duration-200 ease-out ${
              activeIndex === index
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeIndex !== index}
          tabIndex={0}
          className={`px-6 py-6 transition-all duration-300 ease-out ${
            activeIndex === index
              ? 'opacity-100 visible'
              : 'opacity-0 invisible absolute'
          }`}
        >
          <div className="space-y-3 leading-relaxed text-slate-300">
            {tab.content}
          </div>
        </div>
      ))}
    </div>
  );
}