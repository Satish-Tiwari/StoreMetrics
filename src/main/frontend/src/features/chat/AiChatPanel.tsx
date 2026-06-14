import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Loader, Send } from 'lucide-react';
import api from '@lib/api';
import type { ChatMessage } from '@/types';


export const AiChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Math.random().toString(36).substring(2, 9)}`);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/ai/chat', {
        sessionId,
        message: userMsg.content,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${err.response?.data?.message || err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-14rem)] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="font-bold text-sm tracking-wide">StoreMetrics RAG Assistant</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">{sessionId}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 px-4">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-800 text-base">Start a RAG conversation</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Ask questions about store revenue, top catalog products, user counts, and general business trends. The assistant will resolve database vectors instantly.
            </p>
          </div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl rounded-2xl py-3 px-4 text-sm shadow-sm ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              }`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none py-3 px-4 text-sm text-slate-400 flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-blue-500" />
              <span>Retrieving pgvector cosine segments...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white flex items-center gap-3 shrink-0">
        <input
          type="text"
          required
          disabled={loading}
          className="flex-1 bg-slate-100 border border-slate-200 focus:border-blue-500 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
          placeholder="Query store metrics (e.g. What is my best product by revenue?)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 text-white p-3 rounded-xl hover:shadow-lg active:scale-[0.98] transition shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
