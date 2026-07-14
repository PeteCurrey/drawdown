"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot } from "lucide-react";
import type { TradeEntry, ChatMessage } from "./types";

const QUICK_QUESTIONS = [
  { icon: "📊", text: "Analyse my last 30 trades" },
  { icon: "🔍", text: "What is my biggest weakness?" },
  { icon: "💪", text: "What is my statistical edge?" },
  { icon: "📅", text: "How was my trading this week?" },
  { icon: "🎯", text: "Which setups should I focus on?" },
  { icon: "😤", text: "When do emotions hurt my trading?" },
  { icon: "⚠️", text: "What mistakes am I repeating?" },
  { icon: "🏆", text: "What are my best trading conditions?" },
  { icon: "📈", text: "Am I improving month on month?" },
  { icon: "🎰", text: "Am I overtrading?" },
  { icon: "💰", text: "What would happen if I only took A+ setups?" },
  { icon: "🔮", text: "What should I focus on this week?" },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ msg, isLast }: { msg: ChatMessage & { timestamp: string }; isLast: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[85%] ${isUser ? "" : "flex flex-col gap-1"}`}>
        {!isUser && (
          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--tool-accent-text)] px-1">COACH</span>
        )}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-[var(--tool-accent)] text-white rounded-tr-sm font-medium"
            : "bg-white border border-gray-100 shadow-sm rounded-tl-sm text-gray-800"
        }`}>
          {/* Render newlines in assistant responses */}
          {msg.content.split("\n").map((line, i) => (
            <React.Fragment key={i}>{line}{i < msg.content.split("\n").length - 1 && <br />}</React.Fragment>
          ))}
        </div>
        <p className={`text-[9px] text-gray-400 mt-0.5 ${isUser ? "text-right" : ""}`}>{formatTime(msg.timestamp)}</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--tool-accent-text)] px-1">COACH</span>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex gap-1 items-center">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-[var(--tool-accent)] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AiCoach({ trades }: { trades: TradeEntry[] }) {
  const [messages, setMessages] = useState<Array<ChatMessage & { timestamp: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  const closedTrades = trades.filter(t => t.status === "CLOSED");
  const welcomeText = `👋 I have full access to your ${trades.length} trade${trades.length !== 1 ? "s" : ""} (${closedTrades.length} closed). Ask me anything about your performance, patterns, or what to focus on next.`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage & { timestamp: string } = { role: "user", content: text.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true); setError(null);

    try {
      const history = messages.slice(-9).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/journal/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), history, trades }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { reply } = await res.json();
      const assistantMsg: ChatMessage & { timestamp: string } = { role: "assistant", content: reply, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      setError("Failed to reach the AI Coach. Check your connection and try again.");
      setMessages(prev => prev.slice(0, -1)); // remove the user message on error
    } finally { setLoading(false); }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-280px)] min-h-[500px]">
      {/* ── Quick Questions ── */}
      <div className="lg:w-64 shrink-0 space-y-2">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-black mb-1">💬 Quick Questions</p>
          <p className="text-[10px] text-gray-400 mb-3">Ask your AI Coach:</p>
          <div className="space-y-1.5">
            {QUICK_QUESTIONS.map(q => (
              <button key={q.text}
                onClick={() => sendMessage(`${q.icon} ${q.text}`)}
                disabled={loading}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-gray-100 hover:border-[var(--tool-accent-border)] hover:bg-[var(--tool-accent-tint)] text-[10px] text-gray-600 hover:text-[var(--tool-accent-text)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="mr-1.5">{q.icon}</span>{q.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chat Window ── */}
      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[var(--tool-accent-tint)] border border-[var(--tool-accent-border)] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[var(--tool-accent-text)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-black">AI COACH</p>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--tool-accent)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--tool-accent)]" />
              </span>
            </div>
            <p className="text-[9px] text-gray-400">Powered by Claude · Full access to your trading history</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Welcome */}
          <div className="flex justify-start mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--tool-accent-text)] px-1">COACH</span>
              <div className="bg-[var(--tool-accent-tint)] border border-[var(--tool-accent-border)] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                <p className="text-sm text-black leading-relaxed">{welcomeText}</p>
              </div>
            </div>
          </div>

          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} isLast={i === messages.length - 1} />
          ))}

          {loading && <TypingIndicator />}
          {error && <p className="text-center text-xs text-red-600 my-2 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask your coach... (Enter to send, Shift+Enter for newline)"
              rows={1}
              className="flex-1 resize-none px-4 py-3 rounded-xl border border-gray-200 text-sm text-black bg-white focus:outline-none focus:border-[var(--tool-accent)] focus:ring-1 focus:ring-[var(--tool-accent-border)] transition-all disabled:opacity-60 placeholder:text-gray-400"
            />
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--tool-accent)] hover:bg-[var(--tool-accent-hover)] text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[9px] text-gray-400 mt-1.5">Press Enter to send · Shift+Enter for a new line</p>
        </div>
      </div>
    </div>
  );
}
