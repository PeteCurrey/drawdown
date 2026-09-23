import type { ReactNode } from "react";

/**
 * Embed layout — no site navigation, no footer, no marketing chrome.
 * Used exclusively for /embed/* routes intended for iframe embedding.
 */
export default function EmbedLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background-primary antialiased">
        {children}
      </body>
    </html>
  );
}
