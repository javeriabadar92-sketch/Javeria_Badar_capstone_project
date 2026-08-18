import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';

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
    <section className="flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900/55 text-slate-100 shadow-2xl shadow-black/20">
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
                  ? 'bg-primary text-primary-foreground'
                    : 'surface-card text-[#E2E8F0]'
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
            <div className="surface-card rounded-lg px-4 py-2 text-[#E2E8F0]">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="max-w-[80%] rounded-lg border border-red-400/30 bg-red-950/40 px-4 py-2 text-sm text-red-200">
              {error.message}
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
            className="focus-ring fixed bottom-24 right-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/30 sm:right-8"
          >
            ↓ Jump to latest
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 bg-slate-950/20 p-4 sm:p-5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your project idea..."
          disabled={isStreaming}
          className="focus-ring min-w-0 flex-1 rounded-lg border border-white/15 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-500"
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