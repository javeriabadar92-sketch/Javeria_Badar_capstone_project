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
    let newIndex = activeIndex;

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
    <div className="w-full rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Tab List */}
      <div
        role="tablist"
        aria-label="Content tabs"
        className="flex bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200"
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
            className={`font-roboto px-6 py-3 font-medium text-sm transition-all duration-200 ease-out border-b-2 ${
              activeIndex === index
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset`}
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
          <div className="font-openSans text-slate-700 leading-relaxed space-y-3">
            {tab.content}
          </div>
        </div>
      ))}
    </div>
  );
}