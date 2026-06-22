"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SurvivalKitLessonContentProps {
  mdx: string;
}

export function SurvivalKitLessonContent({ mdx }: SurvivalKitLessonContentProps) {
  
  // Custom parser to split by custom block blocks
  const parseBlocks = (text: string) => {
    const blocks: any[] = [];
    const lines = text.split("\n");
    let currentBlock: string[] = [];
    let insideCustomBlock = false;
    let customBlockType = "";
    let customBlockLabel = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith(":::")) {
        if (insideCustomBlock) {
          // Close custom block
          const blockContent = currentBlock.join("\n");
          if (customBlockType === "comparison") {
            // Parse comparison blocks
            const parts = blockContent.split("===");
            const leftPart = parts[0] || "";
            const rightPart = parts[1] || "";

            const leftLines = leftPart.trim().split("\n");
            const leftLabel = leftLines[0]?.replace("---", "").trim() || "GAMBLER";
            const leftContent = leftLines.slice(1).join("\n").trim();

            const rightLines = rightPart.trim().split("\n");
            const rightLabel = rightLines[0]?.replace("---", "").trim() || "PROFESSIONAL";
            const rightContent = rightLines.slice(1).join("\n").trim();

            blocks.push({
              type: "comparison",
              leftLabel,
              leftContent,
              rightLabel,
              rightContent,
            });
          } else {
            blocks.push({
              type: "callout",
              calloutType: customBlockType,
              label: customBlockLabel || customBlockType.toUpperCase(),
              content: blockContent,
            });
          }
          currentBlock = [];
          insideCustomBlock = false;
        } else {
          // Save preceding markdown block
          if (currentBlock.length > 0) {
            blocks.push({ type: "markdown", content: currentBlock.join("\n") });
            currentBlock = [];
          }
          // Start custom block
          insideCustomBlock = true;
          const match = line.trim().match(/^:::(insight|warning|framework|drawdown|comparison)\s*(.*)?/);
          customBlockType = match ? match[1] : "insight";
          customBlockLabel = match && match[2] ? match[2].trim() : "";
        }
      } else {
        currentBlock.push(line);
      }
    }

    if (currentBlock.length > 0) {
      blocks.push({ type: "markdown", content: currentBlock.join("\n") });
    }

    return blocks;
  };

  const parsedBlocks = parseBlocks(mdx);

  return (
    <div className="space-y-6">
      <style>{`
        .prose-survival {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          line-height: 1.85;
          color: #E5E5E5;
          max-width: 680px;
        }
        .prose-survival h1, .prose-survival h2, .prose-survival h3, .prose-survival h4 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          text-transform: uppercase;
          color: #ffffff;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
          letter-spacing: 0.02em;
        }
        .prose-survival h2 { font-size: 1.4rem; }
        .prose-survival h3 { font-size: 1.15rem; color: #22C55E; }
        .prose-survival p { margin-bottom: 1.5rem; }
        .prose-survival strong { color: #ffffff; font-weight: 700; }
        .prose-survival a { color: #22C55E; text-decoration: underline; text-underline-offset: 3px; }
        .prose-survival a:hover { color: #1db053; }
        .prose-survival ul, .prose-survival ol { padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose-survival li { margin-bottom: 0.5rem; }
        .prose-survival hr { border-color: rgba(255,255,255,0.08); margin: 2.5rem 0; }
        .prose-survival table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        .prose-survival th {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          color: #6B7280;
          text-align: left;
          padding: 8px 12px;
          border-bottom: 1px solid #2A2A2A;
        }
        .prose-survival td {
          font-size: 14px;
          color: #ffffff;
          padding: 10px 12px;
          border-bottom: 1px solid #1A1A1A;
        }
        .prose-survival tr:nth-child(even) {
          background-color: #0D0D0D;
        }
      `}</style>

      {parsedBlocks.map((block, i) => {
        if (block.type === "markdown") {
          return (
            <div key={i} className="prose-survival">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {block.content}
              </ReactMarkdown>
            </div>
          );
        }

        if (block.type === "callout") {
          const isWarning = block.calloutType === "warning";
          const accentColor = isWarning ? "#F59E0B" : "#22C55E";
          return (
            <div 
              key={i} 
              className="p-5 bg-[#111111] border border-[#1E1E1E] rounded border-l-4 my-6 max-w-[680px]"
              style={{ borderLeftColor: accentColor }}
            >
              <span 
                className="text-[10px] font-mono uppercase tracking-widest block mb-2 font-bold"
                style={{ color: accentColor }}
              >
                {block.label}
              </span>
              <div className="text-sm text-[#9CA3AF] leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {block.content}
                </ReactMarkdown>
              </div>
            </div>
          );
        }

        if (block.type === "comparison") {
          return (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 max-w-[680px]">
              <div className="bg-[#111111] border border-[#1E1E1E] p-5 rounded">
                <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-widest block mb-2 font-bold">
                  {block.leftLabel}
                </span>
                <div className="text-sm text-white leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {block.leftContent}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="bg-[#111111] border border-[#1E1E1E] p-5 rounded border-l-2 border-l-[#22C55E]">
                <span className="text-[10px] font-mono text-[#22C55E] uppercase tracking-widest block mb-2 font-bold">
                  {block.rightLabel}
                </span>
                <div className="text-sm text-white leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {block.rightContent}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
