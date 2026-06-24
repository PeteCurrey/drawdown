"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Copy, Check, Download, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OutputLanguage } from "@/types/algo-builder";
import { AlgoBuilderCourseBanner } from "@/components/courses/AlgoBuilderCourseBanner";

// ─── Design tokens — exact match to Trade Journal ─────────────────────────────
const C = "var(--tool-accent)";

// Lazy-load syntax highlighter to avoid SSR issues and reduce initial bundle
const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then(m => m.default ?? m.Prism),
  { ssr: false, loading: () => null }
);

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

// ─── Placeholder — sits inside dark code area ─────────────────────────────────
function CodePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center px-8">
      <div
        className="w-12 h-12 flex items-center justify-center text-2xl rounded-lg"
        style={{ backgroundColor: "#161b22", border: "1px solid #30363d", color: "#8b949e" }}
      >
        {"</>"}
      </div>
      <p className="text-[11px] font-mono text-[#8b949e]">
        // Your generated code will appear here
      </p>
      <p className="text-[9px] font-mono text-[#484f58]">
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
  const [copied, setCopied]               = useState(false);
  const [errorExpanded, setErrorExpanded] = useState(false);
  const [errorText, setErrorText]         = useState("");
  const [fixGenerating, setFixGenerating] = useState(false);
  const [hl, setHl]                       = useState<any>(null);
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

  const hlLang  = language === "pine_script" ? "javascript" : "python";
  const ext     = language === "pine_script" ? ".pine" : ".py";
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
      window.dispatchEvent(new CustomEvent("algo-code-fixed", { detail: fixed }));
      setErrorText("");
      setErrorExpanded(false);
    } finally {
      setFixGenerating(false);
    }
  }

  if (!visible) return null;

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ minHeight: 320 }}>

      {/* Toolbar — white header, Journal secondary button style */}
      {hasCode && !isGenerating && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-white">
          <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: C }}>
            Strategy v{generationVersion} · {language === "pine_script" ? "Pine Script v6" : "Python / Backtrader"}
          </span>
          <div className="flex items-center gap-1.5">
            {/* Copy — teal-tinted when active, outline otherwise */}
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all rounded-md"
              style={{
                backgroundColor: copied ? `${C}15` : "transparent",
                border: `1px solid ${copied ? C : "#e5e7eb"}`,
                color: copied ? C : "#6b7280",
              }}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            {/* Download — Journal secondary outline */}
            <button
              onClick={downloadCode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all rounded-md border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900"
            >
              <Download className="w-3 h-3" />
              {ext}
            </button>
            {/* Regenerate — Journal secondary outline */}
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider transition-all rounded-md border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-900"
            >
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </button>
            {/* Save — Violet primary (violet bg, white text) */}
            <button
              onClick={onLibraryOpen}
              className="px-3 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider transition-all rounded-md hover:opacity-90"
              style={{ backgroundColor: C, color: "#ffffff" }}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Course upsell banner */}
      {generationVersion >= 1 && !isGenerating && hasCode && (
        <div className="px-3 pt-3 bg-gray-50">
          <AlgoBuilderCourseBanner />
        </div>
      )}

      {/* Code area — intentionally dark (GitHub dark #0d1117 — VS Code aesthetic, expected by users) */}
      <div
        className="relative flex-1 overflow-auto mx-3 my-3 rounded-lg border border-[#30363d]"
        style={{ backgroundColor: "#0d1117", maxHeight: 480 }}
      >
        {isGenerating && !hasCode && <GeneratingAnim />}
        {!hasCode && !isGenerating && <CodePlaceholder />}

        {hasCode && (
          isGenerating ? (
            <pre
              className="p-4 text-xs font-mono text-[#c9d1d9] leading-relaxed overflow-auto whitespace-pre-wrap"
              style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
            >
              {code}
              <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ backgroundColor: C }} />
            </pre>
          ) : (
            hl ? (
              <SyntaxHighlighter
                language={hlLang}
                style={hl}
                customStyle={{
                  margin: 0,
                  padding: 16,
                  background: "#0d1117",
                  fontSize: 12,
                  lineHeight: 1.6,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
                showLineNumbers
                lineNumberStyle={{ color: "#484f58", fontSize: 10 }}
                wrapLongLines={false}
              >
                {code}
              </SyntaxHighlighter>
            ) : (
              <pre
                className="p-4 text-xs font-mono text-[#c9d1d9] leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
              >
                {code}
              </pre>
            )
          )
        )}
        <div ref={codeEndRef} />
      </div>

      {/* Error fix loop — white card treatment */}
      {hasCode && !isGenerating && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => setErrorExpanded(v => !v)}
            className="flex items-center justify-between w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
          >
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              🛠 Paste TradingView Compiler Error
            </span>
            {errorExpanded
              ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
              : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
          </button>

          {errorExpanded && (
            <div className="px-4 pb-4 space-y-3 bg-white">
              <p className="text-[10px] font-mono text-gray-500 pt-2">
                Paste the exact error message from TradingView or Backtrader — QuantCoder will return the corrected code.
              </p>
              <textarea
                value={errorText}
                onChange={e => setErrorText(e.target.value)}
                rows={4}
                placeholder={"e.g. line 47: Undeclared identifier 'ta' error(4003)"}
                className="w-full px-3 py-2.5 text-xs font-mono text-gray-900 outline-none resize-none rounded-lg placeholder:text-gray-300"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = C; e.currentTarget.style.boxShadow = `0 0 0 2px ${C}20`; }}
                onBlur={e =>  { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <button
                onClick={fixError}
                disabled={!errorText.trim() || fixGenerating}
                className="px-6 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-all disabled:opacity-40 rounded-lg hover:opacity-90"
                style={{ backgroundColor: C, color: "#ffffff" }}
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
