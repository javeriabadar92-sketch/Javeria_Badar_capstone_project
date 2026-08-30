import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';

const RATE_LIMIT_MESSAGE = "We've hit a temporary usage limit. Please wait a minute and try again.";

function getChatErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();
  return message.includes('rate limit') || message.includes('quota') || message.includes('429') || message.includes('resource_exhausted')
    ? RATE_LIMIT_MESSAGE
    : error.message;
}

export default function Chat() {
  const { messages, sendMessage, status, stop, error } = useChat({
    onError: (error) => {
      console.error('❌ Chat error:', error);
    },
  });
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const isStreaming = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
    setAutoScroll(true);
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm'
                    : 'rounded-lg border border-slate-200 bg-slate-100 text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm'
              }`}
            >
              {message.parts.map((part, i) =>
                part.type === 'text' ? <span key={i}>{part.text}</span> : null
              )}
            </div>
          </div>
        ))}

        {status === 'submitted' && (
          <div className="flex justify-start">
            <div className="surface-card max-w-xs space-y-2 rounded-lg px-4 py-3">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="max-w-[80%] rounded-lg border border-red-400/30 bg-red-950/40 px-4 py-2 text-sm text-red-200">
              {getChatErrorMessage(error)}
            </div>
          </div>
        )}

        {!autoScroll && (
          <button
            onClick={() => {
              setAutoScroll(true);
              scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
              });
            }}
            className="focus-ring fixed bottom-24 right-4 rounded-full bg-cyan-800 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-800/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-800 sm:right-8"
          >
            ↓ Jump to latest
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 bg-slate-50 p-4 sm:p-5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your project idea..."
          disabled={isStreaming}
          className="focus-ring min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 placeholder:text-slate-500"
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={stop}
            className="focus-ring rounded-lg bg-red-500 px-5 py-2 font-semibold text-white transition-colors hover:bg-red-400"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="focus-ring rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
          >
            Send
          </button>
        )}
      </form>
    </section>
  );
}