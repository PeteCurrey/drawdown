"use client";

import React, { useState } from "react";
import { Code, Copy, Check, X, ExternalLink } from "lucide-react";

interface EmbedWidgetModalProps {
  toolTitle: string;
  toolSlug: string;
  isOpen: boolean;
  onClose: () => void;
}

export const EmbedWidgetModal: React.FC<EmbedWidgetModalProps> = ({
  toolTitle,
  toolSlug,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const embedUrl = `https://drawdown.trading/calculators/${toolSlug}`;
  
  const iframeSnippet = `<iframe src="${embedUrl}?embed=true" width="100%" height="600" frameborder="0" title="${toolTitle} - Drawdown Trading" style="border: 1px solid #2A2F3E; border-radius: 12px;"></iframe>\n<p style="font-size: 12px; color: #8892B0; text-align: center; margin-top: 8px;">Powered by <a href="${embedUrl}" target="_blank" rel="noopener">Drawdown Trading ${toolTitle}</a></p>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-background-secondary border border-border-primary rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-accent/10 text-accent">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Embed {toolTitle}</h3>
            <p className="text-xs text-text-tertiary">
              Add this responsive calculator widget directly to your website or blog.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
            Embed Code (HTML)
          </label>
          <div className="relative">
            <textarea
              readOnly
              rows={5}
              value={iframeSnippet}
              className="w-full bg-background-primary border border-border-primary rounded-xl p-3 text-xs font-mono text-text-secondary focus:outline-none focus:border-accent"
            />
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-background-primary font-medium text-xs hover:bg-accent/90 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-background-primary/60 border border-border-primary/40 rounded-xl p-4 text-xs space-y-2">
          <h4 className="font-semibold text-text-primary flex items-center gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
            Embed Guidelines & Attribution Policy
          </h4>
          <ul className="text-text-tertiary space-y-1 list-disc list-inside">
            <li>The embed includes standard responsive styling for web and mobile viewports.</li>
            <li>Contains a transparent attribution link to the canonical methodology source on Drawdown Trading.</li>
            <li>Zero third-party tracking scripts or cookie collection in embedded state.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
