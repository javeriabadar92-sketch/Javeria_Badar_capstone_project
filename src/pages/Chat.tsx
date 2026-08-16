import { useRef, useEffect, useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [status, setStatus] = useState<'idle' | 'submitted' | 'streaming'>('idle');
  const [error, setError] = useState<{ message: string } | null>(null);
  let streamingMessageId = '';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
    };

    console.log('📤 Sending message:', userMessage);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setAutoScroll(true);
    setStatus('submitted');
    setError(null);

    try {
      const requestBody = {
        messages: [
          ...messages,
          userMessage,
        ].map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      };

      console.log('📡 Request body:', requestBody);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📬 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API error:', errorData);
        throw new Error(errorData.error || 'Failed to get response');
      }

      streamingMessageId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: streamingMessageId, role: 'assistant', content: '' },
      ]);

      setStatus('streaming');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          console.log('📥 Received chunk:', text);
          const lines = text.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              if (jsonStr === '[DONE]') {
                console.log('✅ Stream complete');
                continue;
              }

              try {
                const json = JSON.parse(jsonStr);
                if (json.type === 'text-delta' && json.delta) {
                  console.log('💬 Text delta:', json.delta);
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamingMessageId
                        ? { ...msg, content: msg.content + json.delta }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.warn('⚠️ Parse error:', e);
              }
            }
          }
        }
      }

      setStatus('idle');
    } catch (err) {
      setStatus('idle');
      console.error('❌ Error:', err);
      setError({
        message: err instanceof Error ? err.message : 'Something went wrong',
      });
    }
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
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-100'
                }`}
            >
              <span>{message.content}</span>
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
              {error.message || 'Something went wrong while generating the response.'}
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
            disabled
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold cursor-not-allowed opacity-50"
          >
            Sending...
          </button>
        ) : (
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}