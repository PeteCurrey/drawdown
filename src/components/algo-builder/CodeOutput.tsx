"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Copy, Check, Download, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OutputLanguage } from "@/types/algo-builder";

const C = "#C8F135";

// Lazy-load syntax highlighter to avoid SSR issues and reduce initial bundle
const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then(m => m.default ?? m.Prism),
  { ssr: false, loading: () => null }
);
// atomOneDark loaded via useEffect below to avoid server import

// ─── Props ────────────────────────────────────────────────────────────────────
interface CodeOutputProps {
  code:              string;
  isGenerating:      boolean;
  language:          OutputLanguage;
  generationVersion: number;
  instrument:        string;
  description:       string;
  visible:           boolean;
  onRegenerate:      () => void;
  onLibraryOpen:     () => void;
}

// ─── Generating animation ─────────────────────────────────────────────────────
function GeneratingAnim() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="w-1.5 rounded-full animate-bounce"
            style={{
              height: 20 + (i % 3) * 8,
              backgroundColor: C,
              animationDelay: `${i * 0.12}s`,
              animationDuration: "0.7s",
            }}
          />
        ))}
      </div>
      <p className="text-[11px] font-mono" style={{ color: C }}>
        QuantCoder AI is generating your code…
      </p>
    </div>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────
function CodePlaceholder() {
  return (
    <div
      className="flex flex-col items-center justify-center h-64 gap-3 text-center px-8"
      style={{ backgroundColor: "#0D0D0D" }}
    >
      <div
        className="w-12 h-12 flex items-center justify-center text-2xl"
        style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A" }}
      >
        {"</>"}
      </div>
      <p className="text-[11px] font-mono text-text-tertiary">
        // Your generated code will appear here
      </p>
      <p className="text-[9px] font-mono text-text-tertiary/50">
        Fill out the composer and click Generate
      </p>
    </div>
  );
}

// ─── Main CodeOutput ──────────────────────────────────────────────────────────
export function CodeOutput({
  code, isGenerating, language, generationVersion,
  instrument, description, visible, onRegenerate, onLibraryOpen,
}: CodeOutputProps) {
  const [copied, setCopied]             = useState(false);
  const [errorExpanded, setErrorExpanded] = useState(false);
  const [errorText, setErrorText]       = useState("");
  const [fixGenerating, setFixGenerating] = useState(false);
  const [hl, setHl]                     = useState<any>(null);
  const codeEndRef = useRef<HTMLDivElement>(null);

  // Load highlight style
  useEffect(() => {
    import("react-syntax-highlighter/dist/esm/styles/hljs")
      .then(m => setHl(m.atomOneDark))
      .catch(() => {});
  }, []);

  // Auto-scroll to bottom during streaming
  useEffect(() => {
    if (isGenerating) {
      codeEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [code, isGenerating]);

  const hlLang = language === "pine_script" ? "javascript" : "python";
  const ext    = language === "pine_script" ? ".pine" : ".py";
  const hasCode = code.length > 0;

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadCode() {
    const blob = new Blob([code], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `drawdown_strategy_v${generationVersion}${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function fixError() {
    if (!errorText.trim() || !code) return;
    setFixGenerating(true);
    try {
      const res = await fetch("/api/algo-builder/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategyConfig: null,
          fixMode: true,
          errorText: errorText.trim(),
          originalCode: code,
          language,
        }),
        signal: AbortSignal.timeout(35_000),
      });
      if (!res.ok) return;
      const reader = res.body?.getReader();
      if (!reader) return;
      const dec = new TextDecoder();
      let fixed = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fixed += dec.decode(value, { stream: true });
      }
      // Replace code via parent: not directly possible, so we dispatch a custom event
      window.dispatchEvent(new CustomEvent("algo-code-fixed", { detail: fixed }));
      setErrorText("");
      setErrorExpanded(false);
    } finally {
      setFixGenerating(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="flex flex-col" style={{ border: "1px solid #222", minHeight: 320 }}>
      {/* Toolbar */}
      {hasCode && !isGenerating && (
        <div
          className="flex items-center justify-between px-3 py-2 border-b"
          style={{ backgroundColor: "#111", borderColor: "#222" }}
        >
          <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: C }}>
            Strategy v{generationVersion} · {language === "pine_script" ? "Pine Script v6" : "Python / Backtrader"}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all"
              style={{
                backgroundColor: copied ? `${C}20` : "#1A1A1A",
                border: `1px solid ${copied ? C : "#333"}`,
                color: copied ? C : "#888",
              }}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={downloadCode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all"
              style={{ backgroundColor: "#1A1A1A", border: "1px solid #333", color: "#888" }}
            >
              <Download className="w-3 h-3" />
              {ext}
            </button>
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all hover:border-[#C8F135] hover:text-[#C8F135]"
              style={{ backgroundColor: "#1A1A1A", border: "1px solid #333", color: "#888" }}
            >
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </button>
            <button
              onClick={onLibraryOpen}
              className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all"
              style={{ backgroundColor: C, color: "#000", fontWeight: 700 }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Code area */}
      <div className="relative flex-1 overflow-auto" style={{ backgroundColor: "#0D0D0D", maxHeight: 480 }}>
        {isGenerating && !hasCode && <GeneratingAnim />}

        {!hasCode && !isGenerating && <CodePlaceholder />}

        {hasCode && (
          isGenerating ? (
            // During streaming: plain pre for performance
            <pre
              className="p-4 text-xs font-mono text-text-secondary leading-relaxed overflow-auto whitespace-pre-wrap"
              style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
            >
              {code}
              <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ backgroundColor: C }} />
            </pre>
          ) : (
            // After streaming: syntax-highlighted
            hl ? (
              <SyntaxHighlighter
                language={hlLang}
                style={hl}
                customStyle={{
                  margin: 0,
                  padding: 16,
                  background: "#0D0D0D",
                  fontSize: 12,
                  lineHeight: 1.6,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
                showLineNumbers
                lineNumberStyle={{ color: "#333", fontSize: 10 }}
                wrapLongLines={false}
              >
                {code}
              </SyntaxHighlighter>
            ) : (
              <pre
                className="p-4 text-xs font-mono text-text-secondary leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
              >
                {code}
              </pre>
            )
          )
        )}
        <div ref={codeEndRef} />
      </div>

      {/* Error fix loop — collapsible */}
      {hasCode && !isGenerating && (
        <div style={{ borderTop: "1px solid #222" }}>
          <button
            onClick={() => setErrorExpanded(v => !v)}
            className="flex items-center justify-between w-full px-4 py-3 text-left"
            style={{ backgroundColor: "#111" }}
          >
            <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
              🛠 Paste TradingView Compiler Error
            </span>
            {errorExpanded
              ? <ChevronUp className="w-3.5 h-3.5 text-text-tertiary" />
              : <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />}
          </button>

          {errorExpanded && (
            <div className="px-4 pb-4 space-y-3" style={{ backgroundColor: "#0D0D0D" }}>
              <p className="text-[10px] font-mono text-text-tertiary pt-2">
                Paste the exact error message from TradingView or Backtrader — QuantCoder will return the corrected code.
              </p>
              <textarea
                value={errorText}
                onChange={e => setErrorText(e.target.value)}
                rows={4}
                placeholder={'e.g. line 47: Undeclared identifier \'ta\' error(4003)'}
                className="w-full px-3 py-2.5 text-xs font-mono text-text-primary outline-none resize-none"
                style={{
                  backgroundColor: "#0A0A0A",
                  border: "1px solid #2A2A2A",
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = C; }}
                onBlur={e =>  { e.currentTarget.style.borderColor = "#2A2A2A"; }}
              />
              <button
                onClick={fixError}
                disabled={!errorText.trim() || fixGenerating}
                className="px-6 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-all disabled:opacity-40"
                style={{ backgroundColor: C, color: "#000" }}
              >
                {fixGenerating ? "Fixing…" : "Fix Error with QuantCoder"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
