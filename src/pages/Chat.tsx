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
    <div className="flex flex-col h-screen bg-slate-900">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
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
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-100'
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
            <div className="bg-slate-700 text-slate-100 rounded-lg px-4 py-2">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div className="max-w-[80%] rounded-lg border border-red-500 bg-red-900/40 px-4 py-2 text-sm text-red-100">
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
            className="fixed bottom-24 right-8 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg"
          >
            ↓ Jump to latest
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-700 p-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your project idea..."
          disabled={isStreaming}
          className="flex-1 rounded-lg border border-slate-600 bg-slate-800 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={stop}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}