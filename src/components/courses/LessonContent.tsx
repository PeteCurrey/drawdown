"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface LessonContentProps {
  mdx: string;
}

// Parse :::tip / :::warning / :::important callout blocks from markdown
function parseCallouts(raw: string): string {
  return raw.replace(
    /:::(tip|warning|important)\n([\s\S]*?):::/g,
    (_, type, content) => {
      const label = type === "tip" ? "Pro Tip" : type === "warning" ? "Watch Out" : "Key Point";
      return `\n<div data-callout="${type}">\n\n**${label}**\n\n${content.trim()}\n\n</div>\n`;
    }
  );
}

export function LessonContent({ mdx }: LessonContentProps) {
  const processed = parseCallouts(mdx || DEFAULT_CONTENT);

  return (
    <div className="prose-lesson">
      <style>{`
        .prose-lesson {
          font-family: 'DM Sans', sans-serif;
          font-size: 17px;
          line-height: 1.8;
          color: var(--color-text-secondary, #a0a0a0);
          max-width: 680px;
        }
        .prose-lesson h1, .prose-lesson h2, .prose-lesson h3, .prose-lesson h4 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--color-text-primary, #f0f0f0);
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
          letter-spacing: 0.02em;
        }
        .prose-lesson h2 { font-size: 1.4rem; }
        .prose-lesson h3 { font-size: 1.15rem; color: #C8F135; }
        .prose-lesson p { margin-bottom: 1.2rem; }
        .prose-lesson strong { color: var(--color-text-primary, #f0f0f0); font-weight: 700; }
        .prose-lesson a { color: #C8F135; text-decoration: underline; text-underline-offset: 3px; }
        .prose-lesson a:hover { color: #b8e020; }
        .prose-lesson ul, .prose-lesson ol { padding-left: 1.5rem; margin-bottom: 1.2rem; }
        .prose-lesson li { margin-bottom: 0.4rem; }
        .prose-lesson hr { border-color: rgba(255,255,255,0.08); margin: 2.5rem 0; }
        .prose-lesson blockquote {
          border-left: 3px solid #C8F135;
          padding-left: 1rem;
          margin-left: 0;
          color: rgba(255,255,255,0.5);
          font-style: italic;
        }
        .prose-lesson img {
          width: 100%;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          margin: 1.5rem 0;
        }
        .prose-lesson pre {
          background: #0D0D0D;
          border: 1px solid rgba(200,241,53,0.15);
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          line-height: 1.7;
        }
        .prose-lesson code {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          color: #C8F135;
          background: rgba(200,241,53,0.08);
          padding: 0.15em 0.4em;
          border-radius: 4px;
        }
        .prose-lesson pre code {
          background: transparent;
          padding: 0;
          color: #e0e0e0;
        }
        /* Callout blocks */
        [data-callout="tip"] {
          border-left: 3px solid #22c55e;
          background: rgba(34,197,94,0.06);
          border-radius: 0 8px 8px 0;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
        }
        [data-callout="warning"] {
          border-left: 3px solid #f59e0b;
          background: rgba(245,158,11,0.06);
          border-radius: 0 8px 8px 0;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
        }
        [data-callout="important"] {
          border-left: 3px solid #C8F135;
          background: rgba(200,241,53,0.06);
          border-radius: 0 8px 8px 0;
          padding: 1rem 1.25rem;
          margin: 1.5rem 0;
        }
        [data-callout] strong:first-child {
          display: block;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
          font-family: 'DM Mono', monospace;
        }
        [data-callout="tip"] strong:first-child    { color: #22c55e; }
        [data-callout="warning"] strong:first-child { color: #f59e0b; }
        [data-callout="important"] strong:first-child { color: #C8F135; }
      `}</style>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Pass through div with data-callout (parsed from callout blocks)
          div: ({ node, ...props }) => <div {...props} />,
          // Images with optional caption
          img: ({ node, alt, src, ...props }) => (
            <figure>
              <img src={src} alt={alt} {...props} />
              {alt && <figcaption style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "-0.5rem" }}>{alt}</figcaption>}
            </figure>
          ),
        }}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}

// Placeholder content shown when a lesson has no content yet
const DEFAULT_CONTENT = `
## Content Coming Soon

This lesson is being prepared. Check back shortly — all lessons will be published before the course launch.

:::important
If you've purchased the course, you'll get an email when all content is live.
:::

In the meantime, here's what this lesson covers:

- The core concept in plain English
- A step-by-step walkthrough with screenshots
- Common mistakes and how to avoid them

Use the navigation below to explore other lessons that are already complete.
`;
