'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user' as 'user', text: input }
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (!data.reply) throw new Error('No reply received');

      setMessages([...newMessages, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      console.error('❌ Chat API error:', err);
      setMessages([...newMessages, { role: 'assistant', text: '⚠️ Something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Back Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center text-sm text-green-700 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold text-green-700 mb-2 text-center">🌿 PlantBot Chat</h1>
      <p className="text-center text-gray-500 mb-6">Ask anything about plants!</p>

      <div className="bg-white border rounded-xl shadow-md h-[500px] flex flex-col">
        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-end gap-2 max-w-xs">
                {msg.role === 'assistant' && (
                  <div className="p-2 bg-green-100 rounded-full">
                    <Bot className="w-4 h-4 text-green-700" />
                  </div>
                )}
                <div
                  className={`rounded-xl px-4 py-2 text-sm shadow ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="p-2 bg-green-600 text-white rounded-full">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-400 italic">Bot is typing...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input box */}
        <div className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask a question about your plant..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
